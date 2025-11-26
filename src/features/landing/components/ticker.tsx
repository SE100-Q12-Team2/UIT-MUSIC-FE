import { HTMLAttributes } from "react"
import starWhite from "@/assets/star-white.svg"
import starYellow from "@/assets/star-yellow.svg"

const tickerItems = [
  { label: "Trending Music", icon: starWhite },
  { label: "Trending Music", icon: starYellow },
  { label: "Trending Music", icon: starWhite },
  { label: "Trending Music", icon: starYellow },
  { label: "Trending Music", icon: starWhite },
  { label: "Trending Music", icon: starYellow },
  
]

export const Ticker = () => (
  <section className="pt-6">
    <div className="relative mt-6 overflow-hidden w-full">
      <div className="marquee-track">
        <TickerRow />
        <TickerRow aria-hidden />
      </div>
    </div>
  </section>
);

const TickerRow = (props: HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className="ticker-row">
    {tickerItems.map((item, index) => (
      <div
        key={index}
        className="flex items-center gap-3 text-xl font-semibold transition-colors duration-300"
        style={{ 
          color: 'var(--color-text-primary)',
          filter: 'var(--ticker-shadow)'
        }}
      >
        <img src={item.icon} alt="star icon" className="h-5 w-5 object-contain" />
        <span style={{ color: index % 2 === 0 ? 'var(--color-text-primary)' : 'var(--color-accent)' }}>
          {item.label}
        </span>
      </div>
    ))}
  </div>
);
