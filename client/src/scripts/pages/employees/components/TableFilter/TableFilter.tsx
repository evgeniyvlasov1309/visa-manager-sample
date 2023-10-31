import { useEmployeesStore } from "@pages/employees/store";
import DropdownSelect from "@shared/components/ui/DropdownSelect/DropdownSelect";
import React, { useCallback } from "react";
import "./TableFilter.scss";

export default function TableFilter() {
    const [filter, updateFilter] = useEmployeesStore((state) => [
        state.filter,
        state.updateFilter,
    ]);

    const filterUpdateHandler = useCallback(
        (prop: string) => (value: string) => {
            updateFilter({ ...filter, [prop]: value });
        },
        []
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
                                label: "По дате добавления (по возрастанию)",
                                value: "createdAt_ASC",
                            },
                            {
                                label: "По дате добавления (по убыванию)",
                                value: "createdAt_DESC",
                            },
                            {
                                label: "По дате записи (по возрастанию)",
                                value: "recordingDate_ASC",
                            },
                            {
                                label: "По дате записи (по убыванию)",
                                value: "recordingDate_DESC",
                            },
                        ]}
                        onSelect={filterUpdateHandler("sort")}
                    />
                </div>
            </div>
        </div>
    );
}
