import { AdminTab } from "@/features/admin/types";

export const analyticsTabs: { id: AdminTab; label: string }[] = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'advertisement', label: 'Advertisement' },
];

export const resourceTabs: { id: AdminTab; label: string }[] = [
  { id: 'songs', label: 'Songs' },
  { id: 'albums', label: 'Albums' },
  { id: 'genres', label: 'Genres' },
];
