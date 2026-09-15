# Closed (`ClosedSection.tsx`)

Homepage production history band (`#closed`). Replaces the old Production Glance placement on the home tree.

## Layout

`.v4-split--flip`: editorial photo (pipeline asset from [`photos.ts`](../src/config/photos.ts), caption *Every file, one view*) then copy + three stat cards (Volume 12, Avg. size $385K, Days to close 32).

The photo uses `.v4-closed-photo`: `object-fit: cover` in a **4 / 3** frame (`min-height` 16rem, `max-height` 32.5rem) so a wide stacked layout does not letterbox the crop. `object-position: 52% 18%` pins the crown of hair and face as the focal point when any remaining cover-crop happens.

Under 1100px the photo stacks below the copy. Stat tiles use `.v4-cols-3` → two columns under 1280px when they sit in a split copy column → two columns under 1100px when stacked → one under 720px.
