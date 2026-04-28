const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");

const { buildDir, collectPluginTools, validatePluginTools } = require("./build");

function createTempPlugin(t) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "shai-build-test-"));
  t.after(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  return tempDir;
}

test("collectPluginTools returns explicit arrays for supported asset types", (t) => {
  const pluginDir = createTempPlugin(t);

  fs.mkdirSync(path.join(pluginDir, "instructions"), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, "skills", "demo-skill"), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, "hooks"), { recursive: true });

  fs.writeFileSync(path.join(pluginDir, "instructions", "demo.instructions.md"), "# demo\n");
  fs.writeFileSync(path.join(pluginDir, "hooks", "demo.json"), "{}\n");

  assert.deepEqual(collectPluginTools(pluginDir), {
    instructions: ["instructions/demo.instructions.md"],
    skills: ["skills/demo-skill"],
    agents: [],
    hooks: ["hooks/demo.json"],
  });
});

test("validatePluginTools accepts manifests with explicit empty arrays", (t) => {
  const pluginDir = createTempPlugin(t);

  fs.mkdirSync(path.join(pluginDir, "instructions"), { recursive: true });
  fs.writeFileSync(path.join(pluginDir, "instructions", "demo.instructions.md"), "# demo\n");

  assert.doesNotThrow(() =>
    validatePluginTools(pluginDir, {
      instructions: ["instructions/demo.instructions.md"],
      skills: [],
      agents: [],
      hooks: [],
    })
  );
});

test("validatePluginTools rejects manifests with missing asset arrays", (t) => {
  const pluginDir = createTempPlugin(t);

  assert.throws(
    () =>
      validatePluginTools(pluginDir, {
        instructions: [],
        skills: [],
        hooks: [],
      }),
    /Missing explicit "agents" array\./
  );
});

test("validatePluginTools rejects unlisted and missing assets", (t) => {
  const pluginDir = createTempPlugin(t);

  fs.mkdirSync(path.join(pluginDir, "instructions"), { recursive: true });
  fs.writeFileSync(path.join(pluginDir, "instructions", "demo.instructions.md"), "# demo\n");

  assert.throws(
    () =>
      validatePluginTools(pluginDir, {
        instructions: ["instructions/missing.instructions.md"],
        skills: [],
        agents: [],
        hooks: [],
      }),
    /Listed instructions asset is missing: instructions\/missing\.instructions\.md/
  );

  assert.throws(
    () =>
      validatePluginTools(pluginDir, {
        instructions: [],
        skills: [],
        agents: [],
        hooks: [],
      }),
    /Unlisted instructions asset found in plugin folder: instructions\/demo\.instructions\.md/
  );
});

test("buildDir fails when a plugin manifest lists a missing asset", (t) => {
  const pluginDir = createTempPlugin(t);
  const outputDir = path.join(pluginDir, "dist");

  fs.writeFileSync(
    path.join(pluginDir, "plugin.json"),
    JSON.stringify(
      {
        name: "demo-plugin",
        instructions: ["instructions/missing.instructions.md"],
        skills: [],
        agents: [],
        hooks: [],
      },
      null,
      2
    ) + "\n"
  );

  assert.throws(
    () => buildDir(pluginDir, outputDir),
    /Invalid plugin manifest: .*plugin\.json[\s\S]*Listed instructions asset is missing: instructions\/missing\.instructions\.md/
  );
});
