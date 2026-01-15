import React, { useState, useEffect } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useRecordLabels, useManagedArtists, useAddArtistToCompany, useRemoveArtistFromCompany } from '@/core/services/label.service';
import { Search, Plus, Trash2, Users, Music, Disc, X, ChevronDown, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import api from '@/config/api.config';
import type { RecordLabelsResponse } from '@/types/label.types';
import '@/styles/artist-management.css';

const ArtistManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [artistSearchQuery, setArtistSearchQuery] = useState('');
  const [selectedArtist, setSelectedArtist] = useState<{id: number; name: string; imageUrl: string | null} | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: labels = [] } = useRecordLabels(user?.id);
  const label = labels[0];

  const { data: managedArtistsResponse, isLoading, refetch } = useManagedArtists(
    label?.id,
    1,
    100,
    searchQuery
  );

  const managedArtists = managedArtistsResponse?.items || [];

  const addArtistMutation = useAddArtistToCompany();
  const removeArtistMutation = useRemoveArtistFromCompany();

  const { data: availableArtistsResponse, isLoading: isLoadingArtists } = useQuery({
    queryKey: ['available-artists', artistSearchQuery, managedArtists.length],
    queryFn: async () => {
      const response = await api.get<RecordLabelsResponse>('/record-labels', {
        params: {
          page: 1,
          limit: 50,
          search: artistSearchQuery || undefined,
        },
      });
      
      // Filter only INDIVIDUAL labels that:
      // 1. Are INDIVIDUAL type (not COMPANY)
      // 2. Have no parentLabelId (not managed by ANY company)
      // 3. Are not the current user's label
      const managedArtistIds = managedArtists.map(a => a.id);
      const currentLabelId = label?.id;
      
      return response.items.filter(artist => {
        // Must be INDIVIDUAL type
        if (artist.labelType !== 'INDIVIDUAL') return false;
        
        // Must not have a parent (not managed by any company)
        if (artist.parentLabelId !== null && artist.parentLabelId !== undefined) return false;
        
        // Must not be the current company label itself
        if (artist.id === currentLabelId) return false;
        
        // Must not be already in the managed list (redundant check for safety)
        if (managedArtistIds.includes(artist.id)) return false;
        
        return true;
      });
    },
    enabled: showAddModal && !!label,
  });

  const handleAddArtist = async () => {
    if (!label?.id || !selectedArtist) {
      toast.error('Please select an artist');
      return;
    }

    try {
      await addArtistMutation.mutateAsync({
        companyId: label.id,
        data: { artistLabelId: selectedArtist.id },
      });
      toast.success('Artist added successfully');
      setShowAddModal(false);
      setSelectedArtist(null);
      setArtistSearchQuery('');
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to add artist';
      toast.error('Failed to add artist', { description: errorMsg });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  const handleRemoveArtist = async (artistId: number) => {
    if (!label?.id) return;

    if (!confirm('Are you sure you want to remove this artist from your management?')) {
      return;
    }

    try {
      await removeArtistMutation.mutateAsync({
        companyId: label.id,
        artistId,
      });
      toast.success('Artist removed successfully');
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to remove artist';
      toast.error('Failed to remove artist', { description: errorMsg });
    }
  };

  if (!label) {
    return (
      <div className="artist-management">
        <div className="artist-management__empty-state">
          <div className="artist-management__empty-icon">
            <Users size={64} />
          </div>
          <h2>No Record Label Found</h2>
          <p>You need to create a record label first to manage artists</p>
        </div>
      </div>
    );
  }

  if (label.labelType !== 'COMPANY') {
    return (
      <div className="artist-management">
        <div className="artist-management__empty-state">
          <div className="artist-management__empty-icon">
            <Users size={64} />
          </div>
          <h2>Company Labels Only</h2>
          <p>Only company labels can manage artists</p>
          <p className="artist-management__empty-hint">
            Your label type: <span className="highlight">{label.labelType}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="artist-management">
      <div className="artist-management__header">
        <div className="artist-management__header-info">
          <h1 className="artist-management__title">
            <Users className='text-white' size={28} />
            Managed Artists
          </h1>
          <p className="artist-management__subtitle text-white">
            Manage artists under {label.labelName}
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="artist-management__add-btn"
        >
          <Plus size={20} />
          Add Artist
        </Button>
      </div>

      {/* Search */}
      <div className="artist-management__search">
        <div className="artist-management__search-wrapper">
          <Search size={20} className="artist-management__search-icon" />
          <Input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="artist-management__search-input"
          />
        </div>
      </div>

      {/* Artists List */}
      <div className="artist-management__content">
        {isLoading ? (
          <div className="artist-management__loading">
            <div className="artist-management__spinner"></div>
            <p>Loading artists...</p>
          </div>
        ) : managedArtists.length === 0 ? (
          <div className="artist-management__empty-state">
            <div className="artist-management__empty-icon">
              <Users size={64} />
            </div>
            <h2>No Artists Found</h2>
            <p className="artist-management__empty-hint">
              {searchQuery ? 'Try a different search term' : 'Add artists to start managing them'}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddModal(true)}
                className="artist-management__empty-cta"
              >
                <Plus size={20} />
                Add Your First Artist
              </Button>
            )}
          </div>
        ) : (
          <div className="artist-management__grid">
            {managedArtists.map((artist) => (
              <div key={artist.id} className="artist-card">
                <div className="artist-card__image">
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt={artist.labelName} />
                  ) : (
                    <div className="artist-card__placeholder">
                      <Users size={48} />
                    </div>
                  )}
                </div>
                <div className="artist-card__content">
                  <h3 className="artist-card__name">{artist.labelName}</h3>
                  <div className="artist-card__stats">
                    <div className="artist-card__stat">
                      <Music size={16} />
                      <span>{artist._count.songs} songs</span>
                    </div>
                    <div className="artist-card__stat">
                      <Disc size={16} />
                      <span>{artist._count.albums} albums</span>
                    </div>
                  </div>
                  {artist.user && (
                    <p className="artist-card__email">{artist.user.email}</p>
                  )}
                </div>
                <div className="artist-card__actions">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveArtist(artist.id)}
                    className="artist-card__remove-btn"
                  >
                    <Trash2 size={16} />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Artist Modal */}
      {showAddModal && (
        <div className="artist-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="artist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="artist-modal__header">
              <h2 className="artist-modal__title">Add Artist to Company</h2>
              <button 
                className="artist-modal__close"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="artist-modal__body">
              <div className="artist-modal__field">
                <label className="artist-modal__label">
                  Select Artist
                </label>
                
                {/* Search & Select Dropdown */}
                <div className="artist-select-wrapper" onClick={(e) => e.stopPropagation()}>
                  <div 
                    className="artist-select-trigger"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {selectedArtist ? (
                      <div className="artist-select-selected">
                        {selectedArtist.imageUrl ? (
                          <img src={selectedArtist.imageUrl} alt={selectedArtist.name} className="artist-select-avatar" />
                        ) : (
                          <div className="artist-select-avatar-placeholder">
                            <Users size={20} />
                          </div>
                        )}
                        <span>{selectedArtist.name}</span>
                      </div>
                    ) : (
                      <span className="artist-select-placeholder">Choose an artist...</span>
                    )}
                    <ChevronDown size={20} className={`artist-select-icon ${showDropdown ? 'rotate' : ''}`} />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="artist-select-dropdown">
                      <div className="artist-select-search">
                        <Search size={16} />
                        <input
                          type="text"
                          placeholder="Search artists..."
                          value={artistSearchQuery}
                          onChange={(e) => setArtistSearchQuery(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="artist-select-options">
                        {isLoadingArtists ? (
                          <div className="artist-select-loading">Loading...</div>
                        ) : availableArtistsResponse && availableArtistsResponse.length > 0 ? (
                          availableArtistsResponse.map((artist) => (
                            <div
                              key={artist.id}
                              className={`artist-select-option ${selectedArtist?.id === artist.id ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedArtist({
                                  id: artist.id,
                                  name: artist.labelName,
                                  imageUrl: artist.imageUrl,
                                });
                                setShowDropdown(false);
                              }}
                            >
                              {artist.imageUrl ? (
                                <img src={artist.imageUrl} alt={artist.labelName} className="artist-option-avatar" />
                              ) : (
                                <div className="artist-option-avatar-placeholder">
                                  <Users size={20} />
                                </div>
                              )}
                              <div className="artist-option-info">
                                <span className="artist-option-name">{artist.labelName}</span>
                                {artist.user && (
                                  <span className="artist-option-email">{artist.user.email}</span>
                                )}
                              </div>
                              {selectedArtist?.id === artist.id && (
                                <Check size={18} className="artist-option-check" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="artist-select-empty">
                            <Users size={32} />
                            <p>{artistSearchQuery ? 'No artists found' : 'No available artists'}</p>
                            <span>All individual artists are already managed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <p className="artist-modal__hint">
                  Select an individual artist to add to your company management
                </p>
              </div>
            </div>
            <div className="artist-modal__actions">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedArtist(null);
                  setArtistSearchQuery('');
                }}
                className="artist-modal__cancel text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddArtist} 
                disabled={!selectedArtist}
                className="artist-modal__submit"
              >
                <Plus size={18} />
                Add Artist
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistManagementPage;
