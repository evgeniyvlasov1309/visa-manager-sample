import { useAuthStore } from "@pages/auth/store";
import { useUsersStore } from "@pages/users/store";
import { Button } from "@shared/components/ui/Button/Button";
import { Checkbox } from "@shared/components/ui/Checkbox/Checkbox";
import Modal from "@shared/components/ui/Modal/Modal";
import React, { useEffect, useState } from "react";
import "./NotificationModal.scss";

export const NotificationModal = () => {
    const [user, checkAuth] = useAuthStore((state) => [
        state.user,
        state.checkAuth,
    ]);

    const [updateUser] = useUsersStore((state) => [state.updateUser]);

    const [notificationModal, setNotificationModal] = useState(false);
    const [disableReminder, setDisableReminder] = useState(false);

    useEffect(() => {
        if (!user?.createdAt) return;

        const result =
            new Date().getTime() - new Date(user?.createdAt).getTime();
        const daysAfterRegistration = Math.floor(result / 1000 / 86400);

        if (
            daysAfterRegistration > 2 &&
            !localStorage.getItem("notificationShown")
        ) {
            setNotificationModal(true);
        }
    }, [user]);

    const onTelegramNotificationConfirm = async () => {
        if (!user) return;

        await updateUser(user.id, {
            ...user,
            notificationTelegramEnabled: true,
        });

        await checkAuth();

        localStorage.setItem("notificationShown", "true");

        setNotificationModal(false);
    };

    const onTelegramNotificationDecline = () => {
        if (disableReminder) {
            localStorage.setItem("notificationShown", "true");
        }
        setNotificationModal(false);
    };

    return (
        <Modal
            isOpen={notificationModal}
            onClose={() => setNotificationModal(false)}
        >
            <div className="notification-modal">
                <h2 className="notification-modal__title">
                    Хотите получать уведомления в телеграм?
                </h2>

                <div className="notification-modal__buttons">
                    <Button
                        title="Да"
                        dense
                        variant="outlined"
                        className="notification-modal__button"
                        onClick={onTelegramNotificationConfirm}
                    />

                    <Button
                        title="Нет"
                        dense
                        variant="outlined"
                        className="notification-modal__button"
                        onClick={onTelegramNotificationDecline}
                    />
                </div>

                <Checkbox
                    label="Больше не напоминать"
                    id="disableReminder"
                    checked={disableReminder}
                    onChange={() => setDisableReminder((prev) => !prev)}
                />
            </div>
        </Modal>
    );
};
