import LandingPage from "@/features/landing/pages/LandingPage";
import PremiumSubscriptionsPage from "@/features/subscription/pages/PremiumSubscriptionsPage";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
   
  },
  {
    path: '/premium',
    element: <PremiumSubscriptionsPage />,
  }
]);