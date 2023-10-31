import { useAuthStore } from "@pages/auth/store";
import { useRecordsStore } from "@pages/home/store";
import type { RecordExpanded } from "@pages/record/record.types";
import { useCountryFilterStore } from "@shared/components/filters/CountryFilter/store";
import { Button } from "@shared/components/ui/Button/Button";
import { useSearchStore } from "@shared/components/ui/Search/store";
import Table from "@shared/components/ui/Table/Table";
import { debounce } from "@shared/utilities/debounce";
import { downloadBase64AsPDF } from "@shared/utilities/downloadBase64ToPdf";
import React, { useCallback, useEffect, useState } from "react";
import { columns } from "./components/tableColumns";
import { withdrawalRecordColumns } from "./components/withdrawalRecordColumns";
import { useWithdrawasStore } from "./store";
import type { Withdrawal } from "./types";
import "./withdrawals.scss";

export function WithdrawalsPage() {
    const [
        withdrawals,
        filter,
        limit,
        page,
        total,
        loading,
        current,
        fetchItems,
        reset,
        setCurrent,
    ] = useWithdrawasStore((state) => [
        state.withdrawals,
        state.filter,
        state.limit,
        state.page,
        state.total,
        state.loading,
        state.current,
        state.fetchItems,
        state.reset,
        state.setCurrent,
    ]);

    const [
        records,
        recordsFilter,
        updateRecordsFilter,
        recordsLimit,
        recordsPage,
        recordsTotal,
        recordsLoading,
        fetchRecordItems,
        resetRecordsStore,
        setRecords,
        approveItem,
        declineItem,
        confirmItem,
    ] = useRecordsStore((state) => [
        state.records,
        state.filter,
        state.updateFilter,
        state.limit,
        state.page,
        state.total,
        state.loading,
        state.fetchItems,
        state.reset,
        state.setRecords,
        state.approveItem,
        state.declineItem,
        state.confirmItem,
    ]);

    const [semaphore, updateSemaphore] = useState(false);

    const [user] = useAuthStore((state) => [state.user]);
    const [search, updateSearch] = useSearchStore((state) => [
        state.search,
        state.updateSearch,
    ]);

    useEffect(
        () => () => {
            updateSearch("");
            resetRecordsStore();
            reset();
        },
        []
    );

    const fetchRecordItemsDebounced = useCallback(
        debounce(fetchRecordItems, 500),
        []
    );

    useEffect(() => {
        fetchRecordItemsDebounced(recordsFilter, "", 0, limit);
    }, [semaphore, recordsFilter]);

    const fetchItemsDebounced = useCallback(debounce(fetchItems, 500), []);

    const [country] = useCountryFilterStore((state) => [state.country]);

    useEffect(() => {
        fetchItemsDebounced(filter, 0, limit);
    }, [filter, search, country]);

    function onWithdrawalSelect(value: Withdrawal) {
        resetRecordsStore();
        setCurrent(value);
        updateRecordsFilter({
            ...recordsFilter,
            withdrawalId: value.id.toString(),
        });
    }

    function loadMore() {
        if (page * limit >= total || loading) return;
        fetchItemsDebounced(filter, page, limit);
    }

    function loadMoreRecords() {
        if (recordsPage * recordsLimit >= recordsTotal || recordsLoading)
            return;
        fetchRecordItemsDebounced(recordsFilter, recordsPage, recordsLimit);
    }

    async function onApproveRecord(id: number) {
        // eslint-disable-next-line no-restricted-globals
        const shouldApprove = confirm("Подтвердить запись на вывод средств?");
        if (shouldApprove) {
            await approveItem(id);
            updateSemaphore((prev) => !prev);
        }
    }

    async function onDeclineRecord(id: number) {
        // eslint-disable-next-line no-restricted-globals
        const shouldDecline = confirm("Отклонить запись на вывод средств?");
        if (shouldDecline) {
            await declineItem(id);
            updateSemaphore((prev) => !prev);
        }
    }

    async function onConfirmPayment(id: number) {
        // eslint-disable-next-line no-restricted-globals
        const shouldConfirm = confirm("Подтвердить факт оплаты записи?");
        if (shouldConfirm) {
            await confirmItem(id);
            updateSemaphore((prev) => !prev);
        }
    }

    function onDownloadConfirmationFile(file: string, id: number) {
        downloadBase64AsPDF(file, `Запись-${id}`);
    }

    function goBack() {
        setCurrent(null);
    }

    return (
        <>
            <div className="table-footer">
                <h1 className="h1">Архив заявок на вывод средств</h1>
            </div>
            {!current && (
                <>
                    <div className="filters">
                        <div className="filters__total">Найдено: {total}</div>
                    </div>
                    <Table<Withdrawal>
                        columns={columns()}
                        loading={page === 0 && loading}
                        data={withdrawals}
                        placeholder={`На данный момент заявок на вывод средств нет.`}
                        onBottomReached={loadMore}
                        onRowClick={onWithdrawalSelect}
                    />
                </>
            )}

            {current && (
                <>
                    <div className="filters">
                        <Button
                            title="Назад к списку заявок"
                            dense
                            onClick={goBack}
                        />
                        <div className="filters__total">
                            Найдено: {recordsTotal}
                        </div>
                    </div>
                    <div className="withdrawal-detail">
                        <h3 className="withdrawal-detail__info-item">
                            Номер заявки - {current.id}
                        </h3>
                        <h3 className="withdrawal-detail__info-item">
                            Сумма: - {current.amount}
                        </h3>
                        <h3 className="withdrawal-detail__info-item">
                            Разработчик: - {current.userEmail}
                        </h3>
                    </div>

                    <Table<RecordExpanded>
                        columns={withdrawalRecordColumns({
                            user: user,
                            isAdmin: user?.isAdmin || false,
                            country: country,
                            onApprove: onApproveRecord,
                            onDecline: onDeclineRecord,
                            onConfirmPayment: onConfirmPayment,
                            onDownloadConfirmationFile,
                        })}
                        loading={recordsPage === 0 && recordsLoading}
                        data={records}
                        placeholder={
                            user?.type === "botOwner"
                                ? `На данный момент записанных заявителей нет.`
                                : undefined
                        }
                        onBottomReached={loadMoreRecords}
                    />
                </>
            )}
        </>
    );
}
