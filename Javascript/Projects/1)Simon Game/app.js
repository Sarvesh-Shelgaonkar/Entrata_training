let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "purple"];

let started = false;
let level = 0;
let highscore = 0;

let statusH2 = document.querySelector("#status");
let highScoreH3 = document.querySelector("#high-score");

// Start game on keypress or touch
function startGame() {
    if (!started) {
        started = true;
        levelUp();
    }
}

document.addEventListener("keypress", startGame);
document.addEventListener("touchstart", startGame, { passive: true });

function btnFlash(btn) {
    btn.classList.add("flashBtn");
    setTimeout(function () {
        btn.classList.remove("flashBtn");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(function () {
        btn.classList.remove("userFlash");
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    statusH2.innerText = `Level ${level}`;

    // Pick random color
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`#${randColor}`);
    
    gameSeq.push(randColor);
    setTimeout(() => {
        btnFlash(randBtn);
    }, 500);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length == gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        // Highscore update
        if (level > highscore) {
            highscore = level;
            highScoreH3.innerText = `Highest Score: ${highscore}`;
        }

        statusH2.innerHTML = `Game Over! Score: <b>${level}</b><br>Press any Key to Restart`;
        
        document.body.classList.add("game-over");
        setTimeout(function () {
            document.body.classList.remove("game-over");
        }, 200);

        reset();
    }
}

function btnPress() {
    if (!started) return;
    
    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}
