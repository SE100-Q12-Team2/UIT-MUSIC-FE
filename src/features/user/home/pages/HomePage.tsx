import { Play, Heart } from 'lucide-react';
import { ARTIST_UPDATES, ARTISTS_FOLLOW, DAILY_PICK_SONGS, GENRES, PERSONAL_SPACE, RECENTLY_PLAYED_BANNERS, TAILORED_PLAYLISTS } from '@/data/home.data';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import SongRow from '@/features/user/home/components/SongRow';
import { Input } from '@/shared/components/ui/input';
import { SectionProps } from '@/features/user/home/types/home.types';

const Section = ({ title, actionText = "See All", children }: SectionProps) => (
    <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h2>
            <Button variant="link" className="text-gray-400 hover:text-white uppercase font-medium tracking-wider text-xs h-auto p-0">
                {actionText}
            </Button>
        </div>
        {children}
    </div>
);

const Home = () => {
  return (
    <div className="w-full min-h-screen flex flex-col flex-1 pb-32 bg-linear-to-b from-vio-900 via-[#0a0a16] to-[#05050a] overflow-x-hidden overflow-y-visible">
        
        <section className="px-8 pt-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {RECENTLY_PLAYED_BANNERS.map((banner) => (
                <div key={banner.id} className="relative h-40 rounded-xl overflow-hidden group cursor-pointer">
                    <img src={banner.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt={banner.title} />
                    <div className={`absolute inset-0 bg-linear-to-b ${banner.accent} opacity-80 mix-blend-multiply`} />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                        <h3 className="text-xl font-bold text-white mb-1">{banner.title}</h3>
                        <div className="w-8 h-1 bg-white/50 rounded-full" />
                    </div>
                </div>
            ))}
        </section>

        <Section title="Playlists Tailored For You">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {TAILORED_PLAYLISTS.map((item) => <Card key={item.id} data={item} />)}
            </div>
        </Section>

        <Section title="Your Personal Music Space">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {PERSONAL_SPACE.map((item) => <Card key={item.id} data={item} />)}
            </div>
        </Section>

        <Section title="Updates From Followed Artists">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {ARTIST_UPDATES.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-[#13132b]/50 p-4 rounded-lg hover:bg-[#13132b] transition-colors group cursor-pointer border border-white/5">
                        <img src={item.coverUrl} alt={item.title} className="w-16 h-16 rounded shadow-lg" />
                        <div className="flex-1">
                            <h4 className="text-white font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                        </div>
                        <Heart className="text-muted-foreground group-hover:text-white transition-colors" size={20} />
                    </div>
                 ))}
            </div>
        </Section>

        <Section title="Daily Pick">
            <div className="bg-[#13132b]/30 rounded-xl border border-white/5 overflow-hidden">
                {DAILY_PICK_SONGS.map((song, idx) => (
                    <div key={song.id} className={idx !== DAILY_PICK_SONGS.length - 1 ? 'border-b border-white/5' : ''}>
                        <SongRow song={song} />
                    </div>
                ))}
            </div>
        </Section>

        <Section title="Artists You Follow">
            <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
                {ARTISTS_FOLLOW.map((artist) => (
                    <div key={artist.id} className="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-vio-accent transition-all relative">
                            <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Play size={24} fill="white" className="text-white" />
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white capitalize">{artist.name}</span>
                    </div>
                ))}
            </div>
        </Section>

        <div className="px-8 py-8">
            <div className="relative rounded-2xl overflow-hidden h-80 flex items-center justify-center text-center bg-gray-900 border border-white/10">
                <div className="absolute inset-0 bg-linear-to-b from-indigo-900/50 via-purple-900/50 to-indigo-900/50 z-0" />
                <div className="relative z-10 p-8 flex flex-col items-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Discover The Magic Of Series Musics With Viotune</h2>
                    <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-transform font-semibold">
                        Join Now
                    </Button>
                    
                    <div className="mt-12 flex gap-4 opacity-50 blur-[1px]">
                         {[1,2,3,4,5].map(i => (
                             <div key={i} className="w-32 h-40 bg-gray-800 rounded-lg transform translate-y-8" />
                         ))}
                    </div>
                </div>
            </div>
        </div>

        <Section title="Genres You Interested In">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {GENRES.map(genre => (
                    <div key={genre.id} className="relative h-28 rounded-lg overflow-hidden cursor-pointer group">
                        <img src={genre.coverUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={genre.title} />
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
                        <span className="absolute bottom-3 left-4 text-xl font-bold text-white">{genre.title}</span>
                    </div>
                ))}
            </div>
        </Section>
        
        {/* Footer Area - Simple Links */}
        <footer className="mt-20 px-8 py-10 border-t border-white/5 bg-[#080812]">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <div className="md:w-1/3">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Play size={16} fill="white" className="ml-0.5"/>
                        </div>
                        <span className="text-xl font-bold text-white">VioTune</span>
                    </div>
                    <div className="mb-6">
                        <h4 className="text-white font-semibold mb-2">Welcome To VioTune!</h4>
                        <p className="text-muted-foreground text-sm">At Echo Stream, We Are Passionate About Bringing Music Closer To You.</p>
                    </div>
                    <div className="flex gap-2">
                        <Input type="email" placeholder="Example@gmail.com" className="bg-white/10 border-white/5 text-white placeholder:text-gray-500" />
                        <Button className="bg-indigo-600 hover:bg-indigo-500">Subscribe</Button>
                    </div>
                </div>
                
                <div className="flex gap-12 text-sm text-gray-400">
                    <div className="flex flex-col gap-3">
                        <h5 className="text-white font-semibold">Main Links</h5>
                        <a href="#" className="hover:text-white">About Us</a>
                        <a href="#" className="hover:text-white">Contact Us</a>
                        <a href="#" className="hover:text-white">FAQ</a>
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                    </div>
                     <div className="flex flex-col gap-3">
                        <h5 className="text-white font-semibold">Categories</h5>
                        <a href="#" className="hover:text-white">Music Genre</a>
                        <a href="#" className="hover:text-white">Popular Playlists</a>
                        <a href="#" className="hover:text-white">New Albums</a>
                    </div>
                </div>
            </div>
            <div className="mt-10 text-center text-xs text-gray-600">
                &copy; 2024 VioTune Music. All rights reserved.
            </div>
        </footer>

    </div>
  );
};

export default Home;