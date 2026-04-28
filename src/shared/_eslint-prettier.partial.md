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
