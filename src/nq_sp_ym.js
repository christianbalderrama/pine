import { PineTS, Provider } from 'pinets';

// Initialize with Binance data
const LENGTH = 100;
const SMT_WINDOW = 100;
const TIMEFRAME_WINDOWS = {
  '1m': 20,
  '5m': 20,
  '15m': 20,
  '30m': 20,
  '1h': 20,
  '4h': 20,
  '1D': 20,
  '1W': 20,
};
const HISTORY_LENGTH = Math.max(LENGTH, SMT_WINDOW * 2);
const BTC = new PineTS(Provider.Binance, 'BTCUSDT', '1D', HISTORY_LENGTH);
const ETH = new PineTS(Provider.Binance, 'ETHUSDT', '1D', HISTORY_LENGTH);
const BTC_15M = new PineTS(Provider.Binance, 'BTCUSDT', '15m', HISTORY_LENGTH);
const ETH_15M = new PineTS(Provider.Binance, 'ETHUSDT', '15m', HISTORY_LENGTH);
const SESSION_NAMES = ['Tokyo', 'London', 'NY-AM', 'NY-PM'];

function getRollingRange(values, lookback = SMT_WINDOW, offset = 0) {
  const start = Math.max(0, values.length - lookback - offset);
  const end = Math.max(0, values.length - offset);
  const slice = values.slice(start, end);

  if (slice.length === 0) {
    return { hi: null, lo: null };
  }

  return {
    hi: Math.max(...slice),
    lo: Math.min(...slice),
  };
}

function resolveTimeframeWindow(timeframe, fallback = SMT_WINDOW, valuesLength = 0) {
  const normalized = String(timeframe || fallback).trim();

  if (typeof timeframe === 'number') {
    return Math.max(1, Math.min(timeframe, valuesLength || timeframe || fallback));
  }

  const exact = TIMEFRAME_WINDOWS[normalized];
  if (typeof exact === 'number') {
    return Math.min(exact, Math.max(1, valuesLength || exact));
  }

  if (normalized.endsWith('m') || normalized.endsWith('h') || normalized.endsWith('D') || normalized.endsWith('W')) {
    const match = normalized.match(/(\d+)([a-zA-Z]+)/i);
    if (match) {
      const amount = Number(match[1]);
      if (!Number.isNaN(amount) && amount > 0) {
        const maxAllowed = valuesLength > 0 ? Math.max(1, valuesLength - 1) : amount;
        return Math.max(1, Math.min(amount, maxAllowed));
      }
    }
  }

  return fallback;
}

function buildSMTCycle(highValues, lowValues, compareHighValues, compareLowValues, lookback, offset = 0) {
  const currentHigh = getRollingRange(highValues, lookback, offset);
  const currentLow = getRollingRange(lowValues, lookback, offset);
  const currentCompareHigh = getRollingRange(compareHighValues, lookback, offset);
  const currentCompareLow = getRollingRange(compareLowValues, lookback, offset);

  return {
    hi: currentHigh.hi,
    lo: currentLow.lo,
    cHi: currentCompareHigh.hi,
    cLo: currentCompareLow.lo,
  };
}

