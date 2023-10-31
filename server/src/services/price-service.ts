import { applicantModel } from "../models/applicant-model";
import { Price, priceModel } from "../models/price-model";
import { recordModel } from "../models/record-model";
import { userModel } from "../models/user-model";

export class PriceService {
  static async getPrices() {
    const prices = priceModel.findAll();

    return prices;
  }

  static async updatePrices(prices: Price[]) {
    for (const price of prices) {
      await priceModel.update(
        {
          label: price.label,
          value: price.value,
          priceStandardCapital: price.priceStandardCapital,
          priceStandardRegion: price.priceStandardRegion,
          priceVipCapital: price.priceVipCapital,
          priceVipRegion: price.priceVipRegion,
        },
        {
          where: { id: price.id },
        }
      );
    }

    return prices;
  }

  static async getRecordPrice(recordId: number) {
    const prices = await priceModel.findAll();
    const recordData = await recordModel.findByPk(recordId);
    if (!recordData) return 0;

    let user = await userModel.findByPk(recordData.userId);
    if (user?.agencyId) {
      user = await userModel.findByPk(user.agencyId);
    }

    const userPrices: {
      label: string;
      value: string;
      priceStandardCapital: number;
      priceStandardRegion: number;
      capitals: string[];
    }[] = JSON.parse(user?.prices || "[{}]");

    const targetPrice = prices.find(
      (price) => price.value === recordData.destinationCountry
    );

    const targetUserPrice = userPrices.find(
      (price) => price.value === recordData.destinationCountry
    );

    let targetPriceValue;

    if (user?.vip) {
      targetPriceValue = targetPrice?.capitals.includes(
        recordData.visaCenter || recordData.city
      )
        ? targetPrice.priceVipCapital
        : targetPrice?.priceVipRegion;
    } else {
      targetPriceValue = targetPrice?.capitals.includes(
        recordData.visaCenter || recordData.city
      )
        ? targetUserPrice?.priceStandardCapital ||
          targetPrice.priceStandardCapital
        : targetUserPrice?.priceStandardRegion ||
          targetPrice?.priceStandardRegion;
    }

    const applicants = await applicantModel.findAll({
      where: { recordId: recordData.id },
    });

    return (targetPriceValue || 1) * applicants.length;
  }
}
