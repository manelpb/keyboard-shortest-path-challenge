const Lib = require('./lib.js');

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const keyboard = Lib.createKeyboard(alphabet, 3);

const numRows = keyboard.length;
const numColumns = keyboard[0].length;
const numLastColumns = keyboard[2].length;

it('Should create a 3x2 keyboard', () => {
    expect(numColumns).toBe(3);
    expect(numRows).toBe(3);
    expect(numLastColumns).toBe(1);
});

it('Should get position x1 and y0 for key B', () => {
    const currentPosition = Lib.getKeyPosition('B', keyboard);

    expect(currentPosition.x).toBe(1);
    expect(currentPosition.y).toBe(0);
});

it('Should get position x1 and y1 for key E', () => {
    const currentPosition = Lib.getKeyPosition('E', keyboard);

    expect(currentPosition.x).toBe(1);
    expect(currentPosition.y).toBe(1);
});

it('Should go left when current is B and dest is A', () => {
    const current = Lib.getKeyPosition('B', keyboard);
    const next = Lib.getKeyPosition('A', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goLeft().go).toBe(true);
});

it('Should NOT go left when current is A and dest is B', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('B', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goLeft().go).toBe(null);
});

it('Should go to the last column when current is A and dest is C', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('C', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goLeft().go).toBe(true);
});

it('Should go right when current is A and dest is B', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('B', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goRight().go).toBe(true);
});

it('Should NOT go left when current is A and dest is B', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('B', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goLeft().go).toBe(null);
});

it('Should go right when current is C and dest is A', () => {
    const current = Lib.getKeyPosition('C', keyboard);
    const next = Lib.getKeyPosition('A', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goRight().go).toBe(true);
});

it('Should go right when current is A and dest is B', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('B', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goRight().go).toBe(true);
});

it('Should go up when current is D and dest is A', () => {
    const current = Lib.getKeyPosition('D', keyboard);
    const next = Lib.getKeyPosition('A', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goUp().go).toBe(true);
});

it('Should go up when current is A and dest is G', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('G', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goUp().go).toBe(true);
});

it('Should go up/down when current is B and dest is E', () => {
    const current = Lib.getKeyPosition('B', keyboard);
    const next = Lib.getKeyPosition('E', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goUp().go).toBe(true);
    expect(Actions.goDown().go).toBe(true);
});

it('Should go down when current is A and dest is B', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('D', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.goDown().go).toBe(true);
});

it('B is neighboor of A', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('B', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('D is neighboor of A', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('D', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('C is neighboor of A', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('C', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('G is neighboor of A', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('G', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('A is neighboor of B', () => {
    const current = Lib.getKeyPosition('B', keyboard);
    const next = Lib.getKeyPosition('A', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('C is neighboor of B', () => {
    const current = Lib.getKeyPosition('B', keyboard);
    const next = Lib.getKeyPosition('C', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('E is neighboor of B', () => {
    const current = Lib.getKeyPosition('B', keyboard);
    const next = Lib.getKeyPosition('E', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(true);
});

it('E is NOT neighboor of A', () => {
    const current = Lib.getKeyPosition('A', keyboard);
    const next = Lib.getKeyPosition('E', keyboard);
    const Actions = new Lib.Actions(current, next, keyboard);

    expect(Actions.isNeighbor()).toBe(null);
});

it('Find shortest path for TILT - 3 columns', () => {
    const item = {
        "alphabet": ["R", "T", "Y", "A", "S", "D", "E", "U", "I", "O", "L"],
        "rowLength": 3,
        "startingFocus": "Y",
        "word": "TILT"
    };
    const expected = ["l", "p", "r", "u", "p", "l", "d", "p", "d", "p"];

    const out = Lib.shortestPath(item.alphabet, item.word, item.rowLength, item.startingFocus);
    expect(out.distance).toBe(6);
    expect(JSON.stringify(out.path)).toBe(JSON.stringify(expected));
});

it('Find shortest path for BAR - 5 columns', () => {
    const item = {
        "alphabet": ["Q", "W", "E", "R", "T", "Y", "U", "I", "B", "P", "A", "S"],
        "rowLength": 5,
        "startingFocus": "B",
        "word": "BAR"
    };
    const expected = ["p", "r", "r", "d", "p", "d", "l", "l", "p"];

    const out = Lib.shortestPath(item.alphabet, item.word, item.rowLength, item.startingFocus);
    expect(out.distance).toBe(6);
    expect(JSON.stringify(out.path)).toBe(JSON.stringify(expected));
});

it('Find shortest path for BAR - 3 columns', () => {
    const item = {
        "alphabet": ["Q", "W", "E", "R", "T", "Y", "U", "I", "B", "P", "A", "S"],
        "rowLength": 3,
        "startingFocus": "B",
        "word": "BAR"
    };
    const expected = [ 'p', 'd', 'l', 'p', 'd', 'l', 'd', 'p' ];

    const out = Lib.shortestPath(item.alphabet, item.word, item.rowLength, item.startingFocus);
    expect(out.distance).toBe(5);
    expect(JSON.stringify(out.path)).toBe(JSON.stringify(expected));
});

it('Find shortest path for BAR - 3 columns - starting at E', () => {
    const item = {
        "alphabet": ["Q", "W", "E", "R", "T", "Y", "U", "I", "B", "P", "A", "S"],
        "rowLength": 3,
        "startingFocus": "E",
        "word": "BAR"
    };
    const expected = ['u', 'u', 'p', 'd', 'l', 'p', 'd', 'l', 'd', 'p' ];

    const out = Lib.shortestPath(item.alphabet, item.word, item.rowLength, item.startingFocus);
    expect(out.distance).toBe(7);
    expect(JSON.stringify(out.path)).toBe(JSON.stringify(expected));
});
