import React from "react";

/**
 * @fileOverview ShieldPulseIcon Component.
 * Bespoke icon for the Pulse Lab: A shield containing a physiological EKG pulse line.
 * Rendered in high-fidelity Emerald Green.
 */

interface ShieldPulseIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const ShieldPulseIcon = ({ 
  size = 48, 
  color = "hsl(var(--primary))",
  className 
}: ShieldPulseIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Shield Outline */}
    <path 
      d="M60 15l35 15v30c0 25-15 45-35 50-20-5-35-25-35-50V30l35-15z" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#emeraldGlow)"
    />

    {/* EKG Pulse Line */}
    <path 
      d="M35 65h10l5-15 10 30 10-40 5 25h10" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#emeraldGlow)"
    />
  </svg>
);
