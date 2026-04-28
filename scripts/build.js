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
const YAML = require("yaml");
const { analyzeInstructionSizes, reportInstructionSizes } = require("./budget");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUT_DIR = path.join(ROOT, "dist");
const BUDGET_CONFIG_PATH = path.join(ROOT, "budget.yaml");

const PARTIAL_PATTERN = /\{([^}]+\.(rule|partial)\.md)\}/g;

const PARTIAL_FILE_RE = /\.(rule|partial)\.md$/;

const FRONTMATTER_RE = /^---\r?\n[\s\S]*?\n---\r?\n?/;

/**
 * Strip YAML frontmatter from `content` if present.
 * Frontmatter is a `---`-delimited block at the very start of the file.
 */
function stripFrontmatter(content) {
  return content.replace(FRONTMATTER_RE, "");
}

/**
 * Parse the YAML frontmatter of `content` and return it as an object.
 * Returns null if no frontmatter is present or if parsing fails.
 */
function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\n---\r?\n?/);
  if (!match) return null;
  try {
    return YAML.parse(match[1]);
  } catch {
    return null;
  }
}

/**
 * Return "Instruction" or "Skill" based on the asset ID pattern.
 * IDs follow the format `{PREFIX}-I{N}` for instructions and `{PREFIX}-S{N}` for skills.
 */
function assetTypeLabel(id) {
  if (/^[A-Z]+-I\d+/.test(id)) return "Instruction";
  if (/^[A-Z]+-S\d+/.test(id)) return "Skill";
  return "Asset";
}

/**
 * Scan all instruction and skill source files under `srcDir` and return a map
 * of asset ID → { name, type } for use when generating Related sections.
 */
function buildAssetIndex(srcDir) {
  const index = {};

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.endsWith(".instructions.md") || entry.name === "SKILL.md") {
        const content = fs.readFileSync(fullPath, "utf-8");
        const fm = parseFrontmatter(content);
        if (fm && fm.id && fm.name) {
          index[fm.id] = {
            name: fm.name,
            type: assetTypeLabel(fm.id),
          };
        }
      }
    }
  }

  scan(srcDir);
  return index;
}

/**
 * Generate a `## Related` section for the given list of related asset IDs.
 * Unknown IDs are omitted from the output (they are reported as warnings separately).
 * Returns an empty string if `relatedIds` is empty or all IDs are unknown.
 */
function generateRelatedSection(relatedIds, assetIndex) {
  if (!Array.isArray(relatedIds) || relatedIds.length === 0) return "";

  const lines = relatedIds
    .filter((id) => assetIndex[id])
    .map((id) => {
      const asset = assetIndex[id];
      return `- ${asset.type}: \`${asset.name}\` (${id})`;
    });

  if (lines.length === 0) return "";

  return "\n\n## Related\n\n" + lines.join("\n") + "\n";
}

/**
 * Validate that every ID in `relatedIds` exists in `assetIndex`.
 * Returns an array of warning strings for any unknown IDs.
 */
function validateRelatedIds(assetId, relatedIds, assetIndex) {
  const warnings = [];
  for (const relId of relatedIds) {
    if (!assetIndex[relId]) {
      warnings.push(`  ⚠  ${assetId}: related ID "${relId}" not found in asset index`);
    }
  }
  return warnings;
}

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
    const rawPartial = fs.readFileSync(resolved, "utf-8");
    // Strip frontmatter from partials before inlining so metadata is not
    // embedded in the resolved output.
    const partialContent = stripFrontmatter(rawPartial);

    // Recursively resolve any partials inside the included file
    return resolvePartials(partialContent, path.dirname(resolved), branch);
  });
}

/**
 * Scan a plugin source directory and collect its tools automatically.
 * Returns an object with `instructions`, `skills`, `hooks`, and `agents` arrays
 * containing plugin-relative paths (e.g. "skills/shai-code-review").
 */
