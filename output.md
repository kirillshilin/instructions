📁 dist/
├── 📁 shai-core/
│   └── 📁 instructions/
│       ├── 📄 shai-coding.instructions.md                              179
│       │   └── # General Coding Standards                              175
│       │       ├── ## Philosophy                                       9
│       │       └── ## Rules                                            162
│       │           ├── ### Naming Conventions                          36
│       │           │   └── #### Universal Principles                   32
│       │           ├── ### Member Ordering                             49
│       │           │   ├── #### Ordering                               17
│       │           │   └── #### One Item Per File                      28
│       │           ├── ### Early Returns                               17
│       │           ├── ### No Inline Parameters                        29
│       │           ├── ### Comments                                    12
│       │           └── ### Error Handling                              17
│       ├── 📄 shai-documentation.instructions.md                       235
│       │   ├── # Documentation Standards                               58
│       │   │   ├── ## Philosophy                                       8
│       │   │   ├── ## File Organization                                31
│       │   │   │   ├── ### Naming rules                                7
│       │   │   │   └── ### When to extract from README                 10
│       │   │   ├── ## Data Structure                                   10
│       │   │   │   └── ### Subfolder conventions                       5
│       │   │   └── ## README.md Structure                              5
│       │   ├── # {Project Name}                                        65
│       │   │   ├── ## Overview                                         4
│       │   │   ├── ## Quick Start                                      4
│       │   │   ├── ## Documentation                                    13
│       │   │   ├── ## Application Documentation                        29
│       │   │   │   ├── ### Core sections                               11
│       │   │   │   └── ### Writing guidance per section                14
│       │   │   └── ## Library Documentation                            11
│       │   │       └── ### Library Documentation                       9
│       │   │           └── #### README.md for libraries                5
│       │   └── # {Library Name}                                        108
│       │       ├── ## Install                                          4
│       │       ├── ## Quick Example                                    4
│       │       ├── ## API Overview                                     4
│       │       ├── ## Documentation                                    42
│       │       │   ├── #### API Reference format                       5
│       │       │   └── ### `functionName(param1, param2)`              28
│       │       │       └── #### Changelog conventions                  9
│       │       ├── ## Numbered File Guidelines                         24
│       │       │   ├── ### Application projects                        11
│       │       │   └── ### Library projects                            9
│       │       ├── ## shai-product Integration                         19
│       │       └── ## Gotchas                                          7
│       └── 📄 shai-packagejson.instructions.md                         169
│           └── # package.json Standards                                164
│               ├── ## Dependency Versions — No Ranges                  40
│               ├── ## Standard Scripts                                 36
│               │   ├── ### Core Scripts (all projects)                 13
│               │   ├── ### Optional Scripts (add when applicable)      10
│               │   └── ### Rules                                       9
│               ├── ## Framework-Specific Examples                      70
│               │   ├── ### Angular                                     16
│               │   ├── ### React (Vite)                                16
│               │   ├── ### Next.js                                     16
│               │   └── ### Node.js (Express / API)                     20
│               └── ## Gotchas                                          12
├── 📁 shai-dotnet/
│   └── 📁 instructions/
│       └── 📄 shai-dotnet-coding.instructions.md                       68
│           └── # .NET / C# Coding Standards                            64
│               ├── ## Rules                                            49
│               │   ├── ### Naming Conventions — C#                     10
│               │   └── ### Folder Structure — C#                       37
│               │       ├── #### Principles                             10
│               │       ├── #### Shared / Utility Folders               6
│               │       └── #### .NET Projects                          16
│               └── ## Constants                                        10
├── 📁 shai-firebase/
│   └── 📁 instructions/
│       └── 📄 shai-firebase-functions.instructions.md                  207
│           └── # Firebase Cloud Function Conventions                   202
│               ├── ## File Naming and Structure                        17
│               ├── ## Thin Facade Pattern                              27
│               ├── ## Config Import                                    16
│               ├── ## Request Validation — onRequest/onCall Functions  47
│               ├── ## index.ts — Re-exports Only                       14
│               └── ## Testing                                          73
│                   └── ### Firebase-specific rules                     67
├── 📁 shai-node/
│   └── 📁 instructions/
│       └── 📄 shai-yargs-command.instructions.md                       56
│           └── # Yargs Command Structure                               50
│               └── ## Builder Separation                               48
├── 📁 shai-react/
│   └── 📁 instructions/
│       └── 📄 shai-react-components.instructions.md                    424
│           └── # React Component Conventions                           420
│               ├── ## Rules                                            404
│               │   ├── ### Component Structure                         50
│               │   │   ├── #### One component per file                 12
│               │   │   ├── #### Target size: 50–70 lines               14
│               │   │   ├── #### Single responsibility                  16
│               │   │   └── #### shadcn components — leave intact       6
│               │   ├── ### Folder Taxonomy                             50
│               │   │   ├── #### The five folders                       10
│               │   │   ├── #### Placement rules                        15
│               │   │   ├── #### Co-located hooks                       14
│               │   │   └── #### Where NOT to put things                9
│               │   ├── ### Hook Delegation                             113
│               │   │   ├── #### Rule                                   74
│               │   │   ├── #### What belongs in hooks                  11
│               │   │   ├── #### What stays in the component            8
│               │   │   ├── #### Hook file naming convention            7
│               │   │   └── #### No helper functions in components      8
│               │   ├── ### Constants and Data                          95
│               │   │   ├── #### No inline data in components           48
│               │   │   ├── #### Where constants live                   8
│               │   │   ├── #### Naming                                 7
│               │   │   └── #### Default prop values                    26
│               │   └── ### JSX and Styling                             94
│               │       ├── #### JSX patterns                           47
│               │       ├── #### Styling with Tailwind                  10
│               │       ├── #### Prop types                             21
│               │       └── #### Component export                       14
│               └── ## Performance                                      8
└── 📁 shai-typescript/
    └── 📁 instructions/
        ├── 📄 shai-tsconfig.instructions.md                            239
        │   └── # tsconfig Standards                                    234
        │       ├── ## File Structure                                   28
        │       ├── ## Base Config — Strictest Compiler Options         66
        │       ├── ## App-Specific Configs — Minimal Extensions        22
        │       │   ├── ### Node.js / Backend                           4
        │       │   ├── ### React / Vite Frontend                       4
        │       │   ├── ### Angular Frontend                            4
        │       │   └── ### Firebase Functions                          6
        │       ├── ## Test Config — Clean Slate, Extend As Needed      16
        │       ├── ## Path Aliases                                     78
        │       │   ├── ### Rules                                       7
        │       │   ├── ### Standard Alias Set                          47
        │       │   └── ### Bundler Mirror (Vite example)               20
        │       └── ## Gotchas                                          16
        ├── 📄 shai-typescript-testing.instructions.md                  96
        │   └── # TypeScript Unit Testing                               91
        │       └── ## Rules                                            81
        │           └── ### Unit Test Structure — TypeScript            79
        │               ├── #### File Naming and Suite Layout           10
        │               ├── #### Coverage Boundaries                    8
        │               ├── #### Test Body Rules                        7
        │               └── #### Case-Based Tests                       52
        ├── 📄 shai-typescript.instructions.md                          243
        │   └── # TypeScript Coding Standards                           239
        │       ├── ## Rules                                            229
        │       │   ├── ### Naming — TypeScript                         12
        │       │   ├── ### Folder Structure — TypeScript               70
        │       │   │   ├── #### Principles                             10
        │       │   │   ├── #### Shared / Utility Folders               8
        │       │   │   └── #### TypeScript / Frontend Projects         48
        │       │   ├── ### One Unit per Module                         60
        │       │   │   ├── #### Why                                    7
        │       │   │   ├── #### What counts as a unit                  10
        │       │   │   ├── #### Utility functions                      18
        │       │   │   ├── #### Exceptions                             9
        │       │   │   └── #### Avoid                                  9
        │       │   ├── ### Imports — TypeScript                        49
        │       │   │   ├── #### Rules                                  15
        │       │   │   ├── #### Preferred                              17
        │       │   │   └── #### Avoid                                  12
        │       │   └── ### Logging — TypeScript                        36
        │       │       ├── #### Rules                                  10
        │       │       ├── #### Pre-operation example                  8
        │       │       ├── #### Post-operation example                 8
        │       │       └── #### Avoid                                  6
        │       └── ## Constants                                        6
        └── 📄 shai-zod-schema.instructions.md                          41
            └── # Zod Schema File Standards                             37
                └── ## Rule                                             33
                    └── ### Zod Schema Naming and Layout                31
