"use strict"

let RME = (function() {
    /**
     * RME stands for Rest Made Easy. This is a small easy to use library that enables you to create RESTfull webpages with ease and speed.
     * This library is free to use anyhow without warranty of any kind.
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
         * Runs a runnable script immedeately
         */
        static run(runnable) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().setRunner(runnable).start();
        }

        /**
         * Waits until body has been loaded and then runs a runnable script
         */
        static ready(runnable) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().setComplete(runnable);
        }

        static component(runnable, props) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().addComponent(runnable);
            else if(runnable && Util.isString(runnable))
                return RME.getInstance().getComponent(runnable, props);
        }

        static storage(key, value) {
            if(!Util.isEmpty(key) && !Util.isEmpty(value))
                RME.getInstance().setRmeState(key, value);
            else if(!Util.isEmpty(key) && Util.isEmpty(value))
                return RME.getInstance().getRmeState(key);
        }

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
        onrmestoragechange: RME.onrmestoragechange,
        config: RME.config
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
        return contentType === "application/json;charset=UTF-8";
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

    setText(text) {
        this.html.appendChild(document.createTextNode(text));
        return this;
    }

    getContent() {
        return this.html.innerHTML;
    }

    setContent(html) {
        this.html.innerHTML = html;
        return this;
    }

    setValue(value) {
        this.html.value = value;
        return this;
    }

    getValue() {
        return this.html.value;
    }

    setId(id) {
        this.html.id = id;
        return this;
    }

    getId() {
        return this.html.id;
    }

    append(elem) {
        this.html.appendChild(elem.dom());
        return this;
    }

    remove(elem) {
        this.html.removeChild(elem.dom());
        return this;
    }

    replace(newElem) {
        this.html.parentElement.replaceChild(newElem.dom(), this.html);
        return this;
    }

    before(newElem) {
        this.html.parentElement.insertBefore(newElem.dom(), this.html);
        return this;
    }

    after(newElem) {
        if(this.html.nextElementSibling !== null)
            this.html.parentElement.insertBefore(newElem.dom(), this.html.nextElementSibling);
        else
            this.html.parentElement.appendChild(newElem.dom());
        return this;
    }

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
            if(newState.hasOwnProperty(e))
                this.append(newState[e]);
        }
        return this;
    }

    getChildren() {
        return this.html.children;
    }

    setTitle(text) {
        this.html.title = text;
        return this;
    }

    getTitle() {
        return this.html.title;
    }

    setTabIndex(idx) {
        this.html.tabIndex = idx;
        return this;
    }

    getTabIndex() {
        return this.html.tabIndex;
    }

    getTagName() {
        return this.html.tagName;
    }

    setAttribute(attr, value) {
        var attribute = document.createAttribute(attr);
        attribute.value = value;
        this.html.setAttributeNode(attribute);
        return this;
    }

    getAttribute(attr) {
        return this.html.getAttributeNode(attr);
    }

    removeAttribute(attr) {
        return this.html.removeAttributeNode(this.getAttribute(attr));
    }

    setName(name) {
        this.setAttribute("name", name);
        return this;
    }

    getName() {
        return this.getAttribute("name").value;
    }


    setType(type) {
        this.setAttribute("type", type);
        return this;
    }

    getType() {
        return this.getAttribute("type").value;
    }

    setSource(source) {
        this.setAttribute("src", source);
        return this;
    }

    getSource() {
        return this.getAttribute("src").value;
    }

    setHref(href) {
        this.setAttribute("href", href);
        return this;
    }

    getHref() {
        return this.getAttribute("href").value;
    }

    setChecked(boolean) {
        this.html.checked = boolean;
        return this;
    }

    getChecked() {
        return this.html.checked;
    }

    addClasses(classes) {
        var toAdd = classes.trim().split(" ");
        var origClass = this.getClasses();
        for(var i=0; i<toAdd.length; i++) {
            var clazz = toAdd[i];
            if(origClass.search(clazz) === -1)
                origClass += " "+clazz;
        }
        this.html.className = origClass;
        return this;
    }

    removeClasses(classes) {
        var toRm = classes.trim().split(" ");
        var origClass = this.getClasses();
        for(var i=0; i<toRm.length; i++) {
            var clazz = toRm[i];
            if(origClass.search(clazz) > -1)
                origClass = origClass.replace(clazz, "").trim();
        }
        this.html.className = origClass;
        return this;
    }

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
    }

    getClasses() {
        return this.html.className;
    }

    setStyles(styleMap) {
        for(var style in styleMap) {
            if(styleMap.hasOwnProperty(style))
                this.html.style[style] = styleMap[style];
        }
        return this;
    }

    getStyle(styleName) {
        return this.html.style[styleName];
    }

    setVisible(boolean) {
        this.html.style.visibility = boolean ? "visibile" : "hidden";
        return this;
    }

    display(boolean) {
        this.html.style.display = boolean ? "initial" : "none";
        return this;
    }

    setDraggable(boolean) {
        this.setAttribute("draggable", boolean);
        return this;
    }

    click() {
        this.html.click();
        return this;
    }

    focus() {
        this.html.focus();
        return this;
    }

    blur() {
        this.html.blur();
        return this;
    }

    clone(deep) {
        return Elem.wrap(this.html.cloneNode(deep));
    }

    dom() {
        return this.html;
    }

    height() {
        return this.html.clientHeight;
    }

    width() {
        return this.html.clientWidth;
    }

    parent() {
        return this.html.parentElement !== null ? Elem.wrap(this.html.parentElement) : null;
    }

    next() {
        return this.html.nextElementSibling !== null ? Elem.wrap(this.html.nextElementSibling) : null;
    }

    previous() {
        return this.html.previousElementSibling !== null ? Elem.wrap(this.html.previousElementSibling) : null;
    }

    getFirstChild() {
        return this.html.firstElementChild !== null ? Elem.wrap(this.html.firstElementChild) : null;
    }

    getLastChild() {
        return this.html.lastElementChild !== null ? Elem.wrap(this.html.lastElementChild) : null;
    }

    //EVENTS BELOW

    //Animation events
    onanimationstart(handler) {
        this.html.onanimationstart = handler;
        // this.html.addEventListener("webkitAnimationStart", handler);
        // this.html.addEventListener("mozAnimationStart", handler);
        return this;
    }

    onanimationiteration(handler) {
        this.html.onanimationiteration = handler;
        // this.html.addEventListener("webkitAnimationIteration", handler);
        // this.html.addEventListener("mozAnimationIteration", handler);
        return this;
    }

    onanimationend(handler) {
        this.html.onanimationend = handler;
        // this.html.addEventListener("webkitAnimationEnd", handler);
        // this.html.addEventListener("mozAnimationEnd", handler);
        return this;
    }

    ontransitionend(handler) {
        this.html.ontransitionend = handler;
        // this.html.addEventListener("webkitTransitionEnd", handler);
        // this.html.addEventListener("mozTransitionEnd", handler);
        // this.html.addEventListener("oTransitionEnd", handler);
        return this;
    }

    //Drag events
    ondrag(handler) {
        this.html.ondrag = handler;
        return this;
    }

    ondragend(handler) {
        this.html.ondragend = handler;
        return this;
    }

    ondragenter(handler) {
        this.html.ondragenter = handler;
        return this;
    }

    ondragover(handler) {
        this.html.ondragover = handler;
        return this;
    }

    ondragstart(handler) {
        this.html.ondragstart = handler;
        return this;
    }

    ondrop(handler) {
        this.html.ondrop = handler;
        return this;
    }

    //Mouse events
    onclick(handler) {
        this.html.onclick = handler;
        return this;
    }

    ondbclick(handler) {
        this.html.ondblclick = handler;
        return this;
    }

    oncontextmenu(handler) {
        this.html.oncontextmenu = handler;
        return this;
    }

    onmousedown(handler) {
        this.html.onmousedown = handler;
        return this;
    }

    onmouseenter(handler) {
        this.html.onmouseenter = handler;
        return this;
    }

    onmouseleave(handler) {
        this.html.onmouseleave = handler;
        return this;
    }

    onmousemove(handler) {
        this.html.onmousemove = handler;
        return this;
    }

    onmouseover(handler) {
        this.html.onmouseover = handler;
        return this;
    }

    onmouseout(handler) {
        this.html.onmouseout = handler;
        return this;
    }

    onmouseup(handler) {
        this.html.onmouseup = handler;
        return this;
    }

    onwheel(handler) {
        this.html.onwheel = handler;
        return this;
    }

    //UI events
    onscroll(handler) {
        this.html.onscroll = handler;
        return this;
    }

    onresize(handler) {
        this.html.onresize = handler;
        return this;
    }

    onabort(handler) {
        this.html.onabort = handler;
        return this;
    }

    onerror(handler) {
        this.html.onerror = handler;
        return this;
    }

    onload(handler) {
        this.html.onload = handler;
        return this;
    }

    onunload(handler) {
        this.html.onunload = handler;
        return this;
    }

    onbeforeunload(handler) {
        this.html.onbeforeunload = handler;
        return this;
    }

    //Key events
    onkeyup(handler) {
        this.html.onkeyup = handler;
        return this;
    }

    onkeydown(handler) {
        this.html.onkeydown = handler;
        return this;
    }

    onkeypress(handler) {
        this.html.onkeypress = handler;
        return this;
    }

    oninput(handler) {
        this.html.oninput = handler;
        return this;
    }

    //Events (changing state)
    onchange(handler) {
        this.html.onchange = handler;
        return this;
    }

    onsubmit(handler) {
        this.html.onsubmit = handler;
        return this;
    }

    onselect(handler) {
        this.html.onselect = handler;
        return this;
    }
    
    onreset(handler) {
        this.html.onreset = handler;
        return this;
    }

    onfocus(handler) {
        this.html.onfocus = handler;
        return this;
    }

    onfocusin(handler) {
        this.html.onfocusin = handler;
        return this;
    }

    onfocusout(handler) {
        this.html.onfocusout = handler;
        return this;
    }

    onblur(handler) {
        this.html.onblur = handler;
        return this;
    }

    //Clipboard events
    oncopy(handler) {
        this.html.oncopy = handler;
        return this;
    }

    oncut(handler) {
        this.html.oncut = handler;
        return this;
    }

    onpaste(handler) {
        this.html.onpaste = handler;
        return this;
    }

    //Media events
    onwaiting(handler) {
        this.html.onwaiting = handler;
        return this;
    }

    onvolumechange(handler) {
        this.html.onvolumechange = handler;
        return this;
    }

    ontimeupdate(handler) {
        this.html.ontimeupdate = handler;
        return this;
    }

    onseeking(handler) {
        this.html.onseeking = handler;
        return this;
    }

    onseekend(handler) {
        this.html.onseekend = handler;
        return this;
    }

    onratechange(handler) {
        this.html.onratechange = handler;
        return this;
    }

    onprogress(handler) {
        this.html.onprogress = handler;
        return this; 
    }

    onloadmetadata(handler) {
        this.html.onloadmetadata = handler;
        return this;
    }

    onloadeddata(handler) {
        this.html.onloadeddata = handler;
        return this;
    }

    onloadstart(handler) {
        this.html.onloadstart = handler;
        return this;
    }

    onplaying(handler) {
        this.html.onplaying = handler;
        return this;
    }

    onplay(handler) {
        this.html.onplay = handler;
        return this;
    }

    onpause(handler) {
        this.html.onpause = handler;
        return this;
    }

    onended(handler) {
        this.html.onended = handler;
        return this;
    }

    ondurationchange(handler) {
        this.html.ondurationchange = handler;
        return this;
    }

    oncanplay(handler) {
        this.html.oncanplay = handler;
        return this;
    }

    oncanplaythrough(handler) {
        this.html.oncanplaythrough = handler;
        return this;
    }

    onstalled(handler) {
        this.html.onstalled = handler;
        return this;
    }

    onsuspend(handler) {
        this.html.onsuspend = handler;
        return this;
    }

    //Browser events
    onpopstate(handler) {
        this.html.onpopstate = handler;
        return this;
    }

    onstorage(handler) {
        this.html.onstorage = handler;
        return this;
    }

    onhashchange(handler) {
        this.html.onhashchange = handler;
        return this;
    }

    onafterprint(handler) {
        this.html.onafterprint = handler;
        return this;
    }

    onbeforeprint(handler) {
        this.html.onbeforeprint = handler;
        return this;
    }

    onpagehide(handler) {
        this.html.onpagehide = handler;
        return this;
    }

    onpageshow(handler) {
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

    static wrapElems(elems) {
        var eArr = [];
        for(var i in elems) {
            if(elems.hasOwnProperty(i)) {
                eArr.push(Elem.wrap(elems[i]));
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
        return document.activeElement;
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

class Key {}
Key.ENTER = "Enter";
Key.ESC = "Escape";
Key.TAB = "Tab";
Key.F1 = "F1";
Key.A = "a";
Key.CAPSLOCK = "CapsLock";
Key.NUMLOCK = "NumLock";
Key.SCROLLLOCK = "ScrollLock";
Key.PAUSE = "Pause";
Key.PRINTSCREEN = "PrintScreen";
Key.PAGEUP = "PageUp";
Key.PAGEDOWN = "PageDown";
Key.END = "End";
Key.HOME = "Home";
Key.DELETE = "Delete";
Key.INSERT = "Insert";
Key.ALT = "Alt";
Key.CTRL = "Control";
Key.CONTEXTMENU = "ContextMenu";
Key.OS = "OS"; // META
Key.ALTGR = "AltGraph";
Key.SHIFT = "Shift";
Key.BACKSPACE = "Backspace";
Key.HALF = "½";
Key.SECTION = "§";
Key.ONE = "1";


let Cookie = (function() {
    /**
     * Cookies
     */
    class Cookies {
        static get(name) {
            if(navigator.cookieEnabled) {
                var retCookie = null;
                var cookies = document.cookie.split(";");
                for(var i in cookies) {
                    if(cookies.hasOwnProperty(i)) {
                        var cookie = cookies[i];
                        var eq = cookie.search("=");
                        var cn = cookie.substr(0, eq);
                        var cv = cookie.substr(eq + 1, cookie.length);
                        if(cn === name) {
                            retCookie = new Cookie(cn, cv);
                            //return false;
                            break;
                        }
                    }
                }
                return retCookie;
            }
        }
        /**
         * Receives cookie object:
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
        static remove(name) {
            var co = Cookies.get(name);
            if(!Util.isEmpty(co))
                Cookies.set(co.setExpired());
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
            return "\""+this.cookieName+"="+this.cookieValue+"; expires="+this.cookieExpires+"; path="+this.cookiePath+"; domain="+this.cookieDomain+"; "+this.cookieSecurity+"\"";
        }
        static create(name, value, expires, cpath, cdomain, setSecure) {
                return new Cookie(name, value, expires, cpath, cdomain, setSecure);
        }
    }

    return Cookies;
}());

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
    static clear() {
        sessionStorage.clear();
    }
}

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
