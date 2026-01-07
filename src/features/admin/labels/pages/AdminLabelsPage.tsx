import React, { useState, useMemo } from 'react';
import { useAdminLabels, useUpdateLabelStatus, useDeleteLabel } from '@/core/services/admin.service';
import { Search, MoreHorizontal, Building2, Eye, Edit, Ban, Trash2 } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminLabel } from '@/core/api/admin.api';
import '@/styles/admin-labels-management.css';

const AdminLabelsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch labels
  const { data: labelsResponse, isLoading } = useAdminLabels(1, 100, searchQuery);
  
  // Mutations
  const updateLabelStatusMutation = useUpdateLabelStatus();
  const deleteLabelMutation = useDeleteLabel();

  // Filter labels
  const filteredLabels = useMemo(() => {
    const items = labelsResponse?.items || [];
    if (!searchQuery) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter((label) =>
      label.labelName.toLowerCase().includes(query)
    );
  }, [labelsResponse?.items, searchQuery]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="admin-labels-management">
      <div className="admin-labels-management__content">
        {/* Search Bar */}
        <div className="admin-labels-management__search-wrapper">
          <div className="admin-labels-management__search">
            <Search size={18} className="admin-labels-management__search-icon" />
            <Input
              type="text"
              placeholder="Q Search labels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-labels-management__search-input"
            />
          </div>
        </div>

        {/* Labels Grid */}
        {isLoading ? (
          <div className="admin-labels-management__loading">
            Loading labels...
          </div>
        ) : filteredLabels.length === 0 ? (
          <div className="admin-labels-management__empty">
            No labels found
          </div>
        ) : (
          <div className="admin-labels-management__grid">
            {filteredLabels.map((label) => (
              <div key={label.id} className="admin-labels-management__card">
                <div className="admin-labels-management__card-header">
                  <div className="admin-labels-management__card-icon">
                    <Building2 size={24} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="admin-labels-management__card-menu">
                        <MoreHorizontal size={20} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="left" className="admin-labels-management__dropdown-content">
                      <DropdownMenuItem onClick={() => {
                        // View label details - can be implemented later
                      }}>
                        <Eye size={16} />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        // Edit label - can be implemented later
                      }}>
                        <Edit size={16} />
                        Edit Label
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {label.status === 'Active' ? (
                        <DropdownMenuItem 
                          onClick={() => {
                            updateLabelStatusMutation.mutate({
                              id: label.id,
                              data: { status: 'Suspended' }
                            });
                          }}
                          variant="destructive"
                          disabled={updateLabelStatusMutation.isPending}
                        >
                          <Ban size={16} />
                          Suspend Label
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => {
                            updateLabelStatusMutation.mutate({
                              id: label.id,
                              data: { status: 'Active' }
                            });
                          }}
                          disabled={updateLabelStatusMutation.isPending}
                        >
                          <Ban size={16} />
                          Activate Label
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete label "${label.labelName}"?`)) {
                            deleteLabelMutation.mutate(label.id);
                          }
                        }}
                        variant="destructive"
                        disabled={deleteLabelMutation.isPending}
                      >
                        <Trash2 size={16} />
                        Delete Label
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="admin-labels-management__card-body">
                  <h3 className="admin-labels-management__card-name">{label.labelName}</h3>
                  <span className={`admin-labels-management__status-badge admin-labels-management__status-badge--${label.status.toLowerCase()}`}>
                    {label.status}
                  </span>
                </div>
                <div className="admin-labels-management__card-footer">
                  <div className="admin-labels-management__stat">
                    <span className="admin-labels-management__stat-value">{label.albumCount}</span>
                    <span className="admin-labels-management__stat-label">Albums</span>
                  </div>
                  <div className="admin-labels-management__stat">
                    <span className="admin-labels-management__stat-value">{label.songCount}</span>
                    <span className="admin-labels-management__stat-label">Songs</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLabelsPage;

