export interface SuggesionRule {
  match: (error: Error) => boolean;
  message: string;
  fix?: string;
  description?: string;
}

export const rules: SuggesionRule[] = [
  {
    match: (err) => err.message.includes("Cannot read properties of undefined (reading '"),
    message: "Accessing property on undefined object.",
    fix: "Use optional chaining like 'obj?.prop' or ensure the object is initialized.",
    description: "You're trying to access a property on a variable that is currently undefined."
  },
  {
    match: (err) => err.message.includes("is not defined"),
    message: "Reference to an undeclared variable.",
    fix: "Ensure the variable is declared with 'let', 'const', or 'var' and is within the correct scope.",
    description: "You're using a variable that hasn't been defined yet."
  },
  {
    match: (err) => err.message.includes("Cannot read properties of null (reading '"),
    message: "Accessing property on a null object.",
    fix: "Check why the object is null before accessing its properties, or use 'obj?.prop'.",
    description: "You're trying to read a property from a variable that is null."
  },
  {
    match: (err) => err instanceof SyntaxError && err.message.includes("Unexpected token"),
    message: "Syntax or JSON parsing error.",
    fix: "Verify your code syntax or ensure the JSON string you are parsing is valid (no trailing commas, correct quotes).",
    description: "The JavaScript engine encountered unexpected characters while parsing."
  },
  {
    match: (err) => err.message.includes("is not a function"),
    message: "Called a non-function value.",
    fix: "Check if the property you're calling is actually a function and not undefined, a string, or an object.",
    description: "You tried to execute something as a function that isn't one."
  },
  {
    match: (err: any) => err.code === 'ENOENT',
    message: "File or directory not found.",
    fix: "Confirm that the file path is correct and that the file actually exists at that location.",
    description: "Node.js could not find the file or directory you specified."
  },
  {
    match: (err: any) => err.code === 'ECONNREFUSED',
    message: "Network connection refused.",
    fix: "Check if the server you're trying to connect to is running and that the port/host are correct.",
    description: "The connection attempt was rejected by the target machine."
  },
  {
    match: (err) => err instanceof RangeError && err.message.includes("Maximum call stack size exceeded"),
    message: "Infinite recursion detected.",
    fix: "Look for functions that call themselves without a base case or check for very deep recursive logic.",
    description: "Your code likely has an infinite loop or too many nested function calls."
  },
  {
    match: (err) => err instanceof RangeError && err.message.includes("Invalid array length"),
    message: "Attempted to create an array with an invalid size.",
    fix: "Ensure array lengths are positive integers and within the allowed maximum size.",
    description: "The length provided for the array is not valid."
  },
  {
    match: (err) => err.message.includes("cors") && err.message.includes("access-control-allow-origin"),
    message: "CORS policy violation.",
    fix: "Configure the server to allow requests from your origin using the 'cors' middleware.",
    description: "The browser's security policy blocked the cross-origin request."
  }
];
