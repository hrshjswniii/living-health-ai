import { Dna, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AgentVisibilityPanel } from "@/components/dashboard/AgentVisibilityPanel";
import { RiskInsightCard } from "@/components/dashboard/RiskInsightCard";
import { AuditTrailLog } from "@/components/dashboard/AuditTrailLog";
import { DoctorAccessPanel } from "@/components/dashboard/DoctorAccessPanel";
import { HealthReportGenerator } from "@/components/dashboard/HealthReportGenerator";
import { BodySystemOverview } from "@/components/dashboard/BodySystemOverview";

const sampleInsights = [
  {
    id: "1",
    title: "Cardiovascular Risk Pattern",
    riskLevel: "Moderate" as const,
    confidence: 72,
    summary: "Pattern suggests increased risk based on blood pressure trends and family history markers.",
    explanation: "Over the past 6 months, your systolic blood pressure has shown an upward trend (avg +5 mmHg/month). Combined with familial cardiovascular history markers, the Risk Prediction Agent identified a pattern consistent with elevated cardiovascular risk profiles. This is NOT a diagnosis.",
    dataSources: ["Blood Pressure (6mo)", "Family History", "Heart Rate Variability", "Activity Levels"],
    agents: ["Risk Agent", "Anomaly Agent", "Baseline Agent"],
    requiresValidation: true,
  },
  {
    id: "2",
    title: "Metabolic Trend Observation",
    riskLevel: "Moderate" as const,
    confidence: 68,
    summary: "HbA1c levels show a gradual upward pattern over the past 12 months. Consult a specialist.",
    explanation: "Your HbA1c has risen from 5.4% to 5.8% over 12 months. While still in the normal range, the Anomaly Detection Agent flagged the consistent upward trajectory. The Explanation Agent notes this could be influenced by dietary changes or reduced activity.",
    dataSources: ["HbA1c Labs (12mo)", "Glucose Readings", "Diet Log", "Activity Data"],
    agents: ["Anomaly Agent", "Explanation Agent"],
    requiresValidation: false,
  },
  {
    id: "3",
    title: "Sleep Quality Assessment",
    riskLevel: "Low" as const,
    confidence: 88,
    summary: "Your sleep patterns are within healthy ranges with minor fragmentation noted.",
    explanation: "The Baseline Agent established your sleep profile using 90 days of sleep data. Average sleep duration is 7.2 hours with 92% efficiency. Minor REM fragmentation detected on weekdays, likely correlated with screen time patterns.",
    dataSources: ["Sleep Tracker (90 days)", "Heart Rate During Sleep", "Screen Time Data"],
    agents: ["Baseline Agent", "Explanation Agent"],
    requiresValidation: false,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

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
          </div>
          <div className="flex items-center gap-1.5 text-xs text-dna-green">
            <div className="w-2 h-2 rounded-full bg-dna-green animate-agent-pulse" />
            <span>System Active</span>
          </div>
        </div>
      </nav>

      <div className="container px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column — Agents + Body Systems */}
          <div className="space-y-6">
            <AgentVisibilityPanel />
            <BodySystemOverview />
          </div>

          {/* Center column — Risk Insights */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl mb-1">Health Insights</h2>
              <p className="text-sm text-muted-foreground mb-4">AI-generated observations — not medical diagnoses</p>
            </div>
            {sampleInsights.map((insight) => (
              <RiskInsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {/* Right column — Doctor, Report, Audit */}
          <div className="space-y-6">
            <DoctorAccessPanel />
            <HealthReportGenerator />
          </div>
        </div>

        {/* Full width — Audit Trail */}
        <div className="mt-8">
          <AuditTrailLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
