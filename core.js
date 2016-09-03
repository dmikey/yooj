'use strict';

var mix = require('./utils/mix');

// use keyword new to create new copies
function o(definition) {

    // if no listeners are passed, then set listeners to object
    this.listeners = {};
    this.$ = {};
    
    // mix the definition in with this object during creation
    if (definition) this.mix(definition);
    
    registerComponents.call(this);

    // notify created
    this.notify('created', {});
};

// create $ hash of components names for easier lookup
var registerComponents = function() {
      if(this.components) {
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].name) {
                this.$[this.components[i].name] = this.components[i];
            }
        };
    }
};

// listen to events
o.prototype.listen = function (event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
};

// notify listeners
o.prototype.notify = function (event, data) {
    if(this.listeners[event]) {
        for (var i = 0; i < this.listeners[event].length; i++) {
            this.listeners[event][i].call(this, data);
        };
    }
};

// extend this object by copying new properties over
// if property is a function, then we make reference to 
// it as object.property.super
o.prototype.extend = function (definition) {
    var mixed = mix(this, definition);
    mixed.notify('created', {});
    return mixed;
};

// add properties to this object
o.prototype.mix = function mix(definition) {
    for (var attrname in definition) {
        this[attrname] = definition[attrname];
    }
};

// return o for use
module.exports = o;