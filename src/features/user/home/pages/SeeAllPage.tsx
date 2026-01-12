import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Play } from 'lucide-react';
import { useAlbums } from '@/core/services/album.service';
import { useDailyMix, usePersonalizedRecommendations, useDiscoverWeekly } from '@/core/services/recommendation.service';
import { PlaylistData } from '@/features/user/home/hooks/useHomeData';
import '@/styles/all-albums.css';

type SectionType = 
  | 'tailored-playlists'
  | 'daily-pick'
  | 'discover-series'
  | 'personal-space'
  | 'recent-albums'
  | 'you-recently-seen';

interface SectionConfig {
  title: string;
  subtitle: string;
}

const SECTION_CONFIGS: Record<SectionType, SectionConfig> = {
  'tailored-playlists': {
    title: 'All Playlists Tailored For You',
    subtitle: 'Personalized mixes created just for you',
  },
  'daily-pick': {
    title: 'All Daily Picks',
    subtitle: 'Fresh album recommendations updated daily',
  },
  'discover-series': {
    title: 'Discover The Magic Of Series Musics',
    subtitle: 'Explore curated music series collections',
  },
  'personal-space': {
    title: 'Your Personal Music Space',
    subtitle: 'Albums based on your listening history',
  },
  'recent-albums': {
    title: 'Recent Albums',
    subtitle: 'Latest album releases and updates',
  },
  'you-recently-seen': {
    title: 'You Recently Seen',
    subtitle: 'Albums you recently explored',
  },
};

const SeeAllPage: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useParams<{ section: string }>();
  const [page, setPage] = useState(1);
  const limit = 20;

  const sectionType = section as SectionType;
  const config = SECTION_CONFIGS[sectionType] || SECTION_CONFIGS['daily-pick'];

  // Fetch data based on section type
  const { data: albumsResponse, isLoading: albumsLoading } = useAlbums({ 
    page, 
    limit,
    order: 'latest' 
  });
  
  const { data: dailyMixData, isLoading: dailyMixLoading } = useDailyMix();
  const { data: personalizedData, isLoading: personalizedLoading } = usePersonalizedRecommendations(100);
  const { data: discoverWeeklyData, isLoading: discoverWeeklyLoading } = useDiscoverWeekly();

  // Transform data based on section type
  const { items, isLoading } = useMemo(() => {
    let resultItems: PlaylistData[] = [];
    let loading = false;

    switch (sectionType) {
      case 'tailored-playlists':
        loading = dailyMixLoading;
        if (dailyMixData?.mixes) {
          resultItems = dailyMixData.mixes.map((mix) => {
            const firstSong = mix.songs[0];
            let albumId = '';
            let coverUrl = '';
            
            if (firstSong?.album) {
              albumId = firstSong.album.id.toString();
              coverUrl = firstSong.album.coverImage || `https://picsum.photos/seed/${mix.id}/300/300`;
            } else {
              albumId = mix.id;
              coverUrl = `https://picsum.photos/seed/${mix.id}/300/300`;
            }
            
            return {
              id: albumId,
              title: mix.title,
              subtitle: `${mix.songs.length} Tracks`,
              coverUrl,
            };
          });
        }
        break;

      case 'daily-pick':
      case 'discover-series':
      case 'you-recently-seen':
        loading = discoverWeeklyLoading;
        if (discoverWeeklyData && Array.isArray(discoverWeeklyData)) {
          const albumMap = new Map<number, PlaylistData>();
          discoverWeeklyData.forEach(song => {
            if (song.album && song.albumId && !albumMap.has(song.albumId)) {
              albumMap.set(song.albumId, {
                id: song.albumId.toString(),
                title: song.album.albumTitle,
                subtitle: 'Recommended for you',
                coverUrl: song.album.coverImage || `https://picsum.photos/seed/album-${song.albumId}/300/300`,
              });
            }
          });
          resultItems = Array.from(albumMap.values());
        }
        break;

      case 'personal-space':
        loading = personalizedLoading;
        if (personalizedData && Array.isArray(personalizedData)) {
          const albumMap = new Map<number, PlaylistData>();
          personalizedData.forEach(song => {
            if (song.album && song.albumId && !albumMap.has(song.albumId)) {
              albumMap.set(song.albumId, {
                id: song.albumId.toString(),
                title: song.album.albumTitle,
                subtitle: `${song.playCount || 0} Plays`,
                coverUrl: song.album.coverImage || `https://picsum.photos/seed/album-${song.albumId}/300/300`,
              });
            }
          });
          resultItems = Array.from(albumMap.values());
        }
        break;

      case 'recent-albums':
        loading = albumsLoading;
        if (albumsResponse?.items) {
          resultItems = albumsResponse.items.map((album) => ({
            id: album.id.toString(),
            title: album.albumTitle,
            subtitle: `${album.totalTracks} Tracks`,
            coverUrl: album.coverImage || `https://picsum.photos/seed/album-${album.id}/300/300`,
          }));
        }
        break;
    }

    return { items: resultItems, isLoading: loading };
  }, [sectionType, dailyMixData, dailyMixLoading, personalizedData, personalizedLoading, 
      discoverWeeklyData, discoverWeeklyLoading, albumsResponse, albumsLoading]);

  const handleItemClick = (id: string) => {
    navigate(`/album/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="all-albums-page">
        <div className="all-albums-page__loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="all-albums-page">
      <div className="all-albums-page__header">
        <h1 className="all-albums-page__title">{config.title}</h1>
        <p className="all-albums-page__subtitle">{config.subtitle}</p>
      </div>

      {items.length > 0 ? (
        <>
          <div className="all-albums-page__grid">
            {items.map((item) => (
              <div
                key={item.id}
                className="album-card"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="album-card__image-wrapper">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="album-card__image"
                    />
                  ) : (
                    <div className="album-card__placeholder">
                      <span>🎵</span>
                    </div>
                  )}
                  <div className="album-card__overlay">
                    <div className="album-card__play-button">
                      <Play size={24} fill="white" className="text-white" />
                    </div>
                  </div>
                </div>
                <div className="album-card__info">
                  <h3 className="album-card__title">{item.title}</h3>
                  <p className="album-card__meta">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - only for sections with pagination support */}
          {sectionType === 'recent-albums' && albumsResponse && albumsResponse.totalPages > 1 && (
            <div className="all-albums-page__pagination">
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="pagination-info">
                Page {page} of {albumsResponse.totalPages}
              </div>
              <button
                className="pagination-button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === albumsResponse.totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="all-albums-page__empty">
          <p>No items available</p>
        </div>
      )}
    </div>
  );
};

export default SeeAllPage;
