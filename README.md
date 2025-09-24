# SWAPI UI & API tests with Playwright + WireMock (Docker)

End-to-end tests for a tiny SWAPI-driven app. The browser runs via **Playwright** while all calls to `https://swapi.dev/api/**` are **intercepted** and served by a **WireMock** server running in a container. Deterministic data, fast runs, zero third-party flakiness. ✨

> TL;DR  
> - **Docker** starts WireMock.  
> - **Playwright** reroutes `swapi.dev` traffic to the mock.  
> - **Mappings** & **fixtures** live under `tests/mocks/wiremock`.  
> - Run:  
>   ```bash
>   npm ci
>   npm run pw:install
>   BASE_URL=http://localhost:3000 npm test
>   ```

---

## Stack

- [Playwright](https://playwright.dev/) (TypeScript)
- WireMock (mock API server, runs in Docker)
- Node.js 18+  
- Docker Desktop / Engine

---

## Requirements

- **Node.js 18+**
- **Docker** running locally (to spin up WireMock)

---

## Getting started

```bash
# 1) Install deps & browsers
npm ci
npm run pw:install

# 2) Start your app under test locally (so it's available at BASE_URL)
#    e.g. your dev server on http://localhost:3000

# 3) Run tests (this starts WireMock via the Playwright global setup)
BASE_URL=http://localhost:3000 npm test
```

Useful Playwright commands:

```bash
# Headed/UI mode
npx playwright test --ui

# Specific file or grep
npx playwright test tests/ui/ --grep "@smoke"

# Open last HTML report
npx playwright show-report
```

---

## How it works

- **Global setup** (`global-setup.ts`) starts a **WireMock** container and exposes its base URL to tests (e.g. via an env var like `MOCK_SWAPI_BASE`).  
- In tests, **Playwright** intercepts requests to `https://swapi.dev/api/**` and **redirects** them to the mock server.  
- **WireMock mappings** in `tests/mocks/wiremock/mappings` decide which response to return; **fixtures** live in `tests/mocks/wiremock/__files`.

---

## Project structure

```
.
├─ api/                      # helpers for API-level tests
├─ data/                     # static data, payloads, etc.
├─ tests/
│  ├─ mocks/
│  │  └─ wiremock/
│  │     ├─ mappings/       # JSON stub mappings (matchers + responses)
│  │     └─ __files/        # JSON bodies referenced by mappings
│  └─ ...                   # UI/tests specs
├─ ui/                       # page objects, selectors, UI helpers
├─ global-setup.ts
├─ global-teardown.ts
├─ playwright.config.ts
├─ package.json
└─ tsconfig.json
```

---

## Writing / updating mocks

A typical WireMock mapping (saved under `tests/mocks/wiremock/mappings/people_by_name.json`):

```json
{
  "request": {
    "method": "GET",
    "urlPath": "/api/people/",
    "queryParameters": {
      "name": { "equalTo": "Luke Skywalker" }
    }
  },
  "response": {
    "status": 200,
    "headers": { "Content-Type": "application/json" },
    "bodyFileName": "people/luke_skywalker.json"
  }
}
```

And the referenced file in `__files/people/luke_skywalker.json` contains the SWAPI-like payload you expect.

> Tip: use `"urlPath"` for the path part and `"queryParameters"` for filtering; don’t bake the query string into `"url"` unless you really want an exact URL match.

---

## Common pitfalls (and fixes)

### 1) “Request was not matched”
You’ll see an error like:

```
Request was not matched
Closest stub | Request
GET /api/people     | /api/people/?name=Luke%20Skywalker  <<<<< URL does not match
```

**Why it happens:**  
WireMock matches *exactly*. A trailing slash or query string mismatch (`/api/people` vs `/api/people/`) will miss the stub.

**Fixes:**
- Prefer `"urlPath": "/api/people"` (no trailing slash), and match queries under `"queryParameters"`.
- If your app sometimes adds a trailing slash, use `"urlPathPattern": "/api/people/?"`
- For free-form matching, `"urlPattern"` can help (regex).

### 2) Wrong content type
If your app parses JSON but your stub lacks the header, add:
```json
"headers": { "Content-Type": "application/json" }
```

### 3) Negative / error scenarios
WireMock can simulate delays and faults. For example:
```json
"response": {
  "status": 500,
  "fixedDelayMilliseconds": 1200
}
```

---

## Extending the suite

- Add a new endpoint → create a mapping in `mappings/` and a JSON body in `__files/`, then write a spec that hits `https://swapi.dev/api/...` from the UI.  
- Chaos/Resilience → add mappings with timeouts, 4xx/5xx, or malformed payloads to test UI error states.  
- Data variants → duplicate a mapping and toggle via tags (`@positive`, `@negative`, `@smoke`) in your spec names.

---

## Configuration reference

- **`BASE_URL`** – your application under test (e.g., `http://localhost:3000`).  
- **`MOCK_SWAPI_BASE`** – provided by `global-setup.ts` (the WireMock base URL).  
- **`playwright.config.ts`** – registers global setup/teardown and any route interception logic.

---

## Scripts (package.json)

- `npm test` → run the Playwright test suite (headless)  
- `npm run pw:install` → install Playwright browsers  
- `npx playwright show-report` → open the HTML report

---

## Troubleshooting the mock server

- Inspect unmatched requests via the WireMock admin API (`/__admin/requests/unmatched`) when needed.  
- Check the container logs printed by `global-setup.ts` if the mock isn’t reachable.  
- Ensure Docker is running and no port conflicts exist.

---

## Roadmap (nice-to-haves)

- GitHub Actions CI with Playwright report artifact  
- Visual regression baseline (Playwright trace + screenshots)  
- More SWAPI endpoints (films, planets) and error paths  
- Contract tests per endpoint (schema validation)

---

## License

MIT License

Copyright (c) 2025 Anna Sobkowicz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.