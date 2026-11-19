#!/usr/bin/env python3
"""Public-only lost-audio source audit. Never downloads full recordings or exposes private Drive IDs."""
from __future__ import annotations
import json, os, sys, urllib.parse, urllib.request
sys.path.insert(0,"scripts")
import importlib.util
spec=importlib.util.spec_from_file_location("cornerstone_build","scripts/build-cornerstone-catalogue.py")
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
catalogue=mod.build()
episodes=catalogue["episodes"]
print("PUBLIC_CATALOGUE",len(episodes),"Mixcloud",catalogue["mixcloud"])
# Produce public RSS filename inventory for private in-memory matching against Drive.
try:
    feed=mod.request_rss("https://feeds.feedburner.com/CornerstoneCommunityPodcast")
    for item in feed.findall("./channel/item"):
        enclosure=item.find("enclosure")
        if enclosure is None: continue
        url=enclosure.attrib.get("url","")
        title=item.findtext("title","").strip()
        path=urllib.parse.urlsplit(url).path
        size=enclosure.attrib.get("length","")
        print("RSS_PUBLIC_FILE",json.dumps({"title":title,"basename":urllib.parse.unquote(path.split("/")[-1]),"bytes":size},ensure_ascii=False))
except Exception as exc:
    print("RSS_PUBLIC_FILE_ERROR",type(exc).__name__,str(exc)[:150])
samples=[]
for phrase in ("Everything Counts","The Heart of the Father","Muster 2018 - Andrew Vincent"):
    matched=[x for x in episodes if phrase.lower() in x["title"].lower()]
    samples.extend(matched[:1])
    print("SAMPLE",phrase,"matches",len(matched),[(x["title"],x["mode"]) for x in matched[:3]])
for e in samples:
    # RSS original enclosures for recovery - may be replaced by Mixcloud in merged episode.
    if e["showId"]!="293630407":continue
    name=e["title"]
    old=e["embed"] if "cms.cornerstone.edu.au" in e["embed"] else None
    if not old:
        try:
            feed=mod.request_rss("https://feeds.feedburner.com/CornerstoneCommunityPodcast")
            rss=mod.rss_entries(293630407,"Cornerstone Community Podcast",feed)
            original=next((q for q in rss if q["title"]==name),None)
            old=original["embed"] if original else None
        except Exception as exc:
            print("RSS_RECOVERY_ERROR",type(exc).__name__,str(exc)[:150])
    if not old or not old.startswith("https://cms.cornerstone.edu.au/"):
        print("NO_ORIGINAL_CMS",name);continue
    print("PUBLIC_ORIGINAL_CMS",name,old)
    try:
        query="https://archive.org/wayback/available?"+urllib.parse.urlencode({"url":old,"timestamp":"2015"})
        x=mod.request_json(query)
        closest=x.get("archived_snapshots",{}).get("closest",{})
        print("WAYBACK_CLOSEST",name,closest.get("available"),closest.get("status"),closest.get("timestamp"),closest.get("url","")[:230])
    except Exception as exc:
        print("WAYBACK_ERROR",name,type(exc).__name__,str(exc)[:200])
    try:
        q="https://web.archive.org/cdx/search/cdx?"+urllib.parse.urlencode({"url":old,"output":"json","filter":"statuscode:200","collapse":"urlkey","limit":"2"})
        req=urllib.request.Request(q,headers={"User-Agent":"Mozilla/5.0"})
        with urllib.request.urlopen(req,timeout=11) as res:
            result=res.read(3000)
        print("CDX_SAMPLE",name,result.decode("utf-8","replace")[:2000])
    except Exception as exc:
        print("CDX_ERROR",name,type(exc).__name__,str(exc)[:150])
print("ARCHIVE_AUDIT_DONE")