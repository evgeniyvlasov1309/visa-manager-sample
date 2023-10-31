import { DataTypes, Model } from "sequelize";
import { userPricesDefault } from "../constants/user-price";
import { sequelize } from "../utils/database";
import { Bot } from "./bot-model";
import { Notification } from "./notification-model";
import { Payment } from "./payment-model";
import { Record } from "./record-model";
import { Token } from "./token-model";
import { Withdrawal } from "./withdrawal-model";

export type UserDto = Pick<User, "id" | "email" | "isAdmin">;

export class User extends Model {
  declare id: number;
  declare email: string;
  declare password: string;
  declare type: string;
  declare avatar: string;
  declare companyName: string;
  declare companyAddress: string;
  declare registrationNumber: string;
  declare paymentAccount: string;
  declare bank: string;
  declare bankId: string;
  declare correspondentAccount: string;
  declare fio: string;
  declare address: string;
  declare phoneNumber: string;
  declare inn: string;
  declare contact: string;
  declare isAdmin: boolean;
  declare isActivated: boolean;
  declare activationLink: string;
  declare resetPasswordToken: string;
  declare vip: boolean;
  declare telegram: string;
  declare commissionPercentage: number;
  declare secretFields: string;
  declare paymentMethod: string;
  declare discussedPrice: number;
  declare permanentFields: string;
  declare prices: string;
  declare employees: string;
  declare agencyId: number;
  declare notificationEmail: string;
  declare notificationEmailEnabled: boolean;
  declare notificationTelegram: string;
  declare notificationTelegramEnabled: boolean;
  declare createdAt: string;
  declare telegramChatId: number;

  toDto() {
    return {
      id: this.id,
      email: this.email,
      type: this.type,
      isAdmin: this.isAdmin,
      avatar: this.avatar,
      companyName: this.companyName,
      companyAddress: this.companyAddress,
      registrationNumber: this.registrationNumber,
      paymentAccount: this.paymentAccount,
      bank: this.bank,
      bankId: this.bankId,
      correspondentAccount: this.correspondentAccount,
      fio: this.fio,
      address: this.address,
      phoneNumber: this.phoneNumber,
      inn: this.inn,
      contact: this.contact,
      vip: this.vip,
      telegram: this.telegram,
      commissionPercentage: this.commissionPercentage,
      secretFields: this.secretFields,
      paymentMethod: this.paymentMethod,
      discussedPrice: this.discussedPrice,
      permanentFields: this.permanentFields,
      prices: this.prices,
      employees: this.employees,
      agencyId: this.agencyId,
      notificationEmail: this.notificationEmail,
      notificationEmailEnabled: this.notificationEmailEnabled,
      notificationTelegram: this.notificationTelegram,
      notificationTelegramEnabled: this.notificationTelegramEnabled,
      createdAt: this.createdAt,
    };
  }
}

export const userModel = User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    companyName: {
      type: DataTypes.STRING,
    },
    companyAddress: {
      type: DataTypes.STRING,
    },
    registrationNumber: {
      type: DataTypes.STRING,
    },
    paymentAccount: {
      type: DataTypes.STRING,
    },
    bank: {
      type: DataTypes.STRING,
    },
    bankId: {
      type: DataTypes.STRING,
    },
    correspondentAccount: {
      type: DataTypes.STRING,
    },
    inn: {
      type: DataTypes.STRING,
    },
    fio: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    contact: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.TEXT,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActivated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationLink: {
      type: DataTypes.STRING,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },
    vip: {
      type: DataTypes.BOOLEAN,
    },
    telegram: {
      type: DataTypes.STRING,
    },
    commissionPercentage: {
      type: DataTypes.INTEGER,
    },
    discussedPrice: {
      type: DataTypes.INTEGER,
    },
    secretFields: {
      type: DataTypes.JSON,
    },
    permanentFields: {
      type: DataTypes.JSON,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      defaultValue: "cash",
    },
    prices: {
      type: DataTypes.JSON,
      defaultValue: userPricesDefault,
    },
    employees: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    notificationEmail: {
      type: DataTypes.STRING,
    },
    notificationEmailEnabled: {
      type: DataTypes.BOOLEAN,
    },
    notificationTelegram: {
      type: DataTypes.STRING,
    },
    notificationTelegramEnabled: {
      type: DataTypes.BOOLEAN,
    },
    agencyId: {
      type: DataTypes.INTEGER,
    },
    telegramChatId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

User.hasOne(Token);
User.hasMany(Record);
User.hasMany(Payment);
User.hasMany(Bot);
User.hasMany(Withdrawal);
User.hasMany(Notification);
