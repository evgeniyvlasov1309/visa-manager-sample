export class DateFormatter {
  static formatClientDate(originalDate: string) {
    if (!originalDate) return null;
    const date = new Date(originalDate);
    if (date.toString() === "Invalid Date") return "-";
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()} ${date
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  }

  static formatDate(originalDate: string) {
    const date = new Date(originalDate);
    date.setHours(date.getHours() + 3);
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(
      date.getUTCMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getUTCFullYear()} ${date
      .getUTCHours()
      .toString()
      .padStart(2, "0")}:${date.getUTCMinutes().toString().padStart(2, "0")}`;
  }

  static getDateWithoutTime(originalDate: Date | null) {
    return originalDate?.toISOString().slice(0, 10) ?? null;
  }
}