function detectSequentialSMT({ btcHigh, btcLow, ethHigh, ethLow }, timeframe = '1D') {
  const lookback = resolveTimeframeWindow(timeframe, SMT_WINDOW, btcHigh.length);
  if (btcHigh.length < lookback * 2 || ethHigh.length < lookback * 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const q = buildSMTCycle(btcHigh, btcLow, ethHigh, ethLow, lookback, 0);
  const pq = buildSMTCycle(btcHigh, btcLow, ethHigh, ethLow, lookback, lookback);

  const bearish = q.hi > pq.hi && q.cHi <= pq.cHi;
  const bullish = q.lo < pq.lo && q.cLo >= pq.cLo;

  return {
    bearish,
    bullish,
    timeframe,
    lookback,
    notes: 'Sequential SMT mirrors the qt-fxreplay qCur/qPrev cycle comparison idea.',
    details: {
      btcCurrentHigh: q.hi,
      btcPrevHigh: pq.hi,
      ethCurrentHigh: q.cHi,
      ethPrevHigh: pq.cHi,
      btcCurrentLow: q.lo,
      btcPrevLow: pq.lo,
      ethCurrentLow: q.cLo,
      ethPrevLow: pq.cLo,
    },
  };
}

function isValidDailySSMTWindow(currentTimestamp, previousTimestamp) {
  if (currentTimestamp == null || previousTimestamp == null) {
    return false;
  }

  const currentDay = new Date(currentTimestamp).getUTCDay();
  const previousDay = new Date(previousTimestamp).getUTCDay();

  // Align with qt-fxreplay-style trading-day logic:
  // - Mon/Tue/Wed/Thu are valid current days.
  // - Fri is excluded as a current SSMT day.
  // - Fri -> Mon is valid across the weekend, but Thu -> Fri is not.
  if (currentDay === 5) {
    return false;
  }

  if (currentDay === 1 && previousDay === 5) {
    return true;
  }

  if (currentDay >= 1 && currentDay <= 4 && previousDay >= 1 && previousDay <= 4) {
    return true;
  }

  return false;
}

function detect2StageSSMT({ btcHigh, btcLow, ethHigh, ethLow, timestamps = [] }, cycleSize = 20, timeframe = '1D') {
  if (!Array.isArray(btcHigh) || !Array.isArray(btcLow) || !Array.isArray(ethHigh) || !Array.isArray(ethLow)) {
    return { bearish: false, bullish: false, details: null };
  }

  if (timeframe === '1D') {
    const currentTs = timestamps[timestamps.length - 1];
    const previousTs = timestamps[timestamps.length - 2];
    if (!isValidDailySSMTWindow(currentTs, previousTs)) {
      return { bearish: false, bullish: false, timeframe, details: { skipped: true, reason: 'Friday excluded from SSMT; only Mon-Thu and Fri->Mon are valid' } };
    }
  }

  const normalizedCycle = Math.max(2, Number(cycleSize) || 20);
  if (btcHigh.length < normalizedCycle * 2 || ethHigh.length < normalizedCycle * 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const qStart = btcHigh.length - normalizedCycle;
  const pqEnd = qStart;
  const pqStart = Math.max(0, pqEnd - normalizedCycle);

  const q = {
    hi: Math.max(...btcHigh.slice(qStart)),
    lo: Math.min(...btcLow.slice(qStart)),
    cHi: Math.max(...ethHigh.slice(qStart)),
    cLo: Math.min(...ethLow.slice(qStart)),
  };

  const pqData = btcHigh.slice(pqStart, pqEnd);
  const pqLowData = btcLow.slice(pqStart, pqEnd);
  const pqEthHighData = ethHigh.slice(pqStart, pqEnd);
  const pqEthLowData = ethLow.slice(pqStart, pqEnd);

  const pq = {
    hi: pqData.length ? Math.max(...pqData) : null,
    lo: pqLowData.length ? Math.min(...pqLowData) : null,
    cHi: pqEthHighData.length ? Math.max(...pqEthHighData) : null,
    cLo: pqEthLowData.length ? Math.min(...pqEthLowData) : null,
  };

  const bearish = q.hi != null && pq.hi != null && q.hi > pq.hi && q.cHi != null && pq.cHi != null && q.cHi <= pq.cHi;
  const bullish = q.lo != null && pq.lo != null && q.lo < pq.lo && q.cLo != null && pq.cLo != null && q.cLo >= pq.cLo;

  return {
    bearish,
    bullish,
    stage: 'current-cycle-vs-previous-cycle',
    timeframe,
    cycleSize: normalizedCycle,
    details: {
      timeframe,
      btcCurrentHigh: q.hi,
      btcPrevHigh: pq.hi,
      ethCurrentHigh: q.cHi,
      ethPrevHigh: pq.cHi,
      btcCurrentLow: q.lo,
      btcPrevLow: pq.lo,
      ethCurrentLow: q.cLo,
      ethPrevLow: pq.cLo,
    },
  };
}

function detectSSMT({ btcHigh, btcLow, ethHigh, ethLow, timestamps = [] }) {
  if (!Array.isArray(btcHigh) || !Array.isArray(btcLow) || !Array.isArray(ethHigh) || !Array.isArray(ethLow)) {
    return { bearish: false, bullish: false, details: null };
  }

  if (btcHigh.length < 2 || btcLow.length < 2 || ethHigh.length < 2 || ethLow.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const currentTs = timestamps[timestamps.length - 1];
  const previousTs = timestamps[timestamps.length - 2];
  if (!isValidDailySSMTWindow(currentTs, previousTs)) {
    return { bearish: false, bullish: false, details: { skipped: true, reason: 'Friday excluded from SSMT; only Mon-Thu and Fri->Mon are valid' } };
  }

  const btcPrevHigh = btcHigh[btcHigh.length - 2];
  const btcCurHigh = btcHigh[btcHigh.length - 1];
  const btcPrevLow = btcLow[btcLow.length - 2];
  const btcCurLow = btcLow[btcLow.length - 1];

  const ethPrevHigh = ethHigh[ethHigh.length - 2];
  const ethCurHigh = ethHigh[ethHigh.length - 1];
  const ethPrevLow = ethLow[ethLow.length - 2];
  const ethCurLow = ethLow[ethLow.length - 1];

  const bearish = btcCurHigh > btcPrevHigh && ethCurHigh <= ethPrevHigh;
  const bullish = btcCurLow < btcPrevLow && ethCurLow >= ethPrevLow;

  return {
    bearish,
    bullish,
    details: {
      btcPreviousHigh: btcPrevHigh,
      btcCurrentHigh: btcCurHigh,
      ethPreviousHigh: ethPrevHigh,
      ethCurrentHigh: ethCurHigh,
      btcPreviousLow: btcPrevLow,
      btcCurrentLow: btcCurLow,
      ethPreviousLow: ethPrevLow,
      ethCurrentLow: ethCurLow,
    },
  };
}

function getDayName(dayIndex) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[dayIndex] || 'Unknown';
}

function logSSMTStage(stage, result, candleDate, timeframe = result?.timeframe || 'unknown', session = result?.session || result?.details?.currentSession || result?.details?.previousSession || 'n/a', previousDate = null) {
  if (!result || (!result.bearish && !result.bullish)) {
    return;
  }

  const direction = result.bearish ? 'bearish' : 'bullish';
  const sourceDay = candleDate ? new Date(candleDate).getUTCDay() : null;
  const dayLabel = sourceDay != null ? getDayName(sourceDay) : 'unknown';
  const previousDayLabel = previousDate ? getDayName(new Date(previousDate).getUTCDay()) : 'n/a';
  const sessionLabel = session === 'unknown' ? 'n/a' : session;
  console.log(`[${stage}-stage SSMT] ${direction} ${previousDate || 'n/a'} (${previousDayLabel}) to ${candleDate} (${dayLabel}) | timeframe=${timeframe} | session=${sessionLabel}`, result.details || result);
}

function nthSunday(y, m, n) {
  const first = new Date(Date.UTC(y, m, 1)).getUTCDay();
  return Date.UTC(y, m, 1 + ((7 - first) % 7) + 7 * (n - 1));
}

function nyOffset(utc) {
  const y = new Date(utc).getUTCFullYear();
  const s = nthSunday(y, 2, 2) + 7 * 3600000;
  const e = nthSunday(y, 10, 1) + 6 * 3600000;
  return utc >= s && utc < e ? -4 * 3600000 : -5 * 3600000;
}

function getSessionIndexFromTimestamp(ts) {
  const d = new Date(ts + nyOffset(ts) + 6 * 3600000);
  const minutes = d.getUTCHours() * 60 + d.getUTCMinutes();
  return Math.floor(minutes / 360);
}

function buildSessionRanges({ timestamps, btcHigh, btcLow, ethHigh, ethLow }) {
  const ranges = [];
  let current = null;

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    if (ts == null) continue;

    const session = getSessionIndexFromTimestamp(ts);
    if (!current || current.session !== session) {
      if (current) {
        ranges.push(current);
      }
      current = {
        session,
        hi: Number.NEGATIVE_INFINITY,
        lo: Number.POSITIVE_INFINITY,
        cHi: Number.NEGATIVE_INFINITY,
        cLo: Number.POSITIVE_INFINITY,
      };
    }

    current.hi = Math.max(current.hi, btcHigh[i]);
    current.lo = Math.min(current.lo, btcLow[i]);
    current.cHi = Math.max(current.cHi, ethHigh[i]);
    current.cLo = Math.min(current.cLo, ethLow[i]);
  }

  if (current) {
    ranges.push(current);
  }

  return ranges;
}

function detectSessionCycleSSMT({ timestamps, btcHigh, btcLow, ethHigh, ethLow }, timeframe = '15m') {
  if (!Array.isArray(timestamps) || timestamps.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const lastTs = timestamps[timestamps.length - 1];
  const prevTs = timestamps[timestamps.length - 2];
  if (!isValidDailySSMTWindow(lastTs, prevTs)) {
    return { bearish: false, bullish: false, details: { skipped: true, reason: 'Friday excluded from SSMT; only Mon-Thu and Fri->Mon are valid' } };
  }

  const ranges = buildSessionRanges({ timestamps, btcHigh, btcLow, ethHigh, ethLow });
  if (ranges.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const q = ranges[ranges.length - 1];
  const pq = ranges[ranges.length - 2];
  const bearish = q.hi > pq.hi && q.cHi <= pq.cHi;
  const bullish = q.lo < pq.lo && q.cLo >= pq.cLo;

  return {
    bearish,
    bullish,
    stage: 'session-cycle',
    timeframe,
    session: SESSION_NAMES[q.session] || q.session,
    sessionNames: SESSION_NAMES,
    details: {
      timeframe,
      currentSession: SESSION_NAMES[q.session] || q.session,
      previousSession: SESSION_NAMES[pq.session] || pq.session,
      btcCurrentHigh: q.hi,
      btcPrevHigh: pq.hi,
      ethCurrentHigh: q.cHi,
      ethPrevHigh: pq.cHi,
      btcCurrentLow: q.lo,
      btcPrevLow: pq.lo,
      ethCurrentLow: q.cLo,
      ethPrevLow: pq.cLo,
    },
  };
}

// Load the market data first
await BTC.ready();
await ETH.ready();
await BTC_15M.ready();
await ETH_15M.ready();

// Testing
for (let i = 0; i < LENGTH; i++) {
  const candleIndex = BTC.high.length - i - 1;
  const candleTimestamp = BTC.openTime?.[candleIndex] ?? BTC.closeTime?.[candleIndex];
  const candleDate = candleTimestamp ? new Date(candleTimestamp).toISOString().slice(0, 10) : 'unknown';
  const previousIndex = Math.max(0, candleIndex - 1);
  const previousCandleTimestamp = BTC.openTime?.[previousIndex] ?? BTC.closeTime?.[previousIndex];
  const previousCandleDate = previousCandleTimestamp ? new Date(previousCandleTimestamp).toISOString().slice(0, 10) : null;

  const dailyTimestamps = BTC.openTime?.slice(0, BTC.openTime.length - i) ?? [];
  const candleData = {
    timestamps: dailyTimestamps,
    btcHigh: BTC.high.slice(0, BTC.high.length - i),
    btcLow: BTC.low.slice(0, BTC.low.length - i),
    ethHigh: ETH.high.slice(0, ETH.high.length - i),
    ethLow: ETH.low.slice(0, ETH.low.length - i),
  };

  const ssmtResult = detectSSMT(candleData);
  const twoStageResult = detect2StageSSMT(candleData, 20, '1D');

  if (ssmtResult.bearish || ssmtResult.bullish) {
    logSSMTStage('1', ssmtResult, candleDate, '1D', 'n/a', previousCandleDate);

    // const lowerTimeframeData = {
    //   timestamps: BTC_15M.openTime || BTC_15M.closeTime || [],
    //   btcHigh: BTC_15M.high || [],
    //   btcLow: BTC_15M.low || [],
    //   ethHigh: ETH_15M.high || [],
    //   ethLow: ETH_15M.low || [],
    // };

    // const lowerTimeframeSessionSSMT = detectSessionCycleSSMT(lowerTimeframeData, '15m');
    // if (lowerTimeframeSessionSSMT.bearish || lowerTimeframeSessionSSMT.bullish) {
    //   logSSMTStage('2', lowerTimeframeSessionSSMT, candleDate, lowerTimeframeSessionSSMT.timeframe, lowerTimeframeSessionSSMT.session, previousCandleDate);
    // }
  }
}
