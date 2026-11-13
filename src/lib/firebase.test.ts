import { beforeEach, describe, expect, it, vi } from "vitest";

const m = vi.hoisted(() => ({
  initializeApp: vi.fn(() => ({ name: "app" })),
  getApps: vi.fn(() => [] as unknown[]),
  getApp: vi.fn(),
  getAuth: vi.fn((): Record<string, unknown> => ({ currentUser: null })),
  connectAuthEmulator: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  sendEmailVerification: vi.fn(),
  getMultiFactorResolver: vi.fn(),
  assertionForSignIn: vi.fn(() => "assertion"),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock("firebase/app", () => ({
  initializeApp: m.initializeApp,
  getApps: m.getApps,
  getApp: m.getApp,
}));
vi.mock("firebase/auth", () => ({
  initializeAuth: m.getAuth,
  indexedDBLocalPersistence: "indexedDB",
  browserLocalPersistence: "localStorage",
  connectAuthEmulator: m.connectAuthEmulator,
  createUserWithEmailAndPassword: m.createUserWithEmailAndPassword,
  signInWithEmailAndPassword: m.signInWithEmailAndPassword,
  sendEmailVerification: m.sendEmailVerification,
  getMultiFactorResolver: m.getMultiFactorResolver,
  signOut: m.signOut,
  onAuthStateChanged: m.onAuthStateChanged,
  TotpMultiFactorGenerator: { FACTOR_ID: "totp", assertionForSignIn: m.assertionForSignIn },
}));

const configure = () => {
  vi.stubEnv("VITE_FIREBASE_API_KEY", "key");
  vi.stubEnv("VITE_FIREBASE_AUTH_DOMAIN", "x.firebaseapp.com");
  vi.stubEnv("VITE_FIREBASE_PROJECT_ID", "proj");
  vi.stubEnv("VITE_FIREBASE_APP_ID", "1:2:web:3");
};

const load = async () => {
  vi.resetModules();
  return import("./firebase");
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
  m.getApps.mockReturnValue([]);
  m.getAuth.mockReturnValue({ currentUser: null });
});

describe("firebase config", () => {
  it("missing config reports not available and nothing throws at import", async () => {
    vi.stubEnv("VITE_FIREBASE_API_KEY", "");
    const fb = await load();
    expect(fb.firebaseAvailable()).toBe(false);
    expect(m.initializeApp).not.toHaveBeenCalled();
    await expect(fb.signIn("a@b.co", "pw")).rejects.toBeInstanceOf(fb.FirebaseUnavailableError);
  });

  it("one missing value is enough to be unavailable", async () => {
    configure();
    vi.stubEnv("VITE_FIREBASE_APP_ID", "");
    const fb = await load();
    expect(fb.firebaseAvailable()).toBe(false);
  });

  it("full config is available", async () => {
    configure();
    const fb = await load();
    expect(fb.firebaseAvailable()).toBe(true);
  });
});

describe("auth setup", () => {
  it("uses initializeAuth without the popup/redirect helper, so nothing loads from apis.google.com", async () => {
    configure();
    const fb = await load();
    await fb.getIdToken();
    expect(m.getAuth).toHaveBeenCalledTimes(1);
    const options = (m.getAuth.mock.calls[0] as unknown[])[1] as Record<string, unknown>;
    expect(options.persistence).toEqual(["indexedDB", "localStorage"]);
    expect(options).not.toHaveProperty("popupRedirectResolver");
  });
});

describe("emulator", () => {
  it("connects in dev when the emulator variable is set", async () => {
    configure();
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_FIREBASE_EMULATOR", "http://127.0.0.1:9099");
    const fb = await load();
    m.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u" } });
    await fb.signIn("a@b.co", "pw");
    expect(m.connectAuthEmulator).toHaveBeenCalledWith(expect.anything(), "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
  });

  it("emulator ignored in production build", async () => {
    configure();
    vi.stubEnv("DEV", false);
    vi.stubEnv("VITE_FIREBASE_EMULATOR", "http://127.0.0.1:9099");
    const fb = await load();
    m.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u" } });
    await fb.signIn("a@b.co", "pw");
    expect(m.connectAuthEmulator).not.toHaveBeenCalled();
  });

  it("dev without the variable does not connect", async () => {
    configure();
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_FIREBASE_EMULATOR", "");
    const fb = await load();
    m.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u" } });
    await fb.signIn("a@b.co", "pw");
    expect(m.connectAuthEmulator).not.toHaveBeenCalled();
  });

  it("initialises the app and emulator once", async () => {
    configure();
    vi.stubEnv("DEV", true);
    vi.stubEnv("VITE_FIREBASE_EMULATOR", "http://127.0.0.1:9099");
    const fb = await load();
    m.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u" } });
    await fb.signIn("a@b.co", "pw");
    await fb.signIn("a@b.co", "pw");
    expect(m.initializeApp).toHaveBeenCalledTimes(1);
    expect(m.connectAuthEmulator).toHaveBeenCalledTimes(1);
  });
});

describe("account actions", () => {
  it("registerUser creates the user", async () => {
    configure();
    const fb = await load();
    const user = { uid: "u" };
    m.createUserWithEmailAndPassword.mockResolvedValue({ user });
    await expect(fb.registerUser("a@b.co", "pw")).resolves.toBe(user);
    expect(m.createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), "a@b.co", "pw");
  });

  it("signIn returns signed_in with the user", async () => {
    configure();
    const fb = await load();
    const user = { uid: "u" };
    m.signInWithEmailAndPassword.mockResolvedValue({ user });
    await expect(fb.signIn("a@b.co", "pw")).resolves.toEqual({ status: "signed_in", user });
  });

  it("mfa challenge surfaces a code prompt", async () => {
    configure();
    const fb = await load();
    const err = Object.assign(new Error("mfa"), { code: "auth/multi-factor-auth-required" });
    const resolver = { hints: [{ uid: "h1", factorId: "totp" }], resolveSignIn: vi.fn() };
    m.signInWithEmailAndPassword.mockRejectedValue(err);
    m.getMultiFactorResolver.mockReturnValue(resolver);
    await expect(fb.signIn("a@b.co", "pw")).resolves.toEqual({ status: "mfa_required", resolver });
    expect(m.getMultiFactorResolver).toHaveBeenCalledWith(expect.anything(), err);
  });

  it("other sign-in errors propagate", async () => {
    configure();
    const fb = await load();
    const err = Object.assign(new Error("bad"), { code: "auth/wrong-password" });
    m.signInWithEmailAndPassword.mockRejectedValue(err);
    await expect(fb.signIn("a@b.co", "pw")).rejects.toBe(err);
  });

  it("completeTotp resolves with the TOTP assertion for the totp hint", async () => {
    configure();
    const fb = await load();
    const user = { uid: "u" };
    const resolver = {
      hints: [
        { uid: "ph", factorId: "phone" },
        { uid: "t1", factorId: "totp" },
      ],
      resolveSignIn: vi.fn().mockResolvedValue({ user }),
    };
    const res = await fb.completeTotp(resolver as never, "123456");
    expect(m.assertionForSignIn).toHaveBeenCalledWith("t1", "123456");
    expect(resolver.resolveSignIn).toHaveBeenCalledWith("assertion");
    expect(res).toEqual({ status: "signed_in", user });
  });

  it("completeTotp fails when no TOTP factor is enrolled", async () => {
    configure();
    const fb = await load();
    const resolver = { hints: [{ uid: "ph", factorId: "phone" }], resolveSignIn: vi.fn() };
    await expect(fb.completeTotp(resolver as never, "123456")).rejects.toThrow(/authenticator/i);
    expect(resolver.resolveSignIn).not.toHaveBeenCalled();
  });

  it("sendVerification emails the current user", async () => {
    configure();
    const user = { uid: "u" };
    m.getAuth.mockReturnValue({ currentUser: user });
    const fb = await load();
    await fb.sendVerification();
    expect(m.sendEmailVerification).toHaveBeenCalledWith(user);
  });

  it("signOut ends the Firebase session", async () => {
    configure();
    const auth: Record<string, unknown> = { currentUser: { uid: "u" } };
    m.getAuth.mockReturnValue(auth);
    m.signOut.mockImplementation(async () => {
      auth.currentUser = null;
    });
    const fb = await load();
    await fb.signOut();
    expect(m.signOut).toHaveBeenCalledWith(auth);
  });

  it("signOut fails loudly if a user is still signed in afterwards", async () => {
    configure();
    m.getAuth.mockReturnValue({ currentUser: { uid: "u" } });
    m.signOut.mockResolvedValue(undefined);
    const fb = await load();
    await expect(fb.signOut()).rejects.toThrow(/did not finish/i);
  });

  it("sendVerification needs a signed-in user and getIdToken is null without one", async () => {
    configure();
    const fb = await load();
    await expect(fb.sendVerification()).rejects.toThrow(/signed in/i);
    await expect(fb.getIdToken()).resolves.toBeNull();
  });

  it("getIdToken returns the user's token and can force refresh", async () => {
    configure();
    const getIdToken = vi.fn().mockResolvedValue("tok");
    m.getAuth.mockReturnValue({ currentUser: { getIdToken } });
    const fb = await load();
    await expect(fb.getIdToken()).resolves.toBe("tok");
    await fb.getIdToken(true);
    expect(getIdToken).toHaveBeenLastCalledWith(true);
  });

  it("refreshVerification reloads, refreshes the token and returns emailVerified", async () => {
    configure();
    const order: string[] = [];
    const user = {
      emailVerified: true,
      reload: vi.fn(async () => void order.push("reload")),
      getIdToken: vi.fn(async () => void order.push("token")),
    };
    m.getAuth.mockReturnValue({ currentUser: user });
    const fb = await load();
    await expect(fb.refreshVerification()).resolves.toBe(true);
    expect(order).toEqual(["reload", "token"]);
    expect(user.getIdToken).toHaveBeenCalledWith(true);
  });

  it("refreshVerification needs a signed-in user", async () => {
    configure();
    const fb = await load();
    await expect(fb.refreshVerification()).rejects.toThrow(/signed in/i);
  });
});

describe("currentSession", () => {
  it("waits for Firebase to restore the user, then reports them", async () => {
    configure();
    const ready = vi.fn().mockResolvedValue(undefined);
    m.getAuth.mockReturnValue({
      authStateReady: ready,
      currentUser: { email: "a@b.co", emailVerified: true },
    });
    const fb = await load();
    await expect(fb.currentSession()).resolves.toEqual({ email: "a@b.co", emailVerified: true });
    expect(ready).toHaveBeenCalled();
  });

  it("is null when nobody is signed in", async () => {
    configure();
    m.getAuth.mockReturnValue({ authStateReady: vi.fn().mockResolvedValue(undefined), currentUser: null });
    const fb = await load();
    await expect(fb.currentSession()).resolves.toBeNull();
  });
});


describe("header sign-in marker", () => {
  it("follows Firebase's sign-in state once auth starts", async () => {
    configure();
    window.localStorage.clear();
    const fb = await load();
    m.signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u" } });
    await fb.signIn("a@b.test", "pw");
    const listener = m.onAuthStateChanged.mock.calls[0][1] as (u: unknown) => void;
    listener({ uid: "u" });
    expect(window.localStorage.getItem("mooric.signedIn")).toBe("1");
    listener(null);
    expect(window.localStorage.getItem("mooric.signedIn")).toBeNull();
  });
});
