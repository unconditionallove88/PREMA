import React from "react";

/**
 * @fileOverview SupporterIcon Component.
 * Redesigned for high visual richness and tenderness.
 * Features a glowing Algiz-inspired human silhouette with multi-tonal emerald strokes.
 */

interface SupporterIconProps {
  size?: number;
  className?: string;
}

export const SupporterIcon = ({ 
  size = 24, 
  className 
}: SupporterIconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <filter id="supporterGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    
    <g filter="url(#supporterGlow)">
      {/* Outer Halo */}
      <circle cx="20" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.3" />
      
      {/* Head */}
      <circle cx="20" cy="12" r="3.5" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Torso & Arms (Algiz Shape) */}
      <path 
        d="M20 16v18M10 12l10 8 10-8" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Heart Spark */}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" className="animate-pulse" />
    </g>
  </svg>
);
