import React, { useMemo } from "react";
import type { LabelAlbum } from "@/types/label.types";

type Props = {
  album: LabelAlbum;
  fallbackCoverSrc: string;

  trackIconSrc: string;
  timeIconSrc: string;
  clockIconSrc: string;

  editIconSrc: string;
  binIconSrc: string;

  onEdit: (id: number) => void;
  onDelete: (id: number) => void;

  onOpenDetail?: () => void;
};

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatLikeMock(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${ordinal(day)} ${month}`;
}

const LabelAlbumCard: React.FC<Props> = ({
  album,
  fallbackCoverSrc,
  trackIconSrc,
  timeIconSrc,
  clockIconSrc,
  editIconSrc,
  binIconSrc,
  onEdit,
  onDelete,
  onOpenDetail,
}) => {
  const cover = album.coverImage || fallbackCoverSrc;
  const tracks = album._count?.songs ?? 0;

  const displayDuration = useMemo(() => {
    return (album as any).totalDuration || "01:38:58";
  }, [album]);

  const displayDate = useMemo(() => {
    const t = (album as any).releaseDate || (album as any).createdAt;
    return formatLikeMock(t);
  }, [album]);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="lam-card"
      onClick={onOpenDetail}
      role={onOpenDetail ? "button" : undefined}
      tabIndex={onOpenDetail ? 0 : -1}
    >
      <img className="lam-card__cover" src={cover} alt={album.albumTitle} />

      <div className="lam-card__body">
        <h3 className="lam-card__title">{album.albumTitle}</h3>

        <div className="lam-card__meta">
          <div className="lam-card__meta-item">
            <img src={trackIconSrc} alt="" />
            <span>{tracks} Tracks</span>
          </div>

          <div className="lam-card__meta-item">
            <img src={timeIconSrc} alt="" />
            <span>{displayDuration}</span>
          </div>

          <div className="lam-card__meta-item">
            <img src={clockIconSrc} alt="" />
            <span>{displayDate}</span>
          </div>
        </div>

        <div className="lam-card__actions" onClick={stop}>
          <button
            className="lam-card__edit"
            onClick={() => onEdit(album.id as any)}
          >
            <img src={editIconSrc} alt="" />
            <span>Edit</span>
          </button>

          <button
            className="lam-card__delete"
            onClick={() => onDelete(album.id as any)}
          >
            <img src={binIconSrc} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelAlbumCard;
