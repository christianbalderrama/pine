// ============================================================
// QUARTERLY THEORY - BIRLESIK INDIKATOR (3 SEVIYE, TEK SCRIPT)
// FXR Charts surumu.
//
// Zaman dilimine gore otomatik olarak dogru seviye devreye girer:
//
//  1) GUNLUK SEVIYE          -> 1sa (60dk) / 90dk
//     Kirmizi gunluk kutu (18:00-18:00), icinde 6 saatlik Q1-Q4,
//     TDO (00:00->gunun sonu), TWO (Pazartesi 18:00->Cuma kapanisi)
//
//  2) 6 SAATLIK SEVIYE       -> 3dk / 5dk / 15dk / 30dk
//     Kirmizi 6 saatlik kutu, icinde 90dk'lik alt-bolumler,
//     TDO, AO/LO/NYO/PMO (2. 90dk acilisi)
//
//  3) 90 DAKIKALIK SEVIYE    -> 1dk / 30sn / 15sn / 5sn / 1sn
//     Kirmizi 90dk'lik kutu, icinde 22.5dk'lik alt-bolumler,
//     TDO, AO/LO/NYO/PMO, TMSO (2. 22.5dk acilisi)
//
// Baska zaman diliminde hicbir sey cizilmez. New York UTC farki tum
// seviyeler arasinda ortak tek bir ayardir.
//
// Cizim ozel: bu indikator plot() kullanmaz, sadece kutu ve cizgi cizer.
// ============================================================

// Isinma: acik bir TDO/TWO cizgisi ve yarim kalmis kutular pencerenin
// basindan once baslamis olabilir. 2000 = platform tavani.
// @maxBarsBack 2000
indicator({ onMainPanel: true, format: 'inherit' });

// ------------------------------------------------------------
// Ayarlar. Anahtar = basligin kendisi (bosluksuz, kucuk harf), bu yuzden
// her baslik benzersiz olmali ve yayinlandiktan sonra degistirilmemeli.
// ------------------------------------------------------------
const nyOffset = input.int('New York UTC Farki (saat)', -4, {
  min: -14, max: 14, step: 1,
  tooltip: 'Yaz saati (DST) donemi -4, Kis saati donemi -5 olarak ayarlayin',
  group: 'Genel',
});

// --- 1) GUNLUK SEVIYE (1sa / 90dk) ---
const G1 = 'Gunluk Seviye (1sa / 90dk)';
const dDayBorderColor = input.color('Gunluk Kutu Cerceve Rengi', color.red, { group: G1, tooltip: 'Sadece cerceve, ic boyanmaz' });
const dBullQColor = input.color('Yukselis (Bullish) 6sa Quarter Rengi', rgba(0, 200, 0, 0.2), { group: G1 });
const dBearQColor = input.color('Dusus (Bearish) 6sa Quarter Rengi', rgba(200, 0, 0, 0.2), { group: G1 });
const dTwoColor = input.color('True Weekly Open (TWO) Rengi', color.blue, { group: G1, tooltip: 'Pazartesi 18:00 acilis, Cuma kapanisinda biter' });
const dTdoColor = input.color('Gunluk TDO Rengi', color.black, { group: G1, tooltip: 'Q2 (00:00) acilis, ayni gun 18:00de biter' });

// --- 2) 6 SAATLIK SEVIYE (3dk / 5dk / 15dk / 30dk) ---
const G2 = '6 Saatlik Seviye (3dk / 5dk / 15dk / 30dk)';
const hQBorderColor = input.color('6 Saatlik Quarter Cerceve Rengi', color.red, { group: G2, tooltip: 'Sadece cerceve, ic boyanmaz' });
const hBullSColor = input.color('Yukselis (Bullish) 90dk Rengi', rgba(0, 200, 0, 0.2), { group: G2 });
const hBearSColor = input.color('Dusus (Bearish) 90dk Rengi', rgba(200, 0, 0, 0.2), { group: G2 });
const hTdoColor = input.color('6sa TDO Rengi', color.black, { group: G2, tooltip: '00:00 acilis, gunun sonunda biter' });
const hSessionColor = input.color('6sa AO / LO / NYO / PMO Rengi', color.red, { group: G2, tooltip: '2. 90dk acilisi, kendi 6 saatlik quarter icinde biter' });

