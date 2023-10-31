import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { DateFormatter } from "../utils/dateFormatter";
import { Applicant } from "./applicant-model";
// export type RecordDto = Pick<Record, "id" | "email">;

export class Record extends Model {
  declare id: number;
  declare userId: number;
  declare surname: string;
  declare firstName: string;
  declare phoneNumber: string;
  declare residenceCountry: string;
  declare destinationCountry: string;
  declare visaCenter: string;
  declare visaCategory: string;
  declare visaSubcategory: string;
  declare status: string;
  declare payment: boolean;
  declare postPayment: boolean;
  declare recordingDate: string;
  declare recordingDateFrom: Date;
  declare recordingDateTo: Date;
  declare enableRecordingDateFrom: boolean;
  declare enableRecordingDateTo: boolean;
  declare enableRecordingDateOffset: boolean;
  declare recordingDateOffset: string;
  declare email: string;
  declare agent: string;
  declare confirmationFile: Buffer | null;
  declare city: string;
  declare createdAt: string;
  declare updatedAt: string;
  declare cities: string[];
  declare login: string;
  declare password: string;
  declare comment: string;
  declare botId: number | null;
  declare lastRequestedAt: string;
  declare errorMessage: string;
  declare proxy: string;
  declare paidToBotOwnerStatus: string;
  declare botOwner: string;
  declare withdrawalId: number;
  declare commentForBotOwner: string;
  declare paymentCode: number;
  declare paymentType: string;
  declare type: string;
  declare ignoreSecretFields: boolean;
  declare recordCategory: string;
  declare deleteDate: Date | null;

  toDto(isAdmin?: boolean, isBot?: boolean) {
    if (isBot) {
      switch (this.destinationCountry) {
        case "Ch":
          return this.toChinaBotDto();
        case "Fr":
          return this.toFranceBotDto();
        case "Sp":
          return this.toSpainBotDto();
        case "Usa":
          return this.toUsaBotDto();
        default:
          return null;
      }
    }

    let result = {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      phoneNumber: this.phoneNumber,
      residenceCountry: this.residenceCountry,
      destinationCountry: this.destinationCountry,
      visaCenter: this.visaCenter,
      visaCategory: this.visaCategory,
      visaSubcategory: this.visaSubcategory,
      status: this.status,
      email: this.email,
      recordCategory: this.recordCategory,
      recordingDate: DateFormatter.formatClientDate(this.recordingDate),
      recordingDateFrom: this.recordingDateFrom,
      recordingDateTo: this.recordingDateTo,
      enableRecordingDateFrom: this.enableRecordingDateFrom,
      enableRecordingDateTo: this.enableRecordingDateTo,
      enableRecordingDateOffset: this.enableRecordingDateOffset,
      recordingDateOffset: this.recordingDateOffset,
      visaTypeId: this.visaCategory,
      city: this.city,
      confirmationFile: this.confirmationFile?.toString("base64") ?? null,
      cities: this.cities,
      login: this.login,
      password: this.password,
      comment: this.comment,
      commentForBotOwner: this.commentForBotOwner,
      lastRequestedAt: this.lastRequestedAt,
      errorMessage: this.errorMessage,
      proxy: this.proxy,
      type: this.type,
      agent: this.agent,
      deleteDate: this.deleteDate,
    };

    if (!isBot) {
      result = Object.assign(result, {
        userId: this.userId,
        payment: this.payment,
        new: new Date().getTime() - new Date(this.createdAt).getTime() < 300000,
        postPayment: this.postPayment,
        paidToBotOwnerStatus: this.paidToBotOwnerStatus,
        botOwner: this.botOwner,
        withdrawalId: this.withdrawalId,
        paymentCode: this.paymentCode,
        paymentType: this.paymentType,
        createdAt: DateFormatter.formatClientDate(this.createdAt),
        updatedAt: DateFormatter.formatClientDate(this.updatedAt),
      });
    }

    return result;
  }

  toChinaBotDto() {
    let result = {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      residenceCountry: this.residenceCountry,
      destinationCountry: this.destinationCountry,
      status: this.status,
      recordingDateFrom: DateFormatter.getDateWithoutTime(
        this.recordingDateFrom
      ),
      recordingDateTo: DateFormatter.getDateWithoutTime(this.recordingDateTo),
      recordingDateOffset: this.recordingDateOffset,
      city: this.city,
      errorMessage: this.errorMessage,
      type: this.type,
    };

    return result;
  }

