import React, { useState, useMemo } from "react";
import "@/styles/favorite.css";

import { usePageBackground } from "@/shared/hooks/usePageBackground";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { useFavoriteSongs, useCheckFavorite, useToggleFavorite } from "@/core/services/favorite.service";
import { useSongsByIds } from "@/core/services/song.service";
import { useRecordLabel } from "@/core/services/label.service";
import { useDiscoverWeekly } from "@/core/services/recommendation.service";
import { Song } from "@/core/services/song.service";

import favoriteBg from "@/assets/background-playlist.jpg";

import favoriteBanner from "@/assets/background_fv.png";

// icons
import heartWhiteIcon from "@/assets/heart_icon.svg"; // tim trắng ở list
import heartIcon from "@/assets/heart-icon.svg"; // tim khác (ở YMAL)
import menuIcon from "@/assets/Menu.svg";

// About singer image (đúng: singer.png)
import singerImage from "@/assets/singer.png";

import trackCover6 from "@/assets/Track Cover_6.png";

const FavoritePage: React.FC = () => {
  usePageBackground(favoriteBg);
  const { user } = useAuth();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  // Fetch favorite song IDs
  const { data: favoritesData, isLoading: loadingFavorites } = useFavoriteSongs(user?.id);
  // Memoize songIds to prevent unnecessary re-renders
  const songIds = useMemo(() => {
    const ids = favoritesData?.songIds || [];
    return ids;
  }, [favoritesData?.songIds]);

  // Fetch song details for all favorite songs
  const { data: songs, isLoading: loadingSongs } = useSongsByIds(songIds);

  // Fetch recommendations for suggestions
  const { data: recommendations, isLoading: loadingRecommendations } = useDiscoverWeekly();
  
  // Get only first 8 recommendations for display (or all if showAllSuggestions is true)
  const displayedSuggestions = useMemo(() => {
    return showAllSuggestions ? recommendations || [] : (recommendations?.slice(0, 8) || []);
  }, [recommendations, showAllSuggestions]);
  
  // Fetch record label info for selected song
  const { data: recordLabel, isLoading: loadingLabel } = useRecordLabel(
    selectedSong?.labelId
  );

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedSong(null);
  };

  // Component to render favorite button with check status
  const FavoriteButton: React.FC<{ songId: number }> = ({ songId }) => {
    const { data: favoriteStatus } = useCheckFavorite(user?.id, songId);
    const toggleFavorite = useToggleFavorite();
    const isFavorited = favoriteStatus?.isFavorite || false;

    const handleToggle = async (e: React.MouseEvent) => {
      e.stopPropagation();
      
      if (!user?.id) {
        return;
      }

      try {
        await toggleFavorite.mutateAsync({
          userId: user.id,
          songId,
          isFavorited,
        });
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
      }
    };

    return (
      <button
        className={`favorite-icon-button ${isFavorited ? 'is-favorited' : ''}`}
        type="button"
        aria-label="Favorite"
        onClick={handleToggle}
        disabled={toggleFavorite.isPending}
        style={{
          opacity: isFavorited ? 1 : 0.5,
          filter: isFavorited ? 'none' : 'grayscale(100%)',
          cursor: toggleFavorite.isPending ? 'wait' : 'pointer',
        }}
      >
        <img src={isFavorited ? heartWhiteIcon : heartIcon} alt="" />
      </button>
    );
  };

  // Component to fetch and display artist name from labelId
  const ArtistName: React.FC<{ labelId: number }> = ({ labelId }) => {
    const { data: label, isLoading } = useRecordLabel(labelId);
    
    if (isLoading) return <span>Loading...</span>;
    return <span>{label?.labelName || "Unknown Artist"}</span>;
  };

  return (
    <div className="favorite-page">
      {/* TOP: left(main) + right(cards) */}
      <section className={`favorite-top ${isPopupOpen ? 'has-sidebar' : ''}`}>
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
              {loadingFavorites || loadingSongs ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                  Loading your favorite songs...
                </div>
              ) : songs && songs.length > 0 ? (
                songs.map((song, index) => {
                  // Format duration from seconds to mm:ss
                  const minutes = Math.floor(song.duration / 60);
                  const seconds = song.duration % 60;
                  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                  // Get the cover image from album
                  const coverImage = song.album?.coverImage || trackCover6;

                  return (
                    <article 
                      key={song.id} 
                      className="favorite-track"
                      onClick={() => handleSongClick(song)}
                      style={{ 
                        cursor: 'pointer',
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <div className="favorite-track__name">
                        <div className="favorite-track__cover">
                          <img src={coverImage} alt={song.title} />
                        </div>
                        <div className="favorite-track__meta">
                          <div className="favorite-track__title">{song.title}</div>
                          <div className="favorite-track__artist">
                            <ArtistName labelId={song.labelId} />
                          </div>
                        </div>
                      </div>

                      <div className="favorite-track__album">
                        {song.album?.albumTitle || "Unknown Album"}
                      </div>
                      <div className="favorite-track__time">{formattedTime}</div>

                      <div className="favorite-track__actions" onClick={(e) => e.stopPropagation()}>
                        <FavoriteButton songId={song.id} />
                        <button
                          className="favorite-icon-button"
                          type="button"
                          aria-label="More"
                        >
                          <img src={menuIcon} alt="" />
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                  No favorite songs yet. Start adding songs to your favorites!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - Sidebar Panel */}
        {isPopupOpen && selectedSong && (
          <aside className="favorite-top__right favorite-sidebar">
            <button 
              className="favorite-sidebar__close"
              onClick={handleClosePopup}
              type="button"
              aria-label="Close"
            >
              ×
            </button>

            <section className="favorite-card favorite-singer">
                <h2 className="favorite-card__title">Record Label Info</h2>

                {loadingLabel ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                    Loading label info...
                  </div>
                ) : recordLabel ? (
                  <>
                    <div className="favorite-singer__avatar">
                      <img 
                        src={recordLabel.imageUrl|| singerImage} 
                        alt={recordLabel.labelName}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = singerImage;
                        }}
                      />
                    </div>

                    <h3 className="favorite-singer__name">{recordLabel.labelName}</h3>
                    <p className="favorite-singer__bio">
                      {recordLabel.description || "No description available"}
                    </p>

                    {recordLabel.website && (
                      <a 
                        href={recordLabel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#fff', 
                          textDecoration: 'underline',
                          display: 'block',
                          marginTop: '10px'
                        }}
                      >
                        Visit Website
                      </a>
                    )}

                    {recordLabel.contactEmail && (
                      <p style={{ marginTop: '10px', fontSize: '14px' }}>
                        Contact: {recordLabel.contactEmail}
                      </p>
                    )}

                    <button
                      type="button"
                      className={`favorite-singer__follow ${
                        isFollowing ? "is-following" : ""
                      }`}
                      onClick={handleToggleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
                    No label information available
                  </div>
                )}
              </section>

              <section className="favorite-card favorite-other">
                <h3 className="favorite-card__title">Selected Song Details</h3>

                <div className="favorite-other__list">
                  <article className="favorite-other__item">
                    <div className="favorite-other__cover">
                      <img 
                        src={selectedSong.album?.coverImage || trackCover6} 
                        alt={selectedSong.title}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = trackCover6;
                        }}
                      />
                    </div>

                    <div className="favorite-other__meta">
                      <div className="favorite-other__song-title">{selectedSong.title}</div>
                      <div className="favorite-other__artist">
                        <ArtistName labelId={selectedSong.labelId} />
                      </div>
                      <div style={{ fontSize: '12px', marginTop: '5px' }}>
                        Genre: {selectedSong.genre?.genreName || "Unknown"}
                      </div>
                      <div style={{ fontSize: '12px' }}>
                        Plays: {selectedSong.playCount?.toLocaleString() || 0}
                      </div>
                    </div>

                    <div className="favorite-other__actions">
                      <FavoriteButton songId={selectedSong.id} />
                      <button
                        className="favorite-icon-button"
                        type="button"
                        aria-label="More"
                      >
                        <img src={menuIcon} alt="" />
                      </button>
                    </div>
                  </article>
                </div>
              </section>
          </aside>
        )}
      </section>

      {/* Suggestions */}
      <section className="favorite-section">
        <div className="favorite-section__header">
          <h2 className="favorite-section__title">Suggestions For You</h2>
          {recommendations && recommendations.length > 8 && (
            <button 
              className="favorite-section__see-all" 
              type="button"
              onClick={() => setShowAllSuggestions(!showAllSuggestions)}
            >
              {showAllSuggestions ? 'Show Less' : 'See All'}
            </button>
          )}
        </div>

        <div className="favorite-suggestions">
          {loadingRecommendations ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
              Loading suggestions...
            </div>
          ) : displayedSuggestions.length > 0 ? (
            displayedSuggestions.map((song, index) => {
              const coverImage = song.album?.coverImage || trackCover6;
              
              return (
                <article 
                  key={song.id} 
                  className="favorite-suggestion-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="favorite-suggestion-card__cover">
                    <img src={coverImage} alt={song.title} />
                  </div>

                  <div className="favorite-suggestion-card__meta">
                    <div className="favorite-suggestion-card__title">
                      {song.title}
                    </div>
                    <div className="favorite-suggestion-card__artist">
                      <ArtistName labelId={song.labelId!} />
                    </div>
                  </div>

                  <div className="favorite-suggestion-card__actions" onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton songId={song.id} />
                    <button
                      className="favorite-icon-button"
                      type="button"
                      aria-label="More"
                    >
                      <img src={menuIcon} alt="" />
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#fff' }}>
              No suggestions available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* You Might Also Like */}
      {/* <section className="favorite-section">
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
      </section> */}
    </div>
  );
};

export default FavoritePage;
