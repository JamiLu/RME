import Elem from '../elem';
import Messages from '../messages';
import Util from '../util';
import RMEComponentManager from '../component/manager';
import RMETemplateFragmentHelper from './fragment';

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
        }

        /**
         * Method takes a template as parameter, starts resolving it and returns 
         * a created element tree. 
         * @param {object} template
         * @returns Elem instance element tree.
         */
        setTemplateAndResolve(template, parent) {
            this.template = template;
            if (parent) {
                this.root = parent;
                this.resolve(this.template, this.root, 1);
            } else {
                this.resolve(this.template, this.root, 0);
            }
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
            for (var obj in template) {
                if (template.hasOwnProperty(obj)) {
                    if (round === 0) {
                        this.root = this.resolveElement(obj, template[obj]);
                        if (this.isArray(template[obj])) {
                            ++round;
                            this.resolveArray(template[obj], this.root, round);
                        } else if (!Template.isComponent(obj) && Util.isObject(template[obj])) {
                            ++round;
                            this.resolve(template[obj], this.root, round);
                        } else if (Util.isString(template[obj]) || Util.isNumber(template[obj])) {
                            ++round;
                            this.resolveStringNumber(this.root, template[obj]);
                        } else if (Util.isFunction(template[obj])) {
                            ++round;
                            this.resolveFunction(this.root, template[obj], round);
                        } else if (Template.isAttr(obj, this.root)) {
                            this.resolveAttributes(this.root, obj, this.resolveFunctionBasedAttribute(template[obj]))
                        } else if (this.isEventKeyVal(obj, template[obj])) {
                            this.bindEventToElement(this.root, template[obj], this.root[obj]);
                        }
                    } else {
                        if (Template.isAttr(obj, parent)) {
                            this.resolveAttributes(parent, obj, this.resolveFunctionBasedAttribute(template[obj]));
                        } else if (this.isEventKeyVal(obj, template[obj])) {
                            this.bindEventToElement(parent, template[obj], parent[obj]);
                        } else {
                            ++round;
                            var child = this.resolveElement(obj, template[obj]);
                            if (RMETemplateFragmentHelper.isFragment(child)) {
                                this.resolveFragment(RMETemplateFragmentHelper.resolveFragmentValue(child, template[obj]), parent, round);
                            } else {
                                parent.append(child);
                                if (this.isArray(template[obj])) {
                                    this.resolveArray(template[obj], child, round);
                                } else if (!Template.isComponent(obj) && Util.isObject(template[obj])) {
                                    this.resolve(template[obj], child, round);
                                } else if (Util.isString(template[obj]) || Util.isNumber(template[obj])) {
                                    this.resolveStringNumber(child, template[obj]);
                                } else if (Util.isFunction(template[obj])) {
                                    this.resolveFunction(child, template[obj], round);
                                }
                            }
                        }
                    }
                }
            }
        }

        bindEventToElement(elemInstance, sourceFunction, targetFunction) {
            targetFunction.call(elemInstance, sourceFunction);
        }

        /**
         * Method receives three parameters that represent pieces of the HTML tree. Method resolves
         * given parameters accordingly and eventually HTML nodes are appended into the HTML tree.
         * @param {*} fragment 
         * @param {*} parent 
         * @param {*} round 
         */
        resolveFragment(fragment, parent, round) {
            if (this.isArray(fragment)) {
                this.resolveArray(fragment, parent, round);
            } else if (Util.isFunction(fragment)) {
                const ret = fragment.call(parent, parent);
                if (this.isArray(ret))
                    this.resolveArray(ret, parent, round);
                else
                    Template.resolveToParent(ret, parent);
            } else {
                this.resolve(fragment, parent, round);
            }
        }

        /**
         * Method resolves function based attribute values. If the given attribute value
         * is type function then the function is invoked and its return value will be returned otherwise
         * the given attribute value is returned.
         * @param {*} attr 
         * @returns Resolved attribute value.
         */
        resolveFunctionBasedAttribute(attrValue) {
            return Util.isFunction(attrValue) ? attrValue.call() : attrValue;
        }


        /**
         * Checks if the given parameter is an Array.
         * 
         * @param {*} nextValue 
         * @returns True if the given value is an Array.
         */
        isArray(nextValue) {
            return Util.isArray(nextValue) || (!Util.isEmpty(nextValue) && Util.isArray(nextValue._rme_type_));
        }

        /**
         * Method resolves a given array template elements.
         * @param {array} array
         * @param {parent} parent
         * @param {round}
         */
        resolveArray(nextValue, parent, round) {
            let array = nextValue._rme_type_ || nextValue;
            if (nextValue._rme_props_) {
                this.resolve(nextValue._rme_props_, parent, round);
            }
            let i = 0;                
            while (i < array.length) {
                let o = array[i];
                for (let key in o) {
                    if (o.hasOwnProperty(key)) {
                        if (Util.isObject(o[key])) {
                            this.resolve(o, parent, round);
                        } else if (Util.isString(o[key]) || Util.isNumber(o[key])) {
                            let el = this.resolveElement(key);
                            this.resolveStringNumber(el, o[key]);
                            parent.append(el);
                        } else if (Util.isFunction(o[key])) {
                            let el = this.resolveElement(key);
                            this.resolveFunction(el, o[key]);
                            parent.append(el);
                        }
                    }
                }
                i++;
            }
        }

        /**
         * Function will set String or Number values for the given element.
         * @param {object} elem 
         * @param {*} value 
         */
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
        resolveFunction(elem, func, round) {
            let ret = func.call(elem, elem);
            if (!Util.isEmpty(ret)) {
                if (Util.isString(ret) && this.isMessage(ret)) {
                    this.resolveMessage(elem, ret);
                } else if (Util.isString(ret) || Util.isNumber(ret)) {
                    elem.setText(ret);
                } else if(this.isArray(ret)) {
                    this.resolveArray(ret, elem, round)
                } else if (Util.isObject(ret)) {
                    this.resolve(ret, elem, round);
                }
            }
        }

        /**
         * Function will check if the given message is actually a message or not. The function
         * will return true if it is a message otherwise false is returned.
         * @param {string} message 
         * @returns True if the given message is actually a message otherwise returns false.
         */
        isMessage(message) {
            message = this.normalizeMessageString(message);
            return Util.notEmpty(Messages.message(message)) && Messages.message(message) != message;
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
            var el = Template.getElementName(tag);
            if (RMEComponentManager.hasComponent(el)) {
                el = el.replace(/component:/, "");
                resolved = RMEComponentManager.getComponent(el, obj);
                if (Util.isEmpty(resolved))
                    return resolved;
            } else if (Util.isEmpty(el)) {
                throw `Template resolver could not find element: ${el} from the given tag: ${tag}`;
            } else if (RMETemplateFragmentHelper.isFragmentKey(el)) {
                return 'fragment'
            } else {
                resolved = new Elem(el);
            }

            match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id
            if (!Util.isEmpty(match))
                resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));

            match = this.cutAttributesIfFound(tag).match(/\.[a-zA-Z-0-9\-]+/g); //find classes
            if (!Util.isEmpty(match)) 
                resolved.addClasses(match.join(" ").replace(/\./g, ""));

            match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_\/\.&%@!?£$+¤|;\\<\\>\\{}"]+\]/g); //find attributes
            if (!Util.isEmpty(match))
                resolved = this.addAttributes(resolved, match);

            return resolved;
        }

        /**
         * Function will cut off the element tag attributes if found.
         * @param {string} tag 
         * @returns Element tag without attributes.
         */
        cutAttributesIfFound(tag) {
            const idx = tag.indexOf('[');
            return tag.substring(0, idx > 0 ? idx : tag.length);
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
                this.resolveAttributes(elem, key, val);
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
            switch (key) {
                case 'id':
                    elem.setId(val);
                    break;
                case 'class':
                    elem.addClasses(val || '');
                    break;
                case 'text':
                    elem.setText(val || '');
                    break;
                case 'message':
                    this.resolveMessage(elem, val);
                    break;
                case 'placeholder':
                    this.resolvePlaceholder(elem, key, val);
                    break;
                case 'content':
                    this.resolveContent(elem, key, val);
                    break;
                case 'tabIndex':
                    elem.setTabIndex(val);
                    break;
                case 'editable':
                    elem.setEditable(val);
                    break;
                case 'checked':
                    elem.setChecked(val);
                    break;
                case 'disabled':
                    elem.setDisabled(val);
                    break;
                case 'selected':
                    elem.setSelected(val);
                    break;
                case 'visible':
                    elem.setVisible(val);
                    break;
                case 'display':
                    elem.display(val);
                    break;
                case 'styles':
                    elem.setStyles(val);
                    break;
                case 'click':
                    elem.click();
                    break;
                case 'focus':
                    elem.focus();
                    break;
                case 'blur':
                    elem.blur();
                    break;
                case 'maxLength':
                    elem.setMaxLength(val);
                    break;
                case 'minLength':
                    elem.setMinLength(val);
                    break;
                default: 
                    this.resolveDefault(elem, key, val);
            }
        }

        /**
         * Resolves the placeholder. The method will first check if the value is a message.
         * @param {object} elem 
         * @param {string} key 
         * @param {*} val 
         */
        resolvePlaceholder(elem, key, val) {
            const params = this.getMessageParams(val);
            const message = this.normalizeMessageString(val);
            elem.setAttribute(key, this.isMessage(val) ? Messages.message(message, params) : val);
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

            elem.message(this.normalizeMessageString(message), this.getMessageParams(message));
        }

        /**
         * Function will return message parameters in an array if found.
         * @param {string} message 
         * @returns Message params in the array or null if no params found.
         */
        getMessageParams(message) {
            let match = this.getMessageParameterString(message);
            match = match && match.join().replace(/({|}|:|;)/g, match.join()).split(match.join());
            return match && match.filter(Util.notEmpty);
        }

        /**
         * Get the parameter match array from the message string if found.
         * @param {string} message 
         * @returns The match array or null.
         */
        getMessageParameterString(message) {
            return message.match(/\:?(\{.*\}\;?)/g);
        }

        /**
         * Removes parameter string from the message string if present.
         * @param {string} message 
         * @returns The normalized message string.
         */
        normalizeMessageString(message) {
            const params = this.getMessageParameterString(message);
            return Util.notEmpty(params) ? message.replace(params.join(), '') : message;
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
         * Function will try to parse an element name from the given string. If the given string
         * is no empty a matched string is returned. If the given string is empty nothing is returned
         * @param {string} str 
         * @returns The matched string.
         */
        static getElementName(str) {
            if (Util.notEmpty(str))
                return str.match(/component:?[a-zA-Z0-9_]+|[a-zA-Z0-9_]+/).join();
        }

        /**
         * Checks that the given component exist with the given key or the key starts with component keyword and the component exist. 
         * @param {string} key
         * @returns True if the component exist or the key contains component keyword and exist, otherwise false.
         */
        static isComponent(key) {
            return RMEComponentManager.hasComponent(Template.getElementName(key));
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

        /**
         * Method takes a template and a parent element as parameter and it resolves the given template
         * into the given parent.
         * @param {*} template
         * @param {*} parent
         * @returns Elem instance element tree.
         */
        static resolveToParent(template, parent) {
            return Template.create().setTemplateAndResolve(template, parent);
        }

        /**
         * Method will apply the properties given to the element. Old properties are overridden.
         * @param {object} elem 
         * @param {object} props 
         * @param {object} oldProps
         */
        static updateElemProps(elem, props, oldProps) {
            let mashed = Template.mashElemProps(props, oldProps);
            const templater = Template.create();
            for (let p in mashed) {
                if (mashed.hasOwnProperty(p)) {
                    if (templater.isEventKeyVal(p, mashed[p])) {
                        elem[p].call(elem, mashed[p]); //element event attribute -> elem, event function
                    } else if (p === 'class') {
                        elem.updateClasses(mashed[p] || '');
                    } else if (p === 'value') {
                        elem.setAttribute(p, mashed[p]);
                        elem.setValue(mashed[p]);
                    } else {
                        templater.resolveAttributes(elem, p, mashed[p]);
                    }
                }
            }
        }

        static mashElemProps(newProps, oldProps) {
            let props = {};
            for (let p in oldProps) {
                if (oldProps.hasOwnProperty(p)) {
                    if (!newProps[p] && oldProps[p]) {
                        props[p] = p === 'style' ? '' : undefined
                    }
                }
            }
            props = {
                ...props,
                ...newProps
            }
            return props;
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
         * @returns True if the given tag is a HTML tag or a RME component otherwise false.
         */
        static isTagOrComponent(tag) {
            return Template.isComponent(tag) || Template.isTag(Template.getElementName(tag));
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
            let tagArray = tags[tag.charAt(0)];
            if (tagArray) {
                while (i < tagArray.length) {
                    if (tagArray[i] === tag)
                        return true;
                    i++;
                }
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
            if (key === "span" && (Template.isElem(elem.getTagName(), ["col", "colgroup"]))) //special case, span might be an attribute also for these two elements.
                return true;
            else if (key === "label" && (Template.isElem(elem.getTagName(), ["track", "option", "optgroup"])))
                return true;
            else if (key === "title" && (elem.parent() === null || elem.parent().getTagName().toLowerCase() !== "head"))
                return true;
            else if (key === "cite" && (Template.isElem(elem.getTagName(), ["blockquote", "del", "ins", "q"])))
                return true;
            else if (key === "form" && (Template.isElem(elem.getTagName(), ["button", "fieldset", "input", "label", "meter", "object", "output", "select", "textarea"])))
                return true;
            else if (key.indexOf("data") === 0 && (!RMEComponentManager.hasComponent(key) && !Template.isElem(elem.getTagName(), ["data"]) || Template.isElem(elem.getTagName(), ["object"])))
                return true;

            let attrs = {
                a: ["alt", "async", "autocomplete", "autofocus", "autoplay", "accept", "accept-charset", "accpetCharset", "accesskey", "action"],
                b: ["blur"],
                c: ["class", "checked", "content", "contenteditable", "crossorigin", "crossOrigin", "click", "charset", "cols", "colspan", "controls", "coords"],
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
            if (keys) {
                while(i < keys.length) {
                    if(keys[i] === key)
                        return true
                    i++;
                }
            }

            if (Template.isAriaKey(key)) {
                return true;
            }

            return false;
        }

        /**
         * Function takes an attribute key as a parameter and checks if the key is an aria key.
         * The function will return true if the key is an aria key otheriwise false is returned.
         * @param {*} key 
         * @returns True if the given key is an aria key otherwise false is returned.
         */
        static isAriaKey(key) {
            if (key.indexOf('aria') === 0) {
                const ariaKeys = ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete',
                                'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked',
                                'aria-colcount', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls',
                                'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled',
                                'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed',
                                'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label',
                                'aria-labelledby', 'aria-level', 'aria-live', 'aria-multiline', 'aria-multiselectable',
                                'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed',
                                'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription',
                                'aria-rowcount', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected',
                                'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow',
                                'aria-valuetext'];

                const normalizedKey = Template.normalizeKey(key);
                return Boolean(ariaKeys.find(ariaKey => ariaKey === normalizedKey));
            }
            return false;
        }

        static normalizeKey(key) {
            const capital = key.search(/[A-Z]/);
            return capital > -1 ? `${key.substring(0, capital)}-${key.substr(capital).toLowerCase()}` : key;
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
        isTemplate: Template.isTemplate,
        isTag: Template.isTag,
        updateElemProps: Template.updateElemProps,
        resolveToParent: Template.resolveToParent
    }
}());

export default Template;