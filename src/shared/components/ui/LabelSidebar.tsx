import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import homeIcon from '@/assets/home-icon.svg';
import homeClickIcon from '@/assets/home-click-icon.svg';
import playlistIcon from '@/assets/playlist-icon.svg';
import reportIcon from '@/assets/copyright-report.svg';
import reportIconClick from '@/assets/copyright-report-click.svg';
import playlistClickIcon from '@/assets/playlist-click-icon.svg';
import albumIcon from '@/assets/browser-icon.svg'
import albumIconClick from '@/assets/browser-click-icon.svg';
import '@/styles/sidebar.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

interface LabelSidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const labelNavItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: homeIcon, activeIcon: homeClickIcon, path: '/label/home' },
  { id: 'songs', label: 'Songs', icon: playlistIcon, activeIcon: playlistClickIcon, path: '/label/songs' },
  { id: 'albums', label: 'Albums', icon: albumIcon, activeIcon: albumIconClick, path: '/label/albums' },
  { id: 'report', label: 'Report', icon: reportIcon, activeIcon: reportIconClick, path: '/label/report' },
];

const LabelSidebar: React.FC<LabelSidebarProps> = ({ onExpandChange }) => {
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
          {labelNavItems.map((item) => (
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

export default LabelSidebar;
