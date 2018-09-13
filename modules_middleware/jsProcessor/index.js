const {
        readFileSync: read,
        writeFileSync: write,
    } = require('fs'), {
        spawnSync: spawn,
    } = require('child_process'), {
        minify,
    } = require('uglify-es');

class ES6_Code extends String{};
class ES3_Code extends String{};
/**
 * @param {ES6_Code} input
 * @return {ES3_Code}
 */
exports.compile = input => {
    write(__dirname + '/temp/input/script.js', input, 'utf8');
    spawn(__dirname + '/node_modules/.bin/tsc', {
        cwd: __dirname
    });
    var _ = read(__dirname + '/temp/output/script.js', 'utf8');
    return _
}
/**
 * @param {ES6_Code} input
 * @return {ES6_Code}
 */
exports.minify = input => {
    const result = minify(input);
    if(result.error) throw result.error;
    return result.code
}
