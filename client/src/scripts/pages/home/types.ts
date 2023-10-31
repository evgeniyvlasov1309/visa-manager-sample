import type { BotOwnerStatictic } from "@pages/profile/types";
import type { Price, Record, RecordExpanded } from "@pages/record/record.types";

export interface TableFilterState {
    sort: string;
    status: string;
    payment: string;
    userId: string;
    paidToBotOwnerStatus: string;
    withdrawalId: string;
}

export interface RecordsStore {
    prices: Price[];
    botOwnerStatistics: BotOwnerStatictic[];
    records: RecordExpanded[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    filter: TableFilterState;
    selected: number[];
    current: Nullable<Record>;
    refresh: boolean;
    fetchItems: (
        filter: TableFilterState,
        search: string,
        page: number,
        limit: number
    ) => void;
    fetchPrices: () => Promise<void>;
    fetchBotOwnerStatistics: (id: number) => Promise<void>;
    updatePrices: (prices: Price[]) => void;
    updateFilter: (filter: TableFilterState) => void;
    deleteItem: (id: number) => void;
    approveItem: (id: number) => void;
    declineItem: (id: number) => void;
    confirmItem: (id: number) => void;
    reset: () => void;
    setRecords: (value: RecordExpanded[]) => void;
    setSelected: (value: number[]) => void;
    setCurrent: (value: Nullable<Record>) => void;
    resetPage: () => void;
    update: () => void;
}
