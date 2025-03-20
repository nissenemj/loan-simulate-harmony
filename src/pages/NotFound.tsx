
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center p-6 max-w-md">
        <div className="mb-6 w-24 h-24 mx-auto">
          <svg 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full opacity-50"
          >
            <path 
              d="M60 20 L10 90 L110 90 Z" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              className="text-primary"
            />
            <path 
              d="M40 45 L60 75 L80 45 Z" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              className="text-primary"
            />
            <line 
              x1="10" 
              y1="100" 
              x2="110" 
              y2="100" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-primary"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Sivua ei löytynyt</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Takaisin
          </Button>
          <Button onClick={goHome} className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Etusivulle
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
