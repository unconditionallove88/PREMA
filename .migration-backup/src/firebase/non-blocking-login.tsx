'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch((err) => {
    console.error("Anonymous sign-in failed:", err);
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch((err) => {
    if (onError) onError(err);
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onError?: (error: any) => void): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch((err) => {
    if (onError) onError(err);
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** 
 * Sign out after registration process.
 * Used to reset authentication state during sensitive onboarding transitions.
 */
export async function signOutAfterRegistration(authInstance: Auth): Promise<void> {
  await signOut(authInstance);
}
