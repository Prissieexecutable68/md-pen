import { escapeHtml } from './escape.ts';

export const kbd = (key: string) => `<kbd>${escapeHtml(key)}</kbd>`;

export const sub = (text: string) => `<sub>${escapeHtml(text)}</sub>`;

export const sup = (text: string) => `<sup>${escapeHtml(text)}</sup>`;

export const mention = (username: string) => `@${username}`;

export const emoji = (name: string) => `:${name}:`;
