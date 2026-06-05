
'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, ShieldCheck, Loader2, Heart, CircleDot } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Party Circle Chat.
 * Framing: I love and respect the circle. We connect with kindness.
 */

const ADJECTIVES = ['Radiant', 'Harmony', 'Calm', 'Glowing', 'Golden', 'Cosmic', 'Vibrant', 'Velvet'];
const NOUNS = ['Heart', 'Beat', 'Echo', 'Pulse', 'Light', 'Rhythm', 'Radiance'];

export function CommunityChat() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [partyAlias, setPartyAlias] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    setPartyAlias(`${adj} ${noun}`);
  }, []);

  const chatQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'globalChat'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user || !firestore) return;
    const text = input.trim();
    setInput('');
    addDocumentNonBlocking(collection(firestore, 'globalChat'), {
      senderId: user.uid,
      senderAlias: partyAlias,
      text: text,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="flex flex-col h-full bg-black font-body">
      <div className="px-8 py-8 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#3EB489]/20 rounded-full flex items-center justify-center border border-[#3EB489]/30">
            <Heart className="w-6 h-6 text-[#3EB489]" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-[20px] font-black uppercase tracking-tight">Party Circle</h2>
            <p className="text-[9px] text-[#3EB489] font-black uppercase tracking-[0.2em]">Connected with Love</p>
          </div>
        </div>
      </div>

      <div className="bg-[#3EB489]/5 border-b border-[#3EB489]/10 px-8 py-4 flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-[#3EB489]" />
        <p className="text-[10px] font-bold text-[#3EB489] uppercase tracking-widest leading-none">
          I love and respect my privacy. You are chatting as <span className="underline">{partyAlias}</span>
        </p>
      </div>

      <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
        <div className="space-y-6 max-w-2xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#3EB489] animate-spin" />
            </div>
          )}
          
          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-24 opacity-20 space-y-4">
              <CircleDot className="w-12 h-12 mx-auto" />
              <p className="text-xs uppercase font-black tracking-widest leading-relaxed">
                I love, accept and respect <br/> myself and this circle
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-2", isMe ? "items-end" : "items-start")}>
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest px-2">
                  {isMe ? 'Me' : msg.senderAlias}
                </span>
                <div className={cn(
                  "p-5 rounded-[2rem] text-sm font-bold leading-relaxed max-w-[85%] shadow-lg border transition-all",
                  isMe 
                    ? "bg-[#3EB489] text-black border-[#3EB489] rounded-tr-none" 
                    : "bg-white/5 text-white border-white/10 rounded-tl-none"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-6 py-10 bg-black border-t border-white/5">
        <div className="relative flex items-center max-w-2xl mx-auto gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share kindness with the circle..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full py-6 px-10 text-base font-bold focus:border-[#3EB489] transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-6 bg-[#3EB489] text-black rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(62,180,137,0.4)]"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        <p className="text-center text-[8px] text-white/20 uppercase tracking-[0.5em] mt-6 font-black">
          Encrypted Space • Protected with Love
        </p>
      </div>
    </div>
  );
}
