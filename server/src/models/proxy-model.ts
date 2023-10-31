import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Proxy extends Model {
  declare id: number;
  declare data: string;

  toDto() {
    return {
      id: this.id,
      data: this.data,
    };
  }
}

export const proxyModel = Proxy.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "proxy",
  }
);
