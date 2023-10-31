import arrowIcon from "@assets/icons/arrow-down.svg";
import { TextField } from "@shared/components/ui/TextField/TextField";
import { getClassName } from "@shared/utilities/getClassName";
import React, { useEffect, useRef, useState } from "react";
import "./Dropdown.scss";

interface DropdownItem {
    label: string;
    onClick: () => void;
}

interface DropdownProps {
    label: string;
    items: DropdownItem[];
    search?: boolean;
    className?: string;
}

export default function Dropdown(props: DropdownProps) {
    const { label, items, className, search } = props;
    const [isOpen, setIsOpen] = useState(false);
    const dropdownEl = useRef(null);
    const classNames = ["dropdown", isOpen ? "opened" : "", className];
    const [query, setQuery] = useState("");

    function onClickOutside(e: MouseEvent) {
        if (
            dropdownEl.current &&
            !e.composedPath().includes(dropdownEl.current)
        ) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", onClickOutside);

        return () => {
            document.removeEventListener("click", onClickOutside);
        };
    }, []);

    function onFilterItems(query: string) {
        setQuery(query);
    }

    function onToggleOpen() {
        setIsOpen((prev) => !prev);
        setQuery("");
    }

    return (
        <div className={getClassName(classNames)}>
            <div
                ref={dropdownEl}
                className="dropdown__label"
                onClick={() => onToggleOpen()}
            >
                {label}
                <img
                    className="dropdown__icon"
                    src={arrowIcon}
                    width="10"
                    height="6"
                    alt="icon"
                />
            </div>
            {isOpen && (
                <>
                    <div className="dropdown__list">
                        {search && (
                            <TextField
                                className="dropdown__search"
                                onClick={(e) => e.stopPropagation()}
                                placeholder="Поиск"
                                onChange={(e) => onFilterItems(e.target.value)}
                            />
                        )}
                        {items
                            .filter((item) => item.label.indexOf(query) !== -1)
                            .map((item) => (
                                <div
                                    className="dropdown__item"
                                    key={item.label}
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
