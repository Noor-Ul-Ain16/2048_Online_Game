let boardDiv = document.getElementById("board");
let scoreSpan = document.getElementById("score");

let gameOver = false;
let winShown = false;

// Variables to track finger glides
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function drawBoard(board) {
    boardDiv.innerHTML = "";
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            let tile = document.createElement("div");
            tile.classList.add("tile");
            let value = board[r][c];

            if (value != 0) {
                tile.innerText = value;
                tile.classList.add("tile-" + value);

                if (value == 2048 && !winShown) {
                    document.getElementById("winBox").style.display = "flex";
                    winShown = true;
                }
            }
            boardDiv.appendChild(tile);
        }
    }
}

function loadBoard() {
    fetch("/board")
        .then(res => res.json())
        .then(data => {
            drawBoard(data.board);
            scoreSpan.innerText = data.score;
        });
}

// Unified move execution function
function sendMove(direction) {
    if (gameOver) return;

    fetch("/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction: direction })
    })
    .then(res => res.json())
    .then(data => {
        drawBoard(data.board);
        scoreSpan.innerText = data.score;

        if (data.game_over) {
            gameOver = true;
            document.getElementById("gameOverBox").style.display = "flex";
            document.getElementById("finalScore").innerText = data.score;
        }
    });
}

// 1. Keyboard Controls
document.addEventListener("keydown", function (e) {
    let direction = null;
    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowRight") direction = "right";
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";

    if (direction) {
        e.preventDefault(); // Stop page scrolling
        sendMove(direction);
    }
});

// 2. Mobile Touch Controls (Gliding Fingers)
document.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    let diffX = touchEndX - touchStartX;
    let diffY = touchEndY - touchStartY;
    
    let threshold = 40; // Minimum sliding distance in pixels
    let restraint = 100; // Maximum perpendicular divergence allowed

    // Determine if horizontal or vertical swipe
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > threshold && Math.abs(diffY) < restraint) {
            if (diffX > 0) sendMove("right");
            else sendMove("left");
        }
    } else {
        if (Math.abs(diffY) > threshold && Math.abs(diffX) < restraint) {
            if (diffY > 0) sendMove("down");
            else sendMove("up");
        }
    }
}

// Reset Listeners
document.getElementById("restartBtn").addEventListener("click", function () {
    document.getElementById("gameOverBox").style.display = "none";
    resetGame();
});

document.getElementById("continueBtn").addEventListener("click", function () {
    document.getElementById("winBox").style.display = "none";
});

document.getElementById("restartWinBtn").addEventListener("click", function () {
    document.getElementById("winBox").style.display = "none";
    resetGame();
});

document.getElementById("newGameBtn").addEventListener("click", resetGame);

function resetGame() {
    fetch("/newgame", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            gameOver = false;
            winShown = false;
            drawBoard(data.board);
            scoreSpan.innerText = data.score;
        });
}

loadBoard();