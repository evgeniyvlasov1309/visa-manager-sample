import type { Withdrawal } from "@pages/withdrawals/types";
import type { TableColumn } from "@shared/components/ui/Table/Table";
import { formatDateFromIsoString } from "@shared/utilities/dates";

// interface ClientTableProps {
//     selected: number[];
//     isAdmin: boolean;
//     country: string;
//     user: Nullable<User>;
//     onEdit: (id: number) => void;
//     onDelete: (id: number) => void;
//     onPay: (id: number) => void;
//     onSelect: (id: number, value: boolean) => void;
//     onSelectAll: (value: boolean) => void;
// }

export function columns(): TableColumn<Withdrawal>[] {
    return [
        {
            field: "id",
            label: "ID",
            width: "100px",
            defaultValue: "-",
            className: "table__td--center",
            render: (data) => "000" + data.id,
        },
        {
            field: "userEmail",
            label: "Разработчик",
            width: "200px",
            className: "ellipsis-text",
        },
        {
            field: "amount",
            label: "Сумма",
            width: "150px",
        },
        {
            field: "createdAt",
            label: "Дата создания",
            width: "150px",
            render: (data) => formatDateFromIsoString(data.createdAt),
        },
    ];
}
