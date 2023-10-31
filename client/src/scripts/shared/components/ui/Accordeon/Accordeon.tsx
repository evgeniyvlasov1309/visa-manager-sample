import arrowIcon from "@assets/icons/arrow.svg";
import { getClassName } from "@shared/utilities/getClassName";
import React, { useState } from "react";
import "./Accordeon.scss";

interface AccordeonProps {
    title: string;
    content: string;
    collapsed?: boolean;
}

export const Accordeon = function ({
    title,
    content,
    collapsed = true,
}: AccordeonProps) {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);

    return (
        <div className="accordeon">
            <div
                className="accordeon__header"
                onClick={() => setIsCollapsed((prev) => !prev)}
            >
                {title}
                <img
                    className={getClassName([
                        "accordeon__header-icon",
                        isCollapsed ? "collapsed" : "",
                    ])}
                    src={arrowIcon}
                    alt="arrow"
                />
            </div>
            <div
                className={getClassName([
                    `accordeon__content-container`,
                    isCollapsed ? "collapsed" : "",
                ])}
            >
                <div className="accordeon__content">{content}</div>
            </div>
        </div>
    );
};
