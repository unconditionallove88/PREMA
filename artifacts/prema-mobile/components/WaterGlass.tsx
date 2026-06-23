import React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * A glass of water used for the "Hydration sync" Nurture reminder.
 */
export function WaterGlass({ size = 56, color = "#38BDF8" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* glass outline */}
      <Path
        d="M19 11 H45 L41 54 C41 56 39 58 36 58 H28 C25 58 23 56 23 54 Z"
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinejoin="round"
      />
      {/* water fill */}
      <Path
        d="M22 29 H42 L39 53 C39 54.6 38 56 36 56 H28 C26 56 25 54.6 25 53 Z"
        fill={color}
        opacity={0.4}
      />
      {/* surface */}
      <Path d="M22 29 H42" stroke={color} strokeWidth={2} opacity={0.85} />
    </Svg>
  );
}
