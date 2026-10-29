# City of Secrets: Who Stole the Money?

A satirical multiplayer social-deduction mystery for 2–6 players. City Hall has lost public money. Find the thief before the final hearing—or arrest an innocent and lose the case.

Public URL: https://city-of-secrets-leslie.rightfawn12.chatgpt.site

## Play
1. Enter a name and create a mystery. Share the website and six-character room code.
2. Each friend joins from their own device. Host starts with 2–6 players.
3. In 3–6-player mode, the server randomly assigns one secret Embezzler, one Investigator, and honest Officials. Only your own role is returned to your browser.
4. Each round, privately click a location and lock one action. Actions resolve together. Search, compare private clues, share evidence or lie in chat, and challenge alibis.
5. The Investigator nominates during discussion. A strict majority of all human players approves an arrest. Correct arrest wins for the city; wrong arrest wins for the Embezzler. No arrest after six rounds lets the culprit escape only with at least $30,000 stolen. Otherwise the city wins by protecting the treasury.

Two-player mode is cooperative: both humans investigate three fictional suspects. It deliberately does not assign opposing human roles, which would reveal the opponent by elimination. The host is Investigator and the other human is Official. Both must approve an arrest.

## Evidence and deception
- Finance Office: real unauthorized transfer amount, round, location, and shared credential group. Every badge group has multiple holders.
- Security Room: real visits in one sampled location/round. Concealment hides the culprit's camera entry and leaves a gap.
- Records Room: embarrassing personal expenses, or an unverified planted memo naming a suspect.
- Council Chamber: a real witness observation of a visit.
- Players recognize others who visited their chosen room. Presence is not an action.
- Embezzler abilities: steal $10,000 in Finance/Records; forge a memo in Records; conceal in Security. Forging/concealing do not steal money.
- All players can search or remove their own personal expense file for that round. This does not hide movement.
- Ledger groups and footage do not state a secret role. Combine independent evidence and challenge lies. The complete action trail is unsealed only after the game.

## Architecture and privacy
Preserves the original Cloudflare Worker, R2 snapshot persistence, seat tokens, conditional ETag writes, same-origin mutation checks, and one-second HTTP polling. No client-authoritative game state. Inputs are allowlisted by phase, location, role, and previous submission. Other players' roles, tokens, choices, votes, and private notebooks are not serialized in their responses. Vote counts appear only as submitted/not-submitted until resolution. Chat is escaped as text and limited to 400 characters with a per-seat cooldown.

New rooms use `mystery/` keys and schema 2. Old budget-game rooms cannot be resumed in the redesign; storage is not deleted.

## Develop
Node.js 22+. No dependencies.

```sh
node scripts/embed.mjs # after editing web.html
npm run dev
npm test
npm run build
npm run validate
```

`web.html` is the editable frontend. `scripts/embed.mjs` embeds it into the self-contained `worker/index.js`. Build copies the Worker and hosting manifest into `dist/`. Tests use the original in-memory R2-compatible adapter. Production uses persistent R2 with `BUCKET` binding.

## Timing and limits
Exploration 50 seconds, discussion 60 seconds, arrest votes 35 seconds. All submitted actions or all-ready discussion votes can advance early. Six normal rounds take about 11 minutes. Timers advance on connected-client polling; when no one is connected they resume lazily on the next request. Missing exploration choices become Wait in Council; missing ballots count against approval. A rejected warrant advances the round. Role assignment never depends on the client.

Refresh restores the seat using tab storage; local storage provides same-browser closed-tab fallback. Use separate devices or browser profiles for separate players. Clearing storage/pressing Exit forfeits easy seat recovery. No mid-game joins, host transfer, spectator mode, external matchmaking, automatic expired-object deletion, global anti-abuse rate limit, or disconnect detection. Rooms expire after 24 hours without mutation. Polling typically synchronizes within a second plus network latency. Clue randomness and human bluffing need playtesting for balance; no promise that every short game is solvable from one clue.

## Validation
Eleven automated suites cover 3–6-player role privacy, actual theft evidence, both arrest outcomes, duo mode, role escalation rejection, forgery, six-round timeouts, simultaneous actions, ballot privacy, malformed input, and origin checks. Three browser seats exercised joining, hidden roles, theft, searches, false alibi, clue sharing, nomination, majority vote, and reveal.

See DEVELOPMENT_PLAN.md for competition readiness work. GitHub pushes alone do not deploy Sites; publish the packaged archive with the Sites workflow.
