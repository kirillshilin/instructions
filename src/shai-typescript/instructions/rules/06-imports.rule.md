### Imports — TypeScript

Use aliases and barrels across module boundaries. Use direct sibling imports
only inside the same local folder module.

#### Rules

- **Prefer aliases first** — import shared code from stable aliases such as `@/models`, `@/utilities`, `@/services`, not from long relative paths.
- **Import through barrels at module boundaries** — when importing from another folder module, target its public entrypoint (`@/services`, `../services`,  `./models`), not an internal file.
- **Direct sibling imports stay local** — only files already inside the same folder module may import sibling files directly, such as `./payment.model` or `./payment.client`.
- **Outside consumers use the folder surface** — code outside that folder must not reach into `../services/payment/payment.service` or similar deep paths.
- **One public import surface per folder** — reusable folders should expose a barrel and consumers should import only from it.

#### Preferred

```typescript
import { User, OrderStatus } from "@/models";
import { formatCurrency, slugify } from "@/utilities";
import { paymentService } from "@/services";
```

```typescript
import { paymentClient } from "./payment.client";
import { PaymentRequest } from "./payment.model";
```

```typescript
import { paymentService } from "../services";
```

#### Avoid

```typescript
import { User } from "../../models/user.model";
import { slugify } from "@/utilities/string.utilities";
import { paymentService } from "../services/payment/payment.service";
import { paymentClient } from "../services/payment/payment.client";
```

Why: aliased, barreled imports keep boundaries explicit and hide private file
layout.