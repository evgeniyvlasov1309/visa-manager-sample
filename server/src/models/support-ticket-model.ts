import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class SupportTicket extends Model {
  declare firstName: string;
  declare surname: string;
  declare email: string;
  declare phoneNumber: string;
  declare comment: string;
}

export const supportTicketModel = SupportTicket.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    surname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "supportTicket",
  }
);
