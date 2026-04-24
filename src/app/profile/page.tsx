"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  useAuth, 
  useFirestore, 
  useUser, 
  useDoc, 
  useMemoFirebase, 
  updateDocumentNonBlocking 
} from "@/firebase";
import { doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  Heart, 
  User, 
  Shield, 
  Bell, 
  ArrowLeft, 
  CheckCircle2, 
  Leaf,
  Lock,
  ChevronRight,
  ShieldCheck,
  HelpCircle,
  Sprout
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoCreation } from "@/components/dashboard/CoCreation";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Sanctuary (Profile Page).
 * Purified language: removed "my" / "meine".
 */

const CONTENT = {
  en: {
    sanctuary: "Sanctuary", entering: "Entering sanctuary", reflection: "Profile reflects light",
    greeting: "Existence is exactly here", essence: "The Essence", name: "Username",
    weight: "Weight (kg)", height: "Height (cm)", circle: "Circle of Love", trusted: "Trusted Bonds",
    resonant: "Resonant contacts", reminders: "Heart Reminders", checkins: "Check-ins are active",
    journey: "Resonance is sovereign High-fidelity encryption ensures the sanctuary remains private and the soul free",
    promise: "Bonds of Trust", logout: "Step away now",
    coCreationTitle: "Shape the Sanctuary",
    coCreationSub: "The voice shapes this space",
    footer: "Created in harmony",
    privacy: {
      title: "Freedom & Trust",
      sovereignty: "Data Sovereignty",
      sovereigntyDesc: "Privacy is respected Data is sovereign StayOnBeat is built on the principle that the personal journey is a sacred trust",
      encryption: "High-Fidelity Encryption",
      encryptionDesc: "All biometric signals health profiles and location logs are protected by high-fidelity encryption Sensitive information is visible only to chosen bonds",
      freedom: "Inner Freedom",
      freedomDesc: "Data is never sold or traded Resonance remains within the sanctuary Pure support love care and harm reduction",
      acceptance: "Unconditional Acceptance",
      acceptanceDesc: "Only information necessary for protection is collected Every data point calibrates protection and nurtures well-being",
      questions: "Have more questions?", qBtn: "Questions?", footer: "Created in harmony"
    }
  },
  de: {
    sanctuary: "Sanctuary", entering: "Eintritt...", reflection: "Profil spiegelt Licht heute",
    greeting: "Existenz ist genau hier", essence: "Die Essenz heute", name: "Benutzername",
    weight: "Gewicht (kg)", height: "Größe (cm)", circle: "Circle of Love", trusted: "Vertrauenswürdige Bindungen",
    resonant: "Resonante Kontakte", reminders: "Heart Reminders", checkins: "Tägliche Check-ins aktiv",
    journey: "Resonanz ist souverän heute High-Fidelity-Verschlüsselung stellt sicher dass das Sanctuary privat bleibt",
    promise: "Bindungen des Vertrauens", logout: "Jetzt heraustreten hier",
    coCreationTitle: "Sanctuary gestalten heute",
    coCreationSub: "Die Stimme zählt heute",
    footer: "In Harmonie erschaffen heute hier",
    privacy: {
      title: "Freiheit & Vertrauen",
      sovereignty: "Datensouveränität",
      sovereigntyDesc: "Privatsphäre wird geachtet heute Daten sind souverän heute StayOnBeat baut auf dem Prinzip der persönlichen Souveränität auf",
      encryption: "High-Fidelity-Verschlüsselung",
      encryptionDesc: "Alle biometrischen Signale Gesundheitsprofile und Standortprotokolle sind geschützt Informationen sind nur für Vertraute sichtbar",
      freedom: "Innere Freiheit heute",
      freedomDesc: "Daten werden niemals verkauft Die Resonanz bleibt im Sanctuary Reine Unterstützung Liebe Fürsorge und Schadensminimierung",
      acceptance: "Bedingungslose Akzeptanz",
      acceptanceDesc: "Nur notwendige Informationen werden gesammelt Jeder Datenpunkt kalibriert den Schutz und fördert Wohlbefinden",
      questions: "Hast du noch Fragen?", qBtn: "Fragen?", footer: "In Harmonie erschaffen heute hier"
    }
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [successMessage, setSuccessMessage] = useState("");
  const [mounted, setMounted] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace("/auth");
    });
    return () => unsubscribe();
  }, [auth, router]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading } = useDoc(userDocRef);
  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleUpdate = (updates: any) => {
    if (!user || !firestore || !userDocRef) return;
    updateDocumentNonBlocking(userDocRef, updates);
    setSuccessMessage(t.reflection);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!mounted || isUserLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
            <Heart size={64} fill="currentColor" className="relative z-10 animate-pulse-heart text-primary" style={{ filter: 'blur(12px)' }} />
          </div>
          <p className="text-primary font-black uppercase tracking-[0.4em] text-xs">{t.entering}</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.name || "VALUED SOUL";

  return (
    <main className="min-h-screen bg-black text-white font-headline pb-32 pt-safe">
      <nav className="bg-black/90 backdrop-blur-2xl border-b border-white/5 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all"><ArrowLeft size={20} /></button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{t.sanctuary}</span>
          </div>
        </div>
      </nav>

      <div className="px-6 py-10 max-xl mx-auto space-y-10">
        <section className="text-center space-y-6">
          <div className="relative inline-block">
            <div className="w-28 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border-2 border-white/10 shadow-2xl relative overflow-hidden group">
              <User size={48} className="text-white/20 group-hover:text-primary transition-colors" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{displayName}</h2>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{t.greeting}</p>
          </div>
        </section>

        {successMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-primary text-black px-6 py-3 rounded-full flex items-center gap-3 animate-in slide-in-from-top-4 duration-500 shadow-2xl font-black uppercase text-[10px] tracking-widest">
            <CheckCircle2 size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3"><Leaf size={14} className="text-primary" /> {t.essence}</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-primary tracking-widest ml-1">{t.name}</label>
                <input type="text" defaultValue={profile?.name} onBlur={(e) => handleUpdate({ name: e.target.value.toUpperCase() })} className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none transition-all text-xl font-black uppercase placeholder:text-white/10" placeholder="ENTER NAME" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-primary tracking-widest ml-1">{t.weight}</label>
                  <input type="number" defaultValue={profile?.biometrics?.weightKg} onBlur={(e) => handleUpdate({ "biometrics.weightKg": Number(e.target.value) })} className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-xl font-black" placeholder="70" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-primary tracking-widest ml-1">{t.height}</label>
                  <input type="number" defaultValue={profile?.biometrics?.heightCm} onBlur={(e) => handleUpdate({ "biometrics.heightCm": Number(e.target.value) })} className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl focus:border-primary outline-none text-xl font-black" placeholder="175" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-8 space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3"><Shield size={14} className="text-primary" /> {t.circle}</h3>
            <button onClick={() => router.push("/safety-network")} className="w-full flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform"><Heart size={24} className="text-primary" /></div>
                <div className="text-left"><span className="block font-black text-sm uppercase tracking-tight">{t.trusted}</span><span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{t.resonant}</span></div>
              </div>
              <ChevronRight size={16} className="text-white/20 group-hover:text-primary" />
            </button>
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl"><Bell size={24} className="text-blue-400" /></div>
                <div className="text-left"><span className="block font-black text-sm uppercase tracking-tight">{t.reminders}</span><span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">{t.checkins}</span></div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"><div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" /></div>
            </div>
          </div>

          {/* Co-Creation Promotion */}
          <button 
            onClick={() => setCoCreationOpen(true)}
            className="w-full p-8 rounded-[2rem] bg-primary/5 border-2 border-primary/20 hover:border-primary transition-all group relative overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <Sprout size={80} className="text-primary" />
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/20 rounded-xl border border-primary/30"><Sprout size={24} className="text-primary" /></div>
                <h3 className="text-xl font-black uppercase tracking-tight">{t.coCreationTitle}</h3>
              </div>
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest max-w-[200px] leading-relaxed">{t.coCreationSub}</p>
            </div>
          </button>

          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-8 text-center space-y-6">
             <div className="flex justify-center"><Lock size={24} className="text-white/10" /></div>
             <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">{t.journey}</p>
             <button onClick={() => setPrivacyOpen(true)} className="text-[8px] font-black text-primary uppercase tracking-[0.3em] hover:underline underline-offset-8">{t.promise}</button>
          </div>

          <button onClick={() => auth.signOut().then(() => router.push("/"))} className="w-full py-6 bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black uppercase tracking-[0.4em] hover:bg-red-600/20 rounded-[2rem] transition-all">{t.logout}</button>
        </div>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">{t.footer}</p>
        </footer>
      </div>

      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="bg-[#050505] border-white/10 max-lg p-0 rounded-[2rem] overflow-hidden flex flex-col font-headline h-[90vh] max-h-[90vh] pb-safe">
          <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
          <div className="p-8 pb-4 shrink-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20"><ShieldCheck size={32} className="text-primary" /></div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white">{t.privacy.title}</DialogTitle>
            </div>
          </div>
          <ScrollArea className="flex-1 px-8 pb-6 touch-pan-y">
            <div className="space-y-8">
              <section className="space-y-3"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.privacy.sovereignty}</h4><p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.privacy.sovereigntyDesc}</p></section>
              <section className="space-y-3"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.privacy.encryption}</h4><p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.privacy.encryptionDesc}</p></section>
              <section className="space-y-3"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.privacy.freedom}</h4><p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.privacy.freedomDesc}</p></section>
              <section className="space-y-3"><h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.privacy.acceptance}</h4><p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.privacy.acceptanceDesc}</p></section>
              <section className="pt-10 border-t border-white/5 text-center space-y-6 pb-8">
                <div className="flex flex-col items-center gap-2"><p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{t.privacy.questions}</p><button onClick={() => { setPrivacyOpen(false); setCoCreationOpen(true); }} className="flex items-center gap-3 bg-primary/10 border border-primary/20 px-8 py-4 rounded-2xl text-[10px] font-black text-primary uppercase tracking-[0.4em] hover:bg-primary/20 transition-all active:scale-95"><HelpCircle size={14} /> {t.privacy.qBtn}</button></div>
                <p className="text-[8px] font-black uppercase tracking-[0.5em] shining-white">{t.privacy.footer}</p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[2rem] overflow-hidden h-[85dvh]">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>
    </main>
  );
}