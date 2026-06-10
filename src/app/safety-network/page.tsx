
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  useFirestore, 
  useUser, 
  useCollection, 
  useDoc,
  useMemoFirebase,
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking
} from "@/firebase";
import { collection, serverTimestamp, doc } from "firebase/firestore";
import { 
  Heart, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  User, 
  Loader2, 
  Lock, 
  ShieldCheck,
  UserPlus,
  HeartHandshake,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Circle of Love (Trusted Bonds) Page.
 * Hydration-hardened for localized safety network management.
 */

const RELATIONSHIP_OPTIONS = [
  "Best Friend",
  "Partner",
  "Sister",
  "Brother",
  "Parent",
  "Trusted Friend",
];

const CONTENT = {
  en: {
    back: "BACK",
    title: "Circle of Love",
    header: "Who holds you?",
    sub: "Add people who love you unconditionally We alert them if resonance is needed",
    guardians: "Your Trusted Bonds",
    slots: (count: number) => `${count}/5 Bonds`,
    empty: "Your circle is open",
    add: "Add someone who loves you",
    newTitle: "New Trusted Bond",
    save: "Save Bond",
    seal: "Seal Code 🔒",
    activeCode: (code: string) => `Active Code: ${code}`,
    footer: "Bonds are private and encrypted",
    created: "Created in harmony"
  },
  de: {
    back: "ZURÜCK",
    title: "Circle of Love",
    header: "Wer hält dich heute?",
    sub: "Füge Menschen hinzu die dich lieben Wir informieren sie bei Bedarf heute",
    guardians: "Deine vertrauten Bindungen heute",
    slots: (count: number) => `${count}/5 Bindungen heute`,
    empty: "Dein Circle ist offen",
    add: "Jemanden der dich liebt",
    newTitle: "Neue vertraute Bindung heute",
    save: "Bindung jetzt speichern heute",
    seal: "Wort jetzt versiegeln heute 🔒",
    activeCode: (code: string) => `Aktives Wort: ${code}`,
    footer: "Bindungen sind privat geschützt heute",
    created: "In Harmonie erschaffen heute hier"
  }
};

export default function SafetyNetworkPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [showAddForm, setShowAddForm] = useState(false);
  const [secretWordInput, setSecretWordInput] = useState("");
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  
  const [form, setForm] = useState({
    name: "", 
    relationship: "", 
    phone: "", 
    email: "", 
    notifyBySMS: true, 
    notifyByEmail: true 
  });

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'safetyNetwork');
  }, [firestore, user?.uid]);

  const { data: contacts, isLoading: isContactsLoading } = useCollection(contactsQuery);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center gap-8">
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;
  const guardiansCount = contacts?.length || 0;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.relationship || !firestore || !user?.uid) return;
    
    const contactsRef = collection(firestore, "users", user.uid, "safetyNetwork");
    addDocumentNonBlocking(contactsRef, {
      ...form,
      addedAt: serverTimestamp(),
      addedWithLove: true,
    });

    setForm({ name: "", relationship: "", phone: "", email: "", notifyBySMS: true, notifyByEmail: true });
    setShowAddForm(false);
  };

  const handleRemoveContact = (contactId: string) => {
    if (!firestore || !user?.uid) return;
    const contactRef = doc(firestore, "users", user.uid, "safetyNetwork", contactId);
    deleteDocumentNonBlocking(contactRef);
  };

  const handleSaveSecretWord = () => {
    if (!userDocRef || !secretWordInput.trim()) return;
    updateDocumentNonBlocking(userDocRef, { secretWord: secretWordInput.trim() });
    setSecretWordInput("");
  };

  return (
    <main className="min-h-screen bg-card text-white font-headline pb-32 pt-safe">
      <nav className="bg-card/90 backdrop-blur-2xl border-b border-border/5 px-6 py-8 sticky top-0 z-[100]">
        <div className="max-md mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/dashboard")} className="p-3 bg-card/5 rounded-full border border-border/10 hover:border-primary transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
            <HeartHandshake className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-black uppercase text-primary tracking-widest">{t.title}</span>
          </div>
        </div>
      </nav>

      <div className="px-6 py-10 max-md mx-auto space-y-10">
        <section className="bg-gradient-to-br from-primary/20 to-card rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-primary/20">
          <Heart className="absolute -right-6 -bottom-6 opacity-10 rotate-12 transition-transform group-hover:scale-110" size={160} fill="currentColor" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={18} className="text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Sacred Holding</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-6">{t.header}</h2>
            <p className="text-sm font-bold leading-relaxed text-white/60 max-w-[300px]">
              {t.sub}
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">{t.guardians}</h3>
            <span className="text-[9px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 uppercase">
              {t.slots(guardiansCount)}
            </span>
          </div>

          <div className="grid gap-4">
            {isContactsLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : contacts?.length ? (
              contacts.map((contact) => (
                <div key={contact.id} className="bg-card/5 border border-border/10 rounded-[2.5rem] p-6 flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-white">{contact.name}</h3>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{contact.relationship} • {contact.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => handleRemoveContact(contact.id)} className="p-3 bg-red-600/10 rounded-xl border border-red-500/20 hover:bg-red-600 text-red-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-border/5 rounded-[3rem] opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">{t.empty}</p>
              </div>
            )}
          </div>

          {guardiansCount < 5 && !showAddForm && (
            <button 
              onClick={() => setShowAddForm(true)} 
              className="w-full bg-card/5 border-2 border-dashed border-border/10 rounded-[2.5rem] py-12 flex flex-col items-center gap-4 hover:bg-primary/5 hover:border-primary/30 transition-all group"
            >
              <div className="w-12 h-12 bg-card/5 rounded-full flex items-center justify-center border border-border/10 group-hover:border-primary transition-all">
                <UserPlus className="w-6 h-6 text-white/20 group-hover:text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase text-white/20 group-hover:text-primary tracking-[0.3em]">{t.add}</span>
            </button>
          )}

          {showAddForm && (
            <form onSubmit={handleAddContact} className="bg-card border-2 border-primary/30 rounded-[3rem] p-10 space-y-8 animate-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <UserPlus size={24} className="text-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight">{t.newTitle}</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Enter name" className="w-full bg-card/5 border-2 border-border/10 h-16 px-6 rounded-2xl focus:border-primary outline-none text-white font-bold" required suppressHydrationWarning />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Relationship</label>
                    <select value={form.relationship} onChange={(e) => setForm({...form, relationship: e.target.value})} className="w-full bg-card/5 border-2 border-border/10 h-16 px-6 rounded-2xl focus:border-primary outline-none text-white font-bold appearance-none" required>
                      <option value="" className="bg-card">Select role</option>
                      {RELATIONSHIP_OPTIONS.map(opt => <option key={opt} value={opt} className="bg-card">{opt}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">Phone Number</label>
                    <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+..." className="w-full bg-card/5 border-2 border-border/10 h-16 px-6 rounded-2xl focus:border-primary outline-none text-white font-bold" required suppressHydrationWarning />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="h-16 bg-card/5 text-white/40 font-black uppercase text-[10px] rounded-2xl border border-border/5">Cancel</button>
                <button type="submit" className="h-16 bg-primary text-white font-black uppercase text-[10px] rounded-2xl shadow-xl active:scale-95 transition-all">{t.save}</button>
              </div>
            </form>
          )}
        </section>

        <section className="bg-card/5 rounded-[3rem] border-2 border-primary/20 p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          <div className="flex items-center gap-5">
            <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20"><Lock size={32} className="text-primary" /></div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{t.codeTitle}</h3>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.codeSub}</p>
            </div>
          </div>
          <p className="text-sm font-bold text-white/40 leading-relaxed uppercase tracking-widest">{t.codeDesc}</p>
          <div className="flex flex-col gap-4">
            <input type="text" value={secretWordInput} onChange={(e) => setSecretWordInput(e.target.value)} placeholder={profile?.secretWord || t.codePlaceholder} className="w-full bg-card/5 border-2 border-border/10 rounded-2xl px-8 py-5 text-xl font-black uppercase outline-none focus:border-primary transition-all" suppressHydrationWarning />
            <button onClick={handleSaveSecretWord} className="w-full bg-primary text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-primary/20">{t.seal}</button>
          </div>
          {profile?.secretWord && <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] text-center animate-pulse">{t.activeCode(profile.secretWord)}</p>}
        </section>

        <footer className="text-center space-y-6 pt-10">
          <Heart size={32} className="mx-auto text-primary" />
          <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">{t.created}</p>
        </footer>
      </div>
    </main>
  );
}
