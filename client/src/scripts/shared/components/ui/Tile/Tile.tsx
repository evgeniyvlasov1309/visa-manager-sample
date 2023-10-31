import { getClassName } from "@shared/utilities/getClassName";
import React from "react";
import "./Tile.scss";

export type Status =
    | "success"
    | "error"
    | "progress"
    | "pending"
    | "info"
    | "canceled";

interface TileProps {
    text: string;
    status: Status;
}

export default function Tile(props: TileProps) {
    const { status, text } = props;

    const classNames = ["tile", `tile--${status}`];

    return <div className={getClassName(classNames)}>{text}</div>;
}
