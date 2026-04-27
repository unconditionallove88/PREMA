
'use client';

/**
 * Safely converts any object to JSON for LocalStorage, handling:
 * 1. Circular references
 * 2. Firebase Timestamps
 * 3. undefined values
 */
export const safeStringify = (obj: any): string => {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (value && typeof value === "object" && typeof value.toDate === 'function') {
      return value.toDate().toISOString();
    }

    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
    }

    if (value === undefined) return null;

    return value;
  });
};

/**
 * Persists data to the phone's local storage with encryption placeholder.
 */
export const persistLocal = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, safeStringify(data));
  } catch (e) {
    console.error("Local Sovereignty: Storage failed", e);
  }
};

/**
 * Retrieves data from the phone's local storage.
 */
export const getLocal = (key: string) => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Purges session specific data from the phone.
 */
export const purgeSessionData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('stayonbeat_logs');
  localStorage.removeItem('stayonbeat_mesh_history');
};
