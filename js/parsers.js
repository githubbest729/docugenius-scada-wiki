const Parsers=(()=>{
function csv(t){const d=[',',';','\t','|'].map(x=>[x,(t.split('\n')[0]||'').split(x).length]).sort((a,b)=>b[1]-a[1])[0][0];const rows=[];let r=[],c='',q=false;
for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch==='"'&&t[i+1]==='"'){c+='"';i++}else if(ch==='"')q=false;else c+=ch}else if(ch==='"')q=true;else if(ch===d){r.push(c);c=''}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;r.push(c);c='';rows.push(r);r=[]}else c+=ch}
if(c!==''||r.length){r.push(c);rows.push(r)}return rows.filter(x=>x.some(v=>v.trim()!==''))}
function json(t){let o=JSON.parse(t);if(!Array.isArray(o)){const k=Object.keys(o).find(k=>Array.isArray(o[k]));o=k?o[k]:[o]}const h=[...new Set(o.flatMap(x=>Object.keys(x)))];return[h,...o.map(x=>h.map(k=>x[k]==null?'':typeof x[k]==='object'?JSON.stringify(x[k]):String(x[k])))]}
const area=a=>{a=String(a).trim();if(!/^[0-4]\d{4,5}$/.test(a))return'';const n=+a[0];return['0x Coil','1x Discrete','2x','3x Input','4x Holding'][n]||''};
function parse(text,name){const rows=/\.json$/i.test(name)||/^\s*[\[{]/.test(text)?json(text):csv(text);if(!rows.length)return rows;const ai=rows[0].findIndex(h=>/addr|register/i.test(h));
if(ai>=0&&!rows[0].some(h=>/modbus/i.test(h))&&rows.slice(1).some(r=>area(r[ai]))){rows[0].push('Modbus Area');for(let i=1;i<rows.length;i++)rows[i].push(area(rows[i][ai]))}return rows}
const toMd=rows=>{if(!rows.length)return'';const e=s=>String(s).replace(/\|/g,'\\|').replace(/\n/g,' ').trim();return'| '+rows[0].map(e).join(' | ')+' |\n|'+rows[0].map(()=>'---').join('|')+'|\n'+rows.slice(1).map(r=>'| '+rows[0].map((_,i)=>e(r[i]==null?'':r[i])).join(' | ')+' |').join('\n')};
const pick=()=>new Promise(res=>{const fb=()=>{const i=document.createElement('input');i.type='file';i.accept='.json,.csv,.txt';i.onchange=()=>res(i.files[0]||null);i.click()};
if('showOpenFilePicker' in window){window.showOpenFilePicker({multiple:false,types:[{description:'Tag lists & vault backups',accept:{'application/json':['.json'],'text/csv':['.csv'],'text/plain':['.txt']}}]}).then(([h])=>h.getFile()).then(res).catch(e=>e&&e.name==='AbortError'?res(null):fb())}else fb()});
return{parse,toMd,pick}})();