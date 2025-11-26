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

const LandingPage = () => {
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--color-bg-primary)', color: 'var(--color-text-primary)' }}>

      {/* HEADER */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-colors duration-300" style={{ backgroundColor: 'rgba(var(--color-bg-primary), 0.9)' }}>
        <PageContainer>
          <MaxWidth>
            <Header />
          </MaxWidth>
        </PageContainer>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-24" />

        {/* HERO */}
      <PageContainer>
        <MaxWidth>
          <Hero />
        </MaxWidth>
      </PageContainer>

        {/* HERO IMAGE */}
      <PageContainer>
        <MaxWidth>
          <HeroImage />
        </MaxWidth>
      </PageContainer>

      {/* PARTNERS */}
      <PageContainer>
        <MaxWidth>
          <Partners />
        </MaxWidth>
      </PageContainer>

      {/* TICKER */}
      <PageContainer>
        <Ticker />
      </PageContainer>

      {/* FAMOUS ARTISTS */}
      <PageContainer>
        <MaxWidth>
          <FamousArtists />
        </MaxWidth>
      </PageContainer>

        <PageContainer>
            <ArtistsList/>
        </PageContainer>
      {/* CALL TO ACTION */}
      <PageContainer>
        <MaxWidth>
          <CallToAction />
        </MaxWidth>
      </PageContainer>

    <PageContainer>
        <GenreTicker/>
    </PageContainer>

      {/* TESTIMONIAL */}
      <PageContainer>
          <Testimonial />
      </PageContainer>

      {/* DOWNLOAD APP */}
      <PageContainer>
        <MaxWidth>
          <DownloadApp />
        </MaxWidth>
      </PageContainer>

      {/* FOOTER */}
      <PageContainer>
        <MaxWidth>
          <Footer />
        </MaxWidth>
      </PageContainer>
    </div>
  )
}

export default LandingPage
