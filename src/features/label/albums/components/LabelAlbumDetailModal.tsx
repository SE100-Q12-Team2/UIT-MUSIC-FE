import React, { useMemo } from "react";
import { X } from "lucide-react";
import type { LabelAlbum } from "@/types/label.types";

import "@/styles/label-album-detail.css";

import calendarIcon from "@/assets/calendar.svg";
import songIcon from "@/assets/musical_note.svg";
import durationIcon from "@/assets/time.svg";
import listeningIcon from "@/assets/listening_count.svg";
import countIcon from "@/assets/Container_count.png";
import likedIcon from "@/assets/Container_liked.png";
import ratingIcon from "@/assets/Container_rating.png";
import fallbackCover from "@/assets/Container.png";

type SongRow = {
  id: number | string;
  title: string;
  genre?: string;
  listeningCount?: number;
  duration?: number | string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  album: LabelAlbum | null;
  songs?: SongRow[];
};

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDatePretty(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${ordinal(day)} ${month}, ${year}`;
}

function formatCompact(n: number) {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatVN(n: number) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("vi-VN");
}

function formatDuration(v?: number | string) {
  if (typeof v === "string") return v;

  const sec = typeof v === "number" && Number.isFinite(v) ? Math.max(0, v) : 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);

  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");

  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${m}:${ss}`;
}

function seeded(albumId: number, base: number, mod: number) {
  const x = (albumId * 9301 + 49297) % 233280;
  return base + (x % mod);
}

const LabelAlbumDetailModal: React.FC<Props> = ({
  isOpen,
  onClose,
  album,
  songs,
}) => {
  if (!isOpen) return null;
  if (!album) return null;

  const albumId = Number(album.id ?? 0);
  const cover = album.coverImage || fallbackCover;

  const releaseText = formatDatePretty(
    (album as any).releaseDate || (album as any).createdAt
  );

  const songRows: SongRow[] = useMemo(() => {
    if (songs && songs.length) return songs;

    const fromAlbum = (album as any)?.songs;
    if (Array.isArray(fromAlbum) && fromAlbum.length) {
      return fromAlbum.map((s: any) => ({
        id: s.id ?? `${albumId}-${Math.random()}`,
        title: s.title ?? "Untitled",
        genre: s.genre?.genreName ?? s.genreName ?? "—",
        listeningCount: s.playCount ?? s.listeningCount ?? 0,
        duration: s.duration ?? s.durationSeconds ?? "0:00",
      }));
    }

    return [
      {
        id: 1,
        title: "Bohemian Rhapsody",
        genre: "Rock",
        listeningCount: 15_600_000,
        duration: "5:55",
      },
    ];
  }, [album, albumId, songs]);

  const tracksCount = album._count?.songs ?? songRows.length;

  const totalListening =
    Number((album as any)?.totalListeningCount) ||
    songRows.reduce((sum, s) => sum + (s.listeningCount ?? 0), 0) ||
    seeded(albumId, 18_000_000, 5_000_000);

  const totalLikes =
    Number((album as any)?.totalLikes) || seeded(albumId, 1_400_000, 700_000);

  const avgRating = Number((album as any)?.avgRating) || 5.0;

  const totalDurationText = (album as any)?.totalDuration || "5 mins";

  const artistName =
    (album as any)?.artistName || (album as any)?.label?.labelName || "Unknown";

  const description =
    (album as any)?.description ||
    "Fourth studio album featuring Bohemian Rhapsody";

  return (
    <>
      <div className="lad-overlay" onClick={onClose} />

      <div
        className="lad-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Album Detail"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lad-header">
          <h2 className="lad-title">Chi tiết Album</h2>
          <button
            className="lad-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="lad-body">
          <div className="lad-top">
            <div className="lad-cover">
              <img
                className="lad-cover-img"
                src={cover}
                alt={album.albumTitle}
              />
            </div>

            <div>
              <h3 className="lad-album-name">{album.albumTitle}</h3>
              <div className="lad-artist">{artistName}</div>

              <div className="lad-badges">
                <div
                  className="lad-badge"
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <img src={calendarIcon} alt="" width={16} height={16} />
                  <span>{releaseText}</span>
                </div>

                <div
                  className="lad-badge"
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <img src={songIcon} alt="" width={16} height={16} />
                  <span>{tracksCount} song</span>
                </div>

                <div
                  className="lad-badge"
                  style={{ display: "flex", gap: 8, alignItems: "center" }}
                >
                  <img src={durationIcon} alt="" width={16} height={16} />
                  <span>{totalDurationText}</span>
                </div>
              </div>

              <p className="lad-desc">{description}</p>
            </div>
          </div>

          <h4 className="lad-section-title">Thống kê Album</h4>
          <div className="lad-stats">
            <div
              className="lad-stat"
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <img src={countIcon} alt="" width={44} height={44} />
              <div>
                <div className="lad-stat-label">Total Listening Count</div>
                <div className="lad-stat-value">{formatVN(totalListening)}</div>
              </div>
            </div>

            <div
              className="lad-stat"
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <img src={likedIcon} alt="" width={44} height={44} />
              <div>
                <div className="lad-stat-label">Total Likes</div>
                <div className="lad-stat-value">{formatVN(totalLikes)}</div>
              </div>
            </div>

            <div
              className="lad-stat"
              style={{ display: "flex", gap: 12, alignItems: "center" }}
            >
              <img src={ratingIcon} alt="" width={44} height={44} />
              <div>
                <div className="lad-stat-label">Average Rating</div>
                <div className="lad-stat-value">
                  {avgRating.toFixed(1)} / 5.0
                </div>
                <div className="lad-stat-sub">Từ {songRows.length} bài hát</div>
              </div>
            </div>
          </div>

          <h4 className="lad-section-title">Danh sách bài hát</h4>
          <div className="lad-table-wrap">
            <table className="lad-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Song Name</th>
                  <th style={{ width: 180 }}>Genre</th>
                  <th style={{ width: 220 }}>Listening Count</th>
                  <th style={{ width: 160 }}>Duration</th>
                </tr>
              </thead>

              <tbody>
                {songRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="lad-empty">
                      No songs available
                    </td>
                  </tr>
                ) : (
                  songRows.map((s, idx) => (
                    <tr key={String(s.id)}>
                      <td>{idx + 1}</td>
                      <td className="lad-td-strong">{s.title}</td>
                      <td>
                        <span className="lad-genre">{s.genre ?? "—"}</span>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <img
                            src={listeningIcon}
                            alt=""
                            width={14}
                            height={14}
                          />
                          <span>{formatCompact(s.listeningCount ?? 0)}</span>
                        </div>
                      </td>

                      <td>{formatDuration(s.duration)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabelAlbumDetailModal;
