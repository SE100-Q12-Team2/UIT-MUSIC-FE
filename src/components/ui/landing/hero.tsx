import { Badge } from "@/components/ui/landing/badge"
import { useInView } from "@/hooks/useInView"

const Hero = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div className={`space-y-6 fade-in-left ${isInView ? 'visible' : ''}`}>
        <h1 className="text-6xl font-light leading-[1.2] sm:text-6xl lg:text-7xl transition-colors duration-300"
          style={{ color: 'var(--color-text-primary)' }}>
          <div className="inline-flex items-center gap-4 whitespace-nowrap">
            <span>Listen to your favorite</span>
            <Badge variant="glow" className="px-4 py-1 text-sm font-semibold normal-case tracking-[0.2em]">
              music
            </Badge>
          </div>
          <span className="mt-6 block text-5xl font-black sm:text-5xl lg:text-6xl">anytime, anywhere</span>
        </h1>
      </div>

      <div className={`flex items-center lg:justify-end fade-in-right ${isInView ? 'visible' : ''}`}>
        <p className="max-w-[250px] text-base transition-colors duration-300"
          style={{ color: 'var(--color-text-secondary)' }}>
          Listen to over 80 million songs, exclusive releases and music in Hi-Fi sound formate.
        </p>
      </div>
    </section>
  )
}

export default Hero
