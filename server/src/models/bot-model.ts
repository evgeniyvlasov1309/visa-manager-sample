import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";
import { DateFormatter } from "../utils/dateFormatter";

export class Bot extends Model {
  declare id: number;
  declare country: string;
  declare apiKey: string;
  declare userId: number;
  declare createdAt: string;

  toDto() {
    return {
      id: this.id,
      country: this.country,
      apiKey: this.apiKey,
      userId: this.userId,
      createdAt: DateFormatter.formatClientDate(this.createdAt),
    };
  }
}

export const botModel = Bot.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    apiKey: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "bot",
  }
);
