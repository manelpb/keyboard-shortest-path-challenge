/**
 * Find the shortest path in the keyboard
 * @param {*} alphabet
 * @param {*} word
 * @param {*} rowLength
 * @param {*} startingFocus
 */
function shortestPath(alphabet, word, rowLength, startingFocus) {
    const keyboard = createKeyboard(alphabet, rowLength, startingFocus);
    const numTotalRows = keyboard.length;

    const arrWord = word.split();
    const path = [];

    let currentFocus = getKeyPosition(startingFocus, keyboard);

    for (let idx = 0; idx < word.length; idx += 1) {
        const letter = word[idx];

        if (letter === currentFocus.key) {
            path.push("p");
        } else {
            currentFocus = walkToDestination(letter, currentFocus, keyboard, rowLength, path);
            path.push("p");
        }
    }

    let distance = path.filter((act) => act !== "p").length;

    return { distance, path };
}

exports.shortestPath = shortestPath;

/**
 * Walk until find a dest key
 * @param {*} letter
 * @param {*} keyboard
 * @param {*} currentFocus
 * @param {*} rowLength
 * @param {*} path
 */
function walkToDestination(letter, currentFocus, keyboard, rowLength, path) {
    if (letter === currentFocus.key) {
        return currentFocus;
    }

    let x = currentFocus.x;
    let y = currentFocus.y;
    const shortestPath = decideShortestPath(letter, currentFocus, keyboard, rowLength);

    // first i'm checking if the dest move is a neighbor key
    // if not, i need to find a way to get there.
    // I basically split the keyboard in 2 horizontally and vertically

    if (shortestPath.isNeighbor) {
        // it's pretty easy when is a neighbor tile
        if (shortestPath.hStep == "left") path.push("l");
        if (shortestPath.hStep == "right") path.push("r");
        if (shortestPath.vStep == "up") path.push("u");
        if (shortestPath.vStep == "down") path.push("d");

        x = shortestPath.nextDestination.x;
        y = shortestPath.nextDestination.y;
    } else {
        let hStep = shortestPath.hStep;
        let vStep = shortestPath.vStep;

        if (hStep === "right" && ((currentFocus.x + 1) > (rowLength-1))) {
            x = 0;
            path.push("r");
        } else if (hStep === "right" && ((currentFocus.x + 1) <= (rowLength-1))) {
            x += 1;
            path.push("r");
        } else if (hStep === "left" && ((currentFocus.x -1) > 0)) {
            x -= 1;
            path.push("l");
        } else if (hStep === "left" && (currentFocus.x -1) < 0) {
            x = keyboard[currentFocus.y].length - 1; // colLength
            path.push("l");
        } else if (hStep === "left" && (currentFocus.x -1) === 0) {
            x -= 1;
            path.push("l");
        }

        if (vStep === "up") {
            if ((currentFocus.y - 1) < 0) {
                const rows = numRowsColumn(currentFocus.x, keyboard);

                if (!keyboard[rows][currentFocus.x]) {
                    // dest column doesn't exist
                    y = keyboard.length - 2;
                } else {
                    y = keyboard.length - 1;
                }
            } else {
                y -= 1;
            }

            path.push("u");
        }
        else if (vStep === "down") {
            path.push("d");
            if ((currentFocus.y + 1) > (keyboard.length - 1)) {
                y = 0;
            } else {
                y += 1;
            }
        }
    }

    const newCurrentLetter = keyboard[y][x];
    const newCurrentFocus = { x, y, key: newCurrentLetter.key };

    return walkToDestination(letter, newCurrentFocus, keyboard, rowLength, path);
}

exports.walkToDestination = walkToDestination;

/**
 * Check if the key is neighbor or try to find the best path to go to
 * @param {*} letter
 * @param {*} currentFocus
 * @param {*} keyboard
 * @param {*} rowLength
 */
