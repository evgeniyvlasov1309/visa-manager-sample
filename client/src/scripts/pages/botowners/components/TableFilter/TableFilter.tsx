import { useBotOwnersStore } from "@pages/botowners/store";
import DropdownSelect from "@shared/components/ui/DropdownSelect/DropdownSelect";
import { TextField } from "@shared/components/ui/TextField/TextField";
import React, { useCallback } from "react";
import "./TableFilter.scss";

export default function TableFilter() {
    const [filter, updateFilter] = useBotOwnersStore((state) => [
        state.filter,
        state.updateFilter,
    ]);

    const filterUpdateHandler = useCallback(
        (prop: string) => (value: string) => {
            updateFilter({ ...filter, [prop]: value });
        },
        [filter]
    );

    const onSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            filterUpdateHandler("search")(e.target.value);
        },
        [filter]
    );

    return (
        <div className="table-filter">
            <div className="table-filter__filters">
                <div className="table-filter__item">
                    <DropdownSelect
                        current={filter.sort}
                        prefix="Сортировка: "
                        items={[
                            {
                                label: "По имени (по возрастанию)",
                                value: "fio_ASC",
                            },
                            {
                                label: "По имени (по убыванию)",
                                value: "fio_DESC",
                            },
                        ]}
                        onSelect={filterUpdateHandler("sort")}
                    />
                </div>
                <TextField
                    className="table-filter__search-input"
                    value={filter.search}
                    placeholder="Поиск"
                    onChange={onSearch}
                />
            </div>
        </div>
    );
}
