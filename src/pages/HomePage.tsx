import { Button } from "@/components/ui/landing/button";

export const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
            <div className="text-center space-y-6 px-4">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    🎵 UIT Music
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
                    Chào mừng đến với nền tảng nghe nhạc trực tuyến
                </p>

                <div className="flex gap-4 justify-center flex-wrap mt-8">
                    <Button size="lg">
                        Khám phá ngay
                    </Button>
                    <Button variant="outline" size="lg">
                        Tìm hiểu thêm
                    </Button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
                        <div className="text-4xl mb-3">🎧</div>
                        <h3 className="text-xl font-semibold mb-2">
                            Nghe không giới hạn
                        </h3>
                        <p className="text-gray-300">
                            Hàng triệu bài hát chất lượng cao
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
                        <div className="text-4xl mb-3">📱</div>
                        <h3 className="text-xl font-semibold mb-2">
                            Mọi nơi, mọi lúc
                        </h3>
                        <p className="text-gray-300">
                            Nghe nhạc trên mọi thiết bị
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all">
                        <div className="text-4xl mb-3">🎵</div>
                        <h3 className="text-xl font-semibold mb-2">
                            Playlist cá nhân
                        </h3>
                        <p className="text-gray-300">
                            Tạo playlist theo sở thích
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
