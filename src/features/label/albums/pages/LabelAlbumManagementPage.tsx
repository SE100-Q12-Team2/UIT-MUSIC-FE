import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { useRecordLabels, useLabelAlbums } from "@/core/services/label.service";

import LabelAlbumFilters, {
  FilterKey,
  SortKey,
} from "../components/LabelAlbumFilters";
import LabelAlbumCard from "../components/LabelAlbumCard";
import LabelAlbumDetailModal from "../components/LabelAlbumDetailModal";

import type { LabelAlbum } from "@/types/label.types";

import "@/styles/label-album-management.css";

import trackIcon from "@/assets/musical_note.svg";
import searchIcon from "@/assets/search_ico.svg";
import sortIcon from "@/assets/sort.svg";
import editIcon from "@/assets/edit_ico.svg";
import binIcon from "@/assets/bin.svg";
import clockIcon from "@/assets/clock.svg";
import timeIcon from "@/assets/time.svg";
import fallbackCover from "@/assets/Playlist_Cover.png";

const MOCK_ALBUMS: LabelAlbum[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  albumTitle: `Album ${i + 1}`,
  coverImage: "",
  createdAt: new Date().toISOString(),
  releaseDate: new Date().toISOString(),
  _count: { songs: (i % 3) + 1 },
})) as any;

const LabelAlbumManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<LabelAlbum | null>(null);

  const { data: labels = [], isLoading: isLoadingLabels } = useRecordLabels(
    user?.id
  );
  const label = labels[0];

  const { data: albumsResponse, isLoading: isLoadingAlbums } = useLabelAlbums(
    label?.id as any,
    1,
    200
  );

  const useMock = !user?.id || !label?.id;

  const albums: LabelAlbum[] = useMemo(() => {
    return (
      useMock ? MOCK_ALBUMS : albumsResponse?.items ?? []
    ) as LabelAlbum[];
  }, [albumsResponse, useMock]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list: LabelAlbum[] = albums;

    if (q) {
      list = list.filter((a) => (a.albumTitle || "").toLowerCase().includes(q));
    }

    if (filter === "hasSongs")
      list = list.filter((a) => (a._count?.songs ?? 0) > 0);
    if (filter === "empty")
      list = list.filter((a) => (a._count?.songs ?? 0) === 0);

    const getTime = (a: LabelAlbum) => {
      const t = (a as any).releaseDate || (a as any).createdAt;
      const ms = t ? new Date(t).getTime() : 0;
      return Number.isNaN(ms) ? 0 : ms;
    };

    const out = [...list];
    if (sort) {
      out.sort((a, b) => {
        if (sort === "newest") return getTime(b) - getTime(a);
        if (sort === "oldest") return getTime(a) - getTime(b);
        if (sort === "titleAsc")
          return (a.albumTitle || "").localeCompare(b.albumTitle || "");
        if (sort === "titleDesc")
          return (b.albumTitle || "").localeCompare(a.albumTitle || "");
        if (sort === "tracksDesc")
          return (b._count?.songs ?? 0) - (a._count?.songs ?? 0);
        return 0;
      });
    }

    return out;
  }, [albums, search, filter, sort]);

  const handleEdit = (albumId: LabelAlbum["id"]) => {
    navigate(`/label/albums/${String(albumId)}/edit`);
  };

  const handleDelete = (albumId: LabelAlbum["id"]) => {
    const ok = window.confirm("Delete this album?");
    if (!ok) return;
    console.log("delete album:", albumId);
  };

  const openDetail = (album: LabelAlbum) => {
    setSelectedAlbum(album);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedAlbum(null);
  };

  const showLoading = isLoadingLabels || (!useMock && isLoadingAlbums);

  return (
    <div className="lam">
      <div className="lam__tabs">
        <NavLink
          to="/label/albums"
          end
          className={({ isActive }) =>
            `lam__tab ${isActive ? "is-active" : ""}`
          }
        >
          Album List
        </NavLink>

        <NavLink
          to="/label/albums/create"
          className={({ isActive }) =>
            `lam__tab ${isActive ? "is-active" : ""}`
          }
        >
          Create Album
        </NavLink>
      </div>

      <LabelAlbumFilters
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        sort={sort}
        onSortChange={setSort}
        searchIconSrc={searchIcon}
        sortIconSrc={sortIcon}
        filterIconSrc={sortIcon}
      />

      {showLoading ? (
        <div className="lam__state">Loading albums...</div>
      ) : filtered.length === 0 ? (
        <div className="lam__state">No albums found</div>
      ) : (
        <div className="lam__grid">
          {filtered.map((album) => (
            <LabelAlbumCard
              key={String(album.id)}
              album={album}
              fallbackCoverSrc={fallbackCover}
              trackIconSrc={trackIcon}
              editIconSrc={editIcon}
              binIconSrc={binIcon}
              clockIconSrc={clockIcon}
              timeIconSrc={timeIcon}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenDetail={() => openDetail(album)}
            />
          ))}
        </div>
      )}

      <LabelAlbumDetailModal
        isOpen={isDetailOpen}
        onClose={closeDetail}
        album={selectedAlbum}
      />
    </div>
  );
};

export default LabelAlbumManagementPage;
