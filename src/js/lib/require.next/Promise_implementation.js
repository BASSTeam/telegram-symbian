var _a = (function () {
    var _ = { names: [], states: {}, values: {}, callbackStacks: {}, errorCallbackStack: {} };
    return {
        setState: function (promise, state) {
            _.states[promise.__RegisteredPromiseIndex] = state;
            return state;
        },
        getState: function (promise) {
            return _.states[promise.__RegisteredPromiseIndex] || 0;
        },
        registerPromise: function (promise) {
            promise.__RegisteredPromiseIndex = _.names.push(promise) - 1;
            _.callbackStacks[promise.__RegisteredPromiseIndex] = [];
            _.errorCallbackStack[promise.__RegisteredPromiseIndex] = [];
        },
        setVal: function (promise, val) {
            _.values[promise.__RegisteredPromiseIndex] = val;
            return val;
        },
        getVal: function (promise) {
            return _.values[promise.__RegisteredPromiseIndex];
        },
        getCallbackStack: function (promise) {
            return _.callbackStacks[promise.__RegisteredPromiseIndex];
        },
        getErrorCallbackStack: function (promise) {
            return _.errorCallbackStack[promise.__RegisteredPromiseIndex];
        }
    };
})(), setState = _a.setState, getState = _a.getState, registerPromise = _a.registerPromise, getVal = _a.getVal, setVal = _a.setVal, getCallbackStack = _a.getCallbackStack, getErrorCallbackStack = _a.getErrorCallbackStack;
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
document.addEventListener('@PromiseReactionJob', function (ev) {
    if (ev.detail.getState() == 0)
        ev.detail.setState();
    ev.detail.callback(ev.detail.val);
});
/**
 * @constructor
 * @param {Function} asyncFunction
 */
function Promise(asyncFunction) {
    var _this = this;
    _classCallCheck(this, Promise);
    registerPromise(this);
    var _getState = function () { return getState(_this); };
    var reject = function (err) {
        setVal(_this, err);
        PromiseReactionJob(getErrorCallbackStack(_this), _getState, function () { return setState(_this, 2); }, err);
    };
    try {
        asyncFunction(function (val) {
            setVal(_this, val);
            PromiseReactionJob(getCallbackStack(_this), _getState, function () { return setState(_this, 1); }, val);
        }, reject);
    }
    catch (e) {
        reject(e);
    }
}
Promise.prototype.then = function (callback, errorCallback) {
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
    return this;
};
Promise.prototype["catch"] = function (errorCallback) {
    if(typeof errorCallback == 'function'){
        var state = getState(this);
        if (state == 0)
            getErrorCallbackStack(this).push(errorCallback);
        else if (state == 2)
            errorCallback(getVal(this));
    }
    return this;
};
Promise.all = function (iterable) {
    return new Promise(function (resolve, reject) {
        var doneCount = 0, results = [];
        for (var i = 0; i < iterable.length; i++) {
            iterable[i].then(function (result) {
                results[i] = result;
                if (++doneCount == iterable.length)
                    resolve(results);
            })["catch"](reject);
        }
    });
};
Promise.race = function (iterable) {
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i++) {
            iterable[i].then(resolve)["catch"](reject);
        }
    });
};
Promise.reject = function (reason) { return new Promise(function (_, reject) { return reject(reason); }); };
function resolver(value, resolve, reject) {
    if (typeof value != 'object' || typeof value != 'function' || !value.then || !value.then.apply)
        resolve(value);
    else {
        value.then(function (next) { return resolver(next, resolve, reject); });
        try {
            value["catch"](reject);
        }
        catch (e) { }
    }
}
Promise.resolve = function (value) {
    return new Promise(function (resolve, reject) {
        resolver(value, resolve, reject);
    });
};
