import approveIcon from "@assets/icons/approve.svg";
import declineIcon from "@assets/icons/decline.svg";
import downloadIcon from "@assets/icons/download.svg";
import type { User } from "@pages/auth/auth-types";
import type { RecordExpanded } from "@pages/record/record.types";
import { countries } from "@shared/components/filters/CountryFilter/countries";
import type { TableColumn } from "@shared/components/ui/Table/Table";
import type { Status } from "@shared/components/ui/Tile/Tile";
import Tile from "@shared/components/ui/Tile/Tile";
import React from "react";
import { Tooltip } from "react-tooltip";

interface ClientTableProps {
    isAdmin: boolean;
    country: string;
    user: Nullable<User>;
    onDownloadConfirmationFile: (file: string, id: number) => void;
    onConfirmPayment: (id: number) => void;
    onApprove: (id: number) => void;
    onDecline: (id: number) => void;
}

export function withdrawalRecordColumns({
    user,
    isAdmin,
    onConfirmPayment,
    onApprove,
    onDecline,
    onDownloadConfirmationFile,
}: ClientTableProps): TableColumn<RecordExpanded>[] {
    return [
        {
            field: "recordId",
            label: "ID записи",
            width: "100px",
            defaultValue: "-",
            className: "table__td--center",
            render: (data) => "000" + data.recordId,
        },
        {
            field: "agent",
            label: "Агент",
            width: "150px",
            visible: isAdmin,
            render: (data) => (
                <div className="ellipsis-text" title={data.agent}>
                    {data.agent}
                </div>
            ),
        },
        {
            field: "firstName",
            label: "Имя",
            width: "150px",
        },
        {
            field: "surname",
            label: "Фамилия",
            width: "180px",
        },
        {
            field: "destinationCountry",
            label: "Страна",
            width: "156px",
            render: (data) => {
                const country = countries.find(
                    (destinationCountry) =>
                        destinationCountry.value === data.destinationCountry
                );

                return (
                    <div className="country-column">
                        {country?.flag && (
                            <img
                                className="country-chip__image"
                                src={country?.flag}
                                alt={country?.label}
                            />
                        )}
                        {country?.label || ""}
                    </div>
                );
            },
        },
        {
            field: "status",
            label: "Статус записи",
            width: "170px",
            render: (data) => {
                let statusLabel = "";

                switch (data.status) {
                    case "success":
                        statusLabel = "Записан";
                        break;
                    case "pending":
                        if (data.new) {
                            statusLabel = "Внесение в базу";
                        } else if (data.payment || data.postPayment) {
                            statusLabel = "Ожидает";
                        } else {
                            statusLabel = "Требуется оплата";
                        }
                        break;
                    case "progress":
                        statusLabel = "В работе";
                        break;
                    case "canceled":
                        statusLabel = "Отмена";
                        break;
                    default:
                        statusLabel = "Ошибка";
                        break;
                }

                if (data.group && !data.groupFirstEl) return " ";

                return data.errorMessage && data.status === "error" ? (
                    <>
                        <Tooltip
                            id={`my-tooltip${data.id}`}
                            style={{
                                width: "400px",
                                zIndex: 10,
                            }}
                        />
                        <a
                            className="error-tooltip-link"
                            data-tooltip-id={`my-tooltip${data.id}`}
                            data-tooltip-content={data.errorMessage}
                        >
                            <Tile status={data.status} text={statusLabel} />
                        </a>
                    </>
                ) : (
                    <Tile status={data.status} text={statusLabel} />
                );
            },
        },
        {
            field: "recordingDate",
            label: "Дата записи",
            width: "150px",
            render: (data) => data.recordingDate || "-",
            className: "table__td--center",
        },
        {
            field: "price",
            label: "Стоимость",
            width: "130px",
            className: "table__td--center",
            render: (data) => (data.price ? data.price.toFixed(2) : "-"),
        },
        {
            field: "payment",
            label: "Статус оплаты",
            width: "180px",
            render: (data) => {
                let botOwnerRecordsStatus: { label: string; status: Status } = {
                    label: "",
                    status: "info",
                };

                switch (data.paidToBotOwnerStatus) {
                    case "completed":
                        botOwnerRecordsStatus = {
                            label: "Оплачено",
                            status: "success",
                        };
                        break;
                    case "approved":
                        botOwnerRecordsStatus = {
                            label: "Одобрен вывод",
                            status: "success",
                        };
                        break;
                    case "declined":
                        botOwnerRecordsStatus = {
                            label: "Отклонено",
                            status: "error",
                        };
                        break;
                    case "pending":
                        botOwnerRecordsStatus = {
                            label: "Ожидает проверки",
                            status: "pending",
                        };
                        break;
                    default:
                        botOwnerRecordsStatus = {
                            label: "Не оплачено",
                            status: "info",
                        };
                        break;
                }

                return !data.group || data.groupFirstEl ? (
                    user?.type === "botOwner" ? (
                        <>
                            <Tooltip
                                id={`commentForBotOwner-tooltip${data.id}`}
                                style={{
                                    width: "400px",
                                    zIndex: 10,
                                }}
                            />
                            <a
                                data-tooltip-id={`commentForBotOwner-tooltip${data.id}`}
                                data-tooltip-content={data.commentForBotOwner}
                            >
                                <Tile
                                    status={botOwnerRecordsStatus.status}
                                    text={botOwnerRecordsStatus.label}
                                />
                            </a>
                        </>
                    ) : (
                        <>
                            {(!data.group || data.groupFirstEl) && (
                                <Tile
                                    status={data.payment ? "success" : "info"}
                                    text={
                                        data.payment
                                            ? "Оплачен"
                                            : data.postPayment
                                            ? "Постоплата"
                                            : "Не оплачен"
                                    }
                                />
                            )}
                        </>
                    )
                ) : null;
            },
        },
        {
            field: "paidToBotOwnerStatus",
            label: "Статус оплаты разработчику",
            width: "230px",
            visible: isAdmin,
            render: (data) => {
                let botOwnerRecordsStatus: { label: string; status: Status } = {
                    label: "",
                    status: "info",
                };

                switch (data.paidToBotOwnerStatus) {
                    case "completed":
                        botOwnerRecordsStatus = {
                            label: "Оплачено",
                            status: "success",
                        };
                        break;
                    case "approved":
                        botOwnerRecordsStatus = {
                            label: "Одобрен вывод",
                            status: "success",
                        };
                        break;
                    case "declined":
                        botOwnerRecordsStatus = {
                            label: "Отклонено",
                            status: "error",
                        };
                        break;
                    case "pending":
                        botOwnerRecordsStatus = {
                            label: "Ожидает проверки",
                            status: "pending",
                        };
                        break;
                    default:
                        botOwnerRecordsStatus = {
                            label: "Не оплачено",
                            status: "info",
                        };
                        break;
                }

                return !data.group || data.groupFirstEl ? (
                    <>
                        <Tooltip
                            id={`commentForBotOwner-tooltip${data.id}`}
                            style={{
                                width: "400px",
                                zIndex: 10,
                            }}
                        />
                        <a
                            data-tooltip-id={`commentForBotOwner-tooltip${data.id}`}
                            data-tooltip-content={data.commentForBotOwner}
                        >
                            <Tile
                                status={botOwnerRecordsStatus.status}
                                text={botOwnerRecordsStatus.label}
                            />
                        </a>
                    </>
                ) : (
                    " "
                );
            },
        },
        {
            field: "editable",
            label: "",
            visible: user?.type !== "botOwner",
            width: "108px",
            render: (data) => (
                <div className="table__icons">
                    {data.paidToBotOwnerStatus === "approved" &&
                        (!data.group || (data.group && data.groupFirstEl)) && (
                            <div
                                className="table__td-icon"
                                onClick={() => onConfirmPayment(data.id)}
                            >
                                <img
                                    src={approveIcon}
                                    width="17"
                                    height="17"
                                    alt="confirm"
                                />
                            </div>
                        )}

                    {isAdmin && data.canChangeBotPaymentStatus && (
                        <div
                            className="table__td-icon"
                            onClick={() => onApprove(data.id)}
                        >
                            <img
                                src={approveIcon}
                                width="17"
                                height="17"
                                alt="approve"
                            />
                        </div>
                    )}

                    {isAdmin && data.canChangeBotPaymentStatus && (
                        <div
                            className="table__td-icon"
                            onClick={() => onDecline(data.id)}
                        >
                            <img
                                src={declineIcon}
                                width="17"
                                height="17"
                                alt="decline"
                            />
                        </div>
                    )}

                    {data.confirmationFileExists ? (
                        <div
                            className="table__td-icon"
                            onClick={() =>
                                data.confirmationFile &&
                                onDownloadConfirmationFile(
                                    data.confirmationFile,
                                    data.id
                                )
                            }
                        >
                            <img
                                src={downloadIcon}
                                width="15"
                                height="15"
                                alt="download"
                            />
                        </div>
                    ) : null}
                </div>
            ),
        },
    ];
}
