# Playwright + TypeScript + Testcontainers (WireMock)

Ten szkielet uruchamia testy E2E na Playwright z mockiem SWAPI w kontenerze **WireMock**.

## Wymagania
- Node.js 18+
- Docker działający lokalnie

## Instalacja
```bash
npm ci
npm run pw:install
```

## Uruchamianie testów
```bash
BASE_URL=http://localhost:3000 npm test
```

## Jak to działa
- `global-setup.ts` startuje kontener WireMock i wystawia API pod `MOCK_SWAPI_BASE`.
- Playwright przechwytuje każde wywołanie `https://swapi.dev/api/**` i przekierowuje do kontenera.
- Mappingi w `tests/mocks/wiremock/mappings` decydują, jaką odpowiedź zwrócić.
- Fixtury są w `__files/`.

Możesz łatwo dodać kolejne mappingi dla nowych scenariuszy.
