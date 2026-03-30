const escapeEdge = (text: string, character: string) => {
	let result = text;
	if (result.startsWith(character)) {
		result = `\\${result}`;
	}
	if (result.endsWith(character) && !result.endsWith(`\\${character}`)) {
		result = `${result.slice(0, -1)}\\${character}`;
	}
	return result;
};

// Bold uses __ which doesn't do intraword emphasis — only edge escaping needed
export const bold = (text: string) => `__${escapeEdge(text, '_')}__`;

// Italic uses * which DOES do intraword emphasis — escape all * in content
export const italic = (text: string) => `*${text.replaceAll('*', String.raw`\*`)}*`;

export const strikethrough = (text: string) => `~~${escapeEdge(text, '~')}~~`;
