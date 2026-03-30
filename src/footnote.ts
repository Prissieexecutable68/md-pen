const normalizeId = (id: string) => id
	.trim()
	.replaceAll(/\s+/g, '-')
	.replace(/\\+$/, '');

const isValidId = (raw: string) => raw.trim().length > 0
	&& !raw.includes(']')
	&& !raw.includes('[');

export const footnoteRef = (id: string) => {
	if (!isValidId(id)) {
		return '';
	}
	return `[^${normalizeId(id)}]`;
};

export const footnote = (id: string, text: string) => {
	if (!isValidId(id)) {
		return '';
	}
	const normalized = normalizeId(id);
	const content = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
	if (!content.includes('\n')) {
		return `[^${normalized}]: ${content}`;
	}
	const indented = content.replaceAll('\n', '\n    ');
	return `[^${normalized}]: ${indented}`;
};
