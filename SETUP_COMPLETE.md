# ✅ React Query Configuration - Complete

## 📦 Cài đặt hoàn tất

React Query đã được cấu hình thành công với:

-   ✅ `@tanstack/react-query@latest`
-   ✅ `@tanstack/react-query-devtools@latest`
-   ✅ `axios@latest`

## 🏗️ Cấu trúc Project

```
src/
├── config/
│   ├── env.config.ts          # Environment variables
│   ├── api.config.ts          # Axios client với interceptors
│   └── query.config.ts        # React Query client & query keys
│
├── core/
│   └── services/
│       ├── auth.service.ts    # Auth API & hooks
│       ├── song.service.ts    # Song API & hooks
│       ├── examples.ts        # Code examples
│       └── example-components.tsx  # React components examples
│
├── app/
│   └── providers.tsx          # React Query Provider setup
│
└── main.tsx                   # App entry point

.env                           # Environment variables
.env.example                   # Template for .env
REACT_QUERY_GUIDE.md          # Detailed documentation
```

## 🚀 Quick Start

### 1. Base URL đã được cấu hình

```
https://uit-music-production.up.railway.app/
```

### 2. Sử dụng trong Component

#### Fetch Data (GET)

```tsx
import { useSongs } from '@/core/services/song.service';

function MyComponent() {
  const { data, isLoading, error } = useSongs({ page: 1 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.songs.map(song => ...)}</div>;
}
```

#### Create Data (POST)

```tsx
import { useCreateSong } from '@/core/services/song.service';

function CreateForm() {
  const { mutate, isPending } = useCreateSong();

  const handleSubmit = (data) => {
    mutate(data, {
      onSuccess: () => alert('Created!'),
      onError: (err) => alert(err.message)
    });
  };

  return <button onClick={() => handleSubmit({...})}>
    {isPending ? 'Creating...' : 'Create'}
  </button>;
}
```

#### Custom API Call

```tsx
import api from "@/config/api.config";

// Direct API call
const data = await api.get("/api/endpoint");
const result = await api.post("/api/endpoint", { data });
```

## 🔑 Features

### Axios Client

-   ✅ Auto add Bearer token từ localStorage
-   ✅ Auto redirect to /login nếu 401
-   ✅ Request/Response logging (dev mode)
-   ✅ Error handling
-   ✅ 30s timeout

### React Query

-   ✅ Auto refetch on mount
-   ✅ 5 min stale time
-   ✅ 10 min cache time
-   ✅ Retry failed requests (1 time)
-   ✅ DevTools enabled (dev mode)

### Environment

-   ✅ VITE_API_BASE_URL - Base URL
-   ✅ VITE_API_TIMEOUT - Request timeout
-   ✅ Auto validation

## 📝 Tạo Service Mới

```typescript
// src/core/services/YOUR_SERVICE.service.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import api from "@/config/api.config";

// 1. Define types
export interface YourType {
    id: string;
    name: string;
}

// 2. Create service
export const yourService = {
    getAll: async (): Promise<YourType[]> => {
        return api.get<YourType[]>("/api/your-endpoint");
    },

    create: async (data: Partial<YourType>): Promise<YourType> => {
        return api.post<YourType>("/api/your-endpoint", data);
    },
};

// 3. Create hooks
export const useYourData = () => {
    return useQuery({
        queryKey: ["your-data"],
        queryFn: () => yourService.getAll(),
    });
};

export const useCreateYourData = () => {
    return useMutation({
        mutationFn: (data: Partial<YourType>) => yourService.create(data),
    });
};
```

## 🛠️ Các File Quan Trọng

### `.env`

```bash
VITE_API_BASE_URL=https://uit-music-production.up.railway.app/
VITE_API_TIMEOUT=30000
```

### `src/config/api.config.ts`

-   Axios instance
-   Request/Response interceptors
-   Token management
-   Error handling

### `src/config/query.config.ts`

-   QueryClient configuration
-   Query keys constants
-   Default options

### `src/app/providers.tsx`

-   QueryClientProvider
-   ReactQueryDevtools

## 📚 Examples

Xem chi tiết tại:

-   `src/core/services/examples.ts` - Code examples
-   `src/core/services/example-components.tsx` - React components
-   `REACT_QUERY_GUIDE.md` - Hướng dẫn chi tiết

## 🎯 Services Đã Tạo

### Auth Service

-   `useLogin()` - Login user
-   `useRegister()` - Register user
-   `useLogout()` - Logout user
-   `useProfile()` - Get user profile
-   `useUpdateProfile()` - Update profile
-   `useChangePassword()` - Change password
-   `useForgotPassword()` - Forgot password
-   `useResetPassword()` - Reset password

### Song Service

-   `useSongs(filters)` - Get songs list
-   `useSong(id)` - Get song detail
-   `useSearchSongs(query)` - Search songs
-   `useCreateSong()` - Create song
-   `useUpdateSong()` - Update song
-   `useDeleteSong()` - Delete song

## 🔍 React Query DevTools

Tự động hiển thị ở góc dưới màn hình trong development mode.

Để mở: Click vào icon React Query logo

Features:

-   View all queries/mutations
-   Check cache data
-   Trigger manual refetch
-   Debug query states

## ⚠️ Lưu Ý

1. **Token**: Được tự động thêm từ `localStorage.getItem('auth_token')`
2. **401 Error**: Auto logout và redirect to `/login`
3. **Environment**: Đảm bảo `.env` file tồn tại (đã có sẵn)
4. **DevTools**: Chỉ hiển thị trong development mode

## 🚨 Troubleshooting

### API call thất bại?

1. Kiểm tra `.env` file
2. Kiểm tra network tab trong browser
3. Kiểm tra React Query DevTools
4. Xem console logs (dev mode)

### 401 Unauthorized?

1. Kiểm tra token trong localStorage
2. Verify token còn hạn
3. Login lại

### CORS error?

Backend cần enable CORS cho domain của bạn.

## 📞 Support

Xem thêm:

-   [React Query Docs](https://tanstack.com/query/latest)
-   [Axios Docs](https://axios-http.com/)
-   `REACT_QUERY_GUIDE.md` - Detailed guide

---

**Status**: ✅ Ready to use
**Last Updated**: December 4, 2025