function decideShortestPath(letter, currentFocus, keyboard, rowLength) {
    // const path = [];
    const nextFocus = {
        x: -1,
        y: -1,
    };

    const nextDestination = getKeyPosition(letter, keyboard);
    let hStep = null;
    let vStep = null;
    let x = currentFocus.x;
    const midPoint = Math.floor(rowLength / 2);

    const actions = new Actions(currentFocus, nextDestination, keyboard);
    const isNeighbor = actions.isNeighbor();

    if (isNeighbor) {
        if (actions.goUp().go) {
            vStep = "up";
            nextDestination.y = actions.goUp().y;
        }
        else if (actions.goDown().go) {
            vStep = "down";
            nextDestination.y = actions.goDown().y;
        }
        else if (actions.goLeft().go) {
            hStep = "left";
            nextDestination.x = actions.goLeft().x;
        }
        else if (actions.goRight().go) {
            hStep = "right";
            nextDestination.x = actions.goRight().x;
        }
    } else {
        // try to find the best path by splitting the keyboard in 2
        // horizontally and vertically

        // they are on the same row
        if (nextDestination.x < midPoint) {
            if (currentFocus.x > midPoint) {
                hStep = "right";
            } else if (currentFocus.x < midPoint) {
                hStep = "left";
            } else if (currentFocus.x === midPoint) {
                // it doesn't matter, either way
                hStep = "left";
            }
        } else {
            if (currentFocus.y === nextDestination.y) {
                // same row

                if (nextDestination.x > midPoint) {
                    if (currentFocus.x < midPoint) {
                        hStep = "right";
                    }
                } else {
                    if (currentFocus.x < midPoint) {
                        hStep = "right";
                    } else if (currentFocus.x > midPoint && nextDestination.y < midPoint) {
                        hStep = "left";
                    } else if (currentFocus.x === midPoint && nextDestination.x > midPoint) {
                        hStep = "right";
                    }
                }

                if (nextDestination.x >= midPoint) {
                    if (currentFocus.x < nextDestination.x && currentFocus.x < midPoint) {
                        hStep = "left";
                    }
                    else if (currentFocus.x < nextDestination.x && currentFocus.x > midPoint) {
                        hStep = "right";
                    }
                    else if (currentFocus.x > nextDestination.x && currentFocus.x > midPoint) {
                        hStep = "left";
                    }
                } else if (nextDestination.x < midPoint) {
                    if (currentFocus.x > midPoint) {
                        hStep = "left";
                    }
                    else if (currentFocus.x < midPoint && nextDestination.x < currentFocus.x) {
                        hStep = "right";
                    } else if (currentFocus.x < midPoint && nextDestination.x > currentFocus.x) {
                        hStep = "left";
                    }
                }
            } else {
                if (nextDestination.x > midPoint && currentFocus.x === midPoint) {
                    hStep = "right";
                } else if (currentFocus.x > nextDestination.x) {
                    hStep = "left";
                }
            }
        }

        const midPointVert = Math.floor((numRowsColumn(currentFocus.x, keyboard) -1) / 2);

        // i'm not in edges
        if (currentFocus.y > 0 && currentFocus.y < (keyboard.length - 1)) {
            if (nextDestination.y < midPointVert && nextDestination.y > currentFocus.y) {
                vStep = "down";
            } else if (nextDestination.y > currentFocus.y) {
                // checks if i can go down
                if (keyboard[currentFocus.y + 1][x]) {
                    vStep = "down";
                    hStep = null;
                }
            } else if (nextDestination.y < currentFocus.y) {
                vStep = "up";
            }
        } else if (currentFocus.y > nextDestination.y) {
            vStep = "down";

            if (!keyboard[currentFocus.y + 1]) {
                hStep = null;
            }
        }
        else if (currentFocus.y < nextDestination.y && currentFocus.x != midPoint) {
            vStep = "up";
        }
    }

    return { hStep, vStep, isNeighbor, nextDestination };
}

exports.decideShortestPath = decideShortestPath;

/**
 * Number of rows for a column
 * @param {*} column
 * @param {*} keyboard
 */
function numRowsColumn(column, keyboard) {
    let numRows = 0;

    keyboard.forEach((row, idx) => {
        numRows = idx;

        if (!keyboard[idx][column]) {
            return;
        }
    });

    return numRows;
}

/**
 * Get current key position in the keyboard
 * @param {*} key
 * @param {*} keyboard
 */
function getKeyPosition(key, keyboard) {
    let x = -1;
    let y = -1;

    keyboard.forEach((row, idxRow) => {
        row.forEach((column, idxColumn) => {
            if (column.key === key) {
                y = idxRow;
                x = idxColumn;

                // early exit loop, as i already found the key
                return;
            }
        });
    });

    return { x, y, key };
}

exports.getKeyPosition = getKeyPosition;

/**
 * Create the keyboard
 * @param {*} alphabet
 * @param {*} rowLength
 */
