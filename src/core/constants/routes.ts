// Application routes
export const ROUTES = {
    HOME: "/home",
    LOGIN: "/login",
    FORGOT_PASSWORD: "/forgot-password",
    REGISTER: "/register",
    PROFILE: "/profile",
    SEARCH: "/search",
    LIBRARY: "/library",
    PLAYLIST: "/playlist",
    PLAYLIST_DETAIL: (id: string) => `/playlist/${id}`,
    SONG_DETAIL: (id: string) => `/song/${id}`,
    ALBUM_DETAIL: (id: string) => `/album/${id}`,
    ARTIST_DETAIL: (id: string) => `/artist/${id}`,
    FAVORITES: "/favorites",
    SETTINGS: "/settings",
    SUBSCRIPTION: "/subscription",
    NOT_FOUND: "/404",
};

// Route names for breadcrumbs or navigation
export const ROUTE_NAMES: Record<string, string> = {
    [ROUTES.HOME]: "Trang chủ",
    [ROUTES.LOGIN]: "Đăng nhập",
    [ROUTES.REGISTER]: "Đăng ký",
    [ROUTES.PROFILE]: "Hồ sơ",
    [ROUTES.SEARCH]: "Tìm kiếm",
    [ROUTES.LIBRARY]: "Thư viện",
    [ROUTES.PLAYLIST]: "Playlist",
    [ROUTES.FAVORITES]: "Yêu thích",
    [ROUTES.SETTINGS]: "Cài đặt",
    [ROUTES.SUBSCRIPTION]: "Subscription",
};
