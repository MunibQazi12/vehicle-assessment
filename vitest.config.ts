import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
	test: {
		// Environment for DOM testing
		environment: "happy-dom",
		// environment: "node",// for non-DOM tests
		// Global test setup
		globals: true,
		// Include patterns for test files
		include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
		// Exclude patterns
		exclude: ["node_modules", ".next", "docs"],
		// Coverage configuration
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				".next/",
				"docs/",
				"**/*.d.ts",
				"**/*.config.{ts,js,mjs}",
				"**/types/**",
			],
		},
		// Setup files (run before each test file)
		setupFiles: ["./vitest.setup.tsx"],
	},
	resolve: {
		alias: {
			// Match path aliases from tsconfig.json
			"@dealertower": path.resolve(__dirname, "./packages"),
			"@dealers": path.resolve(__dirname, "./dealers"),
		},
	},
});
