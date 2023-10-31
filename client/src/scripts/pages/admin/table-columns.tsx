import type { TableColumn } from "@shared/components/ui/Table/Table";
import type { Bot } from "./types";

export function columns(): TableColumn<Bot>[] {
    return [
        {
            field: "id",
            label: "ID",
            width: "100px",
            defaultValue: "-",
            className: "table__td--center",
        },
        {
            field: "country",
            label: "Страна",
            width: "150px",
        },
        {
            field: "apiKey",
            label: "API ключ",
            width: "300px",
        },
        {
            field: "createdAt",
            label: "Дата создания",
            width: "150px",
            render: (data) => data.createdAt,
        },
    ];
}
