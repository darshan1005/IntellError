export interface SuggesionRule {
  match: (error: Error) => boolean;
  message: string;
  fix?: string;
  description?: string;
}

export const rules: SuggesionRule[] = [
  // --- TYPE ERRORS & NULL/UNDEFINED ---
  {
    match: (err) => err.message.includes("Cannot read properties of undefined (reading '"),
    message: "Accessing property on undefined object.",
    fix: "Use optional chaining like 'obj?.prop' or ensure the object is initialized.",
    description: "You're trying to access a property on a variable that is currently undefined."
  },
  {
    match: (err) => err.message.includes("Cannot read properties of null (reading '"),
    message: "Accessing property on a null object.",
    fix: "Check why the object is null before accessing its properties, or use 'obj?.prop'.",
    description: "You're trying to read a property from a variable that is null."
  },
  {
    match: (err) => err.message.includes("is not defined"),
    message: "Reference to an undeclared variable.",
    fix: "Ensure the variable is declared with 'let', 'const', or 'var' and is within its correct scope.",
    description: "You're using a variable that hasn't been defined yet."
  },
  {
    match: (err) => err.message.includes("Cannot destructure property"),
    message: "Failed to destructure object.",
    fix: "Provide a default object like 'const { x } = data || {}' to avoid destructuring null/undefined.",
    description: "You're trying to extract properties from a variable that turned out to be empty."
  },

  // --- FUNCTIONS & ARRAYS ---
  {
    match: (err) => err.message.includes(".map is not a function"),
    message: "Array method '.map()' called on non-array value.",
    fix: "Verify that the variable is an array. If it's from an API, ensure the result is '[]' if empty.",
    description: "Commonly happens when an API returns an object or null instead of the expected list."
  },
  {
    match: (err) => err.message.includes(".forEach is not a function"),
    message: "Array method '.forEach()' called on non-array value.",
    fix: "Check if you're actually getting an array. Use 'Array.isArray(obj)' to verify.",
    description: "You attempted to iterate over something that isn't a list."
  },
  {
    match: (err) => err.message.includes("is not a function"),
    message: "Called a non-function value.",
    fix: "Double-check if the property you're calling is actually a function and not undefined or a string.",
    description: "You tried to execute something as a function that isn't one."
  },

  // --- SYNTAX & DATA ---
  {
    match: (err) => err instanceof SyntaxError && err.message.includes("JSON"),
    message: "Invalid JSON format.",
    fix: "Verify the source string. Use a JSON validator to find trailing commas or incorrect quotes.",
    description: "The JSON you are parsing contains syntax errors."
  },
  {
    match: (err) => err instanceof RangeError && err.message.includes("Maximum call stack size exceeded"),
    message: "Infinite recursion detected.",
    fix: "Look for functions that call themselves without a base case (e.g., missing exit condition).",
    description: "Your code likely has an infinite loop or too many nested function calls."
  },
  {
    match: (err) => err.message.includes("Invalid URL"),
    message: "Failed to construct URL.",
    fix: "Check that the input string is a valid absolute URL (e.g., starts with http:// or https://).",
    description: "The URL constructor was given a malformed or relative string."
  },

  // --- NETWORK & API (Browser) ---
  {
    match: (err) => err.message.includes("Failed to fetch"),
    message: "Network request failed.",
    fix: "Check your internet connection or verify if the API server is down or the URL is wrong.",
    description: "The browser could not reach the server. This is often a DNS or connectivity issue."
  },
  {
    match: (err) => err.message.includes("cors") && err.message.includes("access-control-allow-origin"),
    message: "CORS policy violation.",
    fix: "The API server needs to allow your origin. If you control the API, use the 'cors' middleware.",
    description: "The browser's security policy blocked the cross-origin request."
  },

  // --- NODE.JS CORE (Server) ---
  {
    match: (err: any) => err.code === 'ENOENT',
    message: "File or directory not found.",
    fix: "Verify the file path. Use 'path.join(__dirname, ...)' to ensure you have an absolute path.",
    description: "Node.js could not find the file or folder you're looking for at that location."
  },
  {
    match: (err: any) => err.code === 'EADDRINUSE',
    message: "Port already in use.",
    fix: "Close the process currently using that port (e.g., kill another terminal) or change the PORT.",
    description: "Another application is already running on the port you're trying to use."
  },
  {
    match: (err: any) => err.code === 'ECONNREFUSED',
    message: "Network connection refused.",
    fix: "The target server is not listening. Ensure the API or Database is actually running.",
    description: "The connection attempt was rejected by the target machine."
  },
  {
    match: (err: any) => err.code === 'EACCES',
    message: "Permission denied.",
    fix: "Run the command with sudo/administrator privileges or check filesystem permissions.",
    description: "Your application doesn't have the internal rights to read/write to this location."
  },

  // --- REACT-SPECIFIC ---
  {
    match: (err) => err.message.includes("Hooks can only be called inside of the body of a function component"),
    message: "Invalid Hook Call.",
    fix: "Ensure you aren't calling hooks inside loops, conditions, or nested functions.",
    description: "React hooks must be called at the top level of a Functional Component."
  },
  {
    match: (err) => err.message.includes("Too many re-renders"),
    message: "Infinite re-render loop.",
    fix: "You're likely updating state inside the render body. Move the update into a 'useEffect'.",
    description: "React prevents infinite loops when an update is triggered every single time a component renders."
  },

  // --- INTERACTIVE STYLING & DOM ---
  {
    match: (err) => err.message.includes("Cannot read properties of null (reading 'style')"),
    message: "Attempted to style a missing element.",
    fix: "The element you're trying to style wasn't found in the DOM. Verify your CSS selector (class or ID) match the HTML exactly.",
    description: "Your query (querySelector or getElementById) returned null."
  },
  {
    match: (err) => err.message.includes("is not a valid selector"),
    message: "Invalid CSS Selector.",
    fix: "Ensure your selector follows CSS rules (e.g., '.class-name', '#id-name', 'div > p'). Check for missing dots/hashes.",
    description: "The string provided to a DOM selection method is not syntactically correct."
  },
  {
    match: (err) => err.message.includes("CSSStyleDeclaration") && err.message.includes("read-only"),
    message: "Attempted to modify a read-only style property.",
    fix: "Some browser styles (like getComputedStyle results) are read-only. Use 'element.style' instead for manual changes.",
    description: "You're trying to write to a value that the browser keeps locked."
  },
  {
    match: (err) => err.message.includes("Failed to execute 'animate' on 'Element'"),
    message: "Invalid Web Animation.",
    fix: "Check your keyframes and timing options. Ensure properties like 'transform' use standard syntax.",
    description: "The Web Animations API rejected your parameters."
  },
  {
    match: (err) => err.message.includes("Failed to execute 'add' on 'DOMTokenList'") || err.message.includes("token contains HTML space characters"),
    message: "Invalid CSS Class Name.",
    fix: "CSS classes cannot contain spaces. Use 'classList.add('class1', 'class2')' with separate arguments instead.",
    description: "You tried to add an invalid token (like a sentence) into an element's className."
  },

  // --- WARNINGS & BEST PRACTICES ---
  {
    match: (err) => err.message.includes("Each child in a list should have a unique \"key\" prop"),
    message: "Missing React Key Prop.",
    fix: "Add a 'key' prop to the top-level element inside your .map() (e.g., <li key={item.id}>).",
    description: "React needs keys to efficiently track and update items in a list."
  },
  {
    match: (err) => err.message.includes("Changing an uncontrolled input to be controlled"),
    message: "Uncontrolled to Controlled Input switch.",
    fix: "Ensure the 'value' prop is never undefined. Initialize your state with an empty string: useState('') instead of useState().",
    description: "React expects an input to stay either controlled or uncontrolled for its entire lifecycle."
  },
  {
    match: (err) => err.message.includes("ExperimentalWarning"),
    message: "Using Experimental Node.js Feature.",
    fix: "This feature is functional but the API might change in future Node versions. High-risk for production.",
    description: "You're using a feature that is still under active development by the Node.js team."
  },

  // --- ADVANCED JAVASCRIPT & ENGINES ---
  {
    match: (err) => err.message.includes("Cannot mix BigInt and other types"),
    message: "BigInt Type Mismatch.",
    fix: "Explicitly convert other types to BigInt using 'BigInt(value)' before performing arithmetic operations.",
    description: "JavaScript does not allow implicit coercion between BigInt and standard Number types."
  },
  {
    match: (err) => err.message.includes("is not iterable"),
    message: "Iteration Failure.",
    fix: "Check if the variable you're trying to spread or loop over (...) is null or an object instead of an Array/Map/Set.",
    description: "You attempted to use a spread operator or for...of loop on a non-iterable value."
  },
  {
    match: (err) => err instanceof SyntaxError && err.message.includes("Invalid regular expression"),
    message: "Malformed Regex.",
    fix: "Check for unclosed parentheses, invalid escape characters, or incorrect flags in your RegExp.",
    description: "The JavaScript engine could not compile your regular expression pattern."
  },

  // --- BROWSER DOM & STORAGE ---
  {
    match: (err) => err.message.includes("QuotaExceededError") || err.message.includes("exceeded the quota"),
    message: "Storage Quota Exceeded.",
    fix: "Clear some space in localStorage/IndexedDB or handle the error by clearing old cached data.",
    description: "You've reached the maximum storage limit allowed by the browser for this origin."
  },
  {
    match: (err) => err.name === 'NotAllowedError' && err.message.includes("play() failed"),
    message: "Autoplay Blocked.",
    fix: "Wait for a user interaction (click/tap) before calling .play() on audio or video elements.",
    description: "Modern browsers block media from playing automatically without a user gesture."
  },

  // --- NODE/EXPRESS SPECIFICS ---
  {
    match: (err) => err.message.includes("Cannot set headers after they are sent to the client"),
    message: "Express Header Conflict.",
    fix: "Check for multiple 'res.send()', 'res.json()', or 'res.end()' calls in a single route handler. Use 'return res.json(...)' to stop execution early.",
    description: "You're trying to send a response to the client after a response has already been finished."
  },
  {
    match: (err: any) => err.code === 'EADDRNOTAVAIL',
    message: "Address Not Available.",
    fix: "Check your host/IP configuration. You might be trying to bind to an IP address that doesn't exist on this machine.",
    description: "The requested network address could not be assigned."
  },

  // --- REACT REFS & STATE ---
  {
    match: (err) => err.message.includes("Cannot assign to read only property 'current'"),
    message: "Immutable Ref Modification.",
    fix: "Ensure you're not trying to override a ref's .current property directly if it was provided by a parent or a third-party library.",
    description: "React protects certain ref objects from being overwritten to maintain internal consistency."
  }
];
