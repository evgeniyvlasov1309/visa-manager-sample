import CountryChip from "@shared/components/filters/CountryFilter/components/CountryChip/CountryChip";

import React from "react";
import "./CountryFilter.scss";
import { countries } from "./countries";
import { useCountryFilterStore } from "./store";

interface CountryFilterProps {
    allowAll?: boolean;
}

export default function CountryFilter(props: CountryFilterProps) {
    const { allowAll = true } = props;
    const [current, setCountry] = useCountryFilterStore((state) => [
        state.country,
        state.setCountry,
    ]);

    function onSelectHandler(value: string) {
        setCountry(value);
    }

    return (
        <div className="country-filter">
            {allowAll && (
                <CountryChip
                    className="all"
                    label="Все страны"
                    active={current === ""}
                    onClick={() => onSelectHandler("")}
                />
            )}
            {countries.map((country) => (
                <CountryChip
                    img={country.flag}
                    label={country.label}
                    active={current === country.value}
                    onClick={() => onSelectHandler(country.value)}
                    key={country.label}
                />
            ))}
        </div>
    );
}
