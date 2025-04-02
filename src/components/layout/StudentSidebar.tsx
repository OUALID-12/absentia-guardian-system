
import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Home, FileText, User } from "lucide-react";
import { cn } from "@/lib/utils";

const StudentSidebar = () => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { icon: Home, label: "Tableau de bord", path: "/student/dashboard" },
    { icon: Calendar, label: "Historique d'absences", path: "/student/absences" },
    { icon: FileText, label: "Réclamations", path: "/student/claims" },
    { icon: User, label: "Profile", path: "/student/profile" },
  ];

  return (
    <aside className="fixed top-0 left-0 z-20 h-screen w-64 bg-white border-r shadow-sm pt-16 hidden md:block">
      <div className="flex flex-col items-center p-4 border-b">
        <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center mb-2">
          <span className="text-2xl font-bold text-success-700">
            {currentUser?.firstName?.[0]}{currentUser?.lastName?.[0]}
          </span>
        </div>
        <h2 className="font-medium text-lg">{currentUser?.firstName} {currentUser?.lastName}</h2>
        <p className="text-sm text-gray-500">{currentUser?.class}</p>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center space-x-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                  isActive 
                    ? "bg-success-50 text-success-700" 
                    : "text-gray-700 hover:bg-gray-100"
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

export default StudentSidebar;
