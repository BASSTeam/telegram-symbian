module.exports = () => {
    return require('fs').readFileSync(__dirname + '/console.js', 'utf8')
}
