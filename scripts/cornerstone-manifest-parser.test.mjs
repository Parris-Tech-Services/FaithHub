import test from 'node:test';
import assert from 'node:assert/strict';
import {readCsv,parseCornerstoneManifestCsv} from '../assets/cornerstone-manifest-parser.mjs';

const a='1FakeGoogleDriveFileID_Alpha', b='1FakeGoogleDriveFileID_Beta';
function csv(rows){return ['source_folder,filename,status,copy_file_id,bytes,source_file_id,error',...rows].join('\r\n')+'\r\n';}
test('Colab copy-results CSV imports nonempty verified audio without rehosting or source references',()=>{
  const source=csv([
    `Cornerstone Podcasts/Paul Roe,"Paul Roe, Session 1.mp3",copied and verified,${a},23956799,sourceRef,`,
    `Cornerstone Podcasts/Pete Vol,Leadership_Interview.m4a,already copied,${b},5500,sourceRef,`,
    `Cornerstone Podcasts,Broken.mp3,FAILED,1OtherDriveFileID123456,1024,sourceRef,unavailable`,
    `Cornerstone Podcasts,MONO-020.mp3,copied and verified,1EmptyAudioFileID1234567,0,sourceRef,`,
    `Cornerstone Podcasts,Leo_and_Margaret_Parris.mp3,copied and verified,1FamilyInterviewID123456,666,sourceRef,`,
    `Cornerstone Podcasts,notes.pdf,copied and verified,1NonAudioFileID12345678,900,sourceRef,`,
    `Cornerstone Podcasts,Repeat.mp3,copied and verified,${a},8888,sourceRef,`
  ]);
  const out=parseCornerstoneManifestCsv(source);
  assert.equal(out.recordings.length,2);
  assert.deepEqual(out.recordings.map(x=>x.driveId),[a,b]);
  assert.equal(out.recordings[0].title,'Paul Roe, Session 1');
  assert.equal(out.recordings[0].folder,'Paul Roe');
  assert.equal(out.stats.empty,1);
  assert.equal(out.stats.failed,1);
  assert.equal(out.stats.ignored,2);
  assert.ok(!JSON.stringify(out).includes('sourceRef'));
});
test('quoted CSV supports commas, quotes, embedded line breaks and UTF-8 BOM',()=>{
  const rows=readCsv('A,B\r\n"one, two","a ""quoted""\nvalue"\r\n');
  assert.deepEqual(rows,[['A','B'],['one, two','a "quoted"\nvalue']]);
  const out=parseCornerstoneManifestCsv('\uFEFF'+csv([`Cornerstone Podcasts,"A, B.mp3",copied and verified,${a},123,original,`]));
  assert.equal(out.recordings[0].title,'A, B');
});
test('reject malformed or unrelated CSV instead of exposing links',()=>{
  assert.throws(()=>readCsv('"unterminated'),/Unclosed/);
  assert.throws(()=>parseCornerstoneManifestCsv('name,email\nJosh,josh@example.org'),/not a Cornerstone/);
  assert.throws(()=>readCsv('x'.repeat(300001)),/too large/);
});
