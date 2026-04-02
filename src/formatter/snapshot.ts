import * as fs from 'fs';
import chalk from 'chalk';

/**
 * Returns a 5-line code snippet from a source file around the given line number.
 * Node.js ONLY.
 */
export function getCodeSnapshot(filePath: string, lineNumber: number): string {
    try {
        if (!fs.existsSync(filePath)) return '';
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        const start = Math.max(0, lineNumber - 2);
        const end = Math.min(lines.length - 1, lineNumber + 1);
        
        let output = '\n';
        for (let i = start; i <= end; i++) {
            const line = lines[i];
            const displayLineNumber = i + 1;
            const isTarget = displayLineNumber === lineNumber;
            
            const prefix = isTarget ? chalk.red(' > ') : '   ';
            const lineNumStr = chalk.gray(displayLineNumber.toString().padStart(3, ' ') + ' | ');
            
            output += `${prefix}${lineNumStr}${isTarget ? chalk.white(line) : chalk.dim(line)}\n`;
        }
        
        return output;
    } catch (e) {
        return '';
    }
}
