import archiveIcon from "@assets/icons/archive.svg";
import arrowIcon from "@assets/icons/arrow.svg";
import attentionIcon from "@assets/icons/attention.svg";
import chatIcon from "@assets/icons/chat.svg";
import docIcon from "@assets/icons/doc.svg";
import externalWhiteIcon from "@assets/icons/external-white.svg";
import houseIcon from "@assets/icons/house.svg";
import userIcon from "@assets/icons/user.svg";
import Logo from "@assets/images/logo-white.png";
import { useAuthStore } from "@pages/auth/store";
import { getClassName } from "@shared/utilities/getClassName";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.scss";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [user] = useAuthStore((state) => [state.user]);

    function getNavLinkClassname({ isActive }: { isActive: boolean }) {
        return getClassName(["nav__link", isActive ? "active" : ""]);
    }

    useEffect(() => {
        const collapsedValue = localStorage.getItem("collapsed");
        if (collapsedValue) {
            setCollapsed(true);
        }
    }, []);

    function toggle() {
        if (collapsed) {
            localStorage.removeItem("collapsed");
        } else {
            localStorage.setItem("collapsed", JSON.stringify(true));
        }

        setCollapsed((prev) => !prev);
    }

    return (
        <div className={`${collapsed ? "collapsed" : ""} sidebar`}>
            <div className="sidebar__logo-container">
                <div className="sidebar__logo">
                    <img
                        className="sidebar__logo-image"
                        width="91"
                        height="91"
                        src={Logo}
                        alt="logo"
                    />
                    <div className="sidebar__logo-text">
                        Сервис записи в визовые центры
                    </div>
                </div>
            </div>
            <nav className="nav">
                <NavLink to="/" className={getNavLinkClassname}>
                    <img
                        className="nav__link-image"
                        src={houseIcon}
                        alt="house"
                    />
                    {user?.type === "botOwner"
                        ? "Мои доходы и статистика"
                        : "Мои записи"}
                </NavLink>
                {(user?.type === "botOwner" || user?.isAdmin) && (
                    <NavLink to="/withdrawals" className={getNavLinkClassname}>
                        <img
                            className="nav__link-image"
                            src={archiveIcon}
                            alt="archive"
                        />
                        Архив заявок
                    </NavLink>
                )}
                {user?.type !== "botOwner" && (
                    <NavLink to="/record" className={getNavLinkClassname}>
                        <img
                            className="nav__link-image"
                            src={docIcon}
                            alt="records"
                        />
                        Записаться на подачу документов
                    </NavLink>
                )}

                {user?.isAdmin && (
                    <NavLink to="/users" className={getNavLinkClassname}>
                        <img
                            className="nav__link-image"
                            src={userIcon}
                            alt="users"
                        />
                        Пользователи
                    </NavLink>
                )}
                {user?.isAdmin && (
                    <NavLink to="/botowners" className={getNavLinkClassname}>
                        <img
                            className="nav__link-image"
                            src={userIcon}
                            alt="users"
                        />
                        Разработчики
                    </NavLink>
                )}
                <NavLink to="/faq" className={getNavLinkClassname}>
                    <img
                        className="nav__link-image"
                        src={attentionIcon}
                        alt="faq"
                    />
                    Часто задаваемые вопросы
                </NavLink>
                <NavLink to="/support" className={getNavLinkClassname}>
                    <img
                        className="nav__link-image"
                        src={chatIcon}
                        alt="chat"
                    />
                    Служба поддержки
                </NavLink>
            </nav>
            <hr className="sidebar__separator" />
            <div className="sidebar__footer">
                <a
                    className="sidebar__share link"
                    href="https://visabroker.ru/"
                >
                    Курьерьский визовый сервис
                    <img
                        className="link__icon"
                        src={externalWhiteIcon}
                        alt="external link"
                    />
                </a>
                <div className="release-counter">Релиз V.2.9</div>
                <div className="sidebar__collapse-btn" onClick={() => toggle()}>
                    <img
                        className="sidebar__collapse-btn-icon"
                        src={arrowIcon}
                        width={18}
                        height={12}
                        alt="collapse icon"
                    />
                </div>
            </div>
        </div>
    );
}
