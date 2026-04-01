import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/register.ts'],
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
});
