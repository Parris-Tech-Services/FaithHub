import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'rule-of-life-companion-v1'
const APPEARANCE_KEY = 'faithhub-appearance-v1'
const todayKey = () => {
  const now = new Date()
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
}

const scriptures = [
  { ref: 'Matthew 11:28–30', text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me…', posture: 'Receive rest before you try to improve.' },
  { ref: 'Galatians 5:22–23', text: 'The fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control.', posture: 'Fruit grows by abiding, not forcing.' },
  { ref: 'Psalm 23:1–3', text: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures… he refreshes my soul.', posture: 'Let God shepherd your pace today.' },
  { ref: 'Micah 6:8', text: 'To act justly and to love mercy and to walk humbly with your God.', posture: 'Small faithfulness counts.' },
  { ref: 'John 15:4–5', text: 'Remain in me, as I also remain in you… apart from me you can do nothing.', posture: 'Start with connection, not effort.' },
  { ref: 'Philippians 4:6–7', text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', posture: 'Bring the anxious thing into God’s presence.' },
  { ref: 'Romans 12:2', text: 'Do not conform to the pattern of this world, but be transformed by the renewing of your mind.', posture: 'Transformation is received slowly and honestly.' },
  { ref: 'Luke 11:5–13 (NIV)', text: 'Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.', posture: 'Bring your needs to the Father; ask for the Holy Spirit and trust his goodness.', url: 'https://bible.com/bible/111/luk.11.5-13.NIV' },
]

const fruits = [
  { name: 'Love', prompt: 'Where could I move toward someone with costly kindness today?', practice: 'Pause before reacting. Ask: what would love look like here?' },
  { name: 'Joy', prompt: 'Where did I notice goodness, beauty, or delight?', practice: 'Name one small gift aloud and thank God for it.' },
  { name: 'Peace', prompt: 'What part of me feels hurried, defended, or unsafe?', practice: 'Breathe slowly and unclench your jaw, shoulders, and hands.' },
  { name: 'Patience', prompt: 'Where am I being invited to slow down rather than control?', practice: 'Choose one delay today as a place to practise trust.' },
  { name: 'Kindness', prompt: 'Who needs a gentle word or practical act of care?', practice: 'Do one hidden act of kindness without announcing it.' },
  { name: 'Goodness', prompt: 'Where can I do the right thing even if no one notices?', practice: 'Pick one small faithful action and do it simply.' },
  { name: 'Faithfulness', prompt: 'What is mine to carry today, and what is not?', practice: 'Return to one commitment without harshness or drama.' },
  { name: 'Gentleness', prompt: 'Where do I need to lower the force of my words, tone, or expectations?', practice: 'Speak one sentence softer than you feel like speaking.' },
  { name: 'Self-control', prompt: 'What desire needs wise boundaries rather than shame?', practice: 'Create one small friction point between impulse and action.' },
]

const rhythms = [
  { id: 'morning', title: 'Morning receiving', icon: '☀️', when: 'Start of day', desc: 'Open hands. Ask for grace, not perfection.', prayer: 'Father, receive this day. Form Christ in me. Help me walk in love, truth, humility, and courage.' },
  { id: 'midday', title: 'Midday reset', icon: '🌬️', when: 'When scattered', desc: 'One minute to return to your body and God’s presence.', prayer: 'Lord Jesus Christ, have mercy on me. I return to You. Show me the next faithful step.' },
  { id: 'evening', title: 'Evening examen', icon: '🌙', when: 'Before bed', desc: 'Notice grace, fear, repentance, gratitude, and rest.', prayer: 'Holy Spirit, search me gently. Thank You for grace today. I give You what remains unfinished.' },
  { id: 'family', title: 'Family prayer', icon: '🏠', when: 'Dinner or bedtime', desc: 'Short, warm prayer with the people in your home.', prayer: 'Jesus, bless our family. Help our home become a place of peace, kindness, honesty, and love.' },
]

const familyPrompts = [
  'Thank God for one good thing each person noticed today.',
  'Pray one sentence of blessing over each child or family member.',
  'Ask: where did we need help today? Then pray simply about it.',
  'Read one short Psalm line and let everyone choose one word they liked.',
  'Practise apology and repair: “I’m sorry for… Please forgive me.”',
  'Sit quietly for 30 seconds and remember Jesus is near.',
]

const restIdeas = [
  'No productivity goal for a set block of time.',
  'Enjoy creation: walk, garden, sit outside, or watch the sky.',
  'Shared meal without rushing.',
  'A nap, quiet reading, or gentle play.',
  'Put away one device for a chosen window.',
  'Worship, church, prayer, or a slow Psalm.',
]

const stillnessAnchors = [
  { ref: 'Psalm 46:10', text: 'Be still, and know that I am God.', note: 'Let your shoulders drop. You do not need to earn God’s attention.' },
  { ref: 'Matthew 11:28', text: 'Come to me, all you who are weary and burdened, and I will give you rest.', note: 'Bring tired hands as they are. Nothing needs to be finished first.' },
  { ref: 'Psalm 131:2', text: 'I have calmed and quieted myself…', note: 'Breathe naturally. Quiet companionship with Jesus is enough.' },
]

const formatStillnessTime = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

const blankEntry = (date = todayKey()) => ({
  date,
  rhythms: {},
  reflection: { gratitude: '', repentance: '', fear: '', grace: '', fruit: '', body: '', prayer: '' },
  sabbath: { planned: false, rested: false, notes: '' },
  community: { church: false, checkedIn: false, served: false, notes: '' },
})

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved || { entries: { [todayKey()]: blankEntry() } }
  } catch {
    return { entries: { [todayKey()]: blankEntry() } }
  }
}

function TextArea({ value, onChange, placeholder }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
}

function CheckCard({ checked, onChange, title, subtitle }) {
  return (
    <button className={`check-card ${checked ? 'active' : ''}`} onClick={() => onChange(!checked)} type="button">
      <span className="check-dot">{checked ? '✓' : ''}</span>
      <span>
        <strong>{title}</strong>
        {subtitle && <small>{subtitle}</small>}
      </span>
    </button>
  )
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [date, setDate] = useState(todayKey())
  const [tab, setTab] = useState('today')
  const [appearance, setAppearance] = useState(() => { try { return ['sanctuary', 'uxpilot'].includes(localStorage.getItem(APPEARANCE_KEY)) ? localStorage.getItem(APPEARANCE_KEY) : 'original' } catch { return 'original' } })
  const [veilCommunityNotes, setVeilCommunityNotes] = useState(false)
  const [stillness, setStillness] = useState({ active: false, secondsLeft: null, anchorIndex: 0, finished: false })

  const entry = state.entries[date] || blankEntry(date)
  const presenceMode = state.preferences?.presenceMode !== false

  useEffect(() => { try { localStorage.setItem(APPEARANCE_KEY, appearance) } catch {} }, [appearance])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    if (!stillness.active || stillness.secondsLeft === null) return undefined
    const timer = setInterval(() => {
      setStillness((curr) => {
        if (!curr.active || curr.secondsLeft === null) return curr
        if (curr.secondsLeft <= 1) return { ...curr, secondsLeft: null, finished: true }
        return { ...curr, secondsLeft: curr.secondsLeft - 1 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [stillness.active, stillness.secondsLeft !== null])

  const dayIndex = useMemo(() => Math.abs(Math.floor(new Date(`${date}T00:00:00`).getTime() / 86400000)), [date])
  const scripture = scriptures[dayIndex % scriptures.length]
  const fruit = fruits[dayIndex % fruits.length]
  const familyPrompt = familyPrompts[dayIndex % familyPrompts.length]
  const stillnessWord = stillnessAnchors[stillness.anchorIndex % stillnessAnchors.length]

  const completedRhythms = Object.values(entry.rhythms).filter(Boolean).length
  const reflectionCount = Object.values(entry.reflection).filter(Boolean).length
  const progress = Math.min(100, Math.round(((completedRhythms + Math.min(reflectionCount, 3)) / 7) * 100))

  function updateEntry(updater) {
    setState((current) => {
      const existing = current.entries[date] || blankEntry(date)
      return { ...current, entries: { ...current.entries, [date]: updater(existing) } }
    })
  }

  function setReflection(key, value) {
    updateEntry((current) => ({ ...current, reflection: { ...current.reflection, [key]: value } }))
  }

  function setNested(section, key, value) {
    updateEntry((current) => ({ ...current, [section]: { ...current[section], [key]: value } }))
  }

  function toggleRhythm(id, value) {
    updateEntry((current) => ({ ...current, rhythms: { ...current.rhythms, [id]: value } }))
  }

  function resetDay() {
    if (!window.confirm('Delete all saved rhythms and reflections for ' + date + '? This cannot be undone.')) return
    updateEntry(() => blankEntry(date))
  }

  function setPresenceMode(enabled) {
    setState((current) => ({
      ...current,
      preferences: { ...(current.preferences || {}), presenceMode: Boolean(enabled) },
    }))
  }

  function startStillness(minutes = null) {
    setStillness((curr) => ({
      ...curr,
      active: true,
      finished: false,
      secondsLeft: typeof minutes === 'number' ? minutes * 60 : null,
    }))
  }

  function clearCommunityNotes() {
    if (!window.confirm('Clear saved family and community notes and check-ins for ' + date + '? This cannot be undone.')) return
    updateEntry((current) => ({ ...current, community: { church: false, checkedIn: false, served: false, notes: '' } }))
  }

  const hasSavedSabbath = Boolean(entry.sabbath.planned || entry.sabbath.rested || entry.sabbath.notes)

  return (
    <main className={appearance === 'sanctuary' ? 'sanctuary-theme' : appearance === 'uxpilot' ? 'uxpilot-theme' : ''}>
      <section className="appearance-settings" aria-label="FaithHub settings">
        <details><summary>Settings</summary><div className="appearance-options"><label htmlFor="faithhub-style">Appearance</label><select id="faithhub-style" value={appearance} onChange={(e) => setAppearance(e.target.value)}><option value="original">Original FaithHub</option><option value="sanctuary">Sanctuary · Quiet place</option><option value="uxpilot">FaithHub Editorial · UX Pilot</option></select><label className="presence-row" htmlFor="faithhub-presence-mode"><input type="checkbox" id="faithhub-presence-mode" checked={presenceMode} onChange={(e) => setPresenceMode(e.target.checked)} /><span>Presence over performance (hide progress bar &amp; counts)</span></label><p>Changes the look, not your prayers, reflections or saved entries.</p></div></details>
      </section>
      {appearance === 'uxpilot' && <header className="uxpilot-header"><a href="./" aria-label="FaithHub home">FaithHub</a><div><button type="button" onClick={() => document.querySelector('.appearance-settings details')?.setAttribute('open', '')} aria-label="Open appearance settings">Settings</button><button type="button" onClick={() => document.querySelector('.toolbar')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Go to navigation">Menu</button></div></header>}
      <section className="hero">
        <div>
          <p className="eyebrow">Rule of Life Companion</p>
          <h1>{appearance !== 'original' ? 'A quiet place to receive.' : 'Gentle formation, not spiritual scorekeeping.'}</h1>
          <p className="lead">{appearance === 'uxpilot' ? "Gentle formation, not scorekeeping. Notice where God’s grace is at work." : "A quiet place to receive Scripture, pray through the day, reflect honestly, and notice where God’s grace is already at work."}</p>
        </div>
        <aside className="posture-card">
          <p>Today’s posture</p>
          <h2>Abide before you strive.</h2>
          {!presenceMode && <div className="meter"><span style={{ width: `${progress}%` }} /></div>}
          <small>{presenceMode ? 'Presence over performance: nothing to score, complete, or catch up on today.' : 'This bar is not a grade. It just shows how much space you’ve made to notice God today.'}</small>
        </aside>
      </section>

      <nav className="toolbar">
        <a href="scripture-atlas.html" className="study-link">Scripture Atlas · Psalms, Scripture and reading plans</a>
        <a href="podcasts.html" className="study-link">Faith podcasts</a>
        <a href="cornerstone-teachings.html" className="study-link">Cornerstone Teachings · Courses & recordings</a>
        <div className="tabs">
          {['today', 'prayer', 'reflection', 'family', 'sabbath'].map((item) => (
            <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        <div className="date-tools">
          <label>Practice date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
          <button onClick={() => setDate(todayKey())}>Today</button>
          <button onClick={resetDay}>Reset</button>
        </div>
      </nav>

      {tab === 'today' && (
        <section className="grid two">
          <article className="card scripture-card">
            <p className="eyebrow">Daily Scripture</p>
            <h2>{scripture.ref}</h2>
            <blockquote>“{scripture.text}”</blockquote>
            <p className="soft-note">{scripture.posture}</p>
            {scripture.url && <p><a href={scripture.url} target="_blank" rel="noopener noreferrer">Read the full passage (NIV)</a></p>}
          </article>
          <article className="card">
            <p className="eyebrow">Fruit for today</p>
            <h2>{fruit.name}</h2>
            <p>{fruit.prompt}</p>
            <p className="soft-note"><strong>Tiny practice:</strong> {fruit.practice}</p>
            <div className="stillness-actions">
              <button type="button" onClick={() => { setTab('sabbath'); startStillness(null) }}>Enter quiet stillness (unlogged)</button>
            </div>
          </article>
          <article className="card wide">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Today’s rhythm</p>
                <h2>Small faithful openings</h2>
                <p className="muted">Receive whichever moment helps today—or leave every box untouched. Presence needs no checklist.</p>
              </div>
              {!presenceMode && <span className="pill">{completedRhythms} of {rhythms.length} touched today</span>}
            </div>
            <div className="rhythm-grid">
              {rhythms.map((rhythm) => (
                <button key={rhythm.id} className={`rhythm ${entry.rhythms[rhythm.id] ? 'active' : ''}`} onClick={() => toggleRhythm(rhythm.id, !entry.rhythms[rhythm.id])}>
                  <span className="icon">{rhythm.icon}</span>
                  <strong>{rhythm.title}</strong>
                  <small>{rhythm.when}</small>
                  <p>{rhythm.desc}</p>
                </button>
              ))}
            </div>
          </article>
        </section>
      )}

      {tab === 'prayer' && (
        <section className="grid two">
          <article className="card wide"><p className="eyebrow">Talking with God</p><h2>Thankfulness, lament, petition and intercession</h2><p>Four honest ways to pray, in whichever order suits today. No performance or pressure.</p><a href="prayer-practice.html">Open the guided prayer practice</a><p><a href="prayer-library.html">Prayer and Bible library</a><br/><a href="daily-prayer.html">Everyday prayer, reminders and my resource shelf</a></p></article>
          {rhythms.map((rhythm) => (
            <article className="card" key={rhythm.id}>
              <p className="icon">{rhythm.icon}</p>
              <h2>{rhythm.title}</h2>
              <p className="muted">{rhythm.when}</p>
              <p>{rhythm.desc}</p>
              <blockquote className="prayer">{rhythm.prayer}</blockquote>
              <button className={entry.rhythms[rhythm.id] ? 'primary' : ''} onClick={() => toggleRhythm(rhythm.id, !entry.rhythms[rhythm.id])}>{entry.rhythms[rhythm.id] ? 'Received' : 'Mark gently'}</button>
            </article>
          ))}
        </section>
      )}

      {tab === 'reflection' && (
        <section className="grid two">
          <article className="card wide">
            <p className="eyebrow">Evening examen</p>
            <h2>Tell the truth without self-attack.</h2>
            <p>These questions are for noticing, confession, gratitude, and receiving mercy. Leave anything blank. God is not measuring your word count.</p>
          </article>
          <article className="card"><h3>What am I grateful for?</h3><TextArea value={entry.reflection.gratitude} onChange={(v) => setReflection('gratitude', v)} placeholder="A gift, kindness, provision, beauty, or small mercy…" /></article>
          <article className="card"><h3>Where do I need repentance or repair?</h3><TextArea value={entry.reflection.repentance} onChange={(v) => setReflection('repentance', v)} placeholder="Not shame. Just truth, humility, and a next faithful step…" /></article>
          <article className="card"><h3>Where did I act from fear today?</h3><TextArea value={entry.reflection.fear} onChange={(v) => setReflection('fear', v)} placeholder="Control, avoidance, defensiveness, people-pleasing, hiding, rushing…" /></article>
          <article className="card"><h3>Where did I notice grace?</h3><TextArea value={entry.reflection.grace} onChange={(v) => setReflection('grace', v)} placeholder="A softening, help arriving, restraint, courage, comfort, forgiveness…" /></article>
          <article className="card"><h3>What fruit is God growing?</h3><select value={entry.reflection.fruit} onChange={(e) => setReflection('fruit', e.target.value)}><option value="">Choose gently…</option>{fruits.map((f) => <option key={f.name}>{f.name}</option>)}</select></article>
          <article className="card"><h3>What is my body carrying?</h3><TextArea value={entry.reflection.body} onChange={(v) => setReflection('body', v)} placeholder="Tight chest, heavy shoulders, tired eyes, clenched jaw, warmth, calm…" /></article>
          <article className="card wide"><h3>Prayer to close the day</h3><TextArea value={entry.reflection.prayer} onChange={(v) => setReflection('prayer', v)} placeholder="Lord, I give You… Thank You for… Help me tomorrow…" /></article>
        </section>
      )}

      {tab === 'family' && (
        <section className="grid two">
          <article className="card feature">
            <p className="eyebrow">Family prayer prompt</p>
            <h2>{familyPrompt}</h2>
            <p>Keep it short enough that the family can actually receive it. One honest sentence can be enough.</p>
          </article>
          <article className="card">
            <h2>Community rhythms</h2>
            <p>Faith forms in ordinary belonging: worship, meals, serving, reconciliation, and being known.</p>
            <CheckCard checked={entry.community.church} onChange={(v) => setNested('community', 'church', v)} title="Church / gathered worship" subtitle="A rhythm of receiving and belonging." />
            <CheckCard checked={entry.community.checkedIn} onChange={(v) => setNested('community', 'checkedIn', v)} title="Checked in with someone" subtitle="A text, call, prayer, meal, or honest conversation." />
            <CheckCard checked={entry.community.served} onChange={(v) => setNested('community', 'served', v)} title="Served quietly" subtitle="A small act of love without needing recognition." />
          </article>
          <article className="card wide">
            <h3>Notes on family, church, or community</h3>
            <p className="consent-banner"><strong>Consent &amp; shared-screen care:</strong> Use first initials or general descriptions rather than identifiable confidences about family, children, or church members without their permission. Saved notes stay unencrypted in this browser and in downloaded JSON backups.</p>
            {veilCommunityNotes ? (
              <p role="status">Family and community notes are hidden on screen for shared-device privacy.</p>
            ) : (
              <TextArea value={entry.community.notes} onChange={(v) => setNested('community', 'notes', v)} placeholder="Who needs care? Where did we experience connection? Is there anyone to forgive, bless, or reach out to?" />
            )}
            <div className="consent-actions">
              <button type="button" aria-pressed={veilCommunityNotes} onClick={() => setVeilCommunityNotes((v) => !v)}>{veilCommunityNotes ? 'Show family & community notes' : 'Hide notes on shared screen'}</button>
              <button type="button" onClick={clearCommunityNotes}>Clear family &amp; community notes</button>
            </div>
          </article>
        </section>
      )}

      {tab === 'sabbath' && (
        <section className="grid two">
          <article className="card feature">
            <p className="eyebrow">Sabbath / rest</p>
            <h2>Practise being loved without producing.</h2>
            <p>Sabbath is not another productivity system. Rest and silence here require no logging, no completion, and zero browser storage.</p>
            <div className="stillness-actions">
              <button type="button" className={stillness.active && stillness.secondsLeft === null && !stillness.finished ? 'active' : ''} onClick={() => startStillness(null)}>Sit in open silence</button>
              <button type="button" onClick={() => startStillness(1)}>1 min quiet pause</button>
              <button type="button" onClick={() => startStillness(3)}>3 min quiet pause</button>
              <button type="button" onClick={() => startStillness(5)}>5 min quiet pause</button>
              <button type="button" onClick={() => setStillness((curr) => ({ ...curr, active: true, anchorIndex: (curr.anchorIndex + 1) % stillnessAnchors.length }))}>Another Scripture word</button>
            </div>
            {stillness.active && (
              <div className="stillness-box" role="region" aria-label="Quiet stillness" aria-live="polite">
                <p className="eyebrow">{stillnessWord.ref}</p>
                <blockquote>“{stillnessWord.text}”</blockquote>
                <p>{stillnessWord.note}</p>
                {stillness.secondsLeft !== null && <p className="stillness-time">{formatStillnessTime(stillness.secondsLeft)}</p>}
                <p className="muted">{stillness.finished ? 'Peace be with you. Step back into your day gently—nothing was logged or scored.' : 'Unlogged stillness: nothing is being saved or counted.'}</p>
                <div className="stillness-actions">
                  <button type="button" onClick={() => setStillness((curr) => ({ ...curr, active: false, secondsLeft: null, finished: false }))}>Step out quietly</button>
                </div>
              </div>
            )}
          </article>
          <article className="card">
            <h2>Rest ideas (no check-in needed)</h2>
            <p>Step away from the screen whenever you are ready. Rest counts even if you never record anything here.</p>
            <ul className="rest-list">{restIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
          </article>
          <article className="card wide">
            <details className="optional-sabbath" open={hasSavedSabbath || undefined}>
              <summary>Optional private Sabbath reflection (never required for rest)</summary>
              <p className="muted" style={{ marginTop: '10px' }}>Only use these if noticing helps you remember grace; leaving them blank is welcome.</p>
              <CheckCard checked={entry.sabbath.planned} onChange={(v) => setNested('sabbath', 'planned', v)} title="I made room for rest" subtitle="Even a small protected window counts." />
              <CheckCard checked={entry.sabbath.rested} onChange={(v) => setNested('sabbath', 'rested', v)} title="I actually received some rest" subtitle="Notice what was life-giving, not what was impressive." />
              <h3 style={{ marginTop: '14px' }}>Rest notes</h3>
              <TextArea value={entry.sabbath.notes} onChange={(v) => setNested('sabbath', 'notes', v)} placeholder="What helped me slow down? What made rest hard? What might need to change next Sabbath?" />
            </details>
          </article>
        </section>
      )}

      <footer>
        <span>Saved locally in this browser (unencrypted). <a href="backup.html">Back up or restore</a> · <a href="docs/privacy-consent-audit-2026-11-14.md">Privacy &amp; consent boundaries</a></span>
        <span>No streaks. No guilt engine. Presence over performance.</span>
      </footer>
      <p className="muted" style={{ fontSize: ".72rem", marginTop: "14px" }}>Scripture taken from the Holy Bible, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.® Used by permission. All rights reserved worldwide.</p>
    </main>
  )
}
