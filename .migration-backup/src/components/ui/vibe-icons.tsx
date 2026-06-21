import React from "react";

/**
 * @fileOverview Natural Mood Icons Component.
 * Bespoke high-fidelity SVG icons inspired by nature.
 */

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
}

// Radiant: A blooming Golden Sun
export const RadiantIcon = ({ size = 48, className, color = "#FFD700" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <defs>
      <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <g filter="url(#sunGlow)">
      <circle cx="60" cy="60" r="25" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line 
          key={angle} 
          x1={60 + 30 * Math.cos((angle * Math.PI) / 180)} 
          y1={60 + 30 * Math.sin((angle * Math.PI) / 180)} 
          x2={60 + 45 * Math.cos((angle * Math.PI) / 180)} 
          y2={60 + 45 * Math.sin((angle * Math.PI) / 180)} 
          stroke={color} 
          strokeWidth="4" 
          strokeLinecap="round" 
        />
      ))}
    </g>
  </svg>
);

// Harmony: A balanced Sage Leaf
export const HarmonyIcon = ({ size = 48, className, color = "#8FBC8F" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path 
      d="M60 100c0-40 30-60 30-80-30 20-30 40-30 80z" 
      fill={color} 
      fillOpacity="0.2" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />
    <path 
      d="M60 100c0-40-30-60-30-80 30 20 30 40 30 80z" 
      fill={color} 
      fillOpacity="0.1" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinejoin="round" 
    />
    <line x1="60" y1="100" x2="60" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Calm: Gentle Blue Waves
export const CalmIcon = ({ size = 48, className, color = "#87CEEB" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path 
      d="M20 60c10-10 20-10 30 0s20 10 30 0 20-10 30 0" 
      stroke={color} 
      strokeWidth="6" 
      strokeLinecap="round" 
      opacity="0.8" 
    />
    <path 
      d="M20 80c10-10 20-10 30 0s20 10 30 0 20-10 30 0" 
      stroke={color} 
      strokeWidth="6" 
      strokeLinecap="round" 
      opacity="0.4" 
    />
    <path 
      d="M20 40c10-10 20-10 30 0s20 10 30 0 20-10 30 0" 
      stroke={color} 
      strokeWidth="6" 
      strokeLinecap="round" 
      opacity="0.2" 
    />
  </svg>
);

// Hazy: A soft Mist Cloud
export const HazyIcon = ({ size = 48, className, color = "#C0C0C0" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <g opacity="0.6">
      <circle cx="45" cy="65" r="20" fill={color} fillOpacity="0.2" />
      <circle cx="75" cy="65" r="20" fill={color} fillOpacity="0.2" />
      <circle cx="60" cy="45" r="20" fill={color} fillOpacity="0.2" />
    </g>
    <path 
      d="M30 75h60c10 0 10-15 0-15-2-10-15-15-25-10-5-10-25-10-30 0-10-5-20 5-15 15-5 0-10 5-10 10z" 
      stroke={color} 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

// Overwhelmed: A protective Earthy Cocoon
export const HeldIcon = ({ size = 48, className, color = "#E2725B" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
    <path 
      d="M60 20c-25 0-40 20-40 40s15 40 40 40 40-20 40-40-15-40-40-40z" 
      stroke={color} 
      strokeWidth="4" 
      strokeDasharray="8 4" 
      fill={color} 
      fillOpacity="0.1" 
    />
    <path 
      d="M40 60c0-10 10-20 20-20s20 10 20 20-10 20-20 20-20-10-20-20z" 
      fill={color} 
      fillOpacity="0.3" 
      stroke={color} 
      strokeWidth="2" 
    />
    <path d="M30 40l10 10M90 40l-10 10M30 80l10-10M90 80l-10-10" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);
