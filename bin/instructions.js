#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Technology → instruction file mappings
// ---------------------------------------------------------------------------

const COPILOT_MAP = {
  nodejs: [
    'nodejs-scaffold',
    'package-json-scripts',
    'typescript-project',
    'typescript-tests',
    'readme-style',
  ],
  react: [
    'react-components',
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  angular: [
    'angular-components',
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  typescript: [
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  csharp: ['csharp-project', 'csharp-unit-tests', 'readme-style'],
  dotnet: ['csharp-project', 'csharp-unit-tests', 'readme-style'],
  firebase: [
    'typescript-workspace',
    'typescript-project',
    'package-json-scripts',
    'readme-style',
  ],
  tailwind: [
    'react-components',
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  workspace: [
    'typescript-workspace',
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  monorepo: [
    'typescript-workspace',
    'typescript-project',
    'typescript-tests',
    'package-json-scripts',
    'readme-style',
  ],
  playwright: ['typescript-tests', 'package-json-scripts', 'readme-style'],
};

const CLAUDE_MAP = {
  dotnet: {
    agents: [
      'dotnet-architect',
      'dotnet-debugger',
      'dotnet-migrator',
      'dotnet-packager',
      'dotnet-tester',
    ],
    skills: ['add-feature', 'add-migration', 'code-review', 'unit-testing'],
  },
  csharp: {
    agents: [
      'dotnet-architect',
      'dotnet-debugger',
      'dotnet-migrator',
      'dotnet-packager',
      'dotnet-tester',
    ],
    skills: ['add-feature', 'add-migration', 'code-review', 'unit-testing'],
  },
  playwright: {
    agents: ['playwright-architect', 'playwright-debugger', 'playwright-tester'],
    skills: ['debug-e2e-test', 'page-object-model', 'setup-playwright', 'write-e2e-test'],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function relPath(dest) {
  return path.relative(process.cwd(), dest);
}

// ---------------------------------------------------------------------------
// Install Copilot instructions
// ---------------------------------------------------------------------------

function installCopilot(technologies, pkgDir) {
  const destDir = path.join(process.cwd(), '.github', 'instructions');
  fs.mkdirSync(destDir, { recursive: true });

  const files = new Set();
  for (const tech of technologies) {
    const mapped = COPILOT_MAP[tech.toLowerCase()];
    if (mapped) {
      mapped.forEach(f => files.add(f));
    } else {
      console.warn(`⚠  No Copilot instructions found for "${tech}" — skipping`);
    }
  }

  if (files.size === 0) {
    console.error('No instruction files to install.');
    process.exit(1);
  }

  for (const name of files) {
    const src = path.join(pkgDir, `${name}.instructions.md`);
    const dest = path.join(destDir, `${name}.instructions.md`);
    copyFile(src, dest);
    console.log(`  ✓  ${relPath(dest)}`);
  }

  writeVSCodeSettings();
  console.log('\nGitHub Copilot instructions installed successfully.');
  console.log('Open VS Code and use "Chat: Configure Instructions" to verify.');
}

function writeVSCodeSettings() {
  const settingsDir = path.join(process.cwd(), '.vscode');
  const settingsPath = path.join(settingsDir, 'settings.json');

  const required = {
    'github.copilot.chat.codeGeneration.useInstructionFiles': true,
    'chat.includeApplyingInstructions': true,
  };

  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch {
      // Malformed JSON — overwrite with required settings only
    }
  }

  let changed = false;
  for (const [key, value] of Object.entries(required)) {
    if (settings[key] !== value) {
      settings[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.mkdirSync(settingsDir, { recursive: true });
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
    console.log(`  ✓  ${relPath(settingsPath)}`);
  }
}

// ---------------------------------------------------------------------------
// Install Claude instructions
// ---------------------------------------------------------------------------

/** Strip YAML frontmatter from a .instructions.md file and return the body. */
function stripFrontmatter(content) {
  if (!content.startsWith('---')) return content;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\n/, '');
}

function installClaude(technologies, pkgDir) {
  let agentsInstalled = false;
  const claudeMdSections = [];

  for (const tech of technologies) {
    const key = tech.toLowerCase();
    const mapped = CLAUDE_MAP[key];

    // Install Claude-specific agents and skills when available
    if (mapped) {
      for (const agent of mapped.agents || []) {
        const src = path.join(pkgDir, 'claude', 'agents', `${agent}.md`);
        const dest = path.join(process.cwd(), '.claude', 'agents', `${agent}.md`);
        copyFile(src, dest);
        console.log(`  ✓  ${relPath(dest)}`);
        agentsInstalled = true;
      }

      for (const skill of mapped.skills || []) {
        const src = path.join(pkgDir, 'claude', 'skills', skill, 'SKILL.md');
        const dest = path.join(process.cwd(), '.claude', 'skills', skill, 'SKILL.md');
        copyFile(src, dest);
        console.log(`  ✓  ${relPath(dest)}`);
        agentsInstalled = true;
      }
    }

    // Collect Copilot instruction content for CLAUDE.md (works for all techs)
    const copilotFiles = COPILOT_MAP[key];
    if (copilotFiles) {
      const seen = new Set();
      for (const name of copilotFiles) {
        if (seen.has(name)) continue;
        seen.add(name);
        const src = path.join(pkgDir, `${name}.instructions.md`);
        if (fs.existsSync(src)) {
          const body = stripFrontmatter(fs.readFileSync(src, 'utf8')).trim();
          if (body) claudeMdSections.push(body);
        }
      }
    } else if (!mapped) {
      console.warn(`⚠  No instructions found for "${tech}" — skipping`);
    }
  }

  // Write CLAUDE.md with deduplicated instruction content
  if (claudeMdSections.length > 0) {
    writeCLAUDEmd(claudeMdSections, technologies);
  }

  if (!agentsInstalled && claudeMdSections.length === 0) {
    console.error('No Claude files to install.');
    process.exit(1);
  }

  console.log('\nClaude Code instructions installed successfully.');
  console.log('Run "claude" in your project to start using them.');
}

function writeCLAUDEmd(sections, technologies) {
  const dest = path.join(process.cwd(), 'CLAUDE.md');
  const header = `# Coding Instructions\n\n<!-- Generated by: npx instructions ${technologies.join(' ')} --claude -->\n`;

  // Deduplicate sections by content
  const unique = [...new Set(sections)];
  const content = header + '\n' + unique.join('\n\n---\n\n') + '\n';

  fs.writeFileSync(dest, content);
  console.log(`  ✓  ${relPath(dest)}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`
Usage: npx instructions <tech...> [--copilot | --claude]

Technologies:
  nodejs      Node.js project (TypeScript, Jest, ESLint, Prettier)
  react       React components (TypeScript)
  angular     Angular components (TypeScript)
  typescript  TypeScript project
  csharp      C# / .NET project
  dotnet      C# / .NET project (alias for csharp)
  firebase    Firebase + TypeScript workspace
  tailwind    Tailwind CSS (React + TypeScript)
  playwright  Playwright end-to-end testing
  workspace   TypeScript monorepo / workspace
  monorepo    TypeScript monorepo (alias for workspace)

Flags:
  --copilot   Install GitHub Copilot instructions (default)
              Copies .instructions.md files to .github/instructions/
              Writes required keys to .vscode/settings.json
  --claude    Install Claude Code agents and skills
              Copies agent files to .claude/agents/
              Copies skill files to .claude/skills/

Examples:
  npx instructions nodejs
  npx instructions react firebase --claude
  npx instructions angular tailwind
  npx instructions react dotnet --copilot
`);
}

function main() {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const useClaude = argv.includes('--claude');
  const technologies = argv.filter(a => !a.startsWith('--'));

  if (technologies.length === 0) {
    console.error('Error: specify at least one technology.\n');
    printHelp();
    process.exit(1);
  }

  // The package directory (where this script lives under bin/)
  const pkgDir = path.join(__dirname, '..');

  console.log(
    `Installing ${useClaude ? 'Claude' : 'Copilot'} instructions for: ${technologies.join(', ')}\n`
  );

  if (useClaude) {
    installClaude(technologies, pkgDir);
  } else {
    installCopilot(technologies, pkgDir);
  }
}

main();
