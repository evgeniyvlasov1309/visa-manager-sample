import { useNotificationsStore } from "@pages/notifications/store";
import clsx from "clsx";
import React from "react";
import "./NotificationsFilter.scss";

export function NotificationsFilter() {
    const [undelivereditems, showDelivered, setShowDelivered] =
        useNotificationsStore((state) => [
            state.undelivereditems,
            state.showDelivered,
            state.setShowDelivered,
        ]);

    return (
        <div className="notification-filter">
            <div
                className={clsx("notification-filter__item", {
                    active: !showDelivered,
                })}
                onClick={() => setShowDelivered(false)}
            >
                Непрочитанные
                {undelivereditems.length > 0 && (
                    <div className="notification-filter__counter">
                        {undelivereditems.length}
                    </div>
                )}
            </div>
            <div
                className={clsx("notification-filter__item", {
                    active: showDelivered,
                })}
                onClick={() => setShowDelivered(true)}
            >
                Прочитанные
            </div>
        </div>
    );
}
