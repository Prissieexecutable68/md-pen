import { escapeHtml, escapeUrl, htmlAttributes } from './escape.ts';

const hasOnlyTitle = (
	options: Record<string, string | number>,
) => {
	const keys = Object.keys(options);
	return keys.length === 1 && keys[0] === 'title';
};

const escapeTitle = (title: string) => title
	.replaceAll(/[\r\n]+/g, ' ')
	.replaceAll('\\', String.raw`\\`)
	.replaceAll('"', String.raw`\"`);

const escapeLinkText = (text: string) => text
	.replaceAll(/[\r\n]+/g, ' ')
	.replaceAll('\\', String.raw`\\`)
	.replaceAll('[', String.raw`\[`)
	.replaceAll(']', String.raw`\]`);

const isGfmEmail = (url: string) => /^[\w.+-]+@\w[\w.-]*\.\w+$/.test(url)
	&& !/\.\.|[_-]$/.test(url);

const isGfmWww = (url: string) => {
	const match = url.match(/^www\.([\w.-]+)/i);
	if (!match || !/\.\w+/.test(match[1])) {
		return false;
	}
	const parts = match[0].split('.');
	return parts.slice(-2).every(segment => !segment.includes('_'));
};

const normalizeHref = (url: string) => {
	if (url.startsWith('www.')) {
		return isGfmWww(url) ? `http://${url}` : url;
	}
	if (url.includes('@') && isGfmEmail(url)) {
		return `mailto:${url}`;
	}
	return url;
};

export const link = (
	url: string,
	text?: string,
	options?: Record<string, string>,
) => {
	if (options && Object.keys(options).length > 0) {
		const href = normalizeHref(url);
		if (hasOnlyTitle(options)) {
			return `[${escapeLinkText(text ?? url)}](${escapeUrl(href)} "${escapeTitle(String(options.title))}")`;
		}

		const attributes: Record<string, string> = {
			...options,
			href,
		};
		// Break email autolink in display text to prevent nested <a> tags
		const displayText = text ?? escapeHtml(url).replaceAll('@', '\u200B@');
		return `<a${htmlAttributes(attributes)}>${displayText}</a>`;
	}

	if (text !== undefined) {
		return `[${escapeLinkText(text)}](${escapeUrl(normalizeHref(url))})`;
	}

	// eslint-disable-next-line no-control-regex
	if (/^https?:\/\//.test(url) && !/[ \u0000-\u001F<>]/.test(url)) {
		return `<${url}>`;
	}

	return `[${escapeLinkText(url)}](${escapeUrl(normalizeHref(url))})`;
};

export const image = (
	url: string,
	alt?: string,
	options?: Record<string, string | number>,
) => {
	if (options && Object.keys(options).length > 0) {
		if (hasOnlyTitle(options)) {
			return `![${escapeLinkText(alt ?? '')}](${escapeUrl(url)} "${escapeTitle(String(options.title))}")`;
		}

		const attributes: Record<string, string | number> = {
			...options,
			src: url,
			...(alt === undefined ? {} : { alt }),
		};
		return `<img${htmlAttributes(attributes)} />`;
	}

	return `![${escapeLinkText(alt ?? '')}](${escapeUrl(url)})`;
};
