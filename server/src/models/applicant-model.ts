import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
// export type RecordDto = Pick<Record, "id" | "email">;

export class Applicant extends Model {
  declare id: number;
  declare recordId: number;
  declare surname: string;
  declare firstName: string;
  declare gender: string;
  declare dateOfBirth: string;
  declare citizenship: string;
  declare passportNumber: string;
  declare passportExpireDate: string;
  declare phoneNumber: string;
  declare recordingDateFrom: string;
  declare recordingDateTo: string;
  declare passportType: string;
  declare passportDateOfIssue: string;
  declare passportPlaceOfIssue: string;
  declare applicationNumber: string;
  declare error: string;

  toDto(isBot?: boolean, destinationCountry?: string) {
    if (isBot) {
      switch (destinationCountry) {
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

    return {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth?.slice(0, 10) ?? null,
      citizenship: this.citizenship,
      passportNumber: this.passportNumber,
      phoneNumber: this.phoneNumber,
      passportType: this.passportType,
      applicationNumber: this.applicationNumber,
      passportDateOfIssue: this.passportDateOfIssue?.slice(0, 10) ?? null,
      passportExpireDate: this.passportExpireDate?.slice(0, 10) ?? null,
      passportPlaceOfIssue: this.passportPlaceOfIssue,
      error: this.error,
    };
  }

  toChinaBotDto() {
    return {
      id: this.id,
      applicationNumber: this.applicationNumber,
      passportNumber: this.passportNumber,
      error: this.error,
    };
  }

  toFranceBotDto() {
    return {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth?.slice(0, 10) ?? null,
      citizenship: this.citizenship,
      passportNumber: this.passportNumber,
      phoneNumber: this.phoneNumber,
      passportExpireDate: this.passportExpireDate?.slice(0, 10) ?? null,
      error: this.error,
    };
  }

  toSpainBotDto() {
    return {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      gender: this.gender,
      dateOfBirth: this.dateOfBirth?.slice(0, 10) ?? null,
      citizenship: this.citizenship,
      passportNumber: this.passportNumber,
      phoneNumber: this.phoneNumber,
      passportType: this.passportType,
      passportDateOfIssue: this.passportDateOfIssue?.slice(0, 10) ?? null,
      passportExpireDate: this.passportExpireDate?.slice(0, 10) ?? null,
      passportPlaceOfIssue: this.passportPlaceOfIssue,
      error: this.error,
    };
  }

  toUsaBotDto() {
    return {
      id: this.id,
      surname: this.surname,
      firstName: this.firstName,
      passportNumber: this.passportNumber,
      phoneNumber: this.phoneNumber,
      applicationNumber: this.applicationNumber,
      error: this.error,
    };
  }
}

export const applicantModel = Applicant.init(
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
    gender: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
    },
    citizenship: {
      type: DataTypes.STRING,
    },
    passportType: {
      type: DataTypes.STRING,
    },
    passportNumber: {
      type: DataTypes.STRING,
    },
    passportExpireDate: {
      type: DataTypes.STRING,
    },
    passportPlaceOfIssue: {
      type: DataTypes.STRING,
    },
    passportDateOfIssue: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    applicationNumber: {
      type: DataTypes.STRING,
    },
    error: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "applicant",
  }
);

export interface Applicant {
  surname: string;
  firstName: string;
  gender: string;
  dateOfBirth: string;
  citizenship: string;
  passportNumber: string;
  passportExpireDate: string;
  phoneNumber: string;
  email: string;
}
