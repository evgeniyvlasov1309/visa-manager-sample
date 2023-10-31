import { useAuthStore } from "@pages/auth/store";
import { useWithdrawasStore } from "@pages/withdrawals/store";
import CountryFilter from "@shared/components/filters/CountryFilter/CountryFilter";
import DropdownSelect from "@shared/components/ui/DropdownSelect/DropdownSelect";
import React, { useCallback, useEffect, useMemo } from "react";
import "./TableFilter.scss";

interface TableFilterProps {
    countriesEnabled?: boolean;
}

export default function TableFilter(props: TableFilterProps) {
    const { countriesEnabled = true } = props;

    const [filter, updateFilter] = useWithdrawasStore((state) => [
        state.filter,
        state.updateFilter,
    ]);

    const [user, users, getUsers] = useAuthStore((state) => [
        state.user,
        state.users,
        state.getUsers,
    ]);

    const userOptions = useMemo(() => {
        const result = (users || []).map((user) => ({
            label: user.email,
            value: String(user.id),
        }));
        result.unshift({ label: "Все", value: "" });
        return result;
    }, [users]);

    useEffect(() => {
        getUsers();
    }, []);

    const filterUpdateHandler = useCallback(
        (prop: string) => (value: string) => {
            updateFilter({ ...filter, [prop]: value });
        },
        []
    );

    return (
        <div className="table-filter">
            <div className="table-filter__filters">
                {countriesEnabled && <CountryFilter />}
                <div className="table-filter__item">
                    <DropdownSelect
                        current={filter.status}
                        prefix="Статус оплаты: "
                        items={[
                            { label: "все", value: "" },
                            { label: "Оплачен", value: "approved" },
                            { label: "Не оплачен", value: "not-paid" },
                            { label: "Отклонено", value: "declined" },
                            { label: "Ожидает", value: "pending" },
                        ]}
                        onSelect={filterUpdateHandler("status")}
                    />
                </div>
                {user?.isAdmin && (
                    <div className="table-filter__item">
                        <DropdownSelect
                            current={filter.userId}
                            prefix="Агент: "
                            items={userOptions}
                            search
                            onSelect={filterUpdateHandler("userId")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
