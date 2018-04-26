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
         * @param {String} text Content of the script element if any.
         * @param {boolean} defer If true script is executed when page has finished parsing.
         * @param {*} crossOrigin 
         * @param {String} charset 
         * @param {boolean} async If true script is executed asynchronously when available.
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
                    var lastScript = scripts[scripts.length -1];
                    lastScript.after(elem);
                },
                removeScript: function(sourceOrId) {
                    if(sourceOrId.indexOf("#") === 0) {
                        Tree.getHead().remove(Tree.get(sourceOrId));
                    } else {
                        var scripts = Tree.getScripts();
                        for(var s in scripts) {
                            if(scripts.hasOwnProperty(s)) {
                                var src = !Util.isEmpty(scripts[s].getSource()) ? scripts[s].getSource() : "";
                                if(src.search(sourceOrId) > -1 && src.search(sourceOrId) === src.length - sourceOrId.length) {
                                    Tree.getHead().remove(scripts[s]);
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
     *    onTimeout: function(event),
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

        /**
         * Do GET XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {string} requestContentType 
         */
        static get(url, requestContentType) {
            return new Http({method: "GET", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do POST XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static post(url, data, requestContentType) {
            return new Http({method: "POST", url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do PUT XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static put(url, data, requestContentType) {
            return new Http({method: "PUT", url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do DELETE XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} requestContentType 
         */
        static delete(url, requestContentType) {
            return new Http({method: "DELETE", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Does any XMLHttpRequest that is defined by a given config object. Promise will be used if available.
         * 
         * Config object can contain parameters:
         * {
         *    method: method,
         *    url: url,
         *    data: data,
         *    contentType: contentType,
         *    onProgress: function(event),
         *    onTimeout: function(event),
         *    headers: headersObject{"header": "value"},
         *    useFetch: true|false **determines that is fetch used or not.
         *  }
         * @param {object} config 
         */
        static do(config) {
            return new Http(config).instance();
        }

        /**
         * Uses Fetch interface to make a request to server.
         * 
         * Before using fetch you should also be familiar on how to use fetch since usage of this function
         * will be quite similar to fetch except predefined candy that is added.
         *
         * The fetch interface adds some predefined candy over the JavaScript Fetch interface.
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
        static fetch() {
            return new Http({useFetch: true}).instance();
        }
    }
    /**
     * Content-Type application/json;charset=UTF-8
     */
    Http.JSON = "application/json;charset=UTF-8";
    /**
     * Content-Type multipart/form-data
     */
    Http.FORM_DATA = "multipart/form-data";
    /**
     * Content-Type text/plain
     */
    Http.TEXT_PLAIN = "text/plain";

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
            if(this.xhr.ontimeout && config.onTimeout) {
                this.xhr.ontimeout = (event) => {
                    config.onTimeout(event);
                }
            }
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
                this.xhr.responseJSON = tryParseJSON(this.xhr.responrenderseText);
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
                if(request.ontimeout && config.onTimeout) {
                    request.ontimeout = (event) => {
                        config.onTimeout(event);
                    }
                }
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
        /**
         * Does Fetch GET request. Content-Type JSON is used.
         * @param {stirng} url *Required
         * @param {*} init 
         */
        get(url, init) {
            if(!init) init = {};
            init.method = "GET";
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        /**
         * Does Fetch POST request. Content-Type JSON is used.
         * @param {string} url *Required
         * @param {*} body 
         * @param {*} init 
         */
        post(url, body, init) {
            if(!init) init = {};
            init.method = "POST";
            init.body = body;
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        /**
         * Does Fetch PUT request. Content-Type JSON is used.
         * @param {string} url *Required
         * @param {*} body 
         * @param {*} init 
         */
        put(url, body, init) {
            if(!init) init = {};
            init.method = "PUT";
            init.body = body;
            return this.do({url: url, init: init, contentType: Http.JSON});
        }
        /**
         * Does Fetch DELETE request. Content-Type JSON is used.
         * @param {string} url 
         * @param {*} init 
         */
        delete(url, init) {
            if(!init) init = {};
            init.method = "DELETE";
            return this.do({url: url,  init: init, contentType: Http.JSON});
        }
        /**
         * Does any Fetch request a given config object defines.
         * 
         * Config object can contain parameters:
         * {
         *      url: url,
         *      method: method,
         *      contentType: contentType,
         *      init: init
         *  }
         * @param {object} config 
         */
        do(config) {
            if(!config.init) config.init = {};
            if(config.contentType) {
                if(!config.init.headers)
                    config.init.headers = new Headers({});

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
        var i = 0;
        while(i < okResponses.length) {
            if(okResponses[i] === status)
                return true;
            i++;
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
            return this.html.textContent;
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
            this.html.appendChild(elem.dom());
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
            return "<"+this.getTagName().toLowerCase()+">"+this.getContent();
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
         * Get an array of children of this element.
         * 
         * @returns A HTMLDocument object array of child elements.
         */
        getChildren() {
            return this.html.children;
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
            this.html.tabIndex = idx;
            return this;
        }

        /**
         * Get a tab index of this element.
         * 
         * @returns A tab index value of this element.
         */
        getTabIndex() {
            return this.html.tabIndex;
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
         * @returns an attribute object with name and value properties.
         */
        getAttribute(attr) {
            return this.html.getAttributeNode(attr);
        }

        /**
         * Removes an attribute of this element.
         * 
         * @param {String} attr 
         * @returns the removed attribute object with value and name parameters.
         */
        removeAttribute(attr) {
            return this.html.removeAttributeNode(this.getAttribute(attr));
        }

        /**
         * Set a name of this element.
         * 
         * @param {String} name 
         * @returns Elem instance.
         */
        setName(name) {
            this.setAttribute("name", name);
            return this;
        }

        /**
         * Get a name of this element.
         * 
         * @returns name string of this element.
         */
        getName() {
            return this.getAttribute("name").value;
        }


        /**
         * Set a type of this element.
         * 
         * @param {String} type 
         * @returns Elem instance.
         */
        setType(type) {
            this.setAttribute("type", type);
            return this;
        }

        /**
         * Get a type of this element.
         * 
         * @returns type string of this element.
         */
        getType() {
            return this.getAttribute("type").value;
        }

        /**
         * Set a source of this element.
         * 
         * @param {String} source 
         * @returns Elem instance.
         */
        setSource(source) {
            this.setAttribute("src", source);
            return this;
        }

        /**
         * Get a source of this element.
         * 
         * @returns source string of this element.
         */
        getSource() {
            return this.getAttribute("src").value;
        }

        /**
         * Set a href of this element.
         * 
         * @param {String} href 
         * @returns Elem instance.
         */
        setHref(href) {
            this.setAttribute("href", href);
            return this;
        }

        /**
         * Get a href of this element.
         * 
         * @returns href of this element.
         */
        getHref() {
            return this.getAttribute("href").value;
        }

        /**
         * Set a placeholder of this element.
         * 
         * @param {String} placeholder 
         * @returns Elem instance.
         */
        setPlaceholder(placeholder) {
            this.setAttribute("placeholder", placeholder);
            return this;
        }

        /**
         * Get a placeholder of this element.
         * 
         * @returns placeholder of this element.
         */
        getPlaceholder() {
            return this.getAttribute("placeholder").value;
        }

        /**
         * Sets size of this element.
         * 
         * @param {*} size 
         * @returns Elem instance.
         */
        setSize(size) {
            this.setAttribute("size", size);
            return this;
        }

        /**
         * Get size of this element.
         * 
         * @returns size of this element.
         */
        getSize() {
            return this.getAttribute("size").value;
        }

        /**
         * Set this element content editable.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setEditable(boolean) {
            this.setAttribute("contenteditable", boolean);
            return this;
        }

        /**
         * Get this element content editable.
         * 
         * @returns content editable state of this element.
         */
        getEditable() {
            return this.getAttribute("contenteditable").value;
        }

        /**
         * Set this element disabled.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setDisabled(boolean) {
            this.html.disabled = boolean;
            return this;
        }

        /**
         * Get this element disabled state.
         * 
         * @returns disabled state of this element.
         */
        getDisabled() {
            return this.html.disabled;
        }

        /**
         * Set this element checked.
         * 
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        setChecked(boolean) {
            this.html.checked = boolean;
            return this;
        }

        /**
         * Get this element checked state.
         * 
         * @returns checked state of this element.
         */
        getChecked() {
            return this.html.checked;
        }

        /**
         * Add classes to this element.
         * 
         * @param {String} classes 
         * @returns Elem instance.
         */
        addClasses(classes) {
            var toAdd = classes.trim().split(" ");
            var origClass = this.getClasses();
            var i = 0;
            while(i < toAdd.length) {
                var clazz = toAdd[i];
                if(origClass.search(clazz) === -1)
                    origClass += " "+clazz;
                i++;
            }
            this.html.className = origClass.trim();
            return this;
        }

        /**
         * Remove classes from this element.
         * 
         * @param {String} classes 
         * @returns Elem instance.
         */
        removeClasses(classes) {
            var toRm = classes.trim().split(" ");
            var origClass = this.getClasses();
            var i = 0;
            while(i < toRm.length) {
                var clazz = toRm[i];
                if(origClass.search(clazz) > -1)
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
            var cArr = classes.split(" ");
            var origClass = this.getClasses();
            var toAdd = "";
            var toRm = "";
            var i = 0;
            while(i < cArr.length) {
                if(origClass.search(cArr[i]) > -1)
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
            this.html.style.visibility = boolean ? "visibile" : "hidden";
            return this;
        }

        /**
         * Set display state of this element initial or none.
         * true = initial, false = none
         * @param {boolean} boolean 
         * @returns Elem instance.
         */
        display(boolean) {
            this.html.style.display = boolean ? "initial" : "none";
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
         * Do click on this element.
         * @returns Elem instance.
         */
        click() {
            this.html.click();
            return this;
        }

        /**
         * Do focus on this element.
         * @returns Elem instance.
         */
        focus() {
            this.html.focus();
            return this;
        }

        /**
         * Do blur on this element.
         * @returns Elem instance.
         */
        blur() {
            this.html.blur();
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
         * @returns height of this element.
         */
        height() {
            return this.html.clientHeight;
        }

        /**
         * @returns width of this element.
         */
        width() {
            return this.html.clientWidth;
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
        onMmouseLeave(handler) {
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
         * @returns An array of the Elem objects a single Elem instance. 
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
             * These attributes are supported inside an object notation: {div: {text: "some", class: "some", id:"some"....}}
             */
            this.attributes = ["id","name","class","text","value","content","tabIndex","type","src","href","editable",
            "placeholder","size","checked","disabled","visible","display","draggable","styles", "for"];
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
                        else if(Util.isFunction(template[obj]))
                            this.resolveFunction(this.root, template[obj]);
                    } else {
                        ++round;
                        if(this.isAttributeKey(obj)) {
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
    
        /**
         * Resolves function based tempalte implementation.
         * @param {object} elem
         * @param {func} func
         */
        resolveFunction(elem, func) {
            let ret = func.call(elem);
            if(!Util.isEmpty(ret) && Util.isString(ret)){
                elem.setText(ret);
            }
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
            var el = tag.match(/[a-z0-9]+/).join();
            if(this.isComponent(tag)) {
                tag = tag.replace(/component:/, "");
                return RME.component(tag, obj); //if component, do fast return
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

            match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#]+\]/g); //find attributes
            if(!Util.isEmpty(match))
                resolved = this.addAttributes(resolved, match);

            return resolved;
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
                    elem.setContent(val);
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
                default: 
                    elem.setAttribute(key, val);
            }
        }

        /**
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
         * Checks has a key component keyword. 
         * @param {string} key
         * @returns True if the key contains component keyword otherwise false.
         */
        isComponent(key) {
            return key.indexOf("component:") === 0;
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

    }
    return {
        resolve: Template.resolveTemplate
    }
}());




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
        return Elem.wrap(document.querySelector(selector));
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
        return Elem.wrap(document.getElementById(id));
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
        return Elem.wrap(document.body);
    }

    /**
     * @returns head wrapped in an Elem instance.
     */
    static getHead() {
        return Elem.wrap(document.head);
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
        return Elem.wrap(document.activeElement);
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

let Router = (function() {
    /**
     * Router class handles and renders route elements that are given by Router.routes() method.
     * The method takes an array of route objects that are defined as follows: {route: "url", elem: elemObject}.
     * The first element the array of route objects is by default the root route object in which all other route objects 
     * are rendered into.
     */
    class Router {
        constructor() {
            this.instance = null;
            this.root = null;
            this.routes = [];
            this.loadCall = () => this.renderRoute(location.pathname);
            this.hashCall = () => this.renderRoute(location.hash);
            this.useHistory = window.history.pushState ? true : false;
            this.autoListen = true;
            this.registerListeners();
        }

        /**
         * Register listeners according to the useHistory state.
         */
        registerListeners() {
            if(this.useHistory && this.autoListen)
                window.addEventListener("load", this.loadCall);
            else if(this.autoListen)
                window.addEventListener("hashchange", this.hashCall);
            
            if(!this.autoListen)
                window.addEventListener("popstate", this.onPopState.bind(this));
        }

        /**
         * Clear the registered listeners.
         */
        clearListeners() {
            window.removeEventListener("load", this.loadCall);
            window.removeEventListener("hashchange", this.hashCall);

            if(!this.autoListen)
                window.removeEventListener("popstate", this.onPopState);
        }

        /**
         * On popstate call is registered if the auto listen is false. It listens the browsers history change and renders accordingly.
         */
        onPopState() {
            if(this.useHistory)
                this.renderRoute(location.pathname);
            else
                this.renderRoute(location.hash);
        }

        /**
         * Set the router to use a history implementation or an anchor hash implementation.
         * If true then the history implementation is used. Default is true.
         * @param {boolean} use
         */
        setUseHistory(use) {
            this.useHistory = use;
            this.setAutoListen(this.autoListen);
        }

        /**
         * Set the Router to auto listen url change to true or false.
         * @param {boolean} listen
         */
        setAutoListen(listen) {
            this.autoListen = listen;
            this.clearListeners();
            this.registerListeners();
        }

        /**
         * Set the routes and take the first element to be the root route element.
         * @param {array} routes
         */
        setRoutes(routes) {
            this.routes = routes;
            if(Util.isEmpty(this.root))
                this.root = this.routes.shift();
        }

        /**
         * Add a route into the Router. {route: "url", elem: elemObject}
         * @param {object} route
         */
        addRoute(route) {
            this.routes.push(route);
        }

        /**
         * Set a root route object into the Router. {route: "url", elem: elemObject}
         * @param {object} route
         */
        setRoot(route) {
            this.root = route;
        }

        /**
         * Method navigates to the url and renders a route element inside the root route element if found.
         * @param {string} url
         */
        navigateUrl(url) {
            var route = this.findRoute(url);
            if(!Util.isEmpty(route) && this.useHistory) {
                history.pushState(null, null, url);
            } else if(!Util.isEmpty(route)) {
                location.href = route.route.indexOf("#") === 0 ? route.route : "#"+route.route;
            }
            if(!Util.isEmpty(this.root)) {
                this.root.elem.render(route.elem);
            }
        }

        /**
         * Method looks for a route by the url. If the router is found then it will be returned otherwise returns null
         * @param {string} url
         * @returns The found router or null if not found.
         */
        findRoute(url) {
            var i = 0;
            if(!Util.isEmpty(url)) {
                while(i < this.routes.length) {
                    if(this.createRegExp(this.routes[i].route).test(url))
                        return this.routes[i];
                    i++;
                }
            }
            return null;
        }

        /**
         * Method will look for a route by the url and if the route is found then it will be rendered 
         * inside the root route element.
         * @param {string} url
         */
        renderRoute(url) {
            var route = this.findRoute(url);
            if(!Util.isEmpty(route)) 
                this.root.elem.render(route.elem);
            else
                this.root.elem.render();
        }

        /**
         * Create a RegExp for the url according to the useHistory state.
         * @param {string} url
         */
        createRegExp(url) {
            if(this.useHistory) {
                url = url.indexOf("/") === 0 ? url.replace("/", "") : url;
                return new RegExp(this.root.route+url.replace(/\*/g, ".*"));
            } else {
                return new RegExp("\#?"+url);
            }
        }

        /**
         * Method will try to find a route according to the url. If found then the Router will update the new url to the browser and 
         * render the found route element.
         */
        static navigate(url) {
            Router.getInstance().navigateUrl(url);
        }

        /**
         * Set a root element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {string} url
         * @param {object} elem
         */
        static root(url, elem) {
            Router.getInstance().setRoot({route: url, elem: elem});
        }

        /**
         * Add a new route element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {string} url
         * @param {object} elem
         */
        static add(url, elem) {
            Router.getInstance().addRoute({route: url, elem: elem});
        }

        /**
         * Set an array of routes that the Router uses. The first item in the given routes array will be the root route element by default.
         * @param {array} routes
         */
        static routes(routes) {
            if(!Util.isArray(routes))
                throw "Could not set routes. Given parameter: \"" + routes + "\" is not an array."
            Router.getInstance().setRoutes(routes);
        }

        /**
         * Set the Router use history or a anchor hash implementation. If a given value is true then the history implementation is used
         * otherwise the anchor hash implementation is used. Default is true.
         * @param {boolean} useHistory
         */
        static useHistory(useHistory) {
            if(!Util.isBoolean(useHistory))
                throw "Could not set use history mode. Given parameter: \"" + useHistory + "\" is not a boolean.";
            Router.getInstance().setUseHistory(useHistory);
        }

        /**
         * Set the Router auto listen url to true or false.
         * @param {boolean} listen
         */
        static autoListen(listen) {
            if(!Util.isBoolean(listen))
                throw "Could not set use history mode. Given parameter: \"" + listen + "\" is not a boolean.";
            Router.getInstance().setAutoListen(listen);
        }

        static getInstance() {
            if(Util.isEmpty(this.instance))
                this.instance = new Router();
            return this.instance;
        }
    }
    return {
        navigate: Router.navigate,
        root: Router.root,
        add: Router.add,
        routes: Router.routes,
        useHistory: Router.useHistory,
        autoListen: Router.autoListen
    }
}());

/**
 * Key class does not have any methods as it only contains key mappings for keyevent. For example:
 * 
 * onKeyDown(function(event) {
 *  if(event.key === Key.ENTER)
 *    //do something.
 * });
 */
class Key {}
/** Enter */
Key.ENTER = "Enter";
/** Escape */
Key.ESC = "Escape";
/** Tab */
Key.TAB = "Tab";
/** F1 */
Key.F1 = "F1";
/** F2 */
Key.F2 = "F2";
/** F3 */
Key.F3 = "F3";
/** F4 */
Key.F4 = "F4";
/** F5 */
Key.F5 = "F5";
/** F6 */
Key.F6 = "F6";
/** F7 */
Key.F7 = "F7";
/** F8 */
Key.F8 = "F8";
/** F9 */
Key.F9 = "F9";
/** F10 */
Key.F10 = "F10";
/** F11 */
Key.F11 = "F11";
/** F12 */
Key.F12 = "F12";
/** a */
Key.A = "a";
/** b */
Key.B = "b";
/** c */
Key.C = "c";
/** d */
Key.D = "d";
/** e */
Key.E = "e";
/** f */
Key.F = "f";
/** g */
Key.G = "g";
/** h */
Key.H = "h";
/** i */
Key.I = "i";
/** j */
Key.J = "j";
/** l */
Key.L = "l";
/** m */
Key.M = "m";
/** n */
Key.N = "n";
/** o */
Key.O = "o";
/** p */
Key.P = "p";
/** q */
Key.Q = "q";
/** r */
Key.R = "r";
/**s */
Key.S = "s";
/** t */
Key.T = "t";
/** u */
Key.U = "u";
/** v */
Key.V = "v";
/** w */
Key.W = "w";
/** x */
Key.X = "x";
/** y */
Key.Y = "y";
/** z */
Key.Z = "z";
/** CapsLock */
Key.CAPS_LOCK = "CapsLock";
/** NumLock */
Key.NUM_LOCK = "NumLock";
/** ScrollLock */
Key.SCROLL_LOCK = "ScrollLock";
/** Pause */
Key.PAUSE = "Pause";
/** PrintScreen */
Key.PRINT_SCREEN = "PrintScreen";
/** PageUp */
Key.PAGE_UP = "PageUp";
/** PageDown */
Key.PAGE_DOWN = "PageDown";
/** End */
Key.END = "End";
/** Home */
Key.HOME = "Home";
/** Delete */
Key.DELETE = "Delete";
/** Insert */
Key.INSERT = "Insert";
/** Alt */
Key.ALT = "Alt";
/** Control */
Key.CTRL = "Control";
/** ContextMenu */
Key.CONTEXT_MENU = "ContextMenu";
/** OS or Metakey */
Key.OS = "OS"; // META
/** AltGraph */
Key.ALTGR = "AltGraph";
/** Shift */
Key.SHIFT = "Shift";
/** Backspace */
Key.BACKSPACE = "Backspace";
/** § */
Key.SECTION = "§";
/** 1 */
Key.ONE = "1";
/** 2 */
Key.TWO = "2";
/** 3 */
Key.THREE = "3";
/** 4 */
Key.FOUR = "4";
/** 5 */
Key.FIVE = "5";
/** 6 */
Key.SIX = "6";
/** 7 */
Key.SEVEN = "7";
/** 8 */
Key.EIGHT = "8";
/** 9 */
Key.NINE = "9";
/** 0 */
Key.ZERO = "0";
/** + */
Key.PLUS = "+";
/** + */
Key.MINUS = "-";
/** * */
Key.STAR = "*";
/** / */
Key.SLASH = "/";
/** ArrowUp */
Key.ARROW_UP = "ArrowUp";
/** ArrowRight */
Key.ARROW_RIGHT = "ArrowRight";
/** ArrowDown */
Key.ARROW_DOWN = "ArrowDown";
/** ArrowLeft */
Key.ARROW_LEFT = "ArrowLeft";
/** , */
Key.COMMA = ",";
/** . */
Key.DOT = ".";


let Cookie = (function() {
    /**
     * Cookie interface offers an easy way to get, set or remove cookies in application logic.
     * The interface handles Cookie objects under the hood. The cookie object may hold following values:
     * 
     * {
     *    name: "name",
     *    value: "value",
     *    expiresDate: "expiresDate e.g. Date.toUTCString()",
     *    cookiePath: "cookiePath absolute dir",
     *    cookieDomain: "cookieDomain e.g example.com",
     *    setSecureBoolean: true|false
     * }
     * 
     * The cookie object also has methods toString() and setExpired(). Notice that setExpired() method wont delete the cookie but merely 
     * sets it expired. To remove a cookie you should invoke remove(name) method of the Cookie interface.
     */
    class Cookies {
        /**
         * Get a cookie by name. If the cookie is found a cookie object is returned otherwise null.
         * 
         * @param {String} name 
         * @returns cookie object
         */
        static get(name) {
            if(navigator.cookieEnabled) {
                var retCookie = null;
                var cookies = document.cookie.split(";");
                var i = 0;
                while(i < cookies.length) {
                    var cookie = cookies[i];
                    var eq = cookie.search("=");
                    var cn = cookie.substr(0, eq).trim();
                    var cv = cookie.substr(eq + 1, cookie.length).trim();
                    if(cn === name) {
                        retCookie = new Cookie(cn, cv);
                        break;
                    }
                    i++;
                }
                return retCookie;
            }
        }
        /**
         * Set a cookie. Name and value parameters are essential on saving the cookie and other parameters are optional.
         * 
         * @param {string} name
         * @param {string} value
         * @param {string} expiresDate
         * @param {string} cookiePath
         * @param {string} cookieDomain
         * @param {boolean} setSecureBoolean
         */
        static set(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
            if(navigator.cookieEnabled) {
                document.cookie = Cookie.create(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean).toString();
            }
        }
        /**
         * Remove a cookie by name. Method will set the cookie expired and then remove it.
         * @param {string} name
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
     * Cookie object may hold following values:
     *
     * {
     *    name: "name",
     *    value: "value",
     *    expiresDate: "expiresDate e.g. Date.toUTCString()",
     *    cookiePath: "cookiePath absolute dir",
     *    cookieDomain: "cookieDomain e.g example.com",
     *    setSecureBoolean: true|false
     * }
     * 
     * The cookie object also has methods toString() and setExpired(). Notice that setExpired() method wont delete the cookie but merely 
     * sets it expired. To remove a cookie you should invoke remove(name) method of the Cookie interface.
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
 * Session interface provides useful get, set, remove and clear methods.
 */
class Session {
    /**
     * Save data into the Session.
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {
        sessionStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the Session.
     * @param {string} key
     */
    static get(key) {
        return sessionStorage.getItem(key);
    }
    /**
     * Remove data from the Session.
     * @param {string} key
     */
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
 * HTML local storage interface provides useful get, set, remove and clear methods.
 */
class Storage {
    /**
     * Save data into the local storage. 
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {
        localStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the local storage.
     * @param {string} key
     */
    static get(key) {
        return localStorage.getItem(key);
    }
    /**
     * Remove data from the local storage.
     * @param {string} key
     */
    static remove(key) {
        localStorage.removeItem(key);
    }
    /**
     * Clears the local storage.
     */
    static clear() {
        localStorage.clear();
    }
}


/**
 * General Utility methods.
 */
class Util {
    /**
     * Checks is a given value empty.
     * @param {*} value
     * @returns True if the give value is null, undefined or an empty string. 
     */
    static isEmpty(value) {
        return (value === null || value === undefined || value === "");
    }

    /**
     * Get the type of the given value.
     * @param {*} value
     * @returns The type of the given value.
     */
    static getType(value) {
        return typeof value;
    }

    /**
     * Checks is a given value is a given type.
     * @param {*} value
     * @param {string} type
     * @returns True if the given value is the given type otherwise false.
     */
    static isType(value, type) {
        return (Util.getType(value) === type);
    }

    /**
     * Checks is a given parameter a function.
     * @param {*} func 
     * @returns True if the given parameter is fuction otherwise false.
     */
    static isFunction(func) {
        return Util.isType(func, "function");
    }

    /**
     * Checks is a given parameter a boolean.
     * @param {*} boolean
     * @returns True if the given parameter is boolean otherwise false.
     */
    static isBoolean(boolean) {
        return Util.isType(boolean, "boolean");
    }

    /**
     * Checks is a given parameter a string.
     * @param {*} string
     * @returns True if the given parameter is string otherwise false.
     */
    static isString(string) {
        return Util.isType(string, "string");
    }

    /**
     * Checks is a given parameter a number.
     * @param {*} number
     * @returns True if the given parameter is number otherwise false.
     */
    static isNumber(number) {
        return Util.isType(number, "number");
    }

    /**
     * Checks is a given parameter a symbol.
     * @param {*} symbol
     * @returns True if the given parameter is symbol otherwise false.
     */
    static isSymbol(symbol) {
        return Util.isType(symbol, "symbol");
    }

    /**
     * Checks is a given parameter a object.
     * @param {*} object
     * @returns True if the given parameter is object otherwise false.
     */
    static isObject(object) {
        return Util.isType(object, "object");
    }

    /**
     * Checks is a given parameter an array.
     * @param {*} array
     * @returns True if the given parameter is array otherwise false.
     */
    static isArray(array) {
        return Array.isArray(array);
    }

    /**
     * Sets a timeout where the given callback function will be called once after the given milliseconds of time.
     * @param {function} callback
     * @param {number} milliseconds
     * @returns The timeout object.
     */
    static setTimeout(callback, milliseconds) {
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
        if(!Util.isNumber(milliseconds)) {
            throw "milliseconds not a number"
        }
        return window.setTimeout(callback, milliseconds);
    }

    /**
     * Removes a timeout that was created by setTimeout method.
     * @param {object} timeoutObject
     */
    static clearTimeout(timeoutObject) {
        window.clearTimeout(timeoutObject);
    }

    /**
     * Sets an interval where the given callback function will be called in intervals after milliseconds of time has passed.
     * @param {function} callback
     * @param {number} milliseconds
     * @returns The interval object.
     */
    static setInterval(callback, milliseconds) {
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
        if(!Util.isNumber(milliseconds)) {
            throw "milliseconds not a number"
        }
        return window.setInterval(callback, milliseconds);
    }

    /**
     * Removes an interval that was created by setInterval method.
     */
    static clearInterval(intervalObject) {
        window.clearInterval(intervalObject);
    }

    /**
     * Encodes a string to Base64.
     * @param {string} string
     * @returns The base64 encoded string.
     */
    static encodeBase64String(string) {
        if(!Util.isString(string)) {
            throw "the given parameter is not a string: " +string;
        }
        return window.btoa(string);
    }

    /**
     * Decodes a base 64 encoded string.
     * @param {string} string
     * @returns The base64 decoded string.
     */
    static decodeBase64String(string) {
        if(!Util.isString(string)) {
            throw "the given parameter is not a string: " +string;
        }
        return window.atob(string);
    }
}

/**
 * Browser class contains all the rest utility functions which JavaScript has to offer from Window, Navigator, Screen, History, Location objects.
 */
class Browser {
    /**
     * Scroll once to a given location (xPos, yPos)
     * @param {number} xPos
     * @param {number} yPos
     */
    static scrollTo(xPos, yPos) {
        window.scrollTo(xPos, yPos);
    }

    /**
     * Scroll multiple times by given pixel amount (xPx, yPx)
     * @param {number} xPx
     * @param {number} yPx
     */
    static scrollBy(xPx, yPx) {
        window.scrollBy(xPx, yPx);
    }

    /**
     * Opens a new browser window.
     * 
     * Name pamareter can have following values: name or target value (name|_blank|_parent|_self|_top)
     * 
     * Specs parameter is defined as comma,separated,list,without,whitespace and it can have following values:
     * channelmode=yes|no|1|0,
     * direcotries=yes|no|1|0,
     * fullscreen=yes|no|1|0,
     * height=pixels,
     * left=pixels,
     * location=yes|no|1|0,
     * menubar=yes|no|1|0,
     * resizable=yes|no|1|0,
     * scrollbars=yes|no|1|0,
     * status=yes|no|1|0,
     * titlebar=yes|no|1|0,
     * toolbar|yes|no|1|0,
     * top=pixels,
     * width=pixels min 100
     * 
     * Replace parameter defines is a new history entry created or is current replaced with the new one.
     * If true the current entry is replaced with the new one. If false a new history entry is created.
     * @param {string} url 
     * @param {string} name 
     * @param {string} specs 
     * @param {boolean} replace 
     * @returns Reference to the opened window or null if opening the window failes.
     */
    static open(url, name, specs, replace) {
        return window.open(url, name, specs, replace);
    }

    /**
     * Closes a given opened window. Same as calling openedWindow.close();
     * @param {*} openedWindow 
     */
    static close(openedWindow) {
        openedWindow.close();
    }

    /**
     * Opens a print webpage dialog.
     */
    static print() {
        window.print();
    }

    /**
     * Displays an alert dialog with a given message and an OK button.
     * @param {string} message
     */
    static alert(message) {
        window.alert(message);
    }

    /**
     * Displays a confirm dialog with a given message, OK and Cancel button.
     * @param {string} message
     * @returns True if OK was pressed otherwise false.
     */
    static confirm(message) {
        return window.confirm(message);
    }

    /**
     * Displays a prompt dialog with a given message, a prefilled default text, OK and Cancel button.
     * @param {string} message
     * @param {string} defaultText
     * @returns If OK was pressed and an input field has text then the text is returned. 
     * If the input does not have text and OK was pressed then empty string is returned.
     * If Cancel was pressed then null is returned.
     */
    static prompt(message, defaultText) {
        return window.prompt(message, defaultText);
    }

    /**
     * Method is used to make a media query to the viewport/screen object.The media query is done according to a given mediaString.
     * Syntax of the media string would be (min-width: 300px) but using this method enables user to omit parentheses(). 
     * Which then leads to syntax min-width: 300px.
     * 
     * Method returns a MediaQueryList object which has few neat properties. Matches and media in addition it has 
     * two functions addListener and removeListener which can be used to query media in realtime. Usage could be something following:
     * 
     * var matcher = Browser.mediaMatcher("max-height: 300px");
     * 
     * matcher.addlistener(function(matcher) {
     *  if(matcher.matches)
     *      Tree.getBody().setStyles({backgroundColor: "red"});
     *  else
     *      Tree.getBody().setStyles({backgroundColor: "green"});
     * });
     * 
     * matcher.media returns the media query string.
     * 
     * matcher.matches returns the boolean indicating does it does the query string match or not. True if it matches, otherwise false.
     * 
     * mathcer.addListener(function(matcher)) is used to track changes on the viewport/screen.
     * 
     * matcher.removeListener(listenerFunction) is used to remove a created listener.
     * @param {string} mediaString 
     * @returns MediaQueryList object.
     */
    static mediaMatcher(mediaString) {
        if(mediaString.indexOf("(") !== 0)
            mediaString = "("+mediaString;
        if(mediaString.indexOf(")") !== mediaString.length -1)
            mediaString = mediaString+")";
        return window.matchMedia(mediaString);
    }

    /**
     * Loads one page back in the browsers history list.
     */
    static pageBack() {
        history.back();
    }

    /**
     * Loads one page forward in the browsers history list.
     */
    static pageForward() {
        history.forward();
    }

    /**
     * Loads to specified page in the browsers history list. A parameter can either be a number or string.
     * If the parameter is number then positive and negative values are allowed as positive values will go forward
     * and negative values will go backward. 
     * If the parameter is string then it must be partial or full url of the page in the history list.
     * @param {string|number} numberOfPagesOrUrl
     */
    static pageGo(numberOfPagesOrUrl) {
        history.go(numberOfPagesOrUrl)
    }

    /**
     * Create a new history entry with given parameters without reloading the page. State object will be the state
     * next history entry will be using. Title is ignored value by the history object at the time but it could be 
     * the same title what the HTML Document page has at the moment of create the new history entry. New url must 
     * be of the same origin (e.g. www.example.com) but the rest of url could be anything.
     * @param {object} stateObject 
     * @param {string} title 
     * @param {string} newURL 
     */
    static pushState(stateObject, title, newURL) {
        history.pushState(stateObject, title, newURL);
    }

    /**
     * Replace a history entry with given parameters without reloading the page. State object will be the state
     * next history entry will be using. Title is ignored value by the history object at the time but it could be 
     * the same title what the HTML Document page has at the moment of create the new history entry. New url must 
     * be of the same origin (e.g. www.example.com) but the rest of url could be anything.
     * @param {object} stateObject 
     * @param {string} title 
     * @param {string} newURL 
     */
    static replaceState(stateObject, title, newURL) {
        history.replaceState(stateObject, title, newURL);
    }

    /**
     * Loads a new page.
     * @param {string} newURL
     */
    static newPage(newURL) {
        location.assign(newURL);
    }

    /**
     * Reloads a current page. If a parameter force is true then the page will be loaded from the server 
     * otherwise from the browsers cache.
     * @param {boolean} force
     */
    static reloadPage(force) {
        location.reload(force);
    }

    /**
     * Replaces a current page with a new one. If the page is replaced then it wont be possible to go back
     * to the previous page from the history list.
     * @param {string} newURL
     */
    static replacePage(newURL) {
        location.replace(newURL);
    }

    /**
     * @returns Anchor part of the url e.g. #heading2.
     */
    static getAnchorHash() {
        return location.hash;
    }

    /**
     * Sets a new anhorpart of the url e.g. #heading3.
     * @param {string} hash
     */
    static setAnchorHash(hash) {
        location.hash = hash;
    }

    /**
     * @returns Hostname and port in host:port format.
     */
    static getHostnamePort() {
        return location.host;
    }

    /**
     * Set a hostname and port in format host:port.
     * @param {string} hostPort
     */
    static setHostnamePort(hostPort) {
        location.host = hostPort;
    }

    /**
     * @returns Hostname e.g. www.google.com.
     */
    static getHostname() {
        return location.hostname;
    }

    /**
     * Set a hostname
     * @param {string} hostname
     */
    static setHostname(hostname) {
        location.hostname = hostname;
    }

    /**
     * @returns Entire URL of the webpage.
     */
    static getURL() {
        return location.href;
    }

    /**
     * Set location of a current page to point to a new location e.g. http://some.url.test or #someAcnhor on the page.
     * @param {string} newURL
     */
    static setURL(newURL) {
        location.href = newURL;
    }

    /**
     * @returns protocol, hostname and port e.g. https://www.example.com:443
     */
    static getOrigin() {
        return location.origin;
    }

    /**
     * @returns Part of the URL after the slash(/) e.g. /photos/
     */
    static getPathname() {
        return location.pathname;
    }

    /**
     * Sets a new pathname for this location.
     * @param {string} pathname 
     */
    static setPathname(pathname) {
        location.pathname = pathname;
    }

    /**
     * @returns Port number of the connection between server and client.
     */
    static getPort() {
        return location.port;
    }

    /**
     * Sets a new port number for the connection between server and client.
     * @param {number} portNumber 
     */
    static setPort(portNumber) {
        location.port = portNumber;
    }

    /**
     * @returns Protocol part of the URL e.g. http: or https:.
     */
    static getProtocol() {
        return location.protocol;
    }

    /**
     * Set a new protocol for this location to use.
     * @param {string} protocol 
     */
    static setProtocol(protocol) {
        location.protocol = protocol;
    }

    /**
     * @returns Part of the URL after the question(?) mark. e.g. ?attr=value&abc=efg.
     */
    static getSearchString() {
        return location.search;
    }

    /**
     * Sets a new searchString into the URL
     * @param {string} searchString 
     */
    static setSearchString(searchString) {
        location.search = searchString;
    }

    /**
     * @returns Codename of the browser.
     */
    static getCodename() {
        return navigator.appCodeName;
    }

    /**
     * @returns Name of the browser.
     */
    static getName() {
        return navigator.appName;
    }

    /**
     * @returns Version of the browser.
     */
    static getVersion() {
        return navigator.appVersion;
    }

    /**
     * @returns True if cookies are enabled otherwise false.
     */
    static isCookiesEnabled() {
        return navigator.cookieEnabled;
    }

    /**
     * @returns GeoLocation object.
     */
    static getGeoLocation() {
        return navigator.geolocation;
    }

    /**
     * @returns Language of the browser.
     */
    static getLanguage() {
        return navigator.language;
    }

    /**
     * @returns A platform name of which the browser is compiled on.
     */
    static getPlatform() {
        return navigator.platform;
    }

    /**
     * @returns A name of an engine of the browser.
     */
    static getProduct() {
        return navigator.product;
    }

    /**
     * @returns A header string sent to a server by the browser.
     */
    static getUserAgentHeader() {
        return navigator.userAgent;
    }

    /**
     * @returns Color depth of the current screen.
     */
    static getColorDepth() {
        return screen.colorDepth;
    }

    /**
     * @returns Total height of the current screen.
     */
    static getFullScreenHeight() {
        return screen.height;
    }

    /**
     * @returns Total width of the current screen.
     */
    static getFullScreenWidth() {
        return screen.width;
    }

    /**
     * @returns Height of the current screen excluding OS. taskbar.
     */
    static getAvailableScreenHeight() {
        return screen.availHeight;
    }

    /**
     * @returns Width of the current screen exluding OS. taskbar.
     */
    static getAvailableScreenWidth() {
        return screen.availWidth;
    }
}