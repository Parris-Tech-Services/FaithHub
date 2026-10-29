// FaithHub's original, minimal Scripture pathways. Bible text belongs to its publishers:
// we link to authorised full passages rather than reproduce copyrighted translations.
export const psalmPaths = Object.freeze([
  {
    id: 'rest', cue: 'I need rest', label: 'When life feels heavy',
    reference: 'Psalm 23', topic: 'God’s presence in ordinary and dark places',
    bibleUrl: 'https://www.bible.com/bible/111/PSA.23.NIV',
    overview: 'David describes the Lord as a shepherd who guides and stays with his people, including through danger. The psalm does not deny the valley; it speaks of God’s presence there.',
    notice: 'What does the shepherd do? Which part of the psalm helps you remember you are not alone?',
    prayer: 'Lord Jesus, shepherd me today. Stay near as I walk through what is difficult, and help me receive your care.',
    practice: 'Open your hands. Name one burden and ask Jesus for help with the next faithful step.',
    practiceAnchor: 'petition',
    cueLine: 'Rest does not have to be earned.'
  },
  {
    id: 'lament', cue: 'I feel hurt', label: 'When I need to lament',
    reference: 'Psalm 13', topic: 'An honest complaint brought to God',
    bibleUrl: 'https://www.bible.com/bible/111/PSA.13.NIV',
    overview: 'David speaks directly to God about feeling forgotten and overwhelmed. The movement toward trust does not make his earlier pain dishonest.',
    notice: 'What question is repeated? What might you say to God without editing out your sadness?',
    prayer: 'God, I am bringing you what hurts. Hear my questions and sorrow. Please help me hold on to your love.',
    practice: 'If you wish, write one truthful sentence beginning “How long, Lord…”',
    practiceAnchor: 'lament',
    cueLine: 'You do not have to pretend to be fine.'
  },
  {
    id: 'thanks', cue: 'I want to thank God', label: 'When I want to give thanks',
    reference: 'Psalm 100', topic: 'Gratitude rooted in God’s character',
    bibleUrl: 'https://www.bible.com/bible/111/PSA.100.NIV',
    overview: 'The psalm calls people to worship with joy and gratitude, remembering the goodness and enduring faithfulness of the Lord.',
    notice: 'What does the psalm say about who God is, apart from anything you did today?',
    prayer: 'Father, thank you for your goodness and faithful love. Open my eyes to your gifts and teach me to share them.',
    practice: 'Name one specific gift from today, however small, and give thanks.',
    practiceAnchor: 'thankfulness',
    cueLine: 'A small thank-you is enough to begin.'
  },
  {
    id: 'wait', cue: 'I am waiting', label: 'When I need courage',
    reference: 'Psalm 27', topic: 'Seeking God in uncertainty',
    bibleUrl: 'https://www.bible.com/bible/111/PSA.27.NIV',
    overview: 'This psalm joins trust with a plea for help. David seeks the Lord even as he faces fear and opposition, ending with encouragement to wait.',
    notice: 'Where do courage and need appear together? What is one thing you can entrust to God?',
    prayer: 'Jesus, be my light when I cannot see what is next. Give me courage to do what is right while I wait.',
    practice: 'Speak one fear aloud or silently. Ask for wisdom for your next step.',
    practiceAnchor: 'petition',
    cueLine: 'Waiting is not the same as being forgotten.'
  }
]);

export const christianVoices = Object.freeze([
  {
    name: 'Sons of Korah', category: 'The Psalms in song',
    detail: 'Australian musicians who set biblical psalms to music. Listen after reading and let the words become prayer.',
    url: 'https://sonsofkorah.com/', cta: 'Explore their Psalms music'
  },
  {
    name: 'Colin Buchanan', category: 'Faith for families',
    detail: 'Australian Christian songs and children’s resources that help Scripture live in family life.',
    url: 'https://colinbuchanan.com.au/', cta: 'Explore family faith music'
  },
  {
    name: 'Paul Roe', category: 'Faith and Australian stories',
    detail: 'Explore stories of faith, community and Australia’s history from The Outback Historian.',
    url: 'https://www.theoutbackhistorian.com.au/', cta: 'Explore the Outback Historian'
  }
]);

export const NOTE_KEY = 'faithhub-psalm-explore-notes-v1';
export const MAX_NOTE_LENGTH = 1200;
export const getPsalmPath = id => psalmPaths.find(path => path.id === id) ?? psalmPaths[0];

// Private entries are intentionally small, local only, and resilient to old or malformed browser state.
export function parsePrivateNotes(raw) {
  try {
    const value = JSON.parse(raw || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1 ||
        !value.notes || typeof value.notes !== 'object' || Array.isArray(value.notes)) return {};
    return Object.fromEntries(psalmPaths
      .filter(path => typeof value.notes[path.id] === 'string' &&
        value.notes[path.id].length <= MAX_NOTE_LENGTH)
      .map(path => [path.id, value.notes[path.id]]));
  } catch { return {}; }
}
export function preparePrivateNote(text) {
  if (typeof text !== 'string') throw new TypeError('A reflection must be text.');
  if (text.length > MAX_NOTE_LENGTH) throw new RangeError('Reflection is too long.');
  return text;
}
export function serializePrivateNotes(notes) {
  const clean = {};
  for (const path of psalmPaths) {
    if (typeof notes[path.id] === 'string' && notes[path.id].length <= MAX_NOTE_LENGTH &&
        notes[path.id].trim() !== '') clean[path.id] = notes[path.id];
  }
  return JSON.stringify({ version: 1, notes: clean });
}
