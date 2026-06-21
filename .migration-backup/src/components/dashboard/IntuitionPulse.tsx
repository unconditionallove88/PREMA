
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntuitionPulseProps {
  className?: string;
  variant?: 'normal' | 'emergency';
}

export function IntuitionPulse({ className, variant = 'normal' }: IntuitionPulseProps) {
  const isEmergency = variant === 'emergency';
  
  return (
    <div className={cn("relative flex items-center justify-center w-32 h-32", className)}>
      <div className={cn(
        "absolute w-full h-full rounded-full opacity-20 animate-ping",
        isEmergency ? "bg-red-500" : "bg-emerald-400"
      )} />
      <div className={cn(
        "absolute w-3/4 h-3/4 rounded-full opacity-30 animate-pulse",
        isEmergency ? "bg-red-400" : "bg-emerald-300"
      )} />
      
      <div className={cn(
        "relative z-10 w-12 h-12 bg-card rounded-full shadow-xl flex items-center justify-center border",
        isEmergency ? "border-red-100" : "border-emerald-100"
      )}>
        <Heart size={24} fill={isEmergency ? "#ef4444" : "hsl(var(--primary))"} className={isEmergency ? "text-red-500" : "text-emerald-500"} />
      </div>
    </div>
  );
}
