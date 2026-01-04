
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const AdminLink: React.FC = () => {
  const { isAdmin, loading } = useAdmin();

  // Only show admin link for authorized user
  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="mb-6">
      <Link to="/blog-admin">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <PenSquare className="h-4 w-4" />
          Hallinnoi blogia
        </Button>
      </Link>
    </div>
  );
};

export default AdminLink;
