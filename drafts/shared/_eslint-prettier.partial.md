The project already includes ESLint. Add Prettier integration:

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

Add `prettierRecommended` to `eslint.config.js`:

```js
import prettierRecommended from "eslint-plugin-prettier/recommended";

// Add to the extends array of the existing config:
// extends: [...existingExtends, prettierRecommended]
```

The `.prettierrc` file is provided in the skill's `assets/` folder and will be
copied to the project root automatically ({_new-line.rule.md}).
