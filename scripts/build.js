#!/usr/bin/env node

/**
 * Build script that copies src/ to dist/ and resolves partial references.
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
const { analyzeInstructionSizes, reportInstructionSizes } = require("./budget");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "dist");
const BUDGET_CONFIG_PATH = path.join(ROOT, "budget.yaml");
const TOOL_TYPES = ["instructions", "skills", "agents", "hooks"];
const TOOL_TYPE_CONFIG = {
  instructions: {
    dirName: "instructions",
    include: (entry) => entry.isFile() && entry.name.endsWith(".instructions.md"),
  },
  skills: {
    dirName: "skills",
    include: (entry) => entry.isDirectory(),
  },
  agents: {
    dirName: "agents",
    include: (entry) => entry.isFile() && entry.name.endsWith(".agent.md"),
  },
  hooks: {
    dirName: "hooks",
    include: (entry) => entry.isFile() && entry.name.endsWith(".json"),
  },
};

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
      console.warn(`\x1b[31m  ⚠  Partial not found: ${refPath} (resolved to ${resolved})\x1b[0m`);
      return `<!-- missing: ${refPath} -->`;
    }

    const branch = new Set(seen);
    branch.add(resolved);
    const partialContent = fs.readFileSync(resolved, "utf-8");

    // Recursively resolve any partials inside the included file
    return resolvePartials(partialContent, path.dirname(resolved), branch);
  });
}

function collectPluginTools(pluginSrcDir) {
  const tools = {};

  for (const type of TOOL_TYPES) {
    const { dirName, include } = TOOL_TYPE_CONFIG[type];
    const dirPath = path.join(pluginSrcDir, dirName);

    if (!fs.existsSync(dirPath)) {
      tools[type] = [];
      continue;
    }

    tools[type] = fs
      .readdirSync(dirPath, { withFileTypes: true })
      .filter(include)
      .map((entry) => `${dirName}/${entry.name}`)
      .sort();
  }

  return tools;
}

function getDuplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
      continue;
    }

    seen.add(value);
  }

  return [...duplicates].sort();
}

function validatePluginTools(pluginSrcDir, metadata) {
  const actualTools = collectPluginTools(pluginSrcDir);
  const manifestPath = path.join(pluginSrcDir, "plugin.json");
  const manifestName = path.relative(ROOT, manifestPath);
  const errors = [];

  for (const type of TOOL_TYPES) {
    if (!Object.prototype.hasOwnProperty.call(metadata, type)) {
      errors.push(`Missing explicit "${type}" array.`);
      continue;
    }

    if (!Array.isArray(metadata[type])) {
      errors.push(`"${type}" must be an array.`);
      continue;
    }

    const listedTools = metadata[type];
    const listedToolSet = new Set(listedTools);
    const actualToolSet = new Set(actualTools[type]);
    const duplicates = getDuplicateValues(listedTools);

    for (const duplicate of duplicates) {
      errors.push(`Duplicate ${type} asset entry: ${duplicate}`);
    }

    for (const toolPath of listedTools) {
      const absoluteToolPath = path.join(pluginSrcDir, toolPath);

      if (!fs.existsSync(absoluteToolPath)) {
        errors.push(`Listed ${type} asset is missing: ${toolPath}`);
        continue;
      }

      if (!actualToolSet.has(toolPath)) {
        errors.push(`Listed ${type} asset has an unsupported path: ${toolPath}`);
      }
    }

    for (const toolPath of actualTools[type]) {
      if (!listedToolSet.has(toolPath)) {
        errors.push(`Unlisted ${type} asset found in plugin folder: ${toolPath}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid plugin manifest: ${manifestName}\n${errors.map((error) => `  - ${error}`).join("\n")}`);
  }
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

    if (entry.name === "plugin.json") {
      const metadata = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
      validatePluginTools(srcDir, metadata);
      fs.writeFileSync(destPath, JSON.stringify(metadata, null, 2) + "\n", "utf-8");
    } else if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(srcPath, "utf-8");
      const resolved = resolvePartials(raw, path.dirname(srcPath), new Set());
      fs.writeFileSync(destPath, resolved, "utf-8");
      const refCount = (raw.match(PARTIAL_PATTERN) || []).length;
      if (refCount > 0) {
        console.log(`  ✔ ${path.relative(ROOT, destPath)} (${refCount} partial(s) resolved)`);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function main() {
  console.log("Building instructions…\n");
  console.log(`  Source:  ${path.relative(ROOT, SRC_DIR)}/`);
  console.log(`  Output:  ${path.relative(ROOT, OUT_DIR)}/\n`);

  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  buildDir(SRC_DIR, OUT_DIR);

  console.log();

  const instructionSizeSummary = analyzeInstructionSizes({
    distDir: OUT_DIR,
    configPath: BUDGET_CONFIG_PATH,
  });
  reportInstructionSizes(instructionSizeSummary);

  if (instructionSizeSummary.errors.length > 0) {
    console.error("Build failed: instruction size budget exceeded.");
    process.exit(1);
  }

  console.log("Done ✅");
}

if (require.main === module) {
  main();
}

module.exports = {
  buildDir,
  collectPluginTools,
  main,
  resolvePartials,
  validatePluginTools,
};
