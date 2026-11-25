Whether you're building a fan app, a betting model, or a portfolio project for a sports analytics job, the first problem is the same: you need reliable data, and you would rather not pay for it yet. The good news is that 2026 has more good free options than ever, from official-feeling league endpoints to open event data used by professional analysts.

The bad news is that most "free sports API" lists are out of date. Free tiers shrink, keys get retired, and scraping libraries stop working. So we checked every option below on **November 25, 2026**: we visited each provider's pricing or documentation page, and where no key is needed we made a live request to confirm the API still answers.

This guide covers 17 free sports APIs and datasets, grouped by what you are building, with the real free-tier limits, whether you need a key, and the catch for each one.

## Quick Picks: Which Free Sports API Should You Use?

| If you want... | Start with |
|---|---|
| One API for many sports | TheSportsDB or API-SPORTS |
| Football (soccer) scores and tables | football-data.org or OpenLigaDB |
| Professional-grade event data for analysis | StatsBomb Open Data |
| NBA, NFL, MLB, or NHL stats | nba_api, nflverse, the MLB Stats API, or the NHL API |
| College football | CollegeFootballData |
| Formula 1 | OpenF1 or Jolpica F1 |
| Betting odds | OddsPapi or The Odds API |
| Tracking-data analysis in Python | Floodlight |

## 0. OddsPapi

**Category**: Odds feed / betting API
**Best for**: Odds comparison, arbitrage tools, betting analytics, backtesting
**Free plan**: 250 requests per month, pre-game odds, no credit card

OddsPapi aggregates odds from a large set of bookmakers into one interface. Its free plan covers pre-game odds across 60+ sports and includes historical data, and the FAQ notes that historical calls do not use your monthly request quota. That makes it a practical way to backtest a betting model without paying for a data contract first.

