import { motion } from "framer-motion";
import { Brain, Link2, HeartPulse, ShieldCheck, Search, AlertTriangle, MessageSquare } from "lucide-react";

const agentsList = [
  { name: "Baseline Agent", desc: "Builds your health profile from vitals, history, and habits", color: "bg-agent-baseline", icon: HeartPulse },
  { name: "Anomaly Detection", desc: "Spots unusual patterns in your health data", color: "bg-agent-anomaly", icon: Search },
  { name: "Risk Prediction", desc: "Estimates future health risks with confidence scoring", color: "bg-agent-risk", icon: AlertTriangle },
  { name: "Explanation Agent", desc: "Translates complex findings into understandable insights", color: "bg-agent-explain", icon: MessageSquare },
  { name: "Compliance Agent", desc: "Ensures all outputs are medically safe and guideline-compliant", color: "bg-agent-compliance", icon: ShieldCheck },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

export const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 px-4">
    <div className="container max-w-6xl">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
        <motion.p variants={fadeUp} custom={0} className="text-sm font-medium text-dna-green uppercase tracking-widest mb-3">How It Works</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-4xl md:text-5xl font-display font-bold mb-4">
          Multi-Agent Intelligence
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Five specialized AI agents analyze your health continuously — every insight is explainable, auditable, and compliance-safe.
        </motion.p>
      </motion.div>

      {/* AI Agents */}
      <div className="grid md:grid-cols-5 gap-4 mb-20">
        {agentsList.map((agent, i) => (
          <motion.div
            key={agent.name}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="bg-gradient-card rounded-xl p-5 border border-border shadow-soft text-center group hover:shadow-card transition-shadow"
          >
            <div className={`w-10 h-10 rounded-full ${agent.color} mx-auto mb-3 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
              <agent.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="font-display font-semibold text-sm mb-1">{agent.name}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{agent.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Layers */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: Brain,
            title: "🧠 AI Layer",
            desc: "Multi-agent system analyzing your health continuously. Each insight shows which agents contributed and why.",
            color: "text-dna-green",
          },
          {
            icon: Link2,
            title: "🔗 Web3 Layer",
            desc: "Patient-owned data on decentralized infrastructure. All access is logged and verifiable on-chain.",
            color: "text-dna-blue",
          },
          {
            icon: HeartPulse,
            title: "🧬 Living Health Twin",
            desc: "A digital representation of your body with risk markers, confidence scores, and expandable explanations.",
            color: "text-dna-rose",
          },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i}
            className="bg-card rounded-2xl p-8 border border-border shadow-card"
          >
            <item.icon className={`h-8 w-8 ${item.color} mb-4`} />
            <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
