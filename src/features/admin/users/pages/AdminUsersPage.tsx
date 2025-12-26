import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAdminUsers, useUpdateUserStatus, useDeleteUser } from '@/core/services/admin.service';
import { Search, Filter, ArrowUpDown, ChevronDown, Check, Mail, MoreHorizontal, Eye, Edit, Ban, Trash2, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdminUser } from '@/core/api/admin.api';
import '@/styles/admin-users-management.css';

type SortOption = 'Latest' | 'Oldest' | 'A-Z' | 'Z-A';
type StatusFilter = 'All' | 'Active' | 'Suspended' | 'Inactive';
type PlanFilter = 'All' | 'Premium' | 'Free';

const AdminUsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Latest');
  const [page, setPage] = useState(1);
  const limit = 20;

  // Dropdown states
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isPlanFilterOpen, setIsPlanFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const planFilterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Fetch users
  const { data: usersResponse, isLoading, refetch } = useAdminUsers(page, limit, searchQuery);
  
  // Mutations
  const updateUserStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    const items = usersResponse?.items || [];
    let filtered = items;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((user) => user.accountStatus === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'All') {
      if (planFilter === 'Premium') {
        filtered = filtered.filter(
          (user) => user.subscriptions && user.subscriptions.length > 0
        );
      } else {
        filtered = filtered.filter(
          (user) => !user.subscriptions || user.subscriptions.length === 0
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'Latest':
        filtered = [...filtered].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'Oldest':
        filtered = [...filtered].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'A-Z':
        filtered = [...filtered].sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'Z-A':
        filtered = [...filtered].sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
    }

    return filtered;
  }, [usersResponse?.items, searchQuery, statusFilter, planFilter, sortBy]);

  // Sort options
  const sortOptions: SortOption[] = ['Latest', 'Oldest', 'A-Z', 'Z-A'];
  const statusOptions: StatusFilter[] = ['All', 'Active', 'Suspended', 'Inactive'];
  const planOptions: PlanFilter[] = ['All', 'Premium', 'Free'];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setIsStatusFilterOpen(false);
      }
      if (planFilterRef.current && !planFilterRef.current.contains(event.target as Node)) {
        setIsPlanFilterOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const paths: Record<TabType, string> = {
      users: '/admin/users',
      labels: '/admin/labels',
      reports: '/admin/reports',
    };
    navigate(paths[tab]);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPlanName = (user: AdminUser): string => {
    if (user.subscriptions && user.subscriptions.length > 0) {
      const plan = user.subscriptions[0].plan.name;
      return plan === 'Premium' ? 'O Premium' : plan;
    }
    return 'Free';
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'Active':
        return 'admin-users-management__status-badge--active';
      case 'Suspended':
        return 'admin-users-management__status-badge--suspended';
      default:
        return 'admin-users-management__status-badge--inactive';
    }
  };

  return (
    <div className="admin-users-management__content">
      {/* Search and Filter Bar */}
      <div className="admin-users-management__toolbar">
            <div className="admin-users-management__search">
              <Search size={18} className="admin-users-management__search-icon" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-users-management__search-input"
              />
            </div>
            <div className="admin-users-management__filters">
              {/* Status Filter Dropdown */}
              <div className="admin-users-management__dropdown" ref={statusFilterRef}>
                <Button
                  variant="outline"
                  className="admin-users-management__filter-btn"
                  onClick={() => {
                    setIsStatusFilterOpen(!isStatusFilterOpen);
                    setIsPlanFilterOpen(false);
                    setIsSortOpen(false);
                  }}
                >
                  <Filter size={16} />
                  Status: {statusFilter}
                  <ChevronDown size={16} className={isStatusFilterOpen ? 'admin-users-management__chevron--open' : ''} />
                </Button>
                {isStatusFilterOpen && (
                  <div className="admin-users-management__dropdown-menu">
                    {statusOptions.map((option) => (
                      <button
                        key={option}
                        className={`admin-users-management__dropdown-item ${statusFilter === option ? 'admin-users-management__dropdown-item--active' : ''}`}
                        onClick={() => {
                          setStatusFilter(option);
                          setIsStatusFilterOpen(false);
                        }}
                      >
                        {option}
                        {statusFilter === option && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Plan Filter Dropdown */}
              <div className="admin-users-management__dropdown" ref={planFilterRef}>
                <Button
                  variant="outline"
                  className="admin-users-management__filter-btn"
                  onClick={() => {
                    setIsPlanFilterOpen(!isPlanFilterOpen);
                    setIsStatusFilterOpen(false);
                    setIsSortOpen(false);
                  }}
                >
                  <Filter size={16} />
                  Plan: {planFilter}
                  <ChevronDown size={16} className={isPlanFilterOpen ? 'admin-users-management__chevron--open' : ''} />
                </Button>
                {isPlanFilterOpen && (
                  <div className="admin-users-management__dropdown-menu">
                    {planOptions.map((option) => (
                      <button
                        key={option}
                        className={`admin-users-management__dropdown-item ${planFilter === option ? 'admin-users-management__dropdown-item--active' : ''}`}
                        onClick={() => {
                          setPlanFilter(option);
                          setIsPlanFilterOpen(false);
                        }}
                      >
                        {option}
                        {planFilter === option && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="admin-users-management__dropdown" ref={sortRef}>
                <Button
                  variant="outline"
                  className="admin-users-management__sort-btn"
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsStatusFilterOpen(false);
                    setIsPlanFilterOpen(false);
                  }}
                >
                  <ArrowUpDown size={16} />
                  Sort by
                  <ChevronDown size={16} className={isSortOpen ? 'admin-users-management__chevron--open' : ''} />
                </Button>
                {isSortOpen && (
                  <div className="admin-users-management__dropdown-menu">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        className={`admin-users-management__dropdown-item ${sortBy === option ? 'admin-users-management__dropdown-item--active' : ''}`}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                      >
                        {option}
                        {sortBy === option && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
      </div>

      {/* Users Table */}
      <div className="admin-users-management__table-wrapper">
            <table className="admin-users-management__table">
              <thead>
                <tr>
                  <th>USER</th>
                  <th>EMAIL</th>
                  <th>PLAN</th>
                  <th>STATUS</th>
                  <th>JOINED</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="admin-users-management__loading">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredAndSortedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-users-management__empty">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users-management__user">
                          <div className="admin-users-management__user-avatar">
                            {user.profileImage ? (
                              <img
                                src={user.profileImage}
                                alt={user.fullName}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                              />
                            ) : (
                              getInitials(user.fullName)
                            )}
                          </div>
                          <span className="admin-users-management__user-name">{user.fullName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="admin-users-management__email">
                          <Mail size={16} className="admin-users-management__email-icon" />
                          {user.email}
                        </div>
                      </td>
                      <td>
                        {getPlanName(user) === 'Free' ? (
                          <span className="admin-users-management__plan-badge admin-users-management__plan-badge--free">
                            Free
                          </span>
                        ) : (
                          <span className="admin-users-management__plan-badge admin-users-management__plan-badge--premium">
                            <Shield size={14} className="admin-users-management__premium-icon" />
                            Premium
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`admin-users-management__status-badge ${getStatusBadgeClass(user.accountStatus)}`}>
                          {user.accountStatus}
                        </span>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="admin-users-management__actions">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="admin-users-management__action-btn"
                                title="More options"
                                aria-label="More options"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" side="left" className="admin-users-management__dropdown-content">
                              <DropdownMenuItem onClick={() => {
                                // View user details - can be implemented later
                                console.log('View user:', user.id);
                              }}>
                                <Eye size={16} />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                // Edit user - can be implemented later
                                console.log('Edit user:', user.id);
                              }}>
                                <Edit size={16} />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.accountStatus === 'Active' ? (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    updateUserStatusMutation.mutate({
                                      id: user.id,
                                      data: { accountStatus: 'Suspended' }
                                    });
                                  }}
                                  variant="destructive"
                                  disabled={updateUserStatusMutation.isPending}
                                >
                                  <Ban size={16} />
                                  Suspend Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  onClick={() => {
                                    updateUserStatusMutation.mutate({
                                      id: user.id,
                                      data: { accountStatus: 'Active' }
                                    });
                                  }}
                                  disabled={updateUserStatusMutation.isPending}
                                >
                                  <Ban size={16} />
                                  Activate Account
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
                                    deleteUserMutation.mutate(user.id);
                                  }
                                }}
                                variant="destructive"
                                disabled={deleteUserMutation.isPending}
                              >
                                <Trash2 size={16} />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;

