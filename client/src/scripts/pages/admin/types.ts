export interface BotRequest {
    userId: number;
    country: string;
}

export interface Bot {
    id: number;
    userId: number;
    country: string;
    apiKey: string;
    createdAt: string;
}
