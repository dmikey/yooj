'use strict';

var mix = require('./utils/mix');

// use keyword new to create new copies
function o(definition) {

    // if no listeners are passed, then set listeners to object
    this.listeners = {};
    this.$ = {};
    
    // mix the definition in with this object during creation
    if (definition) this.mix(definition);

    if(typeof this.init === 'function') this.init.call(this);
    
    registerComponents.call(this);

    // notify created
    this.notify('created', {});
};

// create $ hash of components names for easier lookup
var registerComponents = function registerComponents() {
      if(this.components) {
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].name) {
                this.$[this.components[i].name] = this.components[i];
            }
        };
    }
};

// listen to events
o.prototype.listen = function listen(event, callback) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(callback);
};

// notify listeners
o.prototype.notify = function notify(event, data) {
    if(this.listeners[event]) {
        for (var i = 0; i < this.listeners[event].length; i++) {
            this.listeners[event][i].call(this, this);
        };
    }
};

// checks to see if this component has components
o.prototype.hasComponents = function hasComponents() {
    return this.components && this.components.length > 0;
};

// extend this object by copying new properties over
// if property is a function, then we make reference to 
// it as object.property.super
o.prototype.extend = function extend(definition) {
    var mixed = mix(this, definition);
    if(typeof mixed.init === 'function') mixed.init.call(mixed);
    mixed.notify('created', {});
    return mixed;
};

// add properties to this object
o.prototype.mix = function mix(definition) {
    for (var attrname in definition) {
        this[attrname] = definition[attrname];
    }
};

// render a precompiled javascript template on this control
o.prototype.renderTemplate = function() {
    if(this.template) {
        if(typeof this.template === 'function') {

            // hopefully the developer has run a precompiled
            // routine to speed up run time, if so, just
            // execute the pre compiled template
            return this.template(this);
        } else if (typeof this.template === 'string') {

            // if a string was passed we need to compile it 
            // into a template at run time
            this._templateString = this.template;
            this.parseTemplate(this.template);
            return this.template(this);
        }
    };
};

// uses jresig micro templater to create a cached template function
// from a string
o.prototype.parseTemplate = function(templateString) {
        
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      this.template = new Function("data", "var p=[],print=function(){p.push.apply(p,arguments);};" +

        // Introduce the data as local variables using with(){}
        "p.push('" +

        // Convert the template into pure JavaScript
        templateString
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');return p.join('');");

};

// return o for use
module.exports = o;