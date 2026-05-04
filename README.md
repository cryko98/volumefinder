# Volume Sniper 📊

A real-time Solana memecoin volume spike detector. Automatically identifies trending memecoins with strong volume spikes and displays them in a sleek web interface.

**Live Demo:** https://cryko98.github.io/volumefinder/

## ⚠️ Disclaimer

**This is NOT financial advice.** Memecoin trading is extremely high-risk and highly speculative. Most memecoins will lose 100% of their value. This tool is for educational and research purposes only. Trade at your own risk.

## Features

✅ **Real-time Volume Detection**
- Scans Solana tokens every 30 seconds
- Detects 5-15 minute volume spikes (3x+ multiplier)
- Filters for market cap ≥ $40k (pump.fun graduation)

✅ **Multi-source Data**
- DexScreener API (primary): market data, volume, liquidity
- Birdeye API (optional): transaction history, unique buyer count
- Jupiter API: price verification
- GeckoTerminal API: OHLCV chart data
- Helius RPC (optional): on-chain holder analysis

✅ **Smart Scoring System**
- Volume spike weight: 40%
- Momentum (5m/15m price change): 30%
- Unique buyer count: 20%
- Liquidity: 10%
- Final score: 0-100

✅ **All Criteria Must Be Met**
1. Market cap ≥ $40,000
2. Volume spike ≥ 3x in last 5 minutes
3. Confirmed uptrend (5m AND 15m positive)
4. Buy/sell ratio > 1.2
5. 50+ unique buyers in 15 min
6. Liquidity ≥ $20,000

✅ **Browser Notifications**
- Alert when score ≥ 90
- Optional sound alerts
- Toast notifications for events

✅ **Rich UI**
- Dark theme (Solana colors)
- Card grid with real-time updates
- DexScreener chart embeds
- Quick links: DexScreener, Birdeye, Photon, BullX, Axiom
- One-click copy contract address

## Setup

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation

```bash
git clone git@github.com:cryko98/volumefinder.git
cd volumefinder
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_BIRDEYE_API_KEY=your_key_here
VITE_HELIUS_API_KEY=your_key_here (optional)
VITE_SCAN_INTERVAL_MS=30000
```

**Getting API Keys:**
- **Birdeye**: https://dashboard.birdeye.so/ (free tier)
- **Helius**: https://www.helius.dev/ (optional, for holder analysis)

### Development

```bash
npm run dev
```

Server runs at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## How the Scoring Algorithm Works

Each token is scored 0-100 based on four factors:

### 1. Volume Spike (40% weight)
- **Formula:** Current 5m volume ÷ Average of previous 60 min volumes
- **Threshold:** Must be ≥ 3x
- **Cap:** 10x for scoring (anything above = max points)
- **Example:** If average is $1000 and current is $8000 = 8x spike

### 2. Momentum (30% weight)
- **Formula:** (5m % change + 15m % change) ÷ 2
- **Threshold:** Both 5m AND 15m must be positive
- **Cap:** 100% for scoring
- **Example:** 5m = +15%, 15m = +20% = 17.5% average momentum

### 3. Buyer Count (20% weight)
- **Data source:** Birdeye API transaction analysis
- **Threshold:** Must be ≥ 50 unique buyers in last 15m
- **Scoring:** (buyerCount ÷ 500) × 100 (capped at 100)
- **Purpose:** Filters bundled bot buys (organic activity)

### 4. Liquidity (10% weight)
- **Formula:** (Liquidity in USD ÷ $500,000) × 100
- **Threshold:** Must be ≥ $20,000
- **Purpose:** Avoids honeypots and low-liquidity rugs

### Example Score Calculation

Token meets all criteria:
- Volume spike: 6x → 60 points
- Momentum: 25% → 25 points
- Buyers: 120 → 24 points
- Liquidity: $150k → 30 points

**Final Score:** (60 × 0.4) + (25 × 0.3) + (24 × 0.2) + (30 × 0.1) = 43 points

Score badges:
- 🟢 70-79: Yellow (Good)
- 🟠 80-89: Orange (Very Good)
- 🔴 90+: Red (Hot!)

## API Rate Limits

- **DexScreener**: ~1 req/2 sec (no auth required)
- **Birdeye**: 10 req/sec (free tier)
- **Jupiter**: Generous limits
- **GeckoTerminal**: 5 req/sec (free)

The scanner runs every 30 seconds and respects these limits.

## Troubleshooting

### No tokens showing?
1. Check that DexScreener API is accessible
2. Ensure minimum market cap isn't too high
3. Make sure at least one DEX is selected (Raydium, PumpSwap, Meteora)
4. Try lowering the min score threshold

### Chart embed not showing?
- DexScreener charts may take a few seconds to load
- Some older browsers may have iframe restrictions

### Notifications not working?
1. Allow browser notifications when prompted
2. Check that notifications are enabled in browser settings
3. Ensure Birdeye API key is set if you want buyer count

## Technical Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** TailwindCSS + custom dark theme
- **State:** Zustand
- **Build:** Vite
- **Charts:** Recharts (sparklines)
- **Icons:** Lucide React
- **HTTP:** Axios with retry logic
- **Deployment:** GitHub Pages (auto-deploy on push to main)

## Project Structure

```
src/
├── api/                  # API integrations
│   ├── dexscreener.ts
│   ├── birdeye.ts
│   ├── jupiter.ts
│   ├── geckoterminal.ts
│   └── helius.ts
├── core/                 # Scanning & analysis logic
│   ├── scanner.ts
│   ├── analyzer.ts
│   ├── filters.ts
│   └── cache.ts
├── components/           # React components
│   ├── Header.tsx
│   ├── FilterPanel.tsx
│   ├── TokenCard.tsx
│   ├── ChartEmbed.tsx
│   ├── AlertsPanel.tsx
│   └── ui/
├── store/                # Zustand state management
├── hooks/                # Custom hooks
├── types/                # TypeScript definitions
├── utils/                # Helpers (format, notifications)
└── App.tsx
```

## Performance Notes

- **Client-side scanning:** No backend required, pure client-side processing
- **In-memory cache:** Maintains 60-minute rolling window of token data
- **Efficient filtering:** Pre-filtered at API source, then client-side
- **Lazy loading:** Chart embeds load on demand

## Security Considerations

- ✅ No wallet connections required
- ✅ No private keys stored
- ✅ Read-only API calls only
- ✅ Open source & auditable
- ❌ Never enter API keys in public repos

## Contributing

Found a bug? Have a feature idea? Please open an issue!

## License

MIT

---

**Made with ❤️ for Solana traders**

*Remember: With great speed comes great responsibility. Always DYOR before trading.*
