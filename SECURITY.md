# Weather credentials

The weather feature is optional. It requests location only after the user submits
their own OpenWeatherMap key. The key is held only in current-page memory, cleared
from the input immediately, and never stored in localStorage, sessionStorage, a
cookie, or the repository. Refreshing, leaving the page, or turning weather off
clears it. Location and the entered key go directly to the HTTPS OpenWeatherMap
weather endpoint. OpenWeatherMap receives the key in its required query parameter;
the browser's network tools and the provider can see it. Use only your own key.
No shared service credential belongs in this static app.

The former committed key must be treated as exposed. Removing it from current
source does **not** revoke it, remove Git history, or update an existing deployment.
The account owner must revoke it, inspect usage, and issue a replacement if needed
through their provider account. Do not put the replacement into this repository
or a static build environment variable. No key validity check, credential use,
history rewrite, deployment, or remote configuration change was performed here.

Run the offline production-script regression tests with Node 22.x:
`node --test test/weather.test.cjs`. There are no packages to install or build
steps; GitHub Pages serves the tracked HTML/CSS/JavaScript directly.
