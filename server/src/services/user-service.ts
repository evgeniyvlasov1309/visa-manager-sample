import { compare, hash } from "bcrypt";
import ejs from "ejs";
import path from "path";
import QueryString from "qs";
import { Op } from "sequelize";
import { ApiError } from "../exceptions/api-error";
import { applicantModel } from "../models/applicant-model";
import { botModel } from "../models/bot-model";
import { priceModel } from "../models/price-model";
import { recordModel } from "../models/record-model";
import { User, userModel } from "../models/user-model";
import { BotOwnerStatictic } from "../types/BotOwnerStatictic";
import { EmailService } from "./email-service";
import { TokenService } from "./token-service";

export class UserService {
  static async registration(email: string, password: string) {
    const candidate = await userModel.findOne({
      where: { email },
    });

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с таким email уже существует`);
    }

    const hashPassword = await hash(password, 3);
    const user = await userModel.create({
      email,
      password: hashPassword,
    });

    const userDto = user.toDto();
    const tokens = await TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    user.activationLink = tokens.accessToken;

    await user.save();

    const html = await ejs.renderFile(
      path.join(__dirname, "../../", "public", "mails", "registration.ejs"),
      {
        url: `${process.env.API_URL}/activation?activationLink=${user.activationLink}`,
      }
    );

    await EmailService.transporter.sendMail({
      from: "no-reply@visabroker.ru",
      to: user.email,
      subject: "Спасибо за регистрацию",
      html: html,
    });

    return {
      ...tokens,
      user: userDto,
    };
  }

  static async activation(activationLink: string) {
    const user = await userModel.findOne({
      where: { activationLink },
    });

    if (!user) {
      throw ApiError.BadRequest(`Ошибка при подтверждении почты`);
    }

    user.isActivated = true;

    await user.save();
  }

  static async resetPasswordLink(email: string) {
    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email не найден`);
    }

    const userDto = user.toDto();
    const tokens = await TokenService.generateTokens({ ...userDto });

    user.resetPasswordToken = tokens.accessToken;

    await user.save();

    const html = await ejs.renderFile(
      path.join(__dirname, "../../", "public", "mails", "reset-password.ejs"),
      {
        url: `${process.env.URL}/reset-password?token=${user.resetPasswordToken}`,
      }
    );

    await EmailService.transporter.sendMail({
      from: "no-reply@visabroker.ru",
      to: user.email,
      subject: "Восстановление пароля",
      html: html,
    });
  }

  static async resetPassword(password: string, token: string) {
    const user = await userModel.findOne({
      where: { resetPasswordToken: token },
    });

    if (!user || !token) {
      throw ApiError.BadRequest(`Неверная ссылка`);
    }

    const hashPassword = await hash(password, 3);

    user.password = hashPassword;
    user.resetPasswordToken = "";
    await user.save();
  }

  static async changePassword(id: number, password: string) {
    const user = await userModel.findOne({
      where: { id },
    });

    if (!user) return;

    const hashPassword = await hash(password, 3);

    user.password = hashPassword;
    user.resetPasswordToken = "";
    await user.save();
  }

  static async login(email: string, password: string) {
    const user = await userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw ApiError.BadRequest(`Пользователь с таким email не найден`);
    }

    if (!user.isActivated) {
      throw ApiError.BadRequest(`Необходимо подтвердить почту`);
    }

    const isPassEquals = await compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }
    const userDto = user.toDto();
    const tokens = await TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  static async logout(refreshToken: string) {
    await TokenService.removeToken(refreshToken);
  }

  static async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await userModel.findByPk(tokenFromDb.userId);

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userDto = user.toDto();
    const tokens = await TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  static async getUsers(query: QueryString.ParsedQs) {
    let {
      sort = "createdAt_ASC",
      search,
      offset,
      limit,
      ...queryParams
    } = query;

    const [sortName, sortMethod] = (sort as string).split("_");

    let users;

    let whereConditions = {
      ...queryParams,
    };

    if (search) {
      whereConditions = {
        ...whereConditions,
        [Op.or]: [
          {
            fio: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            companyName: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.iLike]: "%" + search + "%",
            },
          },
          {
            phoneNumber: {
              [Op.iLike]: "%" + search + "%",
            },
          },
        ],
      };
    }

    if (offset && limit) {
      users = await userModel.findAndCountAll({
        where: whereConditions,
        offset: offset ? parseInt(offset as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        order: [[sortName, sortMethod]],
      });
    } else {
      users = await userModel.findAll();
      users = users.map((user) => user.toDto());
      return users;
    }

    return {
      count: users.count,
      rows: users.rows.map((user) => user.toDto()),
    };
  }

  static async getUser(id: string) {
    const user = await userModel.findByPk(id);

    if (!user) {
      throw ApiError.BadRequest(`Пользователь не найден`);
    }

    return user.toDto();
  }

  static async updateUser(id: number, user: User) {
    const userData = await userModel.findByPk(id);
    if (!userData) {
      throw ApiError.BadRequest(`Пользователь не найден`);
    }

    const result = await userData.update({
      ...user,
      secretFields: user.secretFields,
    });

    const updatedUser = result.toDto();

    return updatedUser;
  }

  static async getBotOwnerStatistics(userId: number) {
    const user = await userModel.findByPk(userId);

    if (!user) {
      throw ApiError.BadRequest("Пользователь не является разработчиком");
    }

    const statistics: BotOwnerStatictic[] = [];

    const prices = await priceModel.findAll();

    prices.forEach((price, index) => {
      statistics.push({
        country: { label: price.label, value: price.value },
      } as BotOwnerStatictic);
    });

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Расчет суммарной стоимости записей за последний месяц

    const lastMonthRecordsByCountries = await Promise.all(
      prices.map((price) => {
        return recordModel.findAll({
          where: {
            destinationCountry: price.value,
            recordingDate: {
              [Op.between]: [startOfMonth, endOfMonth],
            },
          },
        });
      })
    );

    const lastMonthApplicantsByCountries = await Promise.all(
      lastMonthRecordsByCountries.map((records) =>
        Promise.all(
          records.map((record) => {
            return applicantModel.findAll({ where: { recordId: record.id } });
          })
        )
      )
    );

    lastMonthRecordsByCountries.forEach((records, index) => {
      const estimatedIncome = records.reduce(
        (prev, record, recordIndex, arr) => {
          const targetPrice = prices.find(
            (price) => price.value === record.destinationCountry
          );

          let targetPriceValue = targetPrice?.priceStandardCapital;

          prev +=
            (targetPriceValue || 1) *
            lastMonthApplicantsByCountries[index][recordIndex].length;
          return prev;
        },
        0
      );

      statistics[index].totalRecords = records.length;
      statistics[index].estimatedIncome = estimatedIncome;
    });

    // Расчет стоимости записей, успешно записанных владельцем бота за последний месяц

    const userBots = await botModel.findAll({ where: { userId: user.id } });

    lastMonthRecordsByCountries.forEach((records, index) => {
      const recordsFilteredByBotOnwer = records.filter(
        (r) =>
          !!userBots.find((ub) => ub.id === r.botId) && r.status === "success"
      );

      const finalIncome = recordsFilteredByBotOnwer.reduce(
        (prev, record, recordIndex, arr) => {
          const targetPrice = prices.find(
            (price) => price.value === record.destinationCountry
          );

          let targetPriceValue = targetPrice?.priceStandardCapital;

          prev +=
            (targetPriceValue || 1) *
            lastMonthApplicantsByCountries[index][recordIndex].length;
          return prev;
        },
        0
      );

      statistics[index].successRecords = recordsFilteredByBotOnwer.length;
      statistics[index].finalIncome =
        finalIncome * (user.commissionPercentage / 100);
    });

    prices.forEach((price, index) => {
      statistics[index].apiKey =
        userBots.find((ub) => ub.country === price.value)?.apiKey || "";
    });

    return statistics;
  }
}
