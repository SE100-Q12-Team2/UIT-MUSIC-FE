import { ArrowRight } from "lucide-react"

import artist1 from "@/assets/artist-1.jpg"
import artist2 from "@/assets/artist-2.jpg"
import artist3 from "@/assets/artist-3.jpg"
import artist4 from "@/assets/artist-4.jpg"
import artist5 from "@/assets/artist-5.jpg"
import artist6 from "@/assets/artist-6.jpg"
import artist7 from "@/assets/artist-7.jpg"
import artist8 from "@/assets/artist-8.jpg"
import { Button } from "@/shared/components/ui/button"

const row1Images = [
    { src: artist1, alt: "Artist 1" },
    { src: artist2, alt: "Artist 2" },
    { src: artist3, alt: "Artist 3" },
    { src: artist4, alt: "Artist 4" },
]

const row2Images = [
    { src: artist5, alt: "Artist 5" },
    { src: artist6, alt: "Artist 6" },
    { src: artist7, alt: "Artist 7" },
    { src: artist8, alt: "Artist 8" },
]

const ArtistsList = () => {
    return (
        <section className="py-16">
            <div className="relative space-y-4 sm:space-y-5">
                {/* Row 1 - scrolls left */}
                <div className="overflow-hidden">
                    <div className="artist-row-left flex gap-4 sm:gap-5">
                        {/* Original set */}
                        {row1Images.map((artist, index) => (
                            <div key={`a-${index}`} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.9375rem)] overflow-hidden">
                                <img
                                    src={artist.src}
                                    alt={artist.alt}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {row1Images.map((artist, index) => (
                            <div key={`b-${index}`} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.9375rem)] overflow-hidden">
                                <img
                                    src={artist.src}
                                    alt={artist.alt}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2 - scrolls right */}
                <div className="overflow-hidden">
                    <div className="artist-row-right flex gap-4 sm:gap-5">
                        {/* Original set */}
                        {row2Images.map((artist, index) => (
                            <div key={`c-${index}`} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.9375rem)] overflow-hidden">
                                <img
                                    src={artist.src}
                                    alt={artist.alt}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                        {/* Duplicate set for seamless loop */}
                        {row2Images.map((artist, index) => (
                            <div key={`d-${index}`} className="flex-shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.9375rem)] overflow-hidden">
                                <img
                                    src={artist.src}
                                    alt={artist.alt}
                                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="flex justify-center pt-4">
                        <Button
                            variant="default"
                            size="default"
                            style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
                        >
                            Explore Artist
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                </div>
            </div>
        </section>
    )
}
export default ArtistsList