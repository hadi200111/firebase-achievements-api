const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Firebase service account
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const achievementsRef = db.collection('users');

app.get('/checkOrCreate/:steamid', async (req, res) => {
  const steamid = req.params.steamid;

  try {
    const userRef = achievementsRef.doc(steamid).collection('achievements');
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
      return res.status(200).json({ created: false });
    }

    const achievements = [
      { id: 'ACH_KILL1', title: 'First Blood', description: 'Get 1 kill', goal: 1 },
      { id: 'ACH_KILL10', title: 'Killer', description: 'Get 10 kills', goal: 10 },
      { id: 'ACH_KILL50', title: 'Mass Murderer', description: 'Get 50 kills', goal: 50 },
      { id: 'ACH_ROUND1', title: 'Survivor', description: 'Win 1 round', goal: 1 },
      { id: 'ACH_ROUND25', title: 'Veteran', description: 'Win 25 rounds', goal: 25 },
      { id: 'ACH_PLANT', title: 'Bomber', description: 'Plant 1 bomb', goal: 1 },
      { id: 'ACH_DEFUSE', title: 'Defuser', description: 'Defuse 1 bomb', goal: 1 },
      { id: 'ACH_NINJA', title: 'Ninja', description: 'Kill 3 enemies without dying in a round', goal: 1 },
      { id: 'ACH_HEADSHOTS', title: 'Sharpshooter', description: 'Get 3 headshots', goal: 1 },
      { id: 'ACH_ROUNDS_PLAYED', title: 'Marathon', description: 'Play 10 rounds', goal: 1 }
    ];

    const batch = db.batch();
    achievements.forEach((ach) => {
      const docRef = achievementsRef.doc(steamid).collection('achievements').doc(ach.id);
      batch.set(docRef, { ...ach, progress: 0 });
    });

    await batch.commit();

    return res.status(201).json({ created: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal error' });
  }
});

app.get('/achievements/:steamid', async (req, res) => {
  const steamid = req.params.steamid;
  try {
    const snapshot = await achievementsRef.doc(steamid).collection('achievements').get();

    if (snapshot.empty) {
      return res.send("<h2>No achievements found.</h2>");
    }

    let html = `
      <html>
      <head>
        <title>Achievements</title>
        <style>
          body {
            background-color: #0f1115;
            color: #eee;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
          }
          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #00c3ff;
          }
          .achievement {
            background: #1c1f24;
            border-left: 5px solid #444;
            padding: 12px 16px;
            margin-bottom: 10px;
            border-radius: 5px;
            transition: border 0.3s ease;
          }
          .achievement.unlocked {
            border-left-color: #00c853;
          }
          .achievement.locked {
            border-left-color: #c62828;
            opacity: 0.6;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .description {
            font-size: 13px;
            color: #ccc;
          }
          .progress-bar {
            background-color: #333;
            border-radius: 5px;
            overflow: hidden;
            height: 10px;
            margin-top: 8px;
          }
          .progress-fill {
            background-color: #00e676;
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
          }
          .progress-text {
            font-family: monospace;
            color: #aaa;
            font-size: 12px;
            margin-top: 4px;
        }

        </style>
      </head>
      <body>
        <h1>Your Achievements</h1>
    `;

    snapshot.forEach(doc => {
      const a = doc.data();
      const percent = Math.floor((a.progress / a.goal) * 100);
      const statusClass = percent >= 100 ? "unlocked" : (percent > 0 ? "" : "locked");

      html += `
        <div class="achievement ${statusClass}">
          <div class="title">${a.title}</div>
          <div class="description">${a.description}</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${percent}%;"></div>
          </div>
          <div class="progress-text">${a.progress}/${a.goal}</div>
        </div>
      `;
    });

    html += `
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("<h2>Error loading achievements.</h2>");
  }
});



const PORT = 3000;
app.listen(PORT, () => console.log(`Firebase API listening on port ${PORT}`));
