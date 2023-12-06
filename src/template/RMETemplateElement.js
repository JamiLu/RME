import Elem from '../elem';
import RMETemplateResolver from '.';
import RMEMessagesResolver from '../messages';

/**
 * RMETemplateElement class provides functions for the RME to handle the tree rendering.
 */
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
        this.inlineProps = {};
    }

    hasListeners() {
        return this.listeners.length > 0;
    }

    /**
     * Update listeners of this element to the listeners of the given element. If the given element has listeners
     * then the listeners will be updated.
     * @param {RMETemplateElement} elem
     */
    updateListeners(elem) {
        if (elem.hasListeners()) {
            elem.listeners.forEach(listener => {
                this[listener.parentProp.name].call(this, listener.func);
            });
            RMETemplateElement.Util.setListeners(this, elem.listeners);
        }
    }

    /**
     * Removes the detached children from this element if the given element does not have children.
     * @param {RMETemplateElement} elem 
     */
    removeDetachedChildren(elem) {
        if (elem.children.length === 0) {
            this.children.forEach((child, idx) => {
                if (child.dom().parentElement === null) {
                    this.children.splice(idx, 1);
                }
            });
        }
    }

    /**
     * Set params for this element. If the given arrays have at least one element the parameters are updated.
     * @param {array} attrs 
     * @param {array} listeners 
     */
    setParams(attrs = [], listeners = []) {
        RMETemplateElement.Util.setAttributes(this, attrs);
        RMETemplateElement.Util.setListeners(this, listeners);
        RMETemplateElement.Util.formProps(this);
    }

    /**
     * Overrides attributes of this element to the attributes from the given element.
     * @param {RMETemplateElement} elem
     */
    updateAttributes(elem) {
        RMETemplateElement.Util.setAttributes(this, elem.attributes, true);
        this.inlineProps = elem.inlineProps;
        RMETemplateElement.Util.formProps(this);
    }

    /**
     * Set the inline id for this element.
     * @param {string} id 
     * @returns RMETemplateElement
     */
    setId(id) {
        super.setId(id);
        this.inlineProps.id = id;
        RMETemplateElement.Util.formProps(this);
        return this;
    }

    /**
     * Add inline classes for this element.
     * @param {string} classes 
     * @returns RMETemplateElement
     */
    addClasses(classes) {
        super.addClasses(classes);
        this.inlineProps.class = super.getClasses();
        RMETemplateElement.Util.formProps(this);
        return this;
    }

    /**
     * Add an inline attribute for this element.
     * @param {string} key 
     * @param {*} val 
     */
    addInlineAttr(key, val) {
        this.inlineProps[key] = val;
        RMETemplateElement.Util.formProps(this);
    }

    /**
     * Appends an element into the tree.
     * @param {RMETemplateElement} element 
     * @returns RMETemplateElement
     */
    append(element) {
        this.children.push(element);
        super.append(element);
        return this;
    }

    /**
     * Removes an element from the tree at the given position.
     * @param {number} index 
     * @param {RMETemplateElement} element 
     * @returns RMETemplateElement
     */
    remove(index, element) {
        this.children.splice(index, 1);
        super.remove(element);
        return this;
    }

    /**
     * Replaces an element in the tree at the given position.
     * @param {number} index 
     * @param {RMETemplateElement} parent 
     * @param {RMETemplateElement} element 
     * @returns RMETemplateElement
     */
    replace(index, parent, element) {
        parent.children.splice(index, 1, element);
        this.inlineProps = element.inlineProps;
        RMETemplateElement.Util.formProps(element);
        super.replace(element);
        return this;
    }

    /**
     * Set new props to this element. The html dom element properties will be updated.
     * Previous properties will be overridden.
     * @param {object} props
     * @returns RMETemplateElement
     */
    setProps(props) {
        RMETemplateElement.Util.updateBrowserSetStyle(this, props);
        RMETemplateResolver.updateElemProps(this, props, this.props);
        return this;
    }

    /**
     * Function compares this template element to the other and if properties of this element are equal to
     * properties of the other then true will be returned. Otherwise returns false.
     * @param {RMETemplateElement} other 
     * @returns True if equal
     */
    equals(other) {
        return this.stringProps === other.stringProps && this.listenerString === other.listenerString;
    }

    getPropsString() {
        return this.stringProps;
    }

    getPropsObj() {
        return this.props;
    }

    /**
     * Duplicates this element and the children of it.
     * @returns RMETemplateElement
     */
    duplicate() {
        return RMETemplateElement.Util.duplicateElem(this);
    }
}

/**
 * RMETemplateElement.Util has utility functions desinged for the template element.
 * These functions manage the template element and properties of it.
 */
RMETemplateElement.Util = class RMETemplateElementUtil {

    static duplicateElem(elem) {
        const dup = new RMETemplateElement(elem.getTagName().toLowerCase());
        dup.inlineProps = elem.inlineProps;
        dup.setParams(elem.attributes, elem.listeners);
        RMETemplateResolver.updateElemProps(dup, elem.props, elem.props);
        if (elem.children.length > 0) {
            elem.children
                .map((child) => RMETemplateElement.Util.duplicateElem(child))
                .forEach((child) => dup.append(child));
        }
        return dup;
    }

    /**
     * Set listeners for the given element. If the given listeners array has listeners the listeners will be set.
     * @param {RMETemplateElement} elem 
     * @param {array} listeners 
     */
    static setListeners(elem, listeners) {
        if (listeners.length > 0) {
            elem.listeners = listeners;
            elem.listenerObj = listeners.reduce((prev, curr) => {
                prev[curr.parentProp.name] = curr.func;
                return prev;
            }, {});
            elem.listenerString = listeners.map(listener => listener.parentProp.name).join();
        }
    }

    /**
     * Set attributes for the give element. If the given attributes array has attributes or override is true the attirbutes will be set.
     * @param {RMETemplateElement} elem 
     * @param {array} attrs 
     * @param {boolean} override
     */
    static setAttributes(elem, attrs, override) {
        if (attrs.length > 0 || override) {
            elem.attributes = attrs.filter((attr) => {
                if (attr.key !== 'class') {
                    return attr;
                }
            }).map((attr) => {
                if (attr.key === 'message') {
                    attr.val = RMEMessagesResolver.message(
                        RMETemplateResolver.normalizeMessageString(attr.val), 
                        RMETemplateResolver.getMessageParams(attr.val));
                }
                return attr;
            });
            elem.attributeString = elem.attributes.map(attr => `${attr.key}:${attr.val}`).join().trim();
        }
    }

    /**
     * Forms a properties object and a properties string of the attributes, properties and listeners from the given element.
     * @param {RMETemplateElement} elem 
     */
    static formProps(elem) {
        const props = elem.attributes.reduce((prev, curr)  => {
            prev[curr.key] = curr.val;
            return prev;
        }, { ...elem.inlineProps, ...elem.listenerObj });
        elem.props = props;
        elem.stringProps = JSON.stringify(props);
    }

    /**
     * Update style propety from the browser set styles if present to the new props object.
     * @param {RMETemplateElement} elem
     * @param {object} props
     */
    static updateBrowserSetStyle(elem, props) {
        const style = elem.getAttribute('style');
        if (style) {
            props.style = style;
        }
    }
}

export default RMETemplateElement;
