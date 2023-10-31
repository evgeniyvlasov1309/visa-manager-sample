import type { User } from "@pages/auth/auth-types";
import Table from "@shared/components/ui/Table/Table";
import { debounce } from "@shared/utilities/debounce";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./botOwners.scss";
import TableFilter from "./components/TableFilter/TableFilter";
import { columns } from "./components/tableColumns";
import { useBotOwnersStore } from "./store";

export function BotOwnersPage() {
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
    ] = useBotOwnersStore((state) => [
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

    useEffect(
        () => () => {
            reset();
        },
        []
    );

    useEffect(() => {
        fetchItemsDebounced(filter, 0, limit);
    }, [filter]);

    function loadMore() {
        if (page * limit >= total || loading) return;
        fetchItemsDebounced(filter, page, limit);
    }

    function onUserSelect(id: number) {
        navigate(`/user/${id}`);
    }

    function onSetVip(user: User, value: boolean) {
        updateUser(user.id, {
            ...user,
            vip: value,
        });
    }

    function onChangeCommission(user: User, value: number) {
        updateUser(user.id, {
            ...user,
            commissionPercentage: value,
        });
    }

    return (
        <div className="bot-owners-page">
            <h1 className="h1">Разработчики</h1>
            <div className="filters">
                <TableFilter />
                <div className="filters__total">Найдено: {total}</div>
            </div>
            <Table<User>
                columns={columns({
                    onSetVip: onSetVip,
                    onOpen: onUserSelect,
                    onChangeCommission,
                })}
                loading={page === 0 && loading}
                data={users}
                onBottomReached={loadMore}
                placeholder="Разработчики не найдены"
            />
        </div>
    );
}
