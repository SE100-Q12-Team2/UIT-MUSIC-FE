import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useRecordLabels, useLabelSongs } from '@/core/services/label.service';
import { useDeleteSong } from '@/core/services/song.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Search, Filter, ArrowUpDown, Edit, Trash2, ChevronDown, Check, Play } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { formatTime } from '@/shared/utils/formatTime';
import { toast } from 'sonner';
import { LabelSong } from '@/types/label.types';
import { Song } from '@/core/services/song.service';
import SongDetailModal from '../components/SongDetailModal';
import CreateSongForm from '../components/CreateSongForm';
import EditSongModal from '../components/EditSongModal';
import '@/styles/label-song-management.css';

type TabType = 'song-list' | 'create-song';
type SortOption = 'Latest' | 'Oldest' | 'Most Played' | 'Least Played' | 'A-Z' | 'Z-A';

const LabelSongManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('song-list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Latest');
  const [page] = useState(1);
  const limit = 20;

  // Dropdown states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Fetch record label info
  const { data: labels = [] } = useRecordLabels(user?.id);
  const label = labels[0]; // Assuming user has one label

  // Fetch songs for the label
  const { data: songsResponse, isLoading, refetch } = useLabelSongs(label?.id, page, limit);
  const deleteSongMutation = useDeleteSong();
  const { play } = useMusicPlayer();

  // Modal states
  const [selectedSong, setSelectedSong] = useState<LabelSong | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter and sort songs
  const filteredAndSortedSongs = useMemo(() => {
    const items = songsResponse?.items;
    if (!items) return [];

    let filtered = items;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.songArtists.some((sa) => sa.artist.artistName.toLowerCase().includes(query)) ||
          song.genre.genreName.toLowerCase().includes(query)
      );
    }

    // Genre filter
    if (filterValue !== 'All') {
      filtered = filtered.filter((song) => song.genre.genreName === filterValue);
    }

    // Sort
    switch (sortBy) {
      case 'Latest':
        filtered = [...filtered].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'Oldest':
        filtered = [...filtered].sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'Most Played':
        filtered = [...filtered].sort((a, b) => b.playCount - a.playCount);
        break;
      case 'Least Played':
        filtered = [...filtered].sort((a, b) => a.playCount - b.playCount);
        break;
      case 'A-Z':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [songsResponse, searchQuery, filterValue, sortBy]);

  // Get unique genres for filter
  const genres = useMemo(() => {
    const items = songsResponse?.items;
    if (!items) return [];
    const uniqueGenres = new Set(items.map((song) => song.genre.genreName));
    return Array.from(uniqueGenres).sort();
  }, [songsResponse]);

  // Sort options
  const sortOptions: SortOption[] = ['Latest', 'Oldest', 'Most Played', 'Least Played', 'A-Z', 'Z-A'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDelete = async (songId: number) => {
    if (!confirm('Are you sure you want to delete this song?')) return;

    try {
      await deleteSongMutation.mutateAsync(songId);
      toast.success('Song deleted successfully');
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to delete song';
      toast.error('Failed to delete song', { description: errorMsg });
    }
  };

  const handleEdit = (song: LabelSong) => {
    setSelectedSong(song);
    setIsEditModalOpen(true);
  };

  const handleViewDetail = (song: LabelSong) => {
    setSelectedSong(song);
    setIsDetailModalOpen(true);
  };

  const handlePlay = (song: LabelSong) => {
    // Convert LabelSong to Song format for music player
    // Music player needs Song from '@/core/services/song.service'
    const playerSong: Song = {
      id: song.id,
      title: song.title,
      description: song.description,
      duration: song.duration,
      language: song.language,
      lyrics: song.lyrics,
      albumId: song.albumId,
      genreId: song.genreId,
      labelId: song.labelId,
      uploadDate: song.uploadDate,
      isActive: song.isActive,
      copyrightStatus: song.copyrightStatus,
      playCount: song.playCount,
      isFavorite: song.isFavorite,
      songArtists: song.songArtists.map((sa) => ({
        artistId: sa.artistId,
        songId: sa.songId,
        role: sa.role,
        artist: {
          id: sa.artist.id,
          artistName: sa.artist.artistName,
          profileImage: sa.artist.profileImage,
        },
      })),
      album: {
        id: song.album.id,
        albumTitle: song.album.albumTitle,
        coverImage: song.album.coverImage,
      },
      genre: {
        id: song.genre.id,
        genreName: song.genre.genreName,
      },
      label: {
        id: song.label.id,
        labelName: song.label.labelName,
      },
      asset: song.asset ? {
        id: song.asset.id,
        bucket: song.asset.bucket,
        keyMaster: song.asset.keyMaster,
      } : {
        id: 0,
        bucket: '',
        keyMaster: '',
      },
    } as Song;
    
    // Get all songs for queue
    const allSongs: Song[] = 
      (songsResponse?.items || []).map((s) => {
        return {
          id: s.id,
          title: s.title,
          description: s.description,
          duration: s.duration,
          language: s.language,
          lyrics: s.lyrics,
          albumId: s.albumId,
          genreId: s.genreId,
          labelId: s.labelId,
          uploadDate: s.uploadDate,
          isActive: s.isActive,
          copyrightStatus: s.copyrightStatus,
          playCount: s.playCount,
          isFavorite: s.isFavorite,
          songArtists: s.songArtists.map((sa) => ({
            artistId: sa.artistId,
            songId: sa.songId,
            role: sa.role,
            artist: {
              id: sa.artist.id,
              artistName: sa.artist.artistName,
              profileImage: sa.artist.profileImage,
            },
          })),
          album: {
            id: s.album.id,
            albumTitle: s.album.albumTitle,
            coverImage: s.album.coverImage,
          },
          genre: {
            id: s.genre.id,
            genreName: s.genre.genreName,
          },
          label: {
            id: s.label.id,
            labelName: s.label.labelName,
          },
          asset: s.asset ? {
            id: s.asset.id,
            bucket: s.asset.bucket,
            keyMaster: s.asset.keyMaster,
          } : {
            id: 0,
            bucket: '',
            keyMaster: '',
          },
        };
      });

    play(playerSong, allSongs);
    toast.success(`Playing: ${song.title}`);
  };

  const handleCreateSuccess = () => {
    refetch();
    setActiveTab('song-list');
  };

  const formatPlayCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (!label) {
    return (
      <div className="label-song-management">
        <div className="label-song-management__error">No label found for this account</div>
      </div>
    );
  }

  return (
    <div className="label-song-management">
      {/* Tabs */}
      <div className="label-song-management__tabs">
        <button
          className={`label-song-management__tab ${activeTab === 'song-list' ? 'label-song-management__tab--active' : ''}`}
          onClick={() => setActiveTab('song-list')}
        >
          Song List
        </button>
        <button
          className={`label-song-management__tab ${activeTab === 'create-song' ? 'label-song-management__tab--active' : ''}`}
          onClick={() => setActiveTab('create-song')}
        >
          Create Song
        </button>
      </div>

      {/* Song List Tab */}
      {activeTab === 'song-list' && (
        <div className="label-song-management__content">
          {/* Search and Filter Bar */}
          <div className="label-song-management__toolbar">
            <div className="label-song-management__search">
              <Search size={18} className="label-song-management__search-icon" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="label-song-management__search-input"
              />
            </div>
            <div className="label-song-management__filters">
              {/* Filter Dropdown */}
              <div className="label-song-management__dropdown" ref={filterRef}>
                <Button
                  variant="outline"
                  className="label-song-management__filter-btn"
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                    setIsSortOpen(false);
                  }}
                >
                  <Filter size={16} />
                  {filterValue}
                  <ChevronDown size={16} className={isFilterOpen ? 'label-song-management__chevron--open' : ''} />
                </Button>
                {isFilterOpen && (
                  <div className="label-song-management__dropdown-menu">
                    <button
                      className={`label-song-management__dropdown-item ${filterValue === 'All' ? 'label-song-management__dropdown-item--active' : ''}`}
                      onClick={() => {
                        setFilterValue('All');
                        setIsFilterOpen(false);
                      }}
                    >
                      All
                      {filterValue === 'All' && <Check size={16} />}
                    </button>
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        className={`label-song-management__dropdown-item ${filterValue === genre ? 'label-song-management__dropdown-item--active' : ''}`}
                        onClick={() => {
                          setFilterValue(genre);
                          setIsFilterOpen(false);
                        }}
                      >
                        {genre}
                        {filterValue === genre && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="label-song-management__dropdown" ref={sortRef}>
                <Button
                  variant="outline"
                  className="label-song-management__sort-btn"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsFilterOpen(false);
                  }}
                >
                  <ArrowUpDown size={16} />
                  Sort by
                  <ChevronDown size={16} className={isSortOpen ? 'label-song-management__chevron--open' : ''} />
                </Button>
                {isSortOpen && (
                  <div className="label-song-management__dropdown-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        className={`label-song-management__dropdown-item ${sortBy === option ? 'label-song-management__dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                      >
                        {option}
                        {sortBy === option && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Songs Table */}
          <div className="label-song-management__table-wrapper">
            <table className="label-song-management__table">
              <thead>
                <tr>
                  <th>SONG NAME</th>
                  <th>ARTIST</th>
                  <th>GENRE</th>
                  <th>LISTEN COUNT</th>
                  <th>RATING</th>
                  <th>DURATION</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="label-song-management__loading">
                      Loading songs...
                    </td>
                  </tr>
                ) : filteredAndSortedSongs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="label-song-management__empty">
                      No songs found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedSongs.map((song) => (
                    <tr key={song.id}>
                      <td>
                        <div className="label-song-management__song-name">
                          <img
                            src={song.album.coverImage || 'https://via.placeholder.com/40'}
                            alt={song.title}
                            className="label-song-management__song-cover"
                          />
                          <div className="label-song-management__song-info">
                            <span 
                              className="label-song-management__song-title label-song-management__song-title--clickable"
                              onClick={() => handleViewDetail(song)}
                            >
                              {song.title}
                            </span>
                            <button
                              className="label-song-management__play-btn"
                              onClick={() => handlePlay(song)}
                              title="Play"
                              aria-label="Play song"
                            >
                              <Play size={14} fill="currentColor" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td>
                        {song.songArtists.map((sa) => sa.artist.artistName).join(', ')}
                      </td>
                      <td>{song.genre.genreName}</td>
                      <td>{formatPlayCount(song.playCount)}</td>
                      <td>
                        {/* TODO: Get rating from API if available */}
                        4.9
                      </td>
                      <td>{formatTime(song.duration)}</td>
                      <td>
                        <div className="label-song-management__actions">
                          <button
                            className="label-song-management__action-btn"
                            onClick={() => handleEdit(song)}
                            title="Edit"
                            aria-label="Edit song"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="label-song-management__action-btn label-song-management__action-btn--delete"
                            onClick={() => handleDelete(song.id)}
                            title="Delete"
                            aria-label="Delete song"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Song Tab */}
      {activeTab === 'create-song' && (
        <div className="label-song-management__content">
          <CreateSongForm
            onSuccess={handleCreateSuccess}
            onCancel={() => setActiveTab('song-list')}
          />
        </div>
      )}

      {/* Modals */}
      <SongDetailModal
        song={selectedSong}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSong(null);
        }}
      />
      <EditSongModal
        song={selectedSong}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSong(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />
    </div>
  );
};

export default LabelSongManagementPage;

