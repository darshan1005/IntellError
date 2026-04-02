import { rules, SuggesionRule } from './rules.js';

export function getSuggestions(error: Error): SuggesionRule[] {
    return rules.filter(rule => rule.match(error));
}

/**
 * Registers a new custom suggestion rule.
 */
export function registerRule(rule: SuggesionRule) {
    rules.push(rule);
}
