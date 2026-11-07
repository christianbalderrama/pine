// @maxBarsBack 500
// Time Windows + Quarterly Theory (Daye) [TW_QT]  -  FX Replay, FXR Script (new engine)
// • Year / week / session / 90-min quarter lines (New York time)
// • True Opens, session shading, 6h range boxes
// • Day / previous day / week / previous week high & low
// • Divergence vs silver or DXY: SSMT, SMT at PDH/PDL/PWH/PWL, PSP
// • Dashboard.  Trading day starts 18:00 New York (US DST computed in code).
indicator({ onMainPanel: true, format: 'inherit', maxDrawings: 500 });

// ───────────────────────── Constants
const H = 3600000;
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TF_OPTS = ['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'];
const TF_MIN = { '1m': 1, '5m': 5, '15m': 15, '30m': 30, '1h': 60, '4h': 240, '1D': 1440, '1W': 10080 };
const STY_OPTS = ['Solid', 'Dashed', 'Dotted'];
const STY = { 'Solid': 'solid', 'Dashed': 'dashed', 'Dotted': 'dotted' };

// ───────────────────────── Inputs (key = title, so every title is unique)
const G = 'General';
const dayNames  = input.str('Weekday quarter names (Mon..Fri)', 'Q1,Q2,Q3,Q4,QX', { group: G });
const sessNames = input.str('Session names', 'Tokyo,London,NY-AM,NY-PM', { group: G });

const gY = '1) Year quarters (3 months)';
const yShow = input.bool('Show year quarters', true, { group: gY });
const yTf   = input.str('Year: show up to timeframe', '1D', { options: TF_OPTS, group: gY });
const yCol  = input.color('Year line color', color.red, { group: gY });
const ySty  = input.str('Year line style', 'Solid', { options: STY_OPTS, group: gY });
const yWid  = input.int('Year line width', 3, { min: 1, max: 10, step: 1, group: gY });
const yPre  = input.str('Year label prefix', 'Y-', { group: gY });

const gW = '2) Week quarters (trading days)';
const wShow = input.bool('Show week quarters', true, { group: gW });
const wTf   = input.str('Week: show up to timeframe', '4h', { options: TF_OPTS, group: gW });
const wCol  = input.color('Week line color', color.blue, { group: gW });
const wSty  = input.str('Week line style', 'Solid', { options: STY_OPTS, group: gW });
const wWid  = input.int('Week line width', 2, { min: 1, max: 10, step: 1, group: gW });
const wPre  = input.str('Week label prefix', 'W-', { group: gW });

const gD = '3) Day quarters (sessions)';
const dShow = input.bool('Show day quarters', true, { group: gD });
const dTf   = input.str('Day: show up to timeframe', '1h', { options: TF_OPTS, group: gD });
const dCol  = input.color('Day line color', color.orange, { group: gD });
const dSty  = input.str('Day line style', 'Dashed', { options: STY_OPTS, group: gD });
const dWid  = input.int('Day line width', 1, { min: 1, max: 10, step: 1, group: gD });
const dPre  = input.str('Day label prefix', 'D-', { group: gD });

const gS = '4) Session quarters (90 minutes)';
const sShow = input.bool('Show session quarters', true, { group: gS });
const sTf   = input.str('Session: show up to timeframe', '30m', { options: TF_OPTS, group: gS });
const sCol  = input.color('Session line color', color.gray, { group: gS });
const sSty  = input.str('Session line style', 'Dotted', { options: STY_OPTS, group: gS });
const sWid  = input.int('Session line width', 1, { min: 1, max: 10, step: 1, group: gS });
const sPre  = input.str('Session label prefix', 'S-', { group: gS });
const sAdd  = input.bool('Add session name to label', true, { group: gS });

