export function getCurrentMonthYear() {
    // Получаем текущую дату
    const currentDate = new Date();

    // Получаем номер текущего месяца (начиная с 0 для января)
    const currentMonth = currentDate.getMonth() + 1; // +1 для корректного отображения месяца

    // Генерируем строку в формате "MM.YYYY" для текущего месяца
    const formattedDate = `${currentMonth
        .toString()
        .padStart(2, "0")}.${currentDate.getFullYear()}`;

    return formattedDate;
}
