import RME from '../rme';
import Elem from '../elem';
import Messages from '../messages';
import Util from '../util';

let Template = (function() {
    /**
     * Template class reads a JSON format notation and creates an element tree from it.
     * The Template class has only one public method resolve that takes the template as parameter and returns 
     * the created element tree.
     */
    class Template {
        constructor() {
            this.template = {};
            this.root = null;
            /**
             * Deprecated, is replaced with Template.isAttr(key, elem); function.
             * These attributes are supported inside an object notation: {div: {text: "some", class: "some", id:"some"....}}
             */
            this.attributes = ["id","name","class","text","value","content","tabIndex","type","src","href","editable",
            "placeholder","size","checked","disabled","visible","display","draggable","styles", "for", "message", "target", "title", "click", "focus", "blur"];
        }

        /**
         * Method takes a template as parameter, starts resolving it and returns 
         * a created element tree. 
         * @param {object} template
         * @returns Elem instance element tree.
         */
        setTemplateAndResolve(template) {
            this.template = template;
            this.resolve(this.template, this.root, 0);
            return this.root;
        }

        /**
         * Method resolves a given template recusively. The method and
         * parameters are used internally.
         * @param {object} template
         * @param {object} parent
         * @param {number} round
         */
        resolve(template, parent, round) {
            for(var obj in template) {
                if(template.hasOwnProperty(obj)) {
                    if(round === 0) {
                        ++round;
                        this.root = this.resolveElement(obj, template[obj]);
                        if(Util.isArray(template[obj]))
                            this.resolveArray(template[obj], this.root, round);
                        else if(!this.isComponent(obj) && Util.isObject(template[obj]))
                            this.resolve(template[obj], this.root, round);
                        else if(Util.isString(template[obj]) || Util.isNumber(template[obj]))
                            this.resolveStringNumber(this.root, template[obj]);
                        else if(Util.isFunction(template[obj]))
                            this.resolveFunction(this.root, template[obj]);
                    } else {
                        ++round;
                        if(Template.isAttr(obj, parent)) {
                            this.resolveAttributes(parent, obj, template[obj]);
                        } else if(this.isEventKeyVal(obj, template[obj])) {
                            parent[obj].call(parent, template[obj]);
                        } else {
                            var child = this.resolveElement(obj, template[obj]);
                            parent.append(child);
                            if(Util.isArray(template[obj])) {
                                this.resolveArray(template[obj], child, round);
                            } else if(!this.isComponent(obj) && Util.isObject(template[obj])) {
                                this.resolve(template[obj], child, round);
                            } else if(Util.isString(template[obj]) || Util.isNumber(template[obj])) {
                                this.resolveStringNumber(child, template[obj]);
                            } else if(Util.isFunction(template[obj])) {
                                this.resolveFunction(child, template[obj]);
                            }
                        }
                    }
                }
            }
        }

        /**
         * Method resolves a given array template elements.
         * @param {array} array
         * @param {parent} parent
         * @param {round}
         */
        resolveArray(array, parent, round) {
            var i = 0;                
            while(i < array.length) {
                var o = array[i];
                for(var key in o) {
                    if(o.hasOwnProperty(key)) {
                        if(Util.isObject(o[key])) {
                            this.resolve(o, parent, round);
                        } else if(Util.isString(o[key]) || Util.isNumber(o[key])) {
                            var el = this.resolveElement(key);
                            this.resolveStringNumber(el, o[key]);
                            parent.append(el);
                        } else if(Util.isFunction(o[key])) {
                            var el = this.resolveElement(key);
                            this.resolveFunction(el, o[key]);
                            parent.append(el);
                        }
                    }
                }
                i++;
            }
        }

        resolveStringNumber(elem, value) {
            if(Util.isString(value) && this.isMessage(value))
                this.resolveMessage(elem, value);
            else
                elem.setText(value);
        }
    
        /**
         * Resolves function based tempalte implementation.
         * @param {object} elem
         * @param {func} func
         */
        resolveFunction(elem, func) {
            let ret = func.call(elem, elem);
            if(!Util.isEmpty(ret) && Util.isString(ret)) {
                if(this.isMessage(ret)) {
                    this.resolveMessage(elem, ret);
                } else {
                    elem.setText(ret);
                }
            }  else if (!Util.isEmpty(ret) && Util.isNumber(ret)) {
                elem.setText(ret);
            }
        }

        /**
         * Function will check if the given message is actually a message or not. The function
         * will return true if it is a message otherwise false is returned.
         * @param {string} message 
         * @returns True if the given message is actually a message otherwise returns false.
         */
        isMessage(message) {
            let params = this.getMessageParams(message);
            if(!Util.isEmpty(params))
                message = message.replace(params.join(), "");
            return !Util.isEmpty(Messages.message(message)) && Messages.message(message) != message;
        }

        /**
         * Resolves an element and some basic attributes from a give tag. Method throws an exception if 
         * the element could not be resolved.
         * @param {string} tag
         * @param {object} obj
         * @returns Null or resolved Elem instance elemenet.
         */
        resolveElement(tag, obj) {
            let resolved = null;
            var match = [];
            var el = this.getElementName(tag);
            if(RME.hasComponent(el)) {
                el = el.replace(/component:/, "");
                resolved = RME.component(el, obj);
            } else if(Util.isEmpty(el))
                throw "Template resolver could not find element: \"" + el + "\" from the given tag: \"" + tag + "\"";
            else
                resolved = new Elem(el);

            match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id
            if(!Util.isEmpty(match))
                resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));

            match = tag.match(/\.[a-zA-Z-0-9\-]+/g); //find classes
            if(!Util.isEmpty(match)) 
                resolved.addClasses(match.join(" ").replace(/\./g, ""));

            match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_&%@!?£$+¤|;\\<\\>\\"]+\]/g); //find attributes
            if(!Util.isEmpty(match))
                resolved = this.addAttributes(resolved, match);

            return resolved;
        }

        getElementName(str) {
            if(!Util.isEmpty(str))
                return str.match(/component:?[a-zA-Z0-9]+|[a-zA-Z0-9]+/).join();
        }

        /**
         * Adds resolved attributes to an element.
         * @param {object} elem
         * @param {array} elem
         * @returns The given elem instance.
         */
        addAttributes(elem, attrArray) {
            let i = 0;
            let start = "[";
            let eq = "=";
            let end = "]";
            while(i < attrArray.length) {
                var attr = attrArray[i];
                let key = attr.substring(attr.indexOf(start) +1, attr.indexOf(eq));
                let val = attr.substring(attr.indexOf(eq) +1, attr.indexOf(end));
                elem.setAttribute(key, val);
                i++;
            }
            return elem;
        }

        /**
         * Method adds an attribute to an element.
         * @param {object} elem
         * @param {string} key
         * @param {string} val
         */
        resolveAttributes(elem, key, val) {
            switch(key) {
                case "id":
                    elem.setId(val);
                    break;
                case "class":
                    elem.addClasses(val);
                    break;
                case "text":
                    elem.setText(val);
                    break;
                case "content":
                    this.resolveContent(elem, key, val);
                    break;
                case "tabIndex":
                    elem.setTabIndex(val);
                    break;
                case "editable":
                    elem.setEditable(val);
                    break;
                case "checked":
                    elem.setChecked(val);
                    break;
                case "disabled":
                    elem.setDisabled(val);
                    break;
                case "visible":
                    elem.setVisible(val);
                    break;
                case "display":
                    elem.display(val);
                    break;
                case "styles":
                    elem.setStyles(val);
                    break;
                case "message":
                    this.resolveMessage(elem, val);
                    break;
                case "click":
                    elem.click();
                    break;
                case "focus":
                    elem.focus();
                    break;
                case "blur":
                    elem.blur();
                    break;
                case "maxLength":
                    elem.setMaxLength(val);
                    break;
                case "minLength":
                    elem.setMinLength(val);
                    break;
                default: 
                    this.resolveDefault(elem, key, val);
            }
        }

        /**
         * Resolves the attribute that did not match on cases. Usually nothing needs to be done except when handling html dom data-* attributes. In such case
         * this function will auto format the data-* attribute to a correct format.
         * @param {object} elem 
         * @param {string} key 
         * @param {*} val 
         */
        resolveDefault(elem, key, val) {
            if(key.indexOf("data") === 0 && key.length > "data".length)
                elem.setData(key.replace(/[A-Z]/, key.charAt(4).toLowerCase()).replace("data", ""), val);
            else
                elem.setAttribute(key, val);
        }

        /**
         * Function sets the content of the element according to the element.
         * @param {object} elem 
         * @param {string} key 
         * @param {string} val 
         */
        resolveContent(elem, key, val) {
            if(elem.getTagName().toLowerCase() === "meta")
                elem.setAttribute(key, val);
            else
                elem.setContent(val);
        }

        /**
         * Function sets a translated message to the element. If the message contains message parameters then the paramters
         * are resolved first.
         * @param {object} elem 
         * @param {string} message 
         */
        resolveMessage(elem, message) {
            if(Util.isEmpty(message))
                throw "message must not be empty";

            let matches = this.getMessageParams(message);
            if(Util.isEmpty(matches)) {
                elem.message(message);
            } else {
                Util.setTimeout(function() {
                    let end = message.indexOf(":") > 0 ? message.indexOf(":") : message.indexOf("{");
                    message = message.substring(0, end);
                    matches = matches.join().match(/([^\{\}\:\;]*)/g);
                    let params = [];
                    let i = 0;
                    while(i < matches.length) {
                        if(!Util.isEmpty(matches[i]))
                            params.push(matches[i]);
                        i++;
                    }
                    elem.message(message, params);
                });
            }
        }

        /**
         * Function will return message parameters if found.
         * @param {string} message 
         * @returns Message params in a match array if found.
         */
        getMessageParams(message) {
            return message.match(/\:?(\{.*\}\;?)/g);
        }

        /**
         * Deprecated
         * Checks is a given key is an attribute key.
         * @param {key}
         * @returns True if the given key is attribute key otherwise false.
         */
        isAttributeKey(key) {
            let i = 0;
            while(i < this.attributes.length) {
                if(key === this.attributes[i]) {
                    return true;
                }
                i++;
            }
            return false;
        }

        /**
         * Checks is a given key val an event listener key val.
         * @param {string} key
         * @param {function} val
         * @returns True if the given key val is event listener key val.
         */
        isEventKeyVal(key, val) {
            return key.indexOf("on") === 0 && Util.isFunction(val);
        }

        /**
         * Checks that the given component exist with the given key or the key starts with component keyword and the component exist. 
         * @param {string} key
         * @returns True if the component exist or the key contains component keyword and exist, otherwise false.
         */
        isComponent(key) {
            return RME.hasComponent(this.getElementName(key));
        }

        /**
         * Method takes a template as parameter, starts resolving it and 
         * returns a created element tree.
         * @param {object} template
         * @returns Elem instance element tree.
         */
        static resolveTemplate(template) {
            return Template.create().setTemplateAndResolve(template);
        }

        static create() {
            return new Template();
        }

        /**
         * Method checks if the given object is an unresolved JSON template.
         * @param {object} object 
         * @returns True if the given object is an unresolved JSON template, otherwise false.
         */
        static isTemplate(object) {
            let isTemplate = false;
            if(Util.isObject(object) && !Util.isArray(object) && !(object instanceof Elem)) {
                for(var p in object) {
                    isTemplate = object.hasOwnProperty(p) && Template.isTagOrComponent(p);
                    if(isTemplate)
                        break;
                }
            }
            return isTemplate;
        }
        
        /**
         * Method takes a string and returns true if the given string is a html tag or a component, otherwise returns false.
         * @param {string} tag 
         * @returns True if the given tag is a HTML tag otherwise false.
         */
        static isTagOrComponent(tag) {
            tag = tag.match(/component:?[a-zA-Z0-9]+|[a-zA-Z0-9]+/).join().replace("component:", "");
            if(RME.hasComponent(tag))
                return true;
            
            return Template.isTag(tag);
        }

        /**
         * Method takes a string and returns true if the given string is a html tag, otherwise returns false.
         * @param {string} tag 
         * @returns True if the given tag is a HTML tag otherwise false.
         */
        static isTag(tag) {
            let tags = {
                a: ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio"],
                b: ["button", "br", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body"],
                c: ["canvas", "caption", "center", "cite", "code", "col", "colgroup"],
                d: ["div", "dd", "dl", "dt", "data", "datalist", "del", "details", "dfn", "dialog"],
                e: ["em", "embed"],
                f: ["form", "fieldset", "figcaption", "figure", "font", "footer", "frame", "frameset"],
                h: ["h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html"],
                i: ["i", "input", "img", "iframe", "ins"],
                k: ["kbd"],
                l: ["label", "li", "legend", "link"],
                m: ["main", "meta", "map", "mark", "meter"],
                n: ["nav", "noframes", "noscript"],
                o: ["option", "object", "ol", "optgroup", "output"],
                p: ["p", "pre", "param", "picture", "progress"],
                q: ["q"],
                r: ["rp", "rt", "ruby"],
                s: ["span", "select", "s", "samp", "script", "section", "small", "source", "strike", "strong", "style", "sub", "summary", "sup", "svg"],
                t: ["table", "textarea", "td","tr", "tt", "th", "thead", "tbody", "tfoot", "template", "time", "title", "track"],
                u: ["u", "ul"],
                v: ["var", "video"],
                w: ["wbr"],
            }
            let i = 0;
            let tagArray = tags[tag.substring(0, 1)];
            while(i < tagArray.length) {
                if(tagArray[i] === tag)
                    return true;
                i++;
            }
            return false;
        }


        /**
         * Function checks if the given key is an attribute and returns true if it is otherwise false.
         * @param {string} key 
         * @param {object} elem 
         * @returns True if the given key as an attribute otherwise false.
         */
        static isAttr(key, elem) {
            /**
             * special cases below.
             */
            if(key === "span" && (Template.isElem(elem.getTagName(), ["col", "colgroup"]))) //special case, span might be an attribute also for these two elements.
                return true;
            else if(key === "label" && (Template.isElem(elem.getTagName(), ["track", "option", "optgroup"])))
                return true;
            else if(key === "title" && (elem.parent() === null || elem.parent().getTagName().toLowerCase() !== "head"))
                return true;
            else if(key === "cite" && (Template.isElem(elem.getTagName(), ["blockquote", "del", "ins", "q"])))
                return true;
            else if(key === "form" && (Template.isElem(elem.getTagName(), ["button", "fieldset", "input", "label", "meter", "object", "output", "select", "textarea"])))
                return true;
            else if(key.indexOf("data") === 0 && (!RME.hasComponent(key) && !Template.isElem(elem.getTagName(), ["data"]) || Template.isElem(elem.getTagName(), ["object"])))
                return true;

            let attrs = {
                a: ["alt", "async", "autocomplete", "autofocus", "autoplay", "accept", "accept-charset", "accpetCharset", "accesskey", "action"],
                b: ["blur"],
                c: ["class", "checked", "content", "contenteditable", "click", "charset", "cols", "colspan", "controls", "coords"],
                d: ["disabled", "display", "draggable", "dropzone", "datetime", "default", "defer", "dir", "dirname", "download"],
                e: ["editable", "enctype"],
                f: ["for", "focus", "formaction"],
                h: ["href", "height", "hidden", "high", "hreflang", "headers", "http-equiv", "httpEquiv"],
                i: ["id", "ismap"],
                k: ["kind"],
                l: ["lang", "list", "loop", "low"],
                m: ["message", "max", "maxlength", "maxLength", "min", "minlength", "minLength", "multiple", "media", "method", "muted"],
                n: ["name", "novalidate"],
                o: ["open", "optimum"],
                p: ["placeholder", "pattern", "poster", "preload"],
                r: ["rel", "readonly", "required", "reversed", "rows", "rowspan"],
                s: ["src", "size", "selected", "step", "style", "styles", "shape", "sandbox", "scope", "sizes", "spellcheck", "srcdoc", "srclang", "srcset", "start"],
                t: ["text", "type", "target", "tabindex", "tabIndex", "translate"],
                u: ["usemap"],
                v: ["value", "visible"],
                w: ["width", "wrap"]
            }

            let i = 0;
            let keys = attrs[key.substring(0, 1)];
            if(keys) {
                while(i < keys.length) {
                    if(keys[i] === key)
                        return true
                    i++;
                }
            }
            return false;
        }

        /**
         * Internal use.
         * Function checks if a given element tag is in a given array of tag names.
         * @param {string} elemTag 
         * @param {array} array 
         * @returns True if the tag is in the given array otherwise false.
         */
        static isElem(elemTag, array) {
            let i = 0;
            while(i < array.length) {
                if(array[i] === elemTag.toLowerCase())
                    return true;
                i++;
            }
            return false;
        }

    }
    return {
        resolve: Template.resolveTemplate,
        isTemplate: Template.isTemplate
    }
}());

export default Template;