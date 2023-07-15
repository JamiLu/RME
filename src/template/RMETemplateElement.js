import Elem from '../elem';
import RMETemplateResolver from '.';

class RMETemplateElement extends Elem {
    constructor(type) {
        super(type);
        this.props = {};
        this.listeners = [];
        this.attributes = [];
        this.attributeString = '';
        this.listenerObj = {};
        this.listenerString = '';
        this.children = [];
    }

    setListeners(array = []) {
        this.listeners = array;
        this.listenerObj = array.reduce((prev, curr) => {
            prev[curr.parentProp] = curr.func;
            return prev;
        }, {});
        this.listenerString = array.map(listener => `${listener.parentProp}:${listener.func}`).join();
    }

    hasListeners() {
        return this.listeners.length > 0;
    }

    updateListeners(array = []) {
        array.forEach(listener => {
            this[listener.parentProp].call(this, listener.func);
        });
        this.setListeners(array);
    }

    setAttributes(array = []) {
        this.attributes = array;
        this.attributeString = array.map(attr => `${attr.key}:${attr.val}`).join();
    }

    setPr(arr1, arr2) {
        this.attributes = arr1;
        this.listeners = arr2;
        console.log('set', this.attributes, this.listeners);
    }

    equals(templateElement) {
        // console.log('THIS, ', this.attributeString, this.listenerString, 'THAT', templateElement.attributeString, templateElement.listenerString);
        // console.log('THIS',  this, 'THAT', templateElement);
        console.log('equals', this.attributeString === templateElement.attributeString && this.listenerString === templateElement.listenerString);
        console.log('this', this.attributeString, templateElement.attributeString);
        console.log('literal', this.dom(), templateElement.dom());
        return this.attributeString === templateElement.attributeString && this.listenerString === templateElement.listenerString;
        // console.log('THIS', this.props, 'THAT', templateElement.props);
        // console.log('equals', JSON.stringify(this.props) === JSON.stringify(templateElement.props))
        // return JSON.stringify(this.props) === JSON.stringify(templateElement.props);
    }

    append(element) {
        this.children.push(element);
        // console.log('add child', this.children);
        super.append(element);
    }

    getChildren() {
        // console.log('get children', this, this.html);
        // return Array.from(this.html.children).map(this.wrap);
        return this.children;
    }

    wrap(node) {
        return new RMETemplateElement(node, );
    }

    getProps() {
        // console.log('get props');
        const p = this.attributes.reduce((prev, curr) => {
            prev[curr.key] = curr.val;
            return prev;
        }, this.listenerObj);
        console.log('get props', p);
        return p;
    }

    duplicate() {
        console.log('duplicate', this.html, this.getProps(), this.props);
        const dup = new RMETemplateElement(this.html, this.props);
        RMETemplateResolver.updateElemProps(dup, this.getProps(), {});
        dup.setAttributes(this.attributes);
        dup.setListeners(this.listeners);
        return dup;
    }
}

export default RMETemplateElement;
