import Elem from '../elem';
import RMETemplateResolver from '.';

class RMETemplateElement extends Elem {
    constructor(type) {
        super(type);
        this.props = {};
        this.stringProps;
        this.listeners = [];
        this.attributes = [];
        this.attributeString = '';
        this.listenerObj = {};
        this.listenerString = '';
        this.children = [];
        this.rawChildren = [];
        this.inlineProps = {};
    }

    setListeners(array = []) {
        this.listeners = array;
        this.listenerObj = array.reduce((prev, curr) => {
            prev[curr.parentProp.name] = curr.func;
            return prev;
        }, {});
        this.listenerString = array.map(listener => listener.parentProp.name).join();
        // console.log('listener obj', this.listenerObj);
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

    _setAttributes(attrs = []) {
        this.attributes = attrs.map((attr) => {
            if (attr.key === 'class') {
                const inlineClass = this.inlineProps.class ? `${this.inlineProps.class} ` : '';
                return { key: 'class', val: `${inlineClass}${attr.val || ''}` }
            } else {
                return attr;
            }
        });
        this.attributeString = this.attributes.map(attr => `${attr.key}:${attr.val}`).join().trim();
    }

    setParams(attrs = [], listeners = []) {
        this._setAttributes(attrs);
        this.setListeners(listeners);
        this.props = this.attributes.reduce((prev, curr)  => {
            prev[curr.key] = curr.val;
            return prev;
        }, { ...this.inlineProps, ...this.listenerObj });
        this.stringProps = JSON.stringify(this.props);
    }

    setId(id) {
        super.setId(id);
        this.inlineProps.id = id;
        return this;
    }

    addClasses(classes) {
        super.addClasses(classes);
        this.inlineProps.class = classes;
        return this;
    }

    addAttr(key, val) {
        this.inlineProps[key] = val;
    }

    equals(other) {
        return this.stringProps === other.stringProps && this.listenerString === other.listenerString;
    }

    append(element) {
        // console.log('append rme child', element);
        this.children.push(element);
        // console.log('add child', this.children);
        super.append(element);
        this.rawChildren = Array.from(this.dom().children);
        return this;
    }

    getRawChildren() {
        return this.rawChildren;
    }

    getChildren() {
        // console.log('get children', this, this.html);
        // return Array.from(this.html.children).map(this.wrap);
        return this.children;
    }

    _wrap(node) {
        // console.log('node,', node);
        const wrap = new RMETemplateElement(node);
        // wrap.setParams(node.attributes, node.listeners);
        // RMETemplateResolver.updateElemProps(wrap, node.props, node.props);
        return wrap;
    }

    getProps() {
        return this.props;
    }

    _dupElem(elem) {
        const dup = new RMETemplateElement(elem.getTagName().toLowerCase());
        dup.setParams(elem.attributes, elem.listeners);
        // console.log('dupc', elem.attributes, elem.listeners, elem.props);
        RMETemplateResolver.updateElemProps(dup, elem.props, elem.props);
        if (elem.children.length > 0) {
            // console.log('children', elem.children);
            elem.children.map((child) => {
                // console.log('c', child);
                return child._dupElem(child);
            })
            .forEach((child) => {
                dup.append(child);
            });
        }
        // console.log('return', dup);
        return dup;
    }

    duplicate() {
        // return super.duplicate();
        // console.log('duplicate', this.html, this.getProps(), this.props);
        // const dup = new RMETemplateElement(this.getTagName().toLowerCase());
        // RMETemplateResolver.updateElemProps(dup, this.props, {});
        // dup.setParams(this.attributes, this.listeners);
        // const dup = this._dupElem(this);
        // console.log('du', dup);

        return this._dupElem(this);
        // return super.duplicate();
    }
}

export default RMETemplateElement;
