import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Notification extends Model {
  declare id: number;
  declare delivered: boolean;
  declare title: string;
  declare description: string;
  declare message: string;
  declare recordStatus: string;
  declare payment: boolean;
  declare postPayment: boolean;
  declare paymentCode: number;
  declare userId: number;
  declare country: string;
  declare recordId: number;
  declare createdAt: string;

  toDto() {
    return {
      id: this.id,
      delivered: this.delivered,
      title: this.title,
      description: this.description,
      message: this.message,
      recordStatus: this.recordStatus,
      payment: this.payment,
      postPayment: this.postPayment,
      paymentCode: this.paymentCode,
      country: this.country,
      recordId: this.recordId,
      createdAt: this.createdAt,
    };
  }
}

export const notificationModel = Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    delivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    title: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
    },
    message: {
      type: DataTypes.TEXT,
    },
    recordStatus: {
      type: DataTypes.STRING,
    },
    payment: {
      type: DataTypes.BOOLEAN,
    },
    postPayment: {
      type: DataTypes.BOOLEAN,
    },
    paymentCode: {
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
    recordId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "notification",
  }
);
