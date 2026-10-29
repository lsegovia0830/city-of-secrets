# City of Secrets

A playable, satirical multiplayer browser strategy game for 2–6 players. Politicians and business leaders vote on city budgets, make deals, embezzle, and audit one another while trying to keep their city alive.

## Play

Public game: https://city-of-secrets-leslie.rightfawn12.chatgpt.site

1. Open the website, enter a display name, and create a room.
2. Share the six-character code and website with a friend on another device.
3. The friend enters their name and room code, then selects Join room.
4. The host starts once at least two players join. The complete rules are on the page.

Every player privately chooses a budget and action. Choices lock and reveal together. The server resolves all submissions or defaults missing choices after 90 seconds. The host advances after the shared results. After six rounds, highest cash + 2 × reputation − 3 × heat wins. If city trust or treasury reaches zero, everyone loses.

## Architecture

- Dependency-free HTML/CSS/JavaScript frontend, embedded in `worker/index.js`.
- Cloudflare Worker authoritative game API; clients never set scores or balances.
- Cloudflare R2 stores room snapshots. Conditional ETag writes prevent lost updates during simultaneous joins and actions. Conflicting submissions receive HTTP 409 and refresh before retrying.
- Live synchronization polls the authoritative server every second. This is HTTP polling, not WebSockets. It works across separate devices; browser storage only holds the private seat token.
- Private choices and seat tokens are excluded from other players' responses. Room codes are random and six characters long. Same-origin checks reject cross-site browser mutations.
- No dependencies, API keys, paid third-party realtime service, or player accounts required.

## Develop and test

Requires Node.js 22 or newer.

```sh
npm run dev
# Open http://localhost:3000 in two different browser profiles.
npm test
npm run build
npm run validate
```

The development server uses an in-memory R2-compatible adapter. Development rooms disappear when it restarts. Hosted rooms use persistent R2. The tests exercise two-client full games, concurrent joins, duplicate submissions, authorization, stale state rejection, audit ordering, timeout defaults, and city collapse.

## Deployment

Production is deployed through ChatGPT Sites. `.openai/hosting.json` declares the project identity and R2 binding `BUCKET`. The deployment entrypoint is `dist/server/index.js`, built by `scripts/build.sh`. Use the Sites source workflow to push, package, save, and deploy this exact checkout. The public GitHub repository mirrors the application source; GitHub pushes do not automatically deploy to Sites.

For a separate Cloudflare deployment, configure an R2 bucket binding named `BUCKET` and use `worker/index.js` as the Worker module entrypoint.

## MVP limits

- 2–6 players per room; no mid-game joining, bots, spectators, or matchmaking.
- Host must stay to advance rounds. Refresh restores the host's seat in the same browser. Clearing storage or exiting the room removes the saved token; create a new room if that happens.
- Rooms expire after 24 hours without a game mutation. Expired snapshots are retained in R2 until removed by the hosting owner; no automated cleanup is implemented.
- Updates usually appear within a second plus network latency. No presence detection, reconnect seat transfer, or anti-abuse rate limiting yet.
- Rules, role titles, and events are fictional. Roles have equal abilities.

Competition target: October 31, 2026, 11:59 p.m. Pacific.
