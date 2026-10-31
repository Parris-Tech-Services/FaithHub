#!/usr/bin/env python3
"""Resolve publisher-owned public RSS enclosures for FaithHub; never download audio.

This is a build-time metadata catalogue. There is no audio proxy, scraping private
media, content rehosting or authentication bypass. Only the 3 named Apple show IDs
are used. Fail closed on invalid/HTTP audio URLs.
"""
from __future__ import annotations
import argparse
from difflib import SequenceMatcher
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from hashlib import sha256
from html import unescape
import json
from pathlib import Path
import re
import sys
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET

SHOWS = [
    ("original", "Cornerstone Community Podcast", 293630407, 96, "Cornerstone Community Australia"),
    ("bendigo", "Cornerstone Community Bendigo", 1631726711, 18, "Joshua Parris"),
    ("paul", "Cornerstone Community Bendigo — Paul Roe", 1631658757, 1, "Joshua Parris"),
]
NS = {"it": "http://www.itunes.com/dtds/podcast-1.0.dtd"}
USER_AGENT = "FaithHub-Cornerstone-PodcastCatalogue/1.0 (+https://parris-tech-services.github.io/FaithHub/)"
def request_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=22) as response:
        return json.load(response)

def request_rss(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/xml, text/xml"})
    with urllib.request.urlopen(req, timeout=22) as response:
        data = response.read(4_000_000)
        if len(data) >= 4_000_000:
            raise ValueError("RSS feed unexpectedly large")
    return ET.fromstring(data)

def valid_https(value):
    if not isinstance(value, str) or len(value) > 6000:
        return None
    p = urllib.parse.urlsplit(value.strip())
    if p.scheme != "https" or not p.hostname or p.username or p.password:
        return None
    if p.hostname == "localhost" or p.hostname.endswith(".local"):
        return None
    return value.strip()

def seconds(value):
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str) and value:
        if value.isdigit():
            return int(value)
        parts = value.split(":")
        if 1 <= len(parts) <= 3 and all(x.isdigit() for x in parts):
            total = 0
            for part in parts:
                total = total * 60 + int(part)
            return total
    return 0

def duration_text(sec):
    if sec <= 0:
        return ""
    mins = round(sec / 60)
    if mins < 60:
        return f"{mins} min"
    return f"{mins // 60} h {mins % 60:02d} min"

def date_only(value):
    if not value:
        return ""
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).date().isoformat()
    except (ValueError, AttributeError):
        try:
            return parsedate_to_datetime(value).date().isoformat()
        except (ValueError, TypeError, IndexError):
            return ""

def cleaned(value, length):
    if not value:
        return ""
    value = re.sub(r"<[^>]+>", " ", unescape(str(value)))
    return re.sub(r"\s+", " ", value).strip()[:length]

def make_entry(show_id, title, show, audio, webpage, date="", duration="", description="", fingerprint=""):
    audio = valid_https(audio)
    if not audio:
        return None
    webpage = valid_https(webpage) or f"https://podcasts.apple.com/au/podcast/id{show_id}"
    fingerprint = str(fingerprint or audio)
    identity = sha256((str(show_id) + "|" + fingerprint).encode()).hexdigest()[:20]
    name = cleaned(title, 240)
    if not name:
        return None
    return {
        "id": f"cornerstone:episode:{show_id}:{identity}",
        "title": name,
        "show": show,
        "tags": ["cornerstone", "discipleship", "muster", "teaching"],
        "duration": duration_text(seconds(duration)) if isinstance(duration, (str, int, float)) else "",
        "provider": "audio",
        "mode": "audio",
        "url": webpage,
        "embed": audio,
        "date": date_only(date),
        "note": cleaned(description, 350),
        "showId": str(show_id),
    }

def rss_entries(show_id, label, root):
    channel = root.find("channel")
    if channel is None:
        return []
    entries = []
    for item in channel.findall("item"):
        enc = item.find("enclosure")
        if enc is None:
            continue
        url = enc.attrib.get("url", "")
        title = item.findtext("title", "")
        guid = item.findtext("guid", "")
        desc = item.findtext("description", "")
        link = item.findtext("link", "")
        dur = item.findtext("it:duration", "", NS)
        entry = make_entry(show_id, title, label, url, link, item.findtext("pubDate", ""), dur, desc, guid or url)
        if entry:
            entries.append(entry)
    return entries

