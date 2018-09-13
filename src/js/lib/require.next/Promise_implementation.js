const {
    setState,
    getState,
    registerPromise,
    setVal,
    getVal,
    getCallbackStack,
    getErrorCallbackStack,
} = (() => {
    var _ = { names: [], states: {}, values: {}, callbackStacks: {}, errorCallbackStack: {} };
    return {
        setState(promise, state){
            _.states[promise.__RegisteredPromiseIndex] = state;
            return state;
        },
        getState(promise){
            return _.states[promise.__RegisteredPromiseIndex] || 0;
        },
        registerPromise(promise){
            promise.__RegisteredPromiseIndex = _.names.push(promise) - 1;
            _.callbackStacks[promise.__RegisteredPromiseIndex] = [];
            _.errorCallbackStack[promise.__RegisteredPromiseIndex] = [];
        },
        setVal(promise, val){
            _.values[promise.__RegisteredPromiseIndex] = val;
            return val;
        },
        getVal(promise){
            return _.values[promise.__RegisteredPromiseIndex];
        },
        getCallbackStack(promise){
            return _.callbackStacks[promise.__RegisteredPromiseIndex];
        },
        getErrorCallbackStack(promise){
            return _.errorCallbackStack[promise.__RegisteredPromiseIndex];
        }
    };
})();
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
function CustomEvent(event, params) {
    _classCallCheck(this, CustomEvent);
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
}
function PromiseReactionJob(stack, getState, setState, value) {
    for (var i = 0; i < stack.length; i++) {
        var event = new CustomEvent('@PromiseReactionJob', {
            detail: {
                getState: getState,
                setState: setState,
                callback: stack[i],
                val: value
            }
        });
        document.dispatchEvent(event);
    }
}
document.addEventListener('@PromiseReactionJob', ev => {
    if (ev.detail.getState() == 0)
        ev.detail.setState();
    ev.detail.callback(ev.detail.val);
});

function resolver(value, resolve, reject){
    if (typeof value != 'object' || typeof value != 'function' || typeof value.then != 'function') resolve(value);
    else {
        value.then(next => {
            resolver(next, resolve, reject)
        });
        try {
            value.catch(reject)
        } catch(e){}
    }
}

class Promise{
    /**
     * @callback Resolver
     * @param {any} data
     * @return {void}
     */
    /**
     * @callback Rejecter
     * @param {Error} reason
     * @return {void}
     */
    /**
     * @callback PromiseCallback
     * @param {Resolver} resolve
     * @param {Rejecter} reject
     * @return {void}
     */
    /**
     * @param {PromiseCallback} asyncFunction
     */
    constructor(asyncFunction){
        registerPromise(this);
        var _getState = () => {
            return getState(this)
        };
        var reject = err => {
            setVal(this, err);
            PromiseReactionJob(getErrorCallbackStack(this), _getState, () => setState(this, 2), err)
        };
        try {
            asyncFunction(val => {
                setVal(this, val);
                PromiseReactionJob(getCallbackStack(this), _getState, () => setState(this, 1), val)
            }, reject)
        } catch(e){
            reject(e)
        }
    }
    then(callback, errorCallback){
        var state = getState(this), value = getVal(this);
        if(typeof callback == 'function'){
            if (state == 0)
                getCallbackStack(this).push(callback);
            else if (state == 1)
                callback(value);
        }
        if(typeof errorCallback == 'function'){
            if (state == 0)
                getErrorCallbackStack(this).push(errorCallback);
            else if (state == 2)
                callback(value);
        }
        return this
    }
    catch(errorCallback){
        if(typeof errorCallback == 'function'){
            var state = getState(this);
            if (state == 0)
                getErrorCallbackStack(this).push(errorCallback);
            else if (state == 2)
                errorCallback(getVal(this));
        }
        return this
    }
    static all(iterable){
        return new Promise((resolve, reject) => {
            var doneCount = 0, results = [];
            for (var i = 0; i < iterable.length; i++) {
                iterable[i].then(result => {
                    results[i] = result;
                    if (++doneCount == iterable.length) resolve(results)
                }).catch(reject);
            }
        })
    }
    static race(iterable){
        return new Promise((resolve, reject) => {
            for (var i = 0; i < iterable.length; i++){
                iterable[i].then(resolve).catch(reject);
            }
        })
    }
    static reject(reason){
        return new Promise((_, reject) => reject(reason))
    }
    static resolve(value){
        return new Promise((resolve, reject) => {
            resolver(value, resolve, reject)
        })
    }
}
