import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, t } from '../src/lib/i18n.ts';

test('formatDate defaults to long-form en-US', () => {
  const date = new Date(2026, 6, 24); // local components avoid UTC/local-timezone drift
  assert.equal(formatDate(date), 'July 24, 2026');
});

test('formatDate defaults to long-form es', () => {
  const date = new Date(2026, 6, 24);
  const result = formatDate(date, 'es');
  // bare 'es' locale ICU output isn't stable across Node builds, so check substrings
  assert.match(result, /julio/);
  assert.match(result, /2026/);
});

test('formatDate en and es output differ', () => {
  const date = new Date(2026, 6, 24);
  assert.notEqual(formatDate(date, 'en'), formatDate(date, 'es'));
});

test('formatDate honors custom options, pinned to a fixed timezone for determinism', () => {
  const date = new Date(Date.UTC(2026, 6, 24));
  const result = formatDate(date, 'en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  assert.equal(result, 'Jul 24, 2026');
});

test('t() returns en strings by default', () => {
  const strings = t();
  assert.equal(strings.readMore, 'Read More');
  assert.equal(strings.pageOf(2, 5), 'Page 2 of 5');
  assert.equal(strings.minRead(4), '4 min read');
  assert.equal(strings.blogPagination, 'Blog pagination');
  assert.equal(strings.filterPosts, 'Filter posts');
  assert.equal(strings.photoCredit, 'Photo:');
  assert.equal(strings.via, 'via');
});

test('t("es") returns es strings', () => {
  const strings = t('es');
  assert.equal(strings.readMore, 'Leer más');
  assert.equal(strings.pageOf(2, 5), 'Página 2 de 5');
  assert.equal(strings.minRead(4), '4 min de lectura');
  assert.equal(strings.blogPagination, 'Paginación del blog');
  assert.equal(strings.filterPosts, 'Filtrar publicaciones');
  assert.equal(strings.photoCredit, 'Foto:');
  assert.equal(strings.via, 'vía');
});
