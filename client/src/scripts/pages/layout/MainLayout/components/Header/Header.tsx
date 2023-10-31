import profileIcon from "@assets/icons/profile.svg";
import { useAuthStore } from "@pages/auth/store";
import { useRecordsStore } from "@pages/home/store";
import UserService from "@pages/users/user-service";
import WithdrawalService from "@pages/withdrawals/withdrawal-service";
import { Button } from "@shared/components/ui/Button/Button";
import Card from "@shared/components/ui/Card/Card";
import Dropdown from "@shared/components/ui/Dropdown/Dropdown";
import Modal from "@shared/components/ui/Modal/Modal";
import Search from "@shared/components/ui/Search/Search";
import { TextArea } from "@shared/components/ui/Textarea/Textarea";
import Tile from "@shared/components/ui/Tile/Tile";
import { getRandomNumber } from "@shared/utilities/getRandomNumber";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toggle/style.css";
import { CSSTransition } from "react-transition-group";
import "./Header.scss";
import { NotificationDropdown } from "./components/NotificationDropdown/NotificationDropdown";
import { NotificationModal } from "./components/NotificationModal/NotificationModal";

export default function Header() {
    const navigate = useNavigate();
    const [user, logout] = useAuthStore((state) => [state.user, state.logout]);
    const [records, selected, current, update, setSelected] = useRecordsStore(
        (state) => [
            state.records,
            state.selected,
            state.current,
            state.update,
            state.setSelected,
        ]
    );

    const [paymentModal, setPaymentModal] = useState(false);

    const [paymentComment, setPaymentComment] = useState("");
    const [paymentCode, setPaymentCode] = useState(0);

    const currentStatusLabel = useMemo(() => {
        let statusLabel = "";
        if (!current) return statusLabel;

        switch (current.status) {
            case "success":
                statusLabel = "Записан";
                break;
            case "pending":
                if (current.new) {
                    statusLabel = "Внесение в базу";
                } else if (current.payment || current.postPayment) {
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

        return statusLabel;
    }, [current]);

    const totalAmount = useMemo(
        () =>
            records
                .filter((item) => selected.includes(item.id))
                .map((item) => item.price)
                .reduce((prev, val) => {
                    prev += val;
                    return prev;
                }, 0),
        [records, selected]
    );

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setShouldAnimate(true);
    }, [totalAmount]);

    async function onPaySelectedRecords() {
        if (!selected.length) return;
        setPaymentCode(getRandomNumber(10000, 99999));
        if (user?.paymentMethod === "cash") {
            setPaymentModal(true);
        } else {
            const { url } = await UserService.createPayment({
                type: "card",
                selected,
                code: paymentCode,
                comment: "",
            });
            window.location.href = url;
        }
    }

    async function onPaySelectedConfirm() {
        await UserService.createPayment({
            type: "cash",
            selected,
            code: paymentCode,
            comment: paymentComment,
        });
        setPaymentModal(false);
        setSelected([]);
        update();
    }

    function onLogout() {
        try {
            logout();
            navigate("/auth");
        } catch (error) {
            /* empty */
        }
    }

    function onGoToProfile() {
        navigate("/profile");
    }

    function onGoToPermanentFields() {
        navigate("/permanent-fields");
    }

    function onGoToEmployees() {
        navigate("/employees");
    }

    async function onWithdrawFunds() {
        if (!selected.length) return;
        await WithdrawalService.createItem(selected);
        alert("Заявка на вывод сформирована");
    }

    const menuItems = useMemo(() => {
        const items = [
            { label: "Профиль", onClick: onGoToProfile },
            { label: "Выйти", onClick: onLogout },
        ];

        if (user?.type !== "botOwner") {
            items.splice(1, 0, {
                label: "Постоянные данные",
                onClick: onGoToPermanentFields,
            });
        }

        if (user?.type === "company") {
            items.splice(1, 0, {
                label: "Сотрудники",
                onClick: onGoToEmployees,
            });
        }

        return items;
    }, [user]);

    return (
        <header className="header">
            <Card>
                <div className="header__content">
                    <>
                        <Search />
                        {current && (
                            <div className="header__records-status">
                                <Tile
                                    text={currentStatusLabel}
                                    status={current.status}
                                />
                            </div>
                        )}
                        <Modal
                            isOpen={paymentModal}
                            onClose={() => setPaymentModal(false)}
                        >
                            <div className="payment-modal">
                                <h2>Заявка на оплату</h2>
                                <p>Сумма: {totalAmount} руб.</p>
                                <p>
                                    Код заявки:{" "}
                                    <span className="payment-modal__code">
                                        {paymentCode}
                                    </span>
                                </p>
                                <TextArea
                                    value={paymentComment}
                                    label="Комментарий"
                                    placeholder="Введите комментарий"
                                    onChange={(e) =>
                                        setPaymentComment(e.target.value)
                                    }
                                />
                                <Button
                                    title="Отправить"
                                    onClick={onPaySelectedConfirm}
                                />
                            </div>
                        </Modal>
                        <NotificationModal />
                        {!user?.isAdmin && !current && (
                            <div className="header__payment">
                                <div className="header__payment-total">
                                    <CSSTransition
                                        in={shouldAnimate}
                                        timeout={100}
                                        classNames="tile-animation"
                                        onEntered={() =>
                                            setShouldAnimate(false)
                                        }
                                    >
                                        <Tile
                                            text={
                                                "Итого: " +
                                                totalAmount +
                                                " руб."
                                            }
                                            status="success"
                                        />
                                    </CSSTransition>
                                </div>
                                <div className="header__payment-btn">
                                    <Button
                                        title={
                                            user?.type === "botOwner"
                                                ? "Вывод средств"
                                                : "Оплатить"
                                        }
                                        dense
                                        disabled={
                                            !selected.length || !totalAmount
                                        }
                                        onClick={
                                            user?.type === "botOwner"
                                                ? onWithdrawFunds
                                                : onPaySelectedRecords
                                        }
                                    />
                                </div>
                                {user?.type !== "botOwner" && (
                                    <div className="header__payment-method">
                                        {user?.paymentMethod === "cash"
                                            ? "Оплата в кассу"
                                            : "Оплата картой"}
                                    </div>
                                )}
                            </div>
                        )}
                    </>

                    <NotificationDropdown />

                    {user && (
                        <div className="header__profile">
                            <Dropdown
                                className="header__profile-dropdown"
                                label={user.email}
                                items={menuItems}
                            />
                            <div
                                className="header__profile-icon"
                                onClick={onGoToProfile}
                            >
                                {user?.avatar ? (
                                    <img
                                        src={user?.avatar}
                                        width="37"
                                        height="37"
                                        alt="avatar"
                                    />
                                ) : (
                                    <img
                                        src={profileIcon}
                                        width="20"
                                        height="21"
                                        alt="profile"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </header>
    );
}
