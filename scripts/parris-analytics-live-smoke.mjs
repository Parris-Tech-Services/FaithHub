import assert from 'node:assert/strict';

const base = 'https://parris-analytics.parris-neathaustralia.workers.dev';
const request = (path, init = {}) => fetch(base + path, { signal: AbortSignal.timeout(15000), ...init });
const health = await request('/health');
assert.equal(health.status, 200, 'Worker health endpoint must be available');
const status = await health.json();
assert.equal(status.ok, true, 'Worker health must be OK');
assert.equal(status.database, 'ready', 'D1 connection must be healthy');

const trackerResponse = await request('/tracker.js');
assert.equal(trackerResponse.status, 200, 'Tracker must be served');
assert.match(trackerResponse.headers.get('content-type') ?? '', /javascript/i);
const tracker = await trackerResponse.text();
for (const marker of ['parris-analytics-consent-v1', 'globalPrivacyControl', 'doNotTrack', 'Decline', 'Analytics settings', 'session_start', 'credentials']) {
  assert.ok(tracker.includes(marker), 'Required privacy or tracking marker missing: ' + marker);
}

// Test only an unauthorised origin: do not record diagnostic or real visitor events.
const rejected = await request('/event', {
  method: 'POST',
  headers: { 'Origin': 'https://example.com', 'Content-Type': 'application/json' },
  body: JSON.stringify({ site: 'faithhub', path: '/podcasts.html', event: 'page_view' }),
});
assert.equal(rejected.status, 403, 'Unregistered origin must be refused');
console.log('Parris Analytics smoke PASS: Worker, database, consent tracker and origin rejection.');
