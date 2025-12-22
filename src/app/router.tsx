import App from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import SignInPage from "@/features/auth/pages/SignInPage";
import NotFoundPage from "@/features/error/pages/NotFoundPage";
import LazyLoad from "@/shared/components/common/LazyLoad";
import MainLayout from "@/shared/layouts/MainLayout";
import AppLayout from "@/shared/layouts/AppLayout";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { PremiumSubscriptionsPage } from "@/features/subscription/pages/PremiumSubscriptionsPage";
import Home from "@/features/home/pages/HomePage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import EnterCode from "@/features/auth/pages/EnterCode";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import PlaylistPage from "@/features/playlist/pages/PlaylistPage";
import FavoritePage from "@/features/favorite/pages/FavoritePage";
import DiscoverPage from "@/features/discover/pages/DiscoverPage";
import PlayerPage from "@/features/player/pages/PlayerPage";

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
            index: true,
            element: <LazyLoad><LandingPage /></LazyLoad>
          },
        ]
      },
      {
        element: <AppLayout />,
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
          {
            path: "player",
            element: <LazyLoad><PlayerPage /></LazyLoad>
          },
          {
            path: "playlists",
            element: <LazyLoad><PlaylistPage /></LazyLoad>
          },
          {
            path: "playlists/:id",
            element: <LazyLoad><PlaylistPage /></LazyLoad>
          },
          {
            path: "likes",
            element: <LazyLoad><FavoritePage /></LazyLoad>
          },
          {
            path: "discover",
            element: <LazyLoad><DiscoverPage /></LazyLoad>
          },
        ]
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
        path: 'forgot-password',
        element: <LazyLoad><ForgotPassword /></LazyLoad>
      },
      {
        path: 'forgot-password/enter-code',
        element: <LazyLoad><EnterCode /></LazyLoad>
      },
      {
        path: 'forgot-password/reset',
        element: <LazyLoad><ResetPassword /></LazyLoad>
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