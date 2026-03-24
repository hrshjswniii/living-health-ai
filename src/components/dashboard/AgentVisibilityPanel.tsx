import { motion } from "framer-motion";
import { HeartPulse, Search, AlertTriangle, MessageSquare, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const agents = [
  { id: "baseline", name: "Baseline Agent", icon: HeartPulse, status: "active", color: "bg-agent-baseline" },
  { id: "anomaly", name: "Anomaly Detection", icon: Search, status: "analyzing", color: "bg-agent-anomaly" },
  { id: "risk", name: "Risk Prediction", icon: AlertTriangle, status: "active", color: "bg-agent-risk" },
  { id: "explain", name: "Explanation Agent", icon: MessageSquare, status: "idle", color: "bg-agent-explain" },
  { id: "compliance", name: "Compliance Agent", icon: ShieldCheck, status: "active", color: "bg-agent-compliance" },
];

export const AgentVisibilityPanel = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActiveIdx((p) => (p + 1) % agents.length), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="font-display font-bold text-lg mb-1">AI Agent Network</h3>
      <p className="text-sm text-muted-foreground mb-5">Live status of your health intelligence agents</p>
      <div className="space-y-3">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            animate={{ opacity: i === activeIdx ? 1 : 0.6, scale: i === activeIdx ? 1.02 : 1 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
          >
            <div className={`w-8 h-8 rounded-full ${agent.color} flex items-center justify-center`}>
              <agent.icon className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{agent.name}</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${i === activeIdx ? 'bg-dna-green animate-agent-pulse' : 'bg-muted-foreground/30'}`} />
              <span className="text-xs text-muted-foreground capitalize">
                {i === activeIdx ? "processing" : agent.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
