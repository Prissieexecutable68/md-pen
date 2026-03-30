import { describe, test, expect } from 'manten';
import { render } from '../utils/render.ts';
import {
	bold, italic, strikethrough,
} from '../../src/emphasis.ts';

describe('emphasis', () => {
	test('bold wraps text with double underscores', () => {
		expect(bold('text')).toBe('__text__');
	});

	test('italic wraps text with single asterisks', () => {
		expect(italic('text')).toBe('*text*');
	});

	test('strikethrough wraps text with double tildes', () => {
		expect(strikethrough('text')).toBe('~~text~~');
	});

	test('handles empty string', () => {
		expect(bold('')).toBe('____');
		expect(italic('')).toBe('**');
		expect(strikethrough('')).toBe('~~~~');
	});

	test('escapes delimiter chars at text edges', () => {
		expect(bold('x_')).toBe(String.raw`__x\___`);
		expect(italic('*x')).toBe(String.raw`*\*x*`);
		expect(strikethrough('~x')).toBe(String.raw`~~\~x~~`);
	});

	test('bold and italic compose naturally', () => {
		expect(bold(italic('text'))).toBe('__*text*__');
		expect(italic(bold('text'))).toBe('*__text__*');
	});
});

describe('emphasis delimiter collision', () => {
	test('bold("x*") renders entire content in bold', () => {
		const html = render(bold('x*'));
		expect(html).toContain('<strong>');
		expect(html).not.toMatch(/<\/strong>\*/);
	});

	test('bold("*x") renders entire content in bold', () => {
		const html = render(bold('*x'));
		expect(html).toContain('<strong>');
		expect(html).not.toMatch(/\*<strong>/);
	});

	test('italic("x*") renders entire content in italic', () => {
		const html = render(italic('x*'));
		expect(html).toContain('<em>');
		expect(html).not.toMatch(/<\/em>\*/);
	});

	test('strikethrough("~x") renders as strikethrough, not code block', () => {
		const html = render(strikethrough('~x'));
		expect(html).not.toContain('<pre>');
		expect(html).not.toContain('<code');
		expect(html).toContain('<del>');
	});

	test('strikethrough("x~") renders entire content', () => {
		const html = render(strikethrough('x~'));
		expect(html).toContain('<del>');
	});

	test('bold(italic("x*")) renders entire content', () => {
		const html = render(bold(italic('x*')));
		expect(html).toContain('<strong>');
		expect(html).toContain('<em>');
	});
});

describe('emphasis already-delimited input', () => {
	test('italic("*x*") does not render as bold', () => {
		const html = render(italic('*x*'));
		expect(html).toContain('<em>');
		expect(html).not.toMatch(/<strong>[^<]*<\/strong>/);
	});

	test('strikethrough("~x~") does not render as code block', () => {
		const html = render(strikethrough('~x~'));
		expect(html).not.toContain('<pre>');
		expect(html).not.toContain('<code');
		expect(html).toContain('<del>');
	});
});

describe('emphasis with intraword delimiter', () => {
	test('italic("a*b") renders entire content in italic', () => {
		const html = render(italic('a*b'));
		expect(html).toContain('<em>');
		// The * should be part of the italic content, not a stray delimiter
		expect(html).not.toMatch(/<\/em>b/);
	});

	test('bold("a_b") renders entire content in bold', () => {
		const html = render(bold('a_b'));
		expect(html).toContain('<strong>');
		expect(html).not.toMatch(/<\/strong>b/);
	});
});
