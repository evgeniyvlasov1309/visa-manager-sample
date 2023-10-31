import React from "react";
import type { ReactElement } from "react";
import "./Card.scss";

interface CardProps {
    children: ReactElement;
}

export default function Card(props: CardProps) {
    return <div className="card">{props.children}</div>;
}
