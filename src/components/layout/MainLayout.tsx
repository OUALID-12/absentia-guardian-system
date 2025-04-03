
import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StudentSidebar from "./StudentSidebar";
import SupervisorSidebar from "./SupervisorSidebar";
import { LogOut, User, Moon, Sun } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    // Check if user has a saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  if (!currentUser) return null;
  
  const getInitials = () => {
    return currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : "U";
  };

  const basePath = currentUser.role === "student" ? "/student" : "/supervisor";

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {currentUser.role === "student" ? <StudentSidebar /> : <SupervisorSidebar />}
      
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b shadow-sm transition-colors duration-300">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold text-success-700 dark:text-success-400">
                AbsencePro Academy
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={theme === "light" ? "Passer en mode sombre" : "Passer en mode clair"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                    <AvatarFallback className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to={`${basePath}/profile`} className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        <main className="flex-1 p-6 overflow-auto dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
