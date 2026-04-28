#!/usr/bin/env node

// Recursively analyses all *.md files in a given folder and produces
// a hierarchy tree of files, folders (optional), and Markdown headers.
//
// Usage:
//   node scripts/build-md-tree.js <folder> [options]
//
// Options:
//   --no-folders         Exclude folder nodes from the output
//   --no-file-names      Exclude file name nodes; headers rendered inline
//   --max-depth N        Limit header depth to N (e.g. 3 = up to ###)
//   --include PATTERN    Only include files matching pattern (glob syntax)
//   --exclude PATTERN    Exclude files matching pattern (glob syntax)
//   -o, --output P       Output file path (default: output.md)
//
// Examples:
//   node scripts/build-md-tree.js src
//   node scripts/build-md-tree.js src --no-folders
//   node scripts/build-md-tree.js skills --include "**/SKILL.md"
//   node scripts/build-md-tree.js src --exclude "*.rule.md"

const fs = require("fs");
const path = require("path");

// ── CLI parsing ──────────────────────────────────────────────────────────────

/**
 * Glob-like pattern matcher for simple file patterns.
 * Supports: *, **, ?
 */
function matchesPattern(filePath, pattern) {
  // Normalize path separators to forward slashes
  const normalized = filePath.replace(/\\/g, "/");
  const patternNorm = pattern.replace(/\\/g, "/");

  // Convert glob pattern to regex source.
  // Rules:
  // - *  matches within a segment (not '/').
  // - ** matches across segments.
  // - ?  matches one char within a segment.
  let source = "";
  for (let i = 0; i < patternNorm.length; i++) {
    const char = patternNorm[i];

    if (char === "*") {
      const next = patternNorm[i + 1];
      if (next === "*") {
        const after = patternNorm[i + 2];
        // "**/" should match zero or more directories.
        if (after === "/") {
          source += "(?:.*/)?";
          i += 2;
        } else {
          source += ".*";
          i += 1;
        }
      } else {
        source += "[^/]*";
      }
      continue;
    }

    if (char === "?") {
      source += "[^/]";
      continue;
    }

    if ("()[]{}.+^$|\\".includes(char)) {
      source += "\\" + char;
    } else {
      source += char;
    }
  }

  // If no slash is present, match against any path segment.
  const hasSlash = patternNorm.includes("/");
  const regex = hasSlash ? `^${source}$` : `^(?:.*/)?${source}$`;

  try {
    return new RegExp(regex, "i").test(normalized);
  } catch (e) {
    console.error(`Pattern regex error for "${pattern}":`, e.message);
    return false;
  }
}

const args = process.argv.slice(2);

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  console.log(
    [
      "Usage: node scripts/build-md-tree.js <folder> [options]",
      "",
      "Options:",
      "  --no-folders      Exclude folder nodes from the output",
      "  --no-file-names   Exclude file name nodes; headers rendered inline",
      "  --max-depth N     Limit header depth (e.g. 3 = up to ###)",
      "  --include PATTERN Only include files matching pattern (glob syntax)",
      "  --exclude PATTERN Exclude files matching pattern (glob syntax)",
      "  -o, --output P    Output file path (default: output.md)",
      "  -h, --help        Show this help message",
    ].join("\n"),
  );
  process.exit(0);
}

function parseArgs(argv) {
  const opts = {
    includeFolders: true,
    includeFileNames: true,
    maxDepth: 8,
    output: "output.md",
    folder: null,
    includePatterns: [],
    excludePatterns: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--no-folders") {
      opts.includeFolders = false;
    } else if (arg === "--no-file-names") {
      opts.includeFileNames = false;
    } else if (arg === "--include") {
      opts.includePatterns.push(argv[++i]);
    } else if (arg === "--exclude") {
      opts.excludePatterns.push(argv[++i]);
    } else if (arg === "--max-depth") {
      const val = parseInt(argv[++i], 10);
      if (isNaN(val) || val < 1) {
        console.error("Error: --max-depth requires a positive integer");
        process.exit(1);
      }
      opts.maxDepth = val;
    } else if (arg === "-o" || arg === "--output") {
      opts.output = argv[++i];
      if (!opts.output) {
        console.error("Error: -o / --output requires a file path");
        process.exit(1);
      }
    } else if (!arg.startsWith("-")) {
      opts.folder = arg;
    }
  }

  if (!opts.folder) {
    console.error("Error: please provide a folder path");
    process.exit(1);
  }

  return opts;
}

const opts = parseArgs(args);
const targetDir = path.resolve(opts.folder);

if (!fs.existsSync(targetDir) || !fs.statSync(targetDir).isDirectory()) {
  console.error(`Error: "${opts.folder}" is not a valid directory`);
  process.exit(1);
}

// ── Header extraction ────────────────────────────────────────────────────────

const HEADER_RE = /^(#{1,6})\s+(.+)$/;

function extractHeaders(filePath, maxDepth) {
  const content = fs.readFileSync(filePath, "utf-8");
  const rawLines = content.split("\n");
  const totalLines = rawLines.length;
  const headers = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].replace(/\r$/, "");
    const match = line.match(HEADER_RE);
    if (match) {
      const level = match[1].length;
      if (level <= maxDepth) {
        headers.push({ level, text: match[2].trim(), lineStart: i + 1 });
      }
    }
  }

  // Compute line count per section: lines from this header until the next
  // header of equal or higher importance (lower or equal level number), or EOF.
  for (let i = 0; i < headers.length; i++) {
    let end;
    if (i === headers.length - 1) {
      end = totalLines;
    } else {
      // Find next header at same or higher level (smaller or equal level number)
      let j = i + 1;
      while (j < headers.length && headers[j].level > headers[i].level) j++;
      end = j < headers.length ? headers[j].lineStart - 1 : totalLines;
    }
    headers[i].lines = end - headers[i].lineStart + 1;
  }

  return { headers, totalLines };
}

