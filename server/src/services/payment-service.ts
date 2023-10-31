import ejs from "ejs";
import path from "path";
import { Op } from "sequelize";
import { ApiError } from "../exceptions/api-error";
import { paymentModel } from "../models/payment-model";
import { recordModel } from "../models/record-model";
import { User } from "../models/user-model";
import { checkPay, roboKassa } from "../utils/robokassa";
import { EmailService } from "./email-service";
import { PriceService } from "./price-service";

interface PaymentRequest {
  type: "cash" | "card";
  selected: number[];
  code: number;
  comment: string;
}

export class PaymentService {
  static async createPayment(data: PaymentRequest, user: User) {
    const { type, code, comment, selected } = data;

    const conditions: any = {
      payment: false,
      userId: user?.id,
    };

    if (selected.length) {
      conditions.id = {
        [Op.in]: selected,
      };
    }

    const unpaidRecords = await recordModel.findAll({
      where: conditions,
    });

    const recordPrices = await Promise.all(
      unpaidRecords.map((r) => {
        return PriceService.getRecordPrice(r.id);
      })
    );

    const amount = recordPrices.reduce((acc, curr) => acc + curr, 0);

    const description = "Оплата записи";

    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    const payment = await paymentModel.create({
      type,
      code,
      amount,
      description,
      comment,
      records: unpaidRecords.map((item) => item.id),
      userId: user?.id,
    });

    await payment.update({ number: `${day}${month}-${user.id}-${payment.id}` });

    if (type === "cash") {
      await Promise.all(
        unpaidRecords.map((rec) =>
          rec.update({ paymentCode: code, paymentType: type })
        )
      );

      const html = await ejs.renderFile(
        path.join(__dirname, "../../", "public", "mails", "new-payment.ejs"),
        {
          data: payment,
        }
      );

      EmailService.sendMessageToAdmins(html, "Новая оплата в кассу");
    }

    const url = roboKassa.generateUrl(
      payment.id,
      user?.email,
      amount,
      description
    );

    return { url };
  }

  static async checkPayment(
    InvId: number,
    OutSum: string,
    SignatureValue: string
  ) {
    const payment = await paymentModel.findOne({ where: { id: InvId } });

    if (!payment) {
      throw ApiError.BadRequest(`Оплата не найдена`);
    }

    const isPaymentValid = checkPay(InvId, OutSum, SignatureValue);

    payment.signature = SignatureValue;

    if (isPaymentValid) {
      payment.status = "completed";
      await payment.save();

      const records = await Promise.all(
        payment.records.map((id) => recordModel.findByPk(id))
      );

      await Promise.all(
        records.map((record) => {
          if (record) {
            record.payment = true;
            record.deleteDate = null;
            record.save();
          }
        })
      );
    } else {
      payment.status = "error";
      await payment.save();
    }
  }
}
