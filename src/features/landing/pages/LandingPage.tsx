import ArtistsList from "@/features/landing/components/artistList"
import FamousArtists from "@/features/landing/components/artistTitle"
import CallToAction from "@/features/landing/components/callToAction"
import DownloadApp from "@/features/landing/components/downloadApp"
import Footer from "@/features/landing/components/footer"
import GenreTicker from "@/features/landing/components/genreTicker"
import Header from "@/features/landing/components/header"
import Hero from "@/features/landing/components/hero"
import HeroImage from "@/features/landing/components/heroImage"
import Partners from "@/features/landing/components/partner"
import Testimonial from "@/features/landing/components/testimonial"
import { Ticker } from "@/features/landing/components/ticker"
import MaxWidth from "@/shared/layouts/MaxWidth"
import PageContainer from "@/shared/layouts/PageContainer"
import "@/styles/landing.css"

interface SectionProps {
  children: React.ReactNode
  fullWidth?: boolean
  className?: string
}

const Section = ({ children, fullWidth = false, className = "" }: SectionProps) => (
  <section className="w-full">
    <PageContainer>
      {fullWidth ? (
        <div className={className}>{children}</div>
      ) : (
        <MaxWidth>
          <div className={className}>{children}</div>
        </MaxWidth>
      )}
    </PageContainer>
  </section>
)

const LandingPage = () => {
  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden transition-colors duration-300" 
      style={{ 
        backgroundColor: 'var(--color-bg-primary)', 
        color: 'var(--color-text-primary)' 
      }}
    >
      <header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300" 
        style={{ backgroundColor: 'rgba(var(--color-bg-primary), 0.9)' }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <MaxWidth>
            <Header />
          </MaxWidth>
        </div>
      </header>

      {/* Responsive spacer for fixed header */}
      <div className="h-16 sm:h-20 md:h-24" aria-hidden="true" />

      <main>
        <Section>
          <Hero />
        </Section>

        <Section>
          <HeroImage />
        </Section>

        <Section>
          <Partners />
        </Section>

        <Section fullWidth>
          <Ticker />
        </Section>

        <Section>
          <FamousArtists />
        </Section>

        <Section fullWidth>
          <ArtistsList />
        </Section>

        <Section>
          <CallToAction />
        </Section>

        <Section fullWidth>
          <GenreTicker />
        </Section>

        <Section fullWidth>
          <Testimonial />
        </Section>

        <Section>
          <DownloadApp />
        </Section>
      </main>

      <footer>
        <Section>
          <Footer />
        </Section>
      </footer>
    </div>
  )
}

export default LandingPage
