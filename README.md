# 2048 Online Game Web App

A browser-based 2048 game built with **Flask, JavaScript, HTML, and CSS**, featuring a modern purple-themed interface. The game allows users to merge tiles to reach the 2048 tile, track their score dynamically, and restart the game with a single click.

---

## Features

* Classic 2048 gameplay: merge tiles to reach 2048.
* Dynamic scoring that updates with each merge.
* Arrow key controls for movement (Left, Right, Up, Down).
* New Game button to restart the game at any time.
* Game Over modal displaying the final score with a restart option.
* Responsive interface with colored tiles based on value.

---

## Technologies Used

* **Backend:** Python, Flask
* **Frontend:** HTML5, CSS3, JavaScript
* **Layout:** CSS Grid for the game board
* **Data Exchange:** JSON between client and server

---

## Installation and Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

2. **Create a virtual environment (optional but recommended)**

```bash
python -m venv venv
source venv/bin/activate    # Linux/macOS
venv\Scripts\activate       # Windows
```

3. **Install dependencies**

```bash
pip install flask
```

4. **Run the application**

```bash
python app1.py
```

5. **Open in browser**

```
http://127.0.0.1:5000/
```

---

## How to Play

1. Use arrow keys to move tiles in four directions.
2. Merge two tiles of the same number to double their value.
3. New tiles spawn randomly after each move.
4. Press the New Game button to restart the game at any time.
5. The game ends when no moves are possible.
6. Current score is shown at the top; final score appears in the Game Over modal.

---

## Customization and Enhancements

* Tile colors can be customized in `style.css`.
* Board size can be increased by updating the grid logic in `app1.py`.
* Mobile swipe support can be implemented for touch devices.
* High-score saving can be added using a backend database (e.g., SQLite).

---

## API Routes

* `GET /board` – Returns the current board and score.
* `POST /move` – Sends a move (`left`, `right`, `up`, `down`) and updates the board.
* `POST /newgame` – Resets the game board and score.

---

## Credits

Inspired by the original 2048 game by Gabriele Cirulli.
Flask integration, user interface, and game logic implemented by Noor Ul Ain Amin and Syeda Maham Fatima.

---

## License

This project is licensed under the MIT License and is free to use, modify, and distribute for personal or educational purposes.

---