const gB = '5) Session shading & range boxes';
const shade  = input.bool('Shade sessions', true, { group: gB });
const bgQ1   = input.color('Session 1 background', color.rgba(128, 128, 128, 0.06), { group: gB });
const bgQ2   = input.color('Session 2 background', color.rgba(255, 82, 82, 0.05), { group: gB });
const bgQ3   = input.color('Session 3 background', color.rgba(76, 175, 80, 0.05), { group: gB });
const bgQ4   = input.color('Session 4 background', color.rgba(33, 150, 243, 0.05), { group: gB });
const showBox = input.bool('6h session range boxes', false, { group: gB });
const colBox  = input.color('Range box color', color.rgba(33, 150, 243, 0.08), { group: gB });

const gT = '6) True Opens';
const showWTO = input.bool('Weekly True Open (Mon 18:00 NY)', true, { group: gT });
const colWTO  = input.color('Weekly TO color', color.rgba(156, 39, 176, 1), { group: gT });
const showDTO = input.bool('Daily True Open (00:00 NY)', true, { group: gT });
const colDTO  = input.color('Daily TO color', color.orange, { group: gT });
const showSTO = input.bool('Session True Opens (90m Q2)', true, { group: gT });
const colSTO  = input.color('Session TO color', color.rgba(0, 188, 212, 1), { group: gT });
const show9TO = input.bool('90m True Opens (micro Q2)', false, { group: gT });
const col9TO  = input.color('90m TO color', color.rgba(192, 192, 192, 1), { group: gT });

const gH = '7) Highs & lows';
const hlDay  = input.bool('Today high/low', true, { group: gH });
const hlDayC = input.color('Today color', color.rgba(240, 230, 140, 1), { group: gH });
const hlPD   = input.bool('Previous day high/low', true, { group: gH });
const hlPDC  = input.color('Previous day color', color.rgba(255, 215, 0, 1), { group: gH });
const hlWk   = input.bool('Week high/low', true, { group: gH });
const hlWkC  = input.color('Week color', color.rgba(135, 206, 250, 1), { group: gH });
const hlPW   = input.bool('Previous week high/low', false, { group: gH });
const hlPWC  = input.color('Previous week color', color.rgba(70, 130, 180, 1), { group: gH });
const hlSty  = input.str('High/low line style', 'Dashed', { options: STY_OPTS, group: gH });
const hlTf   = input.timeframe('Day/week ranges built from', '60', { tooltip: '1 hour candles line up with the 18:00 NY trading day; must be >= chart timeframe', group: gH });

const gX = '8) Divergence (SMT)';
const cmpMode = input.str('Correlated instrument', 'Silver', { options: ['Silver', 'DXY (inverse)'], group: gX });
const silverSym = input.symbol('Silver symbol', 'XAGUSD', { tooltip: 'Bare ticker, e.g. XAGUSD', group: gX });
const dxySym  = input.symbol('Dollar index symbol', 'DOLLARIDXUSD', { tooltip: 'Bare ticker; must differ from the silver symbol', group: gX });
const useSMT  = input.bool('Sequential SMT', true, { group: gX });
const smtCyc  = input.str('SSMT cycle', '90m', { options: ['90m', '6h'], group: gX });
const useLvl  = input.bool('SMT at previous day / week high & low', true, { group: gX });
const usePSP  = input.bool('Precision Swing Points', true, { group: gX });
const pspLb   = input.int('PSP: swing must be extreme of last N candles', 20, { min: 1, max: 100, step: 1, group: gX });
const colBull = input.color('Bullish color', color.rgba(0, 150, 136, 1), { group: gX });
const colBear = input.color('Bearish color', color.red, { group: gX });

const gDb = '9) Dashboard';
const showTbl = input.bool('Show dashboard', true, { group: gDb });
const colTbl  = input.color('Dashboard text color', color.white, { group: gDb });

// ───────────────────────── Correlated series
// One handle per symbol (duplicates on the same symbol return NaN); never { include: 'forming' }.
const silverH = symbol({ symbol: silverSym });
const dxyH = symbol({ symbol: dxySym });
// hourly series for previous day / week ranges (the 1D candles here start at 00:00 UTC, not 18:00 NY)
const rngH = symbol({ timeframe: hlTf });
const silverR = symbol({ symbol: silverSym, timeframe: hlTf });
const dxyR = symbol({ symbol: dxySym, timeframe: hlTf });

// ───────────────────────── Time helpers
function nthSunday(y, m, n) {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  return Date.UTC(y, m, 1 + ((7 - first) % 7) + 7 * (n - 1));
}
function nyOffset(utc) {
  const y = new Date(utc).getUTCFullYear();
  const s = nthSunday(y, 2, 2) + 7 * H;
  const e = nthSunday(y, 10, 1) + 6 * H;
  return utc >= s && utc < e ? -4 * H : -5 * H;
}
function keys(t) {
  const d = new Date(t + nyOffset(t) + 6 * H);
  const m = d.getUTCHours() * 60 + d.getUTCMinutes();
  const day = Math.floor(d.getTime() / 86400000);
  const sess = Math.floor(m / 360);
  const q = Math.floor(m / 90);
  const mq = Math.floor(m * 2 / 45);
  return {
    m: m, year: d.getUTCFullYear(), yq: Math.floor(d.getUTCMonth() / 3), dow: d.getUTCDay(),
    sess: sess, q90: q % 4, qAbs: q, mq: mq % 4,
    y: d.getUTCFullYear() * 4 + Math.floor(d.getUTCMonth() / 3),
    day: day, wk: Math.floor((day + 3) / 7), k6: day * 4 + sess, k90: day * 16 + q, kMq: day * 64 + mq,
  };
}
function tehran(t) {
  const d = new Date(t + 3.5 * H);
  return String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
}
function ok(v) { return v != null && !isNaN(v); }
function split(str, n, defs) {
  const parts = String(str || '').split(',');
  const out = [];
  for (let i = 0; i < n; i++) {
    const v = i < parts.length ? parts[i].trim() : '';
    out.push(v === '' ? defs[i] : v);
  }
  return out;
}
const DAYQ = split(dayNames, 5, ['Q1', 'Q2', 'Q3', 'Q4', 'QX']);
const SESS = split(sessNames, 4, ['Tokyo', 'London', 'NY-AM', 'NY-PM']);

// correlated OHLC at offset i, aligned with the chart candle; inverse (DXY) -> negated
const cmpInv = cmpMode === 'DXY (inverse)';
const cmpH = cmpInv ? dxyH : silverH;
const cmpR = cmpInv ? dxyR : silverR;
const cmpName = cmpInv ? dxySym : silverSym;
function rawBar(j) {
  return { t: cmpH.time(j), o: cmpH.open(j), h: cmpH.high(j), l: cmpH.low(j), c: cmpH.close(j) };
}
// align by timestamp, not by index: during replay the correlated feed can lag or lead the chart by a candle
function cmpBar(i) {
  const t = time(i);
  let r = null;
  for (let j = Math.max(0, i - 2); j <= i + 2; j++) {
    if (cmpH.time(j) === t) { r = rawBar(j); break; }
  }
  if (!r || !ok(r.h) || !ok(r.l) || !ok(r.o) || !ok(r.c)) return null;
  if (!cmpInv) return r;
  return { t: r.t, o: -r.o, h: -r.l, l: -r.h, c: -r.c };
}
// any aligned correlated candle among the last 30 (sparse feeds such as the dollar index skip minutes)
function cmpRecent() {
  for (let i = 1; i <= 30; i++) if (cmpBar(i)) return true;
  return false;
}

// ───────────────────────── State (persists across candles within one run)
const S = state;
if (S.ready !== true) {
  S.ready = true;
  S.wTO = null; S.dTO = null; S.sTO = null; S.nTO = null;
  S.box = null;
  S.d = null; S.pd = null; S.w = null; S.pw = null;       // { t, hi, lo, cHi, cLo }
  S.fPDH = false; S.fPDL = false; S.fPWH = false; S.fPWL = false;
  S.qCur = null; S.qPrev = null;
  S.firedBear = false; S.firedBull = false;
  S.lastSSMT = '—';
  S.pspHiQ = null; S.pspLoQ = null;
  S.hl = {};
  S.dashId = null;
}

