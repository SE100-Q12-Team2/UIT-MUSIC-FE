// src/app/router.tsx
import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import App from "@/app/App";

// wrappers
import ProtectedRoute from "@/shared/components/ProtectedRoutes";
import GuestRoute from "@/shared/components/GuestRoute";
import LazyLoad from "@/shared/components/common/LazyLoad";

// layouts
import MainLayout from "@/shared/layouts/MainLayout";
import LabelLayout from "@/shared/layouts/LabelLayout";

// pages (auth)
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import EnterCode from "@/features/auth/pages/EnterCode";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
// pages (main)
import Home from "@/features/home/pages/HomePage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import PlaylistsPage from "@/features/user/playlists/pages/PlaylistsPage";
import FavoritePage from "@/features/user/playlists/pages/FavoritePage";
import BrowserPage from "@/features/user/browser/pages/BrowserPage";
import PlayerPage from "@/features/player/pages/PlayerPage";

// label pages
import LabelHomePage from "@/features/label/home/pages/LabelHomePage";
import LabelSongManagementPage from "@/features/label/songs/pages/LabelSongManagementPage";

// others
import NotFoundPage from "@/features/user/error/pages/NotFoundPage";
import RoleBasedRedirect from "@/shared/components/RoleBasedRedirect";
import PremiumSubscriptionsPage from "@/features/user/subscription/pages/PremiumSubscriptionsPage";
import { CopyrightReportPage } from "@/features/label/cp-report/pages";

const LandingPage = lazy(
  () => import("@/features/user/landing/pages/LandingPage")
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Landing page - no MainLayout
      {
        index: true,
        element: (
          <LazyLoad>
            <LandingPage />
          </LazyLoad>
        ),
      },

      // Main pages - with MainLayout
      {
        element: <MainLayout />,
        children: [
          {
            path: "home",
            element: (
              <ProtectedRoute>
                <RoleBasedRedirect />
                <LazyLoad>
                  <Home />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "subscriptions",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <PremiumSubscriptionsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <SettingsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "playlists",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <PlaylistsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "favorite",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <FavoritePage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "browser",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <BrowserPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "player",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <PlayerPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Label area
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
            element: (
              <LazyLoad>
                <LabelHomePage />
              </LazyLoad>
            ),
          },
          {
            path: "songs",
            element: (
              <LazyLoad>
                <LabelSongManagementPage />
              </LazyLoad>
            ),
          },
          {
            path: "albums",
            element: <div>Label Albums Page (Coming Soon)</div>,
          },
          {
            path: "report",
            element: <LazyLoad><CopyrightReportPage/></LazyLoad>,
          },
        ],
      },

      // Auth (guest only)
      {
        path: "login",
        element: (
          <GuestRoute>
            <LazyLoad>
              <LoginPage />
            </LazyLoad>
          </GuestRoute>
        ),
      },
      {
        path: "signup",
        element: (
          <GuestRoute>
            <LazyLoad>
              <SignUpPage />
            </LazyLoad>
          </GuestRoute>
        ),
      },

      // Forgot password flow (guest)
      {
        path: "forgot-password",
        element: (
          <GuestRoute>
            <LazyLoad>
              <ForgotPassword />
            </LazyLoad>
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password/enter-code",
        element: (
          <GuestRoute>
            <LazyLoad>
              <EnterCode />
            </LazyLoad>
          </GuestRoute>
        ),
      },
      {
        path: "forgot-password/reset",
        element: (
          <GuestRoute>
            <LazyLoad>
              <ResetPassword />
            </LazyLoad>
          </GuestRoute>
        ),
      },

      // Reset password (protected)
      {
        path: "reset-password",
        element: (
          <ProtectedRoute>
            <LazyLoad>
              <ResetPasswordPage />
            </LazyLoad>
          </ProtectedRoute>
        ),
      },

      // 404
      {
        path: "404",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);

export default router;
