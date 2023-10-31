export interface TableFilterState {
    sort: string;
    status: string;
    userId: string;
    paidToBotOwnerStatus: string;
}

export interface WithdrawalsStore {
    withdrawals: Withdrawal[];
    total: number;
    page: number;
    limit: number;
    loading: boolean;
    filter: TableFilterState;
    selected: number[];
    current: Nullable<Withdrawal>;
    fetchItems: (filter: TableFilterState, page: number, limit: number) => void;
    updateFilter: (filter: TableFilterState) => void;
    deleteItem: (id: number) => void;
    reset: () => void;
    setWithdrawals: (value: Withdrawal[]) => void;
    setCurrent: (value: Nullable<Withdrawal>) => void;
    resetPage: () => void;
}

export interface Withdrawal {
    id: number;
    amount: number;
    status: string;
    userEmail: string;
    records: number[];
    adminComment: string;
    userId: number;
    createdAt: string;
}