def apple_entries(show_id, label, results):
    out = []
    for item in results:
        if item.get("wrapperType") not in ("podcastEpisode", "track") or item.get("kind") != "podcast-episode":
            continue
        if str(item.get("collectionId", "")) not in ("", str(show_id)):
            continue
        entry = make_entry(
            show_id, item.get("trackName"), label, item.get("episodeUrl"),
            item.get("trackViewUrl"), item.get("releaseDate", ""),
            (item.get("trackTimeMillis") or 0) / 1000,
            item.get("description") or item.get("shortDescription") or "",
            item.get("trackId") or item.get("episodeGuid") or item.get("episodeUrl")
        )
        if entry:
            out.append(entry)
    return out

def mixcloud_public_catalogue():
    """Read only publisher-listed tracks, never Mixcloud raw streaming media."""
    next_url = "https://api.mixcloud.com/cornerstonecommunitypodcast/cloudcasts/?limit=100"
    tracks = []
    seen = set()
    for _ in range(4):
        if not next_url or not next_url.startswith("https://api.mixcloud.com/cornerstonecommunitypodcast/cloudcasts/"):
            break
        page = request_json(next_url)
        for track in page.get("data", []):
            key = track.get("key", "")
            source = track.get("url", "")
            if (not isinstance(key, str) or
                not re.fullmatch(r"/cornerstonecommunitypodcast/[a-zA-Z0-9_-]+/", key) or
                source != "https://www.mixcloud.com" + key or key in seen):
                continue
            if not cleaned(track.get("name"), 240):
                continue
            seen.add(key)
            tracks.append({
                "name": cleaned(track.get("name"), 240),
                "key": key,
                "url": source,
                "embed": "https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=" + urllib.parse.quote(key, safe=""),
                "published": date_only(track.get("created_time", "")),
            })
        next_url = page.get("paging", {}).get("next")
    return tracks

def normalise_title(value):
    return re.sub(r"[^a-z0-9]+", "", (value or "").casefold())

def mixcloud_match_title(value, other):
    a, b = normalise_title(value), normalise_title(other)
    if not a or not b:
        return 0
    if a == b:
        return 1.0
    return SequenceMatcher(None, a, b).ratio()

def merge_mixcloud(episodes, reports):
    """Enrich old podcast entries with legal publisher embeds; keep originals.

    Exact/near-exact titles match existing RSS; separate Mixcloud tracks which
    lack matching RSS entries are still independently searchable, with no media
    copied. We do not infer dead URL slugs or claim a sound file was restored.
    """
    try:
        tracks = mixcloud_public_catalogue()
    except Exception as exc:
        print("MIXCLOUD LOOKUP ERROR", type(exc).__name__, str(exc)[:160], file=sys.stderr)
        return {"catalogueCount": 0, "matched": 0, "extra": 0, "errors": [str(exc)[:160]]}
    historic = [e for e in episodes if e["showId"] == "293630407"]
    matched = 0
    extras = 0
    used = set()
    for track in tracks:
        best = None
        best_score = 0
        for e in historic:
            if e["id"] in used:
                continue
            score = mixcloud_match_title(track["name"], e["title"])
            if score > best_score:
                best = e
                best_score = score
        if best is not None and best_score >= 0.82:
            used.add(best["id"])
            best["mode"] = "mixcloud"
            best["provider"] = "mixcloud"
            best["url"] = track["url"]
            best["embed"] = track["embed"]
            best["streamableAtBuild"] = False # An iframe renders but real audio is NOT verified.
            best["matchMethod"] = "title-similarity-not-acoustic-proof"
            best["matchConfidence"] = round(best_score, 4)
            best["note"] = best["note"].replace(
                "Archive audio host was unavailable during the last source check; recording is listed for discovery, not marked playable.", ""
            ).strip()
            matched += 1
        else:
            ident = sha256(track["key"].encode("utf-8")).hexdigest()[:20]
            episodes.append({
                "id": "cornerstone:episode:293630407:mixcloud:" + ident,
                "title": track["name"], "show": "Cornerstone Community Podcast · Mixcloud",
                "tags": ["cornerstone", "discipleship", "muster", "teaching"],
                "duration": "", "provider": "mixcloud", "mode": "mixcloud",
                "url": track["url"], "embed": track["embed"],
                "date": track["published"], "note": "Publisher-hosted Mixcloud player; no audio rehosted.",
                "showId": "293630407", "streamableAtBuild": False, "matchMethod": "Mixcloud-only publication"
            })
            extras += 1
    for report in reports:
        if str(report["showId"]) == "293630407":
            items = [e for e in episodes if e["showId"] == "293630407"]
            report["mixcloudMatched"] = matched
            report["mixcloudAdditional"] = extras
            report["streamableAtBuild"] = sum(e["streamableAtBuild"] for e in items)
            report["unavailableAtBuild"] = len(items) - report["streamableAtBuild"]
    print("MIXCLOUD RECOVERED",len(tracks),"matched",matched,"additional",extras, file=sys.stderr)
    return {"catalogueCount": len(tracks), "matched": matched, "extra": extras, "errors":[]}

