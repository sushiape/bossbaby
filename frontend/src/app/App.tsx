import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import PageLoader from "../shared/components/PageLoader";
import { getRouteByPath, pagePath, type PageId } from "./routes";

export default function App() {
  const [loaderDone, setLoaderDone] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const route = getRouteByPath(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [route?.path]);

  useEffect(() => {
    setLoaderDone(route?.id !== "landing");
  }, [route?.id]);

  if (!route) return <Navigate to="/" replace />;

  const setCurrentPage = (page: PageId) => navigate(pagePath(page));
  const RouteComponent = route.component;

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {!loaderDone && route.id === "landing" && (
          <PageLoader key="loader" onComplete={() => setLoaderDone(true)} />
        )}
      </AnimatePresence>
      <Suspense fallback={<div className="min-h-screen bg-[#FFD2E9]" />}>
        <RouteComponent currentPage={route.id} setCurrentPage={setCurrentPage} />
      </Suspense>
    </div>
  );
}
