const promisesAplusTests = require('promises-aplus-tests'),
	requireFromStr = require('require-from-string'),
    Promise = require(__dirname + '/implementation');

var adapter = {
	resolved(value){
        return Promise.resolve(value)
    },
    rejected(reason){
        return Promise.reject(reason)
    },
	deferred(){
		var d = {};
		d.promise = new Promise((resolve, reject) => {
			d.resolve = resolve;
			d.reject = reject;
		});
		return d;
	}
};

promisesAplusTests(adapter, function (err) {
	// All done; output is in the console. Or check `err` for number of failures.
});
