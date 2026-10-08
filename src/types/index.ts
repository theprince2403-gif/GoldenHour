export type BedType = 'ICU' | 'CCU' | 'General' | 'Trauma' | 'Pediatric';
export type Capability = 'Cath Lab' | 'Ventilator' | 'ECMO' | 'Cardiac Emergency';
export type Urgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Hospital {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  baseTravelTime: number; // in minutes
  capabilities: Capability[];
  beds: {
    type: BedType;
    total: number;
    occupied: number;
    expectedDischargesIn1Hr: number;
    expectedArrivalsIn1Hr: number;
    holds: number;
  }[];
  lastUpdated: string;
}

export interface PatientReferral {
  id: string;
  condition: string;
  urgency: Urgency;
  requiredBedType: BedType;
  requiredCapabilities: Capability[];
  ambulanceETA: number;
}
