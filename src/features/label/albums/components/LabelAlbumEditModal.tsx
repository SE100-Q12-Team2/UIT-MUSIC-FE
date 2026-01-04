import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { LabelAlbum } from "@/types/label.types";

import "@/styles/label-album-edit.css";

import textNameIcon from "@/assets/text_name.svg";
import artistIcon from "@/assets/artist_icon.svg";
import calendarIcon from "@/assets/calendar.svg";
import uploadIcon from "@/assets/music-square-search.svg";
import descriptionIcon from "@/assets/description.svg";
import deleteRedIcon from "@/assets/delete_red.svg";

type SongItem = {
  id: string | number;
  title: string;
  artist: string;
  duration: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  album: LabelAlbum | null;

  onSubmit?: (payload: {
    albumId: number | string;
    albumTitle: string;
    artistName: string;
    releaseDate?: string;
    description: string;
    coverFile?: File | null;
    songs: SongItem[];
  }) => Promise<void>;

  onUpdated?: () => void;
};

function toDateInputValue(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function seeded(albumId: number, base: number, mod: number) {
  const x = (albumId * 9301 + 49297) % 233280;
  return base + (x % mod);
}

const LabelAlbumEditModal: React.FC<Props> = ({
  isOpen,
  onClose,
  album,
  onSubmit,
  onUpdated,
}) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [albumTitle, setAlbumTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [songs, setSongs] = useState<SongItem[]>([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songDuration, setSongDuration] = useState("");

  const albumId = useMemo(() => Number(album?.id ?? 0), [album]);

  const totalListening = useMemo(() => {
    const fromAlbum = Number((album as any)?.totalListeningCount);
    if (Number.isFinite(fromAlbum) && fromAlbum > 0) return fromAlbum;
    return seeded(albumId || 1, 8_500_000, 4_000_000);
  }, [album, albumId]);

  const totalLike = useMemo(() => {
    const fromAlbum = Number((album as any)?.totalLikes);
    if (Number.isFinite(fromAlbum) && fromAlbum > 0) return fromAlbum;
    return seeded(albumId || 1, 450_000, 400_000);
  }, [album, albumId]);

  useEffect(() => {
    if (!isOpen || !album) return;

    setAlbumTitle("");
    setArtistName("");
    setPublishDate(
      toDateInputValue((album as any)?.releaseDate || (album as any)?.createdAt)
    );
    setDescription((album as any)?.description ?? "");

    const seededSongs: SongItem[] =
      Array.isArray((album as any)?.songs) && (album as any).songs.length
        ? (album as any).songs.map((s: any) => ({
            id: s.id ?? `${album.id}-${Math.random()}`,
            title: s.title ?? "Untitled",
            artist:
              s.artistName ||
              s.artist?.artistName ||
              (album as any)?.artistName ||
              "Adele",
            duration: s.duration ?? s.durationText ?? "4:46",
          }))
        : [
            {
              id: 1,
              title: "Skyfall",
              artist: "Adele",
              duration: "4:46",
            },
          ];

    setSongs(seededSongs);

    setShowAddSong(false);
    setSongName("");
    setSongArtist("");
    setSongDuration("");
    setCoverFile(null);
  }, [isOpen, album]);

  if (!isOpen || !album) return null;

  const handlePickFile = () => fileRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setCoverFile(f);
  };

  const handleAddSong = () => {
    const t = songName.trim();
    const a = songArtist.trim();
    const d = songDuration.trim();

    if (!t || !a || !d) {
      toast.error("Please fill Song name / Artist / Duration");
      return;
    }

    setSongs((prev) => [
      ...prev,
      { id: `${Date.now()}`, title: t, artist: a, duration: d },
    ]);

    setSongName("");
    setSongArtist("");
    setSongDuration("");
    setShowAddSong(false);
    toast.success("Added song");
  };

  const handleRemoveSong = (id: SongItem["id"]) => {
    setSongs((prev) => prev.filter((x) => String(x.id) !== String(id)));
  };

  const handleUpdate = async () => {
    if (!albumTitle.trim()) {
      toast.error("Album's Name is required");
      return;
    }
    if (!artistName.trim()) {
      toast.error("Artist is required");
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit({
          albumId: album.id as any,
          albumTitle: albumTitle.trim(),
          artistName: artistName.trim(),
          releaseDate: publishDate || undefined,
          description: description.trim(),
          coverFile,
          songs,
        });
      }

      toast.success("Updated successfully!");
      onUpdated?.();
      onClose();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  };

  return (
    <>
      <div className="lae-overlay" onClick={onClose} />

      <div
        className="lae-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Edit Album"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lae-header">
          <h2 className="lae-title">Edit Album</h2>

          <button className="lae-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* ✅ GIỮ lae-body MỞ cho tới hết */}
        <div className="lae-body">
          {/* row 1 */}
          <div className="lae-row2">
            <div className="lae-field">
              <div className="lae-label">Album&apos;s Name</div>
              <div className="lae-inputWrap">
                <img className="lae-ico" src={textNameIcon} alt="" />
                <input
                  className="lae-input"
                  value={albumTitle}
                  onChange={(e) => setAlbumTitle(e.target.value)}
                  placeholder="Enter album name..."
                />
              </div>
            </div>

            <div className="lae-field">
              <div className="lae-label">Artist</div>
              <div className="lae-inputWrap">
                <img className="lae-ico" src={artistIcon} alt="" />
                <input
                  className="lae-input"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  placeholder="Enter artist name..."
                />
              </div>
            </div>
          </div>

          <div className="lae-row2">
            <div className="lae-field">
              <div className="lae-label">Publish Date</div>
              <div className="lae-inputWrap">
                <img className="lae-ico" src={calendarIcon} alt="" />
                <input
                  className="lae-input lae-input-date"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
            </div>

            <div className="lae-field">
              <div className="lae-label">Album&apos;s Cover Image</div>

              <div
                className="lae-inputWrap lae-file"
                role="button"
                tabIndex={0}
                onClick={handlePickFile}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handlePickFile();
                }}
              >
                <img className="lae-ico" src={uploadIcon} alt="" />
                <div className="lae-fileText">
                  {coverFile ? coverFile.name : "Pick file"}
                </div>

                <input
                  ref={fileRef}
                  className="lae-hiddenFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          <div className="lae-field">
            <div className="lae-label">Description</div>
            <div className="lae-textareaWrap">
              <img
                className="lae-ico lae-ico-textarea"
                src={descriptionIcon}
                alt=""
              />
              <textarea
                className="lae-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả về album..."
                rows={4}
                maxLength={228}
              />
            </div>

            <div className="lae-char">{description.length} ký tự</div>
          </div>

          <div className="lae-sectionHead">
            <div className="lae-sectionTitle">Songs List</div>

            <button
              type="button"
              className="lae-addBtn"
              onClick={() => setShowAddSong((v) => !v)}
            >
              <span className="lae-plus">+</span>
              Add Song
            </button>
          </div>

          <div className="lae-songsBox">
            {songs.length === 0 ? (
              <div className="lae-empty">No songs</div>
            ) : (
              songs.map((s, idx) => (
                <div key={String(s.id)} className="lae-songRow">
                  <div className="lae-songLeft">
                    <div className="lae-songIdx">{idx + 1}.</div>
                    <div>
                      <div className="lae-songTitle">{s.title}</div>
                      <div className="lae-songSub">
                        {s.artist} • {s.duration}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="lae-songDel"
                    onClick={() => handleRemoveSong(s.id)}
                    aria-label="Remove song"
                    title="Remove"
                  >
                    <img src={deleteRedIcon} alt="" />
                  </button>
                </div>
              ))
            )}
          </div>

          {showAddSong && (
            <div className="lae-addForm">
              <div className="lae-row2">
                <div className="lae-field">
                  <div className="lae-label">Song name</div>
                  <div className="lae-inputWrap">
                    <input
                      className="lae-input"
                      value={songName}
                      onChange={(e) => setSongName(e.target.value)}
                      placeholder="Song name"
                    />
                  </div>
                </div>

                <div className="lae-field">
                  <div className="lae-label">Artist</div>
                  <div className="lae-inputWrap">
                    <input
                      className="lae-input"
                      value={songArtist}
                      onChange={(e) => setSongArtist(e.target.value)}
                      placeholder="Artist"
                    />
                  </div>
                </div>
              </div>

              <div className="lae-row2">
                <div className="lae-field">
                  <div className="lae-label">Duration</div>
                  <div className="lae-inputWrap">
                    <input
                      className="lae-input"
                      value={songDuration}
                      onChange={(e) => setSongDuration(e.target.value)}
                      placeholder="4:46"
                    />
                  </div>
                </div>

                <div className="lae-field lae-addActions">
                  <button
                    type="button"
                    className="lae-btn lae-btnGhost"
                    onClick={() => setShowAddSong(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="lae-btn lae-btnPrimary"
                    onClick={handleAddSong}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lae-statTitle">Statistic (Non editable)</div>

          <div className="lae-row2">
            <div className="lae-field">
              <div className="lae-label">Total Listening Count</div>
              <div className="lae-inputWrap">
                <input
                  className="lae-input"
                  value={String(totalListening)}
                  readOnly
                />
              </div>
            </div>

            <div className="lae-field">
              <div className="lae-label">Total Like</div>
              <div className="lae-inputWrap">
                <input
                  className="lae-input"
                  value={String(totalLike)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="lae-actions">
            <button
              type="button"
              className="lae-btn lae-btnGhost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="lae-btn lae-btnPrimary"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LabelAlbumEditModal;
