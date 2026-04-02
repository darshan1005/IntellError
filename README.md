# 🧠 IntellError

Transform ugly JavaScript/Node.js stack traces into clean, readable, and actionable output. Designed for humans, not robots.

[![npm version](https://img.shields.io/npm/v/intellerror.svg)](https://www.npmjs.com/package/intellerror)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## ✨ Features

- ❌ **Clean Stack Traces**: Removes Node.js internals and collapses `node_modules` clutter.
- 📍 **Smart Highlighting**: Instantly identifies exactly where the error occurred in *your* code.
- 💡 **Actionable Suggestions**: Context-aware fixes for common errors like `TypeError` or `SyntaxError`.
- ⚡ **Zero Config**: Works out of the box with standard `Error` objects.
- 🎨 **Beautiful Terminal Output**: High-contrast, easy-to-read errors using `chalk`.
- 🌐 **First-Class Browser Support**: Native `%c` console styling for React, Vite, and Next.js.
- 📦 **Lightweight**: Zero dependencies for the browser formatter.

## 🚀 Installation

```bash
npm install intellerror
```

## 🛠️ Global Quick Start (Highly Recommended)

You can set up `IntellError` globally to catch all unhandled errors across your entire project without changing any of your logic.

### For Browser (React, Vite, Next.js)
Add this at the very top of your entry file (e.g., `main.tsx` or `index.tsx`):

```typescript
import 'intellerror/register';
```

### For Node.js (CLI)
Run your application using the `--import` or `-r` flag:

```bash
# ESM (Node.js 20+)
node --import intellerror/register index.js

# CommonJS
node -r intellerror/register index.js
```

---

## 📖 Manual Usage

If you prefer to format specific errors yourself:

### Terminal / Node.js
```typescript
import { formatError } from 'intellerror';

try {
  // your code...
} catch (err) {
  console.log(formatError(err));
}
```

### Browser Console
```typescript
import { formatErrorBrowser } from 'intellerror';

try {
  // your React/Vite code...
} catch (err) {
  // Note: use the spread operator (...) for CSS styling to work
  console.log(...formatErrorBrowser(err));
}
```

---

## 🚅 Express Middleware

Perfect for building clean development APIs:

```typescript
import express from 'express';
import { errorFormatter } from 'intellerror';

const app = express();

// ... your routes ...

// Add this at the end of your middleware stack
app.use(errorFormatter());

app.listen(3000);
```

## 🎮 Demos & Examples

We've included several ready-to-run examples in the `examples/` directory. Run them directly:

- **Basic Error**: `npm run example:basic`
- **Async Errors**: `npm run example:async`
- **Custom Errors**: `npm run example:custom`
- **Run All**: `npm run examples:all`

## Example Output

```text
  TypeError  Cannot read properties of undefined (reading 'name')

📍 Location:
src/index.ts:12:15   ← YOUR CODE

💡 Suggestions:
• Accessing property on undefined/not defined object.
  Fix: Use optional chaining like 'obj?.prop' or ensure the object is initialized.

📦 Stack:
→ src/index.ts:12:15
→ src/server.ts:45:10
(4 node internals and 2 node_modules hidden)
```

## 🛠️ Roadmap

- [x] Basic stack trace parsing & filtering
- [x] User code highlighting
- [x] Rule-based suggestion engine
- [x] Express middleware integration
- [x] Universal Global Register (`intellerror/register`)
- [x] Browser-native CSS formatter

## 📄 License

ISC © [darshan1005](https://github.com/darshan1005)

---

## ⚙️ Configuration & Customization

You can customize the output and add your own intelligent rules to the formatting engine.

### Global Configuration
Toggle hidden frames or disable suggestions globally:

```typescript
import { setupConfig } from 'intellerror';

setupConfig({
  showNodeModules: true,    // Default: false
  showNodeInternals: true,  // Default: false
  suggestionsEnabled: true  // Default: true
});
```

### Adding Custom Thinking (Rules)
Add your own rules if you want `IntellError` to provide suggestions for library-specific errors (e.g., your own API or database errors):

```typescript
import { registerRule } from 'intellerror';

registerRule({
  match: (err) => err.message.includes("AUTH_FAILED"),
  message: "Authentication failure detected.",
  fix: "Ensure your API_KEY environment variable is set.",
  description: "Your request was rejected because the credentials were missing or invalid."
});
```

