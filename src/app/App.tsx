import { Outlet } from "react-router";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { Toaster } from "@/components/ui/sonner";

const App: React.FC = () => {
  return (
    <BackgroundProvider>
      <Outlet />
      <Toaster position="top-right" richColors />
    </BackgroundProvider>
  );
};

export default App;