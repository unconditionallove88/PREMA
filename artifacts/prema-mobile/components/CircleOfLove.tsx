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
  Rect,
  Stop,
} from "react-native-svg";

import { useThemePreference } from "@/context/SessionContext";

/**
 * Circle of Love — the Neptunian "Luch Sveta" (Beam of Light).
 *
 * An abstract, state-of-art light visualisation rather than a literal diagram.
 * A "Point of Pure Consciousness" shimmers at the absolute centre of the one
 * Circle of Love and, every few seconds, IGNITES — radiating outward through
 * the four energetic "frequencies" — Ego (Sun/gold), Soul (Moon/silver), Love
 * (Venus/rose) and Will (Mars/ruby) — which swirl as soft glows that mix as
 * light. The light comes from within and fills the circle (internal expansion),
 * never descending from above.
 *
 * Adaptive "Light-Void" aesthetic:
 * - DARK mode: bright cores mix additively over the deep cosmic void; the
 *   ignition is a brilliant white-violet shockwave with a strong bloom.
 * - LIGHT mode: saturated pastels read as a delicate prism over the spiritual
 *   void; the ignition is a soft refractive bloom of pure light.
 *
 * Every ~10s an "integration pulse" flashes through the field: the four energies
 * briefly brighten and harmonise, then settle back into their ethereal swirl —
 * the Higher Self (Neptune) aligning the human parts into one unified system.
 *
 * All motion is GPU-friendly transform/opacity (native driver) for smoothness.
 */

// The one Circle's boundary palette (rose quartz, gold, soft violet).
const PALETTE_DARK = {
  rose: "#F7C8DA",
  magenta: "#E89BC4",
  lavender: "#C9A7F0",
  gold: "#F6D58A",
};
// Deepened for the light "spiritual void" so the ring reads on off-white.
const PALETTE_LIGHT = {
  rose: "#E89BC4",
  magenta: "#D672A8",
  lavender: "#A98AE0",
  gold: "#E6B860",
};

// The four inner frequencies + the Neptunian source. In dark mode the cores are
// near-white and mix additively over the void; in light mode they become
// saturated so the pastels stay luminous (never muddy) over the bright void.
const ENERGY_DARK = {
  egoCore: "#FFF8E2", // Sun / Золото — golden radiant core
  egoMid: "#FBC646",
  egoEdge: "#F59E2A",
  soulCore: "#FFFFFF", // Moon / Серебро — silver translucent shell
  soulMid: "#E6ECF7",
  soulEdge: "#AEB9D6",
  loveCore: "#FFE4F2", // Venus / Розовый — warm rose-magenta glow
  loveMid: "#F58FC6",
  loveEdge: "#E0529E",
  willCore: "#FF8DA1", // Mars / Красный — deep pulsing ruby
  willMid: "#F0476B",
  willEdge: "#C01038",
  neptuneCore: "#FFFFFF", // Neptune — white-violet ignition point
  neptuneMid: "#EDE4FF",
  neptuneEdge: "#B79CF2",
};
const ENERGY_LIGHT = {
  egoCore: "#FBC646",
  egoMid: "#F0A024",
  egoEdge: "#E0840E",
  soulCore: "#AEBCDC",
  soulMid: "#8497C4",
  soulEdge: "#6175A6",
  loveCore: "#F47CBA",
  loveMid: "#E84B9E",
  loveEdge: "#CC2C84",
  willCore: "#F2546D",
  willMid: "#E5344F",
  willEdge: "#C8102E",
  neptuneCore: "#FFFFFF",
  neptuneMid: "#C9B6F5",
  neptuneEdge: "#9B7FE0",
};

const PARTICLE_DARK = ["#FFFFFF", "#FBD6E6", "#F6D58A", "#C9A7F0"];
const PARTICLE_LIGHT = ["#E89BC4", "#E6B860", "#A98AE0", "#D672A8"];

type ParticleConfig = {
  angle: number;
  radius: number;
  size: number;
  color: string;
  drift: number;
  duration: number;
  delay: number;
};

function Particle({ cfg, center }: { cfg: ParticleConfig; center: number }) {
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

  const translate = t.interpolate({ inputRange: [0, 1], outputRange: [cfg.drift, -cfg.drift] });
  const opacity = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.25, 1, 0.4] });
  const scale = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.7, 1.15, 0.8] });

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

