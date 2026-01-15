export type AdminTab = 'users' | 'labels' | 'reports' | 'analytics' | 'subscriptions' | 'advertisement' | 'songs' | 'albums' | 'genres';

export interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  tabs?: { id: AdminTab; label: string }[];
}
