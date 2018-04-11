"use strict"

let RME = (function() {
    /**
     * RME stands for Rest Made Easy. This is a small easy to use library that enables you to create RESTfull webpages with ease and speed.
     * This library is free to use under the MIT License.
     */
    class RME {
        constructor() {
            this.instance = this;
            this.completeRun = function() {};
            this.runner = function() {};
            this.onrmestoragechange = function(state) {};
            this.components = {};
            this.rmeState = {};
        }

        complete() {
            this.completeRun();
        }

        start() {
            this.runner();
        }

        setComplete(runnable) {
            this.completeRun = runnable;
        }

        setRunner(runnable) {
            this.runner = runnable;
            return this.instance;
        }

        addComponent(runnable) {
            var comp = runnable();
            for(var p in comp) {
                if(comp.hasOwnProperty(p)) {
                    this.components[p] = comp[p];
                }
            }
        }

        getComponent(name, props) {
            return this.components[name].call(props);
        }

        setRmeState(key, value) {
            this.rmeState[key] = value;
            this.onrmestoragechange(this.rmeState);
        }

        getRmeState(key) {
            return this.rmeState[key];
        }

        /** 
         * Runs a runnable script immedeately.
         * Only one run method per RME application.
         */
        static run(runnable) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().setRunner(runnable).start();
        }

        /**
         * Waits until body has been loaded and then runs a runnable script.
         * Only one ready method per RME application.
         */
        static ready(runnable) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().setComplete(runnable);
        }

        /**
         * Creates or retrieves a RME component. 
         * If the first parameter is a function then this method will try to create a RME component and store it
         * in the RME instance.
         * If the first parameter is a string then this method will try to retrieve a RME component from the 
         * RME instance.
         * @param {*} runnable Type function or String.
         * @param {Object} props 
         */
        static component(runnable, props) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().addComponent(runnable);
            else if(runnable && Util.isString(runnable))
                return RME.getInstance().getComponent(runnable, props);
        }

        /**
         * Saves data to or get data from the RME instance storage.
         * If key and value parameters are not empty then this method will try to save the give value by the given key
         * into to the RME instance storage.
         * If key is not empty and value is empty then this method will try to get data from the RME instance storage
         * by the given key.
         * @param {String} key 
         * @param {Object} value 
         */
        static storage(key, value) {
            if(!Util.isEmpty(key) && !Util.isEmpty(value))
                RME.getInstance().setRmeState(key, value);
            else if(!Util.isEmpty(key) && Util.isEmpty(value))
                return RME.getInstance().getRmeState(key);
        }

        /**
         * Adds a script file on runtime into the head of the current html document where the method is called on.
         * Source is required other properties can be omitted.
         * @param {String} source URL or file name. *Requied
         * @param {String} id 
         * @param {String} type 
         * @param {String} text 
         * @param {boolean} defer 
         * @param {*} crossOrigin 
         * @param {String} charset 
         * @param {boolean} async 
         */
        static script(source, id, type, text, defer, crossOrigin, charset, async) {
            if(!Util.isEmpty(source)) {
                var sc = new Elem("script").setSource(source);
                if(!Util.isEmpty(id))
                    sc.setId(id);
                if(!Util.isEmpty(type))
                    sc.setType(type);
                if(!Util.isEmpty(text))
                    sc.setText(text);
                if(!Util.isEmpty(defer))
                    sc.setAttribute("defer", defer);
                if(!Util.isEmpty(crossOrigin))
                    sc.setAttribute("crossOrigin", crossOrigin);
                if(!Util.isEmpty(charset))
                    sc.setAttribute("charset", charset);
                if(!Util.isEmpty(async))
                    sc.setAttribute("async", async);
                RME.config().addScript(sc);
            }
        }

        /**
         * This is called when ever a new data is saved into the RME instance storage.
         * Callback function has one paramater newState that is the latest snapshot of the 
         * current instance storage.
         * @param {function} listener 
         */
        static onrmestoragechange(listener) {
            if(listener && Util.isFunction(listener))
                RME.getInstance().onrmestoragechange = listener;
        }

        static config() {
            return {
                addScript: function(elem){
                    var scripts = Tree.getScripts();
                    var lastScript = Elem.wrap(scripts[scripts.length -1]);
                    lastScript.after(elem);
                },
                removeScript: function(sourceOrId) {
                    if(sourceOrId.indexOf("#") === 0) {
                        Tree.getHead().remove(Tree.get(sourceOrId));
                    } else {
                        var scripts = Tree.getScripts();
                        for(var s in scripts) {
                            if(scripts.hasOwnProperty(s)) {
                                var src = scripts[s].src !== null ? scripts[s].src : "";
                                if(src.search(sourceOrId) > -1 && src.search(sourceOrId) === src.length - sourceOrId.length) {
                                    Tree.getHead().remove(Elem.wrap(scripts[s]));
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        static getInstance() {
            if(!this.instance)
                this.instance = new RME();
            return this.instance;
        }
    }
    
    document.onreadystatechange = (event) => {
         if(document.readyState === "complete")
             RME.getInstance().complete();
    }

    return {
        run: RME.run,
        ready: RME.ready,
        component: RME.component,
        storage: RME.storage,
        script: RME.script,
        onrmestoragechange: RME.onrmestoragechange
    }
}());


let Http = (function() {
    /**
     * FOR XmlHttpRequest
     * A config object supports following. More features could be added.
     *  {
     *    method: method,
     *    url: url,
     *    data: data,
     *    contentType: contentType,
     *    onProgress: function(event),
     *    headers: headersObject{"header": "value"},
     *    useFetch: true|false **determines that is fetch used or not.
     *  }
     * 
     * If contentType is not defined, application/json is used, if set to null, default is used, otherwise used defined is used.
     * If contentType is application/json, data is automatically stringified with JSON.stringify()
     * 
     * Http class automatically tries to parse reuqest.responseText to JSON using JSON.parse().
     * If parsing succeeds, parsed JSON will be set on request.responseJSON attribute.
     */
    class Http {
        constructor(config) {
            config.contentType = config.contentType === undefined ? Http.JSON : config.contentType;
            if(config.useFetch) {
                this.self = new FetchRequest();
            } else if(window.Promise) {
                this.self = new PromiseAjax(config).instance();
            } else {
                this.self = new Ajax(config);
            }
        }

        instance() {
            return this.self;
        }

        static get(url, requestContentType) {
            return new Http({method: "GET", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        static post(url, data, requestContentType) {
            return new Http({method: "POST", url: url, data: data, contentType: requestContentType}).instance();
        }

        static put(url, data, requestContentType) {
            return new Http({method: "PUT", url: url, data: data, contentType: requestContentType}).instance();
        }

        static delete(url, requestContentType) {
            return new Http({method: "DELETE", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        static do(config) {
            return new Http(config).instance();
        }

        static fetch() {
            return new Http({useFetch: true}).instance();
        }
    }
    /**
     * Content-Type JSON
     */
    Http.JSON = "application/json;charset=UTF-8";

    /**
     * Old Fashion XMLHttpRequest made into the Promise pattern.
     */
    class Ajax {
        constructor(config) {
            this.progressHandler = config.onProgress ? config.onProgress : function(event) {};
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.xhr = new XMLHttpRequest();
            this.xhr.open(config.method, config.url);
            if(config.contentType)
                this.xhr.setRequestHeader("Content-Type", config.contentType);
            if(config.headers)
                setXhrHeaders(this.xhr, config.headers);
        }
        then(successHandler, errorHandler) {
            this.xhr.onload = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                isResponseOK(this.xhr.status) ? successHandler(this.xhr) : errorHandler(this.xhr)
            };
            this.xhr.onprogress = (event) => {
                if(this.progressHandler)
                    this.progressHandler(event);
            };
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if(errorHandler)
                    errorHandler(this.xhr);
            };
            this.data ? this.xhr.send(this.data) : this.xhr.send();
            return this;
        }
        catch(errorHandler) {
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if(errorHandler)
                    errorHandler(this.xhr);
            }
        }
    }

    /**
     * XMLHttpRequest using the Promise.
     */
    class PromiseAjax {
        constructor(config) {
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.promise = new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open(config.method, config.url);
                if(config.contentType)
                    request.setRequestHeader("Content-Type", config.contentType);
                if(config.headers)
                    setXhrHeaders(request, config.headers);
                request.onload = () => {
                    request.responseJSON = tryParseJSON(request.responseText);
                    isResponseOK(request.status) ? resolve(request) : reject(request);
                };
                request.onprogress = (event) => {
                    if(config.onProgress)
                        config.onProgress(event);
                }
                request.onerror = () => {
                    request.responseJSON = tryParseJSON(request.responseText);
                    reject(request)
                };
                this.data ? request.send(this.data) : request.send();
            });
        }
        instance() {
            return this.promise;
        }
    }

    /**
     * Before using this class you should also be familiar on how to use fetch since usage of this class
     * will be quite similar to fetch except predefined candy that is added on a class.
     *
     * The class is added some predefined candy over the JavaScript Fetch interface.
     * get|post|put|delete methods will automatically use JSON as a Content-Type
     * and request methods will be predefined also.
     *
     * FOR Fetch
     * A Config object supports following:
     *  {
     *      url: url,
     *      method: method,
     *      contentType: contentType,
     *      init: init
     *  }
     *
     *  All methods also take init object as an alternative parameter. Init object is the same object that fetch uses.
     *  For more information about init Google JavaScript Fetch or go to https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
     *
     *  If a total custom request is desired you should use a method do({}) e.g.
     *  do({url: url, init: init}).then((resp) => resp.json()).then((resp) => console.log(resp)).catch((error) => console.log(error));
     */
    class FetchRequest {
        constructor() {}
        get(url, init) {
            if(!init) init = {};
            init.method = "GET";
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        post(url, body, init) {
            if(!init) init = {};
            init.method = "POST";
            init.body = body;
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        put(url, body, init) {
            if(!init) init = {};
            init.method = "PUT";
            init.body = body;
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        delete(url, init) {
            if(!init) init = {};
            init.method = "DELETE";
            return this.do({url: url,  init: init, contentType: Http.JSON});
        }
        do(config) {
            if(!config.init) config.init = {};
            if(config.contentType) {
                if(!config.init.headers)
                    config.init.headers = new Headers({})

                config.init.headers.set("Content-Type", config.contentType);
            }
            if(config.method) {
                config.init.method = config.method;
            }
            return fetch(config.url, config.init);
        }
    }

    function setXhrHeaders(xhr, headers) {
        for(var header in headers) {
            if(headers.hasOwnProperty(header))
                xhr.setRequestHeader(header, headers[header]);
        }
    }

    function isResponseOK(status) {
        var okResponses = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
        for(var i in okResponses) {
            if(okResponses.hasOwnProperty(i)) {
                var code = okResponses[i];
                if(code === status)
                    return true;
            }
        }
        return false;
    }

    function isContentTypeJson(contentType) {
        return contentType === Http.JSON;
    }

    function tryParseJSON(text) {
        try {
            return JSON.parse(text);
        } catch(e) {}
    }

    return Http;
}());







class Elem {
    constructor(type) {
        if(Util.isString(type)) {
            this.html = document.createElement(type);
        } else if(type.nodeType !== undefined && type.ownerDocument !== undefined && type.nodeType >= 1 && type.ownerDocument instanceof HTMLDocument) {
            this.html = type;
        } else {
            throw "type must be a string or a html dom object";
        }
    }

    /**
     * Set text of this element.
     * Returns Elem instance.
     * @param {String} text 
     */
    setText(text) {
        this.html.appendChild(document.createTextNode(text));
        return this;
    }

    /**
     * Get text/content of this element.
     */
    getContent() {
        return this.html.innerHTML;
    }

    /**
     * Set content that can be text or html.
     * Returns Elem instance.
     * @param {String} html 
     */
    setContent(html) {
        this.html.innerHTML = html;
        return this;
    }

    /**
     * Set value of this element.
     * Returns Elem instance.
     * @param {String} value 
     */
    setValue(value) {
        this.html.value = value;
        return this;
    }

    /**
     * Get value of this element.
     */
    getValue() {
        return this.html.value;
    }

    /**
     * Set id of this element.
     * Returns Elem instance.
     * @param {String} id 
     */
    setId(id) {
        this.html.id = id;
        return this;
    }

    /**
     * Get id of this element.
     */
    getId() {
        return this.html.id;
    }

    /**
     * Append an element inside this element.
     * Returns Elem instance.
     * @param {Elem} elem 
     */
    append(elem) {
        this.html.appendChild(elem.dom());
        return this;
    }

    /**
     * Remove an element from this element.
     * Returns Elem isntance.
     * @param {Elem} elem 
     */
    remove(elem) {
        this.html.removeChild(elem.dom());
        return this;
    }

    /**
     * Replace this element with a new element.
     * Returns Elem instance.
     * @param {Elem} newElem 
     */
    replace(newElem) {
        this.html.parentElement.replaceChild(newElem.dom(), this.html);
        return this;
    }

    /**
     * Insert a new element before this element.
     * Returns Elem instance.
     * @param {Elem} newElem 
     */
    before(newElem) {
        this.html.parentElement.insertBefore(newElem.dom(), this.html);
        return this;
    }

    /**
     * Insert a new elem after this element.
     * Returns Elem isntance.
     * @param {Elem} newElem 
     */
    after(newElem) {
        if(this.html.nextElementSibling !== null)
            this.html.parentElement.insertBefore(newElem.dom(), this.html.nextElementSibling);
        else
            this.html.parentElement.appendChild(newElem.dom());
        return this;
    }

    /**
     * Renders an Array of Elements or a comma separated list of element arrays or a comma separated list of elements.
     * If given an empty array or not a parameter at all then this element will be rendered as empty.
     * Returns Elem instance.
     * @param {Elem} elems 
     */
    render(...elems) {
        var newState = [];
        for(var e in elems) {
            if(elems.hasOwnProperty(e)) {
                if(Util.isArray(elems[e]))
                    newState = newState.concat(elems[e]);
                else
                    newState.push(elems[e]);
            }
        }
        while(this.html.firstChild) {
            this.html.removeChild(this.html.firstChild);
        }
        for(var e in newState) {
            if(newState.hasOwnProperty(e) && !Util.isEmpty(newState[e]))
                this.append(newState[e]);
        }
        return this;
    }

    /**
     * Get an array of children of this element.
     */
    getChildren() {
        return this.html.children;
    }

    /**
     * Set a title of this element.
     * Returns Elem instance.
     * @param {String} text 
     */
    setTitle(text) {
        this.html.title = text;
        return this;
    }

    /**
     * Get a title of this element.
     */
    getTitle() {
        return this.html.title;
    }

    /**
     * Set a tab index of this element.
     * Returns Elem instance.
     * @param {Number} idx 
     */
    setTabIndex(idx) {
        this.html.tabIndex = idx;
        return this;
    }

    /**
     * Get a tab index of this element.
     */
    getTabIndex() {
        return this.html.tabIndex;
    }

    /**
     * Get a tag name of this element.
     */
    getTagName() {
        return this.html.tagName;
    }

    /**
     * Set an attribute of this element.
     * Returns Elem isntance.
     * @param {String} attr Attribute
     * @param {String} value Value
     */
    setAttribute(attr, value) {
        var attribute = document.createAttribute(attr);
        attribute.value = value;
        this.html.setAttributeNode(attribute);
        return this;
    }

    /**
     * Get an attribute of this element.
     * Returns an attribute object with name and value properties.
     * @param {String} attr 
     */
    getAttribute(attr) {
        return this.html.getAttributeNode(attr);
    }

    /**
     * Removes an attribute of this element.
     * Returns the removed attribute object with value and name parameters.
     * @param {String} attr 
     */
    removeAttribute(attr) {
        return this.html.removeAttributeNode(this.getAttribute(attr));
    }

    /**
     * Set a name of this element.
     * Returns Elem instance.
     * @param {String} name 
     */
    setName(name) {
        this.setAttribute("name", name);
        return this;
    }

    /**
     * Get a name of this element.
     * Returns name string.
     */
    getName() {
        return this.getAttribute("name").value;
    }


    /**
     * Set a type of this element.
     * Returns Elem instance.
     * @param {String} type 
     */
    setType(type) {
        this.setAttribute("type", type);
        return this;
    }

    /**
     * Get a type of this element.
     * Returns type string.
     */
    getType() {
        return this.getAttribute("type").value;
    }

    /**
     * Set a source of this element.
     * Returns Elem instance.
     * @param {String} source 
     */
    setSource(source) {
        this.setAttribute("src", source);
        return this;
    }

    /**
     * Get a source of this element.
     * Returns source string.
     */
    getSource() {
        return this.getAttribute("src").value;
    }

    /**
     * Set a href of this element.
     * Returns Elem instance.
     * @param {String} href 
     */
    setHref(href) {
        this.setAttribute("href", href);
        return this;
    }

    /**
     * Get a href of this element.
     */
    getHref() {
        return this.getAttribute("href").value;
    }

    /**
     * Set a placeholder of this element.
     * Returns Elem instance.
     * @param {String} placeholder 
     */
    setPlaceholder(placeholder) {
        this.setAttribute("placeholder", placeholder);
        return this;
    }

    /**
     * Get a placeholder of this element.
     */
    getPlaceholder() {
        return this.getAttribute("placeholder").value;
    }

    /**
     * Sets size of this element.
     * Return Elem instance.
     * @param {*} size 
     */
    setSize(size) {
        this.setAttribute("size", size);
        return this;
    }

    /**
     * Get size of this element.
     */
    getSize() {
        return this.getAttribute("size").value;
    }

    /**
     * Set this element content editable.
     * Return Elem instance.
     * @param {boolean} boolean 
     */
    setEditable(boolean) {
        this.setAttribute("contenteditable", boolean);
        return this;
    }

    /**
     * Get this element content editable.
     */
    getEditable() {
        return this.getAttribute("contenteditable").value;
    }

    /**
     * Set this element disabled.
     * Return Elem instance.
     * @param {boolean} boolean 
     */
    setDisabled(boolean) {
        this.html.disabled = boolean;
        return this;
    }

    /**
     * Get this element disabled state.
     */
    getDisabled() {
        return this.html.disabled;
    }

    /**
     * Set this element checked.
     * Return Elem instance.
     * @param {boolean} boolean 
     */
    setChecked(boolean) {
        this.html.checked = boolean;
        return this;
    }

    /**
     * Get this element checked state.
     */
    getChecked() {
        return this.html.checked;
    }

    /**
     * Add classes to this element.
     * Returns Elem instance.
     * @param {String} classes 
     */
    addClasses(classes) {
        var toAdd = classes.trim().split(" ");
        var origClass = this.getClasses();
        for(var i=0; i<toAdd.length; i++) {
            var clazz = toAdd[i];
            if(origClass.search(clazz) === -1)
                origClass += " "+clazz;
        }
        this.html.className = origClass.trim();
        return this;
    }

    /**
     * Remove classes from this element.
     * Returns Elem instance.
     * @param {String} classes 
     */
    removeClasses(classes) {
        var toRm = classes.trim().split(" ");
        var origClass = this.getClasses();
        for(var i=0; i<toRm.length; i++) {
            var clazz = toRm[i];
            if(origClass.search(clazz) > -1)
                origClass = origClass.replace(clazz, "").trim();
        }
        this.html.className = origClass.trim();
        return this;
    }

    /**
     * Toggle classes of this element.
     * Returns Elem instance.
     */
    toggleClasses(classes) {
        var cArr = classes.split(" ");
        var origClass = this.getClasses();
        var toAdd = "";
        var toRm = "";
        for(var i=0; i<cArr.length; i++) {
            if(origClass.search(cArr[i]) > -1)
                toRm += " "+cArr[i];
            else
                toAdd += " "+cArr[i];
        }
        this.addClasses(toAdd.trim());
        this.removeClasses(toRm.trim());
        return this;
    }

    /**
     * Get classes string of this element.
     */
    getClasses() {
        return this.html.className;
    }

    /**
     * Set styles of this element in the map e.g. {height: "10px",...}
     * Returns Elem instance.
     * @param {Object} styleMap 
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
     * @param {String} styleName Style name in camelCase e.g. maxHeight
     */
    getStyle(styleName) {
        return this.html.style[styleName];
    }

    /**
     * Set visibility of this element hidden or visible.
     * true = visible, false = hidden
     * @param {boolean} boolean 
     */
    setVisible(boolean) {
        this.html.style.visibility = boolean ? "visibile" : "hidden";
        return this;
    }

    /**
     * Set display state of this element initial or none.
     * true = initial, false = none
     * @param {boolean} boolean 
     */
    display(boolean) {
        this.html.style.display = boolean ? "initial" : "none";
        return this;
    }

    /**
     * Set this element draggable.
     * @param {boolean} boolean 
     */
    setDraggable(boolean) {
        this.setAttribute("draggable", boolean);
        return this;
    }

    /**
     * Do click on this element.
     * Returns Elem instance.
     */
    click() {
        this.html.click();
        return this;
    }

    /**
     * Do focus on this element.
     * Returns Elem instance.
     */
    focus() {
        this.html.focus();
        return this;
    }

    /**
     * Do blur on this element.
     * Returns Elem instance.
     */
    blur() {
        this.html.blur();
        return this;
    }

    /**
     * Returns a clone of this element. If deep is true children will be cloned also.
     * @param {boolean} deep 
     */
    clone(deep) {
        return Elem.wrap(this.html.cloneNode(deep));
    }

    /**
     * Returns HTML Document Element that this element contains.
     */
    dom() {
        return this.html;
    }

    /**
     * Returns height of this element.
     */
    height() {
        return this.html.clientHeight;
    }

    /**
     * Returns width of this element.
     */
    width() {
        return this.html.clientWidth;
    }

    /**
     * Returns a parent of this element wrapped in Elem instance or null if no parent.
     */
    parent() {
        return this.html.parentElement !== null ? Elem.wrap(this.html.parentElement) : null;
    }

    /**
     * Returns a next element of this element wrapped in Elem instance or null if no next.
     */
    next() {
        return this.html.nextElementSibling !== null ? Elem.wrap(this.html.nextElementSibling) : null;
    }

    /**
     * Returns a previous element of this element wrapped in Elem instance or null if no previous.
     */
    previous() {
        return this.html.previousElementSibling !== null ? Elem.wrap(this.html.previousElementSibling) : null;
    }

    /**
     * Returns a first child element of this element wrapped in Elem instance or null if no children.
     */
    getFirstChild() {
        return this.html.firstElementChild !== null ? Elem.wrap(this.html.firstElementChild) : null;
    }

    /**
     * Returns a last child element of this element wrapped in Elem instance or null if no children.
     */
    getLastChild() {
        return this.html.lastElementChild !== null ? Elem.wrap(this.html.lastElementChild) : null;
    }

    //EVENTS BELOW

    //Animation events
    onAnimationStart(handler) {
        this.html.onanimationstart = handler;
        // this.html.addEventListener("webkitAnimationStart", handler);
        // this.html.addEventListener("mozAnimationStart", handler);
        return this;
    }

    onAnimationIteration(handler) {
        this.html.onanimationiteration = handler;
        // this.html.addEventListener("webkitAnimationIteration", handler);
        // this.html.addEventListener("mozAnimationIteration", handler);
        return this;
    }

    onAnimationEnd(handler) {
        this.html.onanimationend = handler;
        // this.html.addEventListener("webkitAnimationEnd", handler);
        // this.html.addEventListener("mozAnimationEnd", handler);
        return this;
    }

    onTransitionEnd(handler) {
        this.html.ontransitionend = handler;
        // this.html.addEventListener("webkitTransitionEnd", handler);
        // this.html.addEventListener("mozTransitionEnd", handler);
        // this.html.addEventListener("oTransitionEnd", handler);
        return this;
    }

    //Drag events
    onDrag(handler) {
        this.html.ondrag = handler;
        return this;
    }

    onDragEnd(handler) {
        this.html.ondragend = handler;
        return this;
    }

    onDragEnter(handler) {
        this.html.ondragenter = handler;
        return this;
    }

    onDragOver(handler) {
        this.html.ondragover = handler;
        return this;
    }

    onDragStart(handler) {
        this.html.ondragstart = handler;
        return this;
    }

    onDrop(handler) {
        this.html.ondrop = handler;
        return this;
    }

    //Mouse events
    onClick(handler) {
        this.html.onclick = handler;
        return this;
    }

    onDoubleClick(handler) {
        this.html.ondblclick = handler;
        return this;
    }

    onContextMenu(handler) {
        this.html.oncontextmenu = handler;
        return this;
    }

    onMouseDown(handler) {
        this.html.onmousedown = handler;
        return this;
    }

    onMouseEnter(handler) {
        this.html.onmouseenter = handler;
        return this;
    }

    onMmouseLeave(handler) {
        this.html.onmouseleave = handler;
        return this;
    }

    onMouseMove(handler) {
        this.html.onmousemove = handler;
        return this;
    }

    onMouseOver(handler) {
        this.html.onmouseover = handler;
        return this;
    }

    onMouseOut(handler) {
        this.html.onmouseout = handler;
        return this;
    }

    onMouseUp(handler) {
        this.html.onmouseup = handler;
        return this;
    }

    onWheel(handler) {
        this.html.onwheel = handler;
        return this;
    }

    //UI events
    onScroll(handler) {
        this.html.onscroll = handler;
        return this;
    }

    onResize(handler) {
        this.html.onresize = handler;
        return this;
    }

    onAbort(handler) {
        this.html.onabort = handler;
        return this;
    }

    onError(handler) {
        this.html.onerror = handler;
        return this;
    }

    onLoad(handler) {
        this.html.onload = handler;
        return this;
    }

    onUnload(handler) {
        this.html.onunload = handler;
        return this;
    }

    onBeforeUnload(handler) {
        this.html.onbeforeunload = handler;
        return this;
    }

    //Key events
    onKeyUp(handler) {
        this.html.onkeyup = handler;
        return this;
    }

    onKeyDown(handler) {
        this.html.onkeydown = handler;
        return this;
    }

    onKeyPress(handler) {
        this.html.onkeypress = handler;
        return this;
    }

    onInput(handler) {
        this.html.oninput = handler;
        return this;
    }

    //Events (changing state)
    onChange(handler) {
        this.html.onchange = handler;
        return this;
    }

    onSubmit(handler) {
        this.html.onsubmit = handler;
        return this;
    }

    onSelect(handler) {
        this.html.onselect = handler;
        return this;
    }
    
    onReset(handler) {
        this.html.onreset = handler;
        return this;
    }

    onFocus(handler) {
        this.html.onfocus = handler;
        return this;
    }

    onFocusIn(handler) {
        this.html.onfocusin = handler;
        return this;
    }

    onFocusOut(handler) {
        this.html.onfocusout = handler;
        return this;
    }

    onBlur(handler) {
        this.html.onblur = handler;
        return this;
    }

    //Clipboard events
    onCopy(handler) {
        this.html.oncopy = handler;
        return this;
    }

    onCut(handler) {
        this.html.oncut = handler;
        return this;
    }

    onPaste(handler) {
        this.html.onpaste = handler;
        return this;
    }

    //Media events
    onWaiting(handler) {
        this.html.onwaiting = handler;
        return this;
    }

    onVolumeChange(handler) {
        this.html.onvolumechange = handler;
        return this;
    }

    onTimeUpdate(handler) {
        this.html.ontimeupdate = handler;
        return this;
    }

    onSeeking(handler) {
        this.html.onseeking = handler;
        return this;
    }

    onSeekEnd(handler) {
        this.html.onseekend = handler;
        return this;
    }

    onRateChange(handler) {
        this.html.onratechange = handler;
        return this;
    }

    onProgress(handler) {
        this.html.onprogress = handler;
        return this; 
    }

    onLoadMetadata(handler) {
        this.html.onloadmetadata = handler;
        return this;
    }

    onLoadedData(handler) {
        this.html.onloadeddata = handler;
        return this;
    }

    onLoadStart(handler) {
        this.html.onloadstart = handler;
        return this;
    }

    onPlaying(handler) {
        this.html.onplaying = handler;
        return this;
    }

    onPlay(handler) {
        this.html.onplay = handler;
        return this;
    }

    onPause(handler) {
        this.html.onpause = handler;
        return this;
    }

    onEnded(handler) {
        this.html.onended = handler;
        return this;
    }

    onDurationChange(handler) {
        this.html.ondurationchange = handler;
        return this;
    }

    onCanPlay(handler) {
        this.html.oncanplay = handler;
        return this;
    }

    onCanPlayThrough(handler) {
        this.html.oncanplaythrough = handler;
        return this;
    }

    onStalled(handler) {
        this.html.onstalled = handler;
        return this;
    }

    onSuspend(handler) {
        this.html.onsuspend = handler;
        return this;
    }

    //Browser events
    onPopState(handler) {
        this.html.onpopstate = handler;
        return this;
    }

    onStorage(handler) {
        this.html.onstorage = handler;
        return this;
    }

    onHashChange(handler) {
        this.html.onhashchange = handler;
        return this;
    }

    onAfterPrint(handler) {
        this.html.onafterprint = handler;
        return this;
    }

    onBeforePrint(handler) {
        this.html.onbeforeprint = handler;
        return this;
    }

    onPageHide(handler) {
        this.html.onpagehide = handler;
        return this;
    }

    onPageShow(handler) {
        this.html.onpageshow = handler;
        return this;
    }

    /**
     * Creates a new HTML element and wraps it into this Elem instance.
     * @param type
     * @returns {Elem}
     */
    static create(type) {
        return new Elem(type);
    }

    /**
     * Does not create a new HTML element, but merely wraps an existing instance of the HTML element into
     * this Elem instance.
     * @param html
     * @returns {Elem}
     */
    static wrap(html) {
        if(!Util.isEmpty(html))
            return new Elem(html);
        else 
            throw "Could not wrap a html element - html: " + html;
    }

    /**
     * Takes an array of HTMLDocument elements and wraps them inside an Elem instance.
     * Returns an array of the Elem objects if the given array contains more than one htmlDoc element otherwise a single Elem instance is returned.
     * @param {Array} htmlDoc 
     */
    static wrapElems(htmlDoc) {
        var eArr = [];
        for(var i in htmlDoc) {
            if(htmlDoc.hasOwnProperty(i)) {
                eArr.push(Elem.wrap(htmlDoc[i]));
            }
        }
        return eArr.length === 1 ? eArr[0] : eArr;
    }
}

class Tree {
    static get(selector) {
        return Elem.wrapElems(document.querySelectorAll(selector));
    }

    static getFirst(selector) {
        return Elem.wrap(document.querySelector(selector));
    }

    static getByTag(tag) {
        return Elem.wrapElems(document.getElementsByTagName(tag));
    }

    static getByName(name) {
        return Elem.wrapElems(document.getElementsByName(name));
    }

    static getById(id) {
        return Elem.wrap(document.getElementById(id));
    }

    static getByClass(classname) {
        return Elem.wrapElems(document.getElementsByClassName(classname));
    }

    static getBody() {
        return Elem.wrap(document.body);
    }

    static getHead() {
        return Elem.wrap(document.head);
    }

    static getTitle() {
        return document.title;
    }

    static setTitle(title) {
        document.title = title;
    }

    static getActiveElement() {
        return Elem.wrap(document.activeElement);
    }

    static getAnchors() {
        return document.anchors;
    }

    static getHtmlElement() {
        return document.documentElement;
    }

    static getDoctype() {
        return document.doctype;
    }

    static getEmbeds() {
        return document.embeds;
    }

    static getImages() {
        return document.images;
    }

    static getLinks() {
        return document.links;
    }

    static getScripts() {
        return document.scripts;
    }

    static getForms() {
        return document.forms;
    }
}

/**
 * No methods, only Key mappings for keyevent.
 */
class Key {}
Key.ENTER = "Enter";
Key.ESC = "Escape";
Key.TAB = "Tab";
Key.F1 = "F1";
Key.F2 = "F2";
Key.F3 = "F3";
Key.F4 = "F4";
Key.F5 = "F5";
Key.F6 = "F6";
Key.F7 = "F7";
Key.F8 = "F8";
Key.F9 = "F9";
Key.F10 = "F10";
Key.F11 = "F11";
Key.F12 = "F12";
Key.A = "a";
Key.B = "b";
Key.C = "c";
Key.D = "d";
Key.E = "e";
Key.F = "f";
Key.G = "g";
Key.H = "h";
Key.I = "i";
Key.J = "j";
Key.L = "l";
Key.M = "m";
Key.N = "n";
Key.O = "o";
Key.P = "p";
Key.Q = "q";
Key.R = "r";
Key.S = "s";
Key.T = "t";
Key.U = "u";
Key.V = "v";
Key.W = "w";
Key.X = "x";
Key.Y = "y";
Key.Z = "z";
// Key.SWEDISH_O = "å";
// Key.A_WITH_2_DOTS = "ä";
// Key.O_WITH_2_DOTS = "ö";
Key.CAPS_LOCK = "CapsLock";
Key.NUM_LOCK = "NumLock";
Key.SCROLL_LOCK = "ScrollLock";
Key.PAUSE = "Pause";
Key.PRINT_SCREEN = "PrintScreen";
Key.PAGE_UP = "PageUp";
Key.PAGE_DOWN = "PageDown";
Key.END = "End";
Key.HOME = "Home";
Key.DELETE = "Delete";
Key.INSERT = "Insert";
Key.ALT = "Alt";
Key.CTRL = "Control";
Key.CONTEXT_MENU = "ContextMenu";
Key.OS = "OS"; // META
Key.ALTGR = "AltGraph";
Key.SHIFT = "Shift";
Key.BACKSPACE = "Backspace";
// Key.HALF = "½";
Key.SECTION = "§";
Key.ONE = "1";
Key.TWO = "2";
Key.THREE = "3";
Key.FOUR = "4";
Key.FIVE = "5";
Key.SIX = "6";
Key.SEVEN = "7";
Key.EIGHT = "8";
Key.NINE = "9";
Key.ZERO = "0";
Key.PLUS = "+";
Key.MINUS = "-";
Key.STAR = "*";
Key.SLASH = "/";
Key.ARROW_UP = "ArrowUp";
Key.ARROW_RIGHT = "ArrowRight";
Key.ARROW_DOWN = "ArrowDown";
Key.ARROW_LEFT = "ArrowLeft";
Key.COMMA = ",";
Key.DOT = ".";


let Cookie = (function() {
    /**
     * Cookies
     */
    class Cookies {
        /**
         * Get a cookie by name.
         * Returns the cookie object 
         * {
         *  name: "name",
         *  value: "value",
         *  expiresDate: "expiresDate e.g. Date.toUTCString()",
         *  cookiePath: "cookiePath absolute dir",
         *  cookieDomain: "cookieDomain e.g example.com",
         *  setSecureBoolean: true|false
         * }
         * @param {String} name 
         */
        static get(name) {
            if(navigator.cookieEnabled) {
                var retCookie = null;
                var cookies = document.cookie.split(";");
                for(var i in cookies) {
                    if(cookies.hasOwnProperty(i)) {
                        var cookie = cookies[i];
                        var eq = cookie.search("=");
                        var cn = cookie.substr(0, eq).trim();
                        var cv = cookie.substr(eq + 1, cookie.length).trim();
                        if(cn === name) {
                            retCookie = new Cookie(cn, cv);
                            break;
                        }
                    }
                }
                return retCookie;
            }
        }
        /**
         * Receives cookie parameters.
         * {
         *  name: "name",
         *  value: "value",
         *  expiresDate: "expiresDate e.g. Date.toUTCString()",
         *  cookiePath: "cookiePath absolute dir",
         *  cookieDomain: "cookieDomain e.g example.com",
         *  setSecureBoolean: true|false
         * }
         */
        static set(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
            if(navigator.cookieEnabled) {
                document.cookie = Cookie.create(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean).toString();
            }
        }
        /**
         * Remove a cookie by name.
         */
        static remove(name) {
            var co = Cookies.get(name);
            if(!Util.isEmpty(co)) {
                co.setExpired();
                document.cookie = co.toString();
            }
        }
    }

    /**
    * Cookie object:
    * {
    *  name: "name",
    *  value: "value",
    *  expiresDate: "expiresDate e.g. Date.toUTCString()",
    *  cookiePath: "cookiePath absolute dir",
    *  cookieDomain: "cookieDomain e.g example.com",
    *  setSecureBoolean: true|false
    * }
    */
    class Cookie {
        constructor(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
            this.cookieName = !Util.isEmpty(name) && Util.isString(name) ? name.trim() : "";
            this.cookieValue = !Util.isEmpty(value) && Util.isString(value) ? value.trim() : "";
            this.cookieExpires = !Util.isEmpty(expiresDate) && Util.isString(expiresDate) ? expiresDate.trim() : "";
            this.cookiePath = !Util.isEmpty(cookiePath) && Util.isString(cookiePath) ? cookiePath.trim() : "";
            this.cookieDomain = !Util.isEmpty(cookieDomain) && Util.isString(cookieDomain) ? cookieDomain.trim() : "";
            this.cookieSecurity = !Util.isEmpty(setSecureBoolean) && Util.isBoolean(setSecureBoolean) ? "secure=secure" : "";
        }

        setExpired() {
            this.cookieExpires = new Date(1970,0,1).toString();
        }

        toString() {
            return this.cookieName+"="+this.cookieValue+"; expires="+this.cookieExpires+"; path="+this.cookiePath+"; domain="+this.cookieDomain+"; "+this.cookieSecurity;
        }
        static create(name, value, expires, cpath, cdomain, setSecure) {
                return new Cookie(name, value, expires, cpath, cdomain, setSecure);
        }
    }

    return Cookies;
}());

/**
 * Session interface.
 */
class Session {
    static set(key, value) {
        sessionStorage.setItem(key, value);
    }
    static get(key) {
        return sessionStorage.getItem(key);
    }
    static remove(key) {
        sessionStorage.removeItem(key);
    }
    /**
     * Clears the Session.
     */
    static clear() {
        sessionStorage.clear();
    }
}

/**
 * HTML local storage interface.
 */
class Storage {
    static set(key, value) {
        localStorage.setItem(key, value);
    }
    static get(key) {
        return localStorage.getItem(key);
    }
    static remove(key) {
        localStorage.removeItem(key);
    }
    /**
     * Clears the storage.
     */
    static clear() {
        localStorage.clear();
    }
}


/**
 * General Utils.
 */
class Util {
    constructor() {}

    /**
     * Returns true if the give value is null, undefined or an empty string. 
     */
    static isEmpty(value) {
        return (value === null || value === undefined || value === "");
    }

    static getType(value) {
        return typeof value;
    }

    static isType(value, type) {
        return (Util.getType(value) === type);
    }

    static isFunction(func) {
        return Util.isType(func, "function");
    }

    static isBoolean(boolean) {
        return Util.isType(boolean, "boolean");
    }

    static isString(string) {
        return Util.isType(string, "string");
    }

    static isNumber(number) {
        return Util.isType(number, "number");
    }

    static isSymbol(symbol) {
        return Util.isType(symbol, "symbol");
    }

    static isObject(object) {
        return Util.isType(object, "object");
    }

    static isArray(array) {
        return Array.isArray(array);
    }

    static setTimeout(callback, milliseconds) {
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
        if(!Util.isNumber(milliseconds)) {
            throw "milliseconds not a number"
        }
        return window.setTimeout(callback, milliseconds);
    }

    static clearTimeout(timeoutObject) {
        window.clearTimeout(timeoutObject);
    }

    static setInterval(callback, milliseconds) {
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
        if(!Util.isNumber(milliseconds)) {
            throw "milliseconds not a number"
        }
        return window.setInterval(callback, milliseconds);
    }

    static clearInterval(intervalObject) {
        window.clearInterval(intervalObject);
    }

    static encodeBase64String(string) {
        if(!Util.isString(string)) {
            throw "the given parameter is not a string: " +string;
        }
        return window.btoa(string);
    }

    static decodeBase64String(string) {
        if(!Util.isString(string)) {
            throw "the given parameter is not a string: " +string;
        }
        return window.atob(string);
    }

    static eval(string) {
        return eval(string);
    }
}

class Browser {
    constructor() {}

    /**
     * Scroll once to a given location (xPos, yPos)
     */
    static scrollTo(xPos, yPos) {
        window.scrollTo(xPos, yPos);
    }

    /**
     * Scroll multiple times by given pixel amount (xPx, yPx)
     */
    static scrollBy(xPx, yPx) {
        window.scrollBy(xPx, yPx);
    }

    static open(url, name, specs, replace) {
        return window.open(url, name, specs, replace);
    }

    static close(openedWindow) {
        openedWindow.close();
    }

    static print() {
        window.print();
    }

    static alert(message) {
        window.alert(message);
    }

    static confirm(message) {
        return window.confirm(message);
    }

    static prompt(message, defaultText) {
        return window.prompt(message, defaultText);
    }

    static mediaMatcher(mediaString) {
        if(mediaString.indexOf("(") !== 0)
            mediaString = "("+mediaString;
        if(mediaString.indexOf(")") !== mediaString.length -1)
            mediaString = mediaString+")";
        return window.matchMedia(mediaString);
    }

    static pageBack() {
        history.back();
    }

    static pageForward() {
        history.forward();
    }

    static pageGo(numberOfPagesOrUrl) {
        history.go(numberOfPagesOrUrl)
    }

    static pushState(stateObject, title, newURL) {
        history.pushState(stateObject, title, newURL);
    }

    static replaceState(stateObject, title, newURL) {
        history.replaceState(stateObject, title, newURL);
    }

    static newPage(newURL) {
        location.assign(newURL);
    }

    static reloadPage(force) {
        location.reload(force);
    }

    static replacePage(newURL) {
        location.replace(newURL);
    }

    static getAnchorHash() {
        return location.hash;
    }

    static setAnchorHash(hash) {
        location.hash = hash;
    }

    static getHostnamePort() {
        return location.host;
    }

    /**
     * host = host:port
     */
    static setHostnamePort(hostPort) {
        location.host = hostPort;
    }

    static getHostname() {
        return location.hostname;
    }

    static setHostname(hostname) {
        location.hostname = hostname;
    }

    static getURL() {
        return location.href;
    }

    static setURL(newURL) {
        location.href;
    }

    /**
     * Returns protocol, hostname and port e.g. https://www.example.com:443
     */
    static getOrigin() {
        return location.origin;
    }

    static getPathname() {
        return location.pathname;
    }

    static setPathname(pathname) {
        location.pathname;
    }

    static getPort() {
        return location.port;
    }

    static setPort(portNumber) {
        location.port = portNumber;
    }

    static getProtocol() {
        return location.protocol;
    }

    static setProtocol(protocol) {
        location.protocol = protocol;
    }

    /**
     * For example: ?attr=value&abc=efg
     */
    static getSearchString() {
        return location.search;
    }

    static setSearchString(searchString) {
        location.search = searchString;
    }

    static getCodename() {
        return navigator.appCodeName;
    }

    static getName() {
        return navigator.appName;
    }

    static getVersion() {
        return navigator.appVersion;
    }

    static isCookiesEnabled() {
        return navigator.cookieEnabled;
    }

    static getGeoLocation() {
        return navigator.geolocation;
    }

    static getLanguage() {
        return navigator.language;
    }

    static isOnline() {
        return navigator.isOnline;
    }

    static getPlatform() {
        return navigator.platform;
    }

    static getProduct() {
        return navigator.product;
    }

    static getUserAgentHeader() {
        return navigator.userAgent;
    }

    static isJavaEnabled() {
        return navigator.isJavaEnabled();
    }

    static getColorDepth() {
        return screen.colorDepth;
    }

    static getFullScreenHeight() {
        return screen.height;
    }

    static getFullScreenWidth() {
        return screen.width;
    }

    static getAvailableScreenHeight() {
        return screen.availHeight;
    }

    static getAvailableScreenWidth() {
        return screen.availWidth;
    }
}