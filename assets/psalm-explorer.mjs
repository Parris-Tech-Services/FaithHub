import { getPsalmPath, psalmPaths, NOTE_KEY, MAX_NOTE_LENGTH, parsePrivateNotes, preparePrivateNote, serializePrivateNotes } from './psalm-explorer-data.mjs';

const options = Array.from(document.querySelectorAll('#psalm-options button[data-path]'));
const passageTitle = document.getElementById('passage-title');
const topic = document.getElementById('passage-topic');
const overview = document.getElementById('passage-overview');
const notice = document.getElementById('passage-notice');
const prayer = document.getElementById('passage-prayer');
const practice = document.getElementById('passage-practice');
const cue = document.getElementById('path-cue');
const readLink = document.getElementById('read-passage');
const prayLink = document.getElementById('pray-passage');
const note = document.getElementById('reflection-note');
const count = document.getElementById('note-count');
const status = document.getElementById('note-status');
let activeId = psalmPaths[0].id;

function loadNotes() {
  try { return parsePrivateNotes(window.localStorage.getItem(NOTE_KEY)); }
  catch { return {}; } // Browser storage may be disabled or unavailable.
}
function setStatus(message) { status.textContent = message; }
function render(id) {
  const path = getPsalmPath(id);
  activeId = path.id;
  for (const option of options) {
    option.setAttribute('aria-pressed', String(option.dataset.path === activeId));
  }
  passageTitle.textContent = path.reference;
  topic.textContent = path.topic;
  overview.textContent = path.overview;
  notice.textContent = path.notice;
  prayer.textContent = path.prayer;
  practice.textContent = path.practice;
  cue.textContent = path.cueLine;
  readLink.href = path.bibleUrl;
  readLink.firstChild.textContent = 'Read ' + path.reference + ' in the Bible App ';
  prayLink.href = 'prayer-practice.html#' + path.practiceAnchor;
  note.value = loadNotes()[activeId] || '';
  count.textContent = String(note.value.length);
  setStatus('');
}
options.forEach(option => option.addEventListener('click', () => {
  // Re-clicking the active path must never wipe an unsaved reflection.
  if (option.dataset.path !== activeId) render(option.dataset.path);
}));
note.addEventListener('input', () => {
  count.textContent = String(note.value.length);
  setStatus(note.value ? 'Not saved yet. Choose Save privately to keep this response.' : '');
});

document.getElementById('save-note').addEventListener('click', () => {
  try {
    const text = preparePrivateNote(note.value);
    const notes = loadNotes();
    if (text.trim()) {
      notes[activeId] = text;
      window.localStorage.setItem(NOTE_KEY, serializePrivateNotes(notes));
      setStatus('Saved in this browser only.');
    } else {
      setStatus('Nothing to save. To remove an existing note, choose Delete this note.');
    }
  } catch {
    setStatus('Your note was not saved. Browser storage may be full or unavailable.');
  }
});
document.getElementById('delete-note').addEventListener('click', () => {
  const stored = loadNotes();
  if (!stored[activeId] && !note.value) {
    setStatus('There is no note to delete for this Psalm.');
    return;
  }
  if (!window.confirm('Delete this Psalm reflection from this browser? This cannot be undone.')) {
    setStatus('Nothing was deleted.');
    return;
  }
  try {
    delete stored[activeId];
    window.localStorage.setItem(NOTE_KEY, serializePrivateNotes(stored));
    note.value = '';
    count.textContent = '0';
    setStatus('Your note for this Psalm has been deleted from this browser.');
  } catch {
    setStatus('Could not remove the saved note. Check your browser storage settings.');
  }
});

const selected = new URLSearchParams(window.location.search).get('path');
render(selected);
