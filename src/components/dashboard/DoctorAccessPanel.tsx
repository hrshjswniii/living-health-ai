import { useState } from "react";
import { Shield, FileText, Brain, Eye, Clock, UserPlus, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { GrantAccessModal } from "./GrantAccessModal";
import { toast } from "sonner";

export const DoctorAccessPanel = () => {
  const { doctorAccess, revokeAccess, insights, userRole } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const activeAccess = doctorAccess.filter((a) => a.active);

  const handleRevoke = (name: string) => {
    revokeAccess(name);
    toast.success(`Access revoked for ${name}`);
  };

  if (userRole === "doctor") {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-dna-blue/15 flex items-center justify-center">
            <Eye className="h-5 w-5 text-dna-blue" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Doctor View</h3>
            <p className="text-sm text-muted-foreground">Viewing patient-shared data</p>
          </div>
        </div>
        {activeAccess.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No patient has granted you access yet.</p>
        ) : (
          <div className="space-y-3">
            {activeAccess.map((a) => (
              <div key={a.doctorName} className="p-4 rounded-xl bg-accent/40 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-dna-teal" />
                  <span className="text-sm font-medium">Access Active</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">Data: {a.dataTypes.join(", ")}</p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Expires: {a.expiresAt}</span>
                </div>
              </div>
            ))}
            {insights.length > 0 && (
              <div className="space-y-2 mt-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Insight Summary</p>
                {insights.slice(0, 2).map((ins) => (
                  <div key={ins.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-dna-green" />
                      <span className="text-sm">{ins.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{ins.confidence}%</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ins.riskLevel === "Low" ? "bg-risk-low/15 text-risk-low" : "bg-risk-moderate/15 text-risk-moderate"}`}>
                        {ins.riskLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
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

      {activeAccess.length > 0 ? (
        <div className="space-y-3 mb-4">
          {activeAccess.map((a) => (
            <div key={a.doctorName} className="p-4 rounded-xl bg-accent/40 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-dna-teal" />
                  <span className="text-sm font-medium">Consent Active</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-dna-rose" onClick={() => handleRevoke(a.doctorName)}>
                  <UserX className="h-3 w-3 mr-1" /> Revoke
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{a.doctorName} — {a.dataTypes.join(", ")}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Granted: {a.grantedAt} · Expires: {a.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">No active access grants. Grant a doctor access to share data.</p>
      )}

      {insights.length > 0 && (
        <div className="space-y-3 mb-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Insight Summary for Doctor</p>
          {insights.slice(0, 2).map((ins) => (
            <div key={ins.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-dna-green" />
                <span className="text-sm">{ins.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{ins.confidence}%</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${ins.riskLevel === "Low" ? "bg-risk-low/15 text-risk-low" : "bg-risk-moderate/15 text-risk-moderate"}`}>
                  {ins.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" size="sm" onClick={() => setModalOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Grant Access
        </Button>
        <Button variant="outline" className="flex-1" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>
      <GrantAccessModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
};
