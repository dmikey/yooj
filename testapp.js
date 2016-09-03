var o = require('./core');
var store = require('./store');

var myApp = new o({
    components: [
        store.extend({
            name: 'myStore'
        })
    ],
    init: function (config) {
        this.$.myStore.listen('updated', this.storeUpdated);
    },
    storeUpdated: function (store) {
        console.log('the store was updated');
    }
});

myApp.init();
myApp.$.myStore.update({ viewstate: {}, collection: [] });