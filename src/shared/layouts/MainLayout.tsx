import React, { useState } from "react";
import { Outlet } from "react-router";
import AppHeader from "@/shared/components/ui/AppHeader";
import Sidebar from "@/shared/components/ui/Sidebar";
import Footer from "@/shared/components/ui/footer";
import MusicPlayer from "@/shared/components/MusicPlayer";
import { useBackground } from "@/contexts/BackgroundContext";
import "@/styles/main-layout.css";

const MainLayout: React.FC = () => {
  const { backgroundImage } = useBackground();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div
      className="main-layout"
      style={
        backgroundImage
          ? {
              background: `url(${backgroundImage}) center / cover no-repeat fixed`,
            }
          : undefined
      }
    >
      <AppHeader />
      <div className="main-layout__body">
        <Sidebar onExpandChange={setIsSidebarExpanded} />
        <main
          className={`main-layout__content ${
            isSidebarExpanded ? "main-layout__content--sidebar-expanded" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
      <MusicPlayer />
    </div>
  );
};

export default MainLayout;
