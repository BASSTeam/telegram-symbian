const js = require('modules_middleware/jsProcessor');
const { readFileSync: read, writeFileSync: write, readdirSync: list, mkdirSync, statSync: stat } = require('fs');
const del = require('rmrf');
const sass = require('sass');
const buildDir = __dirname + '/_built',
    www = buildDir + '/www';
function mkdir(path){
    try{
        mkdirSync(path)
    } catch(e){
        if(!e.stack.startsWith('Error: EEXIST:')) throw e
    }
}
mkdir(buildDir);
mkdir(www);

// Compile and compress JS
//precompile.js();
console.log('--- Building JS ---');
mkdir(www + '/js');
list(__dirname + '/src/js').forEach(file => {
    if(!/\.js$/.test(file)) return;
    process.stdout.write(`${file}... `);
    write(
        `${www}/js/${file}`,
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
mkdir(www + '/js/lib');
list(__dirname + '/src/js/lib').forEach(lib => {
    process.stdout.write(`${lib}... `);
    var Builder = require(`${__dirname}/src/js/lib/${lib}/build.js`);
    write(
        `${www}/js/lib/${lib}.js`,
        js.compile(
            js.minify(
                Builder()
            )
        ),
        'utf8'
    );
    console.log('OK');
});
console.log('--- Building CSS ---');
mkdir(www + '/css');
list(`${__dirname}/src/css`).forEach(scss => {
    if(!/\.scss/.test(scss)) return;
    var target = scss.slice(0, -4) + 'css';
    process.stdout.write(`${target}... `);
    var res = sass.renderSync({file: `${__dirname}/src/css/${scss}`});
    write(`${www}/css/${target}`, res.css);
    console.log('OK');
});
console.log('--- Compressing ---');
(async zip => {
    write(__dirname + '/app.wgz', await zip(buildDir));
    console.log('--- Done ---');
    del(__dirname + '/_built')
})(require('modules_middleware/zipper'))
//rm(precompile.js.tempDir);
// End of JS compilation/compression block
