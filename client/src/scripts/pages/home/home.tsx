import addIcon from "@assets/icons/plus.svg";
import { useAuthStore } from "@pages/auth/store";
import RecordService from "@pages/record/record-service";
import type { RecordExpanded, RecordRequest } from "@pages/record/record.types";
import UserService from "@pages/users/user-service";
import { useCountryFilterStore } from "@shared/components/filters/CountryFilter/store";
import { Button } from "@shared/components/ui/Button/Button";
import Modal from "@shared/components/ui/Modal/Modal";
import { useSearchStore } from "@shared/components/ui/Search/store";
import Table from "@shared/components/ui/Table/Table";
import { TextArea } from "@shared/components/ui/Textarea/Textarea";
import { debounce } from "@shared/utilities/debounce";
import { downloadBase64AsPDF } from "@shared/utilities/downloadBase64ToPdf";
import { getRandomNumber } from "@shared/utilities/getRandomNumber";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableFilter from "./components/TableFilter/TableFilter";
import { columns } from "./components/tableColumns";
import "./home.scss";
import { useRecordsStore } from "./store";

export function HomePage() {
    const [
        records,
        filter,
        limit,
        page,
        total,
        loading,
        fetchItems,
        deleteItem,
        reset,
        setRecords,
        approveItem,
        declineItem,
        confirmItem,
        refresh,
    ] = useRecordsStore((state) => [
        state.records,
        state.filter,
        state.limit,
        state.page,
        state.total,
        state.loading,
        state.fetchItems,
        state.deleteItem,
        state.reset,
        state.setRecords,
        state.approveItem,
        state.declineItem,
        state.confirmItem,
        state.refresh,
    ]);

    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentComment, setPaymentComment] = useState("");
    const [paymentCode, setPaymentCode] = useState(0);
    const [semaphore, updateSemaphore] = useState(false);

    const [user] = useAuthStore((state) => [state.user]);
    const [search, updateSearch] = useSearchStore((state) => [
        state.search,
        state.updateSearch,
    ]);
    const [recordToPay, setRecordToPay] =
        useState<Nullable<RecordExpanded>>(null);
    const [selected, setSelected, fetchPrices] = useRecordsStore((state) => [
        state.selected,
        state.setSelected,
        state.fetchPrices,
    ]);

    const navigate = useNavigate();

    useEffect(
        () => () => {
            updateSearch("");
            reset();
        },
        []
    );

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchItemsDebounced = useCallback(debounce(fetchItems, 500), []);

    const [country] = useCountryFilterStore((state) => [state.country]);

    useEffect(() => {
        fetchItemsDebounced(filter, search, 0, limit);
    }, [filter, search, country, semaphore, refresh]);

    function navigateToEditRecord(id: number) {
        navigate(`/record/${id}`);
    }

    function deleteRecord(id: number) {
        // eslint-disable-next-line no-restricted-globals
        const shouldRemove = confirm("Удалить запись?");
        if (shouldRemove) {
            deleteItem(id);
        }
    }

    async function onPayRecord(record: RecordExpanded) {
        setRecordToPay(record);
        setPaymentCode(getRandomNumber(10000, 99999));
        if (user?.paymentMethod === "cash") {
            setPaymentModal(true);
        } else {
            const { url } = await UserService.createPayment({
                type: "card",
                selected: [record.id],
                code: paymentCode,
                comment: "",
            });
            window.location.href = url;
        }
    }

    async function onPaySelectedConfirm() {
        if (!recordToPay) return;
        await UserService.createPayment({
            type: "cash",
            selected: [recordToPay.id],
            code: paymentCode,
            comment: paymentComment,
        });
        setPaymentModal(false);
        setSelected([]);
        updateSemaphore((prev) => !prev);
    }

    function navigateToNewRecord() {
        navigate("/record");
    }

    function loadMore() {
        if (page * limit >= total || loading) return;
        fetchItemsDebounced(filter, search, page, limit);
    }

    async function onSelectRecord(id: number, value: boolean) {
        const target = records.find((record) => record.id === id);
        if (!target) return;
        if (value) {
            const newIds = [...selected.filter((item) => item !== id), id];
            setSelected(newIds);
            if (user?.isAdmin) {
                await RecordService.editRecord(id, {
                    postPayment: true,
                } as RecordRequest);
                target.postPayment = true;
                setRecords([...records]);
            }
        } else {
            setSelected(selected.filter((item) => item !== id));
            if (user?.isAdmin) {
                await RecordService.editRecord(id, {
                    postPayment: false,
                } as RecordRequest);
                target.postPayment = false;
                setRecords([...records]);
            }
        }
    }

    async function onSelectAllRecords(value: boolean) {
        if (value) {
            const newIds = records
                .filter((item) => {
                    if (user?.type === "botOwner") {
                        return item.paidToBotOwnerStatus === "not-paid";
                    }
                    return !item.paymentCode;
                })
                .map((item) => item.id);
            setSelected(newIds);
            if (user?.isAdmin) {
                records.forEach((record) => {
                    record.postPayment = true;
                });
                setRecords([...records]);
                await Promise.all(
                    newIds.map((id) =>
                        RecordService.editRecord(id, {
                            postPayment: true,
                        } as RecordRequest)
                    )
                );
            }
        } else {
            if (user?.isAdmin) {
                records.forEach((record) => {
                    record.postPayment = false;
                });
                setRecords([...records]);
                await Promise.all(
                    selected.map((id) =>
                        RecordService.editRecord(id, {
                            postPayment: false,
                        } as RecordRequest)
                    )
                );
            }
            setSelected([]);
        }
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

    const selectAllDisabled = useMemo(
        () => records.every((r) => r.disabled),
        [records]
    );

    return (
        <>
            <div className="table-footer">
                <h1 className="h1">Записи на подачу документов</h1>
                {user?.type !== "botOwner" && (
                    <Button
                        iconRight={addIcon}
                        dense
                        title="Записаться на подачу документов"
                        onClick={navigateToNewRecord}
                    />
                )}
            </div>
            <div className="filters">
                <TableFilter />
                <div className="filters__total">Найдено: {total}</div>
            </div>
            <Table<RecordExpanded>
                columns={columns({
                    user: user,
                    isAdmin: user?.isAdmin || false,
                    selected: selected,
                    country: country,
                    selectAllDisabled,
                    onEdit: navigateToEditRecord,
                    onDelete: deleteRecord,
                    onPay: onPayRecord,
                    onSelect: onSelectRecord,
                    onSelectAll: onSelectAllRecords,
                    onApprove: onApproveRecord,
                    onDecline: onDeclineRecord,
                    onConfirmPayment: onConfirmPayment,
                    onDownloadConfirmationFile,
                })}
                loading={page === 0 && loading}
                data={records}
                placeholder={
                    user?.type === "botOwner"
                        ? `На данный момент записанных заявителей нет.`
                        : undefined
                }
                onBottomReached={loadMore}
            />
            <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)}>
                <div className="payment-modal">
                    <h2>Заявка на оплату</h2>
                    <p>Сумма: {recordToPay?.price} руб.</p>
                    <p>
                        Код заявки:{" "}
                        <span className="payment-modal__code">
                            {paymentCode}
                        </span>
                    </p>
                    <TextArea
                        value={paymentComment}
                        label="Комментарий"
                        placeholder="Введите комментарий"
                        onChange={(e) => setPaymentComment(e.target.value)}
                    />
                    <Button title="Отправить" onClick={onPaySelectedConfirm} />
                </div>
            </Modal>
        </>
    );
}