def build():
    episodes = []
    reports = []
    for nickname, label, show_id, expected, publisher in SHOWS:
        origin = f"https://podcasts.apple.com/au/podcast/id{show_id}"
        feed_url = None
        rss = []
        api = []
        errors = []
        try:
            details = request_json(f"https://itunes.apple.com/lookup?id={show_id}&country=au")
            meta = next((r for r in details.get("results", []) if r.get("kind") == "podcast"), None)
            if meta:
                feed_url = meta.get("feedUrl")
        except Exception as exc:
            errors.append("show lookup: " + type(exc).__name__ + ": " + str(exc)[:125])
        if feed_url and urllib.parse.urlsplit(feed_url).scheme in ("https", "http"):
            try:
                rss = rss_entries(show_id, label, request_rss(feed_url))
            except Exception as exc:
                errors.append("RSS: " + type(exc).__name__ + ": " + str(exc)[:125])
        try:
            data = request_json(f"https://itunes.apple.com/lookup?id={show_id}&entity=podcastEpisode&limit=200&country=au")
            api = apple_entries(show_id, label, data.get("results", []))
        except Exception as exc:
            errors.append("episode lookup: " + type(exc).__name__ + ": " + str(exc)[:125])
        # Prefer RSS, which may include older episodes Apple lookup omits.
        found = []
        keys = set()
        for item in (rss if len(rss) >= expected else rss + api):
            key = item["embed"]  # two separate recordings may share the same title
            if key in keys:
                continue
            found.append(item)
            keys.add(key)
        # Keep the newest episodes first, stable across builds.
        found.sort(key=lambda x: (x["date"], x["title"]), reverse=True)
        episodes.extend(found)
        reports.append({
            "id": nickname, "showId": show_id, "title": label,
            "expectedByPublisher": expected, "playableEnclosuresFound": len(found),
            "rssCount": len(rss), "appleCount": len(api),
            "feed": feed_url or "", "source": origin, "publisher": publisher,
            "errors": errors
        })
        print(f"{show_id}: RSS={len(rss)} AppleAPI={len(api)} unique={len(found)} published={expected}; {'; '.join(errors)}", file=sys.stderr)
    # Test a 32-byte range from one episode per audio HOST, never bulk-download.
    # A defunct archive can still have metadata; distinguish it from audio that
    # was actually reachable at publication time.
    availability = {}
    for entry in episodes:
        host = urllib.parse.urlsplit(entry["embed"]).hostname
        if host not in availability:
            try:
                probe = urllib.request.Request(entry["embed"], headers={
                    "User-Agent": "Mozilla/5.0", "Range": "bytes=0-31"
                })
                with urllib.request.urlopen(probe, timeout=14) as response:
                    prefix = response.read(32)
                    kind = response.headers.get("Content-Type", "").lower()
                    availability[host] = bool(prefix) and response.status in (200, 206) and (
                        "audio/" in kind or "octet-stream" in kind
                    )
                    print("STREAM", host, response.status, kind, "reachable=", availability[host], file=sys.stderr)
            except Exception as exc:
                availability[host] = False
                print("STREAM UNAVAILABLE", host, type(exc).__name__, str(exc)[:130], file=sys.stderr)
        entry["streamableAtBuild"] = availability[host]
        if not availability[host]:
            entry["mode"] = "unavailable"
            entry["provider"] = "external"
            entry["note"] = (entry["note"] + " " if entry["note"] else "") + "Archive audio host was unavailable during the last source check; recording is listed for discovery, not marked playable."
    for show in reports:
        items = [e for e in episodes if e["showId"] == str(show["showId"])]
        show["streamableAtBuild"] = sum(e["streamableAtBuild"] for e in items)
        show["unavailableAtBuild"] = len(items) - show["streamableAtBuild"]
    mixcloud = merge_mixcloud(episodes, reports)
    real_playback_failures = {
        "the heart of the father – part 1",
        "muster 2018 - andrew vincent - first things first",
    }
    for entry in episodes:
        if entry["mode"] == "unavailable":
            entry["verificationStatus"] = "MISSING"
        elif entry["mode"] == "audio":
            # Exact published episode identities independently verified in Actions run
            # 41193048655. A five-second browser progress test, not just HTTP 206.
            verified_ids = ["cornerstone:episode:1631726711:a87f84ce375dcc215c8a","cornerstone:episode:1631726711:40a9975585324e794d7e","cornerstone:episode:1631726711:6a15dd3e798041f3668c","cornerstone:episode:1631726711:77fadccd1031f5992845","cornerstone:episode:1631726711:d2335b33220a1b54adb8","cornerstone:episode:1631726711:34b1cddf18befc2916d8","cornerstone:episode:1631726711:d803d62ea7fd0770b65c","cornerstone:episode:1631726711:0b2bbf694215ea8bb682","cornerstone:episode:1631726711:f3663f892340d1b0f073","cornerstone:episode:1631726711:5f608ba3de3d28001faf","cornerstone:episode:1631726711:ad4ab74442cc8faa52cc","cornerstone:episode:1631726711:dfc8e66afdc4d68c0737","cornerstone:episode:1631726711:cb8c240ff4b3decb9060","cornerstone:episode:1631726711:5b13d615e4f2af2e4348"]
            playback_failed_ids = ["cornerstone:episode:1631658757:8bc0ae64790054691df1","cornerstone:episode:1631726711:f9a351b0b2aa7783986c","cornerstone:episode:1631726711:8d912df1ef15be1f361c","cornerstone:episode:1631726711:9f3639a9c700af38a022","cornerstone:episode:1631726711:4bbac5cfd033b817578a"]
            if entry["id"] in verified_ids:
                entry["verificationStatus"] = "VERIFIED_PLAYABLE"
            elif entry["id"] in playback_failed_ids:
                entry["verificationStatus"] = "PLAYBACK_FAILED"
            else:
                entry["verificationStatus"] = "SOURCE_REACHABLE"
        elif entry["mode"] == "mixcloud":
            # Verified using the original Mixcloud Widget API in Chromium:
            # these tracks emitted play/pause without time advancing.
            entry["verificationStatus"] = ("PLAYBACK_FAILED" if entry["title"].casefold() in real_playback_failures
                                          else "EMBED_ONLY")
        else:
            entry["verificationStatus"] = "EMBED_ONLY"
    for report in reports:
        subset = [e for e in episodes if e["showId"] == str(report["showId"])]
        report["verifiedPlaybackCount"] = sum(e["verificationStatus"] == "VERIFIED_PLAYABLE" for e in subset)
        report["embedOnlyCount"] = sum(e["verificationStatus"] == "EMBED_ONLY" for e in subset)
        report["playbackFailedCount"] = sum(e["verificationStatus"] == "PLAYBACK_FAILED" for e in subset)
        report["sourceReachableCount"] = sum(e["verificationStatus"] == "SOURCE_REACHABLE" for e in subset)
    episodes.sort(key=lambda x: (x["mode"] == "unavailable", x.get("date", ""), x["title"]))
    return {"version": 1, "generatedAt": datetime.now(timezone.utc).isoformat(), "shows": reports, "episodes": episodes, "mixcloud": mixcloud}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--output", default="_site/cornerstone-episodes.json")
    p.add_argument("--require-at-least", type=int, default=0)
    args = p.parse_args()
    data = build()
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    inventory_path = path.with_name("cornerstone-audio-inventory.json")
    inventory = {
      "version": 1, "generatedAt": data["generatedAt"],
      "scope": "Public-source only: does not include private Drive file IDs or copyrighted audio.",
      "identityCaveat": "117 catalogue entries are not 117 acoustically unique tracks; title-matched Mixcloud entries require fingerprint confirmation.",
      "counts": {s: sum(e["verificationStatus"] == s for e in data["episodes"])
                 for s in ("VERIFIED_PLAYABLE","SOURCE_REACHABLE","EMBED_ONLY","PLAYBACK_FAILED","PRIVATE_AUTH_REQUIRED","MISSING")},
      "shows": data["shows"],
      "records": [{k: entry.get(k) for k in (
          "id","showId","title","show","date","duration","mode","url","verificationStatus",
          "matchMethod","matchConfidence") if k in entry} for entry in data["episodes"]]
    }
    inventory_path.write_text(json.dumps(inventory,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Public-only audit inventory:",inventory_path,"counts",inventory["counts"])
    total = len(data["episodes"])
    print(f"Cornerstone audio catalogue: {total} episodes resolved; wrote {path}")
    if total < args.require_at_least:
        raise SystemExit(f"Feed catalogue incomplete: {total} < required {args.require_at_least}")
if __name__ == "__main__":
    main()
