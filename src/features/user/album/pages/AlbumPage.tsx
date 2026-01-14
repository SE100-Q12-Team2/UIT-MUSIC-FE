import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { useAlbumDetails, AlbumSong } from '@/core/services/album.service';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/shared/components/ui/button';
import { formatTime } from '@/shared/utils/formatTime';
import { Song } from '@/core/services/song.service';
import '@/styles/playlists.css'

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { play } = useMusicPlayer();
  
  const albumId = id ? parseInt(id, 10) : undefined;
  const { data: album, isLoading: albumLoading } = useAlbumDetails(albumId, true);
  
  const isLoading = albumLoading;
  
  const songs: AlbumSong[] = album?.songs || [];

  const convertToSong = (albumSong: AlbumSong): Song => {
    return {
      id: albumSong.id,
      title: albumSong.title,
      description: null,
      duration: albumSong.duration,
      language: null,
      lyrics: null,
      albumId: album?.id || null,
      genreId: null,
      labelId: null,
      uploadDate: albumSong.uploadDate,
      isActive: true,
      copyrightStatus: 'Clear',
      playCount: albumSong.playCount,
      contributors: [],
      album: {
        id: album?.id || 0,
        albumTitle: album?.albumTitle || '',
        coverImage: album?.coverImage || '',
      },
      genre: {
        id: 0,
        genreName: '',
      },
      label: {
        id: 0,
        labelName: '',
      },
      favorites: [],
    } as Song;
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      // Convert all songs to Song format and play first one
      const convertedSongs = songs.map(convertToSong);
      play(convertedSongs[0], convertedSongs);
    }
  };

  const handlePlaySong = (albumSong: AlbumSong) => {
    const convertedSongs = songs.map(convertToSong);
    const songToPlay = convertToSong(albumSong);
    play(songToPlay, convertedSongs);
  };

  if (isLoading) {
    return (
      <div className="playlist-page">
        <div className="playlist-page__loading">Loading album...</div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="playlist-page">
        <div className="playlist-page__error">Album not found</div>
      </div>
    );
  }

  return (
    <div className="playlist-page">
      {/* Header */}
      <div className="playlist-page__header">
        <div className="playlist-page__cover">
          {album.coverImage ? (
            <img src={album.coverImage} alt={album.albumTitle} />
          ) : (
            <div className="playlist-page__cover-placeholder">
              <span>🎵</span>
            </div>
          )}
        </div>
        <div className="playlist-page__info">
          <p className="playlist-page__type">Album</p>
          <h1 className="playlist-page__title">{album.albumTitle}</h1>
          {album.albumDescription && (
            <p className="playlist-page__description">{album.albumDescription}</p>
          )}
          <div className="playlist-page__meta">
            <span>{songs.length} songs</span>
            {album.releaseDate && (
              <>
                <span>•</span>
                <span>{new Date(album.releaseDate).getFullYear()}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="playlist-page__actions">
        <Button
          size="lg"
          className="bg-vio-accent hover:bg-vio-accent/90"
          onClick={handlePlayAll}
          disabled={songs.length === 0}
        >
          <Play className="mr-2 h-5 w-5" fill="white" />
          Play
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <Heart className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Songs Table */}
      {songs.length > 0 ? (
        <div className="playlist-page__table">
          <div className="playlist-page__table-header">
            <div className="playlist-page__table-col playlist-page__table-col--index">#</div>
            <div className="playlist-page__table-col playlist-page__table-col--title">Title</div>
            <div className="playlist-page__table-col playlist-page__table-col--album">Album</div>
            <div className="playlist-page__table-col playlist-page__table-col--duration">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="playlist-page__table-body">
            {songs.map((song, index) => (
              <div
                key={song.id}
                className="playlist-page__table-row"
                onClick={() => handlePlaySong(song)}
              >
                <div className="playlist-page__table-col playlist-page__table-col--index">
                  <span className="playlist-page__track-number">{index + 1}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="playlist-page__play-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(song);
                    }}
                  >
                    <Play className="h-4 w-4" fill="white" />
                  </Button>
                </div>
                <div className="playlist-page__table-col playlist-page__table-col--title">
                  <div className="playlist-page__song-info">
                    <p 
                      className="playlist-page__song-title cursor-pointer hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/songs/${song.id}`);
                      }}
                    >
                      {song.title}
                    </p>
                    <p className="playlist-page__song-artist">
                      {song.songArtists?.map((sa) => 
                        sa.artist.artistName
                      ).filter(Boolean).join(', ') || 'Unknown Artist'}
                    </p>
                  </div>
                </div>
                <div className="playlist-page__table-col playlist-page__table-col--album">
                  {album.albumTitle}
                </div>
                <div className="playlist-page__table-col playlist-page__table-col--duration">
                  {formatTime(song.duration || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="playlist-page__empty">
          <p>No songs in this album</p>
        </div>
      )}
    </div>
  );
};

export default AlbumPage;
