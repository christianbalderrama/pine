import { PineTS, Provider } from 'pinets';

// Fetch a full year of data for each timeframe:
// 1D => one candle per day, ~365 candles
// 1W => one candle per week, ~52 candles
const DAILY_LOOKBACK_CANDLES = 365;
const WEEKLY_LOOKBACK_CANDLES = 53;

const BTC_DAILY = new PineTS(Provider.Binance, 'BTCUSDT', '1D', DAILY_LOOKBACK_CANDLES);
const ETH_DAILY = new PineTS(Provider.Binance, 'ETHUSDT', '1D', DAILY_LOOKBACK_CANDLES);
const BTC_WEEKLY = new PineTS(Provider.Binance, 'BTCUSDT', '1W', WEEKLY_LOOKBACK_CANDLES);
const ETH_WEEKLY = new PineTS(Provider.Binance, 'ETHUSDT', '1W', WEEKLY_LOOKBACK_CANDLES);

function getDayName(dayIndex) {
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[dayIndex] || 'Unknown';
}

function getMonthKey(timestamp) {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function getQuarterOfYear(timestamp) {
  if (!timestamp) return 'QX';
  const month = new Date(timestamp).getUTCMonth();
  const qIndex = Math.floor(month / 3);
  return `Q${qIndex + 1}`;
}

function getMonthQuarter(timestamp) {
  if (!timestamp) return 'QX';
  const month = new Date(timestamp).getUTCMonth();
  const qIndex = Math.floor(month / 3);
  return `Q${qIndex + 1}`;
}

function getTradingWeekQuarter(timestamp) {
  if (!timestamp) return 'QX';
  const day = new Date(timestamp).getUTCDay();
  if (day === 0 || day === 6) return 'QX';
  const map = { 1: 'Q1', 2: 'Q2', 3: 'Q3', 4: 'Q4', 5: 'QX' };
  return map[day] ?? 'QX';
}

function formatDateValue(timestamp) {
  if (!timestamp) return 'unknown';
  return new Date(timestamp).toISOString().slice(0, 10);
}

function isWeekendDateLike(value) {
  if (!value) return false;
  const day = new Date(value).getUTCDay();
  return day === 0 || day === 6;
}

function isValidDailySSMTWindow(currentDay, previousDay) {
  if (currentDay == null || previousDay == null) return false;
  if (currentDay === 0 || currentDay === 6 || previousDay === 0 || previousDay === 6) return false;
  if (currentDay === 5) return false;
  if (previousDay === 4 && currentDay === 5) return false;
  if (previousDay === 5 && currentDay === 1) return true;
  return currentDay >= 1 && currentDay <= 4 && previousDay >= 1 && previousDay <= 4;
}

function buildMonthlyWeekBuckets({ timestamps, highs, lows }) {
  const buckets = [];
  let current = null;

  for (let i = 0; i < timestamps.length; i++) {
    const ts = timestamps[i];
    if (!ts) continue;

    const d = new Date(ts);
    const monthKey = getMonthKey(ts);
    const weekIndex = Math.floor((d.getUTCDate() - 1) / 7);
    const bucketKey = `${monthKey}-W${weekIndex + 1}`;

    if (!current || current.key !== bucketKey) {
      if (current) buckets.push(current);
      current = {
        key: bucketKey,
        monthKey,
        weekIndex,
        firstTimestamp: ts,
        lastTimestamp: ts,
        hi: Number.NEGATIVE_INFINITY,
        lo: Number.POSITIVE_INFINITY,
      };
    }

    current.lastTimestamp = ts;
    current.hi = Math.max(current.hi, Number(highs[i]));
    current.lo = Math.min(current.lo, Number(lows[i]));
  }

  if (current) buckets.push(current);
  return buckets;
}

function detectMonthlySSMT({ btcHigh, btcLow, ethHigh, ethLow, timestamps = [] }) {
  if (!Array.isArray(btcHigh) || !Array.isArray(btcLow) || !Array.isArray(ethHigh) || !Array.isArray(ethLow)) {
    return { bearish: false, bullish: false, details: null };
  }

  if (isWeekendDateLike(timestamps[timestamps.length - 1]) || isWeekendDateLike(timestamps[timestamps.length - 2])) {
    return {
      bearish: false,
      bullish: false,
      timeframe: '1W',
      details: {
        skipped: true,
        reason: 'Weekend dates are not valid for SSMT detection',
        currentDate: timestamps[timestamps.length - 1] ? new Date(timestamps[timestamps.length - 1]).toISOString().slice(0, 10) : 'unknown',
        previousDate: timestamps[timestamps.length - 2] ? new Date(timestamps[timestamps.length - 2]).toISOString().slice(0, 10) : 'unknown',
      },
    };
  }

  const monthBuckets = {
    btc: buildMonthlyWeekBuckets({ timestamps, highs: btcHigh, lows: btcLow }),
    eth: buildMonthlyWeekBuckets({ timestamps, highs: ethHigh, lows: ethLow }),
  };

  if (monthBuckets.btc.length < 2 || monthBuckets.eth.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const currentMonthKey = monthBuckets.btc[monthBuckets.btc.length - 1].monthKey;
  const btcMatches = monthBuckets.btc.filter((bucket) => bucket.monthKey === currentMonthKey);
  const ethMatches = monthBuckets.eth.filter((bucket) => bucket.monthKey === currentMonthKey);

  if (btcMatches.length < 2 || ethMatches.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const q = btcMatches[btcMatches.length - 1];
  const pq = btcMatches[btcMatches.length - 2];
  const cq = ethMatches[ethMatches.length - 1];
  const cpq = ethMatches[ethMatches.length - 2];

  const bearish = q.hi > pq.hi && cq.hi <= cpq.hi;
  const bullish = q.lo < pq.lo && cq.lo >= cpq.lo;
  const isConflicting = (q.hi > pq.hi && q.lo < pq.lo) && (cq.hi <= cpq.hi && cq.lo >= cpq.lo);

  if (isConflicting) {
    return {
      bearish: false,
      bullish: false,
      timeframe: '1W',
      details: {
        skipped: true,
        reason: 'Both bearish and bullish SSMT detected in same window; disregarded',
        currentDate: formatDateValue(q.lastTimestamp),
        previousDate: formatDateValue(pq.lastTimestamp),
      },
    };
  }

  return {
    bearish,
    bullish,
    timeframe: '1W',
    details: {
      currentDate: formatDateValue(q.lastTimestamp),
      previousDate: formatDateValue(pq.lastTimestamp),
      quarterOfYear: getQuarterOfYear(q.lastTimestamp),
      monthQuarter: getMonthQuarter(q.lastTimestamp),
      weekQuarter: getTradingWeekQuarter(q.lastTimestamp),
      previousWeekQuarter: getTradingWeekQuarter(pq.lastTimestamp),
      quarterSequence: `${getQuarterOfYear(pq.lastTimestamp).replace('Q', '')}-${getTradingWeekQuarter(pq.lastTimestamp).replace('Q', '')} -> ${getQuarterOfYear(q.lastTimestamp).replace('Q', '')}-${getTradingWeekQuarter(q.lastTimestamp).replace('Q', '')}`,
      monthCurrent: currentMonthKey,
      weekCurrent: q.key,
      weekPrevious: pq.key,
      btcCurrentHigh: q.hi,
      btcPrevHigh: pq.hi,
      ethCurrentHigh: cq.hi,
      ethPrevHigh: cpq.hi,
      btcCurrentLow: q.lo,
      btcPrevLow: pq.lo,
      ethCurrentLow: cq.lo,
      ethPrevLow: cpq.lo,
    },
  };
}

function detectDailySSMT({ btcHigh, btcLow, ethHigh, ethLow, timestamps = [] }) {
  if (!Array.isArray(btcHigh) || !Array.isArray(btcLow) || !Array.isArray(ethHigh) || !Array.isArray(ethLow)) {
    return { bearish: false, bullish: false, details: null };
  }

  if (btcHigh.length < 2 || btcLow.length < 2 || ethHigh.length < 2 || ethLow.length < 2) {
    return { bearish: false, bullish: false, details: null };
  }

  const currentTs = timestamps[timestamps.length - 1];
  const previousTs = timestamps[timestamps.length - 2];
  const currentDay = currentTs ? new Date(currentTs).getUTCDay() : null;
  const previousDay = previousTs ? new Date(previousTs).getUTCDay() : null;

  if (isWeekendDateLike(currentTs) || isWeekendDateLike(previousTs)) {
    return {
      bearish: false,
      bullish: false,
      details: {
        skipped: true,
        reason: 'Weekend dates are not valid for SSMT detection',
        currentDate: currentTs ? new Date(currentTs).toISOString().slice(0, 10) : 'unknown',
        previousDate: previousTs ? new Date(previousTs).toISOString().slice(0, 10) : 'unknown',
      },
    };
  }

  const isValidPair = isValidDailySSMTWindow(currentDay, previousDay);
  if (!isValidPair) {
    return { bearish: false, bullish: false, details: { skipped: true, reason: 'Friday excluded from daily SSMT; only Mon-Thu pairs and Fri->Mon are valid' } };
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
  const isConflicting = bearish && bullish;

  if (isConflicting) {
    return {
      bearish: false,
      bullish: false,
      timeframe: '1D',
      details: {
        skipped: true,
        reason: 'Both bearish and bullish SSMT detected in same window; disregarded',
        currentDate: currentTs ? new Date(currentTs).toISOString().slice(0, 10) : 'unknown',
        previousDate: previousTs ? new Date(previousTs).toISOString().slice(0, 10) : 'unknown',
      },
    };
  }

  return {
    bearish,
    bullish,
    timeframe: '1D',
    details: {
      currentDate: currentTs ? new Date(currentTs).toISOString().slice(0, 10) : 'unknown',
      previousDate: previousTs ? new Date(previousTs).toISOString().slice(0, 10) : 'unknown',
      quarterOfYear: getQuarterOfYear(currentTs),
      weekQuarter: getTradingWeekQuarter(currentTs),
      previousWeekQuarter: getTradingWeekQuarter(previousTs),
      quarterSequence: `${getTradingWeekQuarter(previousTs)} -> ${getTradingWeekQuarter(currentTs)}`,
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

function shouldSuppressSkippedSSMT(reason = '') {
  const normalized = String(reason).toLowerCase();
  return normalized.includes('weekend')
    || normalized.includes('saturday')
    || normalized.includes('sunday')
    || normalized.includes('friday excluded')
    || normalized.includes('thu->fri')
    || (normalized.includes('thursday') && normalized.includes('friday'))
    || normalized.includes('not valid for ssmt detection')
    || normalized.includes('invalid ssmt window');
}

function logSSMTStage(stage, result, currentDate, previousDate, timeframe) {
  const stageName = stage === 'M' ? 'monthly' : stage === 'W' ? 'weekly' : String(stage);

  if (result && result.bearish && result.bullish) {
    const currentDateValue = currentDate || result.details?.currentDate || 'n/a';
    const previousDateValue = previousDate || result.details?.previousDate || 'n/a';
    const currentDay = currentDateValue !== 'n/a' ? getDayName(new Date(currentDateValue).getUTCDay()) : 'unknown';
    const previousDay = previousDateValue !== 'n/a' ? getDayName(new Date(previousDateValue).getUTCDay()) : 'n/a';
    const previousWeekQuarter = previousDateValue !== 'n/a' ? getTradingWeekQuarter(previousDateValue) : 'n/a';
    const currentWeekQuarter = currentDateValue !== 'n/a' ? getTradingWeekQuarter(currentDateValue) : 'n/a';
    const previousYearQuarter = previousDateValue !== 'n/a' ? getQuarterOfYear(previousDateValue) : 'n/a';
    const currentYearQuarter = currentDateValue !== 'n/a' ? getQuarterOfYear(currentDateValue) : 'n/a';
    const previousMonthQuarter = previousDateValue !== 'n/a' ? getMonthQuarter(previousDateValue) : 'n/a';
    const currentMonthQuarter = currentDateValue !== 'n/a' ? getMonthQuarter(currentDateValue) : 'n/a';
    const quarterChain = stage === 'M'
      ? `${previousYearQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`
      : `${previousYearQuarter.replace('Q', '')}-${previousMonthQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentMonthQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`;
    console.log(`[${stageName} SSMT] CAUTION: both bearish and bullish detected; disregarded ${previousDateValue} (${previousDay}) -> ${currentDateValue} (${currentDay}) | timeframe=${timeframe} | quarterChain=${quarterChain} | reason=both bearish and bullish detected in same window`);
    return;
  }

  if (result && result.details && result.details.skipped) {
    const reason = result.details.reason || 'skipped';
    if (shouldSuppressSkippedSSMT(reason)) {
      return;
    }

    const currentDateValue = currentDate || result.details.currentDate || 'n/a';
    const previousDateValue = previousDate || result.details.previousDate || 'n/a';
    const currentDay = currentDateValue !== 'n/a' ? getDayName(new Date(currentDateValue).getUTCDay()) : 'unknown';
    const previousDay = previousDateValue !== 'n/a' ? getDayName(new Date(previousDateValue).getUTCDay()) : 'n/a';
    const previousWeekQuarter = previousDateValue !== 'n/a' ? getTradingWeekQuarter(previousDateValue) : 'n/a';
    const currentWeekQuarter = currentDateValue !== 'n/a' ? getTradingWeekQuarter(currentDateValue) : 'n/a';
    const previousYearQuarter = previousDateValue !== 'n/a' ? getQuarterOfYear(previousDateValue) : 'n/a';
    const currentYearQuarter = currentDateValue !== 'n/a' ? getQuarterOfYear(currentDateValue) : 'n/a';
    const previousMonthQuarter = previousDateValue !== 'n/a' ? getMonthQuarter(previousDateValue) : 'n/a';
    const currentMonthQuarter = currentDateValue !== 'n/a' ? getMonthQuarter(currentDateValue) : 'n/a';
    const quarterChain = stage === 'M'
      ? `${previousYearQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`
      : `${previousYearQuarter.replace('Q', '')}-${previousMonthQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentMonthQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`;
    console.log(`[${stageName} SSMT] CAUTION: disregarded ${previousDateValue} (${previousDay}) -> ${currentDateValue} (${currentDay}) | timeframe=${timeframe} | quarterChain=${quarterChain} | reason=${reason}`);
    return;
  }

  if (!result || (!result.bearish && !result.bullish)) {
    return;
  }

  const direction = result.bearish ? 'bearish' : 'bullish';
  const currentDay = currentDate ? getDayName(new Date(currentDate).getUTCDay()) : 'unknown';
  const previousDay = previousDate ? getDayName(new Date(previousDate).getUTCDay()) : 'n/a';
  const previousWeekQuarter = previousDate ? getTradingWeekQuarter(previousDate) : 'n/a';
  const currentWeekQuarter = currentDate ? getTradingWeekQuarter(currentDate) : 'n/a';
  const previousYearQuarter = previousDate ? getQuarterOfYear(previousDate) : 'n/a';
  const currentYearQuarter = currentDate ? getQuarterOfYear(currentDate) : 'n/a';
  const previousMonthQuarter = previousDate ? getMonthQuarter(previousDate) : 'n/a';
  const currentMonthQuarter = currentDate ? getMonthQuarter(currentDate) : 'n/a';
  const quarterChain = stage === 'M'
    ? `${previousYearQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`
    : `${previousYearQuarter.replace('Q', '')}-${previousMonthQuarter.replace('Q', '')}-${previousWeekQuarter.replace('Q', '')} -> ${currentYearQuarter.replace('Q', '')}-${currentMonthQuarter.replace('Q', '')}-${currentWeekQuarter.replace('Q', '')}`;

  console.log(`[${stageName} SSMT] ${direction} ${previousDate || 'n/a'} (${previousDay}) -> ${currentDate || 'n/a'} (${currentDay}) | timeframe=${timeframe} | quarterChain=${quarterChain}`);
}

function getStartOfWeek(timestamp) {
  const d = new Date(timestamp);
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}

function getEndOfWeek(timestamp) {
  const start = getStartOfWeek(timestamp);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);
  return end.getTime();
}

function buildWeekBoundedDailySeries({ currentWeeklyTs, dailyTimestamps, btcHigh, btcLow, ethHigh, ethLow }) {
  if (!currentWeeklyTs) return { timestamps: [], btcHigh: [], btcLow: [], ethHigh: [], ethLow: [] };

  const startTs = getStartOfWeek(currentWeeklyTs);
  const endTs = getEndOfWeek(currentWeeklyTs);

  const timestamps = [];
  const btcH = [];
  const btcL = [];
  const ethH = [];
  const ethL = [];

  for (let i = 0; i < dailyTimestamps.length; i++) {
    const ts = dailyTimestamps[i];
    if (ts >= startTs && ts <= endTs) {
      timestamps.push(ts);
      btcH.push(btcHigh[i]);
      btcL.push(btcLow[i]);
      ethH.push(ethHigh[i]);
      ethL.push(ethLow[i]);
    }
  }

  return { timestamps, btcHigh: btcH, btcLow: btcL, ethHigh: ethH, ethLow: ethL };
}

await BTC_DAILY.ready();
await ETH_DAILY.ready();
await BTC_WEEKLY.ready();
await ETH_WEEKLY.ready();

for (let i = 0; i < BTC_WEEKLY.high.length; i++) {
  const candleIndex = BTC_WEEKLY.high.length - i - 1;
  const currentTs = BTC_WEEKLY.openTime?.[candleIndex] ?? BTC_WEEKLY.closeTime?.[candleIndex];
  const previousTs = BTC_WEEKLY.openTime?.[Math.max(0, candleIndex - 1)] ?? BTC_WEEKLY.closeTime?.[Math.max(0, candleIndex - 1)];
  const currentDate = currentTs ? new Date(currentTs).toISOString().slice(0, 10) : 'unknown';
  const previousDate = previousTs ? new Date(previousTs).toISOString().slice(0, 10) : null;

  const rollingMonthlyData = {
    timestamps: BTC_WEEKLY.openTime?.slice(0, BTC_WEEKLY.openTime.length - i) ?? [],
    btcHigh: BTC_WEEKLY.high.slice(0, BTC_WEEKLY.high.length - i),
    btcLow: BTC_WEEKLY.low.slice(0, BTC_WEEKLY.low.length - i),
    ethHigh: ETH_WEEKLY.high.slice(0, ETH_WEEKLY.high.length - i),
    ethLow: ETH_WEEKLY.low.slice(0, ETH_WEEKLY.low.length - i),
  };

  const monthlyResult = detectMonthlySSMT(rollingMonthlyData);
  const shouldPrintMonthlyNotice = !!(
    monthlyResult.bearish ||
    monthlyResult.bullish ||
    (monthlyResult.details && monthlyResult.details.skipped && !shouldSuppressSkippedSSMT(monthlyResult.details.reason || ''))
  );

  if (shouldPrintMonthlyNotice) {
    console.log('=== MONTHLY SSMT ===');
    logSSMTStage('M', monthlyResult, currentDate, previousDate, '1W');
    console.log('----------------------------------------');
  }
}

for (let i = 0; i < BTC_WEEKLY.high.length; i++) {
  const candleIndex = BTC_WEEKLY.high.length - i - 1;
  const currentTs = BTC_WEEKLY.openTime?.[candleIndex] ?? BTC_WEEKLY.closeTime?.[candleIndex];
  const previousTs = BTC_WEEKLY.openTime?.[Math.max(0, candleIndex - 1)] ?? BTC_WEEKLY.closeTime?.[Math.max(0, candleIndex - 1)];
  const currentDate = currentTs ? new Date(currentTs).toISOString().slice(0, 10) : 'unknown';
  const previousDate = previousTs ? new Date(previousTs).toISOString().slice(0, 10) : null;

  const boundedDailySeries = buildWeekBoundedDailySeries({
    currentWeeklyTs: currentTs,
    dailyTimestamps: BTC_DAILY.openTime ?? [],
    btcHigh: BTC_DAILY.high ?? [],
    btcLow: BTC_DAILY.low ?? [],
    ethHigh: ETH_DAILY.high ?? [],
    ethLow: ETH_DAILY.low ?? [],
  });

  if (boundedDailySeries.timestamps.length <= 1) continue;

  for (let j = 1; j < boundedDailySeries.timestamps.length; j++) {
    const boundedData = {
      timestamps: boundedDailySeries.timestamps.slice(Math.max(0, j - 1), j + 1),
      btcHigh: boundedDailySeries.btcHigh.slice(Math.max(0, j - 1), j + 1),
      btcLow: boundedDailySeries.btcLow.slice(Math.max(0, j - 1), j + 1),
      ethHigh: boundedDailySeries.ethHigh.slice(Math.max(0, j - 1), j + 1),
      ethLow: boundedDailySeries.ethLow.slice(Math.max(0, j - 1), j + 1),
    };

    const dailyResult = detectDailySSMT(boundedData);
    if (dailyResult.details && dailyResult.details.skipped) {
      const boundedCurrentDate = new Date(boundedData.timestamps[boundedData.timestamps.length - 1]).toISOString().slice(0, 10);
      const boundedPreviousDate = new Date(boundedData.timestamps[boundedData.timestamps.length - 2]).toISOString().slice(0, 10);
      if (!shouldSuppressSkippedSSMT(dailyResult.details.reason || '')) {
        console.log('=== WEEKLY SSMT ===');
        logSSMTStage('W', dailyResult, boundedCurrentDate, boundedPreviousDate, '1D');
        console.log('----------------------------------------');
      }
    } else if (dailyResult.bearish || dailyResult.bullish) {
      const boundedCurrentDate = new Date(boundedData.timestamps[boundedData.timestamps.length - 1]).toISOString().slice(0, 10);
      const boundedPreviousDate = new Date(boundedData.timestamps[boundedData.timestamps.length - 2]).toISOString().slice(0, 10);
      console.log('=== WEEKLY SSMT ===');
      logSSMTStage('W', dailyResult, boundedCurrentDate, boundedPreviousDate, '1D');
      console.log('----------------------------------------');
    }
  }
}

