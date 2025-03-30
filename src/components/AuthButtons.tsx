
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { LogOut, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const AuthButtons = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Since we're temporarily disabling login, just show the dashboard button
  return (
    <Button 
      variant="outline" 
      onClick={() => navigate("/dashboard")}
      size={isMobile ? "sm" : "default"}
    >
      {t("auth.dashboard")}
    </Button>
  );
};
