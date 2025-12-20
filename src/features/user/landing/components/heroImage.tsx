import heroArtDark from "@/assets/landing-dark.jpg"
import heroArtLight from "@/assets/landing-light.jpg"
import { useTheme } from "@/contexts/ThemeContext"
import { useInView } from "@/shared/hooks/useInView"

const HeroImage = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className="space-y-6">
      <div className="transition-colors duration-300" style={{ borderTop: '1px solid var(--color-border)' }} />
      <img
        src={isDark ? heroArtDark : heroArtLight}
        alt="Colorful audio visualizer"
        className={`w-full rounded-3xl object-cover shadow-[0_20px_80px_rgba(0,0,0,0.65)] transition-colors duration-300 fade-in-scale ${isInView ? 'visible' : ''}`}
        style={{ border: '1px solid var(--color-border)' }}
      />
    </section>
  )
}

export default HeroImage