![0. OddsPapi](https://cdn.sportsjobs.online/blogposts/images/oddspapi.png)

-   **Access**: Sign up to get an API key.
-   **Free limit**: 250 requests per month across all sports and bookmakers.
-   **Catch**: Live (in-play) odds, player props, and the WebSocket stream are on paid or business plans.

**Website**: [https://oddspapi.io](https://oddspapi.io)

## Multi-Sport APIs

### 1. TheSportsDB

TheSportsDB is still the easiest place to start. It is a community-built database covering leagues from the NFL and NBA to European football and UFC, with team details, players, events, and artwork such as logos and badges.

![1. TheSportsDB](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/6a5d7e28-f55a-4fa1-9655-b693287d504d.jpg)

-   **Access**: No signup. The free key is `123`, used directly in the URL.
-   **Free limit**: 30 requests per minute. Many endpoints are capped on the free key, for example team search is limited to sample results.
-   **Catch**: The old free key `3` has been permanently disabled, so older tutorials no longer work. The V2 API and livescores are for premium supporters (from $9 per month).

Try it:

```
https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal
```

**Website**: [https://www.thesportsdb.com/documentation](https://www.thesportsdb.com/documentation)

### 2. API-SPORTS

API-SPORTS runs a family of sport-specific APIs (API-Football is the best known) with fixtures, live scores, standings, lineups, and player statistics. It is a common choice when you need live data across many competitions behind one consistent design.

![API-SPORTS](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/dab917ed-6aff-4ccd-af30-a1f1dc586dc5.jpg)

-   **Access**: Free registration, no credit card. The key is sent in a request header.
-   **Free limit**: 100 requests per day per API.
-   **Catch**: 100 requests a day disappears quickly with live polling, so cache aggressively. Paid plans start around $19 per month.

**Website**: [https://www.api-football.com/pricing](https://www.api-football.com/pricing)

### 3. BALLDONTLIE

BALLDONTLIE started as a free NBA API and now covers dozens of competitions, including the NFL, MLB, NHL, WNBA, college sports, major European football leagues, tennis, golf, F1, and esports.

-   **Access**: Free signup.
-   **Free limit**: 5 requests per minute on the free endpoints.
-   **Catch**: Paid plans are priced per league ($9.99 per month and up), and the NBA, EuroLeague, and Liga ACB need their own paid subscriptions.

**Website**: [https://www.balldontlie.io/](https://www.balldontlie.io/)

### 4. MySportsFeeds

MySportsFeeds focuses on the four major North American leagues (NFL, NBA, MLB, NHL) with scores, schedules, box scores, and player stats in JSON, XML, or CSV.

![MySportsFeeds](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/9371be75-57af-41aa-b66f-e0c869e04d8e.jpg)

-   **Access**: Free for limited personal or private use if you qualify. You contact them to start.
-   **Free limit**: Not published. Subscriptions include the two most recent seasons by default.
-   **Catch**: Commercial use is paid (from about $25 to $39 CAD per league per month for core, non-live feeds).

**Website**: [https://www.mysportsfeeds.com/](https://www.mysportsfeeds.com/)

## Football (Soccer)

### 5. football-data.org

football-data.org is a clean, well-documented football API and a favorite for score widgets and league tables. Its free plan is "free forever".

![Football-Data.org](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/f4dd2c8f-b37a-4c5c-b3ce-e9d23ff60363.jpg)

-   **Access**: Free registration for an API key.
-   **Free limit**: 10 calls per minute and 12 competitions: Premier League, Championship, La Liga, Bundesliga, Serie A, Ligue 1, Eredivisie, Primeira Liga, Brazil's Série A, the Champions League, the World Cup, and the European Championship.
-   **Catch**: Scores and schedules are delayed on the free plan, with no live scores. Lineups, scorers, and bookings need a paid plan (from €29 per month).

**Website**: [https://www.football-data.org/](https://www.football-data.org/)

### 6. StatsBomb Open Data

If you want to work like a professional football analyst, start here. StatsBomb publishes free event data (every pass, shot, and pressure, with locations), lineups, and 360 freeze-frame data for selected competitions and seasons. It is the dataset behind a large share of public football analytics work.

-   **Access**: No key. Download the JSON files from GitHub (the repository now sits under Hudl, StatsBomb's parent company).
-   **Free limit**: None. It is a static dataset rather than a live API.
-   **Catch**: Coverage is a curated set of competitions, not every match. Credit StatsBomb as the source and use their logo when you publish work.

Try it:

```
https://raw.githubusercontent.com/statsbomb/open-data/master/data/competitions.json
```

**Website**: [https://github.com/statsbomb/open-data](https://github.com/statsbomb/open-data)

Clubs and data companies hire for exactly these skills. See current [football data analyst jobs](https://www.sportsjobs.online/football-data-analyst-jobs) for the tools they ask for.

### 7. Sportmonks (Free Plan)

Sportmonks is a commercial football data provider with a permanent free plan, which is rare at this level of data depth.

![Sportmonks](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/269b4656-a1bc-421d-90ca-ecb9f073eaa7.jpg)

-   **Access**: Free registration for an API token, no credit card.
-   **Free limit**: Two full leagues, the Danish Superliga and the Scottish Premiership, with full data features and no expiry.
-   **Catch**: Other leagues require a paid plan (from €29 per month for five leagues). Their cricket API now offers a 14-day trial rather than a free plan.

**Website**: [https://www.sportmonks.com/football-api/free-plan/](https://www.sportmonks.com/football-api/free-plan/)

### 8. OpenLigaDB

OpenLigaDB is a community project from Germany with free live scores and fixtures for the Bundesliga (all three divisions), the DFB-Pokal, European club competitions, the Premier League, and more.

![OpenLigaDB](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/aea03de5-8a88-4342-aed3-85ea595dee8e.jpg)

-   **Access**: No authentication of any kind.
-   **Free limit**: None published. The data is under the Open Database License (ODbL).
-   **Catch**: Data is entered by the community, and the site is in German (the API itself is simple JSON). The project runs on donations, so be considerate with request volume.

Try it:

```
https://api.openligadb.de/getmatchdata/bl1
```

**Website**: [https://www.openligadb.de/](https://www.openligadb.de/)

## US Leagues and College Sports

### 9. MLB Stats API

The MLB Stats API powers MLB's own sites and returns teams, schedules, live game feeds, and player stats without a key. It is not formally documented, so community projects such as the `MLB-StatsAPI` Python package are the easiest way in.

-   **Access**: No key.
-   **Free limit**: None published.
-   **Catch**: Every response carries MLB's copyright notice and points to MLB's terms, so it suits personal and research projects better than commercial products.

Try it:

```
https://statsapi.mlb.com/api/v1/teams?sportId=1
```

If baseball is your target, browse current [baseball analytics jobs](https://www.sportsjobs.online/baseball-analytics-jobs).

### 10. NHL API

The NHL's public web API (`api-web.nhle.com`) serves standings, schedules, scores, rosters, and player stats as JSON, with no key.

-   **Access**: No key.
-   **Free limit**: None published.
-   **Catch**: It is undocumented and can change without notice. Community-maintained endpoint lists on GitHub are the best reference.

Try it:

```
https://api-web.nhle.com/v1/standings/now
```

### 11. nba_api (Python)

nba_api is a Python client for the stats behind NBA.com, wrapping more than 130 endpoints: box scores, play-by-play, shot charts, player tracking, and more.

-   **Access**: `pip install nba_api`. No key.
-   **Free limit**: None published, but NBA.com throttles rapid requests. The maintainers suggest pausing about a second between calls.
-   **Catch**: NBA.com does not announce endpoint changes, and the data is subject to NBA.com's terms of use.

**Website**: [https://github.com/swar/nba_api](https://github.com/swar/nba_api)

### 12. nflverse (nflreadpy)

nflverse is the open-source standard for NFL analytics. Its Python package, nflreadpy, loads play-by-play with EPA, player stats, schedules, rosters, snap counts, Next Gen Stats, injuries, contracts, and combine results into DataFrames.

-   **Access**: `pip install nflreadpy`. No key.
-   **Free limit**: None. The data is downloaded as prepared files.
-   **Catch**: The data is licensed CC-BY 4.0 (FTN charting data is CC-BY-SA 4.0), so credit the source when you publish.

```python
import nflreadpy as nfl

pbp = nfl.load_pbp()
```

**Website**: [https://github.com/nflverse/nflreadpy](https://github.com/nflverse/nflreadpy)

### 13. CollegeFootballData

CollegeFootballData (CFBD) covers college football games, team and player stats, advanced metrics, betting lines, and recruiting, and the same key works for college basketball.

-   **Access**: Request a free key with your email, no credit card.
-   **Free limit**: 1,000 calls per month, or 3,000 per month with a .edu or .ac.uk email.
-   **Catch**: Live scoreboard and live play-by-play are on paid Patreon tiers (from $1 per month). Commercial use is allowed.

**Website**: [https://collegefootballdata.com/](https://collegefootballdata.com/)

## Formula 1

### 14. OpenF1

OpenF1 provides detailed F1 data: car telemetry, laps, positions, pit stops, team radio, weather, and race control messages, across 18 endpoints.

-   **Access**: No authentication for historical data.
-   **Free limit**: 3 requests per second and 30 requests per minute, covering every session since the 2023 season.
-   **Catch**: Live data during sessions needs a sponsor plan (€9.90 per month). The data is licensed CC BY-NC-SA 4.0, so it is for non-commercial use.

Try it:

```
https://api.openf1.org/v1/sessions?year=2026&session_type=Race
```

**Website**: [https://openf1.org/](https://openf1.org/)

### 15. Jolpica F1

The original Ergast F1 API was shut down, and Jolpica F1 replaced it with backwards-compatible endpoints. Old Ergast code usually works after changing the base URL. It covers race results, qualifying, standings, drivers, constructors, and circuits back to 1950.

-   **Access**: No key.
-   **Free limit**: Rate-limited (see the project's rate limits guide).
-   **Catch**: Free for non-commercial use under CC BY-NC-SA 4.0. Commercial use needs permission.

Try it:

```
https://api.jolpi.ca/ergast/f1/current/last/results.json
```

**Website**: [https://github.com/jolpica/jolpica-f1](https://github.com/jolpica/jolpica-f1)

## Betting Odds

### 16. The Odds API

The Odds API returns odds from more than 100 bookmakers across the US, UK, EU, and Australia, including moneylines, spreads, totals, outrights, and player props for selected sports.

-   **Access**: Subscribe to the free plan to receive a key by email.
-   **Free limit**: 500 credits per month. One request for one sport, market, and region costs one credit.
-   **Catch**: Historical odds are on paid plans only (from $30 per month).

**Website**: [https://the-odds-api.com/](https://the-odds-api.com/)

## Analysis Tools

### 17. Floodlight

Floodlight is not an API but an open-source Python framework for the step after you get data: parsing and analyzing tracking and event data. It reads formats from Tracab/ChyronHego, the DFL, Kinexon, Opta, Second Spectrum, SkillCorner's open dataset, Sportradar, StatsPerform, and StatsBomb, and gives you one consistent structure to analyze them.

![Floodlight](https://cdn.outrank.so/9fbb6edc-4b4f-42a1-aa84-483c3d8ca9d0/screenshots/2cf785f9-eabf-4526-8fff-dd744caba2c8.jpg)

-   **Access**: `pip install floodlight`. MIT licensed.
-   **Pairs well with**: StatsBomb Open Data and SkillCorner's open tracking data.
-   **Catch**: It assumes Python and some familiarity with tracking data concepts.

**Website**: [https://github.com/floodlight-sports/floodlight](https://github.com/floodlight-sports/floodlight)

## Free Sports API Comparison (November 2026)

| API | Sports | Free limit | Key needed | Best for |
|---|---|---|---|---|
| OddsPapi | 60+ sports (odds) | 250 requests/month | Yes | Odds history and backtesting |
| TheSportsDB | Multi-sport | 30 requests/minute, capped endpoints | No (key `123`) | Quick prototypes, team artwork |
| API-SPORTS | Multi-sport | 100 requests/day per API | Yes | Live scores across many leagues |
| BALLDONTLIE | Multi-sport | 5 requests/minute | Yes | Simple multi-league apps |
| MySportsFeeds | NFL, NBA, MLB, NHL | Personal use if you qualify | Yes | North American league feeds |
| football-data.org | Football | 10 calls/minute, 12 competitions | Yes | Fixtures and tables |
| StatsBomb Open Data | Football | Static dataset | No | Event-level analysis |
| Sportmonks | Football | 2 leagues, no expiry | Yes | Deep data on a budget |
| OpenLigaDB | Football | None published | No | German football, live scores |
| MLB Stats API | Baseball | None published | No | Personal MLB projects |
| NHL API | Hockey | None published | No | Standings, scores, rosters |
| nba_api | Basketball | Throttled | No | NBA stats in Python |
| nflverse | American football | Static files | No | NFL play-by-play and EPA |
| CollegeFootballData | College football and basketball | 1,000 calls/month | Yes | College analytics |
| OpenF1 | Formula 1 | 30 requests/minute | No | Telemetry and lap data |
| Jolpica F1 | Formula 1 | Rate-limited | No | Historical results since 1950 |
| The Odds API | Odds | 500 credits/month | Yes | Current odds and props |
| Floodlight | Team sports (library) | Not applicable | No | Tracking-data analysis |

## What Changed Since the 2025 Version

-   **Removed Sportsipy and the "sports" Python library.** Both projects state they are no longer under active development, and Sports-Reference limits automated traffic (the library's author noted temporary IP blocks above 20 requests per minute).
-   **Removed Sports Open Data.** The site returned an error when we checked.
-   **Removed Entity Sports.** Its free option is now test tokens for a few completed 2017 to 2019 competitions, which is too limited to build on.
-   **Removed SportsAPI360.** We could not confirm a current free plan.
-   **TheSportsDB's free key changed** from `3` to `123`.
-   **Added** StatsBomb Open Data, nba_api, nflverse, the MLB Stats API, the NHL API, CollegeFootballData, OpenF1, Jolpica F1, The Odds API, and BALLDONTLIE.

## How to Choose and Get Started

There is no single best free sports API, only the best fit for your project. Three questions settle most choices:

1.  **Do you need live data?** If yes, check the free tier's rate limit against how often you will poll. API-SPORTS at 100 requests a day suits a daily refresh, not live scores. OpenLigaDB has no key at all.
2.  **Is it commercial?** OpenF1, Jolpica F1, and MLB's data carry non-commercial terms. CollegeFootballData explicitly allows commercial use. Read the license before you launch a product.
3.  **Are you analyzing or building an app?** For analysis and portfolio work, static datasets like StatsBomb Open Data and nflverse are better than rate-limited APIs: you download once and explore freely.

Then shortlist two or three options, make a test call, and build a small end-to-end project before committing.

## Turn Your Project Into a Career

A finished project built on real sports data, such as an expected-goals model on StatsBomb data, an NFL fourth-down tool on nflverse play-by-play, or an F1 tire analysis with OpenF1, is one of the strongest things you can show a hiring manager. Teams, leagues, betting companies, and sports tech firms hire for exactly these skills.

Browse current [sports data analyst jobs](https://www.sportsjobs.online/sports-data-analyst-jobs), see what [sports analytics internships](https://www.sportsjobs.online/sports-analytics-internships) are open, or check [what sports analysts earn](https://www.sportsjobs.online/sports-analytics-salaries). New roles are added daily on [SportsJobs Online](https://www.sportsjobs.online).
