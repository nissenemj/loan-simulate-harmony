
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";

const AUTHORIZED_EMAIL = "nissenemj@gmail.com";

const AdminLink: React.FC = () => {
  const { user } = useAuth();
  
  // Only show admin link for authorized user
  if (user?.email !== AUTHORIZED_EMAIL) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <Link to="/admin/blog">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PenSquare className="h-4 w-4" />
          Hallinnoi blogia
        </Button>
      </Link>
    </div>
  );
};

export default AdminLink;
