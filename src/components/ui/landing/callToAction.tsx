import { Button } from "@/components/ui/landing/button"
import { useInView } from "@/hooks/useInView"

import artist7 from "@/assets/star-special1.svg"
import artist8 from "@/assets/star-special2.svg"

const CallToAction = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 lg:py-24">
      <div className="relative">
        {/* Label */}
        <p className={`text-sm font-semibold uppercase tracking-widest mb-4 transition-colors duration-300 fade-in-up ${isInView ? 'visible' : ''}`}
          style={{ color: 'var(--color-accent)' }}>
          CALLING ALL CREATORS
        </p>

        {/* Main Heading */}
        <div className="relative">
          <h2 className={`text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl max-w-2xl transition-colors duration-300 fade-in-left ${isInView ? 'visible' : ''}`}
            style={{ color: 'var(--color-text-primary)' }}>
            Get on Up Souly to connect
            <br />
            with fans, share your sounds,
            <br />
            and grow your audience. What
            <br />
            are you waiting for?
          </h2>

          <div className={`absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block fade-in-right ${isInView ? 'visible' : ''}`}>
            <div className="relative">
              <div className="absolute -bottom-16 right-0 h-40 w-40 overflow-hidden rounded-lg -rotate-[20deg]">
                <img
                  src={artist7}
                  alt="Featured artist"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={`mt-8 flex items-end justify-between fade-in-up delay-200 ${isInView ? 'visible' : ''}`}>
          <Button
            variant="default"
            size="default"
            style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
          >
            Find out more
          </Button>
          <div className="hidden sm:block mr-16">
            <div className="h-30 w-25 overflow-hidden rounded-lg -rotate-6">
              <img
                src={artist8}
                alt="Featured artist"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