// --- 3) 90 DAKIKALIK SEVIYE (1dk / 30sn / 15sn / 5sn / 1sn) ---
const G3 = '90 Dakikalik Seviye (1dk / 30sn / 15sn / 5sn / 1sn)';
const nQBorderColor = input.color('90 Dakikalik Kutu Cerceve Rengi', color.red, { group: G3, tooltip: 'Sadece cerceve, ic boyanmaz' });
const nBullSColor = input.color('Yukselis (Bullish) 22.5dk Rengi', rgba(0, 200, 0, 0.2), { group: G3 });
const nBearSColor = input.color('Dusus (Bearish) 22.5dk Rengi', rgba(200, 0, 0, 0.2), { group: G3 });
const nTdoColor = input.color('90dk TDO Rengi', color.black, { group: G3, tooltip: '00:00 acilis, gunun sonunda biter' });
const nSessionColor = input.color('90dk AO / LO / NYO / PMO Rengi', color.red, { group: G3, tooltip: '2. 90dk acilisi, kendi 6 saatlik quarter icinde biter' });
const nTmsoColor = input.color('TMSO Rengi', rgba(255, 140, 0, 1), { group: G3, tooltip: '2. 22.5dk acilisi, kendi 90dk kutusu icinde biter' });

const h_sessionLabels = ['AO', 'LO', 'NYO', 'PMO']; // qIdx6h 0,1,2,3
const n_sessionLabels = ['LO', 'NYO', 'PMO', 'AO']; // bigQIdx 0,1,2,3
const n_targetDurationsSec = [1, 5, 15, 30, 60];

// ------------------------------------------------------------
// Mumlar arasi tasinan durum: ust seviyede, tek tek `var`.
// Acik bir cizgi artik (zaman, fiyat) degil, cizimin id'si olarak tutulur:
// her mumda yeni cizgi yaratmak yerine ayni cizgi uzatilir.
// ------------------------------------------------------------
// 1) Gunluk
var d_prevQIdx6h = null;
var d_dayHigh = null;
var d_dayLow = null;
var d_dayStartTime = null;
var d_qHigh = null;
var d_qLow = null;
var d_qStartTime = null;
var d_qOpenPrice = null;
var d_tdoLine = null;
var d_twoLine = null;

// 2) 6 saatlik
var h_prevQIdx6h = null;
var h_prevSubIdx90 = null;
var h_qHigh = null;
var h_qLow = null;
var h_qStartTime = null;
var h_sHigh = null;
var h_sLow = null;
var h_sStartTime = null;
var h_sOpenPrice = null;
var h_tdoLine = null;
var h_soLine = null;
var h_soLabel = null;

// 3) 90 dakikalik
var n_prevIdx90 = null;
var n_prevIdx225 = null;
var n_qHigh = null;
var n_qLow = null;
var n_qStartTime = null;
var n_sHigh = null;
var n_sLow = null;
var n_sStartTime = null;
var n_sOpenPrice = null;
var n_tdoLine = null;
var n_soLine = null;
var n_soLabel = null;
var n_tmsoLine = null;

// ------------------------------------------------------------
// Cizim yardimcilari
// ------------------------------------------------------------
// Acik cizgi: ince, etiketsiz, her mumda uzatilir.
const openLine = (fromTime, price, lineColor) =>
  trendLine.create(fromTime, price, time(0), price, { color: lineColor, width: 1 });
const extendLine = (lineId) => {
  if (lineId !== null) trendLine.update(lineId, { x2: time(0) });
};
// Kapanan cizgi: kalin, etiketli, bitis zamaninda durur.
const closeLine = (lineId, toTime, lineColor, labelText) =>
  trendLine.update(lineId, {
    x2: toTime, width: 2, text: labelText, textColor: lineColor, fontSize: 8,
  });
