# Team section (`TeamSection.tsx`)

Renders **`#team`** on the dedicated **[`/team`](./team-page.md)** page (not on the homepage). Seven people on a **clay / neumorphic** band (same language as Production Glance).

## Layout

- Surface: `.section-neu` clay; portraits in `.neu-pad` frames; padding `py-36 sm:pb-48 sm:pt-40`
- Desktop content rail capped at **`max-w-5xl`**
- Intro eyebrow + **`OUR TEAM`** stay in a centered `max-w-3xl` block; subtitle spans the full **`max-w-5xl`** rail on desktop so it doesn’t orphan a single word on the second line
- Subtitle line break after **“platform”** when the team rail is too narrow for four cards (`@container/team` + `@max-[979px]/team:block` on the `<br>` — matches `4 × 14rem + 3 × 1.75rem` card/gap math); stays split on all smaller viewports
- Single `flex-wrap` row — no horizontal overflow
- Mobile: two columns (`calc(50% - 0.75rem)`)
- `sm+`: fixed card widths (`13rem` / `14rem`)
- Portraits **4:5**, capped at 220px wide, `object-cover object-center`, 5px ERP bar along the bottom edge
- Name/title plate: same `.neu-pad` clay extrusion as Production Glance (no white fill); `0.9rem` corners; type unchanged (ink name, ERP title)

## Order & images

| Order | Name | Title | File |
| --- | --- | --- | --- |
| 1 | Yeqiao Guo | Chief Executive Officer | `yeqiao-guo.png` |
| 2 | James Jones | Chief Operating Officer | `james-jones.png` |
| 3 | Zhen Wu | Chief Financial Officer | `zhen-wu.png` |
| 4 | Erik Ruiz | Chief Information Security Officer | `erik-ruiz.png` |
| 5 | Grace Hechavarria | Chief Information Officer | `grace-hechavarria.png` |
| 6 | Joanne Rossi | Chief Quality and Compliance Officer | `joanne-rossi.png` |
| 7 | Andrew Li | SVP Product Development | `andrew-li.png` |

Paths: `/images/team/{slug}.webp` (JPEG fallback `.jpg`). Source PNGs stay in the folder for [`optimize-team-photos.md`](./optimize-team-photos.md); the page does not load them. Missing images fall back to initials.
