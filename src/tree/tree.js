import Elem from '../elem';

/**
 * Tree class reads the HTML Document Tree and returns elements found from there. The Tree class does not have 
 * HTML Document Tree editing functionality except setTitle(title) method that will set the title of the HTML Document.
 * 
 * Majority of the methods in the Tree class will return found elements wrapped in an Elem instance as it offers easier
 * operation functionalities.
 */
class Tree {
    /**
     * Uses CSS selector to find elements on the HTML Document Tree. 
     * Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} selector 
     * @returns An array of Elem instances or a single Elem instance.
     */
    static get(selector) {
        return Elem.wrapElems(document.querySelectorAll(selector));
    }

    /**
     * Uses CSS selector to find the first match element on the HTML Document Tree.
     * Found element will be wrapped in an Elem instance.
     * @param {string} selector 
     * @returns An Elem instance.
     */
    static getFirst(selector) {
        try {
            return Elem.wrap(document.querySelector(selector));
        } catch (e) {}
    }

    /**
     * Uses a HTML Document tag name to find matched elements on the HTML Document Tree e.g. div, span, p.
     * Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instanes are returned otherwise a single Elem instance.
     * @param {string} tag 
     * @returns An array of Elem instances or a single Elem instance.
     */
    static getByTag(tag) {
        return Elem.wrapElems(document.getElementsByTagName(tag));
    }

    /**
     * Uses a HTML Document element name attribute to find matching elements on the HTML Document Tree.
     * Found elements will be wrappedn in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} name 
     * @returns An array of Elem instances or a single Elem instance.
     */
    static getByName(name) {
        return Elem.wrapElems(document.getElementsByName(name));
    }

    /**
     * Uses a HTML Document element id to find a matching element on the HTML Document Tree.
     * Found element will be wrapped in an Elem instance.
     * @param {string} id 
     * @returns Elem instance.
     */
    static getById(id) {
        try {
            return Elem.wrap(document.getElementById(id));
        } catch (e) {}
    }

    /**
     * Uses a HTML Document element class string to find matching elements on the HTML Document Tree e.g. "main emphasize-green".
     * Method will try to find elements having any of the given classes. Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} classname 
     * @returns An array of Elem instances or a single Elem instance.
     */
    static getByClass(classname) {
        return Elem.wrapElems(document.getElementsByClassName(classname));
    }

    /**
     * @returns body wrapped in an Elem instance.
     */
    static getBody() {
        try {
            return Elem.wrap(document.body);
        } catch (e) {}
    }

    /**
     * @returns head wrapped in an Elem instance.
     */
    static getHead() {
        try {
            return Elem.wrap(document.head);
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * @returns title of the html document page.
     */
    static getTitle() {
        return document.title;
    }

    /**
     * Set an new title for html document page.
     * @param {string} title 
     */
    static setTitle(title) {
        document.title = title;
    }

    /**
     * @returns active element wrapped in an Elem instance.
     */
    static getActiveElement() {
        try {
            return Elem.wrap(document.activeElement);
        } catch (e) {}
    }

    /**
     * @returns array of anchors (<a> with name attribute) wrapped in Elem an instance.
     */
    static getAnchors() {
        return Elem.wrapElems(document.anchors);
    }

    /**
     * @returns <html> element.
     */
    static getHtmlElement() {
        return document.documentElement;
    }

    /**
     * @returns <!DOCTYPE> element.
     */
    static getDoctype() {
        return document.doctype;
    }

    /**
     * @returns an arry of embedded (<embed>) elements wrapped in Elem an instance.
     */
    static getEmbeds() {
        return Elem.wrapElems(document.embeds);
    }

    /**
     * @returns an array of image elements (<img>) wrapped in an Elem instance.
     */
    static getImages() {
        return Elem.wrapElems(document.images);
    }

    /**
     * @returns an array of <a> and <area> elements that have href attribute wrapped in an Elem instance.
     */
    static getLinks() {
        return Elem.wrapElems(document.links);
    }

    /**
     * @returns an array of scripts wrapped in an Elem instance.
     */
    static getScripts() {
        return Elem.wrapElems(document.scripts);
    }

    /**
     * @returns an array of form elements wrapped in an Elem instance.
     */
    static getForms() {
        return Elem.wrapElems(document.forms);
    }
}

export default Tree;