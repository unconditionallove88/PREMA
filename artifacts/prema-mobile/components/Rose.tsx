import React from "react";
import Svg, { Path } from "react-native-svg";

/**
 * A stylised rose used in the vibe-mode picker:
 * red rose → "dark" vibe, white rose → "bright" vibe.
 */
export function Rose({
  size = 34,
  color = "#E0556A",
  outline,
}: {
  size?: number;
  color?: string;
  outline?: string;
}) {
  const stroke = outline ?? "rgba(0,0,0,0.18)";
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {/* stem */}
      <Path d="M32 42 C32 49 32 53 32 59" stroke="#5C9460" strokeWidth={3} strokeLinecap="round" />
      {/* leaf */}
      <Path d="M32 51 C26 47 20 48 18 53 C24 55 30 54 32 51 Z" fill="#5C9460" />
      {/* outer bloom */}
      <Path
        d="M32 11 C19 11 11 20 13 31 C15 42 25 45 32 45 C39 45 49 42 51 31 C53 20 45 11 32 11 Z"
        fill={color}
        stroke={stroke}
        strokeWidth={1}
      />
      {/* inner petal */}
      <Path
        d="M32 18 C25 18 21 24 23 30 C25 36 32 37 32 37 C32 37 39 36 41 30 C43 24 39 18 32 18 Z"
        fill={color}
        stroke={stroke}
        strokeWidth={0.9}
        opacity={0.85}
      />
      {/* swirl center */}
      <Path
        d="M32 23 C28 23 26 26 27 29 C29 33 32 33 32 33 C32 33 35 33 37 29 C38 26 36 23 32 23 Z"
        fill={color}
        stroke={stroke}
        strokeWidth={0.8}
        opacity={0.9}
      />
    </Svg>
  );
}
