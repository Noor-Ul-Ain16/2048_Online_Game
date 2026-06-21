let boardDiv = document.getElementById("board");
let scoreSpan = document.getElementById("score");

let gameOver = false;
let winShown = false;

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function drawBoard(board) {
    boardDiv.innerHTML = "";
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            const value = board[r][c];

            if (value !== 0) {
                tile.innerText = value;
                tile.classList.add("tile-" + value);

                if (value === 2048 && !winShown) {
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
        })
        .catch(err => console.error("Board Load Error:", err));
}

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
    })
    .catch(err => console.error("Move Error:", err));
}

// Keyboard controls
document.addEventListener("keydown", function (e) {
    let direction = null;
    if (e.key === "ArrowLeft") direction = "left";
    if (e.key === "ArrowRight") direction = "right";
    if (e.key === "ArrowUp") direction = "up";
    if (e.key === "ArrowDown") direction = "down";

    if (direction) {
        e.preventDefault();
        sendMove(direction);
    }
});

// FIXED: Listen to the whole screen so swiping near the edges isn't canceled
document.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;
    const threshold = 30; // Reliable distance swipe check

    if (Math.abs(diffX) < threshold && Math.abs(diffY) < threshold) {
        return; 
    }

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) sendMove("right");
        else sendMove("left");
    } else {
        if (diffY > 0) sendMove("down");
        else sendMove("up");
    }
}

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
        document.getElementById("gameOverBox").style.display = "none";
        document.getElementById("winBox").style.display = "none";
        drawBoard(data.board);
        scoreSpan.innerText = data.score;
    })
    .catch(err => console.error("Reset Error:", err));
}

loadBoard();
