import { getClassName } from "@shared/utilities/getClassName";
import React from "react";
import "./CountryChip.scss";

interface ChipProps {
    label: string;
    active: boolean;
    img?: string;
    className?: string;
    onClick: () => void;
}

export default function CountryChip(props: ChipProps) {
    const { label, active, img, className, onClick } = props;

    const classNames = [
        "country-chip",
        active ? "active" : "",
        className || "",
    ];

    return (
        <div className={getClassName(classNames)} onClick={onClick}>
            {img && (
                <img className="country-chip__image" src={img} alt={label} />
            )}
            {label}
        </div>
    );
}
