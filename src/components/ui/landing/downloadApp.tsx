import { useInView } from "@/hooks/useInView"
import brandLogo from "@/assets/LOGO.svg"
import appStoreBadge from "@/assets/appstore.svg"
import googlePlayBadge from "@/assets/google.svg"

const DownloadApp = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div 
        className={`rounded-3xl py-12 px-6 sm:px-12 lg:py-16 transition-colors duration-300 fade-in-scale ${isInView ? 'visible' : ''}`}
        style={{ backgroundColor: 'var(--color-card-bg)' }}
      >
        <div className="max-w-xl mx-auto text-center">
          {/* Logo */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src={brandLogo}
              alt="VioTune logo"
              className="h-10 w-auto object-contain"
            />
            <span 
              className="text-xs mt-1 tracking-wider transition-colors duration-300"
              style={{ color: 'var(--color-card-text-muted)' }}
            >
              VioTune
            </span>
          </div>

          {/* Heading */}
          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-300"
            style={{ color: 'var(--color-card-text)' }}
          >
            Never stop listening
          </h2>

          {/* Platforms */}
          <p 
            className="text-sm sm:text-base mb-8 transition-colors duration-300"
            style={{ color: 'var(--color-card-text-muted)' }}
          >
            An available on Web, iOS, Android, Sonos, Chromecast, and Xbox One
          </p>

          {/* App Store Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="transition-transform hover:scale-105"
            >
              <img
                src={appStoreBadge}
                alt="Download on the App Store"
                className="h-11 w-auto"
              />
            </a>
            <a
              href="#"
              className="transition-transform hover:scale-105"
            >
              <img
                src={googlePlayBadge}
                alt="Get it on Google Play"
                className="h-11 w-auto"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadApp
