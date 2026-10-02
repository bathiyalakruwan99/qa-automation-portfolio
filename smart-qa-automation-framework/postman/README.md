# Postman + Newman Workflow

Sanitized Postman collection and environment used for API regression and CI execution against the public **https://reqres.in** demo API.

## Files

- `demo-api.postman_collection.json` — collection with smoke + regression requests and tests
- `demo-api.postman_environment.json` — environment with `baseUrl` and demo variables

## Run locally

```bash
npm install -g newman newman-reporter-htmlextra

newman run demo-api.postman_collection.json \
  -e demo-api.postman_environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export newman-report.html
```

## What is covered

- Health check (`GET /users?page=1`)
- Single user retrieval (`GET /users/{id}`)
- Negative case (`GET /users/99999` → 404)
- Resource creation (`POST /users`)
- Schema-style assertions: response time, status code, response shape

## Notes

- This collection points at a **public demo API**. Do not point it at production systems.
- Use environment files (not committed) for any real credentials.
