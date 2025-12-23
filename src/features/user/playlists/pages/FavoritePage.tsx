import React, { useState } from "react";
import "@/styles/favorite.css";

import { usePageBackground } from "@/shared/hooks/usePageBackground";

import favoriteBg from "@/assets/background-playlist.jpg";

import favoriteBanner from "@/assets/background_fv.png";

// icons
import heartWhiteIcon from "@/assets/heart_icon.svg"; // tim trắng ở list
import heartIcon from "@/assets/heart-icon.svg"; // tim khác (ở YMAL)
import menuIcon from "@/assets/Menu.svg";
import musicalNoteIcon from "@/assets/musical_note.svg";
import shareIcon from "@/assets/share.svg";

// About singer image (đúng: singer.png)
import singerImage from "@/assets/singer.png";

// Favorite track covers (table)
import trackCover3 from "@/assets/Track Cover_3.png";
import trackCover4 from "@/assets/Track Cover_4.png";
import trackCover5 from "@/assets/Track Cover_5.png";
import trackCover6 from "@/assets/Track Cover_6.png";

// Other Song covers (đúng: Track Cover_6/7/8)
import other1 from "@/assets/Track Cover_6.png";
import other2 from "@/assets/Track Cover_7.png";
import other3 from "@/assets/Track Cover_8.png";

// CDs (YMAL)
import cd1 from "@/assets/CD_1.png";
import cd2 from "@/assets/CD_2.png";
import cd3 from "@/assets/CD_3.png";
import cd4 from "@/assets/CD_4.png";
import cd5 from "@/assets/CD_5.png";

// Artist images (YMAL)
import albumCover1 from "@/assets/Album Cover_1.png";
import albumCover2 from "@/assets/Album Cover_2.png";
import albumCover3 from "@/assets/Album Cover_3.png";
import albumCover4 from "@/assets/Album Cover_4.png";
import albumCover5 from "@/assets/Album Cover_5.png";

interface FavoriteTrack {
  id: number;
  name: string;
  artist: string;
  album: string;
  time: string;
  cover: string;
}

interface OtherSong {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

interface Suggestion {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

interface YMALItem {
  id: number;
  title: string;
  artist: string;
  tracks: number;
  artistImage: string;
  cdImage: string;
}

const favoriteTracks: FavoriteTrack[] = [
  {
    id: 1,
    name: "Lonely",
    artist: "Cupido",
    album: "Fear When You Fly - Single",
    time: "3:48",
    cover: trackCover6,
  },
  {
    id: 2,
    name: "Adrian Bringo",
    artist: "Billie Eilish",
    album: "Hit Me Hard and soft",
    time: "3:26",
    cover: trackCover4,
  },
  {
    id: 3,
    name: "Chihiro",
    artist: "Benyamin",
    album: "Disease - Single",
    time: "3:18",
    cover: trackCover5,
  },
  {
    id: 4,
    name: "Shape Of You",
    artist: "Ed Sheeran",
    album: "Hit Me Hard and soft",
    time: "4:08",
    cover: trackCover3,
  },
  {
    id: 5,
    name: "Chihiro",
    artist: "Benyamin",
    album: "Disease - Single",
    time: "3:58",
    cover: trackCover6,
  },
];

const otherSongs: OtherSong[] = [
  { id: 1, title: "Nothings", artist: "Adele", cover: other1 },
  { id: 2, title: "Set Fire to the Rain", artist: "Adele", cover: other2 },
  { id: 3, title: "Hello", artist: "Adele", cover: other3 },
];

const suggestions: Suggestion[] = [
  { id: 1, title: "empty note", artist: "Ghostly Kisses", cover: trackCover3 },
  { id: 2, title: "Unstoppable", artist: "ghostly kisses", cover: trackCover4 },
  { id: 3, title: "No Face No", artist: "Modern Talking", cover: trackCover5 },
  { id: 4, title: "Tungevaag", artist: "Peru", cover: trackCover6 },
  { id: 5, title: "Unstoppable", artist: "Sia", cover: trackCover4 },
  {
    id: 6,
    title: "The Torture...",
    artist: "Taylor Soyift",
    cover: trackCover5,
  },
  { id: 7, title: "empty note", artist: "ghostly kisses", cover: trackCover6 },
  { id: 8, title: "Tonight", artist: "Enrique Iglesias", cover: trackCover6 },
];

const ymal: YMALItem[] = [
  {
    id: 1,
    title: "RUNAWAY",
    artist: "One Republic",
    tracks: 7,
    artistImage: albumCover1,
    cdImage: cd1,
  },
  {
    id: 2,
    title: "album Name",
    artist: "Singer",
    tracks: 7,
    artistImage: albumCover2,
    cdImage: cd2,
  },
  {
    id: 3,
    title: "Single Ladies",
    artist: "Beyonce",
    tracks: 7,
    artistImage: albumCover3,
    cdImage: cd3,
  },
  {
    id: 4,
    title: "album N",
    artist: "Singer",
    tracks: 7,
    artistImage: albumCover5,
    cdImage: cd5,
  },
  {
    id: 5,
    title: "Wolf",
    artist: "Selena Gomes",
    tracks: 7,
    artistImage: albumCover4,
    cdImage: cd4,
  },
  {
    id: 6,
    title: "El Que Espera",
    artist: "Billie",
    tracks: 7,
    artistImage: albumCover2,
    cdImage: cd2,
  },
  {
    id: 7,
    title: "On The Floor",
    artist: "Jennifer Lopez",
    tracks: 7,
    artistImage: albumCover3,
    cdImage: cd3,
  },
  {
    id: 8,
    title: "album N",
    artist: "Singer",
    tracks: 7,
    artistImage: albumCover1,
    cdImage: cd1,
  },
];

const FavoritePage: React.FC = () => {
  usePageBackground(favoriteBg);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  const [favSuggestionIds, setFavSuggestionIds] = useState<Set<number>>(
    new Set()
  );
  const [favYmalIds, setFavYmalIds] = useState<Set<number>>(new Set());

  const toggleSuggestion = (id: number) => {
    setFavSuggestionIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleYmal = (id: number) => {
    setFavYmalIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="favorite-page">
      {/* TOP: left(main) + right(cards) */}
      <section className="favorite-top">
        {/* LEFT */}
        <div className="favorite-top__left">
          <div
            className="favorite-banner"
            style={{
              backgroundImage: `url(${favoriteBanner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="favorite-banner__content">
              <h1 className="favorite-banner__title">Favorite Music</h1>
              <p className="favorite-banner__subtitle">
                Because Favorites Deserve Their Own Space ..
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="favorite-table">
            <div className="favorite-table__header">
              <span className="favorite-table__col">Name</span>
              <span className="favorite-table__col">Album</span>
              <span className="favorite-table__col favorite-table__col--time">
                Time
              </span>
              <span className="favorite-table__col favorite-table__col--actions" />
            </div>

            <div className="favorite-table__body">
              {favoriteTracks.map((t) => (
                <article key={t.id} className="favorite-track">
                  <div className="favorite-track__name">
                    <div className="favorite-track__cover">
                      <img src={t.cover} alt={t.name} />
                    </div>
                    <div className="favorite-track__meta">
                      <div className="favorite-track__title">{t.name}</div>
                      <div className="favorite-track__artist">{t.artist}</div>
                    </div>
                  </div>

                  <div className="favorite-track__album">{t.album}</div>
                  <div className="favorite-track__time">{t.time}</div>

                  <div className="favorite-track__actions">
                    <button
                      className="favorite-icon-button"
                      type="button"
                      aria-label="Favorite"
                    >
                      <img src={heartWhiteIcon} alt="" />
                    </button>
                    <button
                      className="favorite-icon-button"
                      type="button"
                      aria-label="More"
                    >
                      <img src={menuIcon} alt="" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <aside className="favorite-top__right">
          <section className="favorite-card favorite-singer">
            <h2 className="favorite-card__title">About Songer</h2>

            <div className="favorite-singer__avatar">
              <img src={singerImage} alt="Singer" />
            </div>

            <h3 className="favorite-singer__name">Adele Laurie Blue Adkins</h3>
            <p className="favorite-singer__bio">
              born May 5, 1988 better known by her stage name Adele. We all know
              her talented English singer and songwriter Adele.
            </p>

            <button
              type="button"
              className={`favorite-singer__follow ${
                isFollowing ? "is-following" : ""
              }`}
              onClick={handleToggleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </section>

          <section className="favorite-card favorite-other">
            <h3 className="favorite-card__title">Other Song</h3>

            <div className="favorite-other__list">
              {otherSongs.map((s) => (
                <article key={s.id} className="favorite-other__item">
                  <div className="favorite-other__cover">
                    <img src={s.cover} alt={s.title} />
                  </div>

                  <div className="favorite-other__meta">
                    <div className="favorite-other__song-title">{s.title}</div>
                    <div className="favorite-other__artist">{s.artist}</div>
                  </div>

                  <div className="favorite-other__actions">
                    <button
                      className="favorite-icon-button"
                      type="button"
                      aria-label="Favorite"
                    >
                      <img src={heartIcon} alt="" />
                    </button>
                    <button
                      className="favorite-icon-button"
                      type="button"
                      aria-label="More"
                    >
                      <img src={menuIcon} alt="" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>

      {/* Suggestions */}
      <section className="favorite-section">
        <div className="favorite-section__header">
          <h2 className="favorite-section__title">Suggestions For You</h2>
          <button className="favorite-section__see-all" type="button">
            See All
          </button>
        </div>

        <div className="favorite-suggestions">
          {suggestions.map((item) => (
            <article key={item.id} className="favorite-suggestion-card">
              <div className="favorite-suggestion-card__cover">
                <img src={item.cover} alt={item.title} />
              </div>

              <div className="favorite-suggestion-card__meta">
                <div className="favorite-suggestion-card__title">
                  {item.title}
                </div>
                <div className="favorite-suggestion-card__artist">
                  {item.artist}
                </div>
              </div>

              <div className="favorite-suggestion-card__actions">
                <button
                  className={`favorite-icon-button ${
                    favSuggestionIds.has(item.id) ? "is-active" : ""
                  }`}
                  type="button"
                  aria-label="Favorite"
                  onClick={() => toggleSuggestion(item.id)}
                >
                  <img src={heartIcon} alt="" />
                </button>
                <button
                  className="favorite-icon-button"
                  type="button"
                  aria-label="More"
                >
                  <img src={menuIcon} alt="" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* You Might Also Like */}
      <section className="favorite-section">
        <div className="favorite-section__header">
          <h2 className="favorite-section__title">You Might Also Like</h2>
          <button className="favorite-section__see-all" type="button">
            See All
          </button>
        </div>

        <div className="ymal-grid">
          {ymal.map((a) => (
            <article key={a.id} className="ymal-card">
              <div className="ymal-card__media">
                <img
                  className="ymal-card__artist-image"
                  src={a.artistImage}
                  alt={a.title}
                />
                <img className="ymal-card__cd-image" src={a.cdImage} alt="CD" />
              </div>

              <div className="ymal-card__meta">
                <div className="ymal-card__title">{a.title}</div>
                <div className="ymal-card__artist-name">{a.artist}</div>

                <div className="ymal-card__tracks-row">
                  <img src={musicalNoteIcon} alt="" />
                  <span>{a.tracks} Tracks</span>
                </div>

                <div className="ymal-card__icons-row">
                  <button
                    className="favorite-icon-button"
                    type="button"
                    aria-label="Share"
                  >
                    <img src={shareIcon} alt="" />
                  </button>
                  <button
                    className={`favorite-icon-button ${
                      favYmalIds.has(a.id) ? "is-active" : ""
                    }`}
                    type="button"
                    aria-label="Favorite"
                    onClick={() => toggleYmal(a.id)}
                  >
                    <img src={heartIcon} alt="" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default FavoritePage;
