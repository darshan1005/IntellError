import { rules, SuggesionRule } from './rules.js';

export function getSuggestions(error: Error): SuggesionRule[] {
    return rules.filter(rule => rule.match(error));
}
