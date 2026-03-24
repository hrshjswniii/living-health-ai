import { Shield, FileText, Brain, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const sharedInsights = [
  { label: "Cardiovascular Risk Pattern", confidence: 72, risk: "Moderate" },
  { label: "Blood Pressure Trend Analysis", confidence: 88, risk: "Low" },
];

export const DoctorAccessPanel = () => (
  <div className="bg-card rounded-2xl border border-border shadow-card p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-full bg-dna-blue/15 flex items-center justify-center">
        <Eye className="h-5 w-5 text-dna-blue" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg">Doctor Access View</h3>
        <p className="text-sm text-muted-foreground">Data shared: limited + consented</p>
      </div>
    </div>

    <div className="p-4 rounded-xl bg-accent/40 border border-border mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-4 w-4 text-dna-teal" />
        <span className="text-sm font-medium">Consent Status</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2">Dr. Sarah Chen — Limited access to vitals (last 90 days)</p>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>Granted: Mar 22, 2026 · Expires: Jun 22, 2026</span>
      </div>
    </div>

    <div className="space-y-3 mb-5">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Insight Summary for Doctor</p>
      {sharedInsights.map((ins) => (
        <div key={ins.label} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-dna-green" />
            <span className="text-sm">{ins.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{ins.confidence}%</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${ins.risk === "Low" ? "bg-risk-low/15 text-risk-low" : "bg-risk-moderate/15 text-risk-moderate"}`}>
              {ins.risk}
            </span>
          </div>
        </div>
      ))}
    </div>

    <Button variant="outline" className="w-full" size="sm">
      <FileText className="h-4 w-4 mr-2" />
      Generate Shareable Report
    </Button>
  </div>
);
