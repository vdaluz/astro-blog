import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heroImageWebp } from '../src/lib/hero-image.ts';

test('heroImageWebp swaps jpg, jpeg, png and gif for webp in any case', () => {
  assert.equal(heroImageWebp('/img/a.jpg'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.jpeg'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.png'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.gif'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.JPG'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.Png'), '/img/a.webp');
});

test('heroImageWebp passes other extensions through unchanged', () => {
  assert.equal(heroImageWebp('/img/a.webp'), '/img/a.webp');
  assert.equal(heroImageWebp('/img/a.svg'), '/img/a.svg');
});

test('heroImageWebp only rewrites the final extension', () => {
  assert.equal(heroImageWebp('/img/a.png.backup'), '/img/a.png.backup');
});

test('heroImageWebp returns undefined when there is no hero image', () => {
  assert.equal(heroImageWebp(undefined), undefined);
});