// Cerceve kutu (dolgu yok) ve yonune gore boyanan dolu kutu.
const borderBox = (fromTime, top, toTime, bottom, boxColor) =>
  rectangle.create(fromTime, top, toTime, bottom, { color: boxColor, width: 1 });
const filledBox = (fromTime, top, toTime, bottom, boxColor) =>
  rectangle.create(fromTime, top, toTime, bottom, { color: boxColor, fillColor: boxColor, width: 1 });

// ------------------------------------------------------------
// Zaman dilimi -> seviye. syminfo.timeframe dakika cinsindendir
// (saniyelik grafikte kesirli: 1sn = 1/60).
// ------------------------------------------------------------
const tfSec = Math.round((syminfo.timeframe || 0) * 60);
const tfMin = tfSec / 60;

const isDailyTF = (tfMin >= 50 && tfMin <= 70) || (tfMin >= 80 && tfMin <= 100);
const isSixHourTF =
  (tfMin >= 2 && tfMin <= 6) ||
  (tfMin >= 10 && tfMin <= 20) ||
  (tfMin >= 25 && tfMin <= 35);
const n_matchedSec = n_targetDurationsSec.find(
  (target) => Math.abs(tfSec - target) <= Math.max(target * 0.2, 0.5),
);
const isNinetyMinTF = n_matchedSec !== undefined;

// Mumun acilis zamani = sinir zamani. (V1'de bu `time(0) - bar genisligi`
// idi; burada time(0) zaten mumun ACILIS zamanidir.)
const boundaryTime = time(0);
const nyMs = boundaryTime + nyOffset * 3600000;
const secondsSinceMidnight = ((Math.floor(nyMs / 1000) % 86400) + 86400) % 86400;
const minutesSinceMidnight = Math.floor(secondsSinceMidnight / 60);

const currentH = high(0);
const currentL = low(0);
const prevClose = close(1); // biten bolumun son mumunun kapanisi

// ============================================================
// 1) GUNLUK SEVIYE - sadece 1sa / 90dk grafikte
// ============================================================
if (isDailyTF) {
  const nyDow = new Date(nyMs).getUTCDay();
  const qIdx6h = Math.floor(((((minutesSinceMidnight - 1080) % 1440) + 1440) % 1440) / 360);

  const isAnyQStart = d_prevQIdx6h !== null && qIdx6h !== d_prevQIdx6h;
  const isQ1 = isAnyQStart && qIdx6h === 0;
  const isQ2 = isAnyQStart && qIdx6h === 1;
  const isGap = boundaryTime - time(1) > 3 * 3600000; // hafta sonu boslugu

  // TWO: hafta sonu boslugunda (Cuma kapanisi) biter.
  if (d_twoLine !== null) {
    if (isGap) {
      closeLine(d_twoLine, time(1), dTwoColor, 'TWO');
      d_twoLine = null;
    } else {
      extendLine(d_twoLine);
    }
  }

  // Gunluk cerceve kutu (18:00 -> 18:00)
  if (isQ1) {
    if (d_dayStartTime !== null) {
      borderBox(d_dayStartTime, d_dayHigh, boundaryTime, d_dayLow, dDayBorderColor);
    }
    d_dayHigh = currentH;
    d_dayLow = currentL;
    d_dayStartTime = boundaryTime;
  } else if (d_dayStartTime !== null) {
    if (currentH > d_dayHigh) d_dayHigh = currentH;
    if (currentL < d_dayLow) d_dayLow = currentL;
  }

  // 6 saatlik quarter kutulari
  if (isAnyQStart) {
    if (d_qStartTime !== null) {
      const qColor = prevClose >= d_qOpenPrice ? dBullQColor : dBearQColor;
      filledBox(d_qStartTime, d_qHigh, boundaryTime, d_qLow, qColor);
    }
    d_qStartTime = boundaryTime;
    d_qOpenPrice = open(0);
    d_qHigh = currentH;
    d_qLow = currentL;
  } else if (d_qStartTime !== null) {
    if (currentH > d_qHigh) d_qHigh = currentH;
    if (currentL < d_qLow) d_qLow = currentL;
  }

  // TDO: Q2 (00:00) acilir, sonraki Q1 (18:00) ile kapanir.
  if (isQ1 && d_tdoLine !== null) {
    closeLine(d_tdoLine, boundaryTime, dTdoColor, 'TDO');
    d_tdoLine = null;
  } else {
    extendLine(d_tdoLine);
  }
  if (isQ2) {
    d_tdoLine = openLine(boundaryTime, open(0), dTdoColor);
  }

  // TWO: Pazartesi 18:00 (Q1) acilir.
  if (nyDow === 1 && isQ1) {
    // 7/24 piyasada bosluk olmaz: oncekini yenisinin basladigi yerde kapat.
    if (d_twoLine !== null) closeLine(d_twoLine, boundaryTime, dTwoColor, 'TWO');
    d_twoLine = openLine(boundaryTime, open(0), dTwoColor);
  }

  d_prevQIdx6h = qIdx6h;
}

