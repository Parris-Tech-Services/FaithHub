// Convert a user-selected, local Google Colab copy manifest to FaithHub's
// private Drive catalogue. No network calls; never commit user Drive IDs.
// The CSV remains on the user's device and private catalogue stays browser-local.
export function readCsv(text) {
  if (typeof text !== 'string' || text.length > 300000) throw new Error('CSV file is too large (300 KB maximum).');
  const rows = [];
  let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') {
      if (cell) throw new Error('Malformed CSV quoting.');
      quoted = true;
    } else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some(x => x.length)) rows.push(row);
      row = [];
      if (rows.length > 2000) throw new Error('Too many CSV rows.');
    } else cell += c;
  }
  if (quoted) throw new Error('Unclosed quoted CSV field.');
  row.push(cell);
  if (row.some(x => x.length)) rows.push(row);
  return rows;
}

const playableExt = /\.(?:mp3|m4a|aac|ogg|flac|wav|aif|aiff|wma)$/i;
const excludedInterview = /leo[\W_]+(?:and[\W_]+|&[\W_]*)margaret|margaret[\W_]+(?:and[\W_]+|&[\W_]*)leo/i;

export function parseCornerstoneManifestCsv(text) {
  const rows = readCsv(text.replace(/^\uFEFF/, ''));
  if (!rows.length) throw new Error('The CSV manifest is empty.');
  const keys = rows.shift().map(s => s.trim().toLowerCase());
  const required = ['source_folder','filename','status','copy_file_id','bytes'];
  const offsets = Object.fromEntries(required.map(name => [name, keys.indexOf(name)]));
  if (Object.values(offsets).some(i => i < 0)) throw new Error('This is not a Cornerstone Colab copy-results CSV.');
  const results = [], seen = new Set();
  const stats = { rows: rows.length, eligible: 0, empty: 0, failed: 0, ignored: 0 };
  for (const values of rows) {
    const get = key => (values[offsets[key]] || '').trim();
    const status = get('status').toLowerCase();
    if (!['copied and verified','already copied'].includes(status)) { stats.failed++; continue; }
    const filename = get('filename');
    const id = get('copy_file_id');
    const size = Number(get('bytes'));
    if (!Number.isFinite(size) || size <= 0) { stats.empty++; continue; }
    if (!playableExt.test(filename) || excludedInterview.test(filename) || !/^[A-Za-z0-9_-]{15,120}$/.test(id)) { stats.ignored++; continue; }
    if (seen.has(id)) continue;
    seen.add(id);
    stats.eligible++;
    const folder = get('source_folder').replace(/^Cornerstone Podcasts\/?/, '').trim();
    results.push({
      driveId: id,
      title: filename.replace(playableExt,'').replace(/[_]+/g, ' ').trim().slice(0,240),
      folder: folder.slice(0,170),
    });
  }
  return { recordings: results, stats };
}
