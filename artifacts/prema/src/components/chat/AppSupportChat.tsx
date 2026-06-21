
import { useState, useRef, useEffect } from 'react';
import { Send, User, Loader2, MessageCircle, CircleDot } from 'lucide-react';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { appSupportChat } from '@/ai/flows/app-support-chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

export function AppSupportChat() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await appSupportChat({
        question: input,
        history: messages,
      });

      setMessages(prev => [...prev, { role: 'ai', content: response.answer }]);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Network error',
        description: 'Could not connect to support services.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card font-body">
      <div className="px-8 py-6 border-b border-border/5 bg-card/80 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
            <MessageCircle className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-[18px] font-bold">Support & Q/A</h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Feedback & Help center</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-8 py-10" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
              <div className="w-16 h-16 bg-card/5 rounded-full flex items-center justify-center border border-border/10">
                <SupporterIcon className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-white/80">How can we improve your experience?</p>
                <p className="text-sm text-white/40">Ask about features, report bugs, or give feedback.</p>
              </div>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                "flex gap-6 items-start",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                msg.role === 'user' ? "bg-card/10 border-border/10" : "bg-blue-600/20 border-blue-500/30 text-blue-500"
              )}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <SupporterIcon className="w-5 h-5" />}
              </div>
              <div className={cn(
                "p-5 rounded-3xl text-sm leading-relaxed max-w-[80%]",
                msg.role === 'user' ? "bg-card/5 text-white rounded-tr-none" : "bg-card/10 text-white/90 rounded-tl-none border border-border/5 shadow-sm"
              )}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-500 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-5 rounded-3xl bg-card/10 text-white/40 italic text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="px-6 py-8 bg-card border-t border-border/5">
        <div className="relative flex items-center max-w-2xl mx-auto gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your feedback or question..."
            className="w-full bg-card/5 border border-border/10 rounded-full py-5 px-8 text-base focus:border-[hsl(var(--primary))] transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-4 bg-primary text-white rounded-full disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
