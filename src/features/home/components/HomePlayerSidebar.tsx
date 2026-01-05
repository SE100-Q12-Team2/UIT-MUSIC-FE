'use client';

interface HomePlayerSidebarProps {
  isPlayerVisible: boolean;
  setIsPlayerVisible: (visible: boolean) => void;
}

export default function HomePlayerSidebar({
  isPlayerVisible,
  setIsPlayerVisible,
}: HomePlayerSidebarProps) {
  const songs = [
    { title: 'idfc', artist: 'Blackbear', active: true },
    { title: 'So Low', artist: 'SZA' },
    { title: 'Chihiro', artist: 'Billie Eilish' },
    { title: 'Drama', artist: 'Roy Woods' },
    { title: 'Miracles', artist: 'Stalking Gia' },
    { title: 'Ride', artist: 'Twenty One Pilots' },
    { title: 'Where Is My Love', artist: 'SYML' },
    { title: 'Feel Something', artist: 'Bea Miller' },
    { title: 'Ocean Eyes', artist: 'Billie Eilish' },
    { title: 'Let Me Down Slowly', artist: 'Alec Benjamin' },
    { title: 'Lovely', artist: 'Billie Eilish & Khalid' }
  ];

  return (
    <aside
      className={`
        hidden lg:flex flex-col
        h-screen
        bg-[#1f2937]
        border-l border-white/10
        sticky top-0 right-0
        transition-all duration-300
        rounded-md
        ${
          isPlayerVisible
            ? 'w-[360px] min-w-[360px] opacity-100'
            : 'w-0 min-w-0 opacity-0 pointer-events-none'
        }
      `}
    >
      {/* IMPORTANT: min-h-0 để scroll hoạt động */}
      <div className="p-4 flex flex-col gap-4 h-full min-h-0">
        {/* ================= Header ================= */}
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-lg truncate">
            I Don’t Care
          </h3>
          <button
            onClick={() => setIsPlayerVisible(false)}
            className="text-gray-400 hover:text-white"
            title="Close player"
          >
            •••
          </button>
        </div>

        {/* ================= Playlist Info ================= */}
        <div className="flex gap-4">
          <img
            src="https://i.scdn.co/image/ab67616d0000b273e0f4e8f7a7e6f8a6c5b6f5a5"
            alt="cover"
            className="w-28 h-28 rounded-lg object-cover shadow-lg"
          />

          <div className="flex flex-col justify-between text-sm text-gray-300">
            <div className="flex items-center gap-2">
              🎵 <span>24 Tracks</span>
            </div>
            <div className="flex items-center gap-2">
              ⏱ <span>01:38:58</span>
            </div>
            <div className="flex items-center gap-2">
              👤 <span>Rayan</span>
            </div>
          </div>
        </div>

        {/* ================= Song List (SCROLL HERE) ================= */}
        <div className="flex-1 min-h-0 overflow-y-auto mt-2 pr-1">
          {songs.map((song, idx) => (
            <div
              key={idx}
              className={`
                flex items-center gap-3 p-2 mb-2 rounded-lg
                border border-white/10
                hover:bg-white/10 transition
                ${song.active ? 'bg-white/10' : ''}
              `}
            >
              <img
                src="https://i.scdn.co/image/ab67616d0000b273e0f4e8f7a7e6f8a6c5b6f5a5"
                alt=""
                className="w-10 h-10 rounded object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate">{song.title}</div>
                <div className="text-xs text-gray-400 truncate">
                  {song.artist}
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                ♡<button className="hover:text-white">•••</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
