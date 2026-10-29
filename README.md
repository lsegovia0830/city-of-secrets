# City of Secrets: Who Stole the Money?

A multiplayer social deduction mystery for 2–6 players. Prosperity City's treasury is disappearing. Search City Hall, compare evidence, argue in council, and arrest the culprit before $20 million vanishes.

**Play:** https://city-of-secrets-leslie.rightfawn12.chatgpt.site

## How to play

1. Enter a nickname and create a private room. Share the six-character room code and website.
2. Friends join from separate devices or browser profiles. Everyone marks Ready, then the host starts.
3. Privately read your assignment: one Embezzler, one Investigator, and up to four innocent officials. Public professions and badge numbers are independent of allegiance.
4. Each of five rounds has exploration, secret actions, evidence discovery, discussion, and accusation. Pick a room, then lock one action. All players can search and chat.
5. Embezzler: steal $5m at Finance or Treasury, cover camera footage once, or plant an explicitly unverified memo instead of stealing. Every theft leaves immutable financial evidence.
6. Investigators and officials: combine finance credential parity, security badge pairs, and contract candidate lists. Search reviews all thefts so far. The Investigator gets one strong forensic signature trace starting in round 3.
7. Share clues or bluff in council chat. Only the Investigator nominates an arrest. The nominee cannot vote. A strict majority of all eligible players is required; ties and missing votes prevent arrest.
8. Correct arrest: innocent team wins. Wrong arrest: Embezzler wins. With no arrest, $20m stolen or surviving round 5 wins for the Embezzler. The fourth theft still grants a final council opportunity.

### Two-player duel

Both opposing roles are public. The mystery is which transaction was fraudulent. Each theft creates three flagged transfers, one fraudulent and two legitimate. Only the diverted $5m reduces the treasury. Search an **Invoice source** room (Mayor, Records, Council) and an **Access source** room (Finance, Security, Treasury) in different rounds. Each gives two transaction candidates; intersect them. Both independent sources for that transaction's round are required before charging. Correct transaction wins for Investigator; wrong transaction wins for Embezzler. No pretend hidden identity.

### Resilience and secrecy

- No accounts required. Same-browser refresh restores the seat via a private locally stored bearer token. Different tabs in the same browser share storage; use separate profiles for independent players.
- Server-owned deadlines progress phases on the next request. Missing visits default to Council; missing actions do nothing. Players can unanimously advance reveal, evidence, and discussion or pass accusation early. No host needed after starting, except for a rematch.
- Roles, clues, actions, hidden truth, tokens, and fraudulent flags are excluded from other players' payloads. Two-player allegiances are intentionally public. Full truth is unsealed only after the game ends.
- R2 conditional ETag writes serialize competing state changes without lost joins or duplicate actions. Round and phase validation rejects stale submissions.
- Optional private character objectives recover embarrassing but innocent receipts. These are side achievements, not alternate victory conditions.

## Run and test

Node.js 22+; no package installation or third-party credentials needed.

```sh
npm run dev
# http://localhost:3000 — use separate browser profiles
npm test
npm run build
npm run validate
```

The local development server uses in-memory R2-compatible storage; restarting clears local rooms. Production uses persistent Cloudflare R2 through ChatGPT Sites. The dependency-free frontend and Worker API are embedded in `worker/index.js`; `scripts/build.sh` emits `dist/server/index.js`. `.openai/hosting.json` preserves the existing project and BUCKET binding. Public GitHub mirrors source; a GitHub push alone does not publish to Sites.

## Validation

Eight automated test groups exercise 2/4/6-client synchronization, private response filtering, valid and invalid arrests, concurrent joins, duplicate action protection, covered thefts, five-round survival, four-theft victory, timeout defaults, restored seats, two-player deduction, forensic traces, and rematch resets. Build and artifact ESM validation pass. Tests use an R2-compatible in-memory adapter; production deployment verification is separate. Browser preview was unavailable because the managed preview URL refused the browser connection.

## Current limits

- Live updates use 1.2-second HTTP polling, not WebSockets. Timers resume on requests rather than scheduled background jobs.
- No bots, spectators, mid-game joins, voice chat, sounds, seat recovery after storage loss, or player removal. Disconnected seats remain and deadlines prevent permanent stalls; their missing votes count against an arrest majority.
- Room snapshots expire logically after 24 hours without mutation; old R2 objects are not automatically deleted. No production-scale load test, matchmaking, or room-creation rate limiter.
- Evidence is structured deduction, not free-form forensic simulation. A forensic trace intentionally offers decisive evidence late in the game. Humor events are cosmetic and cannot overwrite financial truth.
- Original City Hall SVG, CSS map, and badge avatars; no custom animated character artwork. Responsive CSS is implemented; phone hardware testing remains outstanding.

Deadline: October 31, 2026, 11:59 p.m. Pacific.
