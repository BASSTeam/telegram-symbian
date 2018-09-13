const Class = require('./tests/class'),
    compile = require('modules_middleware/es6toes3');
console.log(compile(Class.toString()))