  toFranceBotDto() {
    let result = {
      id: this.id,
      residenceCountry: this.residenceCountry,
      destinationCountry: this.destinationCountry,
      visaCenter: this.visaCenter,
      visaCategory: this.visaCategory,
      visaSubcategory: this.visaSubcategory,
      status: this.status,
      recordingDateFrom: DateFormatter.getDateWithoutTime(
        this.recordingDateFrom
      ),
      recordingDateTo: DateFormatter.getDateWithoutTime(this.recordingDateTo),
      recordingDateOffset: this.recordingDateOffset,
      errorMessage: this.errorMessage,
    };

    return result;
  }

  toSpainBotDto() {
    let result = {
      id: this.id,
      residenceCountry: this.residenceCountry,
      destinationCountry: this.destinationCountry,
      visaCenter: this.visaCenter,
      visaCategory: this.visaCategory,
      status: this.status,
      recordCategory: this.recordCategory,
      recordingDateFrom: DateFormatter.getDateWithoutTime(
        this.recordingDateFrom
      ),
      recordingDateTo: DateFormatter.getDateWithoutTime(this.recordingDateTo),
      recordingDateOffset: this.recordingDateOffset,
      errorMessage: this.errorMessage,
    };

    return result;
  }

  toUsaBotDto() {
    let result = {
      id: this.id,
      residenceCountry: this.residenceCountry,
      destinationCountry: this.destinationCountry,
      visaCenter: this.visaCenter,
      status: this.status,
      email: this.email,
      recordingDateFrom: DateFormatter.getDateWithoutTime(
        this.recordingDateFrom
      ),
      recordingDateTo: DateFormatter.getDateWithoutTime(this.recordingDateTo),
      recordingDateOffset: this.recordingDateOffset,
      cities: this.cities,
      login: this.login,
      password: this.password,
      errorMessage: this.errorMessage,
    };

    return result;
  }
}

export const recordModel = Record.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    surname: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    agent: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    residenceCountry: {
      type: DataTypes.STRING,
    },
    destinationCountry: {
      type: DataTypes.STRING,
    },
    visaCenter: {
      type: DataTypes.STRING,
    },
    visaCategory: {
      type: DataTypes.STRING,
    },
    visaSubcategory: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    postPayment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    recordingDate: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    serviceAccountLogin: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    serviceAccountPassword: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    recordEmail: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    enableRecordingDateFrom: {
      type: DataTypes.BOOLEAN,
    },
    enableRecordingDateTo: {
      type: DataTypes.BOOLEAN,
    },
    enableRecordingDateOffset: {
      type: DataTypes.BOOLEAN,
    },
    recordingDateFrom: {
      type: DataTypes.DATE,
    },
    recordingDateTo: {
      type: DataTypes.DATE,
    },
    recordingDateOffset: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    confirmationFile: {
      type: DataTypes.BLOB,
    },
    cities: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    login: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    botId: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    lastRequestedAt: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.STRING,
    },
    errorMessage: {
      type: DataTypes.STRING,
    },
    paidToBotOwnerStatus: {
      type: DataTypes.STRING,
      defaultValue: "not-paid",
    },
    proxy: {
      type: DataTypes.STRING,
    },
    botOwner: {
      type: DataTypes.STRING,
    },
    withdrawalId: {
      type: DataTypes.NUMBER,
    },
    commentForBotOwner: {
      type: DataTypes.STRING,
    },
    paymentCode: {
      type: DataTypes.NUMBER,
    },
    paymentType: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    ignoreSecretFields: {
      type: DataTypes.BOOLEAN,
    },
    recordCategory: {
      type: DataTypes.STRING,
    },
    deleteDate: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "record",
  }
);

export interface RecordRaw {
  id: number;
  residenceCountry: string;
  destinationCountry: string;
  visaCenter: string;
  visaCategory: string;
  recordingDate: string;
  status: string;
  visaSubcategory: string;
  applicants: Applicant[];
  confirmationFile: string;
  postPayment: boolean;
  payment: boolean;
  errorMessage: string;
  deleteDate: Date | null;
  botOwner: string;
}

recordModel.hasMany(Applicant, { as: "applicants", foreignKey: "recordId" });
