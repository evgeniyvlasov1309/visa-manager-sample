import { getClassName } from "@shared/utilities/getClassName";
import React from "react";
import "./NotificationTile.scss";

export type Status =
    | "success"
    | "error"
    | "progress"
    | "pending"
    | "info"
    | "canceled";

interface NotificationTileProps {
    text: string;
    status: Status;
}

export default function NotificationTile(props: NotificationTileProps) {
    const { status, text } = props;

    const classNames = ["notification-tile", `notification-tile--${status}`];

    return <div className={getClassName(classNames)}>{text}</div>;
}
