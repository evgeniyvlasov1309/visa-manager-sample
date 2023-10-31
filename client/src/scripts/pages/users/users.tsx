import type { User } from "@pages/auth/auth-types";
import Table from "@shared/components/ui/Table/Table";
import { debounce } from "@shared/utilities/debounce";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TableFilter from "./components/TableFilter/TableFilter";
import { columns } from "./components/tableColumns";
import { useUsersStore } from "./store";
import "./users.scss";

export function UsersPage() {
    const navigate = useNavigate();
    const [
        users,
        filter,
        limit,
        page,
        total,
        loading,
        fetchItems,
        updateUser,
        reset,
    ] = useUsersStore((state) => [
        state.users,
        state.filter,
        state.limit,
        state.page,
        state.total,
        state.loading,
        state.fetchItems,
        state.updateUser,
        state.reset,
    ]);

    const fetchItemsDebounced = useCallback(debounce(fetchItems, 500), []);

    useEffect(() => {
        fetchItemsDebounced(filter, 0, limit);
    }, [filter]);

    useEffect(
        () => () => {
            reset();
        },
        []
    );

    function loadMore() {
        if (page * limit >= total || loading) return;
        fetchItemsDebounced(filter, page, limit);
    }

    function onUserSelect(id: number) {
        navigate(`/user/${id}`);
    }

    function onSetVip(id: number, user: User, value: boolean) {
        updateUser(id, {
            ...user,
            vip: value,
        });
    }

    function onTogglePaymentMethod(
        id: number,
        user: User,
        paymentMethod: "cash" | "card"
    ) {
        updateUser(id, {
            ...user,
            paymentMethod,
        });
    }

    return (
        <div className="users-page">
            <h1 className="h1">Пользователи</h1>
            <div className="filters">
                <TableFilter />
                <div className="filters__total">Найдено: {total}</div>
            </div>
            <Table<User>
                columns={columns({
                    onSetVip: onSetVip,
                    onOpen: onUserSelect,
                    onTogglePaymentMethod,
                })}
                loading={page === 0 && loading}
                data={users}
                onBottomReached={loadMore}
                placeholder="Пользователи не найдены"
            />
        </div>
    );
}
