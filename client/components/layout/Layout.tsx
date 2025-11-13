import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  isDark: boolean;
  onThemeToggle: () => void;
}

export function Layout({ children, isDark, onThemeToggle }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header isDark={isDark} onThemeToggle={onThemeToggle} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 LearnConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
