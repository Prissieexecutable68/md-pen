export const heading = (
	text: string,
	level: 1 | 2 | 3 | 4 | 5 | 6 = 1,
) => {
	const singleLine = text.replaceAll(/[\r\n]+/g, ' ');
	return `${'#'.repeat(level)} ${singleLine.replace(/(#+)\s*$/, String.raw`\$1`)}`;
};

export const h1 = (text: string) => heading(text, 1);
export const h2 = (text: string) => heading(text, 2);
export const h3 = (text: string) => heading(text, 3);
export const h4 = (text: string) => heading(text, 4);
export const h5 = (text: string) => heading(text, 5);
export const h6 = (text: string) => heading(text, 6);
