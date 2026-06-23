import React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * A stylised anatomical heart (asymmetric body + great vessels) used for the
 * "Rest intervals" Nurture reminder — deliberately distinct from a valentine heart.
 */
export function AnatomicalHeart({ size = 56, color = "#E0556A" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* great vessels */}
      <Path
        d="M28 18 C28 9 22 7 20 11 C18 15 22 19 24 21"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.85}
      />
      <Path
        d="M37 17 C37 7 43 6 45 11 C46 15 42 19 40 21"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.85}
      />
      <Path
        d="M33 15 C33 9 35 7 38 8"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />
      {/* heart body */}
      <Path
        d="M25 19 C17 19 13 27 15 35 C17 45 27 50 33 56 C40 50 47 43 48 34 C49 26 44 20 38 20 C34 20 33 23 32 25 C31 23 29 19 25 19 Z"
        fill={color}
      />
      {/* ventricle groove */}
      <Path
        d="M33 29 C34 37 35 45 34 53"
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={1.5}
        fill="none"
      />
    </Svg>
  );
}
