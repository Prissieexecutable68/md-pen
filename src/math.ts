const escapeMath = (expression: string) => expression.replaceAll('$', String.raw`\$`);

export const math = (expression: string) => {
	if (expression === '') {
		return '';
	}
	// Inline math cannot span blank lines — collapse to single line
	const singleLine = expression.replaceAll(/[\r\n]+/g, ' ');
	return `$${escapeMath(singleLine)}$`;
};

export const mathBlock = (expression: string) => {
	if (expression === '') {
		return '';
	}
	// Normalize line endings first, then collapse blank lines
	const normalized = expression.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
	const noBlankLines = normalized.replaceAll(/\n{2,}/g, '\n');
	return `$$\n${escapeMath(noBlankLines)}\n$$`;
};