function createKeyboard(alphabet, rowLength) {
    const arKeyboard = [[]];
    let x = 0;
    let y = 0;

    const maxY = Math.ceil(alphabet.length / rowLength);
    let idx = 0;

    for (let y = 0; y < maxY; y++) {
        arKeyboard[y] = [];

        for (let x = 0; x < rowLength; x++) {
            const key = alphabet[idx];

            if (key) {
                arKeyboard[y].push({
                    key,
                    x,
                    y,
                });
            }

            idx += 1;
        }
    }

    return arKeyboard;
}

exports.createKeyboard = createKeyboard;

/**
 * Neighbor actions
 * @param {*} currentPosition
 * @param {*} nextPosition
 * @param {*} keyboard
 */
function Actions(currentPosition, nextPosition, keyboard) {
    this.currentPosition = currentPosition;
    this.nextPosition = nextPosition;
    this.keyboard = keyboard;
    this.rowLength = keyboard[currentPosition.y].length;
    this.currentRow = this.keyboard[this.currentPosition.y];

    // calculate the number of rows for current column
    this.colLength = () => {
        let numRows = 0;

        this.keyboard.forEach((row, idx) => {
            numRows = idx;

            if (!this.keyboard[idx][currentPosition.x]) {
                return;
            }
        });

        return numRows;
    }

    this.hasLeftTile = (row) => {
        return row[this.currentPosition.x - 1] !== undefined;
    }

    this.goLeft = () => {
        let go = null;
        let x = null;

        // test left when is corner
        if (!this.hasLeftTile(this.currentRow) && this.currentRow[this.rowLength - 1].key === this.nextPosition.key) {
            go = true;
            x = this.rowLength - 1;
        }
        // test left
        else if (this.hasLeftTile(this.currentRow) && this.currentRow[this.currentPosition.x - 1].key === this.nextPosition.key) {
            go = true;
            x = this.currentPosition.x - 1;
        }

        return { go, x };
    }

    this.hasRightTile = (row) => {
        return row[this.currentPosition.x + 1] !== undefined;
    }

    this.goRight = () => {
        let go = null;
        let x = null;

        // test right when is corner
        if (!this.hasRightTile(this.currentRow) && this.currentRow[0].key === this.nextPosition.key) {
            go = true;
            x = 0;
        }
        // test right
        else if (this.hasRightTile(this.currentRow) && this.currentRow[this.currentPosition.x + 1].key === this.nextPosition.key) {
            go = true;
            x = this.currentPosition.x + 1;
        }

        return { go, x };
    }

    this.hasUpTile = () => {
        return keyboard[this.currentPosition.y - 1] !== undefined;
    }

    this.goUp = () => {
        let go = null;
        let y = null;

        // test up when middle or last row
        if (this.hasUpTile() && this.keyboard[currentPosition.y - 1][this.currentPosition.x].key === this.nextPosition.key) {
            go = true;
            y = currentPosition.y - 1;
        }
        // test up going back 2 rows
        else if (!this.hasUpTile()
                && !this.keyboard[this.colLength()][this.currentPosition.x]
                && this.keyboard[this.colLength() - 1][this.currentPosition.x].key === this.nextPosition.key
        ) {
            go = true;
            y = this.colLength() - 1;
        }
        // test up when first row and opposite row has a column
        else if (!this.hasUpTile()
                 && this.keyboard[this.colLength()][this.currentPosition.x]
                 && this.keyboard[this.colLength()][this.currentPosition.x].key === this.nextPosition.key
        ) {
            go = true;
            y = this.colLength();
        }

        return { go, y };
    }

    this.hasDownTile = () => {
        return this.keyboard[currentPosition.y + 1] !== undefined && this.keyboard[currentPosition.y + 1][this.currentPosition.x] !== undefined;
    }

    this.goDown = () => {
        let go = null;
        let y = null;

        // test up when middle or last row
        if (this.hasDownTile() && this.keyboard[currentPosition.y + 1][this.currentPosition.x].key === this.nextPosition.key) {
            go = true;
            y = currentPosition.y + 1;
        }
        // test up when first row and opposite row doesn't have a column
        else if (!this.hasDownTile()
                 && !this.keyboard[0][this.currentPosition.x] == undefined
                 && this.keyboard[0][this.currentPosition.x].key === this.nextPosition.key
        ) {
            go = true;
            y = 0;
        }
        // test up when first row and opposite row has a column
        else if (!this.hasDownTile()
                 && this.keyboard[0][this.currentPosition.x].key === this.nextPosition.key
        ) {
            go = true;
            y = 0;
        }

        return { go, y };
    }

    this.isNeighbor = () => {
        return this.goUp().go || this.goLeft().go || this.goRight().go || this.goDown().go;
    }
}

exports.Actions = Actions;