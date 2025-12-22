import App from "@/app/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import GuestRoute from "@/shared/components/GuestRoute";
import NotFoundPage from "@/features/user/error/pages/NotFoundPage";
import LazyLoad from "@/shared/components/common/LazyLoad";
import MainLayout from "@/shared/layouts/MainLayout";
import LabelLayout from "@/shared/layouts/LabelLayout";
import ProtectedRoute from "@/shared/components/ProtectedRoutes";
import RoleBasedRedirect from "@/shared/components/RoleBasedRedirect";
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import Home from "@/features/user/home/pages/HomePage";
import SettingsPage from "@/features/user/settings/pages/SettingsPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import LabelHomePage from "@/features/label/home/pages/LabelHomePage";
import PremiumSubscriptionsPage from "@/features/user/subscription/pages/PremiumSubscriptionsPage";
import PlaylistsPage from "@/features/user/playlists/pages/PlaylistsPage";
import BrowserPage from "@/features/user/browser/pages/BrowserPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
import PlayerPage from "@/features/player/pages/PlayerPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import EnterCode from "@/features/auth/pages/EnterCode";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import LabelSongManagementPage from "@/features/label/songs/pages/LabelSongManagementPage";

const LandingPage = lazy(() => import('@/features/user/landing/pages/LandingPage'));

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
        element: <MainLayout />,
        children: [
          {
            path: "home",
            element: (
              <ProtectedRoute>
                <RoleBasedRedirect />
                <LazyLoad><Home /></LazyLoad>
              </ProtectedRoute>
            )
          },
          {
            path: "subscriptions",
            element: (
              <ProtectedRoute>
                <LazyLoad><PremiumSubscriptionsPage /></LazyLoad>
              </ProtectedRoute>
            )
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute>
                <LazyLoad><SettingsPage /></LazyLoad>
              </ProtectedRoute>
            )
          },
          {
            path: "playlists",
            element: (
              <ProtectedRoute>
                <LazyLoad><PlaylistsPage /></LazyLoad>
              </ProtectedRoute>
            )
          },
          {
            path: "browser",
            element: (
              <ProtectedRoute>
                <LazyLoad><BrowserPage /></LazyLoad>
              </ProtectedRoute>
            )
          },
          {
            path: "player",
            element: (
              <ProtectedRoute>
                <LazyLoad><PlayerPage /></LazyLoad>
              </ProtectedRoute>
            )
          },
        ]
      },
      {
        path: "label",
        element: (
          <ProtectedRoute>
            <LabelLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "home",
            element: <LazyLoad><LabelHomePage /></LazyLoad>
          },
          {
            path: "songs",
            element: <LazyLoad><LabelSongManagementPage /></LazyLoad>
          },
          {
            path: "albums",
            element: <div>Label Albums Page (Coming Soon)</div>
          },
          {
            path: "report",
            element: <div>Label Report Page (Coming Soon)</div>
          }
        ]
      },
      {
        path: 'login',
        element: (
          <GuestRoute>
            <LazyLoad><LoginPage /></LazyLoad>
          </GuestRoute>
        )
      },
      {
        path: 'signup',
        element: (
          <GuestRoute>
            <LazyLoad><SignUpPage /></LazyLoad>
          </GuestRoute>
        )
      },
      // Routes Forgot Password của bạn
      {
        path: 'forgot-password',
        element: (
          <GuestRoute>
            <LazyLoad><ForgotPassword /></LazyLoad>
          </GuestRoute>
        )
      },
      {
        path: 'forgot-password/enter-code',
        element: (
          <GuestRoute>
            <LazyLoad><EnterCode /></LazyLoad>
          </GuestRoute>
        )
      },
      {
        path: 'forgot-password/reset',
        element: (
          <GuestRoute>
            <LazyLoad><ResetPassword /></LazyLoad>
          </GuestRoute>
        )
      },
      {
        path: 'reset-password',
        element: (
          <ProtectedRoute>
            <LazyLoad><ResetPasswordPage /></LazyLoad>
          </ProtectedRoute>
        )
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
