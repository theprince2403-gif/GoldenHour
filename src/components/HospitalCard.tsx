import React from 'react';
import { ArrivalCastResult } from '../lib/simulation';
import { ProbabilityRing } from './ProbabilityRing';
import { Hospital } from '../types';
import { Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  result?: ArrivalCastResult;
  showArrivalCast: boolean;
  isRecommended?: boolean;
  onSelect?: () => void;
}

export function HospitalCard({ hospital, result, showArrivalCast, isRecommended, onSelect }: HospitalCardProps) {
  return (
    <div 
      className={`relative p-4 rounded-xl border transition-all duration-500 ${
        isRecommended 
          ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
          : 'border-border bg-card hover:border-gray-600'
      }`}
      onClick={onSelect}
    >
      {isRecommended && (
        <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          RECOMMENDED
        </div>
      )}
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground">{hospital.name}</h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{hospital.baseTravelTime} min away</span>
          </div>
        </div>
        
        {result && (
          <div className="flex-shrink-0">
            {showArrivalCast ? (
              <ProbabilityRing percentage={result.availabilityAtETA} label="At Arrival" size={56} />
            ) : (
              <div className="flex flex-col items-center justify-center w-14 h-14 bg-secondary rounded-full border border-border">
                <span className="text-lg font-bold">{result.availabilityNow}</span>
                <span className="text-[10px] text-muted-foreground">Beds Now</span>
              </div>
            )}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {hospital.capabilities.map(cap => (
              <span key={cap} className="inline-flex items-center text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                {cap}
              </span>
            ))}
          </div>
          
          <div className="bg-background/50 rounded-lg p-3 border border-border text-sm">
            <span className="font-semibold text-muted-foreground">Why: </span>
            <span className="text-foreground">{result.reason}</span>
          </div>
        </div>
      )}
    </div>
  );
}
