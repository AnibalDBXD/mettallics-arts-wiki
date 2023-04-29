/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MarkdownHeading } from 'astro';
import type { FunctionalComponent } from 'preact';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { unescape } from 'html-escaper';
import { useState, useEffect, useRef } from 'preact/hooks';
import { KNOWN_LANGUAGE_CODES, getLanguageFromURL } from '../../languages';

type ItemOffsets = {
	id: string;
	topOffset: number;
};

const TRANSLATIONS: Record<typeof KNOWN_LANGUAGE_CODES[0], string> = {
	en: 'On this page',
	es: 'En esta página',
}

const TableOfContents: FunctionalComponent<{ headings: MarkdownHeading[], url: string }> = ({
	headings = [],
	url
}) => {
	const toc = useRef<HTMLUListElement>();
	const onThisPageID = 'on-this-page-heading';
	const itemOffsets = useRef<ItemOffsets[]>([]);
	const [currentID, setCurrentID] = useState('overview');

	const languageCode = getLanguageFromURL(url);

	useEffect(() => {
		const getItemOffsets = () => {
			const titles = document.querySelectorAll('article :is(h1, h2, h3, h4)');
			itemOffsets.current = Array.from(titles).map((title) => ({
				id: title.id,
				topOffset: title.getBoundingClientRect().top + window.scrollY,
			}));
		};

		getItemOffsets();
		window.addEventListener('resize', getItemOffsets);

		return () => {
			window.removeEventListener('resize', getItemOffsets);
		};
	}, []);

	useEffect(() => {
		if (!toc.current) return;

		const setCurrent: IntersectionObserverCallback = (entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const { id } = entry.target;
					if (id === onThisPageID) continue;
					setCurrentID(entry.target.id);
					break;
				}
			}
		};

		const observerOptions: IntersectionObserverInit = {
			// Negative top margin accounts for `scroll-margin`.
			// Negative bottom margin means heading needs to be towards top of viewport to trigger intersection.
			rootMargin: '-100px 0% -66%',
			threshold: 1,
		};

		const headingsObserver = new IntersectionObserver(setCurrent, observerOptions);

		// Observe all the headings in the main page content.
		document.querySelectorAll('article :is(h1,h2,h3)').forEach((h) => headingsObserver.observe(h));

		// Stop observing when the component is unmounted.
		return () => headingsObserver.disconnect();
	}, [toc.current]);

	const onLinkClick = (e: any) => {
	setCurrentID(e.target.getAttribute('href').replace('#', ''));
	};
	return (
		<>
			<h2 id={onThisPageID} className="heading">
				{TRANSLATIONS[languageCode] || TRANSLATIONS.en}
			</h2>
			<ul ref={toc as any}>
				{headings
					.filter(({ depth }) => depth > 1 && depth < 4)
					.map((heading) => (
						<li
							className={`header-link depth-${heading.depth} ${
								currentID === heading.slug ? 'current-header-link' : ''
							}`.trim()}
						>
							<a href={`#${heading.slug}`} onClick={onLinkClick}>
								{unescape(heading.text)}
							</a>
						</li>
					))}
			</ul>
		</>
	);
};

export default TableOfContents;
