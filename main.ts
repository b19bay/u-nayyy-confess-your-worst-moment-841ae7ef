// Confess Your Worst Moment — one-line confession entry.
// Writes the confession to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Erasable TypeScript, standard library only. No network, no clock,
// no randomness, no environment values besides MAKEFUN_OUTPUT_DIR.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I shipped your feature to your competitor's account, marked it delivered, and only noticed when they sent a thank-you note.";

// The line is 123 characters (verified with wc -c); assert it so a
// future edit that changes the text fails loudly instead of silently.
const EXPECTED_BYTES = 123;

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    console.error("MAKEFUN_OUTPUT_DIR is not set");
    process.exit(1);
  }
  // Gate: 1-200 characters, not only whitespace, single line.
  if (LINE.length < 1 || LINE.length > 200) {
    console.error(`line is ${LINE.length} characters, outside the 1-200 gate`);
    process.exit(1);
  }
  if (LINE.trim().length === 0 || LINE.includes("\n")) {
    console.error("line must be non-whitespace and a single line");
    process.exit(1);
  }
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, LINE, "utf8");
  // Read back and verify byte-identical output.
  const written = readFileSync(target, "utf8");
  if (written !== LINE) {
    console.error("read-back mismatch: entry.txt differs from the line");
    process.exit(1);
  }
  if (Buffer.byteLength(written, "utf8") !== EXPECTED_BYTES) {
    console.error(
      `entry is ${Buffer.byteLength(written, "utf8")} bytes, expected ${EXPECTED_BYTES}`,
    );
    process.exit(1);
  }
}

main();
