import addIcon from "@assets/icons/plus.svg";
import type { User } from "@pages/auth/auth-types";
import { useAuthStore } from "@pages/auth/store";
import { Button } from "@shared/components/ui/Button/Button";
import Table from "@shared/components/ui/Table/Table";
import { debounce } from "@shared/utilities/debounce";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableFilter from "./components/TableFilter/TableFilter";
import { columns } from "./components/tableColumns";
import "./employees.scss";
import { useEmployeesStore } from "./store";

export function EmployeesPage() {
    const navigate = useNavigate();
    const [user] = useAuthStore((state) => [state.user]);
    const [users, filter, limit, page, total, loading, fetchItems] =
        useEmployeesStore((state) => [
            state.users,
            state.filter,
            state.limit,
            state.page,
            state.total,
            state.loading,
            state.fetchItems,
        ]);

    const fetchItemsDebounced = useCallback(debounce(fetchItems, 500), []);
    const agencyId = user?.id;

    useEffect(() => {
        fetchItemsDebounced(agencyId, filter, 0, limit);
    }, [filter]);

    function loadMore() {
        if (page * limit >= total || loading) return;
        fetchItemsDebounced(agencyId, filter, page, limit);
    }

    function navigateToNewEmployee() {
        navigate("/employee");
    }

    function onUserSelect(id: number) {
        navigate(`/user/${id}`);
    }

    return (
        <>
            <div className="table-footer">
                <h1 className="h1">Сотрудники</h1>
                <Button
                    iconRight={addIcon}
                    dense
                    title="Создать сотрудника"
                    onClick={navigateToNewEmployee}
                />
            </div>

            <div className="filters">
                <TableFilter />
                <div className="filters__total">Найдено: {total}</div>
            </div>
            <Table<User>
                columns={columns({
                    onOpen: onUserSelect,
                })}
                loading={page === 0 && loading}
                data={users}
                onBottomReached={loadMore}
                placeholder="На данный момент не добавлено ни одного сотрудника"
            />
        </>
    );
}
