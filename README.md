# 🧠 IntellError

Transform ugly JavaScript/Node.js stack traces into clean, readable, and actionable output. Designed for humans, not robots.

[![npm version](https://img.shields.io/npm/v/intellerror.svg)](https://www.npmjs.com/package/intellerror)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## ✨ Features

- ❌ **Clean Stack Traces**: Removes Node.js internals and collapses `node_modules` clutter.
- 📍 **Smart Highlighting**: Instantly identifies exactly where the error occurred in *your* code.
- 💡 **Actionable Suggestions**: Context-aware fixes for common errors like `TypeError` or `SyntaxError`.
- ⚡ **Zero Config**: Works out of the box with standard `Error` objects.
- 🎨 **Beautiful Output**: Uses `chalk` for high-contrast, easy-to-read terminal output.

## 🚀 Installation

```bash
npm install intellerror
```

## 📖 Usage

import { formatError } from 'intellerror';

try {
  // your code that might fail
  const user = undefined;
  console.log(user.name);
} catch (err) {
  console.log(formatError(err));
}
```

### 🚅 Express Middleware

```typescript
import express from 'express';
import { errorFormatter } from 'intellerror';

const app = express();

// ... your routes ...

// Add this at the very end of your middleware stack
app.use(errorFormatter());

app.listen(3000);
```

### 🛠️ CLI Registration

You can also use IntellError to catch global unhandled exceptions and promise rejections across your entire app without changing any code.

```bash
# CommonJS
node -r intellerror/register index.js

# ESM (Node.js 20+)
node --import intellerror/register index.js
```

### Example Output

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
- [x] CLI runner hook (`node -r intellerror/register`)

## 📄 License

MIT © [darshan1005](https://github.com/darshan1005)
