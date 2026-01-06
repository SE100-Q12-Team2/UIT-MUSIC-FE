import React from 'react';

export const BannerSkeleton = () => (
  <div className="relative h-[88px] w-[256px] rounded-xl overflow-hidden shrink-0 animate-pulse bg-[#13132b]/50 border border-white/5">
    <div className="absolute inset-0 flex flex-col justify-end p-5">
      <div className="h-6 w-32 bg-white/20 rounded mb-2" />
      <div className="w-8 h-1 bg-white/20 rounded-full" />
    </div>
  </div>
);

export const MusicCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square rounded-lg bg-[#13132b]/50 border border-white/5 mb-3" />
    <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
    <div className="h-3 bg-white/10 rounded w-1/2" />
  </div>
);

export const SongRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 animate-pulse">
    <div className="w-12 h-12 rounded bg-[#13132b]/50 shrink-0" />
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-white/10 rounded w-48 mb-2" />
      <div className="h-3 bg-white/10 rounded w-32" />
    </div>
    <div className="h-3 bg-white/10 rounded w-12" />
  </div>
);

export const BannersSectionSkeleton = () => (
  <section className="px-8 pt-6 pb-8">
    <div className="flex gap-6">
      {[1, 2, 3].map((i) => (
        <BannerSkeleton key={i} />
      ))}
    </div>
  </section>
);

export const MusicCardGridSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <MusicCardSkeleton key={i} />
    ))}
  </div>
);

export const SongListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={i !== count - 1 ? 'border-b border-white/5' : ''}
      >
        <SongRowSkeleton />
      </div>
    ))}
  </div>
);
