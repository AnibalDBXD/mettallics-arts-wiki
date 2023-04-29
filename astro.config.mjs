import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
	integrations: [
		// Enable Preact to support Preact JSX components.
		preact()
	],
	site: `https://metallic-arts.com`,
});
