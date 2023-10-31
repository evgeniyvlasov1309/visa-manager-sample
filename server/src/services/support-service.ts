import ejs from "ejs";
import path from "path";
import {
  SupportTicket,
  supportTicketModel,
} from "../models/support-ticket-model";
import { EmailService } from "./email-service";

export class SupportService {
  static async createSupportTicket(supportTicketData: SupportTicket) {
    await supportTicketModel.create({
      ...supportTicketData,
    });

    const html = await ejs.renderFile(
      path.join(__dirname, "../../", "public", "mails", "support-ticket.ejs"),
      {
        data: supportTicketData,
      }
    );

    EmailService.sendMessageToAdmins(html, "Новый запрос в службу поддержки");
  }
}
