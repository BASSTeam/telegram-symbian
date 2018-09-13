// Native ES3 syntax

// just for tests need to create fake document var if it launched on Node
if(!document && require && require.apply){
    // Node.js
    var document = (function(events){
        var eventEmitter = new events.EventEmitter();
        return {
            createEvent: function(){
                var data = {
                    initCustomEvent: function(name, _, __, detail){
                        data.name = name;
                        data.detail = detail;
                    }
                };
                return data
            },
            dispatchEvent: function(event){
                eventEmitter.emit(event.name, event);
            },
            addEventListener: function(name, listener){
                eventEmitter.on(name, listener);
            }
        }
    })(require('events'));
}
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
///
module.exports = Promise;
