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
        console.log(store.viewstate.foo);
    }
});

myApp.init();

myApp.$.myStore.reducer(function(data){
    if(data.viewstate.foo) {
        data.viewstate.foo = 'reduced';
    }
    return data;
});

myApp.$.myStore.reducer(function(data){
    if(data.viewstate.foo && data.viewstate.foo === 'reduced') {
        data.viewstate.foo = 're-reduced';
    }
    return data;
});

myApp.$.myStore.update({ viewstate: {foo:'bar'}, collection: [] });