// ── Tree building ────────────────────────────────────────────────────────────

/**
 * Build a nested tree structure from the filesystem.
 * Each node: { name, type: 'dir'|'file', children?, headers? }
 */
function buildTree(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true }).sort((a, b) => {
    // Directories first, then files; alphabetical within each group
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const children = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const relPath = path.relative(targetDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      const subtree = buildTree(fullPath);
      // Only include directories that contain at least one .md file (recursively)
      if (subtree.length > 0) {
        children.push({ name: entry.name, type: "dir", children: subtree });
      }
    } else if (entry.name.endsWith(".md")) {
      // Check include/exclude patterns
      if (opts.includePatterns.length > 0) {
        const matches = opts.includePatterns.some((p) => matchesPattern(relPath, p));
        if (!matches) continue;
      }
      if (opts.excludePatterns.length > 0) {
        const matches = opts.excludePatterns.some((p) => matchesPattern(relPath, p));
        if (matches) continue;
      }

      const { headers, totalLines } = extractHeaders(fullPath, opts.maxDepth);
      children.push({ name: entry.name, type: "file", headers, totalLines });
    }
  }

  return children;
}

// ── Rendering ────────────────────────────────────────────────────────────────

const INDENT = "  ";
const BRANCH = "├── ";
const LAST_BRANCH = "└── ";
const PIPE = "│   ";
const EMPTY = "    ";

/**
 * Render a list of { level, text, lines } headers as a proper nested tree at `prefix`.
 * Returns array of { text, count } objects.
 */
function renderHeaderTree(headers, prefix) {
  if (headers.length === 0) return [];

  const root = { children: [] };
  const stack = [{ node: root, level: 0 }];

  for (const h of headers) {
    const treeNode = { level: h.level, text: h.text, lines: h.lines, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].level >= h.level) stack.pop();
    stack[stack.length - 1].node.children.push(treeNode);
    stack.push({ node: treeNode, level: h.level });
  }

  function renderNodes(nodes, pfx) {
    const out = [];
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const isLast = i === nodes.length - 1;
      const connector = isLast ? LAST_BRANCH : BRANCH;
      const childPfx = pfx + (isLast ? EMPTY : PIPE);
      const hashes = "#".repeat(n.level);
      out.push({ text: `${pfx}${connector}${hashes} ${n.text}`, count: n.lines });
      if (n.children.length > 0) out.push(...renderNodes(n.children, childPfx));
    }
    return out;
  }

  return renderNodes(root.children, prefix);
}

function renderTree(nodes, prefix) {
  const out = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLast = i === nodes.length - 1;
    const connector = isLast ? LAST_BRANCH : BRANCH;
    const childPrefix = prefix + (isLast ? EMPTY : PIPE);

    if (node.type === "dir") {
      if (opts.includeFolders) {
        out.push({ text: `${prefix}${connector}📁 ${node.name}/`, count: null });
        out.push(...renderTree(node.children, childPrefix));
      } else {
        out.push(...renderTree(node.children, prefix));
      }
    } else {
      if (opts.includeFileNames) {
        out.push({ text: `${prefix}${connector}📄 ${node.name}`, count: node.totalLines });
        out.push(...renderHeaderTree(node.headers, childPrefix));
      } else {
        out.push(...renderHeaderTree(node.headers, prefix));
      }
    }
  }

  return out;
}

/**
 * Collect all headers in document order from the tree (depth-first, files sorted).
 * Returns a flat array of { level, text }.
 */
function collectAllHeaders(nodes) {
  const headers = [];
  for (const node of nodes) {
    if (node.type === "dir") {
      headers.push(...collectAllHeaders(node.children));
    } else {
      headers.push(...node.headers);
    }
  }
  return headers;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const tree = buildTree(targetDir);
const rootName = path.basename(targetDir);

/** @type {{ text: string, count: number|null }[]} */
let rows;
if (!opts.includeFolders && !opts.includeFileNames) {
  const allHeaders = collectAllHeaders(tree);
  rows = [{ text: `📁 ${rootName}/`, count: null }, ...renderHeaderTree(allHeaders, "")];
} else {
  rows = [{ text: `📁 ${rootName}/`, count: null }, ...renderTree(tree, "")];
}

// Right-align counts: pad each text to a common width, then append the count
const COL_WIDTH = Math.max(...rows.map((r) => r.text.length)) + 2;
const output =
  rows
    .map(({ text, count }) => {
      if (count == null) return text;
      // Measure visible length (strip emoji which are 2 chars wide in most fonts but 1 in JS)
      const padding = COL_WIDTH - text.length;
      return `${text}${" ".repeat(Math.max(1, padding))}${count}`;
    })
    .join("\n") + "\n";

const outputPath = path.resolve(opts.output);
fs.writeFileSync(outputPath, output, "utf-8");

console.log(`Tree written to ${outputPath}`);
