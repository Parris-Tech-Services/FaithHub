import assert from 'node:assert/strict';

// FaithHub deliberately loads only this approved analytics worker as a remote script.
// Keep an exact allowlist so additional third-party code cannot silently enter pages.
export const ANALYTICS_TAG = '<script defer src="https://parris-analytics.parris-neathaustralia.workers.dev/tracker.js" data-site="faithhub" referrerpolicy="no-referrer">';

export function assertOnlyApprovedRemoteScripts(html) {
  const remote = [...html.matchAll(/<script\b[^>]*\bsrc=["']https?:\/\/[^"']+["'][^>]*>/gi)].map(match => match[0]);
  assert.deepEqual(remote, [ANALYTICS_TAG], 'only the approved FaithHub analytics script may load remotely');
}
