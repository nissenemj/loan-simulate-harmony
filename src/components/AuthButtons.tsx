
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Avatar, 
  AvatarFallback 
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogin = () => {
    navigate("/auth");
  };

  return user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={isMobile ? "sm" : "default"}>
          <Avatar className="h-6 w-6 mr-2">
            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          {!isMobile && <span className="truncate max-w-[100px]">{user.email?.split('@')[0]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
          Hallintapaneeli
        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Kirjaudu ulos
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button 
      variant="outline" 
      onClick={handleLogin}
      size={isMobile ? "sm" : "default"}
    >
      Kirjaudu sisään
    </Button>
  );
};
