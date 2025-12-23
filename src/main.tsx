import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { BackgroundProvider } from "@/contexts/BackgroundContext";

import { RouterProvider } from "react-router";
import router from "@/app/router";
import { AppProviders } from "@/app/providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BackgroundProvider>
        <AppProviders>
          <RouterProvider router={router} />
        </AppProviders>
      </BackgroundProvider>
    </ThemeProvider>
  </StrictMode>
);
