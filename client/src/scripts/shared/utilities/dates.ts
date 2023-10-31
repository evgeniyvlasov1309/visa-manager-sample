import { format, parseISO } from "date-fns";

export function formatDateFromIsoString(date: string) {
    const isoDate = parseISO(date);

    return format(isoDate, "dd/MM/yyyy HH:mm");
}

export function getDateFromIsoString(date: string) {
    return formatDateFromIsoString(date).split(" ")[0];
}

export function getTimeFromIsoString(date: string) {
    return formatDateFromIsoString(date).split(" ")[1];
}
