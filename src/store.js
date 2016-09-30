var o = require('./core');

module.exports = new o({
    'name': 'store',
    'viewstate': {},
    'collection': [],
    'reducers': [],
    'reducer': function (callback) {
        this.reducers.push(function (viewstate, collection) {
            return callback.call(this, { 'viewstate': viewstate, 'collection': collection });
        });
    },
    'reduce': function (data) {
        var reducedData;
        for (var i = 0; i < this['reducers'].length; i++) {
            if(typeof reducedData === 'undefined') {
                data['viewstate'] = data['viewstate'] || {};
                data['collection'] = data['collection'] || [];
                reducedData = this['reducers'][i].call(this, data['viewstate'], data['collection']);
            } else {
                reducedData = this['reducers'][i].call(this, reducedData['viewstate'], reducedData['collection']);
            }
        };
        this['mix'](reducedData);
    },
    'update': function (data) {

        if (this['reducers'].length > 0) {

            // loop through reducers and reduce data
            this['reduce'](data);
        } else {

            // otherwise mix 
            this['mix'](data);
        }

        this['notify']('updated', this);
    }
});