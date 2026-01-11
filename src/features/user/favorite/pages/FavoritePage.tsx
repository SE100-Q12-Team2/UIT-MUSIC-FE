import React, { useState, useMemo } from "react";
import "@/styles/favorite.css";

import { usePageBackground } from "@/shared/hooks/usePageBackground";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { useFavoriteSongs, useCheckFavorite, useToggleFavorite } from "@/core/services/favorite.service";
import { useSongsByIds } from "@/core/services/song.service";
import { useRecordLabel } from "@/core/services/label.service";
import { useDiscoverWeekly, usePersonalizedRecommendations } from "@/core/services/recommendation.service";
import { Heart, MoreVertical, Play, Music2 } from "lucide-react";

import favoriteBg from "@/assets/background-playlist.jpg";
import favoriteBanner from "@/assets/background_fv.png";
import singerImage from "@/assets/singer.png";
import trackCover6 from "@/assets/Track Cover_6.png";

const FavoritePage: React.FC = () => {
  usePageBackground(favoriteBg);
  const { user } = useAuth();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
  };

  // Fetch favorite song IDs
  const { data: favoritesData, isLoading: loadingFavorites } = useFavoriteSongs(user?.id);
  
  const songIds = useMemo(() => {
    const ids = favoritesData?.songIds || [];
    return ids;
  }, [favoritesData?.songIds]);

  // Fetch song details for all favorite songs
  const { data: songs, isLoading: loadingSongs } = useSongsByIds(songIds);

  // Fetch recommendations for suggestions
  const { data: recommendations, isLoading: loadingRecommendations } = useDiscoverWeekly();
  const { data: youMightLike, isLoading: loadingYouMightLike } = usePersonalizedRecommendations(8);
  
  const displayedSuggestions = useMemo(() => {
    return showAllSuggestions ? recommendations || [] : (recommendations?.slice(0, 8) || []);
  }, [recommendations, showAllSuggestions]);
  
  // Fetch record label info for the first favorite song (for About Songer section)
  const firstSong = songs?.[0];
  const { data: recordLabel, isLoading: loadingLabel } = useRecordLabel(
    firstSong?.labelId ?? undefined
  );

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
        className="favorite-icon-btn"
        type="button"
        aria-label="Favorite"
        onClick={handleToggle}
        disabled={toggleFavorite.isPending}
      >
        <Heart 
          size={18} 
          fill={isFavorited ? "currentColor" : "none"}
          className={isFavorited ? "text-red-400" : "text-gray-400"}
        />
      </button>
    );
  };

  // Component to fetch and display artist name from labelId
  const ArtistName: React.FC<{ labelId: number | null }> = ({ labelId }) => {
    const { data: label, isLoading } = useRecordLabel(labelId ?? 0);
    
    if (!labelId) return <span>Unknown Artist</span>;
    if (isLoading) return <span>Loading...</span>;
    return <span>{label?.labelName || "Unknown Artist"}</span>;
  };

  return (
    <div className="favorite-page">
      {/* Banner - Full Width */}
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
            Because Favorites Deserve Their Own Space ...
          </p>
        </div>
      </div>

      {/* Table and Sidebar Layout */}
      <div className="favorite-content-layout">
        {/* LEFT: Main Content with Table */}
        <div className="favorite-main">
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
                <div className="favorite-loading">
                  Loading your favorite songs...
                </div>
              ) : songs && songs.length > 0 ? (
                songs.map((song, index) => {
                  const minutes = Math.floor(song.duration / 60);
                  const seconds = song.duration % 60;
                  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                  const coverImage = song.album?.coverImage || trackCover6;

                  return (
                    <article 
                      key={song.id} 
                      className="favorite-track"
                      style={{ animationDelay: `${index * 0.05}s` }}
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
                        <button className="favorite-icon-btn" type="button">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="favorite-empty">
                  No favorite songs yet. Start adding songs to your favorites!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <aside className="favorite-sidebar">
          {/* About Songer */}
          <section className="favorite-card about-songer">
            <h2 className="favorite-card__title">About Songer</h2>

            {loadingLabel ? (
              <div className="favorite-loading">Loading...</div>
            ) : recordLabel ? (
              <>
                <div className="about-songer__avatar">
                  <img 
                    src={recordLabel.imageUrl || singerImage} 
                    alt={recordLabel.labelName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = singerImage;
                    }}
                  />
                </div>

                <h3 className="about-songer__name">{recordLabel.labelName}</h3>
                <p className="about-songer__bio">
                  {recordLabel.description || "British singer-songwriter. She is known for her mezzo-soprano vocals and emotive delivery. After graduating..."}
                </p>

                <button
                  type="button"
                  className={`about-songer__follow ${isFollowing ? "is-following" : ""}`}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </>
            ) : (
              <>
                <div className="about-songer__avatar">
                  <img src={singerImage} alt="Artist" />
                </div>
                <h3 className="about-songer__name">Adele Laurie Blue Adkins</h3>
                <p className="about-songer__bio">
                  British singer-songwriter. She is known for her mezzo-soprano vocals and emotive delivery. After graduating...
                </p>
                <button
                  type="button"
                  className={`about-songer__follow ${isFollowing ? "is-following" : ""}`}
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </>
            )}
          </section>

          {/* Other Song */}
          <section className="favorite-card other-songs">
            <h3 className="favorite-card__title">Other Song</h3>

            <div className="other-songs__list">
              {songs && songs.slice(0, 3).map((song) => {
                const coverImage = song.album?.coverImage || trackCover6;
                
                return (
                  <article key={song.id} className="other-songs__item">
                    <div className="other-songs__cover">
                      <img src={coverImage} alt={song.title} />
                    </div>

                    <div className="other-songs__meta">
                      <div className="other-songs__title">{song.title}</div>
                      <div className="other-songs__artist">
                        <ArtistName labelId={song.labelId} />
                      </div>
                    </div>

                    <div className="other-songs__actions">
                      <FavoriteButton songId={song.id} />
                      <button className="favorite-icon-btn" type="button">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </aside>
      </div>

      {/* Suggestions For You */}
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
            <div className="favorite-loading">Loading suggestions...</div>
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
                    <span className="favorite-suggestion-card__count">
                      +{Math.floor(Math.random() * 50) + 10}
                    </span>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="favorite-empty">
              No suggestions available at the moment.
            </div>
          )}
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
          {loadingYouMightLike ? (
            <div className="favorite-loading">Loading recommendations...</div>
          ) : youMightLike && youMightLike.length > 0 ? (
            youMightLike.slice(0, 8).map((song) => {
              const coverImage = song.album?.coverImage || trackCover6;
              
              return (
                <article key={song.id} className="ymal-card">
                  <div className="ymal-card__cover">
                    <img src={coverImage} alt={song.title} />
                    <div className="ymal-card__overlay">
                      <button className="ymal-card__play">
                        <Play size={24} fill="white" />
                      </button>
                    </div>
                  </div>

                  <div className="ymal-card__meta">
                    <div className="ymal-card__title">{song.title}</div>
                    <div className="ymal-card__artist">
                      <ArtistName labelId={song.labelId!} />
                    </div>

                    <div className="ymal-card__info">
                      <Music2 size={14} />
                      <span>{Math.floor(song.duration / 60)} Tracks</span>
                    </div>

                    <div className="ymal-card__actions">
                      <FavoriteButton songId={song.id} />
                      <span className="ymal-card__likes">
                        {song.playCount ? `${Math.floor(song.playCount / 100)}` : '0'}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default FavoritePage;
