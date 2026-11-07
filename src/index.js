import { PineTS, Provider } from 'pinets';

// Initialize with Binance data
const LENGTH = 100;
const BTC = new PineTS(Provider.Binance, 'BTCUSDT', '1h', LENGTH);
const ETH = new PineTS(Provider.Binance, 'ETHUSDT', '1h', LENGTH);


// Load the market data
await BTC.ready();
await ETH.ready();

// Print raw candle highs and lows
console.log("=====BTC=====");
console.log('Highs:', BTC.high);
console.log('Lows:', BTC.low);
console.log("=====ETH=====");
console.log('Highs:', ETH.high);
console.log('Lows:', ETH.low);

for (let i = 0; i < LENGTH; i++) {

  if (i === 2) continue;
  const btcPreviousHigh = BTC.high[BTC.high.length - i - 1];
  const btcPreviousLow = BTC.low[BTC.low.length - i - 1];

  const btcCurrentHigh = BTC.high[BTC.high.length - i];
  const btcCurrentLow = BTC.low[BTC.low.length - i];

  const ethCurrentHigh = ETH.high[ETH.high.length - i];
  const ethCurrentLow = ETH.low[ETH.low.length - i];

  const ethPreviousHigh = ETH.high[ETH.high.length - i - 1];
  const ethPreviousLow = ETH.low[ETH.low.length - i - 1];

  console.log({
    BTC: {
      current: {
        high: btcCurrentHigh,
        low: btcCurrentLow,
        difference: btcCurrentHigh - btcPreviousHigh
      },
      previous: {
        high: btcPreviousHigh,
        low: btcPreviousLow,
        difference: btcPreviousHigh - btcCurrentHigh
      }
    },
    ETH: {
      current: {
        high: ethCurrentHigh,
        low: ethCurrentLow,
        difference: ethCurrentHigh - ethPreviousHigh
      },
      previous: {
        high: ethPreviousHigh,
        low: ethPreviousLow,
        difference: ethPreviousHigh - ethCurrentHigh
      }
    }
  });
}
