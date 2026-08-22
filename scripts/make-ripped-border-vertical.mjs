import { readFileSync, writeFileSync } from "node:fs";

writeFileSync(
  "public/images/photos/ripped-border-vertical.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 415 1915" preserveAspectRatio="none"><g transform="translate(415 0) rotate(90)">${readFileSync("public/images/photos/ripped-border.svg", "utf8").replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")}</g></svg>`,
);
