import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, User, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useApp, UserRole } from "@/context/AppContext";

const Auth = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { setUser } = useApp();

  const handleRoleSelect = (r: UserRole) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !role) return;
    setUser(role, name.trim(), email.trim());
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-hero" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Dna className="h-8 w-8 text-dna-green" />
            <span className="font-display font-bold text-2xl">Living Health DNA</span>
          </div>
          <p className="text-muted-foreground">Patient-Owned Healthcare Intelligence</p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-card p-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-display font-bold text-xl text-center mb-6">I am a...</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleRoleSelect("patient")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-dna-green hover:shadow-soft transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-dna-green/15 flex items-center justify-center group-hover:bg-dna-green/25 transition-colors">
                      <User className="h-6 w-6 text-dna-green" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-display font-semibold">Patient</p>
                      <p className="text-sm text-muted-foreground">Access your health intelligence dashboard</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-dna-green transition-colors" />
                  </button>
                  <button
                    onClick={() => handleRoleSelect("doctor")}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-dna-blue hover:shadow-soft transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-dna-blue/15 flex items-center justify-center group-hover:bg-dna-blue/25 transition-colors">
                      <Stethoscope className="h-6 w-6 text-dna-blue" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-display font-semibold">Healthcare Provider</p>
                      <p className="text-sm text-muted-foreground">View patient-shared health insights</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-dna-blue transition-colors" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground mb-4 flex items-center gap-1">
                  ← Back
                </button>
                <h2 className="font-display font-bold text-xl mb-1">
                  {role === "patient" ? "Welcome, Patient" : "Welcome, Doctor"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">Enter your details to continue</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                    <Input placeholder={role === "doctor" ? "Dr. Sarah Chen" : "John Doe"} value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Email</label>
                    <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Enter Dashboard
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
