import { useTheme } from "@/contexts/ThemeContext"
import { useInView } from "@/hooks/useInView"

// Light theme icons
import partnerOneLight from "@/assets/icon1-light.svg"
import partnerTwoLight from "@/assets/icon2-light.svg"
import partnerThreeLight from "@/assets/icon3-light.svg"
import partnerFourLight from "@/assets/icon4-light.svg"

// Dark theme icons
import partnerOneDark from "@/assets/icon1-dark.svg"
import partnerTwoDark from "@/assets/icon2-dark.svg"
import partnerThreeDark from "@/assets/icon3-dark.svg"
import partnerFourDark from "@/assets/icon4-dark.svg"

const Partners = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { ref, isInView } = useInView({ threshold: 0.1 })

  const partners = [
    { name: "GOOD Music", src: isDark ? partnerOneDark : partnerOneLight },
    { name: "Verizon", src: isDark ? partnerTwoDark : partnerTwoLight },
    { name: "Deezer", src: isDark ? partnerThreeDark : partnerThreeLight },
    { name: "YouTube Music", src: isDark ? partnerFourDark : partnerFourLight },
  ]

  return (
    <section ref={ref} className={`flex flex-wrap items-center justify-between gap-6 opacity-70 fade-in-up ${isInView ? 'visible' : ''}`}>
      {partners.map(({ name, src }, index) => (
        <div key={name} className={`flex items-center gap-3 delay-${(index + 1) * 100}`}>
          <img src={src} alt={`${name} logo`} className="h-10 w-auto opacity-70 transition-opacity duration-300" />
        </div>
      ))}
    </section>
  )
}

export default Partners
