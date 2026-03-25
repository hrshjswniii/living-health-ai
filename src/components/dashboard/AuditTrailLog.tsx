import { Lock, Eye, Brain, ShieldCheck, UserX, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";

const iconMap = {
  access: Eye,
  ai_decision: Brain,
  revocation: UserX,
  compliance: ShieldCheck,
  report: FileText,
};

const colorMap = {
  access: "bg-dna-blue/15 text-dna-blue",
  ai_decision: "bg-dna-green/15 text-dna-green",
  revocation: "bg-dna-rose/15 text-dna-rose",
  compliance: "bg-dna-teal/15 text-dna-teal",
  report: "bg-dna-warm/15 text-dna-warm",
};

export const AuditTrailLog = () => {
  const { logs } = useApp();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-bold text-lg">Health Activity Log</h3>
          <p className="text-sm text-muted-foreground">Immutable audit trail — all actions logged</p>
        </div>
        <Lock className="h-5 w-5 text-muted-foreground" />
      </div>
      {logs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No activity yet. Run an analysis to see agent activity.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-1">
            {logs.map((entry, i) => {
              const Icon = iconMap[entry.type];
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
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
      )}
    </div>
  );
};
