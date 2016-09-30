var o = require('./core');

module.exports = new o({
    'tag': 'div',
    'init': function () {
        this.node = document.createElement(this.tag);
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
            this.node.innerHTML = this['content'];
        } else {
            // render template
            var str = this['renderTemplate']();
            this.node.innerHTML = str;
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