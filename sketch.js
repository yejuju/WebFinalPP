let clearButton;
let canvas;

let video;
let bodyPose;
let poses = [];
let pose = poses[0];

let faceEmojis = ["⛰️", "🌊", "🌳", "☁️", "⭐", "🐯", "🐍", "🐉", "🐦", "🐟", "🐄", "🐷", "🐶", "👶🏻", "👑", "💰", "🔥", "🌙", "☀️", "🌧️", "🌈"];

let nosePositions = [];

let pg;

function preload() {
    bodyPose = ml5.bodyPose("MoveNet", { flipped: true });
}

function gotPoses(results) {
    poses = results;
}

function setup() {
    canvas = createCanvas(640, 480);
    video = createCapture(VIDEO, { flipped: true });
    video.hide();

    bodyPose.detectStart(video, gotPoses);

    pg = createGraphics(640, 480);
    pg.clear();

    clearButton = createButton("clear");
    clearButton.mousePressed(clearCanvas);
}

function windowResized() {
    createCanvas(640, 480);
}

function clearCanvas() {
    nosePositions = [];
    pg.clear();
}

function draw() {
    image(video, 0, 0);

    let currentPose = null;

    if (poses.length > 0) {
        currentPose = poses[0];

        let kpNose = currentPose.keypoints[0];

        if (kpNose && kpNose.confidence > 0.1) {
            if (frameCount % 1 === 0) { // Slow down the updates
                nosePositions.push({ x: kpNose.x, y: kpNose.y });
            }
        }

        pg.fill(0);
        pg.textSize(215); // Slowed down the movement by fixing text size
        for (let i = 0; i < nosePositions.length; i++) {
            let p = nosePositions[i];
            pg.text(faceEmojis[floor(random(0, faceEmojis.length))], p.x, p.y);
        }
    }

    image(pg, 0, 0);
}
