'use client';

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchIcon from "../icons/SearchIcon";
import CloseSmallIcon from "../icons/CloseSmallIcon";
import SortIcon from "../icons/SortIcon";
import FilterIcon from "../icons/FilterIcon";
import NumberIcon from "../icons/NumberIcon";
import Az from "../icons/AZ";
import Za from "../icons/ZA";
import CalendarClock from "../icons/CalendarClock";
import {
  DEFAULT_ARTIST_SORT,
  SORT_OPTIONS,
  type ArtistSortValue,
  parseSortParam,
  sortArtists,
} from "../../artists/sortOptions";
import Dropdown from "../dropdown";
import SearchResults from "./results";
import SortArtist from "../sort/sort";
import FilterArtist from "../filter/filter";

type Artist = {
  id: string;
  name: string;
  imageUrl?: string | null;
  debutYear?: number | null;
};

type Props = {
  artists: Artist[];
};

export default function ArtistSearch({ artists }: Readonly<Props>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("q") ?? "";
  const selectedSort = parseSortParam(searchParams.get("sort"));
  const isSortActive = selectedSort !== DEFAULT_ARTIST_SORT;
  const [query, setQuery] = useState(searchValue);
  const [isFocused, setIsFocused] = useState(false);
  const [hoveringResults, setHoveringResults] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const placeholderColor = "var(--Colors-Search-Bar-Placeholder, #6D7FD9)";
  const sortButtonBackground = isSortActive
    ? "#6D7FD9"
    : "var(--Colors-Search-Bar-Fill, #C2D4ED)";
  const sortButtonForeground = isSortActive ? "#F3FDFB" : placeholderColor;
  const textColor = query ? "var(--foreground, #051411)" : placeholderColor;
  const sortButtonRef = useRef<HTMLButtonElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const sortIconForValue = (value: ArtistSortValue) => {
    switch (value) {
      case "roster-asc":
      case "roster-desc":
        return <NumberIcon color={placeholderColor} />;
      case "name-asc":
        return <Az color={placeholderColor} />;
      case "name-desc":
        return <Za color={placeholderColor} />;
      case "debut-asc":
      case "debut-desc":
      default:
        return <CalendarClock color={placeholderColor} />;
    }
  };
  const sortCategories = SORT_OPTIONS.map((option) => ({
    name: option.label,
    value: option.value,
    icon: sortIconForValue(option.value),
  }));
  const closeSort = () => {
    setIsSortOpen(false);
  };
  const closeFilter = () => {
    setIsFilterOpen(false);
  };

  useEffect(() => {
    setQuery(searchValue);
  }, [searchValue]);

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }

    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
  };

  const handleChange = (value: string) => {
    setQuery(value);
    updateSearch(value.trim());
  };

  const handleClear = () => {
    setQuery("");
    updateSearch("");
  };

  const handleSelectSort = (value: ArtistSortValue) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextSort = value === selectedSort ? DEFAULT_ARTIST_SORT : value;

    if (nextSort === DEFAULT_ARTIST_SORT) {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    params.delete("page");

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(newUrl, { scroll: false });
    closeSort();
  };

  const sortedArtists = sortArtists(artists, selectedSort);
  const filteredResults = sortedArtists
    .filter((artist) =>
      artist.name.toLowerCase().includes((query ?? "").trim().toLowerCase()),
    )
    .slice(0, 6);

  const showResults =
    (isFocused || hoveringResults) && filteredResults.length > 0;
  const showSortOptions = isSortOpen && sortCategories.length > 0;
  const showFilterOptions = isFilterOpen;

  useEffect(() => {
    if (!showResults) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, [showResults]);

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <form
        role="search"
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "44px",
          minWidth: "360px",
          padding: "10px 16px",
          borderRadius: "6px",
          background: "var(--Colors-Search-Bar-Fill, #C2D4ED)",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--Spacings-Gaps-8px, 8px)",
          boxSizing: "border-box",
          zIndex: 200,
        }}
        onFocus={() => {
          setIsFocused(true);
          closeSort();
          closeFilter();
        }}
        onBlur={() => setIsFocused(false)}
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--Spacings-Gaps-8px, 8px)",
            width: "100%",
          }}
        >
          <SearchIcon color={placeholderColor} />
          <input
            aria-label="Search artists"
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search"
            className="search-input"
            style={{
              color: textColor,
              fontFamily: "Inter",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 550,
              lineHeight: "normal",
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
            }}
            onFocus={() => {
              setIsFocused(true);
              closeSort();
              closeFilter();
            }}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Clear search"
          >
            <CloseSmallIcon className="close-icon" />
          </button>
        )}
        <SearchResults
          results={filteredResults}
          visible={showResults}
          onMouseEnter={() => setHoveringResults(true)}
          onMouseLeave={() => setHoveringResults(false)}
        />
      </form>
      <style>{`
        .search-input::placeholder {
          color: ${placeholderColor};
          opacity: 1;
        }
      `}</style>
      <div
        style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "12px"
        }}
      >
        <div style={{ position: "relative" }}>
          <Dropdown
            ref={sortButtonRef}
            icon={<SortIcon color={sortButtonForeground} />}
            label="Sort"
            textColor={sortButtonForeground}
            arrowColor={sortButtonForeground}
            backgroundColor={sortButtonBackground}
            contentGap={4}
            onClick={() => {
              closeFilter();
              setIsSortOpen((prev) => !prev);
            }}
          />
          <SortArtist
            categories={sortCategories}
            visible={showSortOptions}
            activeValue={selectedSort}
            onSelectCategory={handleSelectSort}
            onClickOutside={closeSort}
            triggerRef={sortButtonRef}
          />
        </div>
        <div style={{ position: "relative" }}>
          <Dropdown
            ref={filterButtonRef}
            icon={<FilterIcon color={placeholderColor} />}
            label="Filter"
            contentGap={4}
            onClick={() => {
              closeSort();
              setIsFilterOpen((prev) => !prev);
            }}
          />
          <FilterArtist
            visible={showFilterOptions}
            onClickOutside={closeFilter}
            triggerRef={filterButtonRef}
          />
        </div>
      </div>
    </div>
  );
}
