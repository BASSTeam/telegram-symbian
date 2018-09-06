document.addEventListener('deviceready', function() {
    var log = document.createElement('div');
    log.innerHTML = (window.Promise || null) + '';
    document.body.appendChild(log)
}, false);
