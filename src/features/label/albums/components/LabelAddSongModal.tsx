import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import "@/styles/label-add-song.css";

export type AddSongDraft = {
  title: string;
  artist: string;
  duration: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (song: AddSongDraft) => void;
  defaultArtist?: string;
};

function isDurationLike(v: string) {
  return /^(\d{1,2}:)?\d{1,2}:\d{2}$/.test(v.trim());
}

const LabelAddSongModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAdd,
  defaultArtist = "",
}) => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState(defaultArtist);
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setTitle("");
    setArtist(defaultArtist);
    setDuration("");
  }, [isOpen, defaultArtist]);

  const canSubmit = useMemo(() => {
    if (!title.trim()) return false;
    if (!artist.trim()) return false;
    if (!duration.trim()) return false;
    if (!isDurationLike(duration)) return false;
    return true;
  }, [title, artist, duration]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    onAdd({
      title: title.trim(),
      artist: artist.trim(),
      duration: duration.trim(),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="las-overlay" onClick={onClose} />
      <div
        className="las-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Add Song"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="las-header">
          <h3 className="las-title">Add Song</h3>
          <button className="las-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form className="las-body" onSubmit={handleSubmit}>
          <div className="las-field">
            <label className="las-label">Song name</label>
            <input
              className="las-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tên bài hát..."
            />
          </div>

          <div className="las-field">
            <label className="las-label">Artist</label>
            <input
              className="las-input"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Nhập tên nghệ sĩ..."
            />
          </div>

          <div className="las-field">
            <label className="las-label">Duration</label>
            <input
              className="las-input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Ví dụ: 4:46"
            />
            <div className="las-help">
              Định dạng: <b>m:ss</b> hoặc <b>h:mm:ss</b>
            </div>
          </div>

          <div className="las-actions">
            <button type="button" className="las-btn ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="las-btn" disabled={!canSubmit}>
              Add
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LabelAddSongModal;
