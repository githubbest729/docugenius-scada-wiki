const PWA=(()=>{let dp;
const badge=n=>{try{if(n>0)navigator.setAppBadge&&navigator.setAppBadge(n);else navigator.clearAppBadge&&navigator.clearAppBadge()}catch(e){}};
const stage=()=>{if('serviceWorker'in navigator)navigator.serviceWorker.ready.then(r=>r.sync&&r.sync.register('sync-docs')).catch(()=>{})};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;const b=document.getElementById('installBtn');b.hidden=false;b.onclick=async()=>{dp.prompt();await dp.userChoice;b.hidden=true}});
addEventListener('appinstalled',()=>{document.getElementById('installBtn').hidden=true});
if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));navigator.serviceWorker.addEventListener('message',e=>{if(e.data&&e.data.type==='staged-docs-synced')status('Synced')})}
if(navigator.windowControlsOverlay){const f=()=>document.body.classList.toggle('wco',navigator.windowControlsOverlay.visible);navigator.windowControlsOverlay.addEventListener('geometrychange',f);f()}
function status(t){const e=document.getElementById('sync');if(e)e.textContent=t||(navigator.onLine?'\u25CF Online':'\u25CB Offline (local vault)')}
addEventListener('online',()=>status());addEventListener('offline',()=>status());
return{badge,stage,status}})();