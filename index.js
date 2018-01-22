const { shortestPath } = require('./lib');
const fs = require('fs');
const input = JSON.parse(fs.readFileSync("./inputFile.json").toString());
const output = [];

input.forEach((item) => {
    const out = shortestPath(item.alphabet, item.word, item.rowLength, item.startingFocus);
    output.push(Object.assign({}, item, out));
});

console.log(output);

process.exit(1);
