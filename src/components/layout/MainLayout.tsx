
import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import StudentSidebar from "./StudentSidebar";
import SupervisorSidebar from "./SupervisorSidebar";
import { LogOut, User } from "lucide-react";
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
  
  if (!currentUser) return null;
  
  const getInitials = () => {
    return currentUser ? `${currentUser.firstName[0]}${currentUser.lastName[0]}` : "U";
  };

  const basePath = currentUser.role === "student" ? "/student" : "/supervisor";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {currentUser.role === "student" ? <StudentSidebar /> : <SupervisorSidebar />}
      
      <div className="flex flex-col flex-1 md:ml-64">
        <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <h1 className="text-xl font-bold text-success-700">
            Système de Suivi des Absences
          </h1>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.firstName} />
                    <AvatarFallback className="bg-success-100 text-success-700">
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
        
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
