# Rill walkthrough — hero "Systems map" constellation

A short walkthrough of one useful user-facing flow in this project: the
interactive AI constellation (the "Systems map") in the portfolio hero. It
demonstrates a feature and explains how it works. This is a walkthrough only —
no recording has been made.

## Steps

**Feature:** the hero "Systems map" constellation — the interactive node graph on the portfolio homepage.

**Test data** (nodes in the map): AccessGuard, SkillForge, NeuraHeal (pending), AI Code Review (pending), Python & TypeScript, IBM Python 101.

**Start:** run `npm run dev` in the project root, then open the URL it prints (default `http://127.0.0.1:5173`).

1. Load the page. In the hero, right of the headline, is the constellation; a legend below it lists 5 categories: Identity, Now, Projects, Skills, Achievements.
2. Click the node labelled "AccessGuard". Expected: the panel under the map replaces its hint with a "Projects" chip, the title "AccessGuard", the project description, and a "Case study" link; edges touching that node light up.
3. Click "AccessGuard" again, or press "Clear" in the panel. Expected: the selection clears and the panel returns to the hint "Systems map. Select a node …".
4. Keyboard path: press Tab to focus a node (a focus ring appears), press Enter or Space to select it, press Escape to clear. Expected: the same panel behaviour as the mouse.
5. With a node selected, click its "Case study" link. Expected: the URL hash changes to `#cases/accessguard`.

## Expected behavior

- Single-select node map: selecting a node shows its category, title, description, and (when defined) an in-page link; selecting it again, pressing Clear, or pressing Escape deselects it.
- Edges connected to the selected node light up; the panel is announced via `aria-live`.
- Operable by mouse and keyboard (Tab to focus a node, Enter/Space to select, Escape to clear), with visible focus styles.
- Decorative ambient animation is disabled under `prefers-reduced-motion`; the page stays usable either way.

## Missing inputs

- **Public app URL:** none was supplied, so the handoff link carries only `#task=…` and no `&url=` parameter. Add the public app URL in Rill, or paste it as `&url=<encoded-url>` yourself if you want Rill to open the app directly.
- **Localhost note:** this app runs locally (`http://127.0.0.1:5173`). Cloud runs cannot reach localhost or private apps. For this target, either record it manually at the manual-recording link below, or use the existing-browser-agent guide.
- **Assets referenced by the flow but not part of it:** the portrait (`public/portrait/sathvika-sketch.png`) and resume PDF (`public/resume/sathvika-gudise-resume.pdf`) are still missing and are unrelated to this walkthrough.

## Handoff link

[Open your walkthrough in Rill](https://userill.dev/freebuff?utm_source=freebuff&utm_medium=paid&utm_campaign=rill&utm_content=text-ad&bfcid=bfc_1.eyJpZCI6IjRjNTU5NWIzLTlhMWYtNGM0ZC04Mjg1LWM0NWViNjA5NGUyYyIsImMiOiIxNDQyMTUzOS1kYjNiLTQ1YzEtYjQ5OC1hYTMxOTFmNDkxYzAiLCJrIjoiNDU4ODZlNWEtYzkyZC00ZDUxLTg1ZjgtYzc4YTRmMTY3ZWYwIiwiaWF0IjoxNzkxNzA5NTQyfQ.ENneC66VznJPqRrd4THhaaZjCicGVqDA5ecCvTFjn6Y#task=Feature%3A%20the%20hero%20%22Systems%20map%22%20constellation%20%E2%80%94%20the%20interactive%20node%20graph%20on%20the%20portfolio%20homepage.%0A%0ATest%20data%20%28nodes%20in%20the%20map%29%3A%20AccessGuard%2C%20SkillForge%2C%20NeuraHeal%20%28pending%29%2C%20AI%20Code%20Review%20%28pending%29%2C%20Python%20%26%20TypeScript%2C%20IBM%20Python%20101.%0A%0AStart%3A%20run%20%60npm%20run%20dev%60%20in%20the%20project%20root%2C%20then%20open%20the%20URL%20it%20prints%20%28default%20http%3A%2F%2F127.0.0.1%3A5173%29.%0A%0A1.%20Load%20the%20page.%20In%20the%20hero%2C%20right%20of%20the%20headline%2C%20is%20the%20constellation%3B%20a%20legend%20below%20it%20lists%205%20categories%3A%20Identity%2C%20Now%2C%20Projects%2C%20Skills%2C%20Achievements.%0A2.%20Click%20the%20node%20labelled%20%22AccessGuard%22.%20Expected%3A%20the%20panel%20under%20the%20map%20replaces%20its%20hint%20with%20a%20%22Projects%22%20chip%2C%20the%20title%20%22AccessGuard%22%2C%20the%20project%20description%2C%20and%20a%20%22Case%20study%22%20link%3B%20edges%20touching%20that%20node%20light%20up.%0A3.%20Click%20%22AccessGuard%22%20again%2C%20or%20press%20%22Clear%22%20in%20the%20panel.%20Expected%3A%20the%20selection%20clears%20and%20the%20panel%20returns%20to%20the%20hint%20%22Systems%20map.%20Select%20a%20node%20%E2%80%A6%22.%0A4.%20Keyboard%20path%3A%20press%20Tab%20to%20focus%20a%20node%20%28a%20focus%20ring%20appears%29%2C%20press%20Enter%20or%20Space%20to%20select%20it%2C%20press%20Escape%20to%20clear.%20Expected%3A%20the%20same%20panel%20behaviour%20as%20the%20mouse.%0A5.%20With%20a%20node%20selected%2C%20click%20its%20%22Case%20study%22%20link.%20Expected%3A%20the%20URL%20hash%20changes%20to%20%23cases%2Faccessguard.%0A%0AExpected%20behaviour%20overall%3A%20a%20single-select%20node%20map%2C%20operable%20by%20mouse%20and%20keyboard%2C%20with%20the%20panel%20announced%20via%20aria-live%3B%20reduced-motion%20disables%20the%20ambient%20animation.)

## If Rill cannot reach the local app

- Manual screen recording: https://userill.dev/record?utm_source=freebuff&utm_medium=paid&utm_campaign=rill
- Recording an existing browser agent: https://userill.dev/docs/agent-quickstart?utm_source=freebuff&utm_medium=paid&utm_campaign=rill

---

Your walkthrough is prepared. No recording has been made yet. In Rill, review the steps, add a public app URL, and choose Sign up to run if you need an account. The walkthrough uses Interact mode. Press Run to start it.
