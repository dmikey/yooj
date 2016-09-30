var o = require('./core');

// debounce, for our throttled dispatch event
function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};

module.exports = new o({
    'tag': 'div',
    'init': function () {
        this.node = document.createElement(this.tag);
        this.update = debounce(this.update, 60); //debounce by 60ms
    },
    'update': function(data) {
        this['mix'](data);
        this['render']();

        this['notify']('updated', {});
    },
    'render': function() {
        // if this component has components, render the components
        // otherwise render the content
        if(this['hasComponents']()) {
            this['renderComponents']();
        } else {
            this['renderContent']();
        }

        // notify rendered
        this['notify']('rendered', {});
    },
    'renderContent': function() {
        // if there is no template, and this component
        // has content, return the content, otherwise render the template
        if(!this['template'] && this['content']) {
            window.requestAnimationFrame(function(){
                this.node.innerHTML = this['content'];
            }.bind(this));
        } else {
            // render template
            window.requestAnimationFrame(function(){
                var str = this['renderTemplate']();
                this.node.innerHTML = str;
            }.bind(this));
        }
    },
    'renderComponents': function() {
        // render all components that belong to this component
        for (var i = 0; i < this['components'].length; i++) {
            if(this['components'][i]['render']) {
                this['components'][i]['render']();
                this['components'][i]['attach'](this.node);
            }
        };
    },
    'attach': function(target) {
        // attaches node to DOM
        target.appendChild(this.node);
        this['wireEvents']();
        this['notify']('attached', {});
    },
    'detach': function() {
        // removed node from it's parent, and removes events 
        // attached to node
        var unwire = true;
        this['wireEvents'](unwire);
        this.node.parentNode.removeChild(this.node);
    },
    'wireEvents': function(unwire) {
        // attaches events, or removes them if unwire=true
        if((this.events && typeof this.events === 'object') && (this.events instanceof Array === false)) {
            for (var k in this.events){
                if (this.events.hasOwnProperty(k)) {
                    if(!unwire){
                         this.node.addEventListener(k, this.events[k]);
                    } else {
                         this.node.removeEventListener(k, this.event, false);
                    }
                }
            }
        }
    }
});