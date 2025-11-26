import LandingPage from "@/features/landing/pages/LandingPage";
import { createBrowserRouter } from "react-router";


export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
   
  }
]);