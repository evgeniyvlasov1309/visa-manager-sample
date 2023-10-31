import Dropdown from "@shared/components/ui/Dropdown/Dropdown";
import React, { useState } from "react";

interface DropdownSelectItem {
    label: string;
    value: string;
}

interface DropdownSelectProps {
    prefix: string;
    current?: string;
    items: DropdownSelectItem[];
    search?: boolean;
    onSelect: (value: string) => void;
}

export default function DropdownSelect(props: DropdownSelectProps) {
    const { prefix, items, current, search, onSelect } = props;
    const [selectedItem, setSelectedItem] = useState(
        items.find((item) => item.value === current) || items[0]
    );

    function onSelectHandler(item: DropdownSelectItem) {
        setSelectedItem(item);
        onSelect(item.value);
    }

    return (
        <Dropdown
            label={selectedItem ? `${prefix}${selectedItem.label}` : ""}
            search={search}
            items={items.map((item) => ({
                ...item,
                onClick: () => onSelectHandler(item),
            }))}
        />
    );
}
