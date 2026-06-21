

import { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  MapPin, 
  Activity, 
  Beaker, 
  ShieldAlert, 
  CheckCircle2, 
  History, 
  Users, 
  PhoneCall, 
  Watch,
  Navigation,
  Target,
  LocateFixed
} from 'lucide-react';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';

const INITIAL_ALERTS = [
  { 
    id: '1', 
    user: 'NIGHTOWL_88', 
    location: 'Main stage • Sector 4', 
    substances: 'MDMA (150mg), Alcohol', 
    physical: { age: 24, weight: '72kg', height: '178cm' },
    health: ['SSRI medication', 'Mild asthma'],
    vitals: { bpm: 118, o2: '96%', device: 'Apple Watch' },
    time: '2m ago',
    coords: '52.5200° N, 13.4050° E',
    accuracy: '±3m'
  },
  { 
    id: '2', 
    user: 'LUNA_BEAT', 
    location: 'Outdoor lounge • North', 
    substances: 'Ketamine, Cannabis', 
    physical: { age: 22, weight: '65kg', height: '170cm' },
    health: ['No chronic conditions'],
    vitals: null,
    time: '5m ago',
    coords: '52.5210° N, 13.4060° E',
    accuracy: '±8m'
  },
];

export default function AwarenessDashboard() {
  const [activeAlerts, setActiveAlerts] = useState(INITIAL_ALERTS);
  const [resolvedAlerts, setResolvedAlerts] = useState<any[]>([]);

  const handleResolve = (id: string) => {
    const alertToResolve = activeAlerts.find(a => a.id === id);
    if (alertToResolve) {
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
      setResolvedAlerts(prev => [
        { 
          ...alertToResolve, 
          resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }, 
        ...prev
      ]);
    }
  };

  return (
    <main className="min-h-screen bg-card text-white font-headline pb-32">
      {/* Care Hub Header */}
      <div className="bg-card/90 backdrop-blur-2xl border-b border-red-600/20 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="p-3 bg-card/5 rounded-full border border-border/10">
              <ArrowLeft className="w-5 h-5 text-white/40" />
            </Link>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-600/30 rounded-full">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Watching with Love</span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">The Care Hub</h1>
          </div>
        </div>
      </div>

      <div className="px-6 py-10 max-xl mx-auto space-y-12">
        {/* Active Emergency Alerts Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-red-600" /> Active alerts ({activeAlerts.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto w-full">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <div key={alert.id} className="bg-card border-2 border-red-600 rounded-[2.5rem] p-8 shadow-[0_0_40px_rgba(220,38,38,0.15)] animate-in slide-in-from-bottom-4 duration-500">
                  <div className="space-y-8">
                    {/* Header: Identity & Time */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-4xl font-black uppercase tracking-tighter">{alert.user}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] font-black bg-red-600 text-white px-3 py-1 rounded-full uppercase">{alert.time}</span>
                          <span className="text-[9px] font-black border border-border/10 text-white/40 px-3 py-1 rounded-full uppercase">ID: {alert.id}</span>
                        </div>
                      </div>
                      <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/30">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                      </div>
                    </div>

                    {/* Navigation & Location Card */}
                    <div className="bg-red-600/5 border-2 border-red-600/20 rounded-[2rem] p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MapPin className="text-red-500 w-5 h-5" />
                          <span className="text-lg font-black uppercase tracking-tight text-white">{alert.location}</span>
                        </div>
                        <span className="text-[8px] font-black text-red-500/60 uppercase tracking-widest">{alert.accuracy} GPS Accuracy</span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 bg-card/40 rounded-xl p-4 border border-border/5 w-full">
                          <span className="block text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Tactical Grid</span>
                          <span className="font-mono text-xs text-red-400 font-bold">{alert.coords}</span>
                        </div>
                        <button className="w-full sm:w-auto h-14 px-8 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-red-600/20">
                          <Navigation className="w-4 h-4" /> Walk with Care
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card/5 p-4 rounded-2xl border border-border/5 space-y-1">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                          <Beaker className="w-3 h-3 text-orange-500" /> Intake
                        </span>
                        <p className="text-xs font-bold text-red-400 leading-tight uppercase">{alert.substances}</p>
                      </div>
                      <div className="bg-card/5 p-4 rounded-2xl border border-border/5 space-y-1">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-blue-500" /> Biometrics
                        </span>
                        <p className="text-xs font-bold text-white leading-tight uppercase">{alert.physical.age}y • {alert.physical.weight}</p>
                      </div>
                    </div>

                    {alert.vitals && (
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Watch className="w-4 h-4 text-blue-400" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">{alert.vitals.device} Linked</span>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col items-end">
                            <span className="text-[7px] font-bold text-white/40 uppercase">Heart Rate</span>
                            <span className="text-xs font-black text-white">{alert.vitals.bpm} BPM</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[7px] font-bold text-white/40 uppercase">SPO2</span>
                            <span className="text-xs font-black text-white">{alert.vitals.o2}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl space-y-2">
                      <span className="text-[8px] font-black text-red-500/60 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldAlert className="w-3 h-3" /> Medical warnings
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {alert.health.map(h => (
                          <span key={h} className="text-[9px] font-black text-white px-2 py-0.5 bg-red-600/20 rounded-md border border-red-600/30 uppercase">{h}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button className="bg-card text-black font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl active:scale-95 transition-all">
                        Assign care
                      </button>
                      <button 
                        onClick={() => handleResolve(alert.id)}
                        className="bg-red-600 text-white font-black uppercase text-[10px] tracking-widest py-5 rounded-2xl active:scale-95 transition-all shadow-lg"
                      >
                        Mark at peace
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border/5 rounded-[3rem] opacity-40">
                <CheckCircle2 className="w-12 h-12 text-secondary mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">All clear</p>
                <p className="text-[8px] font-bold uppercase tracking-widest mt-1">No active support requests</p>
              </div>
            )}
          </div>
        </section>

        {/* Resolved Case History */}
        {resolvedAlerts.length > 0 && (
          <section className="space-y-6 pt-10 border-t border-border/5">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 flex items-center gap-3 px-2">
              <History className="w-4 h-4" /> Resolved history
            </h2>
            <div className="grid gap-3">
              {resolvedAlerts.map((alert, i) => (
                <div key={i} className="bg-card/5 border border-border/10 rounded-2xl p-5 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white">{alert.user}</p>
                      <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">At peace since {alert.resolvedAt} • {alert.location}</p>
                    </div>
                  </div>
                  <button className="text-[8px] font-black text-white/40 uppercase tracking-widest px-4 py-2 border border-border/10 rounded-full">Archive</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Persistent Care Hub Navbar */}
      <footer className="fixed bottom-0 left-0 right-0 h-[90px] bg-card border-t border-border/10 px-8 flex items-center justify-between z-[100]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/30">
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-white">Holder: Care Hub A</p>
            <p className="text-[8px] font-bold text-secondary uppercase tracking-widest">Watching with Love</p>
          </div>
        </div>
        <button className="p-4 bg-card/5 rounded-2xl border border-border/10">
          <PhoneCall className="w-5 h-5 text-white/40" />
        </button>
      </footer>
    </main>
  );
}
