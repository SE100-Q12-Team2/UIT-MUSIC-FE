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
import { PremiumSubscriptionsPage } from "@/features/user/subscription/pages/PremiumSubscriptionsPage";
import Home from "@/features/user/home/pages/HomePage";
import SettingsPage from "@/features/user/settings/pages/SettingsPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import { PlaylistsPage } from "@/features/user/playlists/pages";
import { BrowserPage } from "@/features/user/browser/pages";
import LabelHomePage from "@/features/label/home/pages/LabelHomePage";

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
              <LazyLoad><PlaylistsPage /></LazyLoad>
            )
          },
          {
            path: "browser",
            element: (
              <LazyLoad><BrowserPage /></LazyLoad>
            )
          }
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
            element: <div>Label Songs Page (Coming Soon)</div>
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
          index: true,
          element: <LazyLoad><LandingPage /></LazyLoad>
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