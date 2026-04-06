import { rules, SuggestionRule } from './rules.js';
import { parseStack, ParsedStackFrame } from '../parser/index.js';

/**
 * Gets intelligent suggestions for a given error.
 * Now supports context-aware matching and confidence-based sorting.
 */
export function getSuggestions(error: Error): SuggestionRule[] {
    const stack = parseStack(error);
    
    return rules
        .filter(rule => rule.match(error, stack))
        // Sort by confidence descending
        .sort((a, b) => b.confidence - a.confidence);
}

/**
 * Registers a new custom suggestion rule.
 */
export function registerRule(rule: SuggestionRule) {
    rules.push(rule);
}
