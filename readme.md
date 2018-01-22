# Keyboard Shortest Path in Node.js

The challenge is to find a shortest path on a virtual keyboard (2d array) to spell out a word.

- The input file is:

```
[
    {
        "alphabet":["Q", "W", "E", "R", "T", "Y", "U", "I", "B", "P", "A", "S"],
        "rowLength": 5,
        "startingFocus": "B",
        "word": "BAR"
    },
    {
        "alphabet":["R", "T", "Y", "A", "S", "D", "E", "U", "I", "O", "L"],
        "rowLength": 3,
        "startingFocus": "Y",
        "word": "TILT"
    }
]
```

- The output expected is:
```
[
    {
        "alphabet":["Q", "W", "E", "R", "T", "Y", "U", "I", "B", "P", "A", "S"],
        "rowLength": 5,
        "startingFocus": "B",
        "word": "BAR",
        "distance": 6,
        "path": ["p", "r", "r", "d", "p", "d", "l", "l", "p"]
    },
    {
        "alphabet":["R", "T", "Y", "A", "S", "D", "E", "U", "I", "O", "L"],
        "rowLength": 3,
        "startingFocus": "Y",
        "word": "TILT",
        "distance": 6,
        "path": ["l", "p", "r", "u", "p", "l", "d", "p", "d", "p"]
    }
]
```

## To execute this program

```node index.js```

## To test this program

execute ```npm install```
and ```npm test```