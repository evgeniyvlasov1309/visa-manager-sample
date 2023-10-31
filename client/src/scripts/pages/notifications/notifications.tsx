import React, { useMemo } from "react";
import { NotificationItem } from "./components/notification-item/NotificationItem";
import { NotificationsFilter } from "./components/notifications-filter/NotificationsFilter";
import "./notifications.scss";
import { useNotificationsStore } from "./store";

export default function NotificationsPage() {
    const [delivereditems, undelivereditems, showDelivered] =
        useNotificationsStore((state) => [
            state.delivereditems,
            state.undelivereditems,
            state.showDelivered,
        ]);

    const items = useMemo(
        () => (showDelivered ? delivereditems : undelivereditems),
        [delivereditems, undelivereditems, showDelivered]
    );

    return (
        <>
            <h1 className="h1">Уведомления</h1>
            <NotificationsFilter />
            {items.length ? (
                items.map((n) => <NotificationItem item={n} full key={n.id} />)
            ) : (
                <div className="notifications__no-data">
                    <p>Уведомлений об изменениях заявок нет</p>
                </div>
            )}
        </>
    );
}
