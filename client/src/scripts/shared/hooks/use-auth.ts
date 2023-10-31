import AuthService from "@pages/auth/auth-service";
import { useAuthStore } from "@pages/auth/store";
import { useEffect, useState } from "react";

export type AuthState = "loading" | "auth" | "unauthorized";

export function useAuth() {
    const [user, checkAuth] = useAuthStore((state) => [
        state.user,
        state.checkAuth,
    ]);

    const [authState, setAuthState] = useState<AuthState>(
        user ? "auth" : "loading"
    );

    async function checkAuthHandler() {
        const token = AuthService.getToken();

        if (!token) {
            setAuthState("unauthorized");
        } else if (!user) {
            try {
                await checkAuth();
                setAuthState("auth");
            } catch (e) {
                setAuthState("unauthorized");
            }
        }
    }

    useEffect(() => {
        checkAuthHandler();
    }, [user]);

    return authState;
}
