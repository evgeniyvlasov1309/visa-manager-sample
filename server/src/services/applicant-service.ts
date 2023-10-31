import { ApiError } from "../exceptions/api-error";
import { Applicant, applicantModel } from "../models/applicant-model";
import { recordModel } from "../models/record-model";

export class ApplicantService {
  static async update(id: number, applicantData: Applicant) {
    const applicant = await applicantModel.findByPk(id);
    const record = await recordModel.findByPk(applicant?.recordId);

    if (!record || !applicant) {
      throw ApiError.BadRequest("Заявитель не найден");
    }

    if (record.status === "success") {
      throw ApiError.BadRequest(`Запись уже записана`);
    }

    await applicant.update(applicantData);

    return;
  }
}
