import { formatError, formatErrorJSON, setupConfig } from '../src/index.js';

// Example 1: Async Chaining with Error.cause
async function databaseCall() {
    throw new Error('Connection refused (timeout after 5000ms)');
}

async function fetchUser() {
    try {
        await databaseCall();
    } catch (err) {
        throw new Error('Failed to fetch user from DB', { cause: err });
    }
}

async function main() {
    console.log('--- 🔗 Async Chaining Example ---');
    try {
        await fetchUser();
    } catch (err) {
        console.log(formatError(err));
        
        console.log('\n--- 🤖 Machine-Readable JSON Mode ---');
        console.log(formatErrorJSON(err));
    }
}

main();
