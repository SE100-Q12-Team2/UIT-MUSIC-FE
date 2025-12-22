import { Outlet } from "react-router";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import { Toaster } from 'sonner';

const App: React.FC = () => {
  return (
    <BackgroundProvider>
      <Outlet />
      <Toaster position="top-center" richColors />
    </BackgroundProvider>
  );
};

export default App;