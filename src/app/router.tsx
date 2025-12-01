import App from "@/app/App";
import LazyLoad from "@/shared/components/common/LazyLoad";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const LandingPage = lazy(() => import('@/features/landing/pages/LandingPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        // element: <MainLayout />,
        children: [
          {
            index: true,
            element: <LazyLoad><LandingPage /></LazyLoad>
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
      // {
      //   path: 'login',
      //   element: <LoginPage />
      // },
      // {
      //   path: '404',
      //   element: <NotFoundPage />
      // },
      // {
      //   path: '*',
      //   element: <Navigate to="/404" replace />
      // }
    ]
  }
]);

export default router;