const {
        readFileSync: read,
        readdirSync: list,
    } = require('fs'),
    partsDir = __dirname + '/parts';

module.exports = () => {
    var res = read(`${partsDir}/phonegap.js.base`, 'utf8');
    list(partsDir).forEach(part => {
        if(!/\.js$/.test(part)) return;
        res += read(`${partsDir}/${part}`, 'utf8');
        if(part == 'camera.js') [
            'com.nokia.device.utility',
            'com.nokia.device.framework',
            's60_camera',
            'com.nokia.device.camera',
        ].forEach(name => res += read(`${partsDir}/camera/${name}.js`, 'utf8'));
    });
    return res
}
