import RecordService from "@pages/record/record-service";
import type {
    Price,
    Record,
    RecordExpanded,
    RecordRequest,
} from "@pages/record/record.types";
import { useCountryFilterStore } from "@shared/components/filters/CountryFilter/store";
import { create } from "zustand";
import type { RecordsStore } from "./types";

const initialState = {
    records: [],
    prices: [],
    selected: [],
    total: 0,
    loading: true,
    page: 0,
    limit: 50,
    current: null,
    botOwnerStatistics: [],
    refresh: false,
    filter: {
        sort: "createdAt_DESC",
        status: "",
        payment: "",
        userId: "",
        paidToBotOwnerStatus: "",
        withdrawalId: "",
    },
};

export const useRecordsStore = create<RecordsStore>((set, get) => ({
    ...initialState,
    updateFilter: (filter) => {
        set({ filter });
    },
    fetchPrices: async () => {
        RecordService.getPrices().then((prices) => {
            set((state) => ({ prices }));
        });
    },
    fetchBotOwnerStatistics: async (id: number) => {
        RecordService.getBotOwnerStatistics(id).then((result) => {
            set({ botOwnerStatistics: result });
        });
    },
    updatePrices: async (prices: Price[]) => {
        RecordService.updatePrices(prices).then((prices) => set({ prices }));
    },
    fetchItems: async (filter, search, page, limit) => {
        if (page === 0) {
            get().resetPage();
        }
        set({ loading: true });

        RecordService.getRecords({
            ...filter,
            destinationCountry: useCountryFilterStore.getState().country,
            search,
            offset: page * limit,
            limit,
        })
            .then(({ count, rows }) => {
                set({ total: count });
                return processRecords(rows);
            })
            .then((data) => {
                set((state) => ({ records: [...state.records, ...data] }));
            })
            .finally(() => set({ loading: false, page: page + 1 }));
    },
    deleteItem: async (id: number) => {
        await RecordService.removeRecord(id);
        set((state) => ({
            records: state.records.filter((item) => item.id !== id),
        }));
    },
    approveItem: async (id: number) => {
        await RecordService.editRecord(id, {
            paidToBotOwnerStatus: "approved",
        } as RecordRequest);
    },
    declineItem: async (id: number) => {
        await RecordService.editRecord(id, {
            paidToBotOwnerStatus: "declined",
        } as RecordRequest);
    },
    confirmItem: async (id: number) => {
        await RecordService.editRecord(id, {
            paidToBotOwnerStatus: "completed",
        } as RecordRequest);
    },
    setRecords: (value: RecordExpanded[]) => set({ records: value }),
    setSelected: (value: number[]) => set({ selected: value }),
    reset: () => set(initialState),
    resetPage: () => set({ page: 0, records: [], total: 0 }),
    setCurrent: (value: Nullable<Record>) => set({ current: value }),
    update: () => set((state) => ({ refresh: !state.refresh })),
}));

function processRecords(records: Record[]) {
    const applicants = records
        .map((item) =>
            item.applicants.map((applicant, index) => ({
                ...item,
                recordId: item.id,
                price: item.price / item.applicants.length,
                group: item.applicants.length > 1,
                groupFirstEl: item.applicants.length > 1 && index === 0,
                confirmationFileExists: !!item.confirmationFile && index === 0,
                editable: item.editable && index === 0,
                removable: item.removable && index === 0,
                canChangeBotPaymentStatus:
                    item.paidToBotOwnerStatus === "pending" &&
                    item?.withdrawalId &&
                    index === 0,
                applicantError: applicant.error,
                surname:
                    item.destinationCountry === "Ch"
                        ? item.surname
                        : applicant.surname,
                firstName:
                    item.destinationCountry === "Ch"
                        ? item.firstName
                        : applicant.firstName,
                passportNumber: applicant.passportNumber,
                applicationNumber: applicant.applicationNumber,
                disabled:
                    item.paidToBotOwnerStatus !== "not-paid" ||
                    !!item.paymentCode,
            }))
        )
        .flat();

    return applicants;
}
