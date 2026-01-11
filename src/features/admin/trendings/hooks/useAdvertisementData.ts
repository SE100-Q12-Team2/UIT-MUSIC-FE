import { useState, useEffect } from 'react';
import { adminApi, RevenueStatsResponse, DailyStatsResponse, AdvertisementsResponse } from '@/core/api/admin.api';

export const useAdvertisementData = (currentPage: number, limit: number) => {
  const [revenueStats, setRevenueStats] = useState<RevenueStatsResponse | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse | null>(null);
  const [advertisements, setAdvertisements] = useState<AdvertisementsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };

  const fetchAdvertisementData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange();
      const [revenue, daily, ads] = await Promise.all([
        adminApi.getRevenueStats(startDate, endDate),
        adminApi.getDailyStats(startDate, endDate),
        adminApi.getAdvertisements(currentPage, limit),
      ]);
      setRevenueStats(revenue);
      setDailyStats(daily);
      setAdvertisements(ads);
    } catch (err) {
      setError('Failed to load advertisement data');
      console.error('Error fetching advertisements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisementData();
  }, [currentPage]);

  return {
    revenueStats,
    dailyStats,
    advertisements,
    isLoading,
    error,
    refetch: fetchAdvertisementData,
  };
};
