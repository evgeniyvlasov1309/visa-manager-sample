import { applicantModel } from "../models/applicant-model";
import { Record } from "../models/record-model";
import { formatNumberWithSpaces } from "../utils/formatService";
import { NotificationService } from "./notification-service";
import { PriceService } from "./price-service";

export enum NotificationMessages {
  RECORD_ERROR_30 = "Обновите данные для продолжения записи. В противном случае через 30 дней запись будет удалена",
  RECORD_ERROR_15 = "Обновите данные для продолжения записи или удалите запись. В противном случае, через 15 дней запись будет удалена",
  RECORD_ERROR_1 = "Запись будет удалена завтра",
  RECORD_NO_PAYMENT_15 = "Оплатите заявку для начала записи. В противном случае заявка будет удалена через 15 дней",
  RECORD_NO_PAYMENT_10 = "Оплатите заявку для начала записи. В противном случае заявка будет удалена через 10 дней",
  RECORD_NO_PAYMENT_5 = "Оплатите заявку для начала записи. В противном случае заявка будет удалена через 5 дней",
  RECORD_NO_PAYMENT_1 = "Оплатите заявку для начала записи. В противном случае заявка будет удалена завтра",
  RECORD_REMOVED = "Ваша заявка удалена из системы в связи с не активностью",
  RECORD_SUCCESS = "Записан на подачу",
  RECORD_SUCCESS_POSTPAYMENT_30 = "Записан на подачу. Пожалуйста, произведите оплату, в противном случае запись будет удалена",
  RECORD_SUCCESS_POSTPAYMENT_27 = "Оплата не поступила. Пожалуйста, произведите оплату, в противном случае запись будет удалена на 30 день, но не позднее, чем за сутки до наступления записи",
  RECORD_SUCCESS_POSTPAYMENT_24 = "Оплата не поступила. Пожалуйста, произведите оплату, в противном случае запись будет удалена на 30 день, но не позднее, чем за сутки до наступления записи",
  RECORD_SUCCESS_POSTPAYMENT_20 = "Оплата не поступила. Пожалуйста, произведите оплату, в противном случае запись будет удалена на 30 день, но не позднее, чем за сутки до наступления записи",
  RECORD_SUCCESS_POSTPAYMENT_15 = "Оплата не поступила. Пожалуйста, произведите оплату, в противном случае запись будет удалена на 30 день, но не позднее, чем за сутки до наступления записи",
  RECORD_SUCCESS_POSTPAYMENT_10 = "Оплата не поступила. Пожалуйста, произведите оплату, в противном случае запись будет удалена на 30 день, но не позднее, чем за сутки до наступления записи",
  RECORD_SUCCESS_POSTPAYMENT_1 = "Оплата не поступила. Завтра [DD.MM.YY] запись подлежит удалению",
  RECORD_DATE_EXPIRED_10 = "Запись приостановлена, расширьте интервал дат записи. В противном случае запись удалится через 10 дней",
  RECORD_DATE_EXPIRED_1 = "Завтра запись будет удалена",
}

enum Countries {
  Sp = "Испания",
  Fr = "Франция",
  Ch = "Китай",
  Usa = "Сша",
}

function getCountryLabel(countryCode: string) {
  switch (countryCode) {
    case "Sp":
      return Countries.Sp;
    case "Fr":
      return Countries.Fr;
    case "Ch":
      return Countries.Ch;
    case "Usa":
      return Countries.Usa;
  }
}

export class RecordNotificationService {
  static async createNotification(record: Record, message: string) {
    const recordData = record.toDto(true, false);

    const applicants = await applicantModel.findAll({
      where: { recordId: recordData?.id },
    });

    const recordPrice = await PriceService.getRecordPrice(record.id);

    const title = `${applicants[0].firstName} ${applicants[0].surname}${
      applicants.length > 1 ? " (Группа)," : ","
    } ID записи 000${recordData?.id}`;

    const description = `Страна: ${getCountryLabel(
      recordData?.destinationCountry || ""
    )}, паспорт №${
      applicants[0].passportNumber
    }, сумма: ${formatNumberWithSpaces(recordPrice)} р.`;

    const notificationData = {
      title,
      description,
      message,
      country: recordData?.destinationCountry,
      delivered: false,
      recordStatus: record.status,
      payment: record.payment,
      postPayment: record.postPayment,
      paymentCode: record.paymentCode,
      recordId: record.id,
      userId: record.userId,
    };

    await NotificationService.createNotification(notificationData);
  }
}
