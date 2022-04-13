import Template from '../template';
import RMEElemTemplater from './templater';
import Messages from '../messages';
import Util from '../util';

let Elem = (function() {
    /**
     * Elem class is a wrapper class for HTMLDocument element JavaScript object. This object constructor 
     * takes one parameter that can be either type of a string or a HTMLDocument. If the parameter is type of the string
     * then a new HTMLDocument of that type will be created otherwise if the type is the HTMLDocument then 
     * that HTMLDocument will be wrapped with this Elem instance and new element wont be created. All setter methods and event listener
     * methods will return an instance of this class which enables chaining of methods that makes code even more compact. This class also
     * has many shortcut helper methods defined. 
     * 
     * The most notabled method of this class is probably render method. This method is very special method that renders other Elem objects. 
     * The main principle is that only an Elem object may render other child Elem objects. The render method renders objects dynamically.
     */
    class Elem {
        constructor(type) {
            if(Util.isString(type)) {
                this.html = document.createElement(type);
            } else if(type.nodeType !== undefined && type.ownerDocument !== undefined && type.nodeType >= 1 && type.ownerDocument instanceof HTMLDocument) {
                this.html = type;
            } else {
                throw "type must be a string or a HTMLDocument";
            }
        }

        /**
         * Set text of this element.
         * 
         * @param {String} text 
         * @returns Elem instance.
         */
        setText(text) {
            if(this.html.hasChildNodes()) {
                this.html.replaceChild(document.createTextNode(text), this.html.childNodes[0]);
            } else {
                this.html.appendChild(document.createTextNode(text));
            }
            return this;
        }

        /**
         * Get text of this element.
         * @returns text of this element.
         */
        getText() {
            let text = "";
            this.html.childNodes.forEach(node => {
                if(node.nodeType === 3) {
                    text = node.nodeValue;
                }
                    
            });
            return text;
        }

        /**
         * Get text/content of this element.
         * 
         * @returns text or content of this element.
         */
        getContent() {
            return this.html.innerHTML;
        }

        /**
         * Set content that can be text or html.
         * 
         * @param {String} html 
         * @returns Elem instance.
         */
        setContent(html) {
            this.html.innerHTML = html;
            return this;
        }

        /**
         * Set value of this element.
         * 
         * @param {String} value 
         * @returns Elem instance.
         */
        setValue(value) {
            this.html.value = value;
            return this;
        }

        /**
         * Get value of this element.
         * 
         * @returns value of this element.
         */
        getValue() {
            return this.html.value;
        }

        /**
         * Set id of this element.
         * 
         * @param {String} id 
         * @returns Elem instance.
         */
        setId(id) {
            this.html.id = id;
            return this;
        }

        /**
         * Get id of this element.
         * 
         * @returns id of this element.
         */
        getId() {
            return this.html.id;
        }

        /**
         * Append an element inside this element.
         * 
         * @param {Elem} elem 
         * @returns Elem instance.
         */
        append(elem) {
            if (Util.notEmpty(elem)) {
                this.html.appendChild(Template.isTemplate(elem) ? Template.resolve(elem).dom() : elem.dom());
            }
            
            return this;
        }

        /**
         * Remove an element from this element.
         * 
         * @param {Elem} elem 
         * @returns Elem isntance.
         */
        remove(elem) {
            this.html.removeChild(elem.dom());
            return this;
        }

        /**
         * Replace this element with a new element.
         * 
         * @param {Elem} newElem 
         * @returns Elem instance.
         */
        replace(newElem) {
            this.html.parentElement.replaceChild(newElem.dom(), this.html);
            return this;
        }

        /**
         * Insert a new element before this element.
         * 
         * @param {Elem} newElem 
         * @returns Elem instance.
         */
        before(newElem) {
            this.html.parentElement.insertBefore(newElem.dom(), this.html);
            return this;
        }

        /**
         * Insert a new elem after this element.
         * 
         * @param {Elem} newElem 
         * @returns Elem isntance.
         */
        after(newElem) {
            if(this.html.nextElementSibling !== null)
                this.html.parentElement.insertBefore(newElem.dom(), this.html.nextElementSibling);
            else
                this.html.parentElement.appendChild(newElem.dom());
            return this;
        }

        /**
         * @returns String presentation of this component.
         */
        toString() {
            return "<"+this.getTagName().toLowerCase()+">"+this.getContent()+"</"+this.getTagName().toLowerCase()+">";
        }

        toLiteralString() {
            return RMEElemTemplater.toLiteralString(this);
        }

        /**
         * Converts this Elem object to JSON template object.
         * @param {boolean} deep default true if true children will also be templated.
         * @returns Template representation of the element tree.
         */
        toTemplate(deep) {
            return RMEElemTemplater.toTemplate(this, deep);
        }

        /**
         * Returns properties of an Elem in an object. If a boolean json is true
         * then the returned object is returned as JSON string.
         * @param {boolean} json 
         * @returns Properties of the elem in the properties object.
         */
        getProps(json) {
            if(Util.isBoolean(json) && json === true)
                return JSON.stringify(RMEElemTemplater.getElementProps(this));
            else
                return RMEElemTemplater.getElementProps(this);
        }

        /**
         * Method will override old properties with the given properties.
         * @param {object} props 
         * @returns Elem instance.
         */
        setProps(props) {
            Template.updateElemProps(this, props, this.getProps());
            return this;
        }

        /**
         * Method is able to render child elements dynamically as illustrated below:
         * Renders: [Elem, Elem, Elem.....] | Elem, Elem, Elem | [Elem, Elem], Elem.
         * 
         * Empty arrays, null, or undefined values will not be rendered.
         * If this method is invoked empty (without parameters), with empty array, undefined or null value
         * then this element will render itself empty. As this method renders given elements dynamically and
         * renderable content may change by user written application logic.
         * 
         * @param {Elem} elems 
         * @returns Elem instance.
         */
        render(...elems) {
            var newState = [];
            var i = 0;
            var max = elems.length;
            while(i < max) {
                if(Util.isArray(elems[i]))
                    newState = newState.concat(elems[i]);
                else
                    newState.push(elems[i]);
                i++;
            }
            if(!RenderHelper.isNewStateEqualToPrevState(newState)) {
                RenderHelper.setPrevState(null);
                while(this.html.firstChild) {
                    this.html.removeChild(this.html.firstChild);
                }
                i = 0;
                max = newState.length;
                while(i < max) {
                    if(!Util.isEmpty(newState[i]))
                        this.append(newState[i]);
                    i++;
                }
            }
            RenderHelper.setPrevState(newState);
            return this;
        }

        /**
         * Get an array of children of this element. Returns the array of child elements wrapped in Elem instance.
         * 
         * @returns An array of child elements wrapped in Elem instance.
         */
        getChildren() {
            return Elem.wrapElems(this.html.children);
        }

        /**
         * Uses CSS selector to find all matching child elements in this Element. Found elements will be wrapped in an Elem instance.
         * @param {string} selector 
         * @returns An array of Elem instances or a single Elem instance.
         */
        get(selector) {
            return Elem.wrapElems(this.html.querySelectorAll(selector));
        }
    
        /**
         * Uses CSS selector to find the first match child element in this Element.
         * Found element will be wrapped in an Elem instance.
         * @param {string} selector 
         * @returns An Elem instance.
         */
        getFirst(selector) {
            try {
                return Elem.wrap(this.html.querySelector(selector));
            } catch (e) {}
        }
    
        /**
         * Uses a HTML Document tag name to find matching elements in this Element e.g. div, span, p.
         * Found elements will be wrapped in an Elem instance.
         * If found many then an array of Elem instanes are returned otherwise a single Elem instance.
         * @param {string} tag 
         * @returns An array of Elem instances or a single Elem instance.
         */
        getByTag(tag) {
            return Elem.wrapElems(this.html.getElementsByTagName(tag));
        }
    
        /**
         * Uses a HTML Document element class string to find matching elements in this Element e.g. "main emphasize-green".
         * Method will try to find elements having any of the given classes. Found elements will be wrapped in an Elem instance.
         * If found many then an array of Elem instances are returned otherwise a single Elem instance.
         * @param {string} classname 
         * @returns An array of Elem instances or a single Elem instance.
         */
        getByClass(classname) {
            return Elem.wrapElems(this.html.getElementsByClassName(classname));
        }

        /**
         * Set a title of this element.
         * 
         * @param {String} text 
         * @returns Elem instance.
         */
        setTitle(text) {
            this.html.title = text;
            return this;
        }

        /**
         * Get a title of this element.
         * 
         * @returns The title of this element.
         */
        getTitle() {
            return this.html.title;
        }

        /**
         * Set a tab index of this element.
         * 
         * @param {Number} idx 
         * @returns Elem instance.
         */
        setTabIndex(idx) {
            this.setAttribute('tabindex', idx);
            return this;
        }

        /**
         * Get a tab index of this element.
         * 
         * @returns A tab index value of this element.
         */
        getTabIndex() {
            return this.getAttribute('tabindex');
        }

        /**
         * Get a tag name of this element.
         * 
         * @returns A tag name of this element.
         */
        getTagName() {
            return this.html.tagName;
        }

        /**
         * Set an attribute of this element.
         * 
         * @param {String} attr Attribute
         * @param {String} value Value
         * @returns Elem isntance.
         */
        setAttribute(attr, value) {
            var attribute = document.createAttribute(attr);
            attribute.value = value;
            this.html.setAttributeNode(attribute);
            return this;
        }

        /**
         * Get an attribute of this element.
         * 
         * @param {String} attr 
         * @returns a value of the attribute.
         */
        getAttribute(attr) {
            return this.html.getAttribute(attr);
        }

        /**
         * Removes an attribute of this element.
         * 
         * @param {String} attr 
         * @returns Elem instance.
         */
        removeAttribute(attr) {
            let attrNode = this.html.getAttributeNode(attr);
            if (attrNode)
                this.html.removeAttributeNode(attrNode);
            return this;
        }

        /**
         * Set a name of this element.
         * 
         * @param {String} name 
         * @returns Elem instance.
         */
        setName(name) {
            this.setAttribute('name', name);
            return this;
        }

        /**
         * Get a name of this element.
         * 
         * @returns name string of this element.
         */
        getName() {
            return this.getAttribute('name');
        }


        /**
         * Set a type of this element.
         * 
         * @param {String} type 
         * @returns Elem instance.
         */
        setType(type) {
            this.setAttribute('type', type);
            return this;
        }

        /**
         * Get a type of this element.
         * 
         * @returns type string of this element.
         */
        getType() {
            return this.getAttribute('type');
        }

        /**
         * Set a source of this element.
         * 
         * @param {String} source 
         * @returns Elem instance.
         */
        setSource(source) {
            this.setAttribute('src', source);
            return this;
        }

        /**
         * Get a source of this element.
         * 
         * @returns source string of this element.
         */
        getSource() {
            return this.getAttribute('src');
        }

        /**
         * Set a href of this element.
         * 
         * @param {String} href 
         * @returns Elem instance.
         */
        setHref(href) {
            this.setAttribute('href', href);
            return this;
        }

        /**
         * Get a href of this element.
         * 
         * @returns href of this element.
         */
        getHref() {
            return this.getAttribute('href');
        }

        /**
         * Set a placeholder of this element.
         * 
         * @param {String} placeholder 
         * @returns Elem instance.
         */
        setPlaceholder(placeholder) {
            this.setAttribute('placeholder', placeholder);
            return this;
        }

        /**
         * Get a placeholder of this element.
         * 
         * @returns placeholder of this element.
         */
        getPlaceholder() {
            return this.getAttribute('placeholder');
        }

        /**
         * Sets size of this element.
         * 
         * @param {*} size 
         * @returns Elem instance.
         */
        setSize(size) {
            this.setAttribute('size', size);
            return this;
        }

        /**
         * Get size of this element.
         * 
         * @returns size of this element.
         */
        getSize() {
            return this.getAttribute('size');
        }

        /**
         * Set maximum length of an input field.
         * @param {number} length 
         * @returns Elem instance.
         */
        setMaxLength(length) {
            this.setAttribute('maxlength', length);
            return this;
        }

        /**
         * @returns Max length of this element.
         */
        getMaxLength() {
            return this.getAttribute('maxlength');
        }

        /**
         * Set minimum length of an input field.
         * @param {number} length 
         * @returns Elem instance.
         */
        setMinLength(length) {
            this.setAttribute('minlength', length);
            return this;
        }

        /**
         * @returns Min lenght of this element.
         */
        getMinLength() {
            return this.getAttribute('minlength');
        }

        /**
         * Set data to be stored into this dom element by a given key.
         * @param {string} key 
         * @param {*} value 
         * @returns Elem instance.
         */
        setData(key, value) {
            this.html.dataset[key] = value;
            return this;
        }

        /**
         * Get data by a given key from this dom element.
         * @param {string} key 
         * @returns Retrieved data.
         */
        getData(key) {
            return this.html.dataset[key];
        }

        /**
         * Set this element content editable.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setEditable(boolean) {
            this.setAttribute('contenteditable', boolean);
            return this;
        }

        /**
         * Get this element content editable.
         * 
         * @returns content editable state of this element.
         */
        getEditable() {
            return this.getAttribute('contenteditable');
        }

        /**
         * Set this element disabled.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setDisabled(boolean) {
            if ((Util.isBoolean(boolean) && boolean === true)
                || (Util.isString(boolean) && boolean === 'disabled')) {
                this.setAttribute('disabled', 'disabled');
            } else {
                this.removeAttribute('disabled');
            }
            return this;
        }

        /**
         * Get this element disabled state.
         * 
         * @returns disabled state of this element.
         */
        getDisabled() {
            return this.getAttribute('disabled');
        }

        /**
         * Set this element checked.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setChecked(boolean) {
            if ((Util.isBoolean(boolean) && boolean === true)
            || (Util.isString(boolean) && boolean === 'checked')) {
                this.setAttribute('checked', 'checked');
                this.html.checked = true;
            } else {
                this.removeAttribute('checked');
                this.html.checked = false;
            }
            return this;
        }

        /**
         * Get this element checked state.
         * 
         * @returns checked state of this element.
         */
        getChecked() {
            return this.getAttribute('checked');
        }

        /**
         * Set this element selected.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setSelected(boolean) {
            if (Util.isBoolean(boolean) && boolean === true 
                || (Util.isString(boolean) && boolean === 'selected')) {
                this.setAttribute('selected', 'selected');
            } else {
                this.removeAttribute('selected')
            }
            return this;
        }

        /**
         * Get this element selected selected attribute value.
         * 
         * @returns selected attribute value.
         */
        getSelected() {
            return this.getAttribute('selected');
        }

        /**
         * Add classes to this element.
         * 
         * @param {String} classes 
         * @returns Elem instance.
         */
        addClasses(classes) {
            let addClassesArray = classes.trim().split(' ');
            let origClassName = this.getClasses();
            let origClassesArray = origClassName.split(' ');

            addClassesArray = addClassesArray
                .filter(clazz => origClassName.match(clazz) === null)

            this.html.className = origClassesArray.concat(addClassesArray).join(' ').trim();
            return this;
        }

        /**
         * Update classes on this element. Previous classes are overridden.
         * 
         * @param {String} classes 
         */
        updateClasses(classes) {
            this.addClasses(classes);
            let origClassName = this.getClasses();
            let origClassesArray = origClassName.split(' ');
            let updateClassesArray = [];

            classes.trim().split(' ')
                .forEach(clazz => {
                    if (origClassesArray.filter(cl => cl === clazz).length > 0)
                        updateClassesArray.push(clazz);
                });

            this.html.className = updateClassesArray.join(' ').trim();
            return this;
        }

        /**
         * Remove classes from this element.
         * 
         * @param {String} classes 
         * @returns Elem instance.
         */
        removeClasses(classes) {
            let toRm = classes.trim().split(" ");
            let origClass = `${this.getClasses()}`;
            let i = 0;
            while(i < toRm.length) {
                let clazz = toRm[i];
                if(origClass.match(`${clazz}`) !== null)
                    origClass = origClass.replace(clazz, "").trim();
                i++;
            }
            this.html.className = origClass.trim();
            return this;
        }

        /**
         * Toggle classes of this element. This method removes existing and adds non existing classes accordingly. 
         * If given classes exist then they will be removed. If given classes does not exist then they will be added.
         * 
         * @returns Elem instance.
         */
        toggleClasses(classes) {
            let cArr = classes.split(" ");
            let origClass = `${this.getClasses()}`;
            let toAdd = "";
            let toRm = "";
            let i = 0;
            while(i < cArr.length) {
                if(origClass.match(`${cArr[i]}`) !== null)
                    toRm += " "+cArr[i];
                else
                    toAdd += " "+cArr[i];
                i++;
            }
            this.addClasses(toAdd.trim());
            this.removeClasses(toRm.trim());
            return this;
        }

        /**
         * Get classes string of this element.
         * 
         * @returns class string of this element.
         */
        getClasses() {
            return this.html.className;
        }

        /**
         * Set styles of this element in camelCase in the JSON notation e.g. {height: "10px", maxHeight: "30px",...}
         * 
         * @param {Object} styleMap 
         * @returns Elem instance.
         */
        setStyles(styleMap) {
            for(var style in styleMap) {
                if(styleMap.hasOwnProperty(style))
                    this.html.style[style] = styleMap[style];
            }
            return this;
        }

        /**
         * Get style of this element. 
         * 
         * @param {String} styleName Style name in camelCase if necessary e.g. maxHeight
         * @returns value of the given style of this element.
         */
        getStyle(styleName) {
            return this.html.style[styleName];
        }

        /**
         * Set visibility of this element hidden or visible.
         * true = visible, false = hidden
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setVisible(boolean) {
            this.html.style.visibility = boolean ? "" : "hidden";
            return this;
        }

        /**
         * Set display state of this element initial or none.
         * true = initial, false = none
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        display(boolean) {
            this.html.style.display = boolean ? "" : "none";
            return this;
        }

        /**
         * Set this element draggable.
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setDraggable(boolean) {
            this.setAttribute("draggable", boolean);
            return this;
        }

        /**
         * Set translated text of this element.
         * @param {string} message 
         * @param {*} params 
         */
        message(message, ...params) {
            let i = 0;
            let paramArray = [];
            while(i < params.length) {
                if(Util.isArray(params[i]))
                    paramArray = paramArray.concat(params[i]);
                else
                    paramArray.push(params[i]);
                i++;
            }
            paramArray.push(this);
            this.setText(Messages.message(message, paramArray));
            return this;
        }

        /**
         * Do click on this element.
         * @returns Elem instance.
         */
        click() {
            Util.setTimeout(() => this.html.click());
            return this;
        }

        /**
         * Do focus on this element.
         * @returns Elem instance.
         */
        focus() {
            Util.setTimeout(() => this.html.focus());
            return this;
        }

        /**
         * Do blur on this element.
         * @returns Elem instance.
         */
        blur() {
            Util.setTimeout(() => this.html.blur());
            return this;
        }

        /**
         * Clones this element and child elements if deep true. Returned clone will be wrapped in Elem instance.
         * 
         * @param {boolean} deep if true children will be cloned too.
         * @returns a clone of this element wrapped in Elem instance. If deep is true children will be cloned also.
         */
        clone(deep) {
            return Elem.wrap(this.html.cloneNode(deep));
        }

        /**
         * @returns HTML Document Element that this element contains.
         */
        dom() {
            return this.html;
        }

        /**
         * @returns A duplicated Elem object
         */
        duplicate() {
            return Template.resolve(this.toTemplate());
        }

        /**
         * @returns height of this element.
         */
        height() {
            return this.html.height;
        }

        /**
         * @returns width of this element.
         */
        width() {
            return this.html.width;
        }

        /**
         * @returns position from top relative to offsetParent.
         */
        top() {
            return this.html.offsetTop;
        }

        /**
         * @returns position from left relative to offsetParent.
         */
        left() {
            return this.html.offsetLeft;
        }

        /**
         * @returns a parent of this element wrapped in Elem instance or null if no parent.
         */
        parent() {
            return this.html.parentElement !== null ? Elem.wrap(this.html.parentElement) : null;
        }

        /**
         * @returns a next element of this element wrapped in Elem instance or null if no next.
         */
        next() {
            return this.html.nextElementSibling !== null ? Elem.wrap(this.html.nextElementSibling) : null;
        }

        /**
         * @returns a previous element of this element wrapped in Elem instance or null if no previous.
         */
        previous() {
            return this.html.previousElementSibling !== null ? Elem.wrap(this.html.previousElementSibling) : null;
        }

        /**
         * @returns a first child element of this element wrapped in Elem instance or null if no children.
         */
        getFirstChild() {
            return this.html.firstElementChild !== null ? Elem.wrap(this.html.firstElementChild) : null;
        }

        /**
         * @returns a last child element of this element wrapped in Elem instance or null if no children.
         */
        getLastChild() {
            return this.html.lastElementChild !== null ? Elem.wrap(this.html.lastElementChild) : null;
        }

        /**
         * Method does es5 standard extension to an element. This method can be used to add additional functionality
         * to this element. Method returns the given child reference.
         * @param {object} child 
         * @returns child instance.
         */
        extend(child) {
            child.prototype = this;
            child.prototype.constructor = child;
            return child;
        }

        //EVENTS BELOW

        //Animation events
        onAnimationStart(handler) {
            this.html.onanimationstart = handler;
            return this;
        }

        onAnimationIteration(handler) {
            this.html.onanimationiteration = handler;
            return this;
        }

        onAnimationEnd(handler) {
            this.html.onanimationend = handler;
            return this;
        }

        onTransitionEnd(handler) {
            this.html.ontransitionend = handler;
            return this;
        }

        //Drag events
        /**
         * Adds onDrag listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDrag(handler) {
            this.html.ondrag = handler;
            return this;
        }

        /**
         * Adds onDragEnd listener to this element.
         * @param {function} handler 
         * @return Elem instance.
         */
        onDragEnd(handler) {
            this.html.ondragend = handler;
            return this;
        }

        /**
         * Adds onDragEnter listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDragEnter(handler) {
            this.html.ondragenter = handler;
            return this;
        }

        /**
         * Adds onDragOver listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDragOver(handler) {
            this.html.ondragover = handler;
            return this;
        }

        /**
         * Adds onDragStart listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDragStart(handler) {
            this.html.ondragstart = handler;
            return this;
        }

        /**
         * Adds onDrop listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDrop(handler) {
            this.html.ondrop = handler;
            return this;
        }

        //Mouse events
        /**
         * Adds onClick listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onClick(handler) {
            this.html.onclick = handler;
            return this;
        }

        /**
         * Adds onDoubleClick listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDoubleClick(handler) {
            this.html.ondblclick = handler;
            return this;
        }

        /**
         * Adds onContextMenu listener to this element. Usually fired by mouse right click.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onContextMenu(handler) {
            this.html.oncontextmenu = handler;
            return this;
        }

        /**
         * Adds onMouseDown listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseDown(handler) {
            this.html.onmousedown = handler;
            return this;
        }

        /**
         * Adds onMouseEnter listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseEnter(handler) {
            this.html.onmouseenter = handler;
            return this;
        }

        /**
         * Adds onMouseLeave listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseLeave(handler) {
            this.html.onmouseleave = handler;
            return this;
        }

        /**
         * Adds onMouseMove listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseMove(handler) {
            this.html.onmousemove = handler;
            return this;
        }

        /**
         * Adds onMouseOver listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseOver(handler) {
            this.html.onmouseover = handler;
            return this;
        }

        /**
         * Adds onMouseOut listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseOut(handler) {
            this.html.onmouseout = handler;
            return this;
        }

        /**
         * Adds onMouseUp listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onMouseUp(handler) {
            this.html.onmouseup = handler;
            return this;
        }

        /**
         * Adds onWheel listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onWheel(handler) {
            this.html.onwheel = handler;
            return this;
        }

        //UI events
        /**
         * Adds onScroll listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onScroll(handler) {
            this.html.onscroll = handler;
            return this;
        }

        /**
         * Adds onResize listener to this element (supported: body).
         * @param {function} handler 
         */
        onResize(handler) {
            this.html.onresize = handler;
            return this;
        }

        /**
         * Adds onError listener to this element (supported: img, input[type=img], object, link, script).
         * Is fired when an error occurs while downloading an external file.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onError(handler) {
            this.html.onerror = handler;
            return this;
        }

        /**
         * Adds onLoad listener to this element (supported: body, img, input[type=img], script, link, style, frame, iframe).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onLoad(handler) {
            this.html.onload = handler;
            return this;
        }

        /**
         * Adds onUnload listener to this element. Is fired when the page is unloaded or browser window is closed (supported: body).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onUnload(handler) {
            this.html.onunload = handler;
            return this;
        }

        /**
         * Adds onBeforeUnload listener to this element. Is fired before unload (supported: body).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onBeforeUnload(handler) {
            this.html.onbeforeunload = handler;
            return this;
        }

        //Key events
        /**
         * Adds onKeyUp listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onKeyUp(handler) {
            this.html.onkeyup = handler;
            return this;
        }

        /**
         * Adds onKeyDown listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onKeyDown(handler) {
            this.html.onkeydown = handler;
            return this;
        }

        /**
         * Adds onKeyPress listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onKeyPress(handler) {
            this.html.onkeypress = handler;
            return this;
        }

        /**
         * Adds onInput listener to this element (supported: input, textarea).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onInput(handler) {
            this.html.oninput = handler;
            return this;
        }

        //Events (changing state)
        /**
         * Adds onChange listener to this element (supported: input, select, textarea).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onChange(handler) {
            this.html.onchange = handler;
            return this;
        }

        /**
         * Adds onSubmit listener to this element (supported: form).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onSubmit(handler) {
            this.html.onsubmit = handler;
            return this;
        }

        /**
         * Adds onSelect listener to this element. Is fired when a text is selected inside an input field (supported: input[type=text|password|file], textarea). 
         * @param {function} handler 
         * @returns Elem isntance.
         */
        onSelect(handler) {
            this.html.onselect = handler;
            return this;
        }
        
        /**
         * Adds onReset listener to this element (supported: form).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onReset(handler) {
            this.html.onreset = handler;
            return this;
        }

        /**
         * Adds onFocus listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onFocus(handler) {
            this.html.onfocus = handler;
            return this;
        }

        /**
         * Adds onFocusIn listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onFocusIn(handler) {
            this.html.onfocusin = handler;
            return this;
        }

        /**
         * Adds onFocusOut listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onFocusOut(handler) {
            this.html.onfocusout = handler;
            return this;
        }

        /**
         * Adds onBlur listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onBlur(handler) {
            this.html.onblur = handler;
            return this;
        }

        //Clipboard events
        /**
         * Adds onCopy listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onCopy(handler) {
            this.html.oncopy = handler;
            return this;
        }

        /**
         * Adds onCut listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onCut(handler) {
            this.html.oncut = handler;
            return this;
        }

        /**
         * Adds onPaste listener to this element.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onPaste(handler) {
            this.html.onpaste = handler;
            return this;
        }

        //Media events
        /**
         * Adds onAbort listener to this element. Is fired when media data download is aborted (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onAbort(handler) {
            this.html.onabort = handler;
            return this;
        }

        /**
         * Adds onWaiting listener to this element. Is fired when video stops and waits to buffer next frame (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onWaiting(handler) {
            this.html.onwaiting = handler;
            return this;
        }

        /**
         * Adds onVolumeChange listener to this element. Is fired when the volume is changed (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onVolumeChange(handler) {
            this.html.onvolumechange = handler;
            return this;
        }

        /**
         * Adds onTimeTupdate listener to this element. Is fired when playing or a new position is selected on a seekbar (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onTimeUpdate(handler) {
            this.html.ontimeupdate = handler;
            return this;
        }

        /**
         * Adds onSeeking listener to this element. Is fired when a new position was selected on a seekbar (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onSeeking(handler) {
            this.html.onseeking = handler;
            return this;
        }

        /**
         * Adds onSeekEnd listener to this element. Is fired after a new position was selected on a seekbar (supported: audio, video).
         * @param {*} handler 
         * @returns Elem instance.
         */
        onSeekEnd(handler) {
            this.html.onseekend = handler;
            return this;
        }

        /**
         * Adds onRateChange listener to this element. Is fired when playback rate (speed slow motion, fast forward) changes (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onRateChange(handler) {
            this.html.onratechange = handler;
            return this;
        }

        /**
         * Adds onProgress listener on an element. Is fired when browser is downloading media (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onProgress(handler) {
            this.html.onprogress = handler;
            return this; 
        }

        /**
         * Adds onLoadMetadata listener to this element. Is fired when media metadata was downloaded (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onLoadMetadata(handler) {
            this.html.onloadmetadata = handler;
            return this;
        }

        /**
         * Adds onLoadedData listener on an element. Is fired when media frame data was loaded, but not enough data to play next frame (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onLoadedData(handler) {
            this.html.onloadeddata = handler;
            return this;
        }

        /**
         * Adds onLoadStart listener on an element. Is fired when browser starts looking for media (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onLoadStart(handler) {
            this.html.onloadstart = handler;
            return this;
        }

        /**
         * Adds onPlaying listener to this element. Is fired when the media is playing after paused by user or stopped for buffering (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onPlaying(handler) {
            this.html.onplaying = handler;
            return this;
        }

        /**
         * Adds onPlay listener to this element. Is fired when the media starts to play e.g. play button is pressed. (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onPlay(handler) {
            this.html.onplay = handler;
            return this;
        }

        /**
         * Adds onPause listener to this element. Is fired when the media is paused. (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onPause(handler) {
            this.html.onpause = handler;
            return this;
        }

        /**
         * Adds onEnded listener to this element. Is fired when the end of media file has been reached (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onEnded(handler) {
            this.html.onended = handler;
            return this;
        }

        /**
         * Adds onDurationChange listener to this element. Is fired when media duration changes (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onDurationChange(handler) {
            this.html.ondurationchange = handler;
            return this;
        }

        /**
         * Adds onCanPlay listener to this element. Is fired when enough data to play (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onCanPlay(handler) {
            this.html.oncanplay = handler;
            return this;
        }

        /**
         * Adds canPlayThrough listener to this element. Is fired when can play through without buffering (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onCanPlayThrough(handler) {
            this.html.oncanplaythrough = handler;
            return this;
        }

        /**
         * Adds onStalled listener to this element. Is fired when browser is trying to get data but data not available (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onStalled(handler) {
            this.html.onstalled = handler;
            return this;
        }

        /**
         * Adds onSuspend listener to this element. Is fired when browser intentionally does not retrive media data (supported: audio, video).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onSuspend(handler) {
            this.html.onsuspend = handler;
            return this;
        }

        //Browser events
        /**
         * Adds onPopState listener to this element. Is fired when window history changes.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onPopState(handler) {
            this.html.onpopstate = handler;
            return this;
        }

        /**
         * Adds onStorage listener to this element. Is fired when WebStorage changes.
         * @param {function} handler 
         * @returns Elem instance.
         */
        onStorage(handler) {
            this.html.onstorage = handler;
            return this;
        }

        /**
         * Add onHashChange listener to this element. Is fired when hash part of the url changes (supported: body).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onHashChange(handler) {
            this.html.onhashchange = handler;
            return this;
        }

        /**
         * Adds onAfterPrint listener to this element. Is fired when a print dialogue is closed (Safari, Opera not supported).
         * @param {function} handler 
         * @returns Elem instance.
         */
        onAfterPrint(handler) {
            this.html.onafterprint = handler;
            return this;
        }

        /**
         * Adds onBeforePrint listener to this element. Is fired when a print dialogue is opened (Safari, Opera not supported).
         * @param {function} handler 
         */
        onBeforePrint(handler) {
            this.html.onbeforeprint = handler;
            return this;
        }

        /**
         * Adds onPageHide listener to this element. Is fired when user navigates away from webpage (supported: body).
         * @param {function} handler 
         */
        onPageHide(handler) {
            this.html.onpagehide = handler;
            return this;
        }

        /**
         * Adds onPageShow listener to this element. Is fired when user navigates to webpage (supported: body).
         * @param {function} handler 
         */
        onPageShow(handler) {
            this.html.onpageshow = handler;
            return this;
        }

        /**
         * Creates a new HTML element and wraps it into this Elem instance.
         * @param type
         * @returns Elem instance.
         */
        static create(type) {
            return new Elem(type);
        }

        /**
         * Does not create a new HTML element, but merely wraps an existing instance of the HTML element into
         * this Elem instance.
         * @param html
         * @returns Elem instance.
         */
        static wrap(html) {
            if(!Util.isEmpty(html))
                return new Elem(html);
            else 
                throw "Could not wrap a html element - html: " + html;
        }

        /**
         * Takes an array of HTMLDocument elements and wraps them inside an Elem instance.
         * If the given array contains more than one htmlDoc element otherwise then this method will
         * return an array of Elem instances, otherwise single Elem instance is returned.
         * 
         * @param {Array} htmlDoc 
         * @returns An array of the Elem objects or a single Elem object. 
         */
        static wrapElems(htmlDoc) {
            var eArr = [];
            var i = 0;
            while(i < htmlDoc.length) {
                    eArr.push(Elem.wrap(htmlDoc[i]));
                i++;
            }
            return eArr.length === 1 ? eArr[0] : eArr;
        }
    }

    /**
     * RenderHelper class is a helper class of the Elem class. The RenderHelper class chiefly
     * stores previous state of the Elem in an array and in a string.
     */
    class RenderHelper {
        constructor() {
            this.instance;
            this.prevState = [];
            this.prevStateString = "";
        }
    
        /**
         * Set previous state.
         * @param {array} state 
         */
        static setPrevState(state) {
            RenderHelper.getInstance().prevState = state;
            RenderHelper.getInstance().prevStateString = Util.isEmpty(state) ? "" : state.toString();
        }
    
        /**
         * @returns A previous state array.
         */
        static getPrevState() {
            return RenderHelper.getInstance().prevState;
        }
    
        /**
         * Compares new state previous state.
         * @param {array} newState 
         * @returns True if the new state and the previous state are equal otherwise false.
         */
        static isNewStateEqualToPrevState(newState) {
            return RenderHelper.getInstance().prevStateString === newState.toString();
        }
    
        static getInstance() {
            if(!this.instance)
                this.instance = new RenderHelper();
            return this.instance;
        }
    }


    return Elem;
}());

export default Elem;