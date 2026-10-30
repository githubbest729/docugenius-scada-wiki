const LOGO = '<svg width="44" height="44" viewBox="0 0 64 64" aria-label="Al Gurg emblem" style="flex:none"><circle cx="32" cy="32" r="29" fill="none" stroke="#000" stroke-width="3"/><path d="M14 45 32 13l18 32h-8L32 28 22 45z" fill="#000"/><rect x="20" y="48" width="24" height="4" fill="#000"/></svg>';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function md(src) {
  const L = String(src || '').split('\n');
  const cells = l => l.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(s => s.trim().replace(/\\\|/g, '|'));
  const inl = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>').replace(/\\`/g, '`');
  const cell = c => {
    const t = c.trim();
    if (/^[0-4]\d{4,5}$/.test(t)) return '<td class="num">' + esc(t) + '</td>';
    if (/^(AGAC-[\w-]+|Rev\s?\d+|(U?INT|DINT|UDINT|REAL|LREAL|FLOAT|BOOL|STRING|WORD|DWORD)\d*|[0-4]x(\s\w+)?)$/i.test(t)) {
      return '<td><span class="pill">' + esc(t) + '</span></td>';
    }
    return '<td>' + inl(c) + '</td>';
  };
  let o = '', i = 0, ul = false, ol = false;
  const close = () => { if (ul) { o += '</ul>'; ul = false; } if (ol) { o += '</ol>'; ol = false; } };

  while (i < L.length) {
    const l = L[i];
    let m;
    if (/^\s*\|/.test(l) && /^\s*\|?[\s:|-]+\|?\s*$/.test(L[i + 1] || '') && /-/.test(L[i + 1] || '')) {
      close();
      const h = cells(l);
      i += 2;
      let b = '';
      while (i < L.length && /^\s*\|/.test(L[i])) {
        b += '<tr>' + cells(L[i]).map(cell).join('') + '</tr>';
        i++;
      }
      o += '<table' + (h.length > 11 ? ' class="wide"' : '') + '><thead><tr>' + h.map(c => '<th>' + inl(c) + '</th>').join('') + '</tr></thead><tbody>' + b + '</tbody></table>';
      continue;
    }
    if (m = l.match(/^>>\s*(HMI|EXPECT|PREREQ):\s*(.*)/)) {
      close();
      const k = m[1];
      o += '<div class="sopb ' + k.toLowerCase() + '"><b>' + ({ HMI: 'HMI NAVIGATION PATH', EXPECT: 'EXPECTED SYSTEM RESPONSE', PREREQ: 'PREREQUISITES & INTERLOCKS' }[k]) + '</b><div>' + (k === 'HMI' ? m[2].split('>').map(s => '<span class="crumb">' + esc(s.trim()) + '</span>').join('<i>\u203A</i>') : inl(m[2])) + '</div></div>';
    } else if (m = l.match(/^>?\s*\[(!|i|\*)\]\s*(?:(DANGER|INTERLOCK|OPERATOR NOTE|OPERATOR ACTION)\b:?)?\s*(.*)/)) {
      close();
      const k = { '!': ['danger', 'DANGER', '\u26A0'], 'i': ['interlock', 'INTERLOCK', '\u24D8'], '*': ['note', 'OPERATOR NOTE', '\u2605'] }[m[1]];
      let b = m[3];
      while (/^>\s?/.test(L[i + 1] || '')) {
        i++;
        b += ' ' + L[i].replace(/^>\s?/, '');
      }
      o += `<div class="callout ${m[2] === 'OPERATOR ACTION' ? 'action' : k[0]}"><b>${k[2]} ${m[2] || k[1]}</b><div>${inl(b)}</div></div>`;
    } else if (m = l.match(/^(#{1,4})\s+(.*)/)) {
      close();
      o += `<h${m[1].length}>${inl(m[2])}</h${m[1].length}>`;
    } else if (m = l.match(/^\s*[-*]\s+(.*)/)) {
      if (!ul) { close(); o += '<ul>'; ul = true; }
      o += '<li>' + inl(m[1]) + '</li>';
    } else if (m = l.match(/^\s*\d+\.\s+(.*)/)) {
      if (!ol) { close(); o += '<ol'; ol = true; }
      o += '<li>' + inl(m[1]) + '</li>';
    } else if (l.trim() === '') {
      close();
    } else {
      close();
      o += '<p>' + inl(l) + '</p>';
    }
    i++;
  }
  close();
  return o;
}

const Exp = {
  async dl(name, data, type = 'text/plain') {
    const blob = data instanceof Blob ? data : new Blob([data], { type });
    if ('showSaveFilePicker' in window) {
      try {
        const ext = '.' + name.split('.').pop();
        const h = await window.showSaveFilePicker({
          suggestedName: name,
          types: [{ description: ext.slice(1).toUpperCase() + ' file', accept: { [type]: [ext] } }]
        });
        const w = await h.createWritable();
        await w.write(blob);
        await w.close();
        return 'picker';
      } catch (e) {
        if (e && e.name === 'AbortError') return 'cancel';
      }
    }
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch (e) {}
    return 'download';
  },

  markdown(a) {
    return Exp.dl((a.docId || 'doc') + '_Rev' + a.rev + '.md', `<!-- ${a.docId} | Rev ${a.rev} | ${a.status} -->\n` + a.content, 'text/markdown');
  },

  async backup() {
    const data = {};
    for (const s of DB.S) data[s] = await DB.all(s);
    return Exp.dl('docugenius-backup-' + new Date().toISOString().slice(0, 10) + '.json', JSON.stringify({ app: 'docugenius', version: 1, exported: new Date().toISOString(), data }), 'application/json');
  },

  async restore(file) {
    const j = JSON.parse(await file.text());
    if (j.app !== 'docugenius') throw new Error('Not a DocuGenius backup');
    let n = 0;
    for (const s of DB.S) {
      for (const v of (j.data[s] || [])) {
        await DB.put(s, v);
        n++;
      }
    }
    return n;
  },

  print(a) {
    const isIO = /^AGAC-IO-/i.test(a.docId || '') || a.type === 'IO';
    const orientation = isIO ? 'landscape' : 'portrait';
    const margins = isIO ? '10mm 10mm' : '12mm 12mm';
    const d = new Date(a.updated || Date.now()).toISOString().slice(0, 10);

    const REL = {
      'AS-BUILT': 'As-Built',
      'IFC': 'Issued for Construction',
      'IFA': 'Issued for Approval',
      'IFR': 'Issued for Review'
    };

    let st = 'DRAFT';
    if (a.rev >= 1) {
      st = a.stage || (a.type === 'SAT' || a.status === 'as-built' ? 'AS-BUILT' : a.status === 'approved' ? 'IFC' : (a.status === 'eco' || a.status === 'issued-tender') ? 'IFA' : 'IFR');
    }
    const stageDesc = REL[st] ? ` &middot; ${esc(REL[st])}` : '';
    const proj = esc(a.project || a.plant || 'Strategic SCADA Control Platform');
    const cli = esc(a.client || 'Al Gurg Automation & Controls');
    const prep = esc(String(a.author || '').replace(/\s*\(.*\)\s*$/, '') || 'AGAC SCADA Lead');

    // Page 1 Full Engineering Title Block
    const coverTitleBlock = `
      <table class="tbk cover">
        <tr>
          <td class="logo" rowspan="3">
            <div class="lgo">
              ${LOGO}
              <div class="co">
                <b>AL GURG AUTOMATION &amp; CONTROLS</b>
                <span>A Member of Easa Saleh Al Gurg Group | Dubai, U.A.E.</span>
                <span class="web">www.agac.ae</span>
              </div>
            </div>
          </td>
          <td><small>CLIENT</small><b>${cli}</b></td>
          <td class="r"><small>DOCUMENT ID</small><b class="mono">${esc(a.docId)}</b></td>
        </tr>
        <tr>
          <td><small>PROJECT NAME</small><b>${proj}</b></td>
          <td class="r"><small>REVISION</small><b>Rev ${esc(a.rev)} &middot; ${d}</b></td>
        </tr>
        <tr>
          <td><small>DOCUMENT TITLE</small><b>${esc(a.title)}</b></td>
          <td class="r"><small>STATUS</small><b>${esc(st)}${stageDesc}</b></td>
        </tr>
      </table>`;

    // Running Header for Subsequent Pages
    const runningHeader = `
      <tr class="running-header-row">
        <td colspan="100%">
          <div class="running-header">
            <span class="rh-brand">AL GURG AUTOMATION &amp; CONTROLS</span>
            <span class="rh-doc">${esc(a.docId)} &middot; ${esc(a.title)}</span>
            <span class="rh-rev">Rev ${esc(a.rev)}</span>
          </div>
        </td>
      </tr>`;

    const al = x => [x[11], x[12], x[13], x[14]].map(v => (v === '' || v == null ? '-' : esc(v))).join(' / ');
    
    // Proportional column allocations for I/O Schedules (100% total)
    const ioTable = rows => `
      <table class="io">
        <colgroup>
          <col style="width:18%">
          <col style="width:28%">
          <col style="width:8%">
          <col style="width:12%">
          <col style="width:6%">
          <col style="width:14%">
          <col style="width:14%">
        </colgroup>
        <thead>
          <tr>
            <th>TAG NAME</th>
            <th>DESCRIPTION</th>
            <th>DATA TYPE</th>
            <th class="r">IO ADDRESS / MODBUS</th>
            <th>UNITS</th>
            <th>ALARM LIMITS (LL / L / H / HH)</th>
            <th>SUBSYSTEM / AREA</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(x => `
            <tr>
              <td class="tag">${esc(x[0])}</td>
              <td>${esc(x[1])}</td>
              <td class="type">${esc(x[2])}</td>
              <td class="addr">${esc(x[3])}</td>
              <td class="center">${esc(x[10] || '-')}</td>
              <td class="al">${al(x)}</td>
              <td>${esc(x[15])}</td>
            </tr>`).join('')}
        </tbody>
      </table>`;

    const bodyContent = (a.grid && a.grid.rows && a.grid.rows.length)
      ? md(a.narr || '') + ioTable(a.grid.rows)
      : md(a.content || '');

    // Final Sign-Off Matrix with clean date rules
    const signOffBlock = `
      <div class="signoff-wrapper">
        <p class="rv"><b>Revision Note:</b> Rev ${esc(a.rev)} - ${esc(a.lastReason || 'As-built update and baseline verification')}</p>
        <div class="signoff">
          <h3>Document Control &amp; Sign-off</h3>
          <table class="tbk sg">
            <thead>
              <tr>
                <th style="width:15%">Action</th>
                <th style="width:25%">Name</th>
                <th style="width:30%">Designation</th>
                <th style="width:15%">Signature</th>
                <th style="width:15%">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><b>Prepared By:</b></td>
                <td>${prep}</td>
                <td>SCADA Engineer</td>
                <td><span class="sig-line"></span></td>
                <td>${d}</td>
              </tr>
              <tr>
                <td><b>Checked By:</b></td>
                <td><span class="sig-line"></span></td>
                <td>Lead Automation Engineer / Project Manager</td>
                <td><span class="sig-line"></span></td>
                <td>_____ / _____ / 202_</td>
              </tr>
              <tr>
                <td><b>Approved By:</b></td>
                <td><span class="sig-line"></span></td>
                <td>Resident Consultant / Client QA Engineer</td>
                <td><span class="sig-line"></span></td>
                <td>_____ / _____ / 202_</td>
              </tr>
              <tr>
                <td colspan="5" class="iso">Controlled Document - Subject to Annexure-SCT-HR-001 | Al Gurg Automation and Controls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>`;

    // Dynamic @page rule
    const pageStyle = `
      @page {
        size: A4 ${orientation};
        margin: ${margins};
      }`;

    let styleEl = document.getElementById('pgstyle');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'pgstyle';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = pageStyle;

    const pa = document.getElementById('printArea');
    pa.className = isIO ? 'print-landscape' : 'print-portrait';

    // The Master Sheet structure ensures the running header renders properly across all pages
    pa.innerHTML = `
      <table class="master-sheet">
        <thead>
          ${runningHeader}
        </thead>
        <tbody>
          <tr>
            <td>
              ${coverTitleBlock}
              <div class="body">
                ${bodyContent}
              </div>
              ${signOffBlock}
            </td>
          </tr>
        </tbody>
      </table>`;

    const origTitle = document.title;
    document.title = (a.docId || 'Document') + '_Rev' + a.rev;
    window.print();
    document.title = origTitle;
  }
};
