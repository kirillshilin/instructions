# 🔗 Sharing Instructions via Git Submodule

> A guide to including instructions, agents, and skills from this repository into any other repository — and contributing changes back — using a git submodule.

---

## 📋 Overview

A **git submodule** embeds this repository as a versioned dependency inside your project. Your project tracks a specific commit of this repo, so you always get a stable snapshot. When you edit instruction files inside the submodule, you can commit those changes back here and keep all your projects in sync.

---

## 1. Add This Repository as a Submodule

Inside your target repository, run:

```bash
git submodule add https://github.com/kirillshilin/instructions .shared-instructions
git commit -m "chore: add shared instructions submodule"
```

This creates:
- `.shared-instructions/` — the submodule directory (a full clone of this repo)
- `.gitmodules` — a config file that records the submodule URL and path

> 💡 `.shared-instructions` is a hidden directory by convention. Feel free to use any name you prefer (e.g. `shared/instructions`).

---

## 2. Use Instruction Files in Your Project

The simplest approach is to create **symlinks** inside `.github/instructions/` that point into the submodule. Symlinks mean you edit one file and both repos see the change.

```bash
mkdir -p .github/instructions

# Example: link the TypeScript and README instructions
ln -s ../../.shared-instructions/typescript-project.instructions.md \
      .github/instructions/typescript-project.instructions.md

ln -s ../../.shared-instructions/readme-style.instructions.md \
      .github/instructions/readme-style.instructions.md
```

Alternatively, if symlinks are inconvenient (e.g. on Windows without developer mode), copy the files and accept that you must sync manually:

```bash
cp .shared-instructions/typescript-project.instructions.md .github/instructions/
```

### Enable instructions in VS Code

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.codeGeneration.useInstructionFiles": true,
  "chat.includeApplyingInstructions": true
}
```

---

## 3. Clone a Repository That Has the Submodule

When someone clones your project they must also initialise the submodule:

```bash
# Option A — clone and initialise in one step
git clone --recurse-submodules https://github.com/your-org/your-repo

# Option B — after a plain clone
git submodule update --init --recursive
```

---

## 4. Keep the Submodule Up to Date

Pull the latest instructions from this shared repository:

```bash
cd .shared-instructions
git pull origin main
cd ..
git add .shared-instructions
git commit -m "chore: update shared instructions to latest"
```

Or update all submodules in one command:

```bash
git submodule update --remote --merge
git add .
git commit -m "chore: update all submodules"
```

---

## 5. Contribute Changes Back

If you edit an instruction file inside `.shared-instructions/` and want to share it with all projects:

```bash
cd .shared-instructions

# Create a branch, commit, and push to this repo
git checkout -b improve/typescript-instructions
git add typescript-project.instructions.md
git commit -m "feat: add strictPropertyInitialization rule"
git push origin improve/typescript-instructions
```

Then open a pull request in **kirillshilin/instructions** as usual.

Once your PR is merged, update the pointer in your other projects:

```bash
cd ..                            # back to the consumer repo
git submodule update --remote --merge
git add .shared-instructions
git commit -m "chore: update shared instructions"
```

---

## 6. Sharing Agents and Skills

The same workflow applies to agents and skills. Create symlinks (or copies) for the files you want:

```bash
# Agents
mkdir -p .github/agents
ln -s ../../.shared-instructions/.github/agents/agent-builder.agent.md \
      .github/agents/agent-builder.agent.md

# Skills
mkdir -p .github/skills/create-agent
ln -s ../../../.shared-instructions/.github/skills/create-agent/SKILL.md \
      .github/skills/create-agent/SKILL.md
```

---

## 7. Example Repository Layout

```
your-project/
├── .gitmodules                          ← submodule config (commit this)
├── .shared-instructions/                ← submodule (kirillshilin/instructions)
│   ├── typescript-project.instructions.md
│   ├── react-components.instructions.md
│   └── ...
├── .github/
│   ├── instructions/
│   │   ├── typescript-project.instructions.md  ← symlink → submodule
│   │   └── react-components.instructions.md    ← symlink → submodule
│   ├── agents/
│   │   └── agent-builder.agent.md              ← symlink → submodule
│   └── skills/
│       └── create-agent/SKILL.md               ← symlink → submodule
└── src/ ...
```

---

## 8. Quick-Start Checklist

- [ ] `git submodule add https://github.com/kirillshilin/instructions .shared-instructions`
- [ ] Symlink (or copy) the instruction files you need into `.github/instructions/`
- [ ] Add VS Code settings to activate instruction files
- [ ] Commit `.gitmodules` and `.shared-instructions` pointer to your repo
- [ ] Document the `git submodule update --init --recursive` step in your project README
- [ ] When updating instructions, run `git submodule update --remote --merge` and commit

---

## 📚 Further Reading

- [Git Submodules – official docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [VS Code Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
