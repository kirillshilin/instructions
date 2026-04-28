#!/usr/bin/env node

/**
 * Generates reference.g.md from per-asset frontmatter in src/.
 *
 * Walks every plugin directory, reads frontmatter from:
 *   - instructions/*.instructions.md
 *   - skills/*\/SKILL.md
 *
 * Writes reference.g.md to the repository root.
 */

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src");
const OUT_FILE = path.join(ROOT, "reference.g.md");

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\n---\r?\n?/;

const STATUS_EMOJI = {
  done: "🟢",
  draft: "🟡",
  "not-started": "🔴",
};

/** Parse YAML frontmatter from a file. Returns {} if none. */
function readFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf-8");
  const match = content.match(FRONTMATTER_RE);
  if (!match) return {};
  try {
    return YAML.parse(match[1]) || {};
  } catch {
    return {};
  }
}

/** Capitalize first letter. */
function cap(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

/** Format status as emoji + text. */
function statusEmoji(status) {
  return STATUS_EMOJI[status] ?? "🔴";
}

/** Collect assets for a plugin directory. */
function collectPlugin(pluginDir) {
  const pluginJsonPath = path.join(pluginDir, "plugin.json");
  if (!fs.existsSync(pluginJsonPath)) return null;

  const pluginMeta = JSON.parse(fs.readFileSync(pluginJsonPath, "utf-8"));
  const instructions = [];
  const skills = [];

  // instructions/
  const instrDir = path.join(pluginDir, "instructions");
  if (fs.existsSync(instrDir)) {
    const files = fs.readdirSync(instrDir).filter((f) => f.endsWith(".instructions.md"));
    for (const f of files) {
      const fm = readFrontmatter(path.join(instrDir, f));
      instructions.push({ file: f, ...fm });
    }
  }

  // skills/
  const skillsDir = path.join(pluginDir, "skills");
  if (fs.existsSync(skillsDir)) {
    const dirs = fs
      .readdirSync(skillsDir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
    for (const d of dirs) {
      const fm = readFrontmatter(path.join(skillsDir, d, "SKILL.md"));
      skills.push({ dir: d, ...fm });
    }
  }

  return { meta: pluginMeta, instructions, skills };
}

/** Sort assets by their ID string (numeric-aware within the same prefix). */
function sortById(assets) {
  return [...assets].sort((a, b) => {
    const idA = a.id ?? "zzz";
    const idB = b.id ?? "zzz";
    return idA.localeCompare(idB, undefined, { numeric: true });
  });
}

/** Render the ASCII tree block. */
function renderTree(plugins) {
  const lines = ["shai/"];
  for (const { meta, instructions, skills } of plugins) {
    lines.push(`├── ${meta.name}/`);
    const hasInstructions = instructions.length > 0;
    const hasSkills = skills.length > 0;
    if (hasInstructions) {
      const instrPrefix = hasSkills ? "├──" : "└──";
      lines.push(`│   ${instrPrefix} instructions/`);
      const instrLinePrefix = hasSkills ? "│   │" : "│    ";
      for (const instr of sortById(instructions)) {
        const id = instr.id ?? "?";
        const name = instr.name ?? instr.file?.replace(".instructions.md", "") ?? "?";
        const emoji = statusEmoji(instr.status);
        const priority = cap(instr.priority) ?? "?";
        lines.push(`${instrLinePrefix}   ├── ${id.padEnd(6)}  ${name.padEnd(36)} ${emoji}  ${priority}`);
      }
    }
    if (hasSkills) {
      lines.push("│   └── skills/");
      for (const skill of sortById(skills)) {
        const id = skill.id ?? "?";
        const name = skill.name ?? skill.dir ?? "?";
        const emoji = statusEmoji(skill.status);
        const priority = cap(skill.priority) ?? "?";
        lines.push(`│       ├── ${id.padEnd(6)}  ${name.padEnd(36)} ${emoji}  ${priority}`);
      }
    }
  }
  return lines.join("\n");
}

/** Render per-plugin sections. */
function renderPluginSections(plugins) {
  const sections = [];
  let sectionNum = 1;

  for (const { meta, instructions, skills } of plugins) {
    const lines = [];
    lines.push(`## ${sectionNum}. ${meta.name}`);
    lines.push("");
    if (meta.description) {
      lines.push(meta.description);
      lines.push("");
    }

    let subSection = 1;

    if (instructions.length > 0) {
      lines.push(`### ${sectionNum}.${subSection} Instructions`);
      subSection++;
      lines.push("");
      lines.push(
        "| #     | Tool Name | applyTo | Priority | Status | Related |",
      );
      lines.push(
        "| ----- | --------- | ------- | -------- | ------ | ------- |",
      );
      for (const instr of sortById(instructions)) {
        const id = instr.id ?? "?";
        const name = `\`${instr.name ?? instr.file?.replace(".instructions.md", "") ?? "?"}\``;
        const applyTo = instr.applyTo ?? "";
        const priority = cap(instr.priority) ?? "?";
        const emoji = statusEmoji(instr.status);
        const related = Array.isArray(instr.related) ? instr.related.join(", ") : (instr.related ?? "");
        lines.push(`| ${id} | ${name} | \`${applyTo}\` | ${priority} | ${emoji} | ${related} |`);
      }
      lines.push("");
    }

    if (skills.length > 0) {
      lines.push(`### ${sectionNum}.${subSection} Skills`);
      lines.push("");
      lines.push("| #     | Tool Name | Priority | Status | Related |");
      lines.push("| ----- | --------- | -------- | ------ | ------- |");
      for (const skill of sortById(skills)) {
        const id = skill.id ?? "?";
        const name = `\`${skill.name ?? skill.dir ?? "?"}\``;
        const priority = cap(skill.priority) ?? "?";
        const emoji = statusEmoji(skill.status);
        const related = Array.isArray(skill.related) ? skill.related.join(", ") : (skill.related ?? "");
        lines.push(`| ${id} | ${name} | ${priority} | ${emoji} | ${related} |`);
      }
      lines.push("");
    }

    lines.push("---");
    lines.push("");
    sections.push(lines.join("\n"));
    sectionNum++;
  }

  return sections.join("\n");
}

// --- main ---

const pluginDirs = fs
  .readdirSync(SRC_DIR, { withFileTypes: true })
  .filter((e) => e.isDirectory() && e.name.startsWith("shai-"))
  .map((e) => e.name)
  .sort();

const plugins = pluginDirs
  .map((name) => collectPlugin(path.join(SRC_DIR, name)))
  .filter(Boolean);

const tree = renderTree(plugins);
const sections = renderPluginSections(plugins);

const output = `<!-- AUTOGENERATED by \`npm run reference\` — do not edit by hand -->

# SHAI — Tool Reference (generated)

## Tool Tree

\`\`\`
${tree}
\`\`\`

---

${sections}`;

fs.writeFileSync(OUT_FILE, output, "utf-8");
console.log(`✅  reference.g.md written to ${path.relative(ROOT, OUT_FILE)}`);
