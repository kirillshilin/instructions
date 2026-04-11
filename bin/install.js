#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DIST_DIR = path.resolve(__dirname, "..", "dist");

const ASSET_TYPES = ["skills", "instructions", "agents"];

// Maps short names and aliases → canonical directory name (shai-*)
const ALIASES = {
  core: "shai-core",
  typescript: "shai-typescript",
  ts: "shai-typescript",
  "shai-ts": "shai-typescript",
  react: "shai-react",
  dotnet: "shai-dotnet",
  nextjs: "shai-nextjs",
  next: "shai-nextjs",
  product: "shai-product",
};

function resolveAlias(name) {
  return ALIASES[name] || name;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function discoverPlugins() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error("Error: dist/ folder not found. Run `npm run build` first.");
    process.exit(1);
  }

  const entries = fs.readdirSync(DIST_DIR, { withFileTypes: true });
  const plugins = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const pluginJsonPath = path.join(DIST_DIR, entry.name, "plugin.json");
    if (fs.existsSync(pluginJsonPath)) {
      const meta = JSON.parse(fs.readFileSync(pluginJsonPath, "utf-8"));
      plugins.push({ dir: entry.name, meta });
    }
  }

  return plugins;
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);

  if (stat.isFile()) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return;
  }

  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src, { withFileTypes: true })) {
      copyRecursive(path.join(src, child.name), path.join(dest, child.name));
    }
  }
}

function installPlugin(plugin, targetDir, dryRun) {
  const pluginDir = path.join(DIST_DIR, plugin.dir);
  const { meta } = plugin;
  let copiedCount = 0;

  for (const assetType of ASSET_TYPES) {
    const assetList = meta[assetType];
    if (!Array.isArray(assetList) || assetList.length === 0) continue;

    const ghAssetDir = path.join(targetDir, ".github", assetType);

    for (const assetPath of assetList) {
      const srcPath = path.join(pluginDir, assetPath);

      if (!fs.existsSync(srcPath)) {
        console.warn(`  ⚠  Missing: ${assetPath} (in ${plugin.dir})`);
        continue;
      }

      const assetName = path.basename(assetPath);
      const destPath = path.join(ghAssetDir, assetName);

      if (dryRun) {
        console.log(`    → .github/${assetType}/${assetName}`);
      } else {
        copyRecursive(srcPath, destPath);
      }
      copiedCount++;
    }
  }

  return copiedCount;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function printUsage() {
  console.log(`
  @shai/instructions — install AI coding assistant plugins

  Usage:
    npx @shai/instructions [options] [plugin...]

  Examples:
    npx @shai/instructions --all              Install all plugins
    npx @shai/instructions shai-core          Install a single plugin
    npx @shai/instructions shai-core shai-ts  Install multiple plugins
    npx @shai/instructions --list             List available plugins
    npx @shai/instructions --all --dry-run     Preview without copying

  Options:
    --all            Install all available plugins
    --list           List available plugins and exit
    --dir <path>     Target directory (default: current working directory)
    --dry-run, -d    Preview what would be installed without copying
    --help           Show this help message
`);
}

function printPluginTable(plugins) {
  console.log("\n  Available plugins:\n");
  for (const p of plugins) {
    const assets = ASSET_TYPES.filter((t) => Array.isArray(p.meta[t]) && p.meta[t].length > 0)
      .map((t) => `${p.meta[t].length} ${t}`)
      .join(", ");
    // Collect aliases for this plugin
    const aliases = Object.entries(ALIASES)
      .filter(([, target]) => target === p.dir)
      .map(([alias]) => alias);
    const aliasSuffix = aliases.length ? `  (${aliases.join(", ")})` : "";
    console.log(`    ${p.meta.name.padEnd(22)} ${(assets || "(empty)").padEnd(30)}${aliasSuffix}`);
  }
  console.log();
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const allPlugins = discoverPlugins();

  if (args.includes("--list")) {
    printPluginTable(allPlugins);
    process.exit(0);
  }

  // Parse --dir
  let targetDir = process.cwd();
  const dirIndex = args.indexOf("--dir");
  if (dirIndex !== -1) {
    targetDir = path.resolve(args[dirIndex + 1] || ".");
    args.splice(dirIndex, 2);
  }

  const installAll = args.includes("--all");
  const dryRun = args.includes("--dry-run") || args.includes("-d");
  const pluginNames = args.filter((a) => !a.startsWith("--") && a !== "-d");

  if (!installAll && pluginNames.length === 0) {
    printUsage();
    printPluginTable(allPlugins);
    process.exit(0);
  }

  // Resolve which plugins to install
  let toInstall;
  if (installAll) {
    toInstall = allPlugins;
  } else {
    toInstall = [];
    for (const name of pluginNames) {
      const resolved = resolveAlias(name);
      const match = allPlugins.find((p) => p.dir === resolved || p.meta.name === resolved);
      if (!match) {
        console.error(`Error: plugin "${name}" not found.`);
        printPluginTable(allPlugins);
        process.exit(1);
      }
      toInstall.push(match);
    }
  }

  if (dryRun) {
    console.log(`\n  Dry run — previewing install to: ${targetDir}\n`);
  } else {
    console.log(`\n  Installing to: ${targetDir}\n`);
  }

  let totalCopied = 0;

  for (const plugin of toInstall) {
    const count = installPlugin(plugin, targetDir, dryRun);
    console.log(`  ✔ ${plugin.meta.name} (${count} asset(s))`);
    totalCopied += count;
  }

  const verb = dryRun ? "would be installed" : "installed";
  console.log(`\n  Done — ${totalCopied} asset(s) ${verb} to .github/\n`);
}

main();
