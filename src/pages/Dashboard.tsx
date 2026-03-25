import { Dna, ArrowLeft, Play, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AgentVisibilityPanel } from "@/components/dashboard/AgentVisibilityPanel";
import { RiskInsightCard } from "@/components/dashboard/RiskInsightCard";
import { AuditTrailLog } from "@/components/dashboard/AuditTrailLog";
import { DoctorAccessPanel } from "@/components/dashboard/DoctorAccessPanel";
import { HealthReportGenerator } from "@/components/dashboard/HealthReportGenerator";
import { BodySystemOverview } from "@/components/dashboard/BodySystemOverview";
import { useApp } from "@/context/AppContext";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userName, userRole, insights, runAgentSimulation, agentsRunning, agentsComplete, logout } = useApp();

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 font-display font-bold">
              <Dna className="h-5 w-5 text-dna-green" />
              <span>LHD Dashboard</span>
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              {userName} ({userRole})
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!agentsComplete && (
              <Button size="sm" onClick={runAgentSimulation} disabled={agentsRunning}>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                {agentsRunning ? "Analyzing..." : "Run Analysis"}
              </Button>
            )}
            <div className="flex items-center gap-1.5 text-xs text-dna-green">
              <div className="w-2 h-2 rounded-full bg-dna-green animate-agent-pulse" />
              <span>System Active</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <AgentVisibilityPanel />
            <BodySystemOverview />
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">Health Insights</h2>
              <p className="text-sm text-muted-foreground mb-4">AI-generated observations — not medical diagnoses</p>
            </div>
            {insights.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border shadow-soft p-8 text-center">
                <p className="text-muted-foreground text-sm mb-3">No insights generated yet.</p>
                <Button onClick={runAgentSimulation} disabled={agentsRunning} size="sm">
                  <Play className="h-3.5 w-3.5 mr-1.5" />
                  {agentsRunning ? "Analyzing..." : "Run Analysis"}
                </Button>
              </div>
            ) : (
              insights.map((insight) => (
                <RiskInsightCard key={insight.id} insight={insight} />
              ))
            )}
          </div>

          <div className="space-y-6">
            <DoctorAccessPanel />
            <HealthReportGenerator />
          </div>
        </div>

        <div className="mt-8">
          <AuditTrailLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
