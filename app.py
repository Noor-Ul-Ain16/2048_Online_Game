from flask import Flask, render_template, jsonify, request, session
import random

app = Flask(__name__)
app.secret_key = "replace_this_with_a_secret_string_for_vercel"

# ------------------------------
# Game Helper Functions
# ------------------------------

def transpose(grid):
    return [list(row) for row in zip(*grid)]

def add_new_tile(grid):
    empty = [(r, c) for r in range(4) for c in range(4) if grid[r][c] == 0]
    if not empty:
        return grid
    r, c = random.choice(empty)
    grid[r][c] = 2 if random.random() < 0.9 else 4
    return grid

def compress(row):
    new = [i for i in row if i != 0]
    while len(new) < 4:
        new.append(0)
    return new

def merge(row):
    # Returns (merged_row, score_gained)
    gained_score = 0
    for i in range(3):
        if row[i] == row[i+1] and row[i] != 0:
            row[i] *= 2
            gained_score += row[i]
            row[i+1] = 0
    return row, gained_score

def move_left(grid):
    new_grid = []
    total_gained = 0
    for row in grid:
        row = compress(row)
        row, gained = merge(row)
        total_gained += gained
        row = compress(row)
        new_grid.append(row)
    return new_grid, total_gained

def move_right(grid):
    new_grid = []
    total_gained = 0
    for row in grid:
        row = row[::-1]
        row = compress(row)
        row, gained = merge(row)
        total_gained += gained
        row = compress(row)
        new_grid.append(row[::-1])
    return new_grid, total_gained

def move_up(grid):
    grid = transpose(grid)
    grid, gained = move_left(grid)
    grid = transpose(grid)
    return grid, gained

def move_down(grid):
    grid = transpose(grid)
    grid, gained = move_right(grid)
    grid = transpose(grid)
    return grid, gained

def game_over(grid):
    for row in grid:
        if 0 in row:
            return False
    for r in range(4):
        for c in range(3):
            if grid[r][c] == grid[r][c+1]:
                return False
    for r in range(3):
        for c in range(4):
            if grid[r][c] == grid[r+1][c]:
                return False
    return True

# ------------------------------
# Flask Routes (Stateless Sessions)
# ------------------------------

@app.route("/")
def home():
    # Initialize the board in session if it doesn't exist
    session["score"] = 0
    grid = [[0, 0, 0, 0] for _ in range(4)]
    grid = add_new_tile(grid)
    grid = add_new_tile(grid)
    session["grid"] = grid
    return render_template("index.html")

@app.route("/board")
def board():
    if "grid" not in session:
        return new_game()
    return jsonify({"board": session["grid"], "score": session["score"]})

@app.route("/move", methods=["POST"])
def move():
    if "grid" not in session:
        return jsonify({"error": "No active session"}), 400

    grid = session["grid"]
    score = session["score"]
    
    data = request.get_json()
    direction = data["direction"]

    gained = 0
    if direction == "left":
        grid, gained = move_left(grid)
    elif direction == "right":
        grid, gained = move_right(grid)
    elif direction == "up":
        grid, gained = move_up(grid)
    elif direction == "down":
        grid, gained = move_down(grid)

    score += gained
    grid = add_new_tile(grid)
    over = game_over(grid)

    # Save state back to cookie session
    session["grid"] = grid
    session["score"] = score

    return jsonify({
        "board": grid,
        "score": score,
        "game_over": over
    })

@app.route("/newgame", methods=["POST"])
def new_game():
    session["score"] = 0
    grid = [[0, 0, 0, 0] for _ in range(4)]
    grid = add_new_tile(grid)
    grid = add_new_tile(grid)
    session["grid"] = grid
    return jsonify({"board": grid, "score": session["score"]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)