export function CircleOfLove({ size }: { size?: number } = {}) {
  const { width } = useWindowDimensions();
  const vibe = useThemePreference();
  const isDark = vibe === "dark";

  const PALETTE = isDark ? PALETTE_DARK : PALETTE_LIGHT;
  const ENERGY = isDark ? ENERGY_DARK : ENERGY_LIGHT;

  // When an explicit size is given (e.g. the landing circle) honour it; else the
  // ring occupies ~72% of the screen width. The bloom extends well beyond.
  const RING = size ?? Math.min(width * 0.72, 360);
  const BLOOM = RING * 1.85;
  const center = BLOOM / 2;

  // Ring annulus geometry (drawn inside a RING-sized svg).
  const ringStroke = RING * 0.085;
  const ringR = (RING - ringStroke) / 2;

  // Inner energy field + Neptunian point geometry.
  const CORE = RING * 0.62;
  const NEP = RING * 0.16;

  const breath = useRef(new Animated.Value(0)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const egoSpin = useRef(new Animated.Value(0)).current;
  const soulSpin = useRef(new Animated.Value(0)).current;
  const loveSpin = useRef(new Animated.Value(0)).current;
  const willSpin = useRef(new Animated.Value(0)).current;
  const neptune = useRef(new Animated.Value(0)).current;
  const ignite = useRef(new Animated.Value(0)).current;
  const integrate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spin = (v: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.timing(v, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }),
      );
    const sineLoop = (v: Animated.Value, up: number, down: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: up, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(v, { toValue: 0, duration: down, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ]),
      );

    const breathing = sineLoop(breath, 3000, 3000);
    const ringTurn = spin(ringSpin, 24000);
    const egoTurn = spin(egoSpin, 26000);
    const soulTurn = spin(soulSpin, 34000);
    const loveTurn = spin(loveSpin, 21000);
    const willTurn = spin(willSpin, 29000);
    const neptuneShimmer = sineLoop(neptune, 1600, 1600);

    // The integration pulse: settle for ~8.6s, flash bright, ease back. ~10s.
    const integration = Animated.loop(
      Animated.sequence([
        Animated.delay(8600),
        Animated.timing(integrate, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(integrate, { toValue: 0, duration: 700, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    );

    // The ignition: a Point of Pure Consciousness sparks at the absolute centre
    // and radiates outward through the layers, then resets (one-directional, so
    // it reads as an internal expansion rather than a pulse breathing in & out).
    const ignition = Animated.loop(
      Animated.sequence([
        Animated.delay(8600),
        Animated.timing(ignite, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(ignite, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );

    const all = [
      breathing,
      ringTurn,
      egoTurn,
      soulTurn,
      loveTurn,
      willTurn,
      neptuneShimmer,
      integration,
      ignition,
    ];
    all.forEach((a) => a.start());
    return () => all.forEach((a) => a.stop());
  }, [breath, ringSpin, egoSpin, soulSpin, loveSpin, willSpin, neptune, ignite, integrate]);

  // Breathing of the whole system.
  const ringScale = breath.interpolate({ inputRange: [0, 1], outputRange: [1, 1.035] });
  const bloomScale = breath.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.1] });
  const bloomOpacity = breath.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? [0.55, 0.9] : [0.4, 0.62],
  });
  const ringRotate = ringSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  // Each energy orbits its own way (alternating directions / speeds).
  const egoRotate = egoSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const soulRotate = soulSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-360deg"] });
  const loveRotate = loveSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const willRotate = willSpin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "-360deg"] });

  // Integration pulse drives the harmonising brighten + gentle expansion.
  const energyScale = integrate.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const egoOpacity = integrate.interpolate({ inputRange: [0, 1], outputRange: [0.88, 1] });
  const soulOpacity = integrate.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.88] });
  const loveOpacity = integrate.interpolate({ inputRange: [0, 1], outputRange: [0.64, 0.96] });
  const willOpacity = integrate.interpolate({ inputRange: [0, 1], outputRange: [0.48, 0.9] });
  const unifiedOpacity = integrate.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.95] });

  // The Neptunian source — shimmering, with a brighter flash on each pulse.
  const neptuneScale = neptune.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.16] });
  const neptuneBase = neptune.interpolate({
    inputRange: [0, 1],
    outputRange: isDark ? [0.6, 0.92] : [0.5, 0.78],
  });
  const neptuneOpacity = Animated.add(
    neptuneBase,
    integrate.interpolate({ inputRange: [0, 1], outputRange: [0, 0.08] }),
  );

  // The ignition wave — the Point of Pure Consciousness radiating outward from
  // the absolute centre, growing to fill the ring then dissipating as it lands
  // on the boundary (an internal expansion, not a beam descending from above).
  const igniteScale = ignite.interpolate({ inputRange: [0, 1], outputRange: [0.06, 1.12] });
  const igniteOpacity = ignite.interpolate({
    inputRange: [0, 0.18, 1],
    outputRange: isDark ? [0, 0.95, 0] : [0, 0.72, 0],
  });

  const particles = useMemo<ParticleConfig[]>(() => {
    const count = 14;
    const colorsArr = isDark ? PARTICLE_DARK : PARTICLE_LIGHT;
    return Array.from({ length: count }, (_, i) => {
      const jitter = (Math.random() - 0.5) * 0.35;
      return {
        angle: (i / count) * Math.PI * 2 + jitter,
        radius: ringR + ringStroke * (0.4 + Math.random() * 1.6),
        size: 2.5 + Math.random() * 4,
        color: colorsArr[i % colorsArr.length],
        drift: 4 + Math.random() * 7,
        duration: 1800 + Math.random() * 1800,
        delay: Math.random() * 1600,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ringR, ringStroke, isDark]);

  return (
    <View style={styles.wrap} pointerEvents="none">
      <View style={{ width: BLOOM, height: BLOOM, alignItems: "center", justifyContent: "center" }}>
        {/* Ambient outer bloom — soft light spreading beyond the ring */}
        <Animated.View style={[styles.layer, { opacity: bloomOpacity, transform: [{ scale: bloomScale }] }]}>
          <Svg width={BLOOM} height={BLOOM}>
            <Defs>
              <RadialGradient id="bloom" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={PALETTE.rose} stopOpacity="0.5" />
                <Stop offset="34%" stopColor={PALETTE.gold} stopOpacity="0.2" />
                <Stop offset="62%" stopColor={PALETTE.lavender} stopOpacity="0.12" />
                <Stop offset="100%" stopColor={PALETTE.lavender} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={center} cy={center} r={BLOOM / 2} fill="url(#bloom)" />
          </Svg>
        </Animated.View>

        {/* The four swirling frequencies — they mix as light, not as pigment.
            Each disc is drawn off-centre so its parent's rotation orbits it. */}
        <Animated.View style={[styles.layer, { opacity: soulOpacity, transform: [{ rotate: soulRotate }, { scale: energyScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="soul" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={ENERGY.soulCore} stopOpacity="0.7" />
                <Stop offset="42%" stopColor={ENERGY.soulMid} stopOpacity="0.46" />
                <Stop offset="76%" stopColor={ENERGY.soulEdge} stopOpacity="0.18" />
                <Stop offset="100%" stopColor={ENERGY.soulEdge} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2 - CORE * 0.14} cy={CORE / 2 - CORE * 0.06} r={CORE * 0.34} fill="url(#soul)" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.layer, { opacity: willOpacity, transform: [{ rotate: willRotate }, { scale: energyScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="will" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={ENERGY.willCore} stopOpacity="0.8" />
                <Stop offset="38%" stopColor={ENERGY.willMid} stopOpacity="0.55" />
                <Stop offset="72%" stopColor={ENERGY.willEdge} stopOpacity="0.24" />
                <Stop offset="100%" stopColor={ENERGY.willEdge} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2 - CORE * 0.08} cy={CORE / 2 + CORE * 0.15} r={CORE * 0.3} fill="url(#will)" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.layer, { opacity: loveOpacity, transform: [{ rotate: loveRotate }, { scale: energyScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="love" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={ENERGY.loveCore} stopOpacity="0.85" />
                <Stop offset="40%" stopColor={ENERGY.loveMid} stopOpacity="0.6" />
                <Stop offset="74%" stopColor={ENERGY.loveEdge} stopOpacity="0.25" />
                <Stop offset="100%" stopColor={ENERGY.loveEdge} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2 + CORE * 0.1} cy={CORE / 2 + CORE * 0.14} r={CORE * 0.36} fill="url(#love)" />
          </Svg>
        </Animated.View>

        <Animated.View style={[styles.layer, { opacity: egoOpacity, transform: [{ rotate: egoRotate }, { scale: energyScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="ego" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={ENERGY.egoCore} stopOpacity="0.96" />
                <Stop offset="34%" stopColor={ENERGY.egoMid} stopOpacity="0.78" />
                <Stop offset="70%" stopColor={ENERGY.egoEdge} stopOpacity="0.32" />
                <Stop offset="100%" stopColor={ENERGY.egoEdge} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2 + CORE * 0.05} cy={CORE / 2} r={CORE * 0.42} fill="url(#ego)" />
          </Svg>
        </Animated.View>

        {/* Unified centre — where the beam lands and the frequencies become One */}
        <Animated.View style={[styles.layer, { opacity: unifiedOpacity, transform: [{ scale: energyScale }] }]}>
          <Svg width={CORE} height={CORE}>
            <Defs>
              <RadialGradient id="unified" cx="50%" cy="50%" r="50%">
                {isDark
                  ? [
                      <Stop key="0" offset="0%" stopColor="#FFFFFF" stopOpacity="1" />,
                      <Stop key="1" offset="46%" stopColor="#FFF1D6" stopOpacity="0.7" />,
                      <Stop key="2" offset="100%" stopColor="#FFF1D6" stopOpacity="0" />,
                    ]
                  : [
                      <Stop key="0" offset="0%" stopColor="#FFE9B0" stopOpacity="0.95" />,
                      <Stop key="1" offset="46%" stopColor="#F2B84A" stopOpacity="0.6" />,
                      <Stop key="2" offset="100%" stopColor="#F2B84A" stopOpacity="0" />,
                    ]}
              </RadialGradient>
            </Defs>
            <Circle cx={CORE / 2} cy={CORE / 2} r={CORE * 0.18} fill="url(#unified)" />
          </Svg>
        </Animated.View>

        {/* Main energy ring — the boundary of the ONE Circle, slowly rotating */}
        <Animated.View style={[styles.layer, { transform: [{ rotate: ringRotate }, { scale: ringScale }] }]}>
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
            <Circle cx={RING / 2} cy={RING / 2} r={ringR} stroke="url(#ring)" strokeWidth={ringStroke * 1.8} strokeOpacity={isDark ? 0.2 : 0.16} fill="none" />
            <Circle cx={RING / 2} cy={RING / 2} r={ringR} stroke="url(#ring)" strokeWidth={ringStroke} strokeOpacity={0.92} fill="none" />
            <Circle cx={RING / 2} cy={RING / 2} r={ringR - ringStroke * 0.42} stroke="#FFFFFF" strokeWidth={ringStroke * 0.12} strokeOpacity={isDark ? 0.42 : 0.3} fill="none" />
          </Svg>
        </Animated.View>

        {/* The Luch Sveta — light igniting at the absolute centre and radiating
            outward through the layers. Dark: brilliant white-violet shockwave.
            Light: a soft refractive bloom of pure light. */}
        <Animated.View style={[styles.layer, { opacity: igniteOpacity, transform: [{ scale: igniteScale }] }]}>
          <Svg width={RING} height={RING}>
            <Defs>
              <RadialGradient id="ignite" cx="50%" cy="50%" r="50%">
                {isDark
                  ? [
                      <Stop key="0" offset="0%" stopColor="#FFFFFF" stopOpacity="1" />,
                      <Stop key="1" offset="26%" stopColor={ENERGY.neptuneMid} stopOpacity="0.78" />,
                      <Stop key="2" offset="60%" stopColor={ENERGY.neptuneEdge} stopOpacity="0.26" />,
                      <Stop key="3" offset="100%" stopColor={ENERGY.neptuneEdge} stopOpacity="0" />,
                    ]
                  : [
                      <Stop key="0" offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />,
                      <Stop key="1" offset="28%" stopColor={ENERGY.neptuneMid} stopOpacity="0.6" />,
                      <Stop key="2" offset="62%" stopColor={ENERGY.neptuneEdge} stopOpacity="0.22" />,
                      <Stop key="3" offset="100%" stopColor={ENERGY.neptuneEdge} stopOpacity="0" />,
                    ]}
              </RadialGradient>
            </Defs>
            <Circle cx={RING / 2} cy={RING / 2} r={RING / 2} fill="url(#ignite)" />
          </Svg>
        </Animated.View>

        {/* The Point of Pure Consciousness — white-violet source at the centre */}
        <Animated.View style={[styles.layer, { opacity: neptuneOpacity, transform: [{ scale: neptuneScale }] }]}>
          <Svg width={NEP} height={NEP}>
            <Defs>
              <RadialGradient id="neptune" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor={ENERGY.neptuneCore} stopOpacity="1" />
                <Stop offset="30%" stopColor={ENERGY.neptuneMid} stopOpacity="0.85" />
                <Stop offset="66%" stopColor={ENERGY.neptuneEdge} stopOpacity="0.32" />
                <Stop offset="100%" stopColor={ENERGY.neptuneEdge} stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Circle cx={NEP / 2} cy={NEP / 2} r={NEP / 2} fill="url(#neptune)" />
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
