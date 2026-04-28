
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { signInAnonymously } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Loader2, ChevronLeft, Heart, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Access Sanctuary (Auth) Page.
 * Restored Awareness login logic with explicit Staff button.
 */

const CONTENT = {
  en: {
    welcome: "Welcome Home Soul", create: "Create Sanctuary Soul", prototype: "Prototype Mode Active",
    emailLabel: "Email Address", emailPlaceholder: "soul@stayonbeat.com",
    passwordLabel: "Password", passwordPlaceholder: "••••••••",
    entering: "Entering...", begin: "Begin Journey Now", enter: "Enter Sanctuary Now",
    alreadyAccount: "Already have an account? Sign In", newHere: "New here? Join the circle",
    staffAccess: "Awareness Staff Access", errorMsg: "Sanctuary is calibrating",
    footer: "Created in harmony"
  },
  de: {
    welcome: "Willkommen Zuhause heute hier", create: "Soll ich Sanctuary erstellen", prototype: "Prototyp Modus Aktiv jetzt",
    emailLabel: "E-Mail-Adresse", emailPlaceholder: "seele@stayonbeat.com",
    passwordLabel: "Passwort", passwordPlaceholder: "••••••••",
    entering: "Eintritt...", begin: "Reise beginnen heute hier", enter: "Sanctuary betreten heute hier",
    alreadyAccount: "Bereits ein Konto? Anmelden", newHere: "Neu hier? Werde Teil des Kreises",
    staffAccess: "Awareness Team Zugang", errorMsg: "Das Sanctuary kalibriert gerade",
    footer: "In Harmonie erschaffen hier"
  }
};

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const db = useFirestore();
  
  const mode = searchParams.get("mode") || "signin";
  const isSignUp = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userEmail = email.toLowerCase().trim();
      
      // Awareness Team Login Logic
      if (userEmail === 'awareness@love.com') {
        const cred = await signInAnonymously(auth);
        router.push("/awareness");
        return;
      }

      const cred = await signInAnonymously(auth);
      const userName = userEmail.split("@")[0].toUpperCase();

      setDocumentNonBlocking(
        doc(db, "users", cred.user.uid), 
        {
          uid: cred.user.uid,
          email: userEmail || "soul@stayonbeat.app",
          name: userName,
          createdAt: serverTimestamp(),
          trustLevel: isSignUp ? "unverified" : "verified_adult"
        },
        { merge: true }
      );

      if (isSignUp) router.push("/onboarding");
      else router.push("/session-check-in");
    } catch (err: any) {
      setError(t.errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-[#0a0a0a] p-10 rounded-[3rem] border border-white/10 relative z-10 shadow-2xl shadow-primary/5">
        <button onClick={() => router.push("/")} className="absolute top-8 left-8 text-white/40 hover:text-primary transition-colors p-2"><ChevronLeft size={24} /></button>
        
        <div className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(27,77,62,0.1)]">
            <Heart 
              size={40} 
              fill="#10B981" 
              className="text-[#10B981] animate-pulse-heart" 
              style={{ filter: 'blur(12px) drop-shadow(0 0 8px #10B981)' }} 
            />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">{isSignUp ? t.create : t.welcome}</h1>
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">{t.prototype}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2">{t.emailLabel}</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-primary outline-none transition-all font-bold" placeholder={t.emailPlaceholder} required />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2">{t.passwordLabel}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-16 px-8 rounded-2xl border-2 border-white/5 bg-white/5 text-white placeholder:text-white/10 focus:border-primary outline-none transition-all font-bold" placeholder={t.passwordPlaceholder} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 hover:text-primary">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {error && <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-2xl text-red-500 text-[10px] text-center font-black uppercase tracking-widest">{error}</div>}
          <button type="submit" disabled={isLoading} className={cn("w-full h-20 bg-[#1b4d3e] text-white rounded-2xl font-black text-lg uppercase tracking-[0.1em] shadow-lg shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4", isLoading && "opacity-50 cursor-not-allowed")}>{isLoading ? <><Loader2 size={24} className="animate-spin" /><span>{t.entering}</span></> : <span className="flex items-center gap-3">{isSignUp ? t.begin : t.enter}</span>}</button>
        </form>

        <div className="mt-8 space-y-4">
          <button onClick={() => router.push(isSignUp ? "/auth?mode=signin" : "/auth?mode=signup")} className="w-full text-[9px] font-black text-white/20 hover:text-primary transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2">{isSignUp ? t.alreadyAccount : t.newHere}</button>
          
          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={() => { setEmail('awareness@love.com'); setPassword('staff'); }}
              className="w-full py-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600/20 transition-all"
            >
              <ShieldAlert size={14} />
              {t.staffAccess}
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5"><p className="text-center text-[10px] uppercase tracking-[0.5em] font-black shining-white">{t.footer}</p></div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#10B981" 
            className="relative z-10 animate-pulse-heart text-[#10B981]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px #10B981)' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
