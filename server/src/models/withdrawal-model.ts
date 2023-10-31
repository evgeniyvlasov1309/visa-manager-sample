import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Withdrawal extends Model {
  declare id: number;
  declare amount: number;
  declare status: string;
  declare records: number[];
  declare adminComment: string;
  declare userId: number;
  declare createdAt: string;
  declare userEmail: string;

  toDto() {
    return {
      id: this.id,
      amount: this.amount,
      status: this.status,
      records: this.records,
      adminComment: this.adminComment,
      createdAt: this.createdAt,
      userId: this.userId,
      userEmail: this.userEmail,
    };
  }
}

export const withdrawalModel = Withdrawal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    records: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
    },
    adminComment: {
      type: DataTypes.STRING,
    },
    userEmail: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "withdrawal",
  }
);
