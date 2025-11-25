import { HTMLAttributes } from "react"
import starOutline from "@/assets/star-white.svg"

const genreItems = [
  "BASS",
  "BEATS", 
  "CHILLOUT",
  "AFROBEAT",
  "POP",
  "HIPPOP",
  "DEEP HOUSE",
  "JAZZ",
  "R&B",
  "ELECTRONIC",
  "ROCK",
  "INDIE",
]

export const GenreTicker = () => (
  <section className="py-4">
    <div 
      className="relative w-[120%] -ml-[10%] -rotate-[2deg] transition-colors duration-300"
      style={{ backgroundColor: 'var(--color-accent-light)' }}
    >
      <div className="genre-marquee-track py-4">
        <GenreTickerRow />
        <GenreTickerRow aria-hidden />
      </div>
    </div>
  </section>
)

const GenreTickerRow = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="genre-ticker-row">
    {genreItems.map((genre, index) => (
      <div
        key={index}
        className="flex items-center gap-4"
      >
        <img 
          src={starOutline} 
          alt="star icon" 
          className="h-5 w-5 object-contain"
          style={{ filter: "brightness(0)" }}
        />
        <span className="text-black text-lg font-medium tracking-wide whitespace-nowrap">
          {genre}
        </span>
      </div>
    ))}
  </div>
)

export default GenreTicker
