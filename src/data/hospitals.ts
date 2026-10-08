import { Hospital } from '../types';

export const mockHospitals: Hospital[] = [
  {
    id: 'h1',
    name: 'Apex Heart Institute',
    location: { lat: 40.7128, lng: -74.0060 },
    baseTravelTime: 18,
    capabilities: ['Cath Lab', 'Ventilator', 'Cardiac Emergency'],
    beds: [
      { type: 'CCU', total: 10, occupied: 9, expectedDischargesIn1Hr: 2, expectedArrivalsIn1Hr: 1, holds: 0 },
      { type: 'ICU', total: 20, occupied: 15, expectedDischargesIn1Hr: 3, expectedArrivalsIn1Hr: 2, holds: 0 }
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h2',
    name: 'CityCare Medical Center',
    location: { lat: 40.7282, lng: -73.7949 },
    baseTravelTime: 12,
    capabilities: ['Ventilator', 'Trauma', 'Cardiac Emergency'],
    beds: [
      { type: 'CCU', total: 8, occupied: 6, expectedDischargesIn1Hr: 0, expectedArrivalsIn1Hr: 3, holds: 0 },
      { type: 'ICU', total: 15, occupied: 14, expectedDischargesIn1Hr: 1, expectedArrivalsIn1Hr: 2, holds: 0 }
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h3',
    name: 'Metro Emergency Hospital',
    location: { lat: 40.7589, lng: -73.9851 },
    baseTravelTime: 25,
    capabilities: ['Cath Lab', 'Ventilator', 'ECMO', 'Cardiac Emergency', 'Trauma'],
    beds: [
      { type: 'CCU', total: 12, occupied: 9, expectedDischargesIn1Hr: 1, expectedArrivalsIn1Hr: 0, holds: 0 },
      { type: 'ICU', total: 30, occupied: 25, expectedDischargesIn1Hr: 4, expectedArrivalsIn1Hr: 3, holds: 1 }
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h4',
    name: 'LifeBridge Hospital',
    location: { lat: 40.6782, lng: -73.9442 },
    baseTravelTime: 32,
    capabilities: ['Ventilator', 'Pediatric', 'Trauma'],
    beds: [
      { type: 'CCU', total: 5, occupied: 5, expectedDischargesIn1Hr: 0, expectedArrivalsIn1Hr: 0, holds: 0 },
      { type: 'ICU', total: 12, occupied: 8, expectedDischargesIn1Hr: 2, expectedArrivalsIn1Hr: 1, holds: 0 },
      { type: 'Pediatric', total: 15, occupied: 10, expectedDischargesIn1Hr: 1, expectedArrivalsIn1Hr: 0, holds: 0 }
    ],
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'h5',
    name: 'PrimeCare Hospital',
    location: { lat: 40.8090, lng: -73.9623 },
    baseTravelTime: 20,
    capabilities: ['Cath Lab', 'Ventilator', 'Cardiac Emergency'],
    beds: [
      { type: 'CCU', total: 15, occupied: 14, expectedDischargesIn1Hr: 1, expectedArrivalsIn1Hr: 1, holds: 0 },
      { type: 'ICU', total: 25, occupied: 22, expectedDischargesIn1Hr: 3, expectedArrivalsIn1Hr: 2, holds: 0 }
    ],
    lastUpdated: new Date().toISOString(),
  }
];
