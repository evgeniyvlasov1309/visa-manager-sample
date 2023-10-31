import { Op } from "sequelize";
import { User, userModel } from "../models/user-model";

export async function addRecordPermissionsCheck(userData: User, query = {}) {
  const filterValues: Record<string, any> = {
    ...query,
  };

  if (!userData.isAdmin) {
    filterValues.userId = userData.id;
  }

  if (userData.type === "company" && !userData.isAdmin) {
    const agencyUsers = await userModel.findAll({
      where: { agencyId: userData.id },
    });
    const ids = agencyUsers.map((a) => a.id).concat(userData.id);
    filterValues.userId = { [Op.in]: ids };
  }

  return filterValues;
}
