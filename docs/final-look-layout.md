# Site layout

Light v4 homepage (see [v4-homepage.md](./v4-homepage.md)). Header chrome unchanged. Footer is white with the square nav logo — [footer.md](./footer.md).

## Section order

Hero → Overhead (`#problem`) → Capabilities → Intake → Income → Conditions → Pipeline → Memory → Assistant → Closed → LOS banner → Contact

## Notes

- Hero is a light two-column layout with a rounded video card
- Marketing sections use Inter sentence-case headings, JetBrains Mono kickers, and hairline cards
- Closed (`#closed`) carries production stats
- Team uses upright rounded portraits on light cards
- Team is a 4 + 3 centered wrap

## Key files

| Path | Role |
|------|------|
| [`src/App.tsx`](../src/App.tsx) | Section order |
| [`src/index.css`](../src/index.css) | `.v4-*` system + shell |
| [`src/components/ClosedSection.tsx`](../src/components/ClosedSection.tsx) | Closed / production history |
| [`src/components/CapabilityRailSection.tsx`](../src/components/CapabilityRailSection.tsx) | Capability jump cards |
| [`src/components/TeamSection.tsx`](../src/components/TeamSection.tsx) | Team grid |
