import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const dir = path.join("public", "images", "team");
const pngs = (await readdir(dir)).filter((name) => name.toLowerCase().endsWith(".png"));

await Promise.all(
  pngs.map(async (name) => {
    const slug = name.slice(0, -4);
    const source = sharp(path.join(dir, name)).rotate().resize(440, 550, {
      fit: "cover",
      position: "centre",
    });
    await source.clone().webp({ quality: 78, effort: 6 }).toFile(path.join(dir, `${slug}.webp`));
    await source.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(dir, `${slug}.jpg`));
  }),
);

console.log(`Wrote webp + jpeg for ${pngs.length} portraits (440×550).`);
