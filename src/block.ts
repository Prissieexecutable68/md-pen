import { escapeHtml } from './escape.ts';

export const hr = () => '---';

export const details = (summary: string, content: string) => {
	const safeContent = content.replaceAll(/<\/details\s*>/gi, '&lt;/details&gt;');
	return `<details>\n<summary>${escapeHtml(summary)}</summary>\n\n${safeContent}\n\n</details>`;
};
