import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout } from "./components/layout/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Doubts from "./pages/Doubts";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <Index />
                </Layout>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <Dashboard />
                </Layout>
              }
            />
            <Route
              path="/search"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <Search />
                </Layout>
              }
            />
            <Route
              path="/groups"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <Groups />
                </Layout>
              }
            />
            <Route
              path="/groups/:id"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <GroupDetail />
                </Layout>
              }
            />
            <Route
              path="/doubts"
              element={
                <Layout
                  isDark={isDark}
                  onThemeToggle={() => setIsDark(!isDark)}
                >
                  <Doubts />
                </Layout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<AppContent />);
