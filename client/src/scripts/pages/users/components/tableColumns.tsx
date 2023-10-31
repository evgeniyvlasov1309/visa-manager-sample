import viewIcon from "@assets/icons/eye.svg";
import type { User } from "@pages/auth/auth-types";
import { Checkbox } from "@shared/components/ui/Checkbox/Checkbox";
import type { TableColumn } from "@shared/components/ui/Table/Table";
import React from "react";
import Toggle from "react-toggle";

interface ClientTableProps {
    onOpen: (id: number) => void;
    onSetVip: (id: number, user: User, value: boolean) => void;
    onTogglePaymentMethod: (
        id: number,
        user: User,
        value: "cash" | "card"
    ) => void;
}

export function columns({
    onSetVip,
    onTogglePaymentMethod,
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
            width: "180px",
            render: (data) =>
                data.isAdmin
                    ? "Администратор"
                    : data.type === "company"
                    ? "Компания"
                    : data.agencyId
                    ? "Сотрудник компании"
                    : data.type === "botOwner"
                    ? "Разработчик"
                    : "Частное лицо",
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
            field: "companyName",
            label: "Наименование",
            width: "150px",
            render: (data) => data.companyName || "-",
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
            field: "vip",
            label: "VIP",
            width: "100px",
            render: (data) => (
                <Checkbox
                    id={data.id.toString()}
                    label=""
                    checked={data.vip}
                    onChange={(e) => {
                        onSetVip(data.id, data, e.target.checked);
                    }}
                />
            ),
        },
        {
            field: "paymentMethod",
            label: "Способ оплаты",
            width: "130px",
            render: (data) => (
                <div className="payment-toggle">
                    <label htmlFor="payment-method">БН</label>
                    <Toggle
                        id="payment-method"
                        icons={false}
                        className="payment-toggle"
                        defaultChecked={data.paymentMethod === "cash"}
                        onChange={(e) =>
                            onTogglePaymentMethod(
                                data.id,
                                data,
                                data.paymentMethod === "cash" ? "card" : "cash"
                            )
                        }
                    />
                    <label htmlFor="payment-method">Н</label>
                </div>
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
