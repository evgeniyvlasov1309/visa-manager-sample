import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Payment extends Model {
  declare id: number;
  declare amount: number;
  declare description: number;
  declare records: number[];
  declare code: number;
  declare comment: string;
  declare type: string;
  declare status: string;
  declare signature: string;

  toDto() {
    return {
      id: this.id,
      amount: this.id,
      description: this.description,
      code: this.code,
      comment: this.comment,
      type: this.type,
      records: this.records,
      status: this.status,
      signature: this.signature,
    };
  }
}

export const paymentModel = Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "created",
    },
    records: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    signature: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.NUMBER,
    },
    comment: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "payment",
  }
);
