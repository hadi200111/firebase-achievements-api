# Firebase Achievements API

This Node.js API serves as a mediator between an AMXX plugin (CS 1.6) and Firebase Firestore.

## Setup

1. Install Node.js and npm.
2. Create a Firebase project and generate a service account key.
3. Place the downloaded `serviceAccountKey.json` file in the root directory.
4. Install dependencies:

```bash
npm install
```
5. Run the API:

```bash
npm start
```

6. Test the endpoint:

```bash
curl http://localhost:3000/checkOrCreate/STEAM_0%3A1%3A12345678
```
