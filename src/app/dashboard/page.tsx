'use client';

import React, { useState } from 'react';
import { ReferralForm } from '@/components/ReferralForm';
import { HospitalCard } from '@/components/HospitalCard';
import { MapVisualization } from '@/components/MapVisualization';
import { mockHospitals } from '@/data/hospitals';
import { runArrivalCast, ArrivalCastResult } from '@/lib/simulation';
import { PatientReferral } from '@/types';
import { ShieldAlert, Zap, ArrowRight, CheckCircle2, Play } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [referral, setReferral] = useState<PatientReferral | null>(null);
  const [results, setResults] = useState<ArrivalCastResult[]>([]);
  const [showArrivalCast, setShowArrivalCast] = useState(false);
  const [preAlertSent, setPreAlertSent] = useState(false);

  const handleAnalyze = (newReferral: PatientReferral) => {
    setReferral(newReferral);
    const initialResults = runArrivalCast(mockHospitals, newReferral);
    const beforeResults = [...initialResults].sort((a, b) => b.availabilityNow - a.availabilityNow);
    setResults(beforeResults);
    setShowArrivalCast(false);
    setPreAlertSent(false);
  };

  const handleRunArrivalCast = () => {
    if (!referral) return;
    const smartResults = runArrivalCast(mockHospitals, referral);
    setResults(smartResults);
    setShowArrivalCast(true);
  };

  const runOfflineDemo = () => {
    const demoReferral: PatientReferral = {
      id: 'demo-123',
      condition: 'Cardiac emergency (STEMI)',
      urgency: 'Critical',
      requiredBedType: 'CCU',
      requiredCapabilities: ['Cath Lab', 'Cardiac Emergency'],
      ambulanceETA: 18,
    };
    handleAnalyze(demoReferral);
  };

  const topHospital = results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">GoldenHour</span>
            <span className="ml-4 px-2 py-0.5 rounded text-xs font-mono bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
              SIMULATION DEMO
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={runOfflineDemo}
              className="text-xs bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded-md font-semibold text-secondary-foreground flex items-center border border-border"
            >
              <Play className="w-3 h-3 mr-1" /> RUN DEMO SCENARIO
            </button>
            <span className="text-sm text-muted-foreground flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Network Active
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake */}
        <div className="lg:col-span-3 space-y-6">
          <ReferralForm onAnalyze={handleAnalyze} />
          
          {referral && !showArrivalCast && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={handleRunArrivalCast}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl p-4 shadow-lg transition-all hover:shadow-blue-500/25 border border-blue-400/30"
              >
                <div className="flex items-center justify-center">
                  <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-lg tracking-wide">RUN ARRIVALCAST™</span>
                </div>
                <p className="text-xs text-blue-100 mt-2 opacity-80 font-medium text-center">Predict capacity at ambulance ETA</p>
              </button>
            </div>
          )}

          {referral && showArrivalCast && (
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-5 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="flex items-center mb-3">
                <Zap className="w-5 h-5 mr-2 text-primary" />
                <h3 className="font-bold text-primary">ArrivalCast Active</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Forecast engine has simulated expected discharges and arrivals over the next {referral.ambulanceETA} minutes.
              </p>
              
              {!preAlertSent ? (
                <button 
                  onClick={() => setPreAlertSent(true)}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all shadow-lg hover:shadow-green-500/20"
                >
                  SEND PRE-ALERT <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                  <span className="font-bold text-green-500 block mb-1">SIMULATED BED HOLD</span>
                  <span className="text-xs text-muted-foreground">{topHospital?.hospitalId ? mockHospitals.find(h => h.id === topHospital.hospitalId)?.name : 'Hospital'} has accepted the referral.</span>
                  <div className="mt-3 font-mono text-xl text-green-400 bg-black/30 px-3 py-1 rounded border border-green-500/30">19:59</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle Column: Visualization */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-xl p-1 shadow-sm h-full min-h-[500px] flex flex-col">
            <div className="p-3 border-b border-border flex justify-between items-center bg-card">
              <h2 className="font-semibold text-foreground">Regional Network</h2>
              {referral && (
                <div className="flex bg-secondary rounded-lg p-1">
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!showArrivalCast ? 'bg-background shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => {
                       setShowArrivalCast(false);
                       setResults([...results].sort((a,b) => b.availabilityNow - a.availabilityNow));
                    }}
                  >
                    AVAILABLE NOW
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${showArrivalCast ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={handleRunArrivalCast}
                  >
                    AT ARRIVAL
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 p-1">
               <MapVisualization 
                  hospitals={mockHospitals} 
                  results={results} 
                  showArrivalCast={showArrivalCast}
                  selectedHospitalId={topHospital?.hospitalId}
               />
            </div>
          </div>
        </div>

        {/* Right Column: Rankings */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-full">
            <h2 className="text-lg font-bold mb-4 text-foreground flex items-center justify-between">
              Destination Ranking
              {showArrivalCast && <span className="text-xs font-mono text-primary px-2 py-1 bg-primary/10 rounded">PREDICTIVE MODE</span>}
            </h2>

            {!referral ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                <p>Waiting for referral intake...</p>
                <p className="text-sm mt-2 opacity-60">Paste a referral to view matches</p>
              </div>
            ) : (
              <div className="space-y-4 relative">
                {results.map((result, index) => {
                  const hospital = mockHospitals.find(h => h.id === result.hospitalId)!;
                  return (
                    <div 
                      key={hospital.id} 
                      className={`transform transition-all duration-700 ease-out`}
                      style={{ zIndex: 10 - index }}
                    >
                      <HospitalCard 
                        hospital={hospital}
                        result={result}
                        showArrivalCast={showArrivalCast}
                        isRecommended={index === 0 && showArrivalCast}
                        onSelect={() => {}}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
