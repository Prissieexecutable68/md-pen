import { describe, test, expect } from 'manten';
import { render } from '../utils/render.ts';
import { hr, details } from '../../src/block.ts';

describe('hr', () => {
	test('returns horizontal rule', () => {
		expect(hr()).toBe('---');
	});
});

describe('details', () => {
	test('basic collapsible section', () => {
		expect(details('Expand', 'Content')).toBe(
			'<details>\n<summary>Expand</summary>\n\nContent\n\n</details>',
		);
	});

	test('escapes HTML in summary', () => {
		expect(details('<script>alert("xss")</script>', 'Content')).toBe(
			'<details>\n<summary>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</summary>\n\nContent\n\n</details>',
		);
	});

	test('passes through markdown in content', () => {
		expect(details('Summary', '**bold** and `code`')).toBe(
			'<details>\n<summary>Summary</summary>\n\n**bold** and `code`\n\n</details>',
		);
	});

	test('empty content', () => {
		expect(details('Summary', '')).toBe(
			'<details>\n<summary>Summary</summary>\n\n\n\n</details>',
		);
	});

	test('empty summary', () => {
		expect(details('', 'Content')).toBe(
			'<details>\n<summary></summary>\n\nContent\n\n</details>',
		);
	});

	test('multiline content', () => {
		expect(details('Summary', 'line 1\n\nline 2')).toBe(
			'<details>\n<summary>Summary</summary>\n\nline 1\n\nline 2\n\n</details>',
		);
	});
});

describe('details content injection', () => {
	test('</details> in content does not close block early', () => {
		const html = render(details('sum', '</details>\nout'));
		expect(html.match(/<details>/g)?.length).toBe(1);
		expect(html.match(/<\/details>/g)?.length).toBe(1);
	});

	test('</DETAILS> case-insensitive does not close block early', () => {
		const html = render(details('sum', '</DETAILS>\nout'));
		expect(html.match(/<\/details>/gi)?.length).toBe(1);
	});

	test('</DeTaIlS> mixed case does not close block early', () => {
		const html = render(details('sum', '</DeTaIlS>\nout'));
		expect(html.match(/<\/details>/gi)?.length).toBe(1);
	});

	test('</details > with space does not close block early', () => {
		const html = render(details('sum', '</details >\nout'));
		expect(html.match(/<\/details>/gi)?.length).toBe(1);
	});
});
