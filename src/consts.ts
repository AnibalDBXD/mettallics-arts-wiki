export const SITE = {
	title: 'Metallics Arts',
	description: 'Metallics Arts mod wiki site',
	defaultLanguage: 'en-us',
} as const;

export const OPEN_GRAPH = {
	image: {
		src: 'og-image.png',
		alt: 'Metallics Arts'
	},
	twitter: 'steelcodeteam',
};

export const KNOWN_LANGUAGES = {
	English: 'en',
	Spanish: 'es'
} as const;

export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/withastro/astro/tree/main/examples/docs`;

export const COMMUNITY_INVITE_URL = `https://discord.gg/pVuuxNrz`;
