#!/usr/bin/env python3
"""Audit all public FaithHub Cornerstone audio endpoints with byte range requests.

Never reads private Drive data; only tests explicitly owner-published IDs already
in the GitHub static catalogue. Does not download the recordings.
"""
import concurrent.futures, json, sys, time, urllib.error, urllib.request
from pathlib import Path

CATALOGUE=Path('assets/cornerstone-public-recordings.json')
ENDPOINT='https://faithhub-cornerstone-audio.parris-neathaustralia.workers.dev/audio/'
entries=json.loads(CATALOGUE.read_text(encoding='utf-8'))['entries']

def check(item):
    url=ENDPOINT+item['id']
    for attempt in range(3):
        try:
            request=urllib.request.Request(url,headers={'Range':'bytes=0-63','User-Agent':'FaithHub-PublicAudioAudit/1.0'})
            with urllib.request.urlopen(request,timeout=24) as response:
                media=response.read(64)
                status=response.status
                content_type=response.headers.get('Content-Type','')
                content_range=response.headers.get('Content-Range','')
                total=content_range.split('/')[-1] if '/' in content_range else ''
                ok=status==206 and content_type.startswith('audio/') and len(media)>=16 and total==str(item['bytes'])
                return {'name':item['title'],'id':item['id'],'ok':ok,'status':status,'mime':content_type,'range':content_range,'magic':media[:12].hex(),'attempts':attempt+1}
        except Exception as exc:
            if attempt==2:return {'name':item['title'],'id':item['id'],'ok':False,'error':str(exc)[:180]}
            time.sleep((attempt+1)*2)
    raise AssertionError('unreachable')

def main():
    print('Audio catalogue entries:',len(entries),flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        data=list(pool.map(check,entries))
    passed=[x for x in data if x['ok']]
    failed=[x for x in data if not x['ok']]
    Path('cornerstone-public-range-audit.json').write_text(json.dumps({'tested':len(data),'passed':len(passed),'failed':failed},indent=2),encoding='utf-8')
    print('RESULT: PASS',len(passed),'of',len(data),'recovered audio endpoints returned byte-range media')
    for item in failed: print('FAILED',json.dumps(item),flush=True)
    return 0 if not failed else 1

if __name__=='__main__':sys.exit(main())