function collectPluginTools(pluginSrcDir) {
  const tools = {};

  // instructions/ — collect *.instructions.md files
  const instructionsDir = path.join(pluginSrcDir, "instructions");
  if (fs.existsSync(instructionsDir)) {
    const files = fs.readdirSync(instructionsDir).filter((f) => f.endsWith(".instructions.md"));
    if (files.length > 0) {
      tools.instructions = files.map((f) => `instructions/${f}`);
    }
  }

  // skills/ — collect subdirectories (each skill is a directory)
  const skillsDir = path.join(pluginSrcDir, "skills");
  if (fs.existsSync(skillsDir)) {
    const dirs = fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    if (dirs.length > 0) {
      tools.skills = dirs.map((d) => `skills/${d}`);
    }
  }

  // hooks/ — collect *.json files and any subdirectories (e.g. scripts/)
  const hooksDir = path.join(pluginSrcDir, "hooks");
  if (fs.existsSync(hooksDir)) {
    const entries = fs.readdirSync(hooksDir, { withFileTypes: true });
    const hookPaths = [];
    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith(".json")) {
        hookPaths.push(`hooks/${entry.name}`);
      } else if (entry.isDirectory()) {
        hookPaths.push(`hooks/${entry.name}`);
      }
    }
    if (hookPaths.length > 0) {
      tools.hooks = hookPaths;
    }
  }

  // agents/ — collect *.agent.md files
  const agentsDir = path.join(pluginSrcDir, "agents");
  if (fs.existsSync(agentsDir)) {
    const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".agent.md"));
    if (files.length > 0) {
      tools.agents = files.map((f) => `agents/${f}`);
    }
  }

  return tools;
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
      // Enrich plugin.json with auto-collected tools from the plugin's src directory
      const metadata = JSON.parse(fs.readFileSync(srcPath, "utf-8"));
      const collected = collectPluginTools(srcDir);
      const enriched = Object.assign({}, metadata, collected);
      fs.writeFileSync(destPath, JSON.stringify(enriched, null, 2), "utf-8");
    } else if (entry.name.endsWith(".md")) {
      const raw = fs.readFileSync(srcPath, "utf-8");
      const resolved = resolvePartials(raw, path.dirname(srcPath), new Set());
      let output = stripFrontmatter(resolved);

      // Append auto-generated ## Related section for instructions and skills
      const isInstruction = entry.name.endsWith(".instructions.md");
      const isSkill = entry.name === "SKILL.md";
      if (isInstruction || isSkill) {
        const fm = parseFrontmatter(raw);
        if (fm && Array.isArray(fm.related) && fm.related.length > 0) {
          const warnings = validateRelatedIds(fm.id || path.relative(ROOT, srcPath), fm.related, assetIndex);
          for (const w of warnings) {
            console.warn(`\x1b[33m${w}\x1b[0m`);
            relatedValidationWarnings.push(w);
          }
          output = output.trimEnd() + generateRelatedSection(fm.related, assetIndex);
        }
      }

      fs.writeFileSync(destPath, output, "utf-8");
      const refCount = (raw.match(PARTIAL_PATTERN) || []).length;
      if (refCount > 0) {
        console.log(`  ✔ ${path.relative(ROOT, destPath)} (${refCount} partial(s) resolved)`);
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

// Build asset index before processing files so Related sections can be resolved
const assetIndex = buildAssetIndex(SRC_DIR);
const relatedValidationWarnings = [];

// Clean previous output
if (fs.existsSync(OUT_DIR)) {
  fs.rmSync(OUT_DIR, { recursive: true });
}
fs.mkdirSync(OUT_DIR, { recursive: true });

buildDir(SRC_DIR, OUT_DIR);

if (relatedValidationWarnings.length > 0) {
  console.log();
  console.warn("\x1b[33mRelated ID validation warnings:\x1b[0m");
  for (const w of relatedValidationWarnings) {
    console.warn(`\x1b[33m${w}\x1b[0m`);
  }
}

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
