import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext, Script } from 'node:vm';

const html = readFileSync(new URL('../cornerstone-teachings.html', import.meta.url), 'utf8');
const home = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const podcasts = readFileSync(new URL('../podcasts.html', import.meta.url), 'utf8');
const config = readFileSync(new URL('../vite.config.js', import.meta.url), 'utf8');
const react = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]+?)<\/script>/)?.[1];
assert.ok(script, 'Cornerstone page must include the interactive JS');

const rMatch=script.match(/const RESOURCES=(\[[\s\S]+?\]);\s*const LESSONS=/);
const lMatch=script.match(/const LESSONS=(\[[\s\S]+?\]);\s*const \$=/);
assert.ok(rMatch, 'resources array should be found');
assert.ok(lMatch, 'lessons array should be found');
const resources = runInNewContext('('+rMatch[1]+')');
const lessons = runInNewContext('('+lMatch[1]+')');

test('the new page and links are wired into all FaithHub entrypoints', () => {
  assert.match(home, /href="cornerstone-teachings.html"/);
  assert.match(podcasts, /href="cornerstone-teachings.html"/);
  assert.match(react, /href="cornerstone-teachings.html"/);
  assert.match(config, /cornerstone: fileURLToPath/);
  assert.match(html, /<h1>Cornerstone Teachings<\/h1>/);
});
test('all 6 original pathways have precise, distinct study and a comprehension check', () => {
  assert.equal(lessons.length, 6);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  for (const l of lessons) {
    for (const key of ['verse','url','reflect','action','prayer','question','why']) assert.ok(l[key], l.id+' missing '+key);
    assert.match(l.url,/^https:\/\/www\.bible\.com\/bible\//);
    assert.ok(l.choices.length >= 3);
    assert.ok(l.correct >= 0 && l.correct < l.choices.length);
  }
});
test('resources point to official course hosts, public publishers and confirmed collections', () => {
  assert.ok(resources.length >= 10);
  const urls = resources.map(r => r.url);
  assert.ok(urls.some(u => u.includes('courses.cornerstonecommunity.org.au/courses/jesus-in-the-gospel-of-mark/')));
  assert.ok(urls.some(u => u.includes('courses.cornerstonecommunity.org.au/courses/the-quest-')));
  assert.ok(urls.some(u => u.includes('podcasts.apple.com/au/podcast/cornerstone-community-podcast/')));
  assert.ok(urls.some(u => u.includes('podcasts.apple.com/us/podcast/cornerstone-community-bendigo/')));
  assert.ok(urls.some(u => u.includes('youtube.com/live/')));
  for (const r of resources) {
    assert.match(r.url, /^https:\/\//);
    assert.ok(['podcast','video','teaching'].includes(r.type));
  }
});
test('browser script parses and privacy controls are implemented', () => {
  new Script(script);
  assert.match(script, /localStorage\.setItem\(STORE/);
  assert.match(script, /localStorage\.removeItem\(STORE/);
  assert.match(script, /JSON\.stringify\(\{format:"faithhub-cornerstone-v1"/);
  assert.match(script, /selected\.correct/);
  assert.match(html, /No.*grades|no grades|no account sync/i);
  assert.doesNotMatch(html, /drive\.google\.com|docs\.google\.com|mail\.google\.com/);
  assert.doesNotMatch(html, /<iframe|<audio\s/i);
});

test('GitHub Pages binds Cornerstone to its exact published source SHA', () => {
  const workflow = readFileSync(new URL('../.github/workflows/deploy.yml', import.meta.url), 'utf8');
  assert.match(workflow, /for filename in \("index\.html", "psalms\.html", "cornerstone-teachings\.html", "backup\.html"\)/);
  assert.match(workflow, /faithhub-deploy-sha/);
});
