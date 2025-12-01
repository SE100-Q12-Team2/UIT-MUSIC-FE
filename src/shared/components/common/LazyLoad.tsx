import LoadingSpinner from "@/shared/components/common/LoadingSpinner";
import { Suspense } from "react";

const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export default LazyLoad;