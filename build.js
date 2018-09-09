const {
    compress,
    list,
    mkdir,
} = ((cp, fs) => {
    return {
        compress: {
            js: (target, destination) => {
                cp.spawnSync('node_modules/.bin/uglifyjs', [target, '--support-ie8', '--compress', '--output', destination])
            },
        },
        list: fs.readdirSync,
        mkdir: destination => spawn('mkdir', ['-p', destination]),
    }
})(require('child_process'), require('fs'));

mkdir('framework/www/js');
// Compress JS
list('src/js', (err, files) => 
    files.forEach(file => 
        compress.js(`src/js/${file}`, `framework/www/js/${file}`)
    )
);
