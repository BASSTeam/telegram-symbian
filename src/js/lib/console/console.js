window.console = (() => {
    var _;
    function main(type, message){
        if(!_) _ = document.getElementById('console');
        var log = document.createElement('div');
        log.setAttribute('class', type);
        log.innerHTML = message + '';
        _.appendChild(log)
    }
    return {
        log(msg){
            main('log', msg)
        },
        warn(msg){
            main('warn', msg)
        },
        error(msg){
            main('error', msg)
        },
    }
})();
