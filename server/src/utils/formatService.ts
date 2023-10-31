export function formatNumberWithSpaces(number: number) {
  // Преобразуем число в строку
  let numberString = number.toString();

  // Используем регулярное выражение для добавления пробелов через каждые три цифры с конца
  numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return numberString;
}
