const V='dg-v5',DYN='dg-dyn-v5';
const STATIC=['./','index.html','offline.html','manifest.webmanifest','favicon.svg','css/styles.css','css/print-dossier.css','js/app.js','js/db.js','js/templates.js','js/seed.js','js/parsers.js','js/export.js','js/pwa-controller.js','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(STATIC)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==DYN).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
if(r.mode==='navigate'){e.respondWith(fetch(r).catch(()=>caches.match(r,{ignoreSearch:true}).then(x=>x||caches.match('offline.html'))));return}
if(STATIC.some(s=>u.pathname.endsWith(s.replace('./','')))&&!u.pathname.endsWith('/')){e.respondWith(caches.match(r).then(x=>x||fetch(r).then(n=>{const c=n.clone();caches.open(V).then(ch=>ch.put(r,c));return n})));return}
e.respondWith(caches.open(DYN).then(c=>c.match(r).then(hit=>{const net=fetch(r).then(n=>{c.put(r,n.clone());return n}).catch(()=>hit);return hit||net})))});
self.addEventListener('push',e=>{let d={title:'DocuGenius',body:'Engineering update'};try{d=e.data.json()}catch(_){}e.waitUntil(self.registration.showNotification(d.title,{body:d.body,icon:'icons/icon-192.png',badge:'icons/icon-72.png'}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('./index.html?a=audit'))});
self.addEventListener('sync',e=>{if(e.tag==='sync-docs')e.waitUntil(self.clients.matchAll().then(cs=>cs.forEach(c=>c.postMessage({type:'staged-docs-synced',ts:Date.now()}))))});
const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('docugenius');r.onupgradeneeded=()=>r.transaction.abort();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function integrity(){const db=await idb();try{if(!db.objectStoreNames.contains('articles'))return;const st=db.transaction(['articles'],'readonly').objectStore('articles');
const all=await new Promise((res,rej)=>{const q=st.getAll();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)});
const missing=['type','status','updated'].filter(n=>!st.indexNames.contains(n));const old=all.filter(a=>a.status==='draft'&&Date.now()-a.updated>6048e5);
(await self.clients.matchAll()).forEach(c=>c.postMessage({type:'integrity',total:all.length,stale:old.length,missingIndexes:missing}));
if(old.length&&self.Notification&&Notification.permission==='granted')await self.registration.showNotification('DocuGenius: '+old.length+' draft(s) older than 7 days',{body:old.slice(0,3).map(a=>a.docId).join(', ')+' need review or approval.',icon:'icons/icon-192.png',badge:'icons/icon-72.png',tag:'stale-drafts'})}finally{db.close()}}
self.addEventListener('periodicsync',e=>{if(e.tag==='audit-integrity-check')e.waitUntil(integrity().catch(()=>{}))});