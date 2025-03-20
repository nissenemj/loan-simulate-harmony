
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import VelkavapausLogo from "@/components/VelkavapausLogo";

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

  const refreshPage = () => {
    window.location.href = window.location.pathname;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center p-6 max-w-md">
        <div className="mb-6 mx-auto">
          <VelkavapausLogo size="lg" showText={false} />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Sivua ei löytynyt</p>
        <p className="text-sm text-muted-foreground mb-6">
          Tätä sivua ei ole olemassa tai olet saattanut saada tämän virheen päivittäessä sivua.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={goBack} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Takaisin
          </Button>
          <Button onClick={refreshPage} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Päivitä sivu
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
