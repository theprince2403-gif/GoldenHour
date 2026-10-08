import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight, Activity, TrendingUp, Clock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded bg-primary flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">GoldenHour</span>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold hover:text-primary transition-colors">
          View Live Network
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 relative mt-12 mb-24">
        
        {/* Synthetic Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-sm font-medium mb-8 border border-border text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
          Real-time capacity forecasting
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter max-w-4xl leading-[1.1] mb-6">
          Don&apos;t send patients to where the bed <span className="text-primary italic">WAS.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          GoldenHour predicts where the right capacity will still be available when the ambulance arrives.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-4 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-primary/25"
          >
            START EMERGENCY REFERRAL
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link 
            href="/dashboard"
            className="bg-secondary hover:bg-secondary/80 text-foreground font-semibold text-lg px-8 py-4 rounded-xl flex items-center justify-center transition-all border border-border"
          >
            VIEW LIVE NETWORK
          </Link>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[30px] group-hover:bg-blue-500/20 transition-all" />
            <Activity className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">Simulated Forecasting</h3>
            <p className="text-muted-foreground">Models expected discharges and arrivals to predict true availability at ETA.</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[30px] group-hover:bg-green-500/20 transition-all" />
            <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Explainable Ranking</h3>
            <p className="text-muted-foreground">Transparent scoring based on capability match, travel time, and forecasted beds.</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[30px] group-hover:bg-yellow-500/20 transition-all" />
            <Clock className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Pre-Alert & Hold</h3>
            <p className="text-muted-foreground">Instantly secure a simulated bed hold at the recommended destination.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
