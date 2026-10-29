import {passages, places, eras, creators, findPassage, searchPassages, exportNotes} from "./study-library.mjs";

const $ = id => document.getElementById(id);
const NOTE_KEY = "faithhub-bible-study-notes-v1";
let selected = "psalm-13";
let notes = {};
let dirty = false;
let storageReady = true;

function element(tag, text = "", cssClass = "") {
  const node = document.createElement(tag);
  node.textContent = text;
  if (cssClass) node.className = cssClass;
  return node;
}
function link(href, label, className = "") {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = label;
  if (className) a.className = className;
  if (href.startsWith("https://")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}
function savedNotes() {
  try {
    const loaded = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}");
    if (!loaded || Array.isArray(loaded) || typeof loaded !== "object") return {};
    return Object.fromEntries(
      Object.entries(loaded).filter(([key, text]) =>
        findPassage(key) && typeof text === "string" && text.length <= 10000)
    );
  } catch {
    storageReady = false;
    return {};
  }
}
function persist() {
  try { localStorage.setItem(NOTE_KEY, JSON.stringify(notes)); storageReady = true; return true; }
  catch { storageReady = false; return false; }
}
function status(message) { $("note-status").textContent = message; }
function confirmDiscard() {
  return !dirty || window.confirm("You have unsaved notes. Change passages without saving them?");
}
function showPassage(id, force = false) {
  const p = findPassage(id);
  if (!p) return false;
  if (!force && id !== selected && !confirmDiscard()) {
    $("study-select").value = selected;
    return false;
  }
  selected = id;
  $("study-select").value = id;
  $("passage-title").textContent = p.reference + " · " + p.title;
  $("passage-summary").textContent = p.summary;
  $("passage-question").textContent = p.reflect;
  $("passage-era").textContent = p.era + " · " + p.place;
  $("read-passage").href = p.bible;
  $("study-companion").href = p.companion;
  $("lens-bible-verse").href = p.bible;
  const creator = creators.find(c => c.id === p.creatorId);
  const creatorLink = $("study-creator");
  creatorLink.hidden = !creator;
  if (creator) {
    creatorLink.href = "christian-creators.html#" + creator.id;
    creatorLink.textContent = "Explore " + creator.name;
  }
  $("notes-for").textContent = p.reference;
  $("study-notes").value = notes[p.id] || "";
  dirty = false;
  status(storageReady ? "Notes are not saved automatically." : "Browser storage is unavailable. You can still read and study.");
  return true;
}
function setOptions(force = false) {
  const matches = searchPassages($("study-search").value, $("study-theme").value);
  const options = $("study-select");
  options.replaceChildren();
  for (const p of matches) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.reference + " — " + p.title;
    options.append(option);
  }
  $("search-count").textContent = matches.length + " curated passage" + (matches.length === 1 ? "" : "s") + " found.";
  if (!matches.length) {
    if (!$("study-select").options.length) options.append(element("option", "No matching studies"));
    options.disabled = true;
    return;
  }
  options.disabled = false;
  const next = matches.some(p => p.id === selected) ? selected : matches[0].id;
  if (!showPassage(next, force)) options.value = selected;
}
function renderAtlas() {
  const host = $("atlas-list");
  for (const place of places) {
    const card = element("article", "", "card");
    card.append(element("h3", place.name), element("p", place.note));
    const relevant = place.passages.map(findPassage).filter(Boolean);
    card.append(element("p", "Related reading: " + relevant.map(p => p.reference).join(", "), "small"));
    card.append(link(place.url, "Open the atlas for this region"));
    host.append(card);
  }
}
function renderTimeline() {
  const host = $("timeline-list");
  for (const era of eras) {
    const card = element("article", "", "card");
    card.append(element("h3", era.title), element("p", era.description));
    const row = element("div", "", "actions");
    for (const id of era.passages) {
      const p = findPassage(id);
      if (!p) continue;
      const button = element("button", p.reference);
      button.type = "button";
      button.addEventListener("click", () => {
        if (showPassage(id)) document.getElementById("study").scrollIntoView();
      });
      row.append(button);
    }
    card.append(row);
    host.append(card);
  }
}
function renderTopics() {
  const host = $("topics-list");
  const themes = Array.from(new Set(passages.map(p => p.theme))).sort();
  for (const theme of themes) {
    const group = passages.filter(p => p.theme === theme);
    const card = element("article", "", "card");
    card.append(element("h3", theme), element("p", group.map(p => p.reference).join(" · "), "small"));
    const button = element("button", "Explore " + theme);
    button.type = "button";
    button.addEventListener("click", () => {
      if (!confirmDiscard()) return;
      $("study-search").value = "";
      $("study-theme").value = theme;
      setOptions(true);
      document.getElementById("study").scrollIntoView();
    });
    card.append(button);
    host.append(card);
  }
}
function setupLenses() {
  const panels = [...document.querySelectorAll(".lenspanel")];
  document.querySelectorAll("[data-lens]").forEach(button => {
    button.addEventListener("click", () => {
      for (const other of document.querySelectorAll("[data-lens]")) {
        other.setAttribute("aria-pressed", String(other === button));
      }
      panels.forEach(panel => { panel.hidden = panel.id !== "lens-" + button.dataset.lens; });
    });
  });
}
function setupNotes() {
  $("study-notes").addEventListener("input", () => { dirty = true; status("Not saved yet."); });
  $("save-notes").addEventListener("click", () => {
    const value = $("study-notes").value;
    if (value.length > 10000) { status("Please shorten notes to 10,000 characters."); return; }
    if (!value.trim()) delete notes[selected];
    else notes[selected] = value;
    if (persist()) { dirty = false; status("Saved on this device only. Back up before clearing browser data."); }
    else status("Could not save to browser storage. You can copy the text manually.");
  });
  $("delete-notes").addEventListener("click", () => {
    if (!window.confirm("Delete your saved notes for this passage from this device?")) return;
    delete notes[selected];
    if (persist()) { $("study-notes").value = ""; dirty = false; status("Saved notes for this passage deleted."); }
    else status("Browser storage did not allow deletion.");
  });
  $("export-notes").addEventListener("click", () => {
    if (dirty && !window.confirm("Your current changes are not saved. Export the last saved version?")) return;
    const blob = new Blob([exportNotes(notes)], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faithhub-private-study-notes.json";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status("Backup file prepared. Keep the unencrypted JSON in a private location.");
  });
}
function init() {
  notes = savedNotes();
  for (const theme of Array.from(new Set(passages.map(p => p.theme))).sort()) {
    const option = document.createElement("option");
    option.value = option.textContent = theme;
    $("study-theme").append(option);
  }
  $("study-search").addEventListener("input", () => setOptions());
  $("study-theme").addEventListener("change", () => setOptions());
  $("study-select").addEventListener("change", event => showPassage(event.target.value));
  renderAtlas();
  renderTimeline();
  renderTopics();
  setupLenses();
  setupNotes();
  setOptions(true);
}
init();