// ============================================================
// 2) 6 SAATLIK SEVIYE - sadece 3dk / 5dk / 15dk / 30dk grafikte
// ============================================================
if (isSixHourTF) {
  const qIdx6h = Math.floor(((((minutesSinceMidnight - 1080) % 1440) + 1440) % 1440) / 360);
  const subIdx90 = Math.floor(minutesSinceMidnight / 90);

  const isAnyQStart = h_prevQIdx6h !== null && qIdx6h !== h_prevQIdx6h;
  const isQ1 = isAnyQStart && qIdx6h === 0;
  const isQ2 = isAnyQStart && qIdx6h === 1;
  const isSubStart = h_prevSubIdx90 !== null && subIdx90 !== h_prevSubIdx90;
  const isSecondSubOfQuarter = isSubStart && subIdx90 % 4 === 1;

  // 6 saatlik cerceve kutu
  if (isAnyQStart) {
    if (h_qStartTime !== null) {
      borderBox(h_qStartTime, h_qHigh, boundaryTime, h_qLow, hQBorderColor);
    }
    h_qHigh = currentH;
    h_qLow = currentL;
    h_qStartTime = boundaryTime;
  } else if (h_qStartTime !== null) {
    if (currentH > h_qHigh) h_qHigh = currentH;
    if (currentL < h_qLow) h_qLow = currentL;
  }

  // 90dk alt-bolum kutulari
  if (isSubStart) {
    if (h_sStartTime !== null) {
      const sColor = prevClose >= h_sOpenPrice ? hBullSColor : hBearSColor;
      filledBox(h_sStartTime, h_sHigh, boundaryTime, h_sLow, sColor);
    }
    h_sStartTime = boundaryTime;
    h_sOpenPrice = open(0);
    h_sHigh = currentH;
    h_sLow = currentL;
  } else if (h_sStartTime !== null) {
    if (currentH > h_sHigh) h_sHigh = currentH;
    if (currentL < h_sLow) h_sLow = currentL;
  }

  // TDO
  if (isQ1 && h_tdoLine !== null) {
    closeLine(h_tdoLine, boundaryTime, hTdoColor, 'TDO');
    h_tdoLine = null;
  } else {
    extendLine(h_tdoLine);
  }
  if (isQ2) {
    h_tdoLine = openLine(boundaryTime, open(0), hTdoColor);
  }

  // AO / LO / NYO / PMO: quarter'in 2. 90dk'si acilir, quarter bitince kapanir.
  if (isAnyQStart && h_soLine !== null) {
    closeLine(h_soLine, boundaryTime, hSessionColor, h_soLabel);
    h_soLine = null;
    h_soLabel = null;
  } else {
    extendLine(h_soLine);
  }
  if (isSecondSubOfQuarter) {
    h_soLine = openLine(boundaryTime, open(0), hSessionColor);
    h_soLabel = h_sessionLabels[qIdx6h];
  }

  h_prevQIdx6h = qIdx6h;
  h_prevSubIdx90 = subIdx90;
}

