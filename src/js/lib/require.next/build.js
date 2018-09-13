const compile = require('modules_middleware/es6toes3'),
    { readFileSync: read } = require('fs');

module.exports = compile(
    read(__dirname + '/main.js', 'utf8')
        .split('/**\n * @from Promise_implementation.js\n */')
        .join(read(__dirname + '/Promise_implementation.js', 'utf8'))
);
