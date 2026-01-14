import React, { useState } from 'react';
import { useAuth } from '@/shared/hooks/auth/useAuth';
import { useRecordLabels, useManagedArtists, useAddArtistToCompany, useRemoveArtistFromCompany } from '@/core/services/label.service';
import { Search, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';
import '@/styles/artist-management.css';

const ArtistManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [artistIdToAdd, setArtistIdToAdd] = useState('');

  const { data: labels = [] } = useRecordLabels(user?.id);
  const label = labels[0];

  const { data: managedArtistsResponse, isLoading, refetch } = useManagedArtists(
    label?.id,
    1,
    100,
    searchQuery
  );

  const addArtistMutation = useAddArtistToCompany();
  const removeArtistMutation = useRemoveArtistFromCompany();

  const handleAddArtist = async () => {
    if (!label?.id || !artistIdToAdd) {
      toast.error('Please enter artist ID');
      return;
    }

    try {
      await addArtistMutation.mutateAsync({
        companyId: label.id,
        data: { artistLabelId: Number(artistIdToAdd) },
      });
      toast.success('Artist added successfully');
      setShowAddModal(false);
      setArtistIdToAdd('');
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMsg = errorObj?.message || errorObj?.response?.data?.message || 'Failed to add artist';
      toast.error('Failed to add artist', { description: errorMsg });
    }
  };

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
        <div className="artist-management__empty">
          <p>You need to create a record label first</p>
        </div>
      </div>
    );
  }

  if (label.labelType !== 'COMPANY') {
    return (
      <div className="artist-management">
        <div className="artist-management__empty">
          <p>Only company labels can manage artists</p>
          <p className="artist-management__empty-hint">
            Your label type is: {label.labelType}
          </p>
        </div>
      </div>
    );
  }

  const managedArtists = managedArtistsResponse?.items || [];

  return (
    <div className="artist-management">
      <div className="artist-management__header">
        <div className="artist-management__header-info">
          <h1 className="artist-management__title">
            <Users size={28} />
            Managed Artists
          </h1>
          <p className="artist-management__subtitle">
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
          <div className="artist-management__loading">Loading artists...</div>
        ) : managedArtists.length === 0 ? (
          <div className="artist-management__empty">
            <Users size={48} />
            <p>No artists found</p>
            <p className="artist-management__empty-hint">
              {searchQuery ? 'Try a different search term' : 'Add artists to start managing them'}
            </p>
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
                      <Users size={40} />
                    </div>
                  )}
                </div>
                <div className="artist-card__info">
                  <h3 className="artist-card__name">{artist.labelName}</h3>
                  <p className="artist-card__stats">
                    {artist._count.songs} songs • {artist._count.albums} albums
                  </p>
                  {artist.user && (
                    <p className="artist-card__email">{artist.user.email}</p>
                  )}
                </div>
                <div className="artist-card__actions">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveArtist(artist.id)}
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
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add Artist to Company</h2>
            <div className="modal-body">
              <div className="modal-field">
                <label htmlFor="artistId">Artist Label ID</label>
                <Input
                  id="artistId"
                  type="number"
                  placeholder="Enter artist label ID"
                  value={artistIdToAdd}
                  onChange={(e) => setArtistIdToAdd(e.target.value)}
                />
                <p className="modal-hint">
                  Enter the label ID of the individual artist you want to manage
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddArtist} disabled={!artistIdToAdd}>
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
