#!/usr/bin/env node

/**
 * Build script that copies drafts/ to dist/ and resolves partial references.
 *
 * Partial syntax inside .md files:
 *   {rules/01-naming.rule.md}
 *
 * The path is resolved relative to the file that contains the reference.
 * Partials are inlined recursively (a partial can reference other partials).
 * Files whose names end with `_partial.md` or `.rule.md` are excluded from
 * the build output — they exist only to be composed into instruction files.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "drafts");
const OUT_DIR = path.join(ROOT, "dist");

const PARTIAL_PATTERN = /\{([^}]+\.(rule|partial)\.md)\}/g;

const PARTIAL_FILE_RE = /\.(rule|partial)\.md$/;

function isPartialFile(filePath) {
  return PARTIAL_FILE_RE.test(filePath);
}

function isPartialDir(dirName) {
  return dirName === "rules";
}

/**
 * Resolve all partial references in `content`.
 * `baseDir` is the directory of the file being processed (for relative paths).
 * `seen` tracks visited files to prevent infinite recursion.
 */
function resolvePartials(content, baseDir, seen) {
  return content.replace(PARTIAL_PATTERN, (_match, refPath) => {
    const resolved = path.resolve(baseDir, refPath);

    if (seen.has(resolved)) {
      console.warn(`  ⚠  Circular reference skipped: ${refPath}`);
      return `<!-- circular: ${refPath} -->`;
    }

    if (!fs.existsSync(resolved)) {
      console.warn(`  ⚠  Partial not found: ${refPath} (resolved to ${resolved})`);
      return `<!-- missing: ${refPath} -->`;
    }

    const branch = new Set(seen);
    branch.add(resolved);
    const partialContent = fs.readFileSync(resolved, "utf-8");

    // Recursively resolve any partials inside the included file
    return resolvePartials(partialContent, path.dirname(resolved), branch);
  });
}

/**
 * Recursively copy `srcDir` to `destDir`, processing .md files for partials
 * and skipping partial source files/directories from the output.
 */
function buildDir(srcDir, destDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      // Skip directories that only contain partials (e.g. rules/)
      if (isPartialDir(entry.name)) {
        continue;
      }

      fs.mkdirSync(destPath, { recursive: true });
      buildDir(srcPath, destPath);
      continue;
    }

    // Skip partial source files from output
    if (isPartialFile(entry.name)) {
      continue;
    }

    if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(srcPath, "utf-8");
      const resolved = resolvePartials(raw, path.dirname(srcPath), new Set());
      fs.writeFileSync(destPath, resolved, "utf-8");
      const refCount = (raw.match(PARTIAL_PATTERN) || []).length;
      if (refCount > 0) {
        console.log(`  ✓ ${path.relative(ROOT, destPath)} (${refCount} partial(s) resolved)`);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// --- main ---
console.log("Building instructions…\n");
console.log(`  Source:  ${path.relative(ROOT, SRC_DIR)}/`);
console.log(`  Output:  ${path.relative(ROOT, OUT_DIR)}/\n`);

// Clean previous output
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

buildDir(SRC_DIR, OUT_DIR);

console.log("\nDone ✓");
