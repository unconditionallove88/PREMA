import * as React from "react";

type Props = {
  size?: number;
  color?: string;     // emerald line color
  glow?: boolean;
  className?: string;
};

export function AnatomicalHeartIcon({
  size = 140,
  color = "hsl(var(--primary))",
  glow = true,
  className,
}: Props) {
  const filter = glow ? "url(#glow)" : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      className={className}
      role="img"
      aria-label="Abstract anatomical heart icon"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              0 0 0 0 0.06
              0 0 0 0 0.72
              0 0 0 0 0.51
              0 0 0 0 0.55 0"
            result="emeraldBlur"
          />
          <feMerge>
            <feMergeNode in="emeraldBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aorta + pulmonary branches */}
      <g filter={filter} stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M132 44c14 0 26 10 26 24 0 10-5 18-13 22" />
        <path d="M158 68c10-8 24-8 34 0" />
        <path d="M120 52c-10-6-22-5-30 3" />

        {/* Main heart silhouette (abstract anatomical) */}
        <path d="M124 92c-18-18-48-10-58 14-10 24 2 50 18 68 16 18 36 32 52 44 6 5 14 5 20 0 16-12 36-26 52-44 16-18 28-44 18-68-10-24-40-32-58-14-6 6-10 12-12 18-2-6-6-12-12-18z" />

        {/* Interior anatomy lines */}
        <path d="M96 132c10 10 24 18 32 22" opacity="0.9" />
        <path d="M160 132c-10 10-24 18-32 22" opacity="0.9" />
        <path d="M128 120v88" opacity="0.45" />
        <path d="M112 168c8 8 18 14 16 26" opacity="0.45" />
        <path d="M144 168c-8 8-18 14-16 26" opacity="0.45" />
      </g>
    </svg>
  );
}
