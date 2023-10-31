import { getClassName } from "@shared/utilities/getClassName";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import React, { forwardRef } from "react";
import "./TextField.scss";

interface TextFieldProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    icon?: string;
    label?: string;
    errorMessage?: string;
    hidden?: boolean;
    flat?: boolean;
    uppercase?: boolean;
    inputRenderer?: () => React.ReactNode;
    labelRenderer?: () => React.ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    function TextField(props: TextFieldProps, ref) {
        const {
            label,
            icon,
            className = "",
            errorMessage,
            style,
            hidden,
            uppercase,
            flat,
            inputRenderer,
            labelRenderer,
            ...otherProps
        } = props;

        const cssClasses = [
            "text-field",
            errorMessage ? "error" : "",
            flat ? "flat" : "",
            icon ? "icon" : "",
            uppercase ? "uppercase" : "",
            hidden ? "hidden" : "",
            className,
        ];

        return (
            <div className={getClassName(cssClasses)} style={style}>
                {labelRenderer ? (
                    labelRenderer()
                ) : (
                    <div className="text-field__label">{label}</div>
                )}

                <div className="text-field__input-container">
                    {icon && (
                        <img
                            className="text-field__icon"
                            src={icon}
                            alt="icon"
                        />
                    )}
                    {inputRenderer ? (
                        inputRenderer()
                    ) : (
                        <input
                            className="text-field__input"
                            ref={ref}
                            {...otherProps}
                        />
                    )}
                </div>
                {errorMessage && (
                    <span className="text-field__error">{errorMessage}</span>
                )}
            </div>
        );
    }
);
