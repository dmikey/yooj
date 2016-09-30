// mix two objects together and return a new object
module.exports = function mix(obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
        if (typeof obj1[attrname] === 'function') {
            obj3[attrname].super = obj1[attrname];
        };
    };
    
    return obj3;
};