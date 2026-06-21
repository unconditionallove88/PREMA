import React from "react";

/**
 * @fileOverview Eye of Compassion Component.
 * A high-fidelity SVG icon representing intuition, witnessing, and collective care.
 * Features a wide-opened eye with a pulsing heart center (the Pulse).
 */

interface RadiatingThirdEyeProps {
  size?: number;
  color?: string;
  className?: string;
}

export const RadiatingThirdEye = ({ 
  size = 48, 
  color = "hsl(var(--primary))",
  className 
}: RadiatingThirdEyeProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 120 120" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    {/* Radiating Intuition Waves */}
    <g stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4">
      <path d="M60 15V25M42 22l5 8M78 22l-5 8M28 35l8 6M92 35l-8 6" />
    </g>

    {/* Wide Opened Eye Outline */}
    <path 
      d="M20 70c15-25 35-35 40-35s25 10 40 35c-15 25-35 35-40 35s-25-10-40-35z" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      filter="url(#eyeGlow)" 
    />

    {/* The Pulse (Heart Pupil) */}
    <path 
      d="M60 78c-3-4-8-5-11-2-4 4-2 10 3 14l8 6 8-6c5-4 7-10 3-14-3-3-8-2-11 2z" 
      fill={color} 
      className="animate-pulse"
      style={{ transformOrigin: 'center' }}
      filter="url(#eyeGlow)" 
    />
    
    {/* Inner Light Spark */}
    <circle cx="60" cy="70" r="2" fill="white" opacity="0.8" />
  </svg>
);
