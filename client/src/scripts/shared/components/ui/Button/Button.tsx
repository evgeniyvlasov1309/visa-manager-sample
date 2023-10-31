import { getClassName } from "@shared/utilities/getClassName";
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import React from "react";
import "./Button.scss";

interface ButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    className?: string;
    title: string;
    iconLeft?: string;
    iconRight?: string;
    dense?: boolean;
    variant?: "primary" | "secondary" | "outlined";
    disabled?: boolean;
}

export const Button = function (props: ButtonProps) {
    const {
        type = "button",
        variant = "primary",
        dense,
        title,
        iconLeft,
        iconRight,
        disabled,
        className = "",
        ...otherProps
    } = props;

    const cssClasses = [
        "button",
        variant,
        className,
        dense ? "dense" : "",
        disabled ? "disabled" : "",
    ];

    return (
        <button
            type={type}
            className={getClassName(cssClasses)}
            {...otherProps}
        >
            {iconLeft && (
                <img
                    className="button__icon button__icon--left"
                    src={iconLeft}
                    alt=""
                />
            )}
            {title}
            {iconRight && (
                <img
                    className="button__icon button__icon--right"
                    src={iconRight}
                    alt=""
                />
            )}
        </button>
    );
};
