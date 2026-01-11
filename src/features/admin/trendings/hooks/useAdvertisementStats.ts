import { useMemo, useCallback } from 'react';
import { RevenueStatsResponse, DailyStatsResponse, AdvertisementsResponse } from '@/core/api/admin.api';

export interface StatData {
  id: number;
  iconType: 'campaign' | 'impression' | 'click' | 'revenue';
  title: string;
  value: string;
  change: number;
  iconColor: string;
}

export const useAdvertisementStats = (
  revenueStats: RevenueStatsResponse | null,
  dailyStats: DailyStatsResponse | null,
  advertisements: AdvertisementsResponse | null
) => {
  const formatNumber = useCallback((num?: number | null): string => {
    if (num === null || num === undefined || Number.isNaN(num)) {
      return '0';
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  }, []);

  const formatCurrency = useCallback((amount?: number | null): string => {
    if (!amount) return '$0';
    return `$${formatNumber(amount)}`;
  }, [formatNumber]);

  const calculateTotalImpressions = useCallback((): number => {
    if (!dailyStats?.data) return 0;
    return dailyStats.data.reduce((sum, day) => sum + (day.adImpressions || 0), 0);
  }, [dailyStats]);

  const calculateClickRate = useCallback((): string => {
    const impressions = calculateTotalImpressions();
    if (impressions === 0) return '0%';
    const clickRate = 3.8;
    return `${clickRate.toFixed(1)}%`;
  }, [calculateTotalImpressions]);

  const stats = useMemo((): StatData[] => {
    if (!revenueStats || !dailyStats) return [];

    return [
      {
        id: 1,
        iconType: 'campaign' as const,
        title: 'Active Campaigns',
        value: (advertisements?.pagination?.total || 0).toString(),
        change: 25.0,
        iconColor: '#8B5CF6',
      },
      {
        id: 2,
        iconType: 'impression' as const,
        title: 'Total Impressions',
        value: formatNumber(calculateTotalImpressions()),
        change: 18.5,
        iconColor: '#3B82F6',
      },
      {
        id: 3,
        iconType: 'click' as const,
        title: 'Click Rate',
        value: calculateClickRate(),
        change: 5.2,
        iconColor: '#10B981',
      },
      {
        id: 4,
        iconType: 'revenue' as const,
        title: 'Ad Revenue',
        value: formatCurrency(revenueStats.summary.totalRevenueAds),
        change: 12.3,
        iconColor: '#10B981',
      },
    ];
  }, [revenueStats, dailyStats, advertisements, formatNumber, calculateTotalImpressions, calculateClickRate, formatCurrency]);

  const campaigns = useMemo(() => {
    if (!advertisements?.data) return [];

    return advertisements.data.map((ad) => {
      const impressions = ad._count.impressions || 0;
      const clicks = Math.floor(impressions * 0.04);
      const status = ad.isActive ? 'Active' : 'Paused';
      
      return {
        id: ad.id,
        name: ad.adName,
        impressions: `${formatNumber(impressions)} impressions`,
        clicks: `${formatNumber(clicks)} clicks`,
        status,
        statusClass: status === 'Active' ? 'campaign-status--active' : 'campaign-status--paused',
        originalAd: ad,
      };
    });
  }, [advertisements, formatNumber]);

  return { stats, campaigns, formatNumber, formatCurrency };
};
