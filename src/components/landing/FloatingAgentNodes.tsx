import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AgentNode {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  delay: number;
}

const agents: AgentNode[] = [
  { id: "baseline", name: "Baseline", x: 15, y: 25, color: "var(--agent-baseline)", delay: 0 },
  { id: "anomaly", name: "Anomaly", x: 75, y: 18, color: "var(--agent-anomaly)", delay: 0.8 },
  { id: "risk", name: "Risk", x: 85, y: 65, color: "var(--agent-risk)", delay: 1.6 },
  { id: "explain", name: "Explain", x: 25, y: 72, color: "var(--agent-explain)", delay: 2.4 },
  { id: "compliance", name: "Compliance", x: 50, y: 45, color: "var(--agent-compliance)", delay: 3.2 },
];

const connections = [
  [0, 4], [1, 4], [2, 4], [3, 4], [0, 1], [2, 3],
];

export const FloatingAgentNodes = () => {
  const [activeAgent, setActiveAgent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent((prev) => (prev + 1) % agents.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={`${agents[from].x}%`}
            y1={`${agents[from].y}%`}
            x2={`${agents[to].x}%`}
            y2={`${agents[to].y}%`}
            stroke="hsl(var(--dna-green) / 0.12)"
            strokeWidth="1"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "loop", repeatDelay: 3 }}
          />
        ))}
      </svg>
      {agents.map((agent, i) => (
        <motion.div
          key={agent.id}
          className="absolute flex flex-col items-center gap-1"
          style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: agent.delay * 0.3, duration: 0.6 }}
        >
          <motion.div
            className="rounded-full"
            style={{
              width: i === activeAgent ? 14 : 10,
              height: i === activeAgent ? 14 : 10,
              backgroundColor: `hsl(${agent.color})`,
              boxShadow: i === activeAgent ? `0 0 20px 6px hsl(${agent.color} / 0.3)` : 'none',
            }}
            animate={{
              scale: i === activeAgent ? [1, 1.3, 1] : 1,
              opacity: i === activeAgent ? 1 : 0.45,
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[9px] font-display text-muted-foreground/50 tracking-wider uppercase whitespace-nowrap">
            {agent.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
