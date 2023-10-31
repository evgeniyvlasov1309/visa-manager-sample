import type { Status } from "@shared/components/ui/Tile/Tile";

export interface NotificationsStore {
    undelivereditems: Notification[];
    delivereditems: Notification[];
    loading: boolean;
    offset: number;
    limit: number;
    error: string;
    showDelivered: boolean;
    fetchItems: () => void;
    markAsRead: (id: number) => void;
    setShowDelivered: (value: boolean) => void;
}

export interface NotificationsFilter {
    delivered: boolean;
}

export interface Notification {
    id: number;
    delivered: boolean;
    title: string;
    description: string;
    message: string;
    recordStatus: Status;
    payment: boolean;
    postPayment: boolean;
    paymentCode: number;
    userId: number;
    recordId: number;
    country: string;
    createdAt: string;
}
