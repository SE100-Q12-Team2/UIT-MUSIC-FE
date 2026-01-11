import { AdminUser, AdminLabel, CopyrightReport } from '@/core/api/admin.api';

// Mock data for admin users
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    email: 'nguyen.van.a@gmail.com',
    fullName: 'Nguyễn Văn A',
    accountStatus: 'Active',
    roleId: 1,
    profileImage: null,
    role: {
      id: 1,
      name: 'Listener',
    },
    subscriptions: [
      {
        id: 1,
        plan: {
          id: 1,
          name: 'Premium',
        },
      },
    ],
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    email: 'tran.thi.b@gmail.com',
    fullName: 'Trần Thị B',
    accountStatus: 'Active',
    roleId: 1,
    profileImage: null,
    role: {
      id: 1,
      name: 'Listener',
    },
    subscriptions: [],
    createdAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 3,
    email: 'le.van.c@gmail.com',
    fullName: 'Lê Văn C',
    accountStatus: 'Active',
    roleId: 1,
    profileImage: null,
    role: {
      id: 1,
      name: 'Listener',
    },
    subscriptions: [
      {
        id: 2,
        plan: {
          id: 1,
          name: 'Premium',
        },
      },
    ],
    createdAt: '2024-03-10T00:00:00Z',
  },
  {
    id: 4,
    email: 'pham.thi.d@gmail.com',
    fullName: 'Phạm Thị D',
    accountStatus: 'Suspended',
    roleId: 1,
    profileImage: null,
    role: {
      id: 1,
      name: 'Listener',
    },
    subscriptions: [],
    createdAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 5,
    email: 'hoang.van.e@gmail.com',
    fullName: 'Hoàng Văn E',
    accountStatus: 'Active',
    roleId: 1,
    profileImage: null,
    role: {
      id: 1,
      name: 'Listener',
    },
    subscriptions: [
      {
        id: 3,
        plan: {
          id: 1,
          name: 'Premium',
        },
      },
    ],
    createdAt: '2024-04-12T00:00:00Z',
  },
];

// Mock data for admin labels
export const MOCK_ADMIN_LABELS: AdminLabel[] = [
  {
    id: 1,
    userId: 1,
    labelName: 'Abc',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 18,
      songs: 98,
    },
    user: {
      id: 1,
      email: 'label1@example.com',
      fullName: 'Label Owner 1',
    },
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    userId: 2,
    labelName: 'XYZ Records',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 25,
      songs: 150,
    },
    user: {
      id: 2,
      email: 'label2@example.com',
      fullName: 'Label Owner 2',
    },
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 3,
    userId: 3,
    labelName: 'Music Studio',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 12,
      songs: 67,
    },
    user: {
      id: 3,
      email: 'label3@example.com',
      fullName: 'Label Owner 3',
    },
    createdAt: '2023-03-10T00:00:00Z',
  },
  {
    id: 4,
    userId: 4,
    labelName: 'Sound Label',
    hasPublicProfile: false,
    status: 'Inactive',
    _count: {
      albums: 8,
      songs: 45,
    },
    user: {
      id: 4,
      email: 'label4@example.com',
      fullName: 'Label Owner 4',
    },
    createdAt: '2023-01-05T00:00:00Z',
  },
  {
    id: 5,
    userId: 5,
    labelName: 'Beat Records',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 30,
      songs: 200,
    },
    user: {
      id: 5,
      email: 'label5@example.com',
      fullName: 'Label Owner 5',
    },
    createdAt: '2023-04-12T00:00:00Z',
  },
  {
    id: 6,
    userId: 6,
    labelName: 'Melody Label',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 15,
      songs: 89,
    },
    user: {
      id: 6,
      email: 'label6@example.com',
      fullName: 'Label Owner 6',
    },
    createdAt: '2023-05-18T00:00:00Z',
  },
  {
    id: 7,
    userId: 7,
    labelName: 'Harmony Music',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 22,
      songs: 120,
    },
    user: {
      id: 7,
      email: 'label7@example.com',
      fullName: 'Label Owner 7',
    },
    createdAt: '2023-06-25T00:00:00Z',
  },
  {
    id: 8,
    userId: 8,
    labelName: 'Rhythm Records',
    hasPublicProfile: false,
    status: 'Suspended',
    _count: {
      albums: 10,
      songs: 55,
    },
    user: {
      id: 8,
      email: 'label8@example.com',
      fullName: 'Label Owner 8',
    },
    createdAt: '2023-07-30T00:00:00Z',
  },
  {
    id: 9,
    userId: 9,
    labelName: 'Tune Label',
    hasPublicProfile: true,
    status: 'Active',
    _count: {
      albums: 19,
      songs: 105,
    },
    user: {
      id: 9,
      email: 'label9@example.com',
      fullName: 'Label Owner 9',
    },
    createdAt: '2023-08-15T00:00:00Z',
  },
];

// Mock data for copyright reports
export const MOCK_COPYRIGHT_REPORTS: CopyrightReport[] = [
  {
    id: 1,
    songTitle: 'Lạc Trôi',
    reportedBy: 'M-TP Entertainment',
    reason: 'Unauthorized upload',
    status: 'Pending',
    createdAt: '2024-06-20T00:00:00Z',
  },
  {
    id: 2,
    songTitle: 'Chúng Ta Của Hiện Tại',
    reportedBy: 'Sony Music VN',
    reason: 'Copyright infringement',
    status: 'Under Review',
    createdAt: '2024-06-18T00:00:00Z',
  },
  {
    id: 3,
    songTitle: 'Em Của Ngày Hôm Qua',
    reportedBy: 'Warner Music',
    reason: 'License expired',
    status: 'Resolved',
    createdAt: '2024-06-15T00:00:00Z',
  },
  {
    id: 4,
    songTitle: 'Hãy Trao Cho Anh',
    reportedBy: 'Universal Music',
    reason: 'Duplicate content',
    status: 'Rejected',
    createdAt: '2024-06-12T00:00:00Z',
  },
];

// Calculate totals for copyright reports
export const MOCK_COPYRIGHT_TOTALS = {
  total: 47,
  pending: 12,
  resolved: 28,
  rejected: 7,
};

