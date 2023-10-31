import NotificationActiveIcon from "@assets/icons/notifications-active.svg";
import NotificationIcon from "@assets/icons/notifications.svg";
import { NotificationItem } from "@pages/notifications/components/notification-item/NotificationItem";
import { NotificationsFilter } from "@pages/notifications/components/notifications-filter/NotificationsFilter";
import { useNotificationsStore } from "@pages/notifications/store";
import { Button } from "@shared/components/ui/Button/Button";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationDropdown.scss";

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownEl = useRef(null);
    const dropdownContentEl = useRef(null);

    function onClickOutside(e: MouseEvent) {
        if (
            dropdownEl.current &&
            dropdownContentEl.current &&
            !e.composedPath().includes(dropdownEl.current) &&
            !e.composedPath().includes(dropdownContentEl.current)
        ) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", onClickOutside);

        return () => {
            document.removeEventListener("click", onClickOutside);
        };
    }, []);

    const [delivereditems, undelivereditems, showDelivered, fetchItems] =
        useNotificationsStore((state) => [
            state.delivereditems,
            state.undelivereditems,
            state.showDelivered,
            state.fetchItems,
        ]);

    const items = useMemo(
        () => (showDelivered ? delivereditems : undelivereditems).slice(0, 5),
        [delivereditems, undelivereditems, showDelivered]
    );

    useEffect(() => {
        fetchItems();
    }, [showDelivered]);

    const onToggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    const navigate = useNavigate();

    const onGoToNotifications = () => {
        navigate("/notifications");
        onToggleOpen();
    };

    return (
        <div className="notification-dropdown">
            {undelivereditems.length > 0 ? (
                <>
                    <div className="notification-dropdown__counter">
                        {undelivereditems.length}
                    </div>
                    <img
                        src={NotificationActiveIcon}
                        width="26"
                        height="26"
                        alt="notifications"
                        ref={dropdownEl}
                        className="notification-dropdown__icon"
                        onClick={() => onToggleOpen()}
                    />
                </>
            ) : (
                <img
                    src={NotificationIcon}
                    width="26"
                    height="26"
                    alt="notifications"
                    ref={dropdownEl}
                    className="notification-dropdown__icon"
                    onClick={() => onToggleOpen()}
                />
            )}

            {isOpen && (
                <div
                    ref={dropdownContentEl}
                    className="notification-dropdown__content"
                >
                    <h3 className="notification-dropdown__title">
                        Уведомления
                    </h3>
                    <NotificationsFilter />
                    {items.length ? (
                        <div className="notification-dropdown__list">
                            {items.map((n) => (
                                <NotificationItem
                                    item={n}
                                    key={n.id}
                                    onClick={onToggleOpen}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="notification-dropdown__no-data">
                            <p>Уведомлений об изменениях заявок нет</p>
                        </div>
                    )}
                    <Button
                        dense
                        className="notification-dropdown__btn"
                        title="Посмотреть все уведомления"
                        onClick={onGoToNotifications}
                        variant="outlined"
                    />
                </div>
            )}
        </div>
    );
};
