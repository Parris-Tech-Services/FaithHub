// FaithHub original study metadata. No Bible translation, music, photographs,
// transcripts or proprietary e-Sword/Glo assets are bundled in this file.
// Public resource links are editorial recommendations, not endorsements.
export const passages = Object.freeze([
  { id: "psalm-13", reference: "Psalm 13", title: "Bring honest lament", theme: "Lament", era: "Psalms and Israel's worship", place: "Israel", summary: "A prayer moves from questions and anguish toward remembrance and trust.", reflect: "What feels unanswered? What would honest prayer sound like today?", bible: "https://www.bible.com/bible/111/PSA.13.NIV", companion: "https://bibleproject.com/videos/psalms/", creatorId: "sons-of-korah" },
  { id: "psalm-23", reference: "Psalm 23", title: "The Shepherd's care", theme: "Trust", era: "Psalms and Israel's worship", place: "Israel", summary: "The imagery of a shepherd invites reflection on guidance, provision and presence.", reflect: "Where do I need to receive God's care rather than manage everything?", bible: "https://www.bible.com/bible/111/PSA.23.NIV", companion: "https://bibleproject.com/videos/psalms/", creatorId: "sons-of-korah" },
  { id: "psalm-88", reference: "Psalm 88", title: "Pray without a tidy ending", theme: "Lament", era: "Psalms and Israel's worship", place: "Israel", summary: "This psalm gives language for suffering without insisting on a quick resolution.", reflect: "What grief needs permission to be spoken in God's presence?", bible: "https://www.bible.com/bible/111/PSA.88.NIV", companion: "https://bibleproject.com/videos/psalms/", creatorId: "sons-of-korah" },
  { id: "genesis-12", reference: "Genesis 12", title: "Called to trust", theme: "Calling", era: "Patriarchal narratives", place: "Canaan", summary: "Abram is called to follow God's promise into an unfamiliar future.", reflect: "What might faithfulness look like when I do not know the whole route?", bible: "https://www.bible.com/bible/111/GEN.12.NIV", companion: "https://bibleproject.com/", creatorId: null },
  { id: "luke-11", reference: "Luke 11:5–13", title: "Ask, seek and knock", theme: "Petition", era: "Jesus' ministry", place: "Galilee and Judea", summary: "Jesus teaches persistent prayer and portrays the Father as generous and trustworthy.", reflect: "What do I need to ask God for honestly, including the Holy Spirit's help?", bible: "https://bible.com/bible/111/luk.11.5-13.NIV", companion: "https://www.practicingtheway.org/prayer", creatorId: "john-mark-comer" },
  { id: "john-15", reference: "John 15:4–5", title: "Abide in Christ", theme: "Discipleship", era: "Jesus' ministry", place: "Jerusalem and Judea", summary: "Jesus describes life and fruitfulness through remaining connected to him.", reflect: "Which part of today is an invitation to abide rather than strive?", bible: "https://www.bible.com/bible/111/JHN.15.4-5.NIV", companion: "https://bibleproject.com/", creatorId: "john-mark-comer" },
  { id: "galatians-5", reference: "Galatians 5:22–23", title: "Fruit of the Spirit", theme: "Family", era: "Early church", place: "Galatia", summary: "Paul names the Spirit's fruit as the character of a life being formed in love.", reflect: "Which fruit might I ask the Spirit to grow in my words and actions?", bible: "https://www.bible.com/bible/111/GAL.5.22-23.NIV", companion: "https://bibleproject.com/", creatorId: "colin-buchanan" },
  { id: "philippians-4", reference: "Philippians 4:6–7", title: "Bring needs with thanksgiving", theme: "Gratitude", era: "Early church", place: "Philippi", summary: "Paul invites believers to bring anxious concerns to God through prayer and thanksgiving.", reflect: "What one concern can I name, and what one gift can I thank God for?", bible: "https://www.bible.com/bible/111/PHP.4.6-7.NIV", companion: "https://www.practicingtheway.org/prayer", creatorId: null },
  { id: "1-timothy-2", reference: "1 Timothy 2:1–2", title: "Pray for others", theme: "Intercession", era: "Early church", place: "Ephesus", summary: "The church is encouraged to offer requests and thanksgiving for all people, including leaders.", reflect: "Who comes to mind as someone I can pray for by name?", bible: "https://www.bible.com/bible/111/1TI.2.1-2.NIV", companion: "https://www.practicingtheway.org/prayer", creatorId: null }
]);

export const lenses = Object.freeze([
  { id: "bible", label: "Bible", intro: "Start with the passage and its own context; read Scripture on a licensed provider." },
  { id: "atlas", label: "Atlas", intro: "Explore biblical geography through an independent interactive atlas, then return to the passage." },
  { id: "timeline", label: "Timeline", intro: "Follow the broad narrative sequence. These are literary periods, not asserted historical dates." },
  { id: "topics", label: "Topics", intro: "Begin with an honest question and explore a few relevant passages." },
  { id: "media", label: "Media", intro: "Use authorised videos, teaching and music as companions, not substitutes for Scripture." }
]);

export const eras = Object.freeze([
  { title: "Beginnings and promises", description: "Genesis and the story of God's promises to Abraham and his family.", passages: ["genesis-12"] },
  { title: "Israel's poetry and prayer", description: "The Psalms give words to praise, gratitude, fear and lament. Their composition spans different settings.", passages: ["psalm-13", "psalm-23", "psalm-88"] },
  { title: "The life and teaching of Jesus", description: "The Gospels announce Jesus' ministry, prayer and call to abide in him.", passages: ["luke-11", "john-15"] },
  { title: "The early church", description: "The apostles teach prayer, Spirit-shaped character and life together.", passages: ["galatians-5", "philippians-4", "1-timothy-2"] }
]);

export const places = Object.freeze([
  { name: "Canaan", note: "The patriarchal narrative and the land of promise.", url: "https://bible-atlas.com/places", passages: ["genesis-12"] },
  { name: "Galilee and Judea", note: "Explore the settings of Jesus' teaching in the Gospels.", url: "https://bible-atlas.com/places", passages: ["luke-11", "john-15"] },
  { name: "Galatia", note: "The region connected with Paul's letter to the Galatians.", url: "https://bible-atlas.com/places", passages: ["galatians-5"] },
  { name: "Philippi", note: "The Macedonian city connected to Paul's letter to the Philippians.", url: "https://bible-atlas.com/places", passages: ["philippians-4"] }
]);

export const creators = Object.freeze([
  { id: "sons-of-korah", name: "Sons of Korah", category: "Psalms and music", description: "Australian musicians setting biblical Psalms to music. Read a Psalm, then continue to the band's official music and supporter app.", website: "https://sonsofkorah.com/", secondaryLabel: "Official Android app", secondaryUrl: "https://play.google.com/store/apps/details?id=com.fiveonline.sonsofkorah", passageIds: ["psalm-13", "psalm-23", "psalm-88"] },
  { id: "paul-roe", name: "Paul Roe · The Outback Historian", category: "Australian stories and faith", description: "Australian storytelling, history and accounts of faith across the outback. The related public remembrance site is a separate project.", website: "https://www.theoutbackhistorian.com.au/", secondaryLabel: "Remembering Paul Roe", secondaryUrl: "https://remembering-paul-roe.vercel.app/", passageIds: [] },
  { id: "colin-buchanan", name: "Colin Buchanan", category: "Christian music and family", description: "Australian Christian musician and storyteller, including music for children. Visit the official site for songs, recordings and shows.", website: "https://colinbuchanan.com.au/", secondaryLabel: "Christian music and shop", secondaryUrl: "https://colinbuchanan.com.au/collections/christian", passageIds: ["galatians-5"] },
  { id: "john-mark-comer", name: "John Mark Comer · Practicing the Way", category: "Prayer and discipleship", description: "Teaching and practices for becoming like Jesus, including the Prayer Practice.", website: "https://www.practicingtheway.org/prayer", secondaryLabel: "FaithHub prayer companion", secondaryUrl: "prayer-practice.html", passageIds: ["luke-11", "john-15"] },
  { id: "bibleproject", name: "BibleProject", category: "Bible context and animation", description: "Free visual introductions to biblical books, themes and literary design.", website: "https://bibleproject.com/", secondaryLabel: "Book of Psalms video", secondaryUrl: "https://bibleproject.com/videos/psalms/", passageIds: ["psalm-13", "psalm-23", "psalm-88"] },
  { id: "24-7prayer", name: "24-7 Prayer", category: "Daily prayer rhythms", description: "Prayer movements and resources including Lectio 365 and guides for building a prayer rhythm.", website: "https://www.24-7prayer.com/", secondaryLabel: "Lectio 365", secondaryUrl: "https://lectio365.com/the-app/", passageIds: [] }
]);

export const tools = Object.freeze([
  { name: "e-Sword", type: "External study software", description: "Parallel Bibles, Strong's references, commentaries, dictionaries, notes and searching in a separate application.", url: "https://www.e-sword.net/", note: "Open the official site. There is no e-Sword module or API inside FaithHub." },
  { name: "YouVersion Bible", type: "Licensed passage reading", description: "Read each selected passage in the Bible app or browser, with translation choices managed by the provider.", url: "https://www.bible.com/", note: "FaithHub does not republish NIV or other licensed Bible text." },
  { name: "Bible Atlas", type: "Visual Bible reference", description: "Interactive places, routes, timelines and cross-reference visualisations.", url: "https://bible-atlas.com/visualizations", note: "The interactive atlas is provided by an independent website." },
  { name: "Blue Letter Bible", type: "Word study", description: "Consult concordances, original-language lexicons and commentaries when word meaning matters.", url: "https://www.blueletterbible.org/", note: "Strong's numbering is a reference system, not a substitute for context." },
  { name: "BibleProject", type: "Video and literary context", description: "Official original Bible book overviews, themes and podcast lessons.", url: "https://bibleproject.com/", note: "Video remains hosted by the original creator." }
]);

const byId = new Map(passages.map(p => [p.id, p]));
export function findPassage(id) { return byId.get(id) || null; }
export function searchPassages(query, theme = "") {
  const q = String(query || "").trim().toLocaleLowerCase();
  return passages.filter(p => (!theme || p.theme === theme) &&
    (!q || [p.reference, p.title, p.theme, p.era, p.summary, p.place]
      .some(v => v.toLocaleLowerCase().includes(q))));
}
export function isTrustedResourceUrl(value) {
  try {
    const parsed = new URL(value, "https://faithhub.invalid/");
    return (parsed.protocol === "https:" && !parsed.username && !parsed.password) ||
      (!value.includes(":") && !value.startsWith("//") && /^[a-z0-9][a-z0-9/._#-]*\.html(?:#[a-z0-9-]+)?$/i.test(value));
  } catch { return false; }
}
export function exportNotes(notes) {
  const saved = {};
  for (const [key, value] of Object.entries(notes || {})) {
    if (byId.has(key) && typeof value === "string" && value.length <= 10000) saved[key] = value;
  }
  return JSON.stringify({ format: "faithhub-study-notes", version: 1, saved }, null, 2);
}
