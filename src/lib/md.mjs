// Mały, przewidywalny parser Markdown dla treści strony. Bez zależności.
//
// Obsługuje: nagłówki (## ###), akapity, listy (- / 1.), pogrubienie, kursywę, linki, `kod`,
// tabele z |, linię poziomą ---, oraz rozszerzenia:
//   > [!WAZNE] Tytuł        — ramka (typy: WAZNE, INFO, UWAGA, 112, PORADA)
//   ::: szybko              — blok „Najważniejsze w 30 sekund” (do zamykającego :::)
//   ::: nazwa-klasy         — dowolny blok <div class="nazwa-klasy">
//   {{ilustracja:nazwa|Podpis}}   — rysunek SVG z src/illustrations/nazwa.svg
//   {{audio:plik.mp3|Podpis}}     — odtwarzacz dźwięku z /assets/audio/
//   {{tel:112}}                    — numer telefonu jako link
// Listy numerowane mają styl kroków; element „**Czynność.** opis” dzieli się na tytuł i opis.

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function slug(s) {
  return s.toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => ({ ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' }[c]))
    .replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function createRenderer({ link = (u) => u, illustration = () => '', audio = () => '' } = {}) {
  function inline(text) {
    const tokens = [];
    let s = inl(text, tokens);
    while (/\u0000\d+\u0000/.test(s)) s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[+i]);
    return s;
  }

  // Zwraca HTML z miejscami \u0000N\u0000; tokeny wspólne także dla tekstu linków.
  function inl(text, tokens) {
    const keep = (html) => `\u0000${tokens.push(html) - 1}\u0000`;
    let s = text
      .replace(/`([^`]+)`/g, (_, c) => keep(`<code>${esc(c)}</code>`))
      .replace(/\{\{tel:([^}]+)\}\}/g, (_, n) => keep(`<a class="tel" href="tel:${n.replace(/\s/g, '')}">${esc(n)}</a>`))
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => {
        const ext = /^https?:/.test(u);
        return keep(`<a href="${esc(ext ? u : link(u))}"${ext ? ' rel="noopener" class="ext"' : ''}>${inl(t, tokens)}</a>`);
      });
    s = esc(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>')
      .replace(/ -- /g, ' – ');
    return s;
  }

  function listItem(raw, ordered) {
    const m = raw.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    if (ordered && m) return `<li><b>${inline(m[1])}</b>${m[2] ? `<span>${inline(m[2])}</span>` : ''}</li>`;
    return `<li>${inline(raw)}</li>`;
  }

  function render(src, ctx = { headings: [] }) {
    const lines = src.replace(/\r/g, '').split('\n');
    const out = [];
    let i = 0;
    const para = [];
    const flush = () => { if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para.length = 0; } };

    while (i < lines.length) {
      const line = lines[i];
      const t = line.trim();

      if (!t) { flush(); i++; continue; }

      // ::: blok
      const blk = t.match(/^:::\s*([\w-]+)\s*(.*)$/);
      if (blk) {
        flush();
        const inner = [];
        let depth = 1; i++;
        while (i < lines.length) {
          const l = lines[i].trim();
          if (/^:::\s*[\w-]+/.test(l)) depth++;
          else if (l === ':::') { depth--; if (depth === 0) break; }
          inner.push(lines[i]); i++;
        }
        i++;
        const [name, title] = [blk[1], blk[2]];
        if (name === 'szybko') {
          out.push(`<section class="quick"><h2 class="quick-h">${inline(title || 'Najważniejsze w 30 sekund')}</h2>${render(inner.join('\n'), ctx)}</section>`);
        } else {
          out.push(`<div class="${esc(name)}">${title ? `<h3>${inline(title)}</h3>` : ''}${render(inner.join('\n'), ctx)}</div>`);
        }
        continue;
      }

      // {{ilustracja:...}} / {{audio:...}} w osobnej linii
      const dir = t.match(/^\{\{(ilustracja|audio):([^|}]+)(?:\|([^}]*))?\}\}$/);
      if (dir) {
        flush();
        out.push(dir[1] === 'ilustracja' ? illustration(dir[2].trim(), dir[3] ? inline(dir[3].trim()) : '') : audio(dir[2].trim(), dir[3] ? inline(dir[3].trim()) : ''));
        i++; continue;
      }

      const h = t.match(/^(#{2,4})\s+(.+)$/);
      if (h) {
        flush();
        const level = h[1].length;
        const id = slug(h[2]);
        ctx.headings.push({ level, id, text: h[2] });
        out.push(`<h${level} id="${id}">${inline(h[2])}</h${level}>`);
        i++; continue;
      }

      if (/^---+$/.test(t)) { flush(); out.push('<hr>'); i++; continue; }

      if (t.startsWith('>')) {
        flush();
        const inner = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) { inner.push(lines[i].trim().replace(/^>\s?/, '')); i++; }
        const c = inner[0].match(/^\[!(\w+)\]\s*(.*)$/);
        if (c) {
          const type = c[1].toLowerCase();
          const body = render(inner.slice(1).join('\n'), ctx);
          out.push(`<aside class="callout callout-${esc(type)}">${c[2] ? `<p class="callout-t">${inline(c[2])}</p>` : ''}${body}</aside>`);
        } else {
          out.push(`<blockquote>${render(inner.join('\n'), ctx)}</blockquote>`);
        }
        continue;
      }

      if (/^([-*])\s+/.test(t) || /^\d+\.\s+/.test(t)) {
        flush();
        const ordered = /^\d+\./.test(t);
        const items = [];
        while (i < lines.length) {
          const l = lines[i];
          const lt = l.trim();
          const m = ordered ? lt.match(/^\d+\.\s+(.*)$/) : lt.match(/^[-*]\s+(.*)$/);
          if (m) { items.push(m[1]); i++; continue; }
          if (lt && /^\s{2,}/.test(l) && items.length) { items[items.length - 1] += ' ' + lt; i++; continue; }
          break;
        }
        const tag = ordered ? 'ol' : 'ul';
        out.push(`<${tag}${ordered ? ' class="steps"' : ''}>${items.map((it) => listItem(it, ordered)).join('')}</${tag}>`);
        continue;
      }

      if (t.startsWith('|')) {
        flush();
        const rows = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) { rows.push(lines[i].trim()); i++; }
        const cells = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const head = cells(rows[0]);
        const body = rows.slice(rows[1] && /^\|[\s:|-]+\|$/.test(rows[1]) ? 2 : 1).map(cells);
        out.push(`<div class="table"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
        continue;
      }

      para.push(t);
      i++;
    }
    flush();
    return out.join('\n');
  }

  return { render, inline };
}

// Front matter: linie „klucz: wartość” między --- a ---. Listy: „klucz:” i niżej „- element”.
export function parseFrontMatter(src) {
  src = src.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  let listKey = null;
  for (const line of m[1].split('\n')) {
    const li = line.match(/^\s*-\s+(.*)$/);
    if (li && listKey) { meta[listKey].push(li[1].trim()); continue; }
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) {
      if (kv[2] === '') { listKey = kv[1]; meta[listKey] = []; } else { listKey = null; meta[kv[1]] = kv[2].trim(); }
    }
  }
  return { meta, body: src.slice(m[0].length) };
}

export { esc };
