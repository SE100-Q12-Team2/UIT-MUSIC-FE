import { Outlet } from "react-router";
import { BackgroundProvider } from "@/contexts/BackgroundContext";

const App: React.FC = () => {
  return (
    <BackgroundProvider>
      <Outlet />
    </BackgroundProvider>
  );
};

export default App;