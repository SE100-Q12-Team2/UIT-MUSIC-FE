import React, { useState } from 'react';
import { Link } from 'react-router';
import logoWithName from '@/assets/logo-name-under.svg';
import searchIcon from '@/assets/search.svg';
import notificationIcon from '@/assets/notification.svg';
import settingsIcon from '@/assets/settings.svg';
import profileImg from '@/assets/artist-1.jpg';
import '@/styles/app-header.css';

const AppHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/" className="app-header__logo">
          <img src={logoWithName} alt="VioTune" className="app-header__logo-img" />
        </Link>
        <div className="app-header__search">
          <img src={searchIcon} alt="Search" className="app-header__search-icon" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="app-header__search-input"
          />
        </div>
      </div>

      <div className="app-header__right">
        <button className="app-header__icon-btn" aria-label="Notifications">
          <img src={notificationIcon} alt="Notifications" />
        </button>
        <Link to="/settings" className="app-header__icon-btn" aria-label="Settings">
          <img src={settingsIcon} alt="Settings" />
        </Link>
        <Link to="/profile" className="app-header__profile">
          <img src={profileImg} alt="Profile" className="app-header__profile-img" />
        </Link>
      </div>
    </header>
  );
};

export default AppHeader;
