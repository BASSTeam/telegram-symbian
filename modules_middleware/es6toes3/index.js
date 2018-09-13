const {
        readFileSync: read,
        writeFileSync: write,
        unlinkSync: rm,
    } = require('fs'), {
        spawnSync: spawn,
    } = require('child_process');

module.exports = input => {
    write(__dirname + '/temp/input/script.js', input, 'utf8');
    spawn(__dirname + '/node_modules/.bin/tsc', {
        cwd: __dirname
    });
    var _ = read(__dirname + '/temp/output/script.js', 'utf8');
    rm(__dirname + '/temp/input/script.js');
    rm(__dirname + '/temp/output/script.js');
    return _
}
