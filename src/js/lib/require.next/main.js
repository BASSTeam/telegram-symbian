window.require = (() => {
    function _classCallCheck(instance, Constructor){
        if(!(instance instanceof Constructor)){
            throw new TypeError("Cannot call a class as a function")
        }
    }
    const absolutePath = /^(\w+):\/\//,
        __filename = (_ => {
            return `${_[_.length-3]}://${_[_.length-2]}`
        })((new Error('')).stack.split(/(\w+):\/\/(\S+):\d+:\d+/)),
        __dirname = (fname => {
            fname.pop();
            return fname.join('/')
        })(__filename.split('/')),
        Promise = (() => {
/**
 * @from Promise_implementation.js
 */
            return Promise
        })();
    function httpGet(url){
        var xhr = new XMLHttpRequest();
        return new Promise((resolve, reject) => {
            xhr.open('GET', url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState != 4) return;
                if (xhr.status != 200) reject(new Error(`Cannot get requested module from ${url}. Error ${xhr.status}: ${xhr.statusText}`)); else resolve(xhr.responseText);
            };
            xhr.send()
        })
    }
    function require(url){
        return new Promise((resolve, reject) => {
            var dir = url.split('/'),
                baseDir = (this || {}).constructor === String ? `${this}` : __dirname;
            dir.pop(); // removes last element (filename)
            httpGet(absolutePath.test(url) ? url : `${baseDir}/${url}`).then(script => {
                (new Function('return new window.require.internalPromiseAPlus(function(__filename, __dirname) => {' + /*
                    Using   resolve as __filename,
                            reject  as __dirname
                    to prevent implicit transfer
                */`
                    var exports = {},
                        module = {};
                    function require(url){
                        return window.require.call(__dirname, url)
                    }
                    module.exports = exports;
                    (function(require, __filename, __dirname){\n${script}\n})(require, ${JSON.stringify(url)}, ${JSON.stringify(dir.join('/'))}).then(__filename).catch(function(e){
                        console.warn('Eval error [[Need to handle next error]]:');
                        __dirname(e)
                    })
                });`))().then(resolve).catch(reject)
            }).catch(e => {
                console.warn('Download error [[Need to handle next error]]:');
                reject(e)
            })
        })
    }
    require.internalPromiseAPlus = Promise;
    return require;
})();
