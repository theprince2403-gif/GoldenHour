import React from 'react';
import { Hospital } from '../types';
import { ArrivalCastResult } from '../lib/simulation';

interface MapVisualizationProps {
  hospitals: Hospital[];
  results: ArrivalCastResult[];
  showArrivalCast: boolean;
  selectedHospitalId?: string;
}

export function MapVisualization({ hospitals, results, showArrivalCast, selectedHospitalId }: MapVisualizationProps) {
  // Simple deterministic synthetic map layout based on coordinates
  // Normalize coordinates for drawing
  const minLat = Math.min(...hospitals.map(h => h.location.lat)) - 0.02;
  const maxLat = Math.max(...hospitals.map(h => h.location.lat)) + 0.02;
  const minLng = Math.min(...hospitals.map(h => h.location.lng)) - 0.02;
  const maxLng = Math.max(...hospitals.map(h => h.location.lng)) + 0.02;

  const getPosition = (lat: number, lng: number) => {
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    return { x, y };
  };

  // Fake ambulance location (bottom left)
  const ambulancePos = { x: 10, y: 90 };

  return (
    <div className="relative w-full h-[500px] bg-secondary/30 rounded-xl border border-border overflow-hidden">
      {/* Background Grid Pattern for Command Center feel */}
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }} />
      
      {/* Route lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {hospitals.map(hospital => {
          const pos = getPosition(hospital.location.lat, hospital.location.lng);
          const isSelected = hospital.id === selectedHospitalId;
          if (!isSelected) return null;
          
          return (
            <line 
              key={`line-${hospital.id}`}
              x1={`${ambulancePos.x}%`} 
              y1={`${ambulancePos.y}%`} 
              x2={`${pos.x}%`} 
              y2={`${pos.y}%`}
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeDasharray="6,6"
              className="animate-[dash_20s_linear_infinite]"
            />
          );
        })}
      </svg>

      {/* Ambulance Marker */}
      <div 
        className="absolute w-8 h-8 -ml-4 -mt-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)] z-20"
        style={{ left: `${ambulancePos.x}%`, top: `${ambulancePos.y}%` }}
      >
        <span className="text-xs font-bold">🚑</span>
      </div>

      {/* Hospital Markers */}
      {hospitals.map(hospital => {
        const pos = getPosition(hospital.location.lat, hospital.location.lng);
        const result = results.find(r => r.hospitalId === hospital.id);
        const isSelected = hospital.id === selectedHospitalId;
        
        let statusColor = 'bg-gray-500';
        let ringColor = 'border-gray-500';
        
        if (result) {
          if (showArrivalCast) {
             if (result.availabilityAtETA > 70) { statusColor = 'bg-green-500'; ringColor = 'border-green-500'; }
             else if (result.availabilityAtETA > 30) { statusColor = 'bg-yellow-500'; ringColor = 'border-yellow-500'; }
             else { statusColor = 'bg-red-500'; ringColor = 'border-red-500'; }
          } else {
             if (result.availabilityNow > 2) { statusColor = 'bg-green-500'; ringColor = 'border-green-500'; }
             else if (result.availabilityNow > 0) { statusColor = 'bg-yellow-500'; ringColor = 'border-yellow-500'; }
             else { statusColor = 'bg-red-500'; ringColor = 'border-red-500'; }
          }
        }

        return (
          <div 
            key={hospital.id}
            className={`absolute flex flex-col items-center transition-all duration-700 ${isSelected ? 'z-10 scale-110' : 'z-0 opacity-70 hover:opacity-100'}`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) ${isSelected ? 'scale(1.1)' : 'scale(1)'}` }}
          >
            <div className="relative">
              {/* Outer Ping */}
              {isSelected && (
                <div className={`absolute inset-0 rounded-full ${statusColor} animate-ping opacity-20`} style={{ margin: '-50%' }} />
              )}
              {/* Marker */}
              <div className={`w-6 h-6 rounded-full border-2 ${ringColor} ${statusColor} shadow-lg transition-colors duration-1000 flex items-center justify-center text-[10px] font-bold text-white`}>
                H
              </div>
            </div>
            
            <div className="mt-2 bg-background/90 border border-border px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg backdrop-blur-sm text-center">
              <div className="font-bold text-foreground">{hospital.name}</div>
              {result && (
                <div className={`mt-0.5 font-medium transition-all duration-500 ${
                  showArrivalCast 
                    ? result.availabilityAtETA > 50 ? 'text-green-400' : 'text-red-400'
                    : result.availabilityNow > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {showArrivalCast ? `${result.availabilityAtETA}% at ETA` : `${result.availabilityNow} beds now`}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}} />
    </div>
  );
}
