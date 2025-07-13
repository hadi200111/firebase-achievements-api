const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.static(__dirname));
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
    { title: "Double HE", description: "Kill 2 enemies with 1 HE grenade", goal: 1 },
    { title: "Wallbang Wizard", description: "Get a kill through a wall", goal: 10 },
    { title: "Pacifist", description: "Win a round without firing your gun", goal: 1 },
    { title: "Support Player", description: "Assist in 50 kills", goal: 50 },
    { title: "Flashbang Friend", description: "Blind 25 enemies with flashbangs", goal: 25 },
    { title: "From the Grave", description: "Kill an enemy with a grenade after dying", goal: 1 }
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
        body { 
            background-color: #0f1115; 
            color: #eee; 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 0;
            font-size: 14px; /* Reduced base font size */
        }
        .header-image {
            width: 100%;
            max-height: 150px; /* Reduced header height */
            object-fit: cover;
        }
        .fake-navbar {
            background-color: #1a1e23;
            padding: 10px 0; /* Reduced padding */
            text-align: center;
            border-bottom: 1px solid #2d333b;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3); /* Softer shadow */
        }
        .fake-navbar h1 {
            color: #fff;
            font-size: 18px; /* Smaller title */
            margin: 0;
            padding: 0;
            text-shadow: 0 0 3px rgba(100,200,255,0.5);
            letter-spacing: 0.5px;
        }
        .container {
            max-width: 800px;
            margin: 10px auto; /* Reduced margin */
            padding: 0 15px;
        }
        .achievement { 
            background: #1c1f24; 
            border-left: 4px solid #444; /* Thinner border */
            padding: 8px 12px; /* Reduced padding */
            margin-bottom: 8px; /* Tighter spacing */
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            gap: 4px; /* Consistent gap between elements */
        }
        .unlocked { border-left-color: #00c853; }
        .locked { border-left-color: #c62828; opacity: 0.8; } /* Less opacity reduction */
        .title { 
            font-weight: bold; 
            font-size: 13px; /* Smaller title */
            line-height: 1.2;
        }
        .description { 
            font-size: 11px; /* Smaller description */
            color: #aaa; /* Lighter gray */
            line-height: 1.2;
        }
        .progress-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 2px;
        }
        .progress-bar { 
            flex-grow: 1;
            background: #333; 
            border-radius: 3px; 
            overflow: hidden; 
            height: 6px; /* Thinner progress bar */ 
        }
        .progress-fill { 
            background: #00e676; 
            height: 100%; 
            width: 0%; 
            transition: width 0.3s ease; 
        }
        .progress-text { 
            font-family: monospace; 
            color: #aaa; 
            font-size: 10px; /* Smaller progress text */
            min-width: 40px;
            text-align: right;
        }
        /* Compact layout for completed achievements */
        .achievement.unlocked .description {
            display: inline; /* Save space */
        }
        .achievement.unlocked .progress-container {
            display: none; /* Hide progress for completed */
        }
    </style>
    </head><body>
    <img src="/background.jpg" class="header-image" alt="Achievements Header">
    <div class="fake-navbar">
        <h1>YOUR ACHIEVEMENTS</h1>
    </div>
    <div class="container">
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