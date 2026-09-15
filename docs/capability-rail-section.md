# Capability rail (`CapabilityRailSection.tsx`)

Light homepage band (`#capabilities`) with four jump links into the product splits.

## Content

Kicker **Capabilities**. Heading: *One Workspace, Four Features that Give you Time Back.*

Cards (icon, title, short body) link to:

| Card | Target |
|------|--------|
| Application & intake | `#intake` |
| Income & program fit | `#income` |
| Conditions & follow-up | `#conditions` |
| Pipeline & hard dates | `#pipeline` |

## Layout

`.v4-cols-4` inside `.v4-rail`. Hover uses `.v4-lift` (border + shadow; translate only when motion is allowed).

Breakpoints: four columns → two under 1100px → one under 720px.
