import { Loader } from "@shared/components/ui/Loader/Loader";
import React from "react";
import type { ReactElement } from "react";

interface LoaderProps {
    children: ReactElement;
    loading: boolean;
}

export default function WithLoading(props: LoaderProps) {
    const { loading, children } = props;
    return <>{loading ? <Loader /> : children}</>;
}
