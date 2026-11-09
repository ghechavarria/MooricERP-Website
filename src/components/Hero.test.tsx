import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Hero, HERO_YOUTUBE_ID } from "./Hero";
import { ContactModalProvider } from "../context/ContactModalContext";
import { MemoryRouter } from "react-router-dom";

const renderHero = () =>
  render(
    <MemoryRouter>
      <ContactModalProvider>
        <Hero />
      </ContactModalProvider>
    </MemoryRouter>,
  );

// By attribute: an inert slide is left out of role queries.
const slide = (n: 1 | 2) => document.querySelector(`[aria-roledescription="slide"][aria-label^="${n} of 2"]`) as HTMLElement;
const current = () => document.querySelector("[aria-current]")?.getAttribute("aria-label");

describe("hero carousel", () => {
  it("opens on the overview, with the video slide hidden and inert", () => {
    renderHero();
    expect(current()).toBe("Show slide 1: Overview");
    expect(slide(1).getAttribute("aria-hidden")).toBe("false");
    expect(slide(2).getAttribute("aria-hidden")).toBe("true");
    expect(slide(2).hasAttribute("inert")).toBe(true);
  });

  it("next, previous, dots and arrow keys move between slides, and wrap around", () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(current()).toBe("Show slide 2: Video");
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(current()).toBe("Show slide 1: Overview");
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(current()).toBe("Show slide 2: Video");
    fireEvent.click(screen.getByRole("button", { name: "Show slide 1: Overview" }));
    expect(current()).toBe("Show slide 1: Overview");
    fireEvent.keyDown(slide(1), { key: "ArrowRight" });
    expect(current()).toBe("Show slide 2: Video");
    fireEvent.keyDown(slide(2), { key: "ArrowLeft" });
    expect(current()).toBe("Show slide 1: Overview");
  });

  it("loads nothing from YouTube until play, then uses the no-cookie player; leaving stops it", () => {
    renderHero();
    fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(document.querySelector("iframe")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /play the mooric erp video/i }));
    const frame = document.querySelector("iframe");
    expect(frame?.getAttribute("src")).toBe(
      `https://www.youtube-nocookie.com/embed/${HERO_YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`,
    );
    fireEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("is the BI5DlHQgo5w video", () => {
    expect(HERO_YOUTUBE_ID).toBe("BI5DlHQgo5w");
  });
});
