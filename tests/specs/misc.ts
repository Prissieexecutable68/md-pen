import { describe, test, expect } from 'manten';
import {
	kbd, sub, sup, mention, emoji,
} from '../../src/misc.ts';

describe('kbd', () => {
	test('basic key', () => {
		expect(kbd('Enter')).toBe('<kbd>Enter</kbd>');
	});

	test('escapes HTML in key', () => {
		expect(kbd('<script>')).toBe('<kbd>&lt;script&gt;</kbd>');
	});
});

describe('sub', () => {
	test('basic subscript', () => {
		expect(sub('2')).toBe('<sub>2</sub>');
	});

	test('escapes HTML in text', () => {
		expect(sub('a&b')).toBe('<sub>a&amp;b</sub>');
	});
});

describe('sup', () => {
	test('basic superscript', () => {
		expect(sup('2')).toBe('<sup>2</sup>');
	});

	test('escapes HTML in text', () => {
		expect(sup('a<b')).toBe('<sup>a&lt;b</sup>');
	});
});

describe('mention', () => {
	test('basic username', () => {
		expect(mention('octocat')).toBe('@octocat');
	});

	test('org/team format', () => {
		expect(mention('org/team')).toBe('@org/team');
	});
});

describe('emoji', () => {
	test('basic emoji', () => {
		expect(emoji('rocket')).toBe(':rocket:');
	});
});
