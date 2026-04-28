#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const YAML = require("yaml");

const ROOT = path.resolve(__dirname, "..");
const DIST_DIR = path.join(ROOT, "dist");
const DEFAULT_BUDGET_CONFIG_PATH = path.join(ROOT, "budget.yaml");

function countLines(content) {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r?\n/).length;
}

function globToRegex(glob) {
  let pattern = "";
  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i];
    if (char === "*") {
      if (glob[i + 1] === "*") {
        pattern += ".*";
        i += 1;
        if (glob[i + 1] === "/") {
          i += 1;
        }
      } else {
        pattern += "[^/]*";
      }
    } else if (char === "?") {
      pattern += "[^/]";
    } else if (".+^$(){}|[]\\".includes(char)) {
      pattern += "\\" + char;
    } else {
      pattern += char;
    }
  }
  return new RegExp("^" + pattern + "$");
}

function loadBudgetConfig(configPath = DEFAULT_BUDGET_CONFIG_PATH) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`budget config not found: ${configPath}`);
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  const parsed = YAML.parse(raw);

  if (!parsed || !Array.isArray(parsed.rules)) {
    throw new Error("budget config is invalid: expected a rules array");
  }

  return parsed.rules.map((rule, index) => {
    const label = rule.label || `rule-${index + 1}`;
    const warningThreshold = Number(rule.warningThreshold);
    const errorThreshold = Number(rule.errorThreshold);

    if (!Number.isFinite(warningThreshold) || !Number.isFinite(errorThreshold)) {
      throw new Error(`budget config is invalid for ${label}: thresholds must be numbers`);
    }

    let test;
    if (typeof rule.filePath === "string" && rule.filePath.length > 0) {
      const regex = globToRegex(rule.filePath);
      test = (fileName, relativePath) => regex.test(relativePath.replace(/\\/g, "/"));
    } else if (typeof rule.fileNameRegex === "string" && rule.fileNameRegex.length > 0) {
      const regex = new RegExp(rule.fileNameRegex);
      test = (fileName) => regex.test(fileName);
    } else if (typeof rule.fileName === "string" && rule.fileName.length > 0) {
      test = (fileName) => fileName === rule.fileName;
    } else {
      throw new Error(`budget config is invalid for ${label}: provide filePath, fileNameRegex, or fileName`);
    }

    return {
      label,
      test,
      warningThreshold,
      errorThreshold,
    };
  });
}

function collectInstructionFiles(dirPath, fileRules, rootDir = dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectInstructionFiles(entryPath, fileRules, rootDir));
      continue;
    }

    const relativePath = path.relative(rootDir, entryPath);
    const rule = fileRules.find((item) => item.test(entry.name, relativePath));
    if (rule) {
      files.push({
        filePath: entryPath,
        label: rule.label,
        warningThreshold: rule.warningThreshold,
        errorThreshold: rule.errorThreshold,
      });
    }
  }

  return files;
}

function analyzeInstructionSizes(options = {}) {
  return analyzeBudget({
    distDir: options.distDir,
    configPath: options.configPath,
    includeInstructions: true,
    includeSkills: false,
  });
}

function analyzeBudget(options = {}) {
  const distDir = options.distDir || DIST_DIR;
  const configPath = options.configPath || DEFAULT_BUDGET_CONFIG_PATH;
  const includeInstructions = options.includeInstructions !== false;
  const includeSkills = options.includeSkills === true;

  if (!fs.existsSync(distDir)) {
    throw new Error(`dist directory not found: ${distDir}`);
  }

  const fileRules = loadBudgetConfig(configPath);
  const instructionFiles = collectInstructionFiles(distDir, fileRules);
  const results = instructionFiles
    .filter((item) => {
      if (item.label === "instruction" || item.label === "instruction-exception") {
        return includeInstructions;
      }

      if (item.label === "skill" || item.label === "skill-exception") {
        return includeSkills;
      }

      return false;
    })
    .map((filePath) => {
      const content = fs.readFileSync(filePath.filePath, "utf-8");

      return {
        filePath: filePath.filePath,
        label: filePath.label,
        relativePath: path.relative(ROOT, filePath.filePath),
        lineCount: countLines(content),
        warningThreshold: filePath.warningThreshold,
        errorThreshold: filePath.errorThreshold,
      };
    })
    .sort((left, right) => right.lineCount - left.lineCount);

  const warnings = results.filter((item) => item.lineCount > item.warningThreshold);
  const errors = results.filter((item) => item.lineCount > item.errorThreshold);

  return {
    results,
    warnings,
    errors,
    includeInstructions,
    includeSkills,
  };
}

function formatResult(item) {
  return `${item.relativePath} [${item.label}] (${item.lineCount} lines)`;
}

function reportInstructionSizes(summary) {
  const scopeLabel = summary.includeSkills ? "Instruction/Skill budget report" : "Instruction budget report";
  console.log(`${scopeLabel}:\n`);

  for (const item of summary.results) {
    console.log(`  ${formatResult(item)}`);
  }

  console.log();

  for (const item of summary.warnings) {
    console.warn(`\x1b[33m  Warning: ${formatResult(item)} exceeds ${item.warningThreshold} lines\x1b[0m`);
  }

  for (const item of summary.errors) {
    console.error(`\x1b[31m  Error: ${formatResult(item)} exceeds ${item.errorThreshold} lines\x1b[0m`);
  }

  if (summary.warnings.length > 0 || summary.errors.length > 0) {
    console.log();
  }
}

function parseCliArgs(argv) {
  const hasInstructions = argv.includes("--instructions");
  const hasAll = argv.includes("--all");
  const configArg = argv.find((arg) => arg.startsWith("--config="));
  const configPath = configArg ? path.resolve(configArg.slice("--config=".length)) : undefined;

  if (hasInstructions && hasAll) {
    throw new Error("Use either --instructions or --all, not both.");
  }

  if (hasAll) {
    return {
      configPath,
      includeInstructions: true,
      includeSkills: true,
    };
  }

  return {
    configPath,
    includeInstructions: true,
    includeSkills: false,
  };
}

function main() {
  const options = parseCliArgs(process.argv.slice(2));
  const summary = analyzeBudget(options);
  reportInstructionSizes(summary);

  if (summary.errors.length > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  analyzeBudget,
  analyzeInstructionSizes,
  loadBudgetConfig,
  reportInstructionSizes,
};
