var o = require('./core');
var mix = require('./utils/mix');

module.exports = new o({
    name: 'store',
    collection: [],
    update: function(data) {
        this.notify('updated');
    }
});