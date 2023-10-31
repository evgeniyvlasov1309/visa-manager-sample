import { DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/database";

export class Price extends Model {
  declare id: number;
  declare label: string;
  declare value: string;
  declare priceStandardCapital: number;
  declare priceStandardRegion: number;
  declare priceVipCapital: number;
  declare priceVipRegion: number;
  declare capitals: string[];

  toDto() {
    return {
      id: this.id,
      label: this.label,
      value: this.value,
      priceStandardCapital: this.priceStandardCapital,
      priceStandardRegion: this.priceStandardRegion,
      priceVipCapital: this.priceVipCapital,
      priceVipRegion: this.priceVipRegion,
      capitals: this.capitals,
    };
  }
}

export const priceModel = Price.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    label: {
      type: DataTypes.STRING,
    },
    value: {
      type: DataTypes.STRING,
    },
    priceStandardCapital: {
      type: DataTypes.INTEGER,
    },
    priceStandardRegion: {
      type: DataTypes.INTEGER,
    },
    priceVipCapital: {
      type: DataTypes.INTEGER,
    },
    priceVipRegion: {
      type: DataTypes.INTEGER,
    },
    capitals: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
  },
  {
    sequelize,
    modelName: "price",
  }
);
