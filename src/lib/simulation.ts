import { Hospital, BedType, PatientReferral } from '../types';

export interface ArrivalCastResult {
  hospitalId: string;
  availabilityNow: number; // free beds now
  availabilityAtETA: number; // percentage (0-100)
  travelTime: number; // minutes
  capabilityMatch: boolean;
  score: number;
  reason: string;
}

// A simple deterministic pseudo-random function based on a seed string
function seededRandom(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const x = Math.sin(hash++) * 10000;
  return x - Math.floor(x);
}

// Calculate poisson-like cumulative probability (simplified deterministic model)
// for having at least 1 bed available at ETA
function calculateArrivalProbability(
  currentFree: number,
  expectedDischarges: number,
  expectedArrivals: number,
  holds: number,
  etaMinutes: number,
  seed: string
): number {
  // scale rates by ETA (assuming rates are per hour)
  const etaRatio = etaMinutes / 60;
  const dischargesAtETA = expectedDischarges * etaRatio;
  const arrivalsAtETA = expectedArrivals * etaRatio;
  
  const expectedFreeBedsAtETA = currentFree + dischargesAtETA - arrivalsAtETA - holds;
  
  if (expectedFreeBedsAtETA >= 1.5) return 99; // Very high probability
  if (expectedFreeBedsAtETA <= -1) return 1; // Very low probability
  
  // Base probability depending on expected value
  let baseProb = 0;
  if (expectedFreeBedsAtETA > 0) {
    baseProb = 50 + (expectedFreeBedsAtETA * 30);
  } else {
    baseProb = 10 + ((expectedFreeBedsAtETA + 1) * 40);
  }

  // Add deterministic noise (±5%) based on seed to make numbers look realistic
  const noise = (seededRandom(seed) - 0.5) * 10;
  
  let finalProb = Math.round(baseProb + noise);
  
  return Math.min(Math.max(finalProb, 1), 99);
}

export function runArrivalCast(hospitals: Hospital[], referral: PatientReferral): ArrivalCastResult[] {
  const results = hospitals.map(hospital => {
    // 1. Check capability match
    const hasCapabilities = referral.requiredCapabilities.every(cap => hospital.capabilities.includes(cap));
    
    // 2. Check bed type availability
    const bedInfo = hospital.beds.find(b => b.type === referral.requiredBedType);
    
    if (!bedInfo) {
      return {
        hospitalId: hospital.id,
        availabilityNow: 0,
        availabilityAtETA: 0,
        travelTime: hospital.baseTravelTime,
        capabilityMatch: false,
        score: 0,
        reason: `Does not have ${referral.requiredBedType} beds.`
      };
    }
    
    const currentFree = bedInfo.total - bedInfo.occupied;
    
    // 3. Calculate travel time (using base travel time as demo)
    const travelTime = hospital.baseTravelTime; 
    
    // 4. Calculate probability at ETA
    const probAtETA = calculateArrivalProbability(
      currentFree,
      bedInfo.expectedDischargesIn1Hr,
      bedInfo.expectedArrivalsIn1Hr,
      bedInfo.holds,
      travelTime, // using travelTime as ETA
      hospital.id + referral.id
    );
    
    // 5. Calculate Score
    let score = probAtETA;
    if (!hasCapabilities) score -= 100; // Penalize lack of capabilities heavily
    score -= travelTime; // Slight penalty for longer travel time
    
    // 6. Generate Reason
    let reason = "Good overall match.";
    if (!hasCapabilities) {
      reason = "Missing required capabilities.";
    } else if (probAtETA > 80) {
      reason = "Highest probability of suitable capacity at ambulance arrival.";
    } else if (probAtETA < 30) {
      reason = "High risk of capacity saturation before arrival.";
    } else if (currentFree > 0 && probAtETA < 50) {
      reason = "Beds appear free now, but expected arrivals exceed discharges.";
    }

    return {
      hospitalId: hospital.id,
      availabilityNow: currentFree,
      availabilityAtETA: probAtETA,
      travelTime: travelTime,
      capabilityMatch: hasCapabilities,
      score: score,
      reason: reason
    };
  });
  
  // Rank by score descending
  return results.sort((a, b) => b.score - a.score);
}
