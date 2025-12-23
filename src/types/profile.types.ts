export interface Permission {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  module: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Profile {
  id: number;
  email: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  roleId: number;
  profileImage: string;
  accountStatus: 'Active' | 'Inactive' | 'Banned';
  createdAt: string;
  updatedAt: string;
  createdById: number;
  updatedById: number;
  role: Role;
}
