

import { useLocation, useSearch } from "wouter";
import { useState, useEffect, Suspense } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { signInAnonymously } from "firebase/auth";
import { doc, serverTimestamp } from "firebase/firestore";
import { Eye, EyeOff, Loader2, ChevronLeft, Heart, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";


const CONTENT = {
  en: {
    welcome: "Welcome to Prema", create: "Enter", prototype: "Prototype Mode Active",
    emailLabel: "Email Address", emailPlaceholder: "you@prema.app",
    passwordLabel: "Password", passwordPlaceholder: "••••••••",
    entering: "Opening Prema...", begin: "Enter", enter: "Enter",
    alreadyAccount: "Already have an account? Sign in", newHere: "New here? Start your journey",
    staffAccess: "Staff Access", errorMsg: "Something went wrong. Please try again",
    footer: "Created in harmony"
  },
  de: {
    welcome: "Willkommen bei Prema", create: "Enter", prototype: "Prototyp-Modus aktiv",
    emailLabel: "E-Mail-Adresse", emailPlaceholder: "du@prema.app",
    passwordLabel: "Passwort", passwordPlaceholder: "••••••••",
    entering: "Prema wird geöffnet...", begin: "Enter", enter: "Enter",
    alreadyAccount: "Hast du bereits ein Konto? Anmelden", newHere: "Neu hier? Starte deine Reise",
    staffAccess: "Team-Zugang", errorMsg: "Etwas ist schiefgelaufen. Bitte versuche es erneut",
    footer: "Mit Anmut geschaffen"
  }
};

function AuthContent() {
  const [, setLocation] = useLocation();
  const search = useSearch(); const searchParams = new URLSearchParams(search);
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('prema-theme') as 'light' | 'dark' | null;
    const nextTheme = savedTheme === 'dark' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const handleThemeChange = (nextTheme: 'light' | 'dark') => {
    setTheme(nextTheme);
    localStorage.setItem('prema-theme', nextTheme);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#F5B38B" 
            className="relative z-10 animate-pulse-heart text-[#F5B38B]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px rgba(245,179,141,0.55))' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const userEmail = email.toLowerCase().trim();
      
      if (userEmail === 'awareness@love.com') {
        await signInAnonymously(auth);
        setLocation("/awareness");
        return;
      }

      const cred = await signInAnonymously(auth);
      const userName = userEmail.split("@")[0].toUpperCase();

      setDocumentNonBlocking(
        doc(db, "users", cred.user.uid), 
        {
          uid: cred.user.uid,
          email: userEmail || "you@prema.app",
          name: userName,
          createdAt: serverTimestamp(),
          trustLevel: isSignUp ? "unverified" : "verified_adult"
        },
        { merge: true }
      );

      if (isSignUp) setLocation("/onboarding");
      else setLocation("/session-check-in");
    } catch (err: any) {
      setError(t.errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-6 font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-card p-10 rounded-[2.5rem] border border-border relative z-10 shadow-soft">
        <button onClick={() => setLocation("/")} className="absolute top-8 left-8 text-muted-foreground hover:text-primary transition-colors p-2"><ChevronLeft size={24} /></button>
        
        <div className="text-center mb-10 mt-4">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(245,169,133,0.16)]">
            <Heart 
              size={40} 
              fill="#F5B38B" 
              className="text-[#F5B38B] animate-pulse-heart" 
              style={{ filter: 'blur(12px) drop-shadow(0 0 8px rgba(245,179,141,0.45))' }} 
            />
          </div>
          <h1 className="text-4xl font-semibold text-foreground tracking-normal uppercase leading-none mb-2">{isSignUp ? t.create : t.welcome}</h1>
          <p className="text-primary text-[10px] font-semibold uppercase tracking-[0.4em]">{t.prototype}</p>
        </div>

        <div className="mb-6 flex items-center justify-between gap-3 rounded-full border border-border bg-popover/70 px-4 py-3 backdrop-blur-md">
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-[0.35em] text-muted-foreground">Choose vibe</p>
            <p className="text-[11px] text-foreground/80"></p>
          </div>
          <div className="inline-flex rounded-full bg-background/90 p-1 border border-border">
            {(['light', 'dark'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleThemeChange(option)}
                className={cn(
                  'px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] rounded-full transition-all',
                  theme === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {option === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2">{t.emailLabel}</label>
            <input 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full h-16 px-8 rounded-2xl border-2 border-border bg-popover text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-all font-semibold" 
              placeholder={t.emailPlaceholder} 
              required 
              suppressHydrationWarning
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-primary ml-2">{t.passwordLabel}</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full h-16 px-8 rounded-2xl border-2 border-border bg-popover text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-all font-semibold" 
                placeholder={t.passwordPlaceholder} 
                required 
                suppressHydrationWarning
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
            </div>
          </div>
          {error && <div className="p-4 bg-destructive/15 border border-destructive/30 rounded-2xl text-destructive text-[10px] text-center font-semibold uppercase tracking-widest">{error}</div>}
          <button type="submit" disabled={isLoading} className={cn("w-full h-20 bg-primary text-primary-foreground rounded-2xl font-semibold text-lg uppercase tracking-[0.1em] shadow-soft transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4", isLoading && "opacity-50 cursor-not-allowed")}>{isLoading ? <><Loader2 size={24} className="animate-spin" /><span>{t.entering}</span></> : <span className="flex items-center gap-3">{isSignUp ? t.begin : t.enter}</span>}</button>
        </form>

        <div className="mt-8 space-y-4">
          <button onClick={() => setLocation("/auth?mode=signin")} className="w-full text-[9px] font-semibold text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.4em] flex items-center justify-center gap-2">{isSignUp ? t.alreadyAccount : t.newHere}</button>
          
          <div className="pt-6 border-t border-border">
            <button 
              onClick={() => { setEmail('awareness@love.com'); setPassword('staff'); }}
              className="w-full py-4 bg-destructive/15 border border-destructive/30 rounded-xl text-destructive text-[9px] font-semibold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-destructive/20 transition-all"
            >
              <ShieldAlert size={14} />
              {t.staffAccess}
            </button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border"><p className="text-center text-[10px] uppercase tracking-[0.5em] font-semibold text-muted-foreground">{t.footer}</p></div>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart 
            size={64} 
            fill="#F5B38B" 
            className="relative z-10 animate-pulse-heart text-[#F5B38B]" 
            style={{ filter: 'blur(12px) drop-shadow(0 0 10px rgba(245,179,141,0.55))' }} 
          />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
