import { useState } from 'react';
import { adminApi, CreateAdvertisementRequest, UpdateAdvertisementRequest } from '@/core/api/admin.api';

export interface AdvertisementFormData {
  id: number;
  adName: string;
  adType: 'Audio' | 'Video' | 'Banner';
  filePath: string;
  duration: number;
  ageMin: number;
  ageMax: number;
  gender: 'Male' | 'Female' | 'Other' | 'All';
  subscriptionType: 'Free' | 'Premium' | 'All';
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export const useAdvertisementModal = (onSuccess: () => void, onNotification: (type: 'success' | 'error', message: string) => void) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingAd, setEditingAd] = useState<AdvertisementFormData | null>(null);

  const openEditModal = (ad: any) => {
    setEditingAd({
      id: ad.id,
      adName: ad.adName,
      adType: ad.adType,
      filePath: ad.filePath || '',
      duration: ad.duration || 0,
      ageMin: ad.targetAudience?.ageRange?.min || 13,
      ageMax: ad.targetAudience?.ageRange?.max || 100,
      gender: ad.targetAudience?.gender || 'All',
      subscriptionType: ad.targetAudience?.subscriptionType || 'All',
      startDate: ad.startDate?.split('T')[0] || '',
      endDate: ad.endDate?.split('T')[0] || '',
      isActive: ad.isActive,
    });
    setIsEditModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingAd({
      id: 0,
      adName: '',
      adType: 'Banner',
      filePath: '',
      duration: 0,
      ageMin: 13,
      ageMax: 100,
      gender: 'All',
      subscriptionType: 'All',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setIsCreateModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAd(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setEditingAd(null);
  };

  const handleSaveEdit = async () => {
    if (!editingAd) return;

    if (!editingAd.adName || !editingAd.startDate || !editingAd.endDate) {
      onNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateAdvertisementRequest = {
        adName: editingAd.adName,
        adType: editingAd.adType,
        filePath: editingAd.filePath || undefined,
        duration: editingAd.duration || undefined,
        targetAudience: {
          ageRange: {
            min: editingAd.ageMin,
            max: editingAd.ageMax,
          },
          gender: editingAd.gender,
          subscriptionType: editingAd.subscriptionType,
        },
        startDate: editingAd.startDate,
        endDate: editingAd.endDate,
        isActive: editingAd.isActive,
      };

      await adminApi.updateAdvertisement(editingAd.id, updateData);
      onNotification('success', 'Advertisement updated successfully!');
      closeEditModal();
      onSuccess();
    } catch (error: any) {
      onNotification('error', error.response?.data?.message || 'Failed to update advertisement');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCreate = async () => {
    if (!editingAd) return;

    if (!editingAd.adName || !editingAd.startDate || !editingAd.endDate) {
      onNotification('error', 'Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const createData: CreateAdvertisementRequest = {
        adName: editingAd.adName,
        adType: editingAd.adType,
        filePath: editingAd.filePath || undefined,
        duration: editingAd.duration || undefined,
        targetAudience: {
          ageRange: {
            min: editingAd.ageMin,
            max: editingAd.ageMax,
          },
          gender: editingAd.gender,
          subscriptionType: editingAd.subscriptionType,
        },
        startDate: editingAd.startDate,
        endDate: editingAd.endDate,
        isActive: editingAd.isActive,
      };

      await adminApi.createAdvertisement(createData);
      onNotification('success', 'Advertisement created successfully!');
      closeCreateModal();
      onSuccess();
    } catch (error: any) {
      onNotification('error', error.response?.data?.message || 'Failed to create advertisement');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditModalOpen,
    isCreateModalOpen,
    isSaving,
    editingAd,
    setEditingAd,
    openEditModal,
    openCreateModal,
    closeEditModal,
    closeCreateModal,
    handleSaveEdit,
    handleSaveCreate,
  };
};
