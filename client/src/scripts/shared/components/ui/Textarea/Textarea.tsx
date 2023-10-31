import { getClassName } from "@shared/utilities/getClassName";
import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";
import React, { forwardRef } from "react";
import "./Textarea.scss";

interface TextAreaProps
    extends DetailedHTMLProps<
        TextareaHTMLAttributes<HTMLTextAreaElement>,
        HTMLTextAreaElement
    > {
    icon?: string;
    label?: string;
    errorMessage?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    function TextArea(props: TextAreaProps, ref) {
        const {
            label,
            icon,
            className = "",
            errorMessage,
            style,
            ...otherProps
        } = props;

        const cssClasses = [
            "text-field",
            errorMessage ? "error" : "",
            icon ? "icon" : "",
            className,
        ];

        return (
            <label className={getClassName(cssClasses)} style={style}>
                <div className="text-field__label">{label}</div>
                <div className="text-field__textarea-container">
                    {icon && (
                        <img
                            className="text-field__icon"
                            src={icon}
                            alt="icon"
                        />
                    )}
                    <textarea
                        className="text-field__textarea"
                        ref={ref}
                        {...otherProps}
                    />
                </div>
                {errorMessage && (
                    <span className="text-field__error">{errorMessage}</span>
                )}
            </label>
        );
    }
);
