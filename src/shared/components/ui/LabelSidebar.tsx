import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import homeIcon from "@/assets/home-icon.svg";
import homeClickIcon from "@/assets/home-click-icon.svg";
import playlistIcon from "@/assets/playlist-icon.svg";
import reportIcon from "@/assets/copyright-report.svg";
import reportIconClick from "@/assets/copyright-report-click.svg";
import playlistClickIcon from "@/assets/playlist-click-icon.svg";
import albumIcon from "@/assets/browser-icon.svg";
import albumIconClick from "@/assets/browser-click-icon.svg";
import { Users } from "lucide-react";
import { useAuth } from "@/shared/hooks/auth/useAuth";
import { useRecordLabels } from "@/core/services/label.service";
import "@/styles/sidebar.css";

interface NavItem {
  id: string;
  label: string;
  icon?: string;
  activeIcon?: string;
  iconComponent?: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
}

interface LabelSidebarProps {
  onExpandChange?: (expanded: boolean) => void;
}

const labelNavItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: homeIcon,
    activeIcon: homeClickIcon,
    path: "/label/home",
  },
  {
    id: "songs",
    label: "Songs",
    icon: playlistIcon,
    activeIcon: playlistClickIcon,
    path: "/label/songs",
  },
  {
    id: "albums",
    label: "Albums",
    icon: albumIcon,
    activeIcon: albumIconClick,
    path: "/label/albums",
  },
  {
    id: "artists",
    label: "Artists",
    iconComponent: Users,
    path: "/label/artists",
  },
  {
    id: "report",
    label: "Report",
    icon: reportIcon,
    activeIcon: reportIconClick,
    path: "/label/report",
  },
];

const LabelSidebar: React.FC<LabelSidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { data: labels } = useRecordLabels(user?.id);
  
  // Get current label's type (if user has a label)
  const currentLabel = labels?.[0];
  const isCompanyLabel = currentLabel?.labelType === "COMPANY";

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const handleMouseEnter = () => {
    setIsExpanded(true);
    onExpandChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
    onExpandChange?.(false);
  };

  // Filter out "Artists" menu if label is INDIVIDUAL
  const filteredNavItems = labelNavItems.filter(item => {
    if (item.id === "artists") {
      return isCompanyLabel;
    }
    return true;
  });

  return (
    <aside
      className={`sidebar ${isExpanded ? "sidebar--expanded" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <nav className="sidebar__nav">
        <ul className="sidebar__list sidebar__list--main">
          {filteredNavItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`sidebar__item ${
                  isActive(item.path) ? "sidebar__item--active" : ""
                }`}
              >
                <div className="sidebar__icon-wrapper">
                  {item.iconComponent ? (
                    <item.iconComponent 
                      size={24} 
                      className={`sidebar__icon ${
                        isActive(item.path) ? "sidebar__icon--active" : ""
                      }`}
                    />
                  ) : (
                    <img
                      src={isActive(item.path) ? item.activeIcon : item.icon}
                      alt={item.label}
                      className="sidebar__icon"
                    />
                  )}
                </div>
                {isExpanded && (
                  <span className="sidebar__label">{item.label}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default LabelSidebar;
