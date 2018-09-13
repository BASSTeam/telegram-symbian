const {
    compress,
    list,
    mkdir,
    precompile,
    rm,
} = ((cp, fs, tsconfig, path) => {
    function precompileJS(){
        console.log(`precompileJS called. Compiler: ${precompileJS.compiler}, targetDir: ${precompileJS.targetDir}`);
        console.log(cp.spawnSync(precompileJS.compiler, [], {cwd: precompileJS.targetDir}).stdout.toString())
    }
    precompileJS.targetDir = path.resolve(__dirname, 'build');
    precompileJS.tempDir = path.resolve(precompileJS.targetDir, tsconfig.compilerOptions.outDir);
    precompileJS.compiler = path.resolve(__dirname, 'node_modules/.bin/tsc');
    return {
        compress: {
            js: (target, destination) => {
                cp.spawnSync('node_modules/.bin/uglifyjs', [target, '--support-ie8', '--compress', '--output', destination])
            },
        },
        list: fs.readdirSync,
        mkdir: destination => cp.spawnSync('mkdir', ['-p', destination]),
        precompile: {
            js: precompileJS
        },
        rm: destination => cp.spawnSync('rm', ['-rf', destination]),
    }
})(require('child_process'), require('fs'), require('./build/tsconfig.json'), require('path'));

mkdir('framework/www/js');
mkdir('framework/www/css');
mkdir('framework/www/js/libs');
// Compile and compress JS
precompile.js();
list(precompile.js.tempDir).forEach(file => {
    if(!/\.js$/.test(file)) return;
    console.log(file);
    compress.js(`${precompile.js.tempDir}/${file}`, `framework/www/js/${file}`);
});
rm(precompile.js.tempDir);
// End of JS compilation/compression block
