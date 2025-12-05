import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import homeIcon from '@/assets/home-icon.svg';
import homeClickIcon from '@/assets/home-click-icon.svg';
import heartIcon from '@/assets/heart-icon.svg';
import heartClickIcon from '@/assets/fav-click-icon.svg';
import playlistIcon from '@/assets/playlist-icon.svg';
import playlistClickIcon from '@/assets/playlist-click-icon.svg';
import browserIcon from '@/assets/browser-icon.svg';
import browserClickIcon from '@/assets/browser-click-icon.svg';
import subscriptionIcon from '@/assets/subscription-icon.svg';
import subscriptionClickIcon from '@/assets/subscription-click-icon.svg';
import qaIcon from '@/assets/qa-icon.svg';
import qaClickIcon from '@/assets/qa-click-icon.svg';
import '@/styles/sidebar.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

interface SidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const mainNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: homeIcon, activeIcon: homeClickIcon, path: '/home' },
  { id: 'favorite', label: 'Favorite', icon: heartIcon, activeIcon: heartClickIcon, path: '/favorite' },
  { id: 'playlists', label: 'Playlists', icon: playlistIcon, activeIcon: playlistClickIcon, path: '/playlists' },
  { id: 'browser', label: 'Browser', icon: browserIcon, activeIcon: browserClickIcon, path: '/browser' },
];

const bottomNavItems: NavItem[] = [
  { id: 'premium', label: 'Premium', icon: subscriptionIcon, activeIcon: subscriptionClickIcon, path: '/subscriptions' },
  { id: 'qa', label: 'Q&A', icon: qaIcon, activeIcon: qaClickIcon, path: '/settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  return (
    <aside 
      className={`sidebar ${isExpanded ? 'sidebar--expanded' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="sidebar__nav">
        <ul className="sidebar__list sidebar__list--main">
          {mainNavItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`sidebar__item ${isActive(item.path) ? 'sidebar__item--active' : ''}`}
              >
                <div className="sidebar__icon-wrapper">
                  <img 
                    src={isActive(item.path) ? item.activeIcon : item.icon} 
                    alt={item.label} 
                    className="sidebar__icon"
                  />
                </div>
                {isExpanded && <span className="sidebar__label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="sidebar__list sidebar__list--bottom">
          {bottomNavItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`sidebar__item ${isActive(item.path) ? 'sidebar__item--active' : ''}`}
              >
                <div className="sidebar__icon-wrapper">
                  <img 
                    src={isActive(item.path) ? item.activeIcon : item.icon} 
                    alt={item.label} 
                    className="sidebar__icon"
                  />
                </div>
                {isExpanded && <span className="sidebar__label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
