import React, { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateAlbum } from "@/core/services/album.service";
import { useUploadAvatar } from "@/core/services/upload.service";

import "@/styles/label-album-create.css";

import textNameIcon from "@/assets/text_name.svg";
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

const CreateAlbumPage: React.FC = () => {
  const navigate = useNavigate();
  // const { user } = useAuth();

  const createAlbumMutation = useCreateAlbum();
  const uploadAvatarMutation = useUploadAvatar();

  const fileRef = useRef<HTMLInputElement | null>(null);

  const [albumTitle, setAlbumTitle] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [songs, setSongs] = useState<SongItem[]>([]);
  const [showAddSong, setShowAddSong] = useState(false);
  const [songName, setSongName] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songDuration, setSongDuration] = useState("");

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

  const handleCreate = async () => {
    if (!albumTitle.trim()) {
      toast.error("Album's Name is required");
      return;
    }

    try {
      let coverImageUrl: string | undefined = undefined;

      if (coverFile) {
        toast.info("Uploading cover image...");
        const uploadResult = await uploadAvatarMutation.mutateAsync(coverFile);
        coverImageUrl = uploadResult;
      }

      // Create album
      await createAlbumMutation.mutateAsync({
        albumTitle: albumTitle.trim(),
        albumDescription: description.trim() || undefined,
        coverImage: coverImageUrl,
        releaseDate: publishDate || undefined,
        totalTracks: songs.length,
      });

      toast.success("Album created successfully!");
      navigate("/label/albums");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create album");
    }
  };

  return (
    <div className="lac">
      <div className="lac__tabs">
        <NavLink
          to="/label/albums"
          end
          className={({ isActive }) =>
            `lac__tab ${isActive ? "is-active" : ""}`
          }
        >
          Album List
        </NavLink>

        <NavLink
          to="/label/albums/create"
          className={({ isActive }) =>
            `lac__tab ${isActive ? "is-active" : ""}`
          }
        >
          Create Album
        </NavLink>
      </div>

      <div className="lac__form">
        <div className="lac-field">
          <div className="lac-label">Album&apos;s Name</div>
          <div className="lac-inputWrap">
            <img className="lac-ico" src={textNameIcon} alt="" />
            <input
              className="lac-input"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              placeholder="Enter album name..."
            />
          </div>
        </div>

        <div className="lac-row2">
          <div className="lac-field">
            <div className="lac-label">Publish Date</div>
            <div className="lac-inputWrap">
              <img className="lac-ico" src={calendarIcon} alt="" />
              <input
                className="lac-input lac-input-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
              />
            </div>
          </div>

          <div className="lac-field">
            <div className="lac-label">Album&apos;s Cover Image</div>

            <div
              className="lac-inputWrap lac-file"
              role="button"
              tabIndex={0}
              onClick={handlePickFile}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handlePickFile();
              }}
            >
              <img className="lac-ico" src={uploadIcon} alt="" />
              <div className="lac-fileText">
                {coverFile ? coverFile.name : "Pick file"}
              </div>

              <input
                ref={fileRef}
                className="lac-hiddenFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        <div className="lac-field">
          <div className="lac-label">Description</div>
          <div className="lac-textareaWrap">
            <img
              className="lac-ico lac-ico-textarea"
              src={descriptionIcon}
              alt=""
            />
            <textarea
              className="lac-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả về album..."
              rows={4}
              maxLength={228}
            />
          </div>
          <div className="lac-char">{description.length} ký tự</div>
        </div>

        <div className="lac-sectionHead">
          <div className="lac-sectionTitle">Songs List</div>

          <button
            type="button"
            className="lac-addBtn"
            onClick={() => setShowAddSong((v) => !v)}
          >
            <span className="lac-plus">+</span>
            Add Song
          </button>
        </div>

        <div className="lac-songsBox">
          {songs.length === 0 ? (
            <div className="lac-empty">No songs</div>
          ) : (
            songs.map((s, idx) => (
              <div key={String(s.id)} className="lac-songRow">
                <div className="lac-songLeft">
                  <div className="lac-songIdx">{idx + 1}.</div>
                  <div>
                    <div className="lac-songTitle">{s.title}</div>
                    <div className="lac-songSub">
                      {s.artist} • {s.duration}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="lac-songDel"
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
          <div className="lac-addForm">
            <div className="lac-row2">
              <div className="lac-field">
                <div className="lac-label">Song name</div>
                <div className="lac-inputWrap">
                  <input
                    className="lac-input"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                    placeholder="Song name"
                  />
                </div>
              </div>

              <div className="lac-field">
                <div className="lac-label">Artist</div>
                <div className="lac-inputWrap">
                  <input
                    className="lac-input"
                    value={songArtist}
                    onChange={(e) => setSongArtist(e.target.value)}
                    placeholder="Artist"
                  />
                </div>
              </div>
            </div>

            <div className="lac-row2">
              <div className="lac-field">
                <div className="lac-label">Duration</div>
                <div className="lac-inputWrap">
                  <input
                    className="lac-input"
                    value={songDuration}
                    onChange={(e) => setSongDuration(e.target.value)}
                    placeholder="4:46"
                  />
                </div>
              </div>

              <div className="lac-field lac-addActions">
                <button
                  type="button"
                  className="lac-btn lac-btnGhost"
                  onClick={() => setShowAddSong(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="lac-btn lac-btnPrimary"
                  onClick={handleAddSong}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="lac-actions">
          <button
            type="button"
            className="lac-btn lac-btnGhost"
            onClick={() => navigate("/label/albums")}
          >
            Cancel
          </button>
          <button
            type="button"
            className="lac-btn lac-btnPrimary"
            onClick={handleCreate}
            disabled={createAlbumMutation.isPending || uploadAvatarMutation.isPending}
          >
            {createAlbumMutation.isPending || uploadAvatarMutation.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumPage;
