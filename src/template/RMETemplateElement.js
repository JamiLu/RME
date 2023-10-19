import Elem from '../elem';
import RMETemplateResolver from '.';

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
     * Update listeners of this element. If the given array has listeners the given listeners are updated.
     * @param {array} array 
     */
    updateListeners(array = []) {
        array.forEach(listener => {
            this[listener.parentProp.name].call(this, listener.func);
        });
        RMETemplateElement.Util.setListeners(this, array);
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
        this.inlineProps = {};
        RMETemplateElement.Util.formProps(this);
        super.replace(element);
        return this;
    }

    setProps(props) {
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
     * Set attributes for the give element. If the given attributes array has attributes the attirbutes will be set.
     * @param {RMETemplateElement} elem 
     * @param {array} attrs 
     */
    static setAttributes(elem, attrs) {
        if (attrs.length > 0) {
            elem.attributes = attrs.filter((attr) => {
                if (attr.key !== 'class') {
                    return attr;
                }
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
}

export default RMETemplateElement;
