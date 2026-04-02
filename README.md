# 🧠 IntellError

**Transform ugly JavaScript/Node.js stack traces into clean, readable, and actionable output. Designed for humans, not robots.**

[![npm version](https://img.shields.io/npm/v/intellerror.svg)](https://www.npmjs.com/package/intellerror)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)](https://github.com/darshan1005/IntellError)

## ✨ Why IntellError?

Standard error logs are noisy, cluttered with `node_modules`, and lack context. **IntellError** gives you the "Why" and "How to Fix" instantly.

- ❌ **Clean Stack Traces**: Auto-hides Node.js internals and collapses `node_modules` noise.
- 📍 **Smart Highlighting**: Identifies exactly where the error occurred in *your* code.
- 💡 **Actionable Suggestions**: 50+ built-in rules for React, Express, Node.js, and Browser APIs.
- 📸 **Code Snapshots**: Sees 3 lines of source code directly in your terminal (Node.js only).
- 🔍 **One-Click Troubleshooting**: Instant search links for Google, StackOverflow, and GitHub.
- 🌓 **Intelligent Warnings**: Not just for errors! Also formats `console.warn()` with suggestions.
- 🌐 **Universal Styling**: Beautiful ANSI colors for Terminal and native `%c` CSS for Browsers.
- 📢 **Team Integration**: Push critical dev errors directly to **Slack** or **Discord** webhooks.

---

## 🚀 Quick Start (Zero-Config)

You can set up `IntellError` globally to catch all unhandled issues across your entire project with just one line.

### For Browser (React, Vite, Next.js)
Add this at the very top of your entry file (e.g., `main.tsx` or `index.tsx`):

```typescript
import 'intellerror/register';
```

### For Node.js (CLI)
Run your application with the register hook:

```bash
# ESM (Node.js 20+)
node --import intellerror/register index.js

# CommonJS
node -r intellerror/register index.js
```

---

## ⚙️ Configuration & Customization

Fine-tune the output or add your own project-specific intelligence.

```typescript
import { setupConfig, registerRule } from 'intellerror';

setupConfig({
  showNodeModules: false,    // Hide noise?
  showNodeInternals: false,  // Hide node internals?
  suggestionsEnabled: true,  // Show the "💡 Suggestions"?
  interceptWarnings: true,   // Also format console.warn?
  showSearchLinks: true,     // Show troubleshooting links?
  webhookUrl: 'https://...'  // Push to Slack/Discord?
});

// Add your own "Thinking" to the engine
registerRule({
  match: (err) => err.message.includes("AUTH_FAILED"),
  message: "Authentication failure detected.",
  fix: "Ensure your .env contains a valid API_KEY.",
  description: "The request was rejected by the server due to invalid credentials."
});
```

---

## 📖 Manual Usage

If you prefer to format specific errors manually in your `try-catch` blocks:

### Terminal / Node.js
```typescript
import { formatError, formatWarning } from 'intellerror';

try {
  // your code...
} catch (err) {
  console.log(formatError(err)); 
}
```

### Browser Console (React/Vite)
```typescript
import { formatErrorBrowser } from 'intellerror';

try {
  // your React code...
} catch (err) {
  // Note: MUST use the spread operator (...) for CSS styling
  console.log(...formatErrorBrowser(err));
}
```

---

## 🚅 Framework Integration

### Express Middleware
```typescript
import express from 'express';
import { errorFormatter } from 'intellerror';

const app = express();
// ... routes ...

// Add at the very end of your middleware stack
app.use(errorFormatter());
```

---

## 🎮 Demos & Examples

We've included several ready-to-run examples in the `examples/` directory:

- **Basic Error**: `npm run example:basic`
- **Async Errors**: `npm run example:async`
- **Custom Errors**: `npm run example:custom`
- **Run All**: `npm run examples:all`

### Run Unit Tests
```bash
npm run test:unit
```

---

## Example Output (Terminal)

```text
  TypeError  Cannot read properties of undefined (reading 'name')

📍 Location:
src/index.ts:12:15   ← YOUR CODE

 > 11 |   const user = await fetchUser();
 > 12 |   console.log(user.name);
 > 13 | }

💡 Suggestions:
• Accessing property on undefined object.
  Fix: Use optional chaining like 'obj?.prop' or ensure the object is initialized.

🔍 Troubleshoot:
• Google: https://google.com/...
• GitHub: https://github.com/...

📦 Stack:
→ src/index.ts:12:15
→ src/server.ts:45:10
(4 node internals and 2 node_modules hidden)
```

## 📄 License

MIT © [darshan1005](https://github.com/darshan1005)
