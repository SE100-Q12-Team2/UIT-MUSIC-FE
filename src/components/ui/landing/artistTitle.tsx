import { useInView } from "@/hooks/useInView"
import { useCountUp } from "@/hooks/useCountUp"

const stats = [
  { value: 550300, suffix: "e", label: "People register this website" },
  { value: 50000, suffix: "", label: "Virtual concept held this year" },
]

const formatNumber = (num: number) => {
  return num.toLocaleString('en-US')
}

const StatNumber = ({ value, suffix, isAccent, isInView }: { value: number; suffix: string; isAccent: boolean; isInView: boolean }) => {
  const count = useCountUp({ end: value, duration: 2500, enabled: isInView })
  
  return (
    <span style={{ color: isAccent ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
      {formatNumber(count)}{suffix}
    </span>
  )
}

const FamousArtists = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 })

  return (
    <section className="py-16" ref={ref}>
      <div className="grid gap-8 lg:grid-cols-2 mb-10">
        <div className={`space-y-4 fade-in-left ${isInView ? 'visible' : ''}`}>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl transition-colors duration-300"
            style={{ color: 'var(--color-text-primary)' }}>
            Some of The Most{" "}
            <br />
            Famous <span style={{ color: 'var(--color-accent)' }}>Artists</span> Of All{" "}
            <br />
            Time in the world
          </h2>
          <p className="max-w-md text-sm leading-relaxed transition-colors duration-300"
            style={{ color: 'var(--color-text-muted)' }}>
            World music is an easy way for people to describe the melding
            traditional and nontraditional music from foreign countries. Generally,
            world music refers to sounds from the non-Western part of the world.
          </p>
        </div>

        <div className={`flex flex-col justify-center space-y-6 lg:items-end fade-in-right ${isInView ? 'visible' : ''}`}>
          {/* Wrapper căn trái nội dung */}
          <div className="flex flex-col items-start space-y-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-left">
                <p className="text-4xl font-bold sm:text-5xl transition-colors duration-300">
                  <StatNumber 
                    value={stat.value} 
                    suffix={stat.suffix}
                    isAccent={index === 0}
                    isInView={isInView}
                  />
                </p>
                <p className="text-sm transition-colors duration-300"
                  style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  )
}

export default FamousArtists
