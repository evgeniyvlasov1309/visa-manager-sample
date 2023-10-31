import { PATHS } from "@scripts/router";
import { Loader } from "@shared/components/ui/Loader/Loader";
import { useAuth } from "@shared/hooks/use-auth";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateOutlet() {
    const authState = useAuth();

    switch (authState) {
        case "loading":
            return <Loader />;
        case "auth":
            return <Outlet />;
        case "unauthorized":
        default:
            return <Navigate to={PATHS.AUTH} />;
    }
}