// ============================================================
// 3) 90 DAKIKALIK SEVIYE - sadece 1dk / 30sn / 15sn / 5sn / 1sn grafikte
// ============================================================
if (isNinetyMinTF) {
  const idx90 = Math.floor(secondsSinceMidnight / 5400);
  const idx225 = Math.floor(secondsSinceMidnight / 1350);

  const isQStart = n_prevIdx90 !== null && idx90 !== n_prevIdx90;
  const isSubStart = n_prevIdx225 !== null && idx225 !== n_prevIdx225;

  const bigQIdx = Math.floor(idx90 / 4);
  const isBigQStart = isQStart && idx90 % 4 === 0;
  const isDayStart = isQStart && idx90 === 0;
  const isDayEnd = isQStart && idx90 === 12;
  const isSecondNinety = isQStart && idx90 % 4 === 1;
  const isSecondSub = isSubStart && idx225 % 4 === 1;

  // 90dk cerceve kutu
  if (isQStart) {
    if (n_qStartTime !== null) {
      borderBox(n_qStartTime, n_qHigh, boundaryTime, n_qLow, nQBorderColor);
    }
    n_qHigh = currentH;
    n_qLow = currentL;
    n_qStartTime = boundaryTime;
  } else if (n_qStartTime !== null) {
    if (currentH > n_qHigh) n_qHigh = currentH;
    if (currentL < n_qLow) n_qLow = currentL;
  }

  // 22.5dk alt-bolum kutulari
  if (isSubStart) {
    if (n_sStartTime !== null) {
      const sColor = prevClose >= n_sOpenPrice ? nBullSColor : nBearSColor;
      filledBox(n_sStartTime, n_sHigh, boundaryTime, n_sLow, sColor);
    }
    n_sStartTime = boundaryTime;
    n_sOpenPrice = open(0);
    n_sHigh = currentH;
    n_sLow = currentL;
  } else if (n_sStartTime !== null) {
    if (currentH > n_sHigh) n_sHigh = currentH;
    if (currentL < n_sLow) n_sLow = currentL;
  }

  // TDO: 00:00 acilir, 18:00 (idx90 = 12) ile kapanir.
  if (isDayEnd && n_tdoLine !== null) {
    closeLine(n_tdoLine, boundaryTime, nTdoColor, 'TDO');
    n_tdoLine = null;
  } else {
    extendLine(n_tdoLine);
  }
  if (isDayStart) {
    n_tdoLine = openLine(boundaryTime, open(0), nTdoColor);
  }

  // AO / LO / NYO / PMO: 6 saatin 2. 90dk'si acilir, 6 saat bitince kapanir.
  if (isBigQStart && n_soLine !== null) {
    closeLine(n_soLine, boundaryTime, nSessionColor, n_soLabel);
    n_soLine = null;
    n_soLabel = null;
  } else {
    extendLine(n_soLine);
  }
  if (isSecondNinety) {
    n_soLine = openLine(boundaryTime, open(0), nSessionColor);
    n_soLabel = n_sessionLabels[bigQIdx];
  }

  // TMSO: 90dk'nin 2. 22.5dk'si acilir, 90dk bitince kapanir.
  if (isQStart && n_tmsoLine !== null) {
    closeLine(n_tmsoLine, boundaryTime, nTmsoColor, 'TMSO');
    n_tmsoLine = null;
  } else {
    extendLine(n_tmsoLine);
  }
  if (isSecondSub) {
    n_tmsoLine = openLine(boundaryTime, open(0), nTmsoColor);
  }

  n_prevIdx90 = idx90;
  n_prevIdx225 = idx225;
}
