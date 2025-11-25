import "@/styles/landing.css"

import PageContainer from "@/components/layouts/PageContainer"
import MaxWidth from "@/components/layouts/MaxWidth"

import Header from "@/components/ui/landing/header"
import Hero from "@/components/ui/landing/hero"
import HeroImage from "@/components/ui/landing/heroImage"
import Partners from "@/components/ui/landing/partner"
import { Ticker } from "@/components/ui/landing/ticker"
import FamousArtists from "@/components/ui/landing/artistTitle"
import CallToAction from "@/components/ui/landing/callToAction"
import ArtistsList from "@/components/ui/landing/artistList"
import GenreTicker from "@/components/ui/landing/genreTicker"
import Testimonial from "@/components/ui/landing/testimonial"
import DownloadApp from "@/components/ui/landing/downloadApp"
import Footer from "@/components/ui/landing/footer"

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
