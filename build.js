const js = require('modules_middleware/jsProcessor');
const { readFileSync: read, writeFileSync: write, readdirSync: list, mkdirSync } = require('fs');
function mkdir(path){
    try{
        mkdirSync(path)
    } catch(e){
        if(!e.stack.startsWith('Error: EEXIST:')) throw e
    }
}

mkdir(__dirname + '/framework/www/js');
mkdir(__dirname + '/framework/www/js/lib');
//mkdir(__dirname + '/framework/www/css');

// Compile and compress JS
//precompile.js();
console.log('--- Building JS ---');
list(__dirname + '/src/js').forEach(file => {
    if(!/\.js$/.test(file)) return;
    process.stdout.write(`${file}... `);
    write(
        `framework/www/js/${file}`,
        js.compile(
            js.minify(
                read(
                    `${__dirname}/src/js/${file}`,
                    'utf8'
                )
            )
        ),
        'utf8'
    );
    console.log('OK');
});
console.log('--- Building JS libs ---');
list(__dirname + '/src/js/lib').forEach(lib => {
    process.stdout.write(`${lib}... `);
    var Builder = require(`${__dirname}/src/js/lib/${lib}/build.js`);
    write(
        `${__dirname}/framework/www/js/lib/${lib}.js`,
        js.compile(
            js.minify(
                Builder()
            )
        ),
        'utf8'
    );
    console.log('OK');
});
console.log('--- Compressing ---');
(async zip => {
    write(__dirname + '/app.wgz', await zip(__dirname + '/framework'));
    console.log('--- Done ---');
})(require('modules_middleware/zipper'))
//rm(precompile.js.tempDir);
// End of JS compilation/compression block
