import { useState } from "react";
import { FileText, Download, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const HealthReportGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-dna-warm/15 flex items-center justify-center">
          <FileText className="h-5 w-5 text-dna-warm" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg">Health Insight Report</h3>
          <p className="text-sm text-muted-foreground">Generate a compliance-safe report</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-muted/50 border border-border mb-4 text-sm space-y-2">
        <p className="font-medium">Report will include:</p>
        <ul className="space-y-1 text-muted-foreground text-xs">
          <li>• Patient name and health timeline</li>
          <li>• Risk insights with confidence scores (NOT diagnoses)</li>
          <li>• Explainable AI reasoning per insight</li>
          <li>• Color-coded affected areas</li>
          <li>• Recommended specialist consultation</li>
        </ul>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-risk-moderate/8 border border-risk-moderate/15 mb-4">
        <AlertCircle className="h-4 w-4 text-risk-moderate mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Disclaimer:</strong> This is not a medical diagnosis. All insights are pattern-based observations that should be reviewed by a qualified healthcare professional.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-dna-teal mb-4">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Compliance Agent verified — safe for sharing</span>
      </div>

      {!generated ? (
        <Button className="w-full" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              Agents generating report...
            </motion.span>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Generate Health Insight Report
            </>
          )}
        </Button>
      ) : (
        <Button variant="outline" className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Download Report (PDF)
        </Button>
      )}
    </div>
  );
};
