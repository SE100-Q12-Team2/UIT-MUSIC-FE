export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

// Enums and types
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  BANNED = 'BANNED'
}

// Placeholder interfaces for related entities
export interface Device {
  id: number;
  // Add other device fields
}

export interface UserSubscription {
  id: number;
  // Add other subscription fields
}

export interface Transaction {
  id: number;
  // Add other transaction fields
}

export interface RecordLabel {
  id: number;
  // Add other record label fields
}

export interface Playlist {
  id: number;
  // Add other playlist fields
}

export interface ListeningHistory {
  id: number;
  // Add other listening history fields
}

export interface UserPreference {
  id: number;
  // Add other preference fields
}

export interface UserSongRating {
  id: number;
  // Add other rating fields
}

export interface Notification {
  id: number;
  // Add other notification fields
}

export interface CopyrightReport {
  id: number;
  // Add other copyright report fields
}

export interface AdImpression {
  id: number;
  // Add other ad impression fields
}

export interface Role {
  id: number;
  name: string;
  // Add other role fields
}

export interface RefreshToken {
  id: number;
  // Add other refresh token fields
}

export interface ResetPasswordToken {
  id: number;
  // Add other reset password token fields
}

export interface Permission {
  id: number;
  // Add other permission fields
}

export interface Favorite {
  id: number;
  // Add other favorite fields
}

export interface Follow {
  id: number;
  // Add other follow fields
}

export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: Date | null;
  gender: Gender | null;
  accountStatus: AccountStatus;
  isDeleted: boolean;
  profileImage: string | null;

  // Relations
  devices?: Device[];
  subscriptions?: UserSubscription[];
  transactions?: Transaction[];
  recordLabel?: RecordLabel | null;
  playlists?: Playlist[];
  listeningHistory?: ListeningHistory[];
  preferences?: UserPreference | null;
  songRatings?: UserSongRating[];
  notifications?: Notification[];
  copyrightReports?: CopyrightReport[];
  adImpressions?: AdImpression[];

  roleId: number;
  role?: Role;

  refreshTokens?: RefreshToken[];
  resetPasswordTokens?: ResetPasswordToken[];

  createdPermissions?: Permission[];
  updatedPermissions?: Permission[];
  deletedPermissions?: Permission[];

  createdRoles?: Role[];
  updatedRoles?: Role[];
  deletedRoles?: Role[];

  createdById: number | null;
  createdBy?: User | null;
  createdUsers?: User[];

  updatedById: number | null;
  updatedBy?: User | null;
  updatedUsers?: User[];

  deletedById: number | null;
  deletedBy?: User | null;
  deletedUsers?: User[];

  favorites?: Favorite[];
  follows?: Follow[];

  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
