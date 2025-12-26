import { AdminUser, AdminLabel, CopyrightReport } from '@/core/api/admin.api';

// Mock data for admin users
export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 1,
    email: 'nguyen.van.a@gmail.com',
    fullName: 'Nguyễn Văn A',
    accountStatus: 'Active',
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
    labelName: 'Abc',
    status: 'Active',
    albumCount: 18,
    songCount: 98,
    createdAt: '2023-01-15T00:00:00Z',
  },
  {
    id: 2,
    labelName: 'XYZ Records',
    status: 'Active',
    albumCount: 25,
    songCount: 150,
    createdAt: '2023-02-20T00:00:00Z',
  },
  {
    id: 3,
    labelName: 'Music Studio',
    status: 'Active',
    albumCount: 12,
    songCount: 67,
    createdAt: '2023-03-10T00:00:00Z',
  },
  {
    id: 4,
    labelName: 'Sound Label',
    status: 'Inactive',
    albumCount: 8,
    songCount: 45,
    createdAt: '2023-01-05T00:00:00Z',
  },
  {
    id: 5,
    labelName: 'Beat Records',
    status: 'Active',
    albumCount: 30,
    songCount: 200,
    createdAt: '2023-04-12T00:00:00Z',
  },
  {
    id: 6,
    labelName: 'Melody Label',
    status: 'Active',
    albumCount: 15,
    songCount: 89,
    createdAt: '2023-05-18T00:00:00Z',
  },
  {
    id: 7,
    labelName: 'Harmony Music',
    status: 'Active',
    albumCount: 22,
    songCount: 120,
    createdAt: '2023-06-25T00:00:00Z',
  },
  {
    id: 8,
    labelName: 'Rhythm Records',
    status: 'Suspended',
    albumCount: 10,
    songCount: 55,
    createdAt: '2023-07-30T00:00:00Z',
  },
  {
    id: 9,
    labelName: 'Tune Label',
    status: 'Active',
    albumCount: 19,
    songCount: 105,
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

