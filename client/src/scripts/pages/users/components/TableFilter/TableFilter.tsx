import { useAuthStore } from "@pages/auth/store";
import { useUsersStore } from "@pages/users/store";
import DropdownSelect from "@shared/components/ui/DropdownSelect/DropdownSelect";
import { TextField } from "@shared/components/ui/TextField/TextField";
import React, { useCallback, useEffect, useMemo } from "react";
import "./TableFilter.scss";

export default function TableFilter() {
    const [filter, updateFilter] = useUsersStore((state) => [
        state.filter,
        state.updateFilter,
    ]);

    const [user, users, getUsers] = useAuthStore((state) => [
        state.user,
        state.users,
        state.getUsers,
    ]);

    const userTypeOptions = useMemo(
        () => [
            {
                value: "",
                label: "Все",
            },
            {
                value: "person",
                label: "Частное лицо",
            },
            {
                value: "company",
                label: "Компания",
            },
        ],
        [users]
    );

    useEffect(() => {
        getUsers();
    }, []);

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
                        current={filter.type}
                        prefix="Тип пользователя: "
                        items={userTypeOptions}
                        onSelect={filterUpdateHandler("type")}
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
