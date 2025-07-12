const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Simple achievement definitions
const ACHIEVEMENTS_LIST = [
    { title: "First Blood", description: "Get 1 kill", goal: 1 },
    { title: "Killer", description: "Get 10 kills", goal: 10 },
    { title: "Mass Murderer", description: "Get 50 kills", goal: 50 },
    { title: "Survivor", description: "Win 1 round", goal: 1 },
    { title: "Veteran", description: "Win 25 rounds", goal: 25 },
    { title: "Bomber", description: "Plant 1 bomb", goal: 1 },
    { title: "Defuser", description: "Defuse 1 bomb", goal: 1 },
    { title: "Ninja", description: "Kill 3 enemies without dying in a round", goal: 1 },
    { title: "Sharpshooter", description: "Get 3 headshots", goal: 1 },
    { title: "Marathon", description: "Play 10 rounds", goal: 10 },
    { title: "Living On Edge", description: "Survive a round with 1hp", goal: 1 },
    { title: "Unkillable", description: "Kill 15 enemies without dying", goal: 1 },
    { title: "Double HE", description: "Kill 2 enemies with 1 HE grenade", goal: 1 }
];

app.get('/achievements/:steamid', (req, res) => {
    const dataParam = req.query.data;
    
    if (!dataParam) {
        return res.status(400).send("<h2>Missing achievement data</h2>");
    }

    try {
        // Parse the comma-separated achievement progress values
        const progressValues = decodeURIComponent(dataParam).split(',').map(Number);
        
        // Map to achievement objects with progress
        const achievements = ACHIEVEMENTS_LIST.map((ach, i) => ({
            ...ach,
            progress: progressValues[i] || 0
        }));

        // Generate HTML
        let html = `
            <html><head><title>Achievements</title>
            <style>
                body { background-color: #0f1115; color: #eee; font-family: Arial; padding: 10px; }
                .achievement { background: #1c1f24; border-left: 5px solid #444; padding: 12px 16px; margin-bottom: 10px; border-radius: 5px; }
                .unlocked { border-left-color: #00c853; }
                .locked { border-left-color: #c62828; opacity: 0.6; }
                .title { font-weight: bold; font-size: 16px; }
                .description { font-size: 13px; color: #ccc; }
                .progress-bar { background: #333; border-radius: 5px; overflow: hidden; height: 10px; margin-top: 8px; }
                .progress-fill { background: #00e676; height: 100%; width: 0%; transition: width 0.3s ease; }
                .progress-text { font-family: monospace; color: #aaa; font-size: 12px; margin-top: 4px; }
            </style>
            </head><body>
            <h1>Your Achievements</h1>
        `;

        for (const a of achievements) {
            const percent = Math.floor((a.progress / a.goal) * 100);
            const isCompleted = (a.progress >= a.goal);
            const statusClass = isCompleted ? "unlocked" : (percent > 0 ? "" : "locked");

            html += `
                <div class="achievement ${statusClass}">
                    <div class="title">${a.title}</div>
                    <div class="description">${a.description}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width:${percent}%;"></div>
                    </div>
                    ${!isCompleted ? `<div class="progress-text">${a.progress}/${a.goal}</div>` : ''}
                </div>
            `;
        }

        html += `</body></html>`;
        res.send(html);

    } catch (error) {
        console.error(error);
        res.status(500).send("<h2>Error processing achievements</h2>");
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Achievement viewer listening on port ${PORT}`));