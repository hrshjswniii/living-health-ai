import { Lock, Eye, Brain, ShieldCheck, UserX } from "lucide-react";
import { motion } from "framer-motion";

interface AuditEntry {
  id: string;
  timestamp: string;
  type: "access" | "ai_decision" | "revocation" | "compliance";
  actor: string;
  action: string;
  detail: string;
}

const sampleEntries: AuditEntry[] = [
  { id: "1", timestamp: "2026-03-24 09:15", type: "ai_decision", actor: "Risk Agent", action: "Generated insight", detail: "Cardiovascular risk pattern detected — confidence 72%" },
  { id: "2", timestamp: "2026-03-24 09:15", type: "compliance", actor: "Compliance Agent", action: "Verified output", detail: "Insight validated against HIPAA guidelines" },
  { id: "3", timestamp: "2026-03-24 08:45", type: "access", actor: "Dr. Sarah Chen", action: "Viewed records", detail: "Accessed: vitals (last 90 days), limited consent" },
  { id: "4", timestamp: "2026-03-23 17:30", type: "revocation", actor: "Patient", action: "Revoked access", detail: "Dr. James Lee — full record access revoked" },
  { id: "5", timestamp: "2026-03-23 14:00", type: "ai_decision", actor: "Anomaly Agent", action: "Flagged anomaly", detail: "Unusual HbA1c trend over 6 months" },
  { id: "6", timestamp: "2026-03-22 11:20", type: "access", actor: "Patient", action: "Granted access", detail: "Dr. Sarah Chen — limited vitals access (90 days)" },
];

const iconMap = {
  access: Eye,
  ai_decision: Brain,
  revocation: UserX,
  compliance: ShieldCheck,
};

const colorMap = {
  access: "bg-dna-blue/15 text-dna-blue",
  ai_decision: "bg-dna-green/15 text-dna-green",
  revocation: "bg-dna-rose/15 text-dna-rose",
  compliance: "bg-dna-teal/15 text-dna-teal",
};

export const AuditTrailLog = () => (
  <div className="bg-card rounded-2xl border border-border shadow-card p-6">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="font-display font-bold text-lg">Health Activity Log</h3>
        <p className="text-sm text-muted-foreground">Immutable audit trail — all actions logged</p>
      </div>
      <Lock className="h-5 w-5 text-muted-foreground" />
    </div>
    <div className="relative">
      {/* DNA strand line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-1">
        {sampleEntries.map((entry, i) => {
          const Icon = iconMap[entry.type];
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-10 py-3"
            >
              <div className={`absolute left-1.5 top-4 w-5 h-5 rounded-full flex items-center justify-center ${colorMap[entry.type]}`}>
                <Icon className="h-3 w-3" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{entry.actor}</span>
                    <span className="text-xs text-muted-foreground">• {entry.action}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{entry.detail}</p>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{entry.timestamp}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);
