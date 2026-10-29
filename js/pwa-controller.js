const PWA=(()=>{let dp;
const badge=n=>{try{if(n>0)navigator.setAppBadge&&navigator.setAppBadge(n);else navigator.clearAppBadge&&navigator.clearAppBadge()}catch(e){}};
const stage=()=>{if('serviceWorker'in navigator)navigator.serviceWorker.ready.then(r=>r.sync&&r.sync.register('sync-docs')).catch(()=>{})};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const b=document.getElementById('installBtn');b.hidden=false;b.onclick=async()=>{dp.prompt();await dp.userChoice;b.hidden=true}});
addEventListener('appinstalled',()=>{document.getElementById('installBtn').hidden=true});
if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='staged-docs-synced'){status('Synced')}else if(e.data&&e.data.type==='integrity'&&e.data.stale&&window.toast){toast(e.data.stale+' draft(s) older than 7 days','warn')}})}
if(navigator.windowControlsOverlay){const f=()=>document.body.classList.toggle('wco',navigator.windowControlsOverlay.visible);navigator.windowControlsOverlay.addEventListener('geometrychange',f);f()}
function status(t){const e=document.getElementById('sync');if(e)e.textContent=t||(navigator.onLine?'\u25CF Online':'\u25CB Offline (local vault)')}
addEventListener('online',()=>status());addEventListener('offline',()=>status());

if('launchQueue' in window&&window.launchQueue&&window.launchQueue.setConsumer){window.launchQueue.setConsumer(async p=>{try{if(!p.files||!p.files.length)return;const f=await p.files[0].getFile();const go=()=>window.openFile?window.openFile(f):setTimeout(go,100);go()}catch(e){}})}
let lock=null,want=false;const ind=()=>{const e=document.getElementById('wls');if(e)e.hidden=!(want&&lock)};
async function acq(){if(!('wakeLock' in navigator))return false;try{lock=await navigator.wakeLock.request('screen');lock.addEventListener('release',()=>{lock=null;ind()});ind();return true}catch(e){lock=null;ind();return false}}
async function wakeLock(on){want=on;try{localStorage.setItem('dg-wl',on?'1':'0')}catch(e){}if(!on){if(lock){try{await lock.release()}catch(e){}}lock=null;ind();return true}const ok=await acq();if(!ok){want=false;ind()}return ok}
document.addEventListener('visibilitychange',()=>{if(want&&document.visibilityState==='visible'&&!lock)acq()});
const wl=document.getElementById('wl');if(wl){if(!('wakeLock' in navigator)){wl.disabled=true;wl.parentElement.title='Screen Wake Lock is not supported on this browser'}else{wl.onchange=async()=>{const ok=await wakeLock(wl.checked);if(!ok){wl.checked=false;window.toast&&toast('Could not engage screen lock','warn')}else window.toast&&toast(wl.checked?'Kiosk mode: screen lock ACTIVE':'Kiosk mode off','info')};try{if(localStorage.getItem('dg-wl')==='1'){wl.checked=true;wakeLock(true).then(ok=>{if(!ok)wl.checked=false})}}catch(e){}}}
if('serviceWorker' in navigator)navigator.serviceWorker.ready.then(async r=>{try{if('periodicSync' in r){let ok=true;try{ok=(await navigator.permissions.query({name:'periodic-background-sync'})).state==='granted'}catch(e){}if(ok)await r.periodicSync.register('audit-integrity-check',{minInterval:24*60*60*1000})}}catch(e){}}).catch(()=>{});
function notifyOnce(){try{if('Notification' in window&&Notification.permission==='default'&&!localStorage.getItem('dg-nq')){localStorage.setItem('dg-nq','1');Notification.requestPermission()}}catch(e){}}
return{badge,stage,status,notifyOnce,wakeLock}})();