// A True Open line is drawn once, from its candle to the end of its cycle (known in advance),
// so it never needs per-candle updates (every update adds to the indicator's output size).
function startTO(price, col, txt, dashed, cycleMin, minsInto) {
  const t0 = time(0);
  const t1 = t0 + Math.max(1, cycleMin - minsInto) * 60000;
  trendLine.create(t0, price, t1, price, {
    color: col, width: dashed ? 1 : 2, style: dashed ? 'dashed' : 'solid', text: txt,
  });
  return { price: price };
}
function newRange(t, c) {
  return { t: t, hi: high(0), lo: low(0), cHi: c ? c.h : null, cLo: c ? c.l : null };
}
function growRange(r, c) {
  r.hi = Math.max(r.hi, high(0));
  r.lo = Math.min(r.lo, low(0));
  if (c) {
    r.cHi = r.cHi == null ? c.h : Math.max(r.cHi, c.h);
    r.cLo = r.cLo == null ? c.l : Math.min(r.cLo, c.l);
  }
}
// Scan the hourly series (closed candles, newest first) for the current day, previous day,
// current week and previous week, for the chart and the correlated instrument.
function scanRanges(c) {
  const out = { d: null, pd: null, w: null, pw: null };
  let pdKey = null, pwKey = null;
  const add = (slot, t, hi, lo, chi, clo) => {
    let r = out[slot];
    if (!r) r = out[slot] = { t: t, hi: hi, lo: lo, cHi: null, cLo: null };
    r.t = Math.min(r.t, t);
    r.hi = Math.max(r.hi, hi);
    r.lo = Math.min(r.lo, lo);
    if (ok(chi) && ok(clo)) {
      r.cHi = r.cHi == null ? chi : Math.max(r.cHi, chi);
      r.cLo = r.cLo == null ? clo : Math.min(r.cLo, clo);
    }
  };
  for (let i = 0; i < 480; i++) {
    const t = rngH.time(i), hi = rngH.high(i), lo = rngH.low(i);
    if (!ok(t) || !ok(hi) || !ok(lo)) break;
    const k = keys(t);
    let chi = null, clo = null;
    for (let j = Math.max(0, i - 1); j <= i + 1; j++) {
      if (cmpR.time(j) !== t) continue;
      const rh = cmpR.high(j), rl = cmpR.low(j);
      if (ok(rh) && ok(rl)) { chi = cmpInv ? -rl : rh; clo = cmpInv ? -rh : rl; }
      break;
    }
    if (k.day === c.day) add('d', t, hi, lo, chi, clo);
    else if (k.day < c.day) {
      if (pdKey === null) pdKey = k.day;
      if (k.day === pdKey) add('pd', t, hi, lo, chi, clo);
    }
    if (k.wk === c.wk) add('w', t, hi, lo, chi, clo);
    else if (k.wk < c.wk) {
      if (pwKey === null) pwKey = k.wk;
      if (k.wk === pwKey) add('pw', t, hi, lo, chi, clo);
      else break;                                   // older than the previous week
    }
  }
  return out;
}
function merge(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    t: Math.min(a.t, b.t), hi: Math.max(a.hi, b.hi), lo: Math.min(a.lo, b.lo),
    cHi: a.cHi == null ? b.cHi : b.cHi == null ? a.cHi : Math.max(a.cHi, b.cHi),
    cLo: a.cLo == null ? b.cLo : b.cLo == null ? a.cLo : Math.min(a.cLo, b.cLo),
  };
}

