import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-grow w-full">
        {children}
      </main>
      <footer className="w-full py-8 mt-auto border-t border-outline-variant bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant">
          <div className="font-semibold text-primary">CarbonWise</div>
          <div className="text-center md:text-left text-xs opacity-80 max-w-lg">
            Carbon estimates are simplified values for awareness and education. They are not official carbon accounting results.
          </div>
          <div>© {new Date().getFullYear()} CarbonWise.</div>
        </div>
      </footer>
    </div>
  );
}
