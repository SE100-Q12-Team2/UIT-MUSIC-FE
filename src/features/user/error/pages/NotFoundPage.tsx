import React from 'react';
import { useNavigate } from 'react-router';
import { Home, Search, Music } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ROUTES } from '@/core/constants/routes';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-linear-to-b from-vio-900 via-[#0a0a16] to-[#05050a] flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[150px] md:text-[200px] lg:text-[250px] font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-indigo-500 leading-none">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-linear-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 -z-10"></div>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-purple-500/30 rounded-full"></div>
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Music className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 px-4">
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 max-w-2xl mx-auto px-4">
          The page you're looking for seems to have wandered off the playlist. 
          Don't worry, we'll help you get back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <Button
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full cursor-pointer sm:w-auto bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/50"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full cursor-pointer sm:w-auto border-2 border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105"
          >
            Go Back
          </Button>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-sm mb-4">Popular Pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              Home
            </button>
            <button
              onClick={() => navigate(ROUTES.SEARCH)}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              <Search className="w-4 h-4 inline mr-1" />
              Search
            </button>
            <button
              onClick={() => navigate(ROUTES.LIBRARY)}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              Library
            </button>
            <button
              onClick={() => navigate('/subscriptions')}
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/5"
            >
              Premium
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="fixed top-20 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse hidden md:block"></div>
        <div className="fixed bottom-20 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl animate-pulse hidden md:block"></div>
        <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl animate-pulse hidden lg:block"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;
