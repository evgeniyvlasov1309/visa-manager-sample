import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Token extends Model {
  declare refreshToken: string;
  declare userId: number;
}

export const tokenModel = Token.init(
  {
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "token",
  }
);
