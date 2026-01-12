// src/app/router.tsx
import React, { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/app/App";

// wrappers
import ProtectedRoute from "@/shared/components/ProtectedRoutes";
import GuestRoute from "@/shared/components/GuestRoute";
import LazyLoad from "@/shared/components/common/LazyLoad";

// layouts
import MainLayout from "@/shared/layouts/MainLayout";
import LabelLayout from "@/shared/layouts/LabelLayout";
import AdminLayout from "@/shared/layouts/AdminLayout";

// pages (auth)
import LoginPage from "@/features/auth/pages/LoginPage";
import SignUpPage from "@/features/auth/pages/SignUpPage";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import EnterCode from "@/features/auth/pages/EnterCode";
import ResetPassword from "@/features/auth/pages/ResetPassword";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";
// pages (main)
import SettingsPage from "@/features/settings/pages/SettingsPage";
import UserPlaylistsPage from "@/features/user/playlists/pages/UserPlaylistsPage";
import FavoritePage from "@/features/user/favorite/pages/FavoritePage";
import BrowserPage from "@/features/user/browser/pages/BrowserPage";
import PlayerPage from "@/features/player/pages/PlayerPage";

// label pages
import LabelHomePage from "@/features/label/home/pages/LabelHomePage";
import LabelSongManagementPage from "@/features/label/songs/pages/LabelSongManagementPage";
import LabelAlbumManagementPage from "@/features/label/albums/pages/LabelAlbumManagementPage";
import CreateAlbumPage from "@/features/label/albums/pages/CreateAlbumPage";

// admin pages
import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminHomePage from "@/features/admin/home/pages/AdminHomePage";
import AdminTransactionsPage from "@/features/admin/transactions/pages/AdminTransactionsPage";
import AdminPaymentMethodsPage from "@/features/admin/payment-methods/pages/AdminPaymentMethodsPage";

// user pages
import SongDetailPage from "@/features/user/songs/pages/SongDetailPage";
import PlaylistPage from "@/features/playlist/pages/PlaylistPage";
import { AlbumPage, AllAlbumsPage } from "@/features/user/album/pages";
import SeeAllPage from "@/features/user/home/pages/SeeAllPage";
import { ArtistDetailPage } from "@/features/user/artist/pages";

// others
import NotFoundPage from "@/features/user/error/pages/NotFoundPage";
import RoleBasedRedirect from "@/shared/components/RoleBasedRedirect";
import PremiumSubscriptionsPage from "@/features/user/subscription/pages/PremiumSubscriptionsPage";
import { CopyrightReportPage } from "@/features/label/cp-report/pages";
import AnalyticsScreen from "@/features/admin/trendings/AnalyticsScreen";
import ResourceScreen from "@/features/admin/songs-resource/pages/ResourceScreen";
import Home from "@/features/user/home/pages/HomePage";

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
                  <UserPlaylistsPage />
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
          {
            path: "songs/:id",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <SongDetailPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "playlist/:id",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <PlaylistPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "album/:id",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <AlbumPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "see-all/:section",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <SeeAllPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "albums/all",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <AllAlbumsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "artist/:id",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <ArtistDetailPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "genre/:id",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <BrowserPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "recently-played",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <UserPlaylistsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "liked-songs",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <FavoritePage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
          {
            path: "most-listened",
            element: (
              <ProtectedRoute>
                <LazyLoad>
                  <UserPlaylistsPage />
                </LazyLoad>
              </ProtectedRoute>
            ),
          },
        ],
      },

      // Label area
      {
        path: "label",
        element: <LabelLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/label/home" replace />,
          },
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
            element: (
              <LazyLoad>
                <LabelAlbumManagementPage />
              </LazyLoad>
            ),
          },
          {
            path: "albums/create",
            element: (
              <LazyLoad>
                <CreateAlbumPage />
              </LazyLoad>
            ),
          },
          {
            path: "report",
            element: <LazyLoad><CopyrightReportPage/></LazyLoad>,
          },
        ],
      },

      // Admin area - Protected route requiring Admin role
      {
        path: "admin",
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/admin/home" replace />,
          },
          {
            path: "home",
            element: (
              <LazyLoad>
                <AdminHomePage />
              </LazyLoad>
            ),
          },
          {
            path: "trendings",
            element: (
              <LazyLoad>
                <AnalyticsScreen/>
              </LazyLoad>
            ),
          },
          {
            path: "human",
            element: (
              <LazyLoad>
                <AdminDashboardPage />
              </LazyLoad>
            ),
          },
          {
            path: "songs",
            element: (
              <LazyLoad>
                <ResourceScreen/>
              </LazyLoad>
            ),
          },
          {
            path: "transactions",
            element: (
              <LazyLoad>
                <AdminTransactionsPage />
              </LazyLoad>
            ),
          },
          {
            path: "payment-methods",
            element: (
              <LazyLoad>
                <AdminPaymentMethodsPage />
              </LazyLoad>
            ),
          },
        ],
      },
      {
        path: "dev",
        element: <LabelLayout />,
        children: [
          { path: "label/albums", element: <LabelAlbumManagementPage /> },
          { path: "label/albums/create", element: <CreateAlbumPage /> },
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
