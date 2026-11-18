import { afterEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { readSessionHint, useSessionHint, writeSessionHint } from "./sessionHint";

afterEach(() => window.localStorage.clear());

describe("session hint", () => {
  it("is off until written, and follows writes in the same tab", () => {
    const { result } = renderHook(() => useSessionHint());
    expect(result.current).toBe(false);
    act(() => writeSessionHint(true));
    expect(result.current).toBe(true);
    expect(readSessionHint()).toBe(true);
    act(() => writeSessionHint(false));
    expect(result.current).toBe(false);
  });

  it("follows another tab signing in or out", () => {
    const { result } = renderHook(() => useSessionHint());
    act(() => {
      window.localStorage.setItem("mooric.signedIn", "1");
      window.dispatchEvent(new StorageEvent("storage", { key: "mooric.signedIn" }));
    });
    expect(result.current).toBe(true);
  });
});
