const { readFileSync: read } = require('fs');

module.exports = () => read(__dirname + '/main.js', 'utf8')
    .split('/**\n * @from Promise_implementation.js\n */')
    .join(read(__dirname + '/Promise_implementation.js', 'utf8'))
