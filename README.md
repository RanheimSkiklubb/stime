# STime - Simple Race Timing System [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

STime is a simple race timing system. It consists of a React/TypeScript-based front end and a Firebase back end.

## Running locally

```bash
cd client
npm start        # dev server at http://localhost:3000
```

Requires a `client/.env` file with the Firebase config for the dev project:

```
REACT_APP_API_KEY=...
REACT_APP_AUTH_DOMAIN=...
REACT_APP_DATABASE_URL=...
REACT_APP_PROJECT_ID=...
REACT_APP_STOREAGE_BUCKET=...
REACT_APP_MESSAGING_SENDER_ID=...
```

## Deploying to dev from a local branch

Build and deploy to `simple-race-timer-dev` (Firebase default project):

```bash
cd client && npm run build && cd ..
firebase deploy --only hosting
```

## CI/CD

| Trigger | Target |
|---|---|
| Push to `master` | Builds and deploys to **dev** (`simple-race-timer-dev`) |
| GitHub Release published | Builds and deploys to **prod** (`simple-race-timer`) |

Workflows are defined in `.github/workflows/deploy.yml`. Each GitHub Environment (`dev`, `prod`) holds its own `FIREBASE_SERVICE_ACCOUNT` secret and Firebase config variables.
