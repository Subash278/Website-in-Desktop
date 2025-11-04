import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";

// small generic skeleton used as per-route fallback
const Skeleton: React.FC = () => (
  <div className="p-6">
    <div className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  </div>
);

// dynamic loaders (separate functions for easy prefetching)
const loadLogin = () => import("./pages/Login");
const Login = lazy(loadLogin);

const loadDashboard = () => import("./pages/Dashboard");
const Dashboard = lazy(loadDashboard);

const loadDashboardHome = () => import("./pages/DashboardHome");
const DashboardHome = lazy(loadDashboardHome);

const loadDatabaseCanvas = () => import("./pages/DatabaseCanvas");
const DatabaseCanvas = lazy(loadDatabaseCanvas);

const loadMapperCanvas = () => import("./pages/MapperCanvas");
const MapperCanvas = lazy(loadMapperCanvas);

const loadFavorites = () => import("./pages/Favorites");
const Favorites = lazy(loadFavorites);

const loadSettings = () => import("./pages/Settings");
const Settings = lazy(loadSettings);

const loadNotFound = () => import("./pages/NotFound");
const NotFound = lazy(loadNotFound);

const loadControlsCatalog = () => import("./pages/ControlsCatalog");
const ControlsCatalog = lazy(loadControlsCatalog);

const loadThreats = () => import("./pages/ThreatsAndTechniques");
const ThreatsAndTechniques = lazy(loadThreats);

const loadVulnerabilities = () => import("./pages/Vulnerabilities");
const Vulnerabilities = lazy(loadVulnerabilities);

const loadAssets = () => import("./pages/AssetInventory");
const AssetInventory = lazy(loadAssets);

const loadControlMapper = () => import("./pages/ControlMapper");
const ControlMapper = lazy(loadControlMapper);

const loadCompliance = () => import("./pages/ComplianceDashboard");
const ComplianceDashboard = lazy(loadCompliance);

const queryClient = new QueryClient();

const App: React.FC = () => {
  // helper to prefetch a route chunk (call this on hover)
  const prefetch = (loader: () => Promise<any>) => {
    // call loader to initiate module download; React.lazy will reuse it
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loader();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Routes>
              <Route
                path="/login"
                element={
                  <Suspense fallback={<Skeleton />}>
                    <Login />
                  </Suspense>
                }
              />
              <Route
                path="/"
                element={
                  <Suspense fallback={<Skeleton />}>
                    <Dashboard />
                  </Suspense>
                }
              >
                <Route
                  index
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <DashboardHome />
                    </Suspense>
                  }
                />
                <Route
                  path="canvas/db"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <DatabaseCanvas />
                    </Suspense>
                  }
                />
                <Route
                  path="canvas/mapper"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <MapperCanvas />
                    </Suspense>
                  }
                />
                <Route
                  path="favorites"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <Favorites />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <Settings />
                    </Suspense>
                  }
                />
                <Route
                  path="controls"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <ControlsCatalog />
                    </Suspense>
                  }
                />
                <Route
                  path="threats"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <ThreatsAndTechniques />
                    </Suspense>
                  }
                />
                <Route
                  path="vulnerabilities"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <Vulnerabilities />
                    </Suspense>
                  }
                />
                <Route
                  path="assets"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <AssetInventory />
                    </Suspense>
                  }
                />
                <Route
                  path="control-mapper"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <ControlMapper />
                    </Suspense>
                  }
                />
                <Route
                  path="compliance"
                  element={
                    <Suspense fallback={<Skeleton />}>
                      <ComplianceDashboard />
                    </Suspense>
                  }
                />
              </Route>
              <Route
                path="*"
                element={
                  <Suspense fallback={<Skeleton />}>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export { prefetch }; // exported so pages/components can call prefetch(loader) on hover
export default App;
