'use client';

/**
 * @fileOverview The Pulse Guardian's decision engine.
 * Calibrates safety status based on physiological thresholds, intake volume, and medical profile.
 * Purified of vibe-aware integration to focus on physical protocols.
 */

export interface Vitals {
  heartRate: number;
  temperature?: number;
}

export interface UserMedicalProfile {
  healthConditions: string[];
  medications: string[];
}

export interface SessionStatus {
  isLocked: boolean;
  lockReason?: 'vitals_high' | 'limit_reached' | 'critical_interaction' | 'medical_threshold' | 'manual';
  lockedAt?: string;
  unlockAt?: string;
  lastHeartRate?: number;
  activeSubstances: string[];
  riskMultiplier: number;
}

/**
 * Evaluates the current safety state by aggregating all available tools.
 */
export const checkSafetyStatus = (
  vitals: Vitals, 
  activeSubstances: string[] | number,
  baselineHR?: number,
  profile?: UserMedicalProfile
): SessionStatus => {
  const activeSubs = typeof activeSubstances === 'number' ? [] : activeSubstances;
  const intakeCount = typeof activeSubstances === 'number' ? activeSubstances : activeSubstances.length;
  const now = new Date();
  
  const normalizedSubs = activeSubs.map(s => s.toLowerCase());

  // 1. CALCULATE RISK MULTIPLIER (Medical only)
  let riskMultiplier = 1.0;
  
  if (profile) {
    const highRiskConditions = ['circulatory', 'heart', 'epilepsy', 'respiratory'];
    const hasHighRiskCondition = profile.healthConditions.some(c => highRiskConditions.includes(c.toLowerCase()));
    if (hasHighRiskCondition) riskMultiplier += 0.3;

    const highRiskMeds = ['ssri', 'snri', 'maoi'];
    const hasHighRiskMed = profile.medications.some(m => highRiskMeds.includes(m.toLowerCase()));
    if (hasHighRiskMed) riskMultiplier += 0.2;
  }

  // 2. CRITICAL INTERACTION CHECK (Pulse Lab Data)
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));
  const hasEDMeds = normalizedSubs.some(s => 
    ['sildenafil', 'viagra', 'cialis', 'tadalafil'].includes(s)
  );

  if (hasPoppers && hasEDMeds) {
    return {
      isLocked: true,
      lockReason: 'critical_interaction',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs,
      riskMultiplier
    };
  }

  // 3. PHYSIOLOGICAL THRESHOLDS (Pulse Sync + Baseline)
  let hrThreshold = 130 / riskMultiplier;
  
  if (baselineHR) {
    const baselineMax = baselineHR * 2;
    hrThreshold = Math.min(hrThreshold, baselineMax);
  }

  if (hasPoppers) {
    hrThreshold = baselineHR ? Math.min(100, (baselineHR + 30) / riskMultiplier) : 100;
  }

  if (vitals.heartRate > hrThreshold) {
    return {
      isLocked: true,
      lockReason: riskMultiplier > 1.0 ? 'medical_threshold' : 'vitals_high',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs,
      riskMultiplier
    };
  }

  // 4. INTAKE VOLUME LIMIT
  if (intakeCount >= 5) {
    return {
      isLocked: true,
      lockReason: 'limit_reached',
      lockedAt: now.toISOString(),
      unlockAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
      lastHeartRate: vitals.heartRate,
      activeSubstances: activeSubs,
      riskMultiplier
    };
  }

  return { isLocked: false, activeSubstances: activeSubs, riskMultiplier };
};