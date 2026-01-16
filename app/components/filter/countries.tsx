'use client';

import React, { useEffect, useRef, useState } from "react";
import ChoicePill from "../pills/choice";
import ChooseHeader from "./chooseheader";
import GlobeIcon from "../icons/Globe";

type CountryOption = {
    code: string;
    name: string;
};

type Props = {
    selectedCountries: string[];
    visible: boolean;
    onToggleCountry: (countryCode: string) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClickOutside?: () => void;
    triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function FilterCountries({
    selectedCountries,
    visible,
    onToggleCountry,
    onClickOutside,
    triggerRef,
}: Readonly<Props>) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const hasFetched = useRef(false);
    const [countries, setCountries] = useState<CountryOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible || hasFetched.current) return;
        const controller = new AbortController();
        const fetchCountries = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2", {
                    signal: controller.signal,
                });
                if (!response.ok) {
                    throw new Error("Failed to load countries");
                }
                const data: Array<{ name?: { common?: string }; cca2?: string }> = await response.json();
                const mapped = data
                    .filter((item) => item.name?.common && item.cca2)
                    .map((item) => ({
                        code: item.cca2 as string,
                        name: item.name?.common as string,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                setCountries(mapped);
                hasFetched.current = true;
            } catch (err) {
                if (controller.signal.aborted) return;
                const message = err instanceof Error ? err.message : "Failed to load countries";
                setError(message);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCountries();
        return () => controller.abort();
    }, [visible]);

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (!containerRef.current) return;
            if (event.target instanceof Node && (containerRef.current.contains(event.target) || triggerRef?.current?.contains(event.target))) {
                return;
            }
            onClickOutside?.();
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [visible, onClickOutside, triggerRef]);

    if (!visible) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                width: "fit-content",
                minWidth: "256px",
                padding: "16px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: "12px",
                borderRadius: "6px",
                background: "var(--Colors-Dropdown-Dropdown-Contents-Card, #E5F4F8)",
                boxShadow: "0 5px 4px 0 rgba(0, 0, 0, 0.15)",
            }}
        >
            <ChooseHeader choose="Country" />
            {loading && (
                <p
                    style={{
                        margin: 0,
                        color: "#6D7FD9",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    Loading countries...
                </p>
            )}
            {error && !loading && (
                <p
                    style={{
                        margin: 0,
                        color: "#D14343",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}
                >
                    {error}
                </p>
            )}
            {!loading && !error && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                        gap: "8px",
                        alignSelf: "stretch",
                        flexWrap: "wrap",
                        maxHeight: "320px",
                        overflowY: "auto",
                        paddingRight: "4px",
                    }}
                >
                    {countries.map((country) => (
                        <li key={country.code} style={{ listStyle: "none" }}>
                            <ChoicePill
                                label={country.name}
                                icon={<GlobeIcon />}
                                selected={selectedCountries.includes(country.code)}
                                onClick={() => onToggleCountry(country.code)}
                            />
                        </li>
                    ))}
                </div>
            )}
        </div>
    );
}
