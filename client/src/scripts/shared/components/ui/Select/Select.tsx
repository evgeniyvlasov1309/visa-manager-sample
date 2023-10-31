import { getClassName } from "@shared/utilities/getClassName";
import type { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import React, { forwardRef } from "react";
import "./Select.scss";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps
    extends DetailedHTMLProps<
        SelectHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    > {
    items: SelectOption[];
    icon?: string;
    label?: string;
    hidden?: boolean;
    errorMessage?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    function Select(props: SelectProps, ref) {
        const {
            items = [],
            label,
            icon,
            className = "",
            errorMessage,
            placeholder,
            style,
            onInput,
            hidden,
            ...otherProps
        } = props;

        const cssClasses = [
            "select",
            errorMessage ? "error" : "",
            icon ? "icon" : "",
            hidden ? "hidden" : "",
            className,
        ];

        return (
            <label className={getClassName(cssClasses)} style={style}>
                <div className="select__label">{label}</div>

                <div className="select__el-container">
                    {icon && (
                        <img className="select__icon" src={icon} alt="icon" />
                    )}
                    <select
                        className="select__el"
                        ref={ref}
                        {...otherProps}
                        onInput={onInput}
                    >
                        <option value="" hidden={true}>
                            {placeholder}
                        </option>
                        {items.map((item) => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>
                {errorMessage && (
                    <span className="select__error">{errorMessage}</span>
                )}
            </label>
        );
    }
);
