import React from "react";

export type FilterKey = "all" | "hasSongs" | "empty";
export type SortKey =
  | ""
  | "newest"
  | "oldest"
  | "titleAsc"
  | "titleDesc"
  | "tracksDesc";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;

  filter: FilterKey;
  onFilterChange: (v: FilterKey) => void;

  sort: SortKey;
  onSortChange: (v: SortKey) => void;

  searchIconSrc: string;
  sortIconSrc: string;
  filterIconSrc?: string;
};

const LabelAlbumFilters: React.FC<Props> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  searchIconSrc,
  sortIconSrc,
  filterIconSrc,
}) => {
  const sortLabelMap: Record<Exclude<SortKey, "">, string> = {
    newest: "Newest",
    oldest: "Oldest",
    titleAsc: "A - Z",
    titleDesc: "Z - A",
    tracksDesc: "Most tracks",
  };

  return (
    <div className="lamf">
      {/* Search */}
      <div className="lamf__control lamf__control--search">
        <img className="lamf__icon" src={searchIconSrc} alt="" />
        <input
          className="lamf__input"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="lamf__control lamf__control--select">
        {filterIconSrc ? (
          <img className="lamf__icon" src={filterIconSrc} alt="" />
        ) : (
          <span className="lamf__icon--placeholder" />
        )}

        <select
          className="lamf__select"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as FilterKey)}
          aria-label="Filter albums"
        >
          <option value="all">All</option>
          <option value="hasSongs">Has songs</option>
          <option value="empty">Empty</option>
        </select>
      </div>

      <div className="lamf__control lamf__control--select">
        <img className="lamf__icon" src={sortIconSrc} alt="" />

        <select
          className="lamf__select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          aria-label="Sort albums"
        >
          <option value="">
            {sort
              ? `Sort by (${sortLabelMap[sort as Exclude<SortKey, "">]})`
              : "Sort by"}
          </option>

          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="titleAsc">A - Z</option>
          <option value="titleDesc">Z - A</option>
          <option value="tracksDesc">Most tracks</option>
        </select>
      </div>
    </div>
  );
};

export default LabelAlbumFilters;
