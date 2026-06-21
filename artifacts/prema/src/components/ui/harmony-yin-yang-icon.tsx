import React from "react";

/**
 * @fileOverview HarmonyIcon Component.
 * A high-fidelity bespoke icon representing the "In Harmony" state.
 * Features a brain and a heart connected by a glowing line of unconditional love.
 * Rendered in vibrant yellow (hsl(var(--accent))).
 */

interface HarmonyIconProps {
  size?: number;
  className?: string;
}

export const HarmonyYinYangIcon = ({ 
  size = 24, 
  className 
}: HarmonyIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="harmonyGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="loveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
    </defs>
    
    {/* Central Connecting Pulse (Unconditional Love) */}
    <path 
      d="M45 60 Q60 30 75 60 T105 60" 
      stroke="url(#loveGradient)" 
      strokeWidth="2" 
      strokeDasharray="4 4" 
      className="animate-pulse"
      opacity="0.3"
    />

    {/* The Brain (Intellect & Logic) - Left Side */}
    <g filter="url(#harmonyGlow)" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M50 40c-5-5-15-5-20 0-5 5-5 15 0 20 0 5 5 10 10 10" />
      <path d="M40 50c-3 0-6 2-6 5s3 5 6 5" strokeWidth="2" opacity="0.6" />
      <path d="M30 65c0 5 5 10 15 10" />
    </g>

    {/* The Heart (Emotion & Love) - Right Side */}
    <g filter="url(#harmonyGlow)" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M70 45c5-10 25-10 30 5 2 10-10 25-20 30-10-5-22-20-20-30 1-5 5-5 10-5z" fill="currentColor" fillOpacity="0.1" />
    </g>

    {/* The Bridge Connection */}
    <path 
      d="M50 60 H70" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round"
      filter="url(#harmonyGlow)"
    />
    
    {/* Love Spark (Center) */}
    <circle cx="60" cy="60" r="3" fill="currentColor" filter="url(#harmonyGlow)" className="animate-pulse" />
  </svg>
);
