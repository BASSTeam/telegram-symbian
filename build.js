const {spawnSync: spawn} = require('child_process'), fs = require('fs');
spawn('mkdir', ['-p', 'framework/www/js']);
fs.readdir('src/js', (err, files) => 
    files.forEach(file => 
        spawn("node_modules/.bin/uglifyjs", [`src/js/${file}`,  "--support-ie8", "--compress", "--output", `framework/www/js/${file}`])
    )
)
