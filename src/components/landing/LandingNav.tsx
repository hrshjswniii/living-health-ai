import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Dna } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const LandingNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userName, logout } = useApp();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <Dna className="h-6 w-6 text-dna-green" />
          <span>Living Health DNA</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>
            How It Works
          </Button>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">{userName}</span>
              <Button size="sm" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button variant="ghost" size="sm" onClick={() => { logout(); }}>Logout</Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
          )}
        </div>
      </div>
    </nav>
  );
};
