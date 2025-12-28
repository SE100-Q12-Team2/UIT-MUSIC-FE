import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "@/shared/components/ui/AppHeader";
import LabelSidebar from "@/shared/components/ui/LabelSidebar";
import Footer from "@/shared/components/ui/footer";
import backgroundSettings from "@/assets/background-settings.png";
import "@/styles/main-layout.css";

const LabelLayout: React.FC = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return (
    <div
      className="main-layout"
      style={{
        backgroundImage: `url(${backgroundSettings})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <AppHeader />
      <div className="main-layout__body">
        <LabelSidebar onExpandChange={setIsSidebarExpanded} />
        <main
          className={`main-layout__content ${
            isSidebarExpanded ? "main-layout__content--sidebar-expanded" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LabelLayout;
