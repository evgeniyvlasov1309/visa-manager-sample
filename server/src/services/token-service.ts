import jwt, { Secret } from "jsonwebtoken";
import { tokenModel } from "../models/token-model";
import { UserDto } from "../models/user-model";

export class TokenService {
  static accessSecret = process.env.JWT_ACCESS_SECRET as Secret;
  static refreshSecret = process.env.JWT_REFRESH_SECRET as Secret;

  static async generateTokens(user: UserDto) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      this.accessSecret,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      this.refreshSecret,
      {
        expiresIn: "14d",
      }
    );

    return { accessToken, refreshToken };
  }

  static validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, TokenService.accessSecret);
      return userData;
    } catch (error) {
      return null;
    }
  }

  static validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, TokenService.refreshSecret);
      return userData;
    } catch (error) {
      return null;
    }
  }

  static async saveToken(userId: number, refreshToken: string) {
    const tokenData = await tokenModel.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await tokenModel.create({ refreshToken, userId });
    return token;
  }

  static async removeToken(refreshToken: string) {
    const tokenData = await tokenModel.destroy({ where: { refreshToken } });
    return tokenData;
  }

  static async findToken(refreshToken: string) {
    const tokenData = await tokenModel.findOne({ where: { refreshToken } });
    return tokenData;
  }
}
