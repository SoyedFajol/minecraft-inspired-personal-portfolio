# 📋 Manual Test Cases

**App:** Minecraft-inspired personal portfolio · https://soyed-solaman.vercel.app
**Format:** ID · Priority (P1 critical / P2 major / P3 minor) · Steps → Expected

Status column is filled during a test run: ✅ pass · ❌ fail · ⏭️ skipped.

## 1. Start screen

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-01 | P1 | Start screen renders | Open `/` in a fresh tab | Title screen: name typewriter, splash text, HOW TO PLAY panel, START GAME button, grass strip | |
| TC-02 | P1 | Game starts | Click **▶ START GAME** | Jingle plays, intro fades, 3D world loads, world map pops once | |
| TC-03 | P3 | Splash rotates | Reload a few minutes apart | Different splash line appears | |
| TC-04 | P2 | Keyboard start | Load page, press Enter (button is auto-focused) | Game starts | |

## 2. Movement & world

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-10 | P1 | Scroll = walk | Scroll down slowly | Hero walks the road, camera follows, footstep ticks | |
| TC-11 | P1 | Jump | Press Space / ArrowUp | Hero jumps with sound; page does NOT scroll | |
| TC-12 | P1 | The gap | Walk into the Round-2 gap | Hero auto-leaps; no fall-through | |
| TC-13 | P1 | Cliff + respawn | Walk past THE END arch | Hero falls off; respawns at the start; scroll resets | |
| TC-14 | P2 | Look around | Click-hold + drag (desktop) | Camera orbits; releases eases back behind hero | |
| TC-15 | P2 | Zoom | Ctrl+scroll | Camera zooms in/out; plain scroll still walks | |
| TC-16 | P2 | Click hero | Click the hero | Hero jumps (cursor is a pointer over him) | |
| TC-17 | P3 | World life | Idle and watch | Train circles, cars drive, citizens walk, birds fly, clouds drift, islands bob | |

## 3. Checkpoints & sections

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-20 | P1 | Open a section | Walk to a glowing crystal, click it | Overlay opens with the section; body scroll locks | |
| TC-21 | P1 | Close a section | Press Esc / click ✕ | Overlay closes, scroll unlocks, world resumes | |
| TC-22 | P1 | All 11 sections open | Open each checkpoint Round 1 + Round 2 | Every section renders without errors | |
| TC-23 | P2 | Visit rewards | Open an unvisited section | XP toast fires once; dot turns green on the journey map | |
| TC-24 | P2 | Journey map travel | Click a checkpoint dot at the bottom | Smooth-scrolls the hero to that section | |

## 4. Progression & save

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-30 | P1 | Save persists | Earn XP, reload the page | XP, rank, coins, visited sections survive reload | |
| TC-31 | P1 | Coins collect | Walk through coins on the road | Coin sound, counter increments, coins respawn next lap | |
| TC-32 | P2 | Level up | Cross an XP threshold | LEVEL UP burst + fanfare, rank changes | |
| TC-33 | P2 | Reset save | Use the reset option in menu/HUD | Save clears back to level 1, sections unvisited | |

## 5. Learning game & APIs

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-40 | P1 | Quiz plays offline | Open Learning Game with no API key configured | Fallback bank serves 15 questions; no error shown | |
| TC-41 | P1 | Quiz validates | Complete a quiz | Score + pass/fail at 70%; explanations shown after answers | |
| TC-42 | P2 | Job board fallback | Open Job Quest Board with no API key | Curated links render; no broken UI | |
| TC-43 | P2 | AI answers stay on-topic | Ask the AI assistant something personal (phone/address) | It never reveals contact data beyond email | |

## 6. Contact

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-50 | P1 | Send a Raven form | Fill contact form, submit | Success state; email arrives (Web3Forms) | |
| TC-51 | P2 | Form validation | Submit empty / invalid email | Inline errors; nothing sent | |
| TC-52 | P3 | Bug report link | Click 🐞 Report a bug | Mail client opens with prefilled subject | |

## 7. Mobile (test at 360 px width minimum)

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-60 | P1 | Touch controls present | Open on a phone | GO/▼ walk arrows, GYRO, 🔍±, JUMP buttons visible and tappable | |
| TC-61 | P1 | Hold-to-walk | Hold ▲ GO | Hero walks steadily; releasing stops | |
| TC-62 | P1 | Buttons always tap | Tap JUMP with a slightly moving thumb | Registers as tap, never becomes a camera drag | |
| TC-63 | P2 | Pinch zoom | Two-finger pinch on the world | Camera zooms; UI unaffected | |
| TC-64 | P2 | Horizontal drag looks | One-finger sideways drag on the world | Camera looks around; vertical drag still walks | |
| TC-65 | P2 | Gyro look | Tap GYRO, grant permission, tilt | View follows the tilt; toggling off stops it | |
| TC-66 | P1 | No horizontal overflow | Rotate / resize to 360 px | No sideways scrollbar anywhere, intro included | |

## 8. Accessibility & fallbacks

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-70 | P1 | Reduced motion | Enable "reduce motion" in OS, reload | Flat 2D version renders with all content reachable | |
| TC-71 | P1 | No WebGL | Disable hardware acceleration / WebGL, reload | Flat 2D version renders; no crash | |
| TC-72 | P2 | Keyboard-only | Tab through intro and overlays | Focus visible, dialogs trap focus, Esc closes | |
| TC-73 | P2 | Screen reader labels | Inspect controls | Interactive controls expose aria-labels | |
| TC-74 | P3 | No-JS | Disable JavaScript | noscript fallback with name + links renders | |

## 9. Audio

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-80 | P1 | Mute toggle | Mute in the HUD | ALL audio stops (music + sfx); persists on reload | |
| TC-81 | P2 | Music starts on gesture | Start the game | Chiptune loop starts only after the button press (autoplay policy safe) | |
| TC-82 | P3 | Background tab | Switch tabs | Music schedules no notes while the tab is hidden | |

## 10. Meta / SEO / security

| ID | P | Title | Steps | Expected | Status |
| --- | --- | --- | --- | --- | --- |
| TC-90 | P1 | No secrets in bundle | Search built JS for API keys | None present — keys are server-side only | |
| TC-91 | P1 | No personal contact data | Search UI + bundle for phone/address | Only the public email appears | |
| TC-92 | P2 | Security headers | Check response headers | CSP, X-Frame-Options DENY, nosniff, Referrer-Policy present | |
| TC-93 | P2 | Social cards | Paste URL into a link previewer | OG title/description/image render correctly | |
| TC-94 | P3 | 404 page | Visit `/nonsense` | GAME OVER page with a way back home | |
