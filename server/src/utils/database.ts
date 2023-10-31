import { Dialect, Sequelize } from "sequelize";
import keys from "../keys";

export const sequelize = new Sequelize("visa_manager", keys.pgUser!, keys.pgPassword, {
    host: keys.pgHost,
    port: parseInt(keys.pgPort || ""),
    dialect: keys.pgDatabase as Dialect,
  });