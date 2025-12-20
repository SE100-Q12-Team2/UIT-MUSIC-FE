import { useTheme } from "@/contexts/ThemeContext"
import Left from "@/assets/left.svg"
import Right from "@/assets/right.svg"
import verizonLogoLight from "@/assets/icon2-light.svg"
import verizonLogoDark from "@/assets/icon2-dark.svg"
import { useInView } from "@/shared/hooks/useInView"

const Testimonial = () => {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { ref, isInView } = useInView({ threshold: 0.2 })

  const testimonials = [
    {
      logo: isDark ? verizonLogoDark : verizonLogoLight,
      logoAlt: "Verizon",
      text: "The ability to switch outputs on the fly, so you can flip in midstream from the smart speaker in your office to your living room's big sound or from your desktop app to your phone without missing a beat. The service also lets you upload personal content, although the procedure for doing so is cumbersome.",
    },
  ]

  return (
    <section ref={ref} className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
          <img src={Left} alt="decorative wave" />
      </div>

      {/* Decorative wave - Right */}
      <div className="absolute right-0 top-0 translate-x-1/4">
        <img src={Right} alt="decorative wave" />
      </div>

      <div className={`max-w-3xl mx-auto text-center px-6 fade-in-up ${isInView ? 'visible' : ''}`}>
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={testimonials[0].logo}
            alt={testimonials[0].logoAlt}
            className="h-8 w-auto opacity-90 transition-opacity duration-300"
          />
        </div>

        {/* Testimonial Text */}
        <p className="text-base sm:text-lg leading-relaxed transition-colors duration-300"
          style={{ color: 'var(--color-text-muted)' }}>
          {testimonials[0].text}
        </p>

      </div>
    </section>
  )
}

export default Testimonial
