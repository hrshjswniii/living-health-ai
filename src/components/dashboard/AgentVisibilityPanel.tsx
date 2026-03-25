import { motion } from "framer-motion";
import { HeartPulse, Search, AlertTriangle, MessageSquare, ShieldCheck, CheckCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";

const agentMeta = [
  { id: "baseline", name: "Baseline Agent", icon: HeartPulse, color: "bg-agent-baseline" },
  { id: "anomaly", name: "Anomaly Detection", icon: Search, color: "bg-agent-anomaly" },
  { id: "risk", name: "Risk Prediction", icon: AlertTriangle, color: "bg-agent-risk" },
  { id: "explain", name: "Explanation Agent", icon: MessageSquare, color: "bg-agent-explain" },
  { id: "compliance", name: "Compliance Agent", icon: ShieldCheck, color: "bg-agent-compliance" },
];

export const AgentVisibilityPanel = () => {
  const { agents } = useApp();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="font-display font-bold text-lg mb-1">AI Agent Network</h3>
      <p className="text-sm text-muted-foreground mb-5">Live status of your health intelligence agents</p>
      <div className="space-y-3">
        {agents.map((agent, i) => {
          const meta = agentMeta[i];
          const isProcessing = agent.status === "processing";
          const isComplete = agent.status === "complete";
          return (
            <motion.div
              key={agent.id}
              animate={{ opacity: isProcessing ? 1 : isComplete ? 0.85 : 0.5, scale: isProcessing ? 1.02 : 1 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
            >
              <div className={`w-8 h-8 rounded-full ${meta.color} flex items-center justify-center`}>
                <meta.icon className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{meta.name}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-dna-green" />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-dna-green animate-agent-pulse' : 'bg-muted-foreground/30'}`} />
                )}
                <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
