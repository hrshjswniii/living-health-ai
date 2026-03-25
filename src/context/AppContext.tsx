import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "patient" | "doctor" | null;
export type AgentStatus = "idle" | "processing" | "complete";

export interface AgentState {
  id: string;
  name: string;
  status: AgentStatus;
}

export interface HealthInsight {
  id: string;
  title: string;
  riskLevel: "Low" | "Moderate" | "High";
  confidence: number;
  summary: string;
  explanation: string;
  dataSources: string[];
  agents: string[];
  requiresValidation?: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "access" | "ai_decision" | "revocation" | "compliance" | "report";
  actor: string;
  action: string;
  detail: string;
}

export interface DoctorAccess {
  doctorName: string;
  grantedAt: string;
  expiresAt: string;
  dataTypes: string[];
  active: boolean;
}

interface AppContextType {
  // Auth
  userRole: UserRole;
  userName: string;
  userEmail: string;
  setUser: (role: UserRole, name: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;

  // Agents
  agents: AgentState[];
  runAgentSimulation: () => Promise<void>;
  agentsRunning: boolean;
  agentsComplete: boolean;

  // Insights
  insights: HealthInsight[];

  // Logs
  logs: LogEntry[];
  addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;

  // Doctor Access
  doctorAccess: DoctorAccess[];
  grantAccess: (doctorName: string, durationDays: number, dataTypes: string[]) => void;
  revokeAccess: (doctorName: string) => void;

  // Report
  reportGenerated: boolean;
  setReportGenerated: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const initialAgents: AgentState[] = [
  { id: "baseline", name: "Baseline Agent", status: "idle" },
  { id: "anomaly", name: "Anomaly Detection", status: "idle" },
  { id: "risk", name: "Risk Prediction", status: "idle" },
  { id: "explain", name: "Explanation Agent", status: "idle" },
  { id: "compliance", name: "Compliance Agent", status: "idle" },
];

const generatedInsights: HealthInsight[] = [
  {
    id: "1",
    title: "Cardiovascular Risk Pattern",
    riskLevel: "Moderate",
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
    riskLevel: "Moderate",
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
    riskLevel: "Low",
    confidence: 88,
    summary: "Your sleep patterns are within healthy ranges with minor fragmentation noted.",
    explanation: "The Baseline Agent established your sleep profile using 90 days of sleep data. Average sleep duration is 7.2 hours with 92% efficiency. Minor REM fragmentation detected on weekdays, likely correlated with screen time patterns.",
    dataSources: ["Sleep Tracker (90 days)", "Heart Rate During Sleep", "Screen Time Data"],
    agents: ["Baseline Agent", "Explanation Agent"],
    requiresValidation: false,
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem("lhd_role") as UserRole) || null;
  });
  const [userName, setUserName] = useState(() => localStorage.getItem("lhd_name") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("lhd_email") || "");
  const [agents, setAgents] = useState<AgentState[]>(initialAgents);
  const [agentsRunning, setAgentsRunning] = useState(false);
  const [agentsComplete, setAgentsComplete] = useState(false);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [doctorAccess, setDoctorAccess] = useState<DoctorAccess[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const addLog = useCallback((entry: Omit<LogEntry, "id" | "timestamp">) => {
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setLogs((prev) => [{ ...entry, id: crypto.randomUUID(), timestamp: ts }, ...prev]);
  }, []);

  const setUser = useCallback((role: UserRole, name: string, email: string) => {
    setUserRole(role);
    setUserName(name);
    setUserEmail(email);
    if (role) {
      localStorage.setItem("lhd_role", role);
      localStorage.setItem("lhd_name", name);
      localStorage.setItem("lhd_email", email);
    }
    addLog({ type: "access", actor: name, action: "Logged in", detail: `Role: ${role}` });
  }, [addLog]);

  const logout = useCallback(() => {
    localStorage.removeItem("lhd_role");
    localStorage.removeItem("lhd_name");
    localStorage.removeItem("lhd_email");
    setUserRole(null);
    setUserName("");
    setUserEmail("");
    setAgents(initialAgents);
    setAgentsComplete(false);
    setInsights([]);
    setLogs([]);
    setDoctorAccess([]);
    setReportGenerated(false);
  }, []);

  const runAgentSimulation = useCallback(async () => {
    if (agentsRunning) return;
    setAgentsRunning(true);
    setInsights([]);
    setAgentsComplete(false);

    const agentDelays = [800, 1200, 1500, 1000, 800];
    const agentLogs: Omit<LogEntry, "id" | "timestamp">[] = [
      { type: "ai_decision", actor: "Baseline Agent", action: "Profile built", detail: "Health profile established from vitals and history" },
      { type: "ai_decision", actor: "Anomaly Agent", action: "Flagged anomaly", detail: "Unusual HbA1c trend detected over 6 months" },
      { type: "ai_decision", actor: "Risk Agent", action: "Generated insight", detail: "Cardiovascular risk pattern detected — confidence 72%" },
      { type: "ai_decision", actor: "Explanation Agent", action: "Attached explanation", detail: "Reasoning attached to 3 insights" },
      { type: "compliance", actor: "Compliance Agent", action: "Verified output", detail: "All insights validated against HIPAA guidelines" },
    ];

    for (let i = 0; i < initialAgents.length; i++) {
      setAgents((prev) => prev.map((a, idx) => idx === i ? { ...a, status: "processing" } : a));
      await new Promise((r) => setTimeout(r, agentDelays[i]));
      setAgents((prev) => prev.map((a, idx) => idx === i ? { ...a, status: "complete" } : a));
      addLog(agentLogs[i]);
    }

    setInsights(generatedInsights);
    setAgentsRunning(false);
    setAgentsComplete(true);
  }, [agentsRunning, addLog]);

  const grantAccess = useCallback((doctorName: string, durationDays: number, dataTypes: string[]) => {
    const now = new Date();
    const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const format = (d: Date) => `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}, ${d.getFullYear()}`;
    const newAccess: DoctorAccess = {
      doctorName,
      grantedAt: format(now),
      expiresAt: format(expires),
      dataTypes,
      active: true,
    };
    setDoctorAccess((prev) => [...prev.filter((a) => a.doctorName !== doctorName), newAccess]);
    addLog({ type: "access", actor: "Patient", action: "Granted access", detail: `${doctorName} — ${dataTypes.join(", ")} (${durationDays} days)` });
  }, [addLog]);

  const revokeAccess = useCallback((doctorName: string) => {
    setDoctorAccess((prev) => prev.map((a) => a.doctorName === doctorName ? { ...a, active: false } : a));
    addLog({ type: "revocation", actor: "Patient", action: "Revoked access", detail: `${doctorName} — all access revoked` });
  }, [addLog]);

  return (
    <AppContext.Provider value={{
      userRole, userName, userEmail, setUser, logout, isAuthenticated: !!userRole,
      agents, runAgentSimulation, agentsRunning, agentsComplete,
      insights, logs, addLog,
      doctorAccess, grantAccess, revokeAccess,
      reportGenerated, setReportGenerated,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
