import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
import homeIcon from '@/assets/home-icon.svg';
import homeClickIcon from '@/assets/home-click-icon.svg';
import trendingIcon from '@/assets/trending-icon.svg';
import trendingClickIcon from '@/assets/trending-click-icon.svg';
import usersIcon from '@/assets/users-icon.svg';
import usersClickIcon from '@/assets/users-click-icon.svg';
import folderIcon from '@/assets/folder-icon.svg';
import folderClickIcon from '@/assets/folder-click-icon.svg';
import '@/styles/sidebar.css';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  activeIcon: string;
  path: string;
}

interface AdminSidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const adminNavItems: NavItem[] = [
  { 
    id: 'home', 
    label: 'Home', 
    icon: homeIcon, 
    activeIcon: homeClickIcon, 
    path: '/admin/home' 
  },
  { 
    id: 'trendings', 
    label: 'Trendings', 
    icon: trendingIcon, 
    activeIcon: trendingClickIcon, 
    path: '/admin/trendings' 
  },
  { 
    id: 'human', 
    label: 'Human', 
    icon: usersIcon, 
    activeIcon: usersClickIcon, 
    path: '/admin/human' 
  },
  { 
    id: 'songs', 
    label: 'Songs', 
    icon: folderIcon, 
    activeIcon: folderClickIcon, 
    path: '/admin/songs' 
  },
  { 
    id: 'transactions', 
    label: 'Transactions', 
    icon: folderIcon, 
    activeIcon: folderClickIcon, 
    path: '/admin/transactions' 
  },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    // Exact match
    if (location.pathname === path) return true;
    // For /admin/human, match /admin/human exactly or /admin/human with query/hash
    if (path === '/admin/human') {
      return location.pathname === '/admin/human' || location.pathname.startsWith('/admin/human/');
    }
    return false;
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
          {adminNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.id}>
                <Link
                  to={item.path}
                  className={`sidebar__item ${active ? 'sidebar__item--active' : ''}`}
                >
                  <div className="sidebar__icon-wrapper">
                    <img 
                      src={active ? item.activeIcon : item.icon} 
                      alt={item.label} 
                      className="sidebar__icon"
                    />
                  </div>
                  {isExpanded && <span className="sidebar__label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
