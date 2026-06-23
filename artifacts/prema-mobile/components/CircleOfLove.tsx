import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from "react-native-svg";

/**
 * Circle of Love — a living aura field.
 *
 * A sacred, breathing energy ring built from layered SVG gradients (rose,
 * magenta, lavender, gold), a glowing radial core, an ambient outer bloom,
 * a slow travelling shimmer and floating light particles. Everything is
 * driven by GPU-friendly transform/opacity animations (native driver) so it
 * stays smooth on mobile. The feminine love palette is intentional and is
 * the same in both vibe modes — this is the emotional centrepiece.
 */

const PALETTE = {
  rose: "#FFB3C9",
  magenta: "#ED5BA0",
  lavender: "#C9A7F0",
  gold: "#F6D58A",
  coreHighlight: "#FFFFFF",
  coreMid: "#FFC6DD",
  coreDeep: "#C32E84",
};

const PARTICLE_COLORS = ["#FFFFFF", "#FFC6DD", "#F6D58A", "#FFB3C9"];

type ParticleConfig = {
  angle: number;
  radius: number;
  size: number;
  color: string;
  drift: number;
  duration: number;
  delay: number;
};

function Particle({
  cfg,
  center,
}: {
  cfg: ParticleConfig;
  center: number;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(cfg.delay),
        Animated.timing(t, {
          toValue: 1,
          duration: cfg.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: cfg.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, cfg.delay, cfg.duration]);

  const x = center + Math.cos(cfg.angle) * cfg.radius - cfg.size / 2;
  const y = center + Math.sin(cfg.angle) * cfg.radius - cfg.size / 2;

  const translate = t.interpolate({
    inputRange: [0, 1],
    outputRange: [cfg.drift, -cfg.drift],
  });
  const opacity = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.25, 1, 0.4],
  });
  const scale = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1.15, 0.8],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: cfg.size,
        height: cfg.size,
        borderRadius: cfg.size / 2,
        backgroundColor: cfg.color,
        shadowColor: cfg.color,
        shadowOpacity: 0.9,
        shadowRadius: cfg.size,
        shadowOffset: { width: 0, height: 0 },
        opacity,
        transform: [{ translateX: translate }, { translateY: translate }, { scale }],
      }}
    />
  );
}

export function CircleOfLove() {
  const { width } = useWindowDimensions();

  // The ring occupies ~72% of the screen width; the bloom extends well beyond.
  const RING = Math.min(width * 0.72, 360);
  const BLOOM = RING * 1.85;
  const center = BLOOM / 2;

  // Ring annulus geometry (drawn inside an RING-sized svg).
  const ringStroke = RING * 0.085;
  const ringR = (RING - ringStroke) / 2;
  const circumference = 2 * Math.PI * ringR;

  // Core geometry.
  const CORE = RING * 0.58;

  const breath = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const shimmerSpin = useRef(new Animated.Value(0)).current;
  const shimmerGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, {
          toValue: 1,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breath, {
          toValue: 0,
          duration: 3200,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    const energy = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 22000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const shimmerMove = Animated.loop(
      Animated.timing(shimmerSpin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );
    const shimmerPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerGlow, {
          toValue: 1,
          duration: 1400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerGlow, {
          toValue: 0,
          duration: 2600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(1600),
      ]),
    );

    breathing.start();
    energy.start();
    shimmerMove.start();
    shimmerPulse.start();
    return () => {
      breathing.stop();
      energy.stop();
      shimmerMove.stop();
      shimmerPulse.stop();
    };
  }, [breath, spin, shimmerSpin, shimmerGlow]);

  const coreScale = breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const ringScale = breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const bloomScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.1] });
  const bloomOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.9] });
  const ringRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const shimmerRotate = shimmerSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "320deg"],
  });
  const shimmerOpacity = shimmerGlow.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.85],
  });

  const particles = useMemo<ParticleConfig[]>(() => {
    const count = 14;
    return Array.from({ length: count }, (_, i) => {
      const jitter = (Math.random() - 0.5) * 0.35;
      return {
        angle: (i / count) * Math.PI * 2 + jitter,
        radius: ringR + ringStroke * (0.4 + Math.random() * 1.6),
        size: 2.5 + Math.random() * 4,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        drift: 4 + Math.random() * 7,
        duration: 1800 + Math.random() * 1800,
        delay: Math.random() * 1600,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringR, ringStroke]);

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={{ width: BLOOM, height: BLOOM, alignItems: "center", justifyContent: "center" }}>
        {/* Ambient outer bloom — soft light spreading beyond the ring */}
        <Animated.View
          style={[
            styles.layer,
            { opacity: bloomOpacity, transform: [{ scale: bloomScale }] },
          ]}
        >
          <Svg width={BLOOM} height={BLOOM}>
            <Defs>
              <RadialGradient id="bloom" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={PALETTE.magenta} stopOpacity="0.55" />
                <Stop offset="42%" stopColor={PALETTE.rose} stopOpacity="0.22" />
                <Stop offset="72%" stopColor={PALETTE.lavender} stopOpacity="0.08" />
                <Stop offset="100%" stopColor={PALETTE.lavender} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={center} cy={center} r={BLOOM / 2} fill="url(#bloom)" />
          </Svg>
        </Animated.View>

        {/* Main energy ring — multi-layer translucent gradient, slowly rotating */}
        <Animated.View
          style={[
            styles.layer,
            { transform: [{ rotate: ringRotate }, { scale: ringScale }] },
          ]}
        >
          <Svg width={RING} height={RING}>
            <Defs>
              <LinearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={PALETTE.rose} />
                <Stop offset="28%" stopColor={PALETTE.magenta} />
                <Stop offset="52%" stopColor={PALETTE.lavender} />
                <Stop offset="76%" stopColor={PALETTE.gold} />
                <Stop offset="100%" stopColor={PALETTE.rose} />
              </LinearGradient>
            </Defs>
            {/* soft wide halo of the ring */}
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={ringR}
              stroke="url(#ring)"
              strokeWidth={ringStroke * 1.8}
              strokeOpacity={0.22}
              fill="none"
            />
            {/* main body */}
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={ringR}
              stroke="url(#ring)"
              strokeWidth={ringStroke}
              strokeOpacity={0.95}
              fill="none"
            />
            {/* thin bright inner edge for depth */}
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={ringR - ringStroke * 0.42}
              stroke="#FFFFFF"
              strokeWidth={ringStroke * 0.12}
              strokeOpacity={0.45}
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Travelling shimmer — a short bright arc sweeping around the ring */}
        <Animated.View
          style={[
            styles.layer,
            { opacity: shimmerOpacity, transform: [{ rotate: shimmerRotate }] },
          ]}
        >
          <Svg width={RING} height={RING}>
            <Circle
              cx={RING / 2}
              cy={RING / 2}
              r={ringR}
              stroke="#FFFFFF"
              strokeWidth={ringStroke * 0.9}
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.1}, ${circumference}`}
              fill="none"
            />
          </Svg>
        </Animated.View>

        {/* Glowing radial core with white highlight */}
        <Animated.View style={[styles.layer, { transform: [{ scale: coreScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="core" cx="50%" cy="40%" r="65%">
                <Stop offset="0%" stopColor={PALETTE.coreHighlight} stopOpacity="0.98" />
                <Stop offset="30%" stopColor={PALETTE.coreMid} stopOpacity="0.96" />
                <Stop offset="66%" stopColor={PALETTE.magenta} />
                <Stop offset="100%" stopColor={PALETTE.coreDeep} />
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2} cy={CORE / 2} r={CORE / 2} fill="url(#core)" />
          </Svg>
        </Animated.View>

        {/* Floating light particles */}
        {particles.map((cfg, i) => (
          <Particle key={i} cfg={cfg} center={center} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  layer: { position: "absolute", alignItems: "center", justifyContent: "center" },
});
