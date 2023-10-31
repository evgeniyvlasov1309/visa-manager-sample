import { getClassName } from "@shared/utilities/getClassName";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import React, { forwardRef } from "react";
import "./Checkbox.scss";

interface CheckboxProps
    extends DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    > {
    id?: string;
    label: string;
    rounded?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    function Checkbox(props: CheckboxProps, ref) {
        const { label, rounded, id, onChange, style, ...restProps } = props;

        const cssClasses = ["checkbox", rounded ? "rounded" : ""];

        return (
            <label
                style={style}
                className={getClassName(cssClasses)}
                htmlFor={id || ""}
            >
                {label}
                <input
                    ref={ref}
                    type="checkbox"
                    {...restProps}
                    id={id}
                    onChange={onChange}
                />
                <span className="checkmark" />
            </label>
        );
    }
);
