import React from "react";

/**
 * @fileOverview GuardianLogo Component.
 * Bespoke logo for the Pulse Guardian: A brain and heart shaking hands inside a heart.
 * Rendered in a high-fidelity Purple palette.
 */

interface GuardianLogoProps {
  size?: number;
  className?: string;
}

export const GuardianLogo = ({ 
  size = 48, 
  className 
}: GuardianLogoProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Outer Protective Heart Shell */}
    <path 
      d="M60 105s-45-25-45-65c0-15 10-25 25-25 10 0 15 5 20 10 5-5 10-10 20-10 15 0 25 10 25 25 0 40-45 65-45 65z" 
      stroke="hsl(var(--accent))" 
      strokeWidth="3" 
      strokeLinecap="round" 
      filter="url(#purpleGlow)" 
      opacity="0.4"
    />

    {/* The Brain (Left) */}
    <path 
      d="M45 45c-5 0-10 5-10 10s5 10 10 10c0 5 5 10 10 10" 
      stroke="hsl(var(--accent))" 
      strokeWidth="3" 
      strokeLinecap="round" 
      filter="url(#purpleGlow)"
    />
    
    {/* The Heart (Right) */}
    <path 
      d="M75 45c5 0 10 5 10 10s-5 10-10 10c0 5-5 10-10 10" 
      stroke="hsl(var(--accent))" 
      strokeWidth="3" 
      strokeLinecap="round" 
      filter="url(#purpleGlow)"
    />

    {/* Shaking Hands (Center) */}
    <path 
      d="M52 65h16M55 65l-3 5M65 65l3 5" 
      stroke="hsl(var(--accent))" 
      strokeWidth="3" 
      strokeLinecap="round" 
      filter="url(#purpleGlow)"
    />
  </svg>
);
