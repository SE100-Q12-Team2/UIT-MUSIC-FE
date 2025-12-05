# React Query Configuration Guide

## 📦 Đã được cấu hình

### 1. **Packages đã cài đặt**

-   `@tanstack/react-query` - Core library
-   `@tanstack/react-query-devtools` - Development tools
-   `axios` - HTTP client

### 2. **Files đã tạo**

#### Config Files:

-   `src/config/env.config.ts` - Environment variables
-   `src/config/api.config.ts` - Axios client với interceptors
-   `src/config/query.config.ts` - React Query client và query keys

#### Service Files:

-   `src/core/services/auth.service.ts` - Auth API và hooks
-   `src/core/services/song.service.ts` - Song API và hooks
-   `src/core/services/examples.ts` - Ví dụ sử dụng

#### Environment Files:

-   `.env` - Environment variables
-   `.env.example` - Template cho environment variables

---

## 🚀 Cách sử dụng

### 1. **Cấu hình đã có**

Base URL API: `https://uit-music-production.up.railway.app/`

React Query Provider đã được thêm vào `src/app/providers.tsx`:

```tsx
<QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

---

### 2. **Fetch dữ liệu (GET)**

```tsx
import { useSongs } from "@/core/services/song.service";

function SongsPage() {
    const { data, isLoading, error, refetch } = useSongs({
        genre: "pop",
        page: 1,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <button onClick={() => refetch()}>Refresh</button>
            {data?.songs.map((song) => (
                <div key={song.id}>{song.title}</div>
            ))}
        </div>
    );
}
```

---

### 3. **Mutations (POST, PUT, DELETE)**

```tsx
import { useCreateSong } from "@/core/services/song.service";

function CreateSongForm() {
    const { mutate, isPending, isError, error } = useCreateSong();

    const handleSubmit = (data) => {
        mutate(data, {
            onSuccess: (newSong) => {
                console.log("Created:", newSong);
            },
            onError: (err) => {
                console.error("Failed:", err);
            },
        });
    };

    return (
        <button onClick={() => handleSubmit({ title: "New Song" })}>
            {isPending ? "Creating..." : "Create"}
        </button>
    );
}
```

---

### 4. **Custom API Call**

```tsx
import api from "@/config/api.config";

// Trong component hoặc service
const fetchCustomData = async () => {
    try {
        const data = await api.get("/api/custom-endpoint");
        return data;
    } catch (error) {
        console.error(error);
    }
};

// Hoặc với React Query
import { useQuery } from "@tanstack/react-query";

function useCustomData() {
    return useQuery({
        queryKey: ["custom-data"],
        queryFn: () => api.get("/api/custom-endpoint"),
    });
}
```

---

## 🔑 Query Keys

Query keys đã được định nghĩa trong `src/config/query.config.ts`:

```typescript
QUERY_KEYS.songs.all; // ['songs']
QUERY_KEYS.songs.list(filters); // ['songs', 'list', filters]
QUERY_KEYS.songs.detail(id); // ['songs', 'detail', id]
QUERY_KEYS.auth.profile; // ['auth', 'profile']
// etc...
```

---

## 🛠️ API Client Features

### Tự động thêm Authorization Header:

```typescript
// Token được tự động thêm vào mọi request
const token = localStorage.getItem("auth_token");
config.headers.Authorization = `Bearer ${token}`;
```

### Error Handling:

-   **401**: Tự động logout và redirect về `/login`
-   **403**: Log lỗi forbidden
-   **Network errors**: Log lỗi kết nối

### Logging (Development mode only):

-   Request logs: Method, URL, data, params
-   Response logs: Status, data
-   Error logs: URL, status, message

---

## 📝 Tạo Service mới

```typescript
// src/core/services/album.service.ts
import { useQuery, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/config/query.config";
import api from "@/config/api.config";

export interface Album {
    id: string;
    title: string;
    artist: string;
}

export const albumService = {
    getAlbums: async (): Promise<Album[]> => {
        return api.get<Album[]>("/api/albums");
    },

    getAlbum: async (id: string): Promise<Album> => {
        return api.get<Album>(`/api/albums/${id}`);
    },
};

export const useAlbums = () => {
    return useQuery({
        queryKey: QUERY_KEYS.albums.all,
        queryFn: () => albumService.getAlbums(),
    });
};

export const useAlbum = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.albums.detail(id),
        queryFn: () => albumService.getAlbum(id),
        enabled: !!id,
    });
};
```

---

## 🎯 Best Practices

1. **Luôn sử dụng Query Keys constants**
2. **Invalidate cache sau mutations**
3. **Handle loading và error states**
4. **Use optimistic updates khi cần**
5. **Enable/disable queries dựa trên điều kiện**
6. **Sử dụng React Query DevTools để debug**

---

## 🔍 React Query DevTools

DevTools tự động hiển thị trong development mode. Nhấn vào icon ở góc màn hình để mở.

Features:

-   Xem tất cả queries và mutations
-   Kiểm tra cache data
-   Trigger refetch
-   Xem query states

---

## 📚 Tài liệu tham khảo

-   [React Query Docs](https://tanstack.com/query/latest)
-   [Axios Docs](https://axios-http.com/docs/intro)
-   Examples: `src/core/services/examples.ts`
