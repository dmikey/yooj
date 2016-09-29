var o = require('./core');

module.exports = new o({
    name: 'dom',
    init: function () {
        this.node = document.createElement('div');
    },
    render: function() {
        // if this component has components, render the components
        // otherwise render the content
        if(this.hasComponents()) {
            return this.renderComponents();
        } else {
            return this.renderContent();
        }

        // notify rendered
        this.notify('rendered', {});
    },
    renderContent: function() {
        // if there is no template, and this component
        // has content, return the content, otherwise render the template
        if(!this.template && this.content) {
            this.node.innerHTML = this.content;
            return this.content;
        } else {
            // render template
            var str = this.renderTemplate();
            this.node.innerHTML = str;
            return str;
        }
    },
    renderComponents: function() {
        // render all components that belong to this component
        var renderString = '';
        for (var i = 0; i < this.components.length; i++) {
            if(this.components[i].render) {
                renderString += this.components[i].render();
            }
        };
        this.node.innerHTML = renderString;
        return renderString;
    },
    attach: function(target) {
        target.appendChild(this.node);
    }
});