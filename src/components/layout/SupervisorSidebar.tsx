
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Calendar, Users, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const SupervisorSidebar = () => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", path: "/supervisor/dashboard" },
    { icon: Calendar, label: "Suivi des absences", path: "/supervisor/absences" },
    { icon: Users, label: "Classes", path: "/supervisor/classes" },
    { icon: Clock, label: "Emploi du temps", path: "/supervisor/schedules" },
    { icon: User, label: "Profile", path: "/supervisor/profile" },
  ];

  return (
    <aside className="fixed top-0 left-0 z-20 h-screen w-64 bg-white border-r shadow-sm pt-16 hidden md:block dark:bg-gray-800 dark:border-gray-700">
      {/* Logo */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center border-b bg-success-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success-600 flex items-center justify-center">
            <span className="text-sm font-bold text-white">SA</span>
          </div>
          <h1 className="text-xl font-bold text-success-700 dark:text-success-400">AbsTrack</h1>
        </div>
      </div>
      
      <div className="flex flex-col items-center p-4 border-b dark:border-gray-700">
        <div className="w-20 h-20 rounded-full bg-success-100 dark:bg-success-900 flex items-center justify-center mb-2">
          <span className="text-2xl font-bold text-success-700 dark:text-success-400">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </span>
        </div>
        <h2 className="font-medium text-lg dark:text-gray-100">{currentUser?.firstName} {currentUser?.lastName}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Superviseur</p>
      </div>
      
      <nav className="mt-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-all",
                  isActive 
                    ? "bg-success-50 text-success-700 dark:bg-success-900 dark:text-success-300" 
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SupervisorSidebar;
