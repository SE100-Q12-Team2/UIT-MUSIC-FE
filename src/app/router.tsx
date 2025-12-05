import App from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignInPage from "@/features/auth/pages/SignInPage";
import NotFoundPage from "@/features/error/pages/NotFoundPage";
import LazyLoad from "@/shared/components/common/LazyLoad";
import MainLayout from "@/shared/layouts/MainLayout";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { PremiumSubscriptionsPage } from "@/features/subscription/pages/PremiumSubscriptionsPage";
import Home from "@/features/home/pages/HomePage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "home",
            element: <LazyLoad><Home /></LazyLoad>
          },
          {
            path: "subscriptions",
            element: <LazyLoad><PremiumSubscriptionsPage /></LazyLoad>
          },
          {
            path: "settings",
            element: <LazyLoad><SettingsPage /></LazyLoad>
          },
          // {
          //   path: 'music',
          //   element: <MusicPage />
          // },
          // {
          //   path: 'playlist',
          //   element: <PlaylistPage />
          // },
          // {
          //   path: 'playlist/:id',
          //   element: <PlaylistPage />
          // },
          // {
          //   path: 'artist',
          //   element: <ArtistPage />
          // },
          // {
          //   path: 'artist/:id',
          //   element: <ArtistPage />
          // },
          // {
          //   path: 'album',
          //   element: <AlbumPage />
          // },
          // {
          //   path: 'album/:id',
          //   element: <AlbumPage />
          // },
          // {
          //   path: 'search',
          //   element: <SearchPage />
          // },
          // {
          //   path: 'profile',
          //   element: <ProfilePage />
          // },
          // {
          //   path: 'settings',
          //   element: <SettingsPage />
          // }
        ]
      },
      {
          index: true,
          element: <LazyLoad><LandingPage /></LazyLoad>
      },
      {
        path: 'login',
        element: <LazyLoad><LoginPage /></LazyLoad>
      },
      {
        path: 'signup',
        element: <LazyLoad><SignInPage /></LazyLoad>
      },
      {
        path: '404',
        element: <NotFoundPage />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]
  }
]);

export default router;