'use client';

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Settings, LogOut } from 'lucide-react';

import logoWithName from '@/assets/logo-name-under.svg';
import searchIcon from '@/assets/search.svg';
import notificationIcon from '@/assets/notification.svg';
import settingsIcon from '@/assets/settings.svg';
import '@/styles/app-header.css';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useProfile } from '@/core/services/profile.service';
import { toast } from 'sonner';
import { ROUTES } from '@/core/constants/routes';

const AppHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: profile, isLoading: isLoadingProfile } = useProfile();

  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const displayName = profile?.fullName || 'User';
  const displayEmail = profile?.email || '';
  const avatarUrl = profile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=728AAB&color=fff&size=200`;
  
  const handleLogout = async() => {
    await logout();
    toast.success('Logged out successfully');
    navigate(ROUTES.HOME)
  };

  return (
    <header className="app-header">
      {/* LEFT */}
      <div className="app-header__left">
        <Link to="/" className="app-header__logo">
          <img
            src={logoWithName}
            alt="VioTune"
            className="app-header__logo-img"
          />
        </Link>

        <div className="app-header__search">
          <img
            src={searchIcon}
            alt="Search"
            className="app-header__search-icon"
          />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="app-header__search-input"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="app-header__right">
        {/* <button className="app-header__icon-btn">
          <img src={notificationIcon} alt="Notifications" />
        </button>

        <Link to="/settings" className="app-header__icon-btn">
          <img src={settingsIcon} alt="Settings" />
        </Link> */}

        {/* PROFILE DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="app-header__profile-btn">
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10 hover:ring-white/30 transition"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="
              w-56
              rounded-xl
              border border-white/10
              bg-[#121826]
              p-1
              text-white
              shadow-xl
              backdrop-blur
            "
          >
            {/* USER INFO */}
            <div className="px-3 py-2">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs text-white/60 truncate">
                {displayEmail}
              </p>
            </div>

            <DropdownMenuSeparator className="bg-white/10 my-1" />

            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10"
              >
                <User className="h-4 w-4 opacity-80" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                to="/settings/profile"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-white/10"
              >
                <Settings className="h-4 w-4 opacity-80" />
                Account settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-white/10 my-1" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="
                flex items-center gap-3 rounded-md px-3 py-2 text-sm
                text-red-400 hover:bg-red-500/10 hover:text-red-300
                focus:bg-red-500/10
              "
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
