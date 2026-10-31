# frontend

React app (Vite). Its API client is generated from the OpenAPI spec in `docs/`, so it can only call routes that actually exist.

- Talks only to the gateway
- No tokens in `localStorage`
- Strict Content-Security-Policy
