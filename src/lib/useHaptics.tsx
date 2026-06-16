export default function useHaptics() {
  const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  function pulse(pattern: number | number[] = 20) {
    try {
      if (canVibrate) {
        (navigator as any).vibrate(pattern);
      }
    } catch {
      // silent fail
    }
  }

  return { pulse, supported: canVibrate };
}
