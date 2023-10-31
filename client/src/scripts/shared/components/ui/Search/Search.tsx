import searchIcon from "@assets/icons/search.svg";
import { TextField } from "@shared/components/ui/TextField/TextField";
import debounce from "lodash.debounce";
import type { FormEvent } from "react";
import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchStore } from "./store";

export default function Search() {
    const navigate = useNavigate();
    const [search, updateSearch] = useSearchStore((state) => [
        state.search,
        state.updateSearch,
    ]);

    const location = useLocation();

    const onSearchHanderDebounced = useCallback(
        debounce(() => navigate("/"), 1000),
        []
    );

    useEffect(() => {
        if (location.pathname === "/" || !search) return;
        onSearchHanderDebounced();
    }, [search]);

    function onSearch(e: FormEvent<HTMLInputElement>) {
        updateSearch((e.target as HTMLInputElement).value);
    }
    return (
        <TextField
            value={search}
            className="header__search-input"
            icon={searchIcon}
            placeholder="Поиск по заявителю"
            onInput={onSearch}
        />
    );
}
