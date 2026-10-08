import React, { useState } from 'react';
import { PatientReferral, BedType, Capability, Urgency } from '../types';
import { Activity, AlertTriangle, Clock, Search, ChevronRight } from 'lucide-react';

interface ReferralFormProps {
  onAnalyze: (referral: PatientReferral) => void;
}

export function ReferralForm({ onAnalyze }: ReferralFormProps) {
  const [note, setNote] = useState("55-year-old male with chest pain and ST elevation. Requires urgent cardiac intervention, cath lab and CCU support. Ambulance ETA 14 minutes.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extracted, setExtracted] = useState<PatientReferral | null>(null);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setExtracted(null);
    
    // Simulate AI extraction delay
    setTimeout(() => {
      const result: PatientReferral = {
        id: 'ref-' + Math.random().toString(36).substr(2, 9),
        condition: 'Cardiac emergency (STEMI)',
        urgency: 'Critical',
        requiredBedType: 'CCU',
        requiredCapabilities: ['Cath Lab', 'Cardiac Emergency'],
        ambulanceETA: 14,
      };
      setExtracted(result);
      setIsAnalyzing(false);
      onAnalyze(result);
    }, 1500);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <h2 className="text-lg font-bold mb-4 flex items-center text-foreground">
        <Activity className="w-5 h-5 mr-2 text-primary" />
        Emergency Referral Intake
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Clinical Note / Handoff
        </label>
        <textarea
          className="w-full h-32 bg-background border border-input rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Paste ambulance handoff or clinical notes here..."
        />
      </div>

      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !note.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
      >
        {isAnalyzing ? (
          <span className="flex items-center animate-pulse">
            <Search className="w-4 h-4 mr-2 animate-spin" />
            Analyzing requirements...
          </span>
        ) : (
          <span className="flex items-center">
            Extract Requirements
            <ChevronRight className="w-4 h-4 ml-1" />
          </span>
        )}
      </button>

      {extracted && (
        <div className="mt-5 p-4 bg-background border border-border rounded-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">AI Extracted Requirements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Condition</span>
              <span className="text-sm font-medium">{extracted.condition}</span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Urgency</span>
              <span className="inline-flex items-center text-sm font-medium text-red-500">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {extracted.urgency}
              </span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Required Bed</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-sm font-medium">
                {extracted.requiredBedType}
              </span>
            </div>
            <div>
              <span className="block text-xs text-muted-foreground mb-1">Ambulance ETA</span>
              <span className="inline-flex items-center text-sm font-medium">
                <Clock className="w-3 h-3 mr-1 text-primary" />
                {extracted.ambulanceETA} min
              </span>
            </div>
          </div>
          
          <div className="mt-3">
             <span className="block text-xs text-muted-foreground mb-1">Required Capabilities</span>
             <div className="flex flex-wrap gap-2">
               {extracted.requiredCapabilities.map(cap => (
                 <span key={cap} className="text-xs px-2 py-1 rounded bg-secondary border border-border text-foreground">
                   {cap}
                 </span>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
