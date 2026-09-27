import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Agents working in parallel keep their own copies of the repo under .claude/worktrees.
    exclude: [...configDefaults.exclude, '.claude/**'],
  },
});
