import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { Shield, Clock } from "lucide-react";
import { toast } from "sonner";

const dataTypeOptions = ["Vitals (last 90 days)", "Lab Results", "Sleep Data", "Activity Levels", "Family History"];
const durationOptions = [30, 60, 90, 180];

export const GrantAccessModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { grantAccess } = useApp();
  const [doctorName, setDoctorName] = useState("");
  const [duration, setDuration] = useState(90);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["Vitals (last 90 days)"]);

  const toggleType = (t: string) => {
    setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const handleGrant = () => {
    if (!doctorName.trim() || selectedTypes.length === 0) return;
    grantAccess(doctorName.trim(), duration, selectedTypes);
    toast.success(`Access granted to ${doctorName.trim()}`);
    setDoctorName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-dna-teal" />
            Grant Doctor Access
          </DialogTitle>
          <DialogDescription>Share limited health data with a healthcare provider</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Doctor Name</label>
            <Input placeholder="Dr. Sarah Chen" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Data to Share</label>
            <div className="flex flex-wrap gap-2">
              {dataTypeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${selectedTypes.includes(t) ? "bg-dna-green/15 border-dna-green/30 text-foreground" : "border-border text-muted-foreground hover:border-dna-green/20"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Duration
            </label>
            <div className="flex gap-2">
              {durationOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${duration === d ? "bg-dna-blue/15 border-dna-blue/30 text-foreground" : "border-border text-muted-foreground"}`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGrant} className="w-full" disabled={!doctorName.trim() || selectedTypes.length === 0}>
            Grant Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
