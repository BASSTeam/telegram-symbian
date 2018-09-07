window.console = (function(){
    var _ = document.getElementById('console');
    function main(type, message){
        var log = document.createElement('div');
        log.setAttribute('class', type);
        log.innerHTML = message + '';
        _.appendChild(log)
    }
    return {
        log: function(msg){
            main('log', msg)
        },
        warn: function(msg){
            main('warn', msg)
        },
        error: function(msg){
            main('error', msg)
        },
    }
})();
