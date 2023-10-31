import externalIcon from "@assets/icons/external.svg";
import authImage from "@assets/images/auth.png";
import Logo from "@assets/images/logo.png";
import type { ReactElement } from "react";
import React from "react";
import { useLocation } from "react-router-dom";
import "./AuthLayout.scss";

interface LayoutProps {
    children: ReactElement;
}

export default function AuthLayout(props: LayoutProps) {
    const location = useLocation();

    const isHiddenAuth = location.pathname === "/auth";

    return (
        <div className="auth-layout">
            <div
                className={`auth-layout__content ${
                    !isHiddenAuth ? "auth-layout__content--secret" : ""
                }`}
            >
                <div className="auth-page__header">
                    {!isHiddenAuth && (
                        <img
                            className="auth-page__header-logo"
                            width="74"
                            height="74"
                            src={Logo}
                            alt="Логотип"
                        />
                    )}
                </div>
                <div className="auth-page__form-container">
                    {props.children}
                </div>
                {!isHiddenAuth && (
                    <div className="auth-page__footer">
                        <a className="link" href="https://visabroker.ru/">
                            Курьерьский визовый сервис
                            <img
                                className="link__icon"
                                src={externalIcon}
                                alt="external link"
                            />
                        </a>
                    </div>
                )}
            </div>
            {!isHiddenAuth && (
                <img
                    src={authImage}
                    className="auth-page__image"
                    alt="passport"
                />
            )}
        </div>
    );
}
