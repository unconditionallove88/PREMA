'use client';

import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { ShieldAlert, AlertCircle, User, Clock, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SupportConsole() {
  const firestore = useFirestore();

  const logsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'moderation_logs'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
  }, [firestore]);

  const { data: logs, isLoading } = useCollection(logsQuery);

  return (
    <div className="min-h-screen bg-card text-white font-headline pb-20">
      <div className="bg-zinc-900 border-b border-border/10 p-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-card/5 rounded-full">
              <ArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Support Console</h1>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Moderation & Safety Monitoring</p>
            </div>
          </div>
          <div className="px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-full">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Live Feed
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {logs?.map((log) => (
              <div 
                key={log.id} 
                className={cn(
                  "bg-zinc-900/50 border rounded-2xl p-6 transition-all hover:bg-zinc-900",
                  log.type === 'AI_FLAGGED' ? "border-red-900/30" : "border-amber-900/30"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      log.type === 'AI_FLAGGED' ? "bg-red-600/20 text-red-500" : "bg-amber-600/20 text-amber-500"
                    )}>
                      {log.type === 'AI_FLAGGED' ? <ShieldAlert size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm uppercase">{log.userAlias}</span>
                        <span className="text-[10px] text-white/40 font-bold uppercase">ID: {log.userId.slice(0, 8)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <Clock size={12} />
                        <span className="text-[10px]">{new Date(log.timestamp?.toDate()).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase border",
                    log.type === 'AI_FLAGGED' ? "border-red-500 text-red-500" : "border-amber-500 text-amber-500"
                  )}>
                    {log.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-card/40 rounded-xl p-4 border border-border/5">
                  <div className="flex items-center gap-2 mb-2 text-white/40">
                    <MessageSquare size={14} />
                    <span className="text-[10px] font-bold uppercase">Offending Content:</span>
                  </div>
                  <p className="text-white/90 text-sm font-medium italic">"{log.content}"</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-black text-white/40 uppercase">Reason:</span>
                  <span className="text-[10px] font-bold text-red-400 uppercase">{log.reason}</span>
                </div>
              </div>
            ))}

            {logs?.length === 0 && (
              <div className="text-center py-20 opacity-20">
                <CheckCircle2 size={48} className="mx-auto mb-4" />
                <p className="font-black uppercase tracking-widest">No violations detected</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
