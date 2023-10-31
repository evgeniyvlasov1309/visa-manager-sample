import viewIcon from "@assets/icons/eye.svg";
import type { User } from "@pages/auth/auth-types";
import EditNumberInput from "@shared/components/ui/EditNumberInput/EditNumberInput";
import type { TableColumn } from "@shared/components/ui/Table/Table";
import React from "react";

interface ClientTableProps {
    onOpen: (id: number) => void;
    onChangeCommission: (user: User, value: number) => void;
    onSetVip: (user: User, value: boolean) => void;
}

export function columns({
    onSetVip,
    onChangeCommission,
    onOpen,
}: ClientTableProps): TableColumn<User>[] {
    return [
        {
            field: "id",
            label: "ID",
            width: "50px",
            defaultValue: "-",
            className: "table__td--center",
        },
        {
            field: "type",
            label: "Тип",
            width: "100px",
            render: (data) => "Разработчик",
        },
        {
            field: "email",
            label: "Email",
            width: "150px",
            render: (data) => (
                <div className="ellipsis-text" title={data.email}>
                    {data.email}
                </div>
            ),
        },
        {
            field: "fio",
            label: "ФИО",
            width: "200px",
            render: (data) => (
                <div className="ellipsis-text" title={data.fio}>
                    {data.fio || "-"}
                </div>
            ),
        },
        {
            field: "phoneNumber",
            label: "Номер телефона",
            width: "150px",
            render: (data) =>
                data.phoneNumber ? "+7" + data.phoneNumber : "-",
        },
        {
            field: "commissionPercentage",
            label: "Процент заработка",
            width: "200px",
            className: "table__td--center",
            render: (data) => (
                <EditNumberInput
                    value={data.commissionPercentage}
                    onConfirm={(value: number) =>
                        onChangeCommission(data, value)
                    }
                />
            ),
        },
        {
            field: "",
            label: "",
            width: "168px",
            render: (data) => (
                <div className="table__icons">
                    <div
                        className="table__td-icon"
                        onClick={() => onOpen(data.id)}
                    >
                        <img src={viewIcon} width="17" height="17" alt="view" />
                    </div>
                </div>
            ),
        },
    ];
}
