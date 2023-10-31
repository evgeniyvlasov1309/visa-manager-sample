import { useAuthStore } from "@pages/auth/store";
import { useRecordsStore } from "@pages/home/store";
import { useWithdrawasStore } from "@pages/withdrawals/store";
import CountryFilter from "@shared/components/filters/CountryFilter/CountryFilter";
import DropdownSelect from "@shared/components/ui/DropdownSelect/DropdownSelect";
import React, { useCallback, useEffect, useMemo } from "react";
import "./TableFilter.scss";

export default function TableFilter() {
    const [filter, updateFilter] = useRecordsStore((state) => [
        state.filter,
        state.updateFilter,
    ]);

    const [user, users, getUsers] = useAuthStore((state) => [
        state.user,
        state.users,
        state.getUsers,
    ]);

    const [withdrawals, getWithdrawals] = useWithdrawasStore((state) => [
        state.withdrawals,
        state.fetchItems,
    ]);

    const userOptions = useMemo(() => {
        const employees = users.filter((u) => u.agencyId === user?.id);

        const result = ((user?.isAdmin ? users : employees) || []).map(
            (user) => ({
                label: user.email,
                value: String(user.id),
            })
        );
        result.unshift({ label: "Все", value: "" });
        return result;
    }, [users]);

    const withdrawalOptions = useMemo(() => {
        const result = (withdrawals || []).map((w) => ({
            label: String(w.id),
            value: String(w.id),
        }));
        result.unshift({ label: "Все", value: "" });
        return result;
    }, [withdrawals]);

    useEffect(() => {
        getUsers();
        getWithdrawals({} as any, 0, 500);
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
                <CountryFilter />
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
                {user?.type !== "botOwner" && (
                    <>
                        <div className="table-filter__item">
                            <DropdownSelect
                                current={filter.status}
                                prefix="Статус записи: "
                                items={[
                                    { label: "все", value: "" },
                                    { label: "Активные", value: "active" },
                                    { label: "Записан", value: "success" },
                                    { label: "В работе", value: "progress" },
                                    { label: "Ожидает", value: "pending" },
                                    { label: "Ошибка", value: "error" },
                                    { label: "Отмена", value: "canceled" },
                                ]}
                                onSelect={filterUpdateHandler("status")}
                            />
                        </div>
                        <div className="table-filter__item">
                            <DropdownSelect
                                current={filter.payment}
                                prefix="Статус оплаты: "
                                items={[
                                    { label: "все", value: "" },
                                    { label: "Оплачен", value: "true" },
                                    { label: "Не оплачен", value: "false" },
                                ]}
                                onSelect={filterUpdateHandler("payment")}
                            />
                        </div>
                    </>
                )}
                {user?.type === "botOwner" && (
                    <div className="table-filter__item">
                        <DropdownSelect
                            current={filter.paidToBotOwnerStatus}
                            prefix="Статус оплаты: "
                            items={[
                                { label: "все", value: "" },
                                { label: "Одобрен вывод", value: "approved" },
                                { label: "Оплачено", value: "completed" },
                                { label: "Не оплачено", value: "not-paid" },
                                { label: "Отклонено", value: "declined" },
                                { label: "Ожидает проверки", value: "pending" },
                            ]}
                            onSelect={filterUpdateHandler(
                                "paidToBotOwnerStatus"
                            )}
                        />
                    </div>
                )}
                {(user?.isAdmin || user?.type === "company") && (
                    <div className="table-filter__item">
                        <DropdownSelect
                            current={filter.userId}
                            prefix={user?.isAdmin ? "Агент: " : "Сотрудник: "}
                            items={userOptions}
                            search
                            onSelect={filterUpdateHandler("userId")}
                        />
                    </div>
                )}
                {(user?.isAdmin || user?.type === "botOwner") && (
                    <div className="table-filter__item">
                        <DropdownSelect
                            current={filter.withdrawalId}
                            prefix="Номер заявки: "
                            items={withdrawalOptions}
                            search
                            onSelect={filterUpdateHandler("withdrawalId")}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
