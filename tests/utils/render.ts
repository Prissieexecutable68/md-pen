import { markdownToHTML } from 'comrak';

const comrakOptions = {
	extension: {
		strikethrough: true,
		table: true,
		autolink: true,
		tasklist: true,
		footnotes: true,
		alerts: true,
		mathDollars: true,
	},
	render: {
		unsafe: true,
	},
};

export const render = (markdown: string) => markdownToHTML(markdown, comrakOptions).trim();
