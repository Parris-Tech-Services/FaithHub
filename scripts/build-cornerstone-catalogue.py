#!/usr/bin/env python3
"""Resolve publisher-owned public RSS enclosures for FaithHub; never download audio.

This is a build-time metadata catalogue. There is no audio proxy, scraping private
media, content rehosting or authentication bypass. Only the 3 named Apple show IDs
are used. Fail closed on invalid/HTTP audio URLs.
"""
from __future__ import annotations
import argparse
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
        for item in rss + api:
            key = (item["title"].casefold().strip(), item["date"])
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
    return {"version": 1, "generatedAt": datetime.now(timezone.utc).isoformat(), "shows": reports, "episodes": episodes}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--output", default="_site/cornerstone-episodes.json")
    p.add_argument("--require-at-least", type=int, default=0)
    args = p.parse_args()
    data = build()
    path = Path(args.output)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    total = len(data["episodes"])
    print(f"Cornerstone audio catalogue: {total} episodes resolved; wrote {path}")
    if total < args.require_at_least:
        raise SystemExit(f"Feed catalogue incomplete: {total} < required {args.require_at_least}")
if __name__ == "__main__":
    main()
