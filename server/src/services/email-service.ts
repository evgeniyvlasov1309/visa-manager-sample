import nodemailer from "nodemailer";
import { userModel } from "../models/user-model";

export class EmailService {
  static transporter: nodemailer.Transporter;

  static async sendMessageToAdmins(html: string, subject: string) {
    const admins = await userModel.findAll({
      where: { isAdmin: true },
    });

    await Promise.all(
      admins.map((admin) => {
        return EmailService.transporter
          .sendMail({
            from: "no-reply@visabroker.ru",
            to: admin.email,
            subject,
            html: html,
          })
          .catch((err) => {
            console.log("Ошибка при отправке email", err);
          });
      })
    );
  }

  static async sendMessageToUser(
    userId: number,
    html: string,
    subject: string
  ) {
    const user = await userModel.findByPk(userId);

    if (!user) return;

    EmailService.transporter
      .sendMail({
        from: "no-reply@visabroker.ru",
        to: user.email,
        subject,
        html: html,
      })
      .catch((err) => {
        console.log("Ошибка при отправке email", err);
      });
  }
}
