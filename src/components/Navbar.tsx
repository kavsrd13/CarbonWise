import { Link, useLocation } from "react-router-dom";
import { Leaf, Plus, Settings } from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (currentPath: string) => {
    const isActive = path === currentPath;
    return `text-base font-medium transition-all duration-150 py-1 ${
      isActive 
      ? 'border-b-2 border-primary text-primary font-semibold' 
      : 'text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg px-2 border-b-2 border-transparent'
    }`;
  };

  return (
    <nav className="w-full sticky top-0 bg-surface border-b border-outline-variant shadow-sm z-50">
      <div className="flex justify-between items-center h-16 px-4 md:px-8 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 cursor-pointer group" aria-label="Go to Home">
          <Leaf className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-2xl text-primary tracking-tight">CarbonWise</span>
        </Link>
        
        {path !== "/onboarding" && (
          <div className="hidden md:flex gap-6 items-center flex-grow justify-center">
            <Link to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>
            <Link to="/add" className={getLinkClass("/add")}>Activities</Link>
            <Link to="/coach" className={getLinkClass("/coach")}>EcoCoach</Link>
            <Link to="/challenges" className={getLinkClass("/challenges")}>Challenges</Link>
          </div>
        )}

        {path !== "/onboarding" && (
          <div className="flex items-center gap-4">
            <Link to="/add" className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-lg font-medium text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Activity
            </Link>
            <Link to="/settings" className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors" aria-label="Open Settings">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
