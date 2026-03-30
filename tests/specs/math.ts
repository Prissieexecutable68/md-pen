import { describe, test, expect } from 'manten';
import { render } from '../utils/render.ts';
import { math, mathBlock } from '../../src/math.ts';

describe('math', () => {
	test('inline math', () => {
		expect(math('x^2')).toBe('$x^2$');
	});

	test('passes through LaTeX special characters', () => {
		expect(math(String.raw`\frac{a}{b}`)).toBe(String.raw`$\frac{a}{b}$`);
	});
});

describe('math edge cases', () => {
	test('empty expression returns empty string', () => {
		expect(math('')).toBe('');
	});

	test('expression with dollar sign is escaped', () => {
		expect(math('price = $5')).toBe(String.raw`$price = \$5$`);
	});
});

describe('mathBlock', () => {
	test('block math', () => {
		expect(mathBlock('x^2 + y^2 = z^2')).toBe('$$\nx^2 + y^2 = z^2\n$$');
	});

	test('multiline expression', () => {
		expect(mathBlock('a = 1\nb = 2')).toBe('$$\na = 1\nb = 2\n$$');
	});

	test('empty expression returns empty string', () => {
		expect(mathBlock('')).toBe('');
	});
});

describe('math with dollar signs', () => {
	test('math with $ stays in single math element', () => {
		const md = math('price = $5');
		const html = render(md);
		// comrak: <span data-math-style="inline">
		expect(html.match(/data-math-style/g)?.length ?? 0).toBe(1);
		expect(html).toContain('price =');
		expect(html).toContain('5');
	});

	test('mathBlock with $$ does not close early', () => {
		const md = mathBlock('x = $$');
		const html = render(md);
		// Must be a single display math element
		expect(html.match(/data-math-style/g)?.length ?? 0).toBe(1);
		expect(html).toContain('data-math-style="display"');
	});
});

describe('math edge cases', () => {
	test('math("") returns empty string', () => {
		expect(math('')).toBe('');
	});

	test('math with blank line does not split into paragraphs', () => {
		const html = render(math('a\n\nb'));
		expect(html).toContain('data-math-style="inline"');
	});

	test('mathBlock("") returns empty string', () => {
		expect(mathBlock('')).toBe('');
	});

	test('mathBlock with blank line does not split', () => {
		const html = render(mathBlock('a\n\nb'));
		expect(html).toContain('data-math-style="display"');
	});
});

describe('math backslash', () => {
	test('math with LaTeX commands preserves backslash', () => {
		const html = render(math(String.raw`\frac{a}{b}`));
		expect(html).toContain('data-math-style="inline"');
		expect(html).toContain('frac');
	});

	test('mathBlock with trailing backslash renders as display math', () => {
		const html = render(mathBlock('a\\'));
		expect(html).toContain('data-math-style="display"');
	});
});

describe('mathBlock CR blank lines', () => {
	test('mathBlock with CRLF blank line renders as display math', () => {
		const html = render(mathBlock('a\r\n\r\nb'));
		expect(html).toContain('data-math-style="display"');
	});

	test('mathBlock with CR blank line renders as display math', () => {
		const html = render(mathBlock('a\r\rb'));
		expect(html).toContain('data-math-style="display"');
	});
});