function hlLine(key, show, t0, p, col, txt) {
  const cur = S.hl[key];
  if (!show || !ok(p) || t0 == null) {
    if (cur && cur.id != null) trendLine.delete(cur.id);
    S.hl[key] = null;
    return;
  }
  const t1 = time(0);
  const label = txt + ' ' + p.toFixed(2);
  if (cur && cur.id != null && cur.t0 === t0) {
    trendLine.update(cur.id, { y1: p, x2: t1, y2: p, text: label });
  } else {
    if (cur && cur.id != null) trendLine.delete(cur.id);
    const id = trendLine.create(t0, p, t1, p, { color: col, width: 1, style: STY[hlSty] || 'dashed', text: label });
    S.hl[key] = { id: id, t0: t0 };
  }
}

// ───────────────────────── Per candle
function run() {
  if (candlesCount < 2) return;
  const t0 = time(0), t1 = time(1);
  if (!ok(t0) || !ok(t1)) return;
  const c = keys(t0), p = keys(t1);
  const newYq = c.y !== p.y, newDay = c.day !== p.day, newWk = c.wk !== p.wk;
  const new6h = c.k6 !== p.k6, new90 = c.k90 !== p.k90, newMq = c.kMq !== p.kMq;
  const tfMin = (t0 - t1) / 60000;
  const cb = cmpBar(0);

  // background
  if (shade) chartColor([bgQ1, bgQ2, bgQ3, bgQ4][c.sess]);

  // ── quarter lines (Time Windows): one line per boundary, styled by the highest level
  const lv = [
    { on: newYq && yShow && tfMin <= TF_MIN[yTf], col: yCol, sty: ySty, wid: yWid, txt: yPre + 'Q' + (c.yq + 1) + ' ' + c.year },
    { on: newDay && wShow && tfMin <= TF_MIN[wTf], col: wCol, sty: wSty, wid: wWid, txt: wPre + (c.dow >= 1 && c.dow <= 5 ? DAYQ[c.dow - 1] : '-') + ' ' + DOW[c.dow] },
    { on: new6h && dShow && tfMin <= TF_MIN[dTf], col: dCol, sty: dSty, wid: dWid, txt: dPre + 'Q' + (c.sess + 1) + ' ' + SESS[c.sess] },
    { on: new90 && sShow && tfMin <= TF_MIN[sTf], col: sCol, sty: sSty, wid: sWid, txt: sPre + 'Q' + (c.q90 + 1) + (sAdd ? ' ' + SESS[Math.floor(c.qAbs / 4)] : '') },
  ];
  let top = null, txt = '';
  for (const L of lv) {
    if (!L.on) continue;
    if (top === null) top = L;
    txt += (txt === '' ? '' : '  |  ') + L.txt;
  }
  if (top) verticalLine.create(t0, { color: top.col, width: Number(top.wid) || 1, style: STY[top.sty] || 'solid', text: txt, textColor: top.col });

  // ── 6h range box
  if (showBox) {
    if (new6h || S.box === null) {
      S.box = { hi: high(0), lo: low(0) };
      S.box.id = rectangle.create(t0, S.box.hi, t0, S.box.lo, { color: colBox, fillColor: colBox, borderColor: colBox, text: SESS[c.sess] });
    } else {
      S.box.hi = Math.max(S.box.hi, high(0));
      S.box.lo = Math.min(S.box.lo, low(0));
      if (S.box.id != null) rectangle.update(S.box.id, { y1: S.box.hi, x2: t0, y2: S.box.lo });
    }
  }

  // ── True Opens
  if (newWk) S.wTO = null;
  if (newDay) S.dTO = null;
  if (new6h) S.sTO = null;
  if (new90) S.nTO = null;
  // cycle lengths: week Mon 18:00 -> Fri 17:00 NY (4 days - 1h after Tue 00:00 shifted); day 1440; session 360; 90m
  if (showWTO && newDay && c.dow === 2) S.wTO = startTO(open(0), colWTO, 'Weekly TO', false, 4 * 1440 - 60, c.m);
  if (showDTO && new6h && c.sess === 1) S.dTO = startTO(open(0), colDTO, 'Daily TO', false, 1440, c.m);
  if (showSTO && new90 && c.q90 === 1) S.sTO = startTO(open(0), colSTO, SESS[c.sess] + ' TO', true, 360, c.m % 360);
  if (show9TO && newMq && c.mq === 1) S.nTO = startTO(open(0), col9TO, '90m TO', true, 90, c.m % 90);

  // ── day / week ranges (chart + correlated), seeded from the hourly series
  if (newDay || newWk || S.d === null) {
    const r = scanRanges(c);
    const first = S.d === null;
    S.pd = r.pd || (first ? null : S.d);
    S.pw = newWk ? (r.pw || (first ? null : S.w)) : (r.pw || S.pw);
    S.d = merge(r.d, newRange(t0, cb));
    S.w = newWk ? merge(r.w, newRange(t0, cb)) : merge(merge(r.w, S.w), newRange(t0, cb));
    if (newDay || first) { S.fPDH = false; S.fPDL = false; }
    if (newWk || first) { S.fPWH = false; S.fPWL = false; }
  } else {
    growRange(S.d, cb);
    growRange(S.w, cb);
  }

  // ── SMT at previous day / week high & low
  if (useLvl && cb) {
    const lvl = (flag, ref, cur, isHigh, tag, big) => {
      if (S[flag] || !ref || ref.cHi == null) return;
      const broke = isHigh ? high(0) > ref.hi : low(0) < ref.lo;
      if (!broke) return;
      S[flag] = true;
      const div = isHigh ? cur.cHi <= ref.cHi : cur.cLo >= ref.cLo;
      if (div) {
        label.create(t0, isHigh ? high(0) : low(0), {
          text: 'SMT ' + tag, color: isHigh ? colBear : colBull,
          style: isHigh ? labelStyle.triangleDown : labelStyle.triangleUp, size: big ? size.small : size.tiny,
        });
      }
    };
    lvl('fPDH', S.pd, S.d, true, 'PDH', false);
    lvl('fPDL', S.pd, S.d, false, 'PDL', false);
    lvl('fPWH', S.pw, S.w, true, 'PWH', true);
    lvl('fPWL', S.pw, S.w, false, 'PWL', true);
  }

  // ── Sequential SMT
  const newCyc = smtCyc === '6h' ? new6h : new90;
  if (useSMT) {
    if (newCyc || S.qCur === null) {
      const q = S.qCur, pq = S.qPrev;
      if (q && pq && q.cHi != null && pq.cHi != null) {
        if (q.hi > pq.hi && q.cHi <= pq.cHi) {
          trendLine.create(pq.hiT, pq.hi, q.hiT, q.hi, { color: colBear, width: 2, text: 'SSMT' });
          S.lastSSMT = 'Bearish · ' + tehran(q.hiT);
        }
        if (q.lo < pq.lo && q.cLo >= pq.cLo) {
          trendLine.create(pq.loT, pq.lo, q.loT, q.lo, { color: colBull, width: 2, text: 'SSMT' });
          S.lastSSMT = 'Bullish · ' + tehran(q.loT);
        }
      }
      S.qPrev = S.qCur;
      S.qCur = { hi: high(0), lo: low(0), hiT: t0, loT: t0, cHi: cb ? cb.h : null, cLo: cb ? cb.l : null };
      S.firedBear = false;
      S.firedBull = false;
    } else {
      const q = S.qCur;
      if (high(0) > q.hi) { q.hi = high(0); q.hiT = t0; }
      if (low(0) < q.lo) { q.lo = low(0); q.loT = t0; }
      if (cb) {
        q.cHi = q.cHi == null ? cb.h : Math.max(q.cHi, cb.h);
        q.cLo = q.cLo == null ? cb.l : Math.min(q.cLo, cb.l);
      }
    }
    const q = S.qCur, pq = S.qPrev;
    if (pq && pq.cHi != null && q.cHi != null) {
      if (!S.firedBear && q.hi > pq.hi && q.cHi <= pq.cHi) { S.firedBear = true; shape.triangleDown(t0, high(0), { color: colBear, size: size.tiny }); }
      if (!S.firedBull && q.lo < pq.lo && q.cLo >= pq.cLo) { S.firedBull = true; shape.triangleUp(t0, low(0), { color: colBull, size: size.tiny }); }
    }
  }

  // ── PSP on closed candles: swing at offset 2, neighbours 1 and 3, extreme of last N
  if (usePSP && candlesCount > pspLb + 3) {
    const k = cmpBar(2);
    if (k) {
      const dir = Math.sign(close(2) - open(2));
      const cdir = Math.sign(k.c - k.o);
      if (dir !== 0 && cdir !== 0 && dir !== cdir) {
        let isHi = high(2) > high(1), isLo = low(2) < low(1);
        for (let i = 3; i <= pspLb + 2 && (isHi || isLo); i++) {
          if (high(i) >= high(2)) isHi = false;
          if (low(i) <= low(2)) isLo = false;
        }
        // at most one PSP per direction per 90m cycle (keeps the 500-drawing budget for levels)
        const kq = keys(time(2)).k90;
        if (isHi && S.pspHiQ !== kq) { S.pspHiQ = kq; label.create(time(2), high(2), { text: 'PSP', color: colBear, style: labelStyle.triangleDown, size: size.tiny }); }
        if (isLo && S.pspLoQ !== kq) { S.pspLoQ = kq; label.create(time(2), low(2), { text: 'PSP', color: colBull, style: labelStyle.triangleUp, size: size.tiny }); }
      }
    }
  }

  // ── current highs & lows + dashboard on the newest candle
  if (barState.isLast) {
    hlLine('TDH', hlDay, S.d && S.d.t, S.d && S.d.hi, hlDayC, 'Day H');
    hlLine('TDL', hlDay, S.d && S.d.t, S.d && S.d.lo, hlDayC, 'Day L');
    hlLine('PDH', hlPD, S.pd && S.pd.t, S.pd && S.pd.hi, hlPDC, 'PDH');
    hlLine('PDL', hlPD, S.pd && S.pd.t, S.pd && S.pd.lo, hlPDC, 'PDL');
    hlLine('WH', hlWk, S.w && S.w.t, S.w && S.w.hi, hlWkC, 'Week H');
    hlLine('WL', hlWk, S.w && S.w.t, S.w && S.w.lo, hlWkC, 'Week L');
    hlLine('PWH', hlPW, S.pw && S.pw.t, S.pw && S.pw.hi, hlPWC, 'PWH');
    hlLine('PWL', hlPW, S.pw && S.pw.t, S.pw && S.pw.lo, hlPWC, 'PWL');

    if (showTbl) {
      const px = close(0);
      const pd = (to) => (to && ok(to.price) ? (px > to.price ? 'Premium ▲' : 'Discount ▼') : '—');
      const lines = [
        'TW_QT  ·  Tehran ' + tehran(t0),
        'Week: ' + (c.dow >= 1 && c.dow <= 5 ? DAYQ[c.dow - 1] : '-') + ' ' + DOW[c.dow],
        'Session: Q' + (c.sess + 1) + ' · ' + SESS[c.sess],
        '90m: Q' + (c.q90 + 1) + '  (~' + (90 - (c.m % 90)) + 'm left)',
        'Micro: Q' + (c.mq + 1),
        'vs Weekly TO: ' + pd(S.wTO),
        'vs Daily TO: ' + pd(S.dTO),
        'vs Session TO: ' + pd(S.sTO),
        'Last SSMT: ' + S.lastSSMT,
        'Divergence vs: ' + cmpName + (cmpInv ? ' (inv)' : '') + (cmpRecent() ? '' : '  ⚠ no data'),
      ];
      const t = lines.join('\n');
      if (S.dashId == null) S.dashId = anchoredText.create(0.78, 0.97, { text: t, color: colTbl });
      else anchoredText.update(S.dashId, { text: t });
    }
  }
}

run();
