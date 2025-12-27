
interface HomeMiniPlayerProps {
  setIsPlayerVisible: (visible: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export default function HomeMiniPlayer({ isPlaying, setIsPlayerVisible, setIsPlaying }: HomeMiniPlayerProps) {
  return (
    <div
      className="
            fixed bottom-4 right-4 z-50
            flex items-center gap-3
            bg-[#1f2937]/95 backdrop-blur
            border border-white/10
            rounded-xl px-3 py-2
            shadow-xl
            w-[280px]
            "
    >
      {/* Cover */}
      <img
        src="https://i.scdn.co/image/ab67616d0000b273e0f4e8f7a7e6f8a6c5b6f5a5"
        alt="cover"
        className="w-12 h-12 rounded-lg object-cover"
      />

      {/* Song info */}
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">idfc</div>
        <div className="text-xs text-gray-400 truncate">Blackbear</div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="
                w-8 h-8 rounded-full
                bg-white text-black
                flex items-center justify-center
                hover:scale-105 transition
                "
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>

        <button
          onClick={() => setIsPlayerVisible(true)}
          className="
                text-gray-300 hover:text-white
                text-lg
                "
          title="Expand player"
        >
          ⬆
        </button>
      </div>
    </div>
  );
}
