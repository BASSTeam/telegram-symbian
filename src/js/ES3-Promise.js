window.Promise = (function(){
    /**
     * @typedef CustomEventParams
     * @property {Boolean} bubbles
     * @property {Boolean} cancelable
     * @property {any} detail
     */
    /**
     * @constructor
     * @param {String} event
     * @param {CustomEventParams} params
     */
    function CustomEvent(event, params){
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt
    }
    function PromiseReactionJob(stack, getState, setState, value){
        for(var i = 0; i < stack.length; i++){
            var event = CustomEvent('@PromiseReactionJob', {
                detail: {
                    getState: getState,
                    setState: setState,
                    callback: stack[i],
                    val: value
                }
            });
            document.dispatchEvent(event)
        }
    }
    document.addEventListener('@PromiseReactionJob', function(ev){
        if(ev.detail.getState() == 0) ev.detail.setState();
        ev.detail.callback(ev.detail.val);
    });
    /**
     * @constructor
     * @param {Function} asyncFunction
     */
    return function Promise(asyncFunction){
        var state = 0, value, callbackStack = [], errorCallbackStack = [];
        function setDone(){
            state = 1
        }
        function setErr(){
            state = 2
        }
        function getState(){
            return state
        }
        function addCallback(cb){
            callbackStack.push(cb)
        }
        function addErrorCallback(cb){
            errorCallbackStack.push(cb)
        }
        function reject(err){
            value = err;
            PromiseReactionJob(errorCallbackStack, getState, setErr, err)
        }
        try {
            asyncFunction(function(val){
                value = val;
                PromiseReactionJob(callbackStack, getState, setDone, val)
            }, reject)
        } catch(e){
            reject(e)
        }
        var res = {
            then: function(callback){
                if(state == 0) addCallback(callback); else if(state == 1) callback(value);
                return res
            },
            catch: function(callback){
                if(state == 0) addErrorCallback(callback); else if(state == 2) callback(value);
                return res
            }
        };
        return res
    }
})();
