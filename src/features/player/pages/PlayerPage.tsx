import React, { useMemo, useEffect, useRef } from 'react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { formatTime } from '@/shared/utils/formatTime';
import { cn } from '@/lib/utils';
import { usePageBackground } from '@/shared/hooks/usePageBackground';
import { AdDisplay } from '@/shared/components/AdDisplay';
import backgroundSettings from '@/assets/background-settings.png';
import '@/styles/player-page.css';

interface SongWithLyrics {
  lyrics?: string;
  [key: string]: unknown;
}

const PlayerPage: React.FC = () => {
  const {
    currentSong,
    currentTime,
    duration,
    queue,
    currentIndex,
    play,
  } = useMusicPlayer();

  // Use label background (same as settings)
  usePageBackground(backgroundSettings);

  const songListRef = useRef<HTMLDivElement>(null);
  const activeSongRef = useRef<HTMLDivElement>(null);
  const activeLyricRef = useRef<HTMLDivElement>(null);

  // Use current song from player context (from API)
  const displaySong = currentSong;
  const displayTime = currentTime;
  const displayDuration = duration;
  
  // Parse lyrics into lines
  const lyricsLines = useMemo(() => {
    if (!displaySong) return [];
    const songWithLyrics = displaySong as unknown as SongWithLyrics;
    if (!songWithLyrics.lyrics) return [];
    const lyrics = songWithLyrics.lyrics || '';
    return lyrics.split('\n').filter((line: string) => line.trim());
  }, [displaySong]);

  // Calculate which line should be highlighted based on currentTime
  const currentLineIndex = useMemo(() => {
    if (lyricsLines.length === 0 || displayDuration === 0) return -1;
    // Simple calculation: distribute lines evenly across duration
    const timePerLine = displayDuration / lyricsLines.length;
    return Math.floor(displayTime / timePerLine);
  }, [lyricsLines, displayTime, displayDuration]);

  // Scroll active song to center
  useEffect(() => {
    if (activeSongRef.current && songListRef.current) {
      const container = songListRef.current;
      const activeItem = activeSongRef.current;
      const itemOffsetTop = activeItem.offsetTop;
      const itemHeight = activeItem.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);
      container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
    }
  }, [currentIndex, currentSong]);

  // Scroll active lyric to center
  useEffect(() => {
    if (activeLyricRef.current && currentLineIndex >= 0) {
      const container = activeLyricRef.current.parentElement;
      if (container) {
        const itemOffsetTop = activeLyricRef.current.offsetTop;
        const itemHeight = activeLyricRef.current.offsetHeight;
        const containerHeight = container.clientHeight;
        const scrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);
        container.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });
      }
    }
  }, [currentLineIndex]);

  // IMPORTANT: All hooks must be called before any conditional returns
  // This follows React's Rules of Hooks - hooks must be called unconditionally
  // at the top level. The early return below is safe because all hooks above
  // handle null/empty cases internally (useMemo returns empty arrays, useEffect has guards)
  // Show empty state if no song is playing
  if (!displaySong) {
    return (
      <div className="player-page">
        <div className="player-page__empty">
          <p className="text-gray-400 text-lg">No song is currently playing</p>
          <p className="text-gray-500 text-sm mt-2">Select a song to start playing</p>
        </div>
      </div>
    );
  }

  // Get album name from API
  const albumName = displaySong.album?.albumTitle || '';

  // Get cover image from API: album.coverImage
  const coverImage = displaySong.album?.coverImage || '';

  return (
    <div className="player-page">
      {/* Main Content - 3 columns: Song List | Vinyl | Lyrics */}
      <div className="player-page__container">
        {/* Left - Album/Track List */}
        <div className="player-page__song-list" ref={songListRef}>
          {queue.length > 0 ? queue.map((song, index) => {
            // Get cover image from API: album.coverImage
            const songCoverUrl = song.album?.coverImage || '';
            const songTitle = song.title;
            // Get artist from API: contributors array
            const songArtist = song.contributors?.map((c: any) => c.label?.artistName || c.label?.labelName).filter(Boolean).join(', ') || 'Unknown Artist';
            const songDuration = formatTime(song.duration);
            const isCurrent = index === currentIndex;
            const albumTitle = song.album?.albumTitle || '';

            return (
              <div
                key={song.id}
                ref={isCurrent ? activeSongRef : null}
                className={cn(
                  "player-page__song-item",
                  isCurrent && "player-page__song-item--active"
                )}
                onClick={() => play(song, queue)}
              >
                <div className="player-page__song-cover">
                  <img
                    src={songCoverUrl || 'https://via.placeholder.com/120'}
                    alt={songTitle}
                    className="player-page__song-cover-img"
                  />
                </div>
                {isCurrent ? (
                  <div className="player-page__song-info">
                    <div className="player-page__song-title">{songTitle}</div>
                    <div className="player-page__song-artist">{songArtist}</div>
                    <div className="player-page__song-duration">{songDuration}</div>
                    <div className="player-page__song-heart">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="player-page__song-album-title">{albumTitle || songTitle}</div>
                )}
              </div>
            );
          }) : (
            <div className="player-page__song-list-empty">
              <p className="text-gray-400 text-sm">No songs in queue</p>
            </div>
          )}
        </div>

        {/* Center - Vinyl Record */}
        <div className="player-page__vinyl-container">
          <div className="player-page__vinyl">
            <div className="player-page__vinyl-inner">
              {/* Album cover image */}
              <img
                src={coverImage}
                alt={displaySong.title}
                className="player-page__vinyl-image"
              />
              <div className="player-page__vinyl-center">
                <div className="player-page__vinyl-text-main">{albumName.split(' ')[0] || 'ARCANE'}</div>
                <div className="player-page__vinyl-text-sub">{albumName.split(' ').slice(1).join(' ') || 'LEAGUE OF LEGENDS'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Lyrics Section */}
        <div className="player-page__lyrics-container">
          <div className="player-page__lyrics">
            {lyricsLines.length > 0 ? (
              lyricsLines.map((line: string, index: number) => (
                <div
                  key={index}
                  ref={index === currentLineIndex ? activeLyricRef : null}
                  className={cn(
                    "player-page__lyrics-line",
                    index === currentLineIndex && "player-page__lyrics-line--active"
                  )}
                >
                  {line}
                </div>
              ))
            ) : (
              <div className="player-page__lyrics-empty">
                <p className="text-gray-500">No lyrics available</p>
              </div>
            )}
          </div>

          {/* Advertisement */}
          <div className="mt-6">
            <AdDisplay placement="Player" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
