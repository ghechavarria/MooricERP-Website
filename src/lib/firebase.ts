/**
 * Firebase Auth client for the signup pages.
 *
 * Import this only from the signup pages (they are code-split behind
 * SIGNUP_ENABLED) so a flag-off build carries no Firebase code. Nothing here runs
 * at import time: missing config makes firebaseAvailable() false and every action
 * throws FirebaseUnavailableError, so pages can show "not available".
 */
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  TotpMultiFactorGenerator,
  browserLocalPersistence,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getMultiFactorResolver,
  indexedDBLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type Auth,
  type MultiFactorError,
  type MultiFactorResolver,
  type User,
} from "firebase/auth";
import { writeSessionHint } from "./sessionHint";

export class FirebaseUnavailableError extends Error {
  constructor() {
    super("Sign-in is not available.");
    this.name = "FirebaseUnavailableError";
  }
}

export type SignInResult =
  | { status: "signed_in"; user: User }
  | { status: "mfa_required"; resolver: MultiFactorResolver };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readConfig = () => ({
  apiKey: text(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: text(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: text(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  appId: text(import.meta.env.VITE_FIREBASE_APP_ID),
});

export const firebaseAvailable = (): boolean => Object.values(readConfig()).every(Boolean);

let authInstance: Auth | null = null;

const getAuthInstance = (): Auth => {
  if (authInstance) return authInstance;
  if (!firebaseAvailable()) throw new FirebaseUnavailableError();
  const app: FirebaseApp = getApps().length ? getApp() : initializeApp(readConfig());
  // initializeAuth, not getAuth: getAuth adds the popup/redirect sign-in helper,
  // which loads a script from apis.google.com that the Content-Security-Policy
  // does not allow. The site signs in with email, password and TOTP only.
  // Persistence matches getAuth's default: IndexedDB, then localStorage.
  const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  // Only a dev server may point at the emulator; a production build never can.
  const emulator = text(import.meta.env.VITE_FIREBASE_EMULATOR);
  if (import.meta.env.DEV && emulator) {
    connectAuthEmulator(auth, emulator, { disableWarnings: true });
  }
  // Keep the header's signed-in marker in step with Firebase (sign in, sign out,
  // a restored session, or one that ended).
  onAuthStateChanged(auth, (user) => writeSessionHint(Boolean(user)));
  authInstance = auth;
  return auth;
};

export const registerUser = async (email: string, password: string): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(getAuthInstance(), email, password);
  return cred.user;
};

export const signIn = async (email: string, password: string): Promise<SignInResult> => {
  const auth = getAuthInstance();
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { status: "signed_in", user: cred.user };
  } catch (error) {
    if ((error as { code?: string }).code === "auth/multi-factor-auth-required") {
      return { status: "mfa_required", resolver: getMultiFactorResolver(auth, error as MultiFactorError) };
    }
    throw error;
  }
};

export const completeTotp = async (
  resolver: MultiFactorResolver,
  code: string,
): Promise<SignInResult> => {
  const hint = resolver.hints.find((h) => h.factorId === TotpMultiFactorGenerator.FACTOR_ID);
  if (!hint) throw new Error("No authenticator app is set up for this account.");
  const assertion = TotpMultiFactorGenerator.assertionForSignIn(hint.uid, code);
  const cred = await resolver.resolveSignIn(assertion);
  return { status: "signed_in", user: cred.user };
};

export const sendVerification = async (): Promise<void> => {
  const user = getAuthInstance().currentUser;
  if (!user) throw new Error("You need to be signed in first.");
  await sendEmailVerification(user);
};

/** The signed-in user's ID token, or null when nobody is signed in. */
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  const user = getAuthInstance().currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
};

/**
 * Ends the Firebase session: clears the signed-in user from memory and from the
 * browser's saved session (IndexedDB), so a reload or another tab is signed out.
 * Throws if a user is still signed in afterwards.
 */
export const signOut = async (): Promise<void> => {
  const auth = getAuthInstance();
  await firebaseSignOut(auth);
  if (auth.currentUser) throw new Error("Sign-out did not finish. Please try again.");
};

/**
 * Re-reads the user and forces a new ID token so a just-clicked verification link
 * shows up in the token's email_verified claim. Returns user.emailVerified.
 */
export const refreshVerification = async (): Promise<boolean> => {
  const user = getAuthInstance().currentUser;
  if (!user) throw new Error("You need to be signed in first.");
  await user.reload();
  await user.getIdToken(true);
  return user.emailVerified;
};

/**
 * The signed-in user, once Firebase has finished restoring any saved session.
 * Null when nobody is signed in.
 */
export const currentSession = async (): Promise<{ email: string | null; emailVerified: boolean } | null> => {
  const auth = getAuthInstance();
  await auth.authStateReady();
  const user = auth.currentUser;
  return user ? { email: user.email, emailVerified: user.emailVerified } : null;
};
