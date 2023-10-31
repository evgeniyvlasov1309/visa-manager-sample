import chinaFlag from "@assets/icons/china.svg";
import franceFlag from "@assets/icons/france.svg";
import spainFlag from "@assets/icons/spain.png";
import usaFlag from "@assets/icons/usa.png";
import NotificationTile from "@pages/notifications/components/NotificationTile/NotificationTile";
import { useNotificationsStore } from "@pages/notifications/store";
import type { Notification } from "@pages/notifications/types";
import type { Status } from "@shared/components/ui/Tile/Tile";
import {
    getDateFromIsoString,
    getTimeFromIsoString,
} from "@shared/utilities/dates";
import clsx from "clsx";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationItem.scss";

export interface NotificationItemProps {
    item: Notification;
    full?: boolean;
    onClick?: () => void;
}

export function NotificationItem({
    item,
    full,
    onClick,
}: NotificationItemProps) {
    const [markAsRead] = useNotificationsStore((state) => [state.markAsRead]);

    const flag = useMemo(() => {
        switch (item.country) {
            case "Fr":
                return franceFlag;
            case "Sp":
                return spainFlag;
            case "Ch":
                return chinaFlag;
            case "Usa":
                return usaFlag;
            default:
                return null;
        }
    }, [item]);

    const recordStatusLabel = useMemo(() => {
        switch (item.recordStatus) {
            case "success":
                return "Записан";
            case "pending":
                return "Ожидает";
            case "progress":
                return "В работе";
            case "canceled":
                return "Отмена";
            default:
                return "Ошибка";
        }
    }, []);

    const paymentStatus = useMemo(() => {
        const result: { value: Status; label: string } = {
            value: item.payment ? "success" : "info",
            label: item.payment
                ? "Оплачен"
                : item.postPayment
                ? "Постоплата"
                : "Не оплачен",
        };

        return result;
    }, []);

    const navigate = useNavigate();

    const onNavigateToRecord = () => {
        markAsRead(item.id);
        navigate(`/record/${item.recordId}`);
        onClick?.();
    };

    return (
        <div
            className={clsx("notification-item", { full: full })}
            onClick={onNavigateToRecord}
        >
            <img src={flag} width={38} height={29} alt="country" />
            <div className="notification-item__info">
                <div className="notification-item__title">{item.title}</div>
                <div className="notification-item__description">
                    {item.description}
                </div>
                <div className="notification-item__message">{item.message}</div>
            </div>
            {full && (
                <div className="notification-item__record-payment-status">
                    <NotificationTile
                        status={paymentStatus.value}
                        text={paymentStatus.label}
                    />
                </div>
            )}
            <div className="notification-item__record-status">
                <NotificationTile
                    status={item.recordStatus}
                    text={recordStatusLabel}
                />
            </div>
            <div className="notification-item__datetime">
                <div className="notification-item__date">
                    {getDateFromIsoString(item.createdAt)}
                </div>
                <div className="notification-item__time">
                    {getTimeFromIsoString(item.createdAt)}
                </div>
            </div>
        </div>
    );
}
