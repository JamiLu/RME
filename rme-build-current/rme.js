/** RME BUILD FILE **/
/**
 * General Utility methods.
 */
class Util {
    /**
     * Checks is a given value empty.
     * @param {*} value
     * @returns True if the give value is null, undefined, an empty string or an array and lenght of the array is 0.
     */
    static isEmpty(value) {
        return (value === null || value === undefined)
            || (Util.isString(value) && value === "")
            || (Util.isObject(value) && Object.keys(value).length === 0)
            || (Util.isArray(value) && value.length === 0);
    }

    /**
     * Checks is the given value not empty. This function is a negation to the Util.isEmpty function.
     * @param {*} value 
     * @returns True if the value is not empty otherwise false.
     */
    static notEmpty(value) {
        return !Util.isEmpty(value)
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
}



/**
 * Manages between component shareable values.
 */
const ValueStore = (function() {

    class ValueStore {
        constructor() {
            this.values = new Map();
            this.valueRefGenerator = new RefGenerator('val');
        }
    
        /**
         * The function will set the given value to the app instance and return a getter and a setter function
         * for the given value. Values can be shared and used in between any component.
         * @param {*} value 
         * @returns An array containing the getter and the setter functions for the given value.
         */
        useValue(value, appName) {
            if (Util.isFunction(value)) {
                value = value(value);
            }
            const ref = this.valueRefGenerator.next();
            this.values.set(ref, value);
    
            const getter = () => this.values.get(ref);
            const setter = (next, update) => {
                if (Util.isFunction(next)) {
                    next = next(getter());
                }
    
                this.values.set(ref, next);
                
                if (update !== false) {
                    RMEAppManager.getOrDefault(appName).refresh();
                }
            }
            return [getter, setter];
        }
    }
    
    class RefGenerator {
        constructor(feed) {
            this.feed = feed || "";
            this.seq = 0;
        }
    
        next() {
            const ref = this.feed+this.seq;
            this.seq++
            return ref;
        }
    }
    
    const valueStore = new ValueStore();

    return valueStore;

})();




/**
 * The createApp function is a shortcut function to create an RME application.
 * @param {string} selector
 * @param {function} component
 * @param {string} appName
 * @returns a created app instance.
 */
const createApp = (function() {

    const matchSelector = (key) => {
        let match = key.match(/#[a-zA-Z-0-9\-]+/); // id
        if (!match) {
            match = key.match(/\.[a-zA-Z-0-9\-]+/); // class
        }
        return match ? match.join() : undefined;
    }

    return (template) => {
        if (!Util.isObject(template)) {
            throw new Error('The app creation template must be an object.');
        }
        const selector = matchSelector(Object.keys(template).shift());
        if (Util.isEmpty(selector)) {
            throw new Error('The root selector could not be parsed from the template. Selector should be type an #id or a .class');
        }

        return RMEAppBuilder.root(selector).create(Object.values(template).shift());
    }

})();

/**
 * The function will set the given value in the app value state. The value is accessible by
 * a returned getter and a setter function.
 * @param {*} value Value to set in the app state
 * @param {string} appName Optional app name
 * @returns An array containing the getter and the setter functions for the given value.
 */
const useValue = (function() {

    return (value, appName) => ValueStore.useValue(value, appName);

})();




/**
 * Keeps RME App instances in memory
 */
const RMEAppManager = (function() {

    let seq = 0;
    const prefix = 'app';
    const [getFrom, setTo] = useValue({});

    /**
     * Set application instance in to the manager
     * @param {string} name 
     * @param {*} value 
     */
    const set = (name, value) => 
        setTo(store => ({
            ...store,
            [name]: value
        }), false);

    /**
     * Get application instance from the store by name
     * @param {string} name 
     * @returns Application instance
     */
    const get = (name) => getFrom()[name];

    /**
     * Get application instance by name or return default application instance.
     * The default application instance is returned if the given name parameter is empty.
     * @param {string} name 
     * @returns Application instance
     */
    const getOrDefault = (name) => Util.notEmpty(name) ? get(name) : get(`${prefix}0`);

    /**
     * Returns an array containing all application instances.
     * @returns Array
     */
    const getAll = () => Object.values(getFrom());

    /**
     * Creates a next available application name.
     * @returns Application name
     */
    const createName = () => {
        while (Util.notEmpty(get(prefix + seq))) {
            seq++;
        }
        return prefix + seq;
    }

    return {
        set,
        get,
        getAll,
        createName,
        getOrDefault
    }

})();



const RMEAppBuilder = (function() {

    const holder = {
        appRoot: undefined
    }

    class Builder {

        /**
         * Function will set a root for an application. If the root is not set then body is used by default.
         * @param {string} root 
         * @returns Builder
         */
        static root(root) {
            holder.appRoot = Util.isString(root) && root;
            return Builder;
        }
    
        /**
         * Reset Builder settings
         * @returns Builder
         */
        static reset() {
            holder.appRoot = undefined;
            return Builder;
        }
    
        /**
         * Function creates an application. The given parameter can either be a Template object or an Elem object.
         * @param {*} object 
         * @returns AppInstance
         */
        static create(object) {
            if (!(RMETemplateResolver.isTemplate(object) || RMETemplateFragmentHelper.isFragment(object))) {
                throw new Error('App template must start with a valid html tag or a fragment key');
            }
            const app = new AppInstance(RMEAppManager.createName(), holder.appRoot, object);
            RMEAppManager.set(app.name, app);
            Builder.reset();
            return app;
        }
    }

    class AppInstance {
        constructor(name, root, object) {
            this.rawStage = object;
            this.name = name;
            this.root;
            this.renderer;
            this.oldStage = "";
            this.ready = false;
            this.refreshQueue;
            this.bindReadyListener(root);
        }
    
        bindReadyListener(root) {
            ['loading','interactive'].includes(document.readyState) 
                ? ready(() => this.init(root))
                : this.init(root);
        }
    
        /**
         * Initialize the Application
         * @param {string} root 
         */
        init(root) {
            this.root = Util.isEmpty(root) ? Tree.getBody() : Tree.getFirst(root);
            this.renderer = new RMEElemRenderer(this.root);
            this.ready = true;
            this.refresh();
        }
    
        refresh() {
            if (this.ready) {
                if (this.refreshQueue) {
                    Browser.clearTimeout(this.refreshQueue);
                }
                this.refreshQueue = Browser.setTimeout(() => {
                    const freshStage = RMETemplateResolver.resolve({[this.root.toLiteralString()]: { ...this.rawStage }}, null, this.name);

                    if (this.oldStage !== freshStage.toString()) {
                        this.oldStage = this.renderer.merge(freshStage).toString();
                    }
                    Browser.clearTimeout(this.refreshQueue);
                });
            }
        }
    }

    return {
        root: Builder.root,
        create: Builder.create
    }
}());





class RMEElemRenderer {
    constructor(root) {
        this.root = root;
        this.mergedStage;
        this.tobeRemoved = [];
    }

    /**
     * Function merges a newStage to a oldStage. Merge rules are following.
     * New stage has what old stage doesn't > add it.
     * New stage has what old stage has > has it changed ? yes > change|update it : no > do nothing.
     * New stage doesn't have what old stage has > remove it.
     * @param {object} oldStage
     * @param {object} newStage
     * @returns The merged stage.
     */
    merge(newStage) {
        this.updateEventListeners(this.root, newStage);

        const [ oldChildren, newChildren ] = this.getChildren(this.root, newStage);

        if (Util.isEmpty(this.root.getChildren())) {
            this.root.render(newChildren);
        } else {
            let i = 0;
            while (i < newChildren.length || i < oldChildren.length) {
                this.render(this.root, newStage, oldChildren[i], newChildren[i], i);
                i++;
            }
            
            this.removeToBeRemoved();
        }

        return this.root;
    }

    /**
     * Get children of the oldNode and the newNode. Returns an array that contains two arrays where one is old children and another is new children
     * @param {Elem} oldNode
     * @param {Elem} newNode 
     * @returns Array that contains two arrays
     */
    getChildren(oldNode, newNode) {
        return [
            Array.of(oldNode.getChildren()).flat(),
            Array.of(newNode.getChildren()).flat()
        ]
    }

    /**
     * Function is called recusively and goes through a oldStage and a newStage simultaneosly in recursion and comparing them and updating changed content.
     * @param {object} parent 
     * @param {object} oldNode 
     * @param {object} newNode 
     * @param {number} index 
     */
    render(parent, newParent, oldNode, newNode, index) {
        if (!oldNode && newNode) {
            parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
            this.tobeRemoved.push({parent: parent, child: this.wrap(parent.dom().children[index])});
        } else if (this.hasNodeChanged(oldNode, newNode)) {
            if (oldNode.getTagName() !== newNode.getTagName() || (oldNode.dom().children.length > 0 || newNode.dom().children.length > 0)) {
                this.wrap(parent.dom().children[index]).replace(newNode.duplicate());
            } else {
                oldNode.setProps({
                    ...this.getBrowserSetStyle(parent, index), 
                    ...newNode.getProps()
                });
            }
        } else {
            if (parent.dom().children.length > newParent.dom().children.length) {
                let i = 0;
                const [ oldChildren, newChildren ] = this.getChildren(parent, newParent);
                while (i < newChildren.length) {
                    this.updateEventListeners(oldChildren[i], newChildren[i]);
                    i++;
                }
            }
            
            let i = 0;
            let oldLength = oldNode ? oldNode.dom().children.length : 0;
            let newLength = newNode ? newNode.dom().children.length : 0;
            
            while (i < newLength || i < oldLength) {
                this.render(
                    this.wrap(parent.dom().children[index]),
                    this.wrap(newParent.dom().children[index]),
                    oldNode ? this.wrap(oldNode.dom().children[i]) : null,
                    newNode ? this.wrap(newNode.dom().children[i]) : null,
                    i);
                i++;
            }
        }
    }

    /**
     * Get browser set style of the node if present from the parent in the specific index.
     * @param {object} parent 
     * @param {number} index 
     * @returns Properties object containing the style attribute of the node in the shadow three.
     */
    getBrowserSetStyle(parent, index) {
        const props = this.wrap(parent.dom().children[index]).getProps();
        return props.style ? {style: props.style} : null
    }

    /**
     * Update event listeners of the old node to event listeners of the new node.
     * @param {object} oldNode 
     * @param {object} newNode 
     */
    updateEventListeners(oldNode, newNode) {
        const listeners = this.getEventListeners(newNode);
        if (Object.keys(listeners).length > 0) {
            oldNode.setProps({...oldNode.getProps(), ...listeners});
        }
    }

    /**
     * Get event listeners of the node
     * @param {object} node 
     * @returns An object containing defined event listeners
     */
    getEventListeners(node) {
        const props = node.getProps();
        for (let p in props) {
            if (props.hasOwnProperty(p) && p.indexOf('on') !== 0) {
                delete props[p]
            }
        }
        return props;
    }

    /**
     * Function removes all the marked as to be removed elements which did not come in the new stage by starting from the last to the first.
     */
    removeToBeRemoved() {
        if(this.tobeRemoved.length > 0) {
            let lastIdx = this.tobeRemoved.length - 1;
            while (lastIdx >= 0) {
                this.tobeRemoved[lastIdx].parent.remove(this.tobeRemoved[lastIdx].child);
                lastIdx--;
            }
            this.tobeRemoved = [];
        }
    }

    /**
     * Function takes two Elem objects as parameter and compares them if they are equal or have some properties changed.
     * @param {object} oldNode 
     * @param {object} newNode 
     * @returns True if the given Elem objects are the same and nothing is changed otherwise false is returned.
     */
    hasNodeChanged(oldNode, newNode) {
        return !!oldNode && !!newNode && oldNode.getProps(true) !== newNode.getProps(true);
    }

    /**
     * Function takes DOM node as a parameter and wraps it to Elem object.
     * @param {object} node 
     * @returns the Wrapped Elem object.
     */
    wrap(node) {
        if (node) return Elem.wrap(node);
    }

}


/**
 * Browser class contains all the rest utility functions which JavaScript has to offer from Window, Navigator, Screen, History, Location objects.
 */
class Browser {

    /**
     * Sets a timeout where the given callback function will be called once after the given milliseconds of time. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The timeout object.
     */
    static setTimeout(callback, milliseconds, ...params) {
        return window.setTimeout(callback, milliseconds, params);
    }

    /**
     * Removes a timeout that was created by setTimeout method.
     * @param {object} timeoutObject
     */
    static clearTimeout(timeoutObject) {
        window.clearTimeout(timeoutObject);
    }

    /**
     * Sets an interval where the given callback function will be called in intervals after milliseconds of time has passed. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The interval object.
     */
    static setInterval(callback, milliseconds, ...params) {
        return window.setInterval(callback, milliseconds, params);
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
    static toBase64(string) {
        return window.btoa(string);
    }

    /**
     * Decodes a base 64 encoded string.
     * @param {string} string
     * @returns The base64 decoded string.
     */
    static fromBase64(string) {
        return window.atob(string);
    }

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
     * Method is used to make a media query to the viewport/screen object. The media query is done according to a given mediaString.
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



class RMEAppComponent {
    constructor(renderHook, appName, parentContext) {
        this.store = useValue({}, appName);
        this.appName = appName;
        this.parentContext = parentContext;
        this.shouldUpdate = true;
        this.renderHook = renderHook;
        this.afterRenderTasks = [];
        this.prevProps = {}
        this.prevResult;
    }

    render(props) {
        const [getState, setState] = this.store;

        const nextProps = {
            ...props,
            ...getState()
        }

        const ops = {
            setState,
            updateState: (next, update) => {
                setState(state => ({
                    ...state,
                    ...(Util.isFunction(next) ? next(getState()) : next)
                }), update);
            },
            isStateEmpty: () => Object.keys(getState()).length === 0,
            shouldComponentUpdate: (shouldUpdateHook) => {
                if (Util.isFunction(shouldUpdateHook)) {
                    this.shouldUpdate = shouldUpdateHook(nextProps, this.prevProps) !== false;
                }
            },
            asyncTask: (asyncTaskHook) => {
                if (Util.isFunction(asyncTaskHook)) {
                    this.afterRenderTasks.push(asyncTaskHook)
                }
            }
        };

        let result;

        if (this.shouldUpdate) {
            result = this.renderHook(nextProps, ops);
            result = RMETemplateResolver.isTemplate(result) ? RMETemplateResolver.resolve(result, null, this.appName, this.parentContext) : result;
        } else {
            result = this.prevResult;
        }

        this.prevResult = result;
        this.prevProps = nextProps;

        if (this.afterRenderTasks.length > 0) {
            Browser.setTimeout(async () => {
                this.afterRenderTasks.forEach(async hook => hook());
                this.afterRenderTasks.length = 0;
            });
        }

        return result;
    }


}



/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 * @param {function} components commma separated list of components
 */
const Component = (function() {

    const resolveComponent = component => {
        if (Util.isFunction(component)) {
            RMEComponentManagerV2.addComponent(component.valueOf().name, component);
        }
    }

    return (...components) => {
        components.forEach(component => 
            !Util.isEmpty(component.valueOf().name) && resolveComponent(component));
    }

})();





/**
 * Manages RME components
 */
const RMEComponentManagerV2 = (function() {

    class RMEComponentManager {
        constructor() {
            this.componentFunctionMap = {};
            this.componentInstanceMap = {};
        }

        hasComponent(name) {
            return this.componentFunctionMap[name] !== undefined;
        }

        addComponent(name, renderHook) {
            if (!this.hasComponent(name)) {
                this.componentFunctionMap[name] = renderHook;
            }
        }

        getComponent(name, props, parentContext = '', appName = '') {
            let component = this.componentInstanceMap[appName + name + parentContext];
            if (!component) {
                component = new RMEAppComponent(this.componentFunctionMap[name], appName, parentContext);
                this.componentInstanceMap[appName + name + parentContext] = component;
            }
            
            return component.render(props);
        }

    }

    return new RMEComponentManager();

})();




/**
 * A CSS function will either create a new style element containing given css and other parameters 
 * or it will append to a existing style element if the element is found by given parameters.
 * @param {string} css string
 * @param {object} config properties object of the style element
 */
const CSS = (function() {

    const getStyles = config => {
        const styles = Tree.getHead().getByTag('style');
        if (Util.isEmpty(config) && !Util.isArray(styles)) {
            return styles;
        } else if (Util.isArray(styles)) {
            return styles.find(style => arePropertiesSame(style.getProps(), config));
        } else if (!Util.isEmpty(styles) && arePropertiesSame(styles.getProps(), config)) {
            return styles;
        }
    };

    const propsWithoutContent = props => {
        let newProps = {
            ...props
        }
        delete newProps.text;
        return newProps;
    }

    const arePropertiesSame = (oldProps, newProps) => 
        JSON.stringify(propsWithoutContent(oldProps)) === JSON.stringify(newProps || {});

    const hasStyles = config => !Util.isEmpty(getStyles(config));

    const hasContent = (content, config) => {
        const styles = getStyles(config);
        if (!Util.isEmpty(styles)) {
            return styles.getContent().match(content) !== null
        }
    };

    return (content, config) => {
        if (!hasStyles(config)) {
            Tree.getHead().append(RMETemplateResolver.resolve({
                style: {
                    content,
                    ...config
                }
            }));
        } else if (!hasContent(content, config)) {
            const style = getStyles(config);
            if (!Util.isEmpty(style)) {
                const prevContent = style.getContent();
                style.setContent(prevContent+content);
            }
        }
    }
})();



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
            } else if(type.nodeType !== undefined && type.ownerDocument !== undefined && type.nodeType >= 1 && type.ownerDocument instanceof Document) {
                this.html = type;
            } else {
                throw "type must be a string or a Document";
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
            elem && this.html.appendChild(elem.dom());
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
            RMETemplateResolver.updateElemProps(this, props, this.getProps());
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
            this.setText(RMEMessagesResolver.message(message, paramArray));
            return this;
        }

        /**
         * Do click on this element.
         * @returns Elem instance.
         */
        click() {
            Browser.setTimeout(() => this.html.click());
            return this;
        }

        /**
         * Do focus on this element.
         * @returns Elem instance.
         */
        focus() {
            Browser.setTimeout(() => this.html.focus());
            return this;
        }

        /**
         * Do blur on this element.
         * @returns Elem instance.
         */
        blur() {
            Browser.setTimeout(() => this.html.blur());
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
            return RMETemplateResolver.resolve(this.toTemplate());
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
            return new Elem(html);
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
            const wrapped = Array.from(htmlDoc).map(Elem.wrap);
            return wrapped.length === 1 ? wrapped[0] : wrapped;
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



/**
 * RMEElemTemplater class is able to create a Template out of an Elem object.
 */
class RMEElemTemplater {
    constructor() {
        this.instance;
        this.template;
        this.deep = true;
    }

    toTemplate(elem, deep) {
        if (Util.notEmpty(deep))
            this.deep = deep;

        this.resolve(elem, {});
        return this.template;
    }

    /**
     * Function is called recursively and resolves an Elem object and its children in recursion
     * @param {object} elem 
     * @param {object} parent 
     */
    resolve(elem, parent) {
        let resolved = this.resolveElem(elem, this.resolveProps(elem));
        Object.keys(parent).forEach(key => {
            if (Util.isArray(parent[key]._)) {
                parent[key]._.push(resolved);
            } else {
                this.extendMap(parent[key], resolved);
            }
        });

        const children = Array.of(elem.getChildren()).flat();
        if (children.length > 0 && this.deep) {
            children.forEach(child => this.resolve(child, resolved));
        }
        this.template = resolved;
    }

    /**
     * Copies values from the next map into the first map
     * @param {object} map first map
     * @param {object} next next map
     */
    extendMap(map, next) {
        for(let v in next) {
            if(next.hasOwnProperty(v)) {
                map[v] = next[v];
            }
        }
    }

    /**
     * Function will attach given properties into a given Elem and returns the resolved Elem.
     * @param {object} elem 
     * @param {object} props 
     * @returns The resolved elem with attached properties.
     */
    resolveElem(elem, props) {
        const el = {};
        const children = elem.getChildren();
        if (Util.isArray(children) && children.length > 1) {
            let elTag = elem.getTagName().toLowerCase();
            let elName = this.resolveId(elTag, props);
            elName = this.resolveClass(elName, props);
            elName = this.resolveAttrs(elName, props);
            el[elName] = {
                ...props,
                _: [],
            };
        } else {
            el[elem.getTagName().toLowerCase()] = props
        }
        return el;
    }

    /**
     * Function will place an ID attribute into an element tag if the ID attribute is found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with the ID or without.
     */
    resolveId(tag, props) {
        if(props.id)
            return tag+"#"+props.id;
        else
            return tag;
    }

    /**
     * Function will place a class attribute into an element tag if the class attribute is found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with the classes or without.
     */
    resolveClass(tag, props) {
        if(props.class)
            return tag+"."+props.class.replace(/ /g, ".");
        else
            return tag;
    }

    /**
     * Function will resolve all other attributes and place them into an element tag if other attributes are found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with other attributes or without.
     */
    resolveAttrs(tag, props) {
        let tagName = tag;
        for (let p in props) {
            if (props.hasOwnProperty(p) && p !== 'id' && p !== 'class' && p.indexOf('on') !== 0) {
                tagName += `[${p}=${props[p]}]`
            }
        }
        return tagName;
    }

    /**
     * Resolves a given Elem object and returns its properties in an object.
     * @param {object} elem 
     * @returns The properties object of the given element.
     */
    resolveProps(elem) {
        let props = {};
        let attributes = elem.dom().attributes;
        let a = 0;
        if(attributes) {
            while(a < attributes.length) {
                props[this.resolveAttributeNames(attributes[a].name)] = attributes[a].value;
                a++;
            }
        }

        if(elem.dom().hasChildNodes() && elem.dom().childNodes[0].nodeType === 3) {
            props["text"] = elem.getText();
        }

        for(let p in elem.dom()) {
            if(p.indexOf("on") !== 0 || Util.isEmpty(elem.dom()[p]))
                continue;
            else
                props[this.resolveListeners(p)] = elem.dom()[p];
        }

        return props;
    }

    /**
     * Resolves a html data-* attributes by removing '-' and setting the next character to uppercase. 
     * Resolves an aria* attirubtes by setting the next character to uppercase.
     * If the attribute is not a data-* or an aria attribute then it is directly returned.
     * @param {string} attrName 
     * @returns Resolved attribute name.
     */
    resolveAttributeNames(attrName) {
        if (attrName.indexOf('data') === 0 && attrName.length > 'data'.length) {
            while(attrName.search('-') > -1) {
                attrName = attrName.replace(/-\w/, attrName.charAt(attrName.search('-') + 1).toUpperCase());
            }
            return attrName
        } else if (attrName.indexOf('aria') === 0) {
            return attrName.replace(attrName.charAt('aria'.length), attrName.charAt('aria'.length).toUpperCase());
        } else {
            return attrName;
        }
    }

    resolveListeners(name) {
        switch(name) {
            case "onanimationstart":
                return "onAnimationStart";
            case "onanimationiteration":
                return "onAnimationIteration";
            case "onanimationend":
                return "onAnimationEnd";
            case "ontransitionend":
                return "onTransitionEnd";
            case "ondrag":
                return "onDrag"
            case "ondragend":
                return "onDragEnd";
            case "ondragenter":
                return "onDragEnter";
            case "ondragover":
                return "onDragOver";
            case "ondragstart":
                return "onDragStart";
            case "ondrop":
                return "onDrop"; 
            case "onclick":
                return "onClick";
            case "ondblclick":
                return "onDoubleClick";
            case "oncontextmenu":
                return "onContextMenu";
            case "onmousedown":
                return "onMouseDown";
            case "onmouseenter":
                return "onMouseEnter";
            case "onmouseleave":
                return "onMouseLeave";
            case "onmousemove":
                return "onMouseMove";
            case "onmouseover":
                return "onMouseOver";
            case "onmouseout":
                return "onMouseOut";
            case "onmouseup":
                return "onMouseUp";
            case "onwheel":
                return "onWheel";
            case "onscroll":
                return "onScroll";
            case "onresize":
                return "onResize";
            case "onerror":
                return "onError";
            case "onload":
                return "onLoad";
            case "onunload":
                return "onUnload";
            case "onbeforeunload":
                return "onBeforeUnload";
            case "onkeyup":
                return "onKeyUp";
            case "onkeydown":
                return "onKeyDown";
            case "onkeypress":
                return "onKeyPress";
            case "oninput":
                return "onInput";
            case "onchange":
                return "onChange";
            case "onsubmit":
                return "onSubmit";
            case "onselect":
                return "onSelect";
            case "onreset":
                return "onReset"
            case "onfocus":
                return "onFocus";
            case "onfocusin":
                return "onFocusIn";
            case "onfocusout":
                return "onFocusOut";
            case "onblur":
                return "onBlur";
            case "oncopy":
                return "onCopy";
            case "oncut":
                return "onCut";
            case "onpaste":
                return "onPaste";
            case "onabort":
                return "onAbort";
            case "onwaiting":
                return "onWaiting";
            case "onvolumechange":
                return "onVolumeChange";
            case "ontimeupdate":
                return "onTimeUpdate";
            case "onseeking":
                return "onSeeking";
            case "onseekend":
                return "onSeekEnd";
            case "onratechange":
                return "onRateChange";
            case "onprogress":
                return "onProgress";
            case "onloadmetadata":
                return "onLoadMetadata";
            case "onloadeddata":
                return "onLoadedData";
            case "onloadstart":
                return "onLoadStart";
            case "onplaying":
                return "onPlaying";
            case "onplay":
                return "onPlay";
            case "onpause":
                return "onPause";
            case "onended":
                return "onEnded";
            case "ondurationchange":
                return "onDurationChange";
            case "oncanplay":
                return "onCanPlay";
            case "oncanplaythrough":
                return "onCanPlayThrough";
            case "onstalled":
                return "onStalled";
            case "onsuspend":
                return "onSuspend";
            case "onpopstate":
                return "onPopState";
            case "onstorage":
                return "onStorage";
            case "onhashchange":
                return "onHashChange";
            case "onafterprint":
                return "onAfterPrint";
            case "onbeforeprint":
                return "onBeforePrint";
            case "onpagehide":
                return "onPageHide";
            case "onpageshow":
                return "onPageShow";
        }
    }

    toLiteralString(elem) {
        const props = this.resolveProps(elem);
        let string = this.resolveId(elem.getTagName().toLowerCase(), props);
        string = this.resolveClass(string, props);
        string = this.resolveAttrs(string, props);
        return string;
    }

    /**
     * Function by default resolves a given element and its' children and returns template representation of the element.
     * @param {object} elem 
     * @param {boolean} deep 
     * @returns Template object representation of the Elem
     */
    static toTemplate(elem, deep) {
        return RMEElemTemplater.getInstance().toTemplate(elem, deep);
    }

    /**
     * Function resolves and returns properties of a given Elem object.
     * @param {object} elem 
     * @returns The properties object of the given Elem.
     */
    static getElementProps(elem) {
        return RMEElemTemplater.getInstance().resolveProps(elem);
    }

    static toLiteralString(elem) {
        return RMEElemTemplater.getInstance().toLiteralString(elem);
    }

    static getInstance() {
        if(!this.instance)
            this.instance = new RMEElemTemplater();
        return this.instance;
    }
}


const Fetch = (function() {
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
    class Fetch {
        constructor() {}

        /**
         * Does Fetch GET request. Content-Type JSON is used by default.
         * @param {string} url *Required
         * @param {string} contentType
         */
        get(url, contentType) {
            return this.do({url: url, init: { method: 'GET' }, contentType: getDefaultContentType(contentType)});
        }

        /**
         * Does Fetch POST request. Content-Type JSON is used by default.
         * @param {string} url *Required
         * @param {*} body 
         * @param {string} contentType 
         */
        post(url, body, contentType) {
            return this.do({url: url, body: body, init: { method: 'POST' }, contentType: getDefaultContentType(contentType)});
        }

        /**
         * Does Fetch PUT request. Content-Type JSON is used by default.
         * @param {string} url *Required
         * @param {*} body 
         * @param {string} contentType 
         */
        put(url, body, contentType) {
            return this.do({url: url, body: body, init: { method: 'PUT' }, contentType: getDefaultContentType(contentType)});
        }

        /**
         * Does Fetch DELETE request. Content-Type JSON is used by default.
         * @param {string} url 
         * @param {string} contentType 
         */
        delete(url, contentType) {
            return this.do({url: url, init: { method: 'DELETE' }, contentType: getDefaultContentType(contentType)});
        }

        /**
         * Does Fetch PATCH request. Content-Type JSON is used by default.
         * @param {string} url 
         * @param {*} body
         * @param {string} contentType
         */
        patch(url, body, contentType) {
            return this.do({url, url, body: body, init: { method: 'PATCH' }, contentType: getDefaultContentType(contentType)});
        }

        /**
         * Does any Fetch request a given config object defines.
         * 
         * Config object can contain parameters:
         * {
         *      url: url,
         *      method: method,
         *      body: body,
         *      contentType: contentType,
         *      init: init
         *  }
         * @param {object} config 
         */
        do(config) {
            if (Util.isEmpty(config) || !Util.isObject(config) || Util.isEmpty(config.url)) {
                throw new Error(`Error in fetch config object ${JSON.stringify(config)}, url must be set`);
            }
            if (!config.init) config.init = {};
            if (config.contentType && config.contentType !== 'buffer') {
                if (!config.init.headers)
                    config.init.headers = new Headers({});
                if (!config.init.headers.has('Content-Type'))
                    config.init.headers.set('Content-Type', config.contentType);
                
            }
            if ((config.body || config.init.body) && isContentType(config.contentType, Http.JSON)) {
                config.init.body = JSON.stringify(config.body || config.init.body);
            } else if (config.body) {
                config.init.body = config.body;
            }
            if (config.method) {
                config.init.method = config.method;
            }
            return fetch(config.url, config.init)
                .then(async (response) => {
                    if (!response.ok) {
                        throw Error(`Error in requesting url: ${config.url}, method: ${config.init.method}`);
                    }
                    if (isContentType(config.contentType, Http.JSON)) {
                        const res = await response.text();
                        return res.length > 0 ? JSON.parse(res) : res; // Avoid response.json() null body failure
                    }
                    if (isContentType(config.contentType, Http.TEXT_PLAIN)) {
                        return response.text();
                    }
                    if (isContentType(config.contentType, Http.FORM_DATA)) {
                        return response.formData();
                    }
                    if (isContentType(config.contentType, Http.OCTET_STREAM)) {
                        return response.blob();
                    }
                    if (config.contentType === 'buffer') {
                        return response.arrayBuffer();
                    }
                    return response;
                });
        }
    }

    const isContentType = (contentTypeA, contentTypeB) => {
        return Util.notEmpty(contentTypeA) && contentTypeA.search(contentTypeB) > -1;
    }

    const getDefaultContentType = (contentType) => {
        if (contentType === undefined) {
            return Http.JSON;
        } else if (contentType === null) {
            return null;
        } else {
            return contentType;
        }
    }

    return new Fetch();

})();


const Http = (function() {
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
            if (window.Promise) {
                this.self = new HttpPromiseAjax(config).instance();
            } else {
                this.self = new HttpAjax(config);
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
            return new Http({method: 'GET', url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do POST XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static post(url, data, requestContentType) {
            return new Http({method: 'POST', url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do PUT XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static put(url, data, requestContentType) {
            return new Http({method: 'PUT', url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do DELETE XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} requestContentType 
         */
        static delete(url, requestContentType) {
            return new Http({method: 'DELETE', url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do PATH XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data
         * @param {*} requestContentType 
         */
        static patch(url, data, requestContentType) {
            return new Http({method: "PATCH", url: url, data: data, contentType: requestContentType}).instance();
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
    }

    /**
     * Content-Type application/json
     */
    Http.JSON = "application/json";
    /**
     * Content-Type multipart/form-data
     */
    Http.FORM_DATA = "multipart/form-data";
    /**
     * Content-Type text/plain
     */
    Http.TEXT_PLAIN = "text/plain";

    /**
     * Content-Type application/octet-stream
     */
    Http.OCTET_STREAM = "application/octet-stream";

    /**
     * The XMLHttpRequest made into the Promise pattern.
     */
    class HttpAjax {
        constructor(config) {
            this.config = config;
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.xhr = new XMLHttpRequest();
            this.xhr.open(config.method, config.url);

            if (config.contentType)
                this.xhr.setRequestHeader('Content-Type', config.contentType);
            if (config.headers)
                setXhrHeaders(this.xhr, config.headers);
        }
        then(successHandler, errorHandler) {
            this.xhr.onload = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                isResponseOK(this.xhr.status) 
                    ? successHandler(isContentTypeJson(this.config.contentType) 
                        ? resolveResponse(this.xhr.response) : this.xhr)
                    : errorHandler(this.xhr)
            };
            if (this.config.onProgress) {
                this.xhr.onprogress = (event) => {
                    this.config.onProgress(event);
                };
            }
            if (this.config.onTimeout) {
                this.xhr.ontimeout = (event) => {
                    this.config.onTimeout(event);
                }
            }
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if (errorHandler)
                    errorHandler(this.xhr);
            };
            this.data ? this.xhr.send(this.data) : this.xhr.send();
            return this;
        }
        catch(errorHandler) {
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if (errorHandler)
                    errorHandler(this.xhr);
            }
        }
    }

    /**
     * XMLHttpRequest using the Promise.
     */
    class HttpPromiseAjax {
        constructor(config) {
            this.promise = new Promise((resolve, reject) => {
                new HttpAjax(config).then((response) => resolve(response), (error) => reject(error));
            });
        }
        instance() {
            return this.promise;
        }
    }

    const resolveResponse = (response) => {
        const resp = tryParseJSON(response);
        return Util.notEmpty(resp) ? resp : response;
    }
    
    const setXhrHeaders = (xhr, headers) => {
        Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));
    }
    
    const isResponseOK = (status) => {
        return Boolean([200, 201, 202, 203, 204, 205, 206, 207, 208, 226].find(num => num === status));
    }
    
    const isContentTypeJson = (contentType) => {
        return contentType && (Http.JSON.search(contentType.toLowerCase()) > -1 || contentType.toLowerCase().search(Http.JSON) > -1);
    }
    
    const tryParseJSON = (text) => {
        try {
            return JSON.parse(text);
        } catch(e) {}
    }

    return Http;

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


const useMessages = (function() {

    /**
     * UseMessages function has three functionalities. 1. Set a message loader function. 2. Change locale. 3. Return currenly used locale string.
     * If the locale parameter is set then the locale is changed to the given locale. The locale parameter can be either a string or an Event.
     * If the locale is an Event then the locale string is attempted to be parsed from the href, the value or the text of the Event.target.
     * If the loader parameter is set then the existing message loader function will be replaced with the currently given.
     * The useMessage function will return the currently used locale string as a return value.
     * @param {string|Event} locale
     * @param {Function} loader
     * @returns Locale string
     */
    return (locale, loader) => {
        if (Util.isFunction(loader)) {
            RMEMessagesResolver.load((locale, setMessages) => setMessages(loader(locale)));
        }
        if (Util.isString(locale) || locale instanceof Event) {
            RMEMessagesResolver.lang(locale);
        }
        return RMEMessagesResolver.locale();
    }
}());

const useMessage = (function (){

    /**
     * UseMessage function takes a message key and possible message parameters and attempts to resolve them to a
     * translated message. If the given key could not be resolved then it will be returned.
     * @param {string} key message key
     * @param {array} params message params
     * @returns Resolved message
     */
    return (key, ...params) => {
        return RMEMessagesResolver.message(key, ...params);
    }
}());






const RMEMessagesResolver = (function() {
    /**
     * Messages class handles internationalization. The class offers public methods that enable easy 
     * using of translated content.
     */
    class Messages {
        constructor() {
            this.ins = this;
            this.messages = [];
            this.locale = '';
            this.translated = [];
            this.load = function() {};
            this.messagesType;
            this.ready = false;
            ready(() => {
                this.ready = true;
                this.runTranslated();
            });
        }

        /**
         * Loader function is used to load new messages.
         * The loader function is called automatically when the locale used in the Messages changes.
         * @param {function} loader
         */
        setLoad(loader) {
            if (!Util.isFunction(loader)) {
                throw new Error('Message loader must be a function');
            }
            this.load = loader;
        }

        setLocale(locale) {
            this.locale = locale;
            return this;
        }

        setMessages(messages) {
            if (Util.isArray(messages)) {
                this.messagesType = 'array';
            } else if (Util.isObject(messages)) {
                this.messagesType = 'map';
            } else {
                throw new Error('Given messages must be an array or an object');
            }
            this.messages = messages;
            this.runTranslated();
        }

        /**
         * GetMessage function is used to retrieve translated messages. The function also supports message parameters
         * that can be given as a comma separeted list.
         * @param {string} text
         * @param {*} params
         * @returns A resolved message or the given key if the message is not found.
         */
        getMessage(text, ...params) {
            if (Util.isEmpty(params.flat(2))) {
                return this.resolveMessage(text);
            } else {
                let msg = this.resolveMessage(text);
                return this.resolveParams(msg, params.flat(2));
            }
        }

        /**
         * Resolves translated message key and returns a resolved message if exist
         * otherwise returns the given key.
         * @param {string} text key
         * @returns A resolved message if exist otherwise the given key.
         */
        resolveMessage(text) {
            if (this.messagesType === 'array') {
                return this.resolveMessagesArray(text);
            } else if (this.messagesType === 'map') {
                return this.resolveMessagesMap(text);
            }
        }

        /**
         * Resolves a translated message key from the map. Returns a resolved message 
         * if found otherwise returns the key.
         * @param {string} text key
         * @returns A resolved message
         */
        resolveMessagesMap(text) {
            let msg = text;
            for (let i in this.messages) {
                if (i === text) {
                    msg = this.messages[i];
                    break;
                }
            }
            return msg;
        }

        /**
         * Resolves a translated message key from the array. Returns a resolved message
         * if found otherwise returns the key.
         * @param {string} text key
         * @returns A resolved message
         */
        resolveMessagesArray(text) {
            let i = 0;
            let msg = text;
            while (i < this.messages.length) {
                if (Util.notEmpty(this.messages[i][text])) {
                    msg = this.messages[i][text];
                    break;
                }
                i++;
            }
            return msg;
        }

        /**
         * Resolves the message parameters if exist otherwise does nothing.
         * @param {string} msg 
         * @param {*} params 
         * @returns The message with resolved message parameteres if parameters exist.
         */
        resolveParams(msg, params) {
            if (Util.notEmpty(msg)) {
                params.forEach((param, i) => msg = msg.replace(`{${i}}`, param));
                return msg;
            }
        }

        /**
         * Function goes through the translated objects array and sets a translated message to the translated elements.
         */
        runTranslated() {
            if (this.ready) {
                RMEAppManager.getAll().forEach(app => app.refresh());
            }
        }

        /**
         * Returns currently used locale string used by the Messages.
         * @returns Locale string
         */
        static locale() {
            return Messages.instance.locale;
        }

        /**
         * Lang function is used to change or set the current locale to be the given locale. After calling this method
         * the Messages.load function will be automatically invoked.
         * @param {string} locale String
         * @param {object} locale Event
         */
        static lang(locale) {
            let nextLocale;
            if (locale instanceof Event) {
                locale.preventDefault();
                const el = Elem.wrap(locale.target);
                nextLocale = el.getHref() || el.getValue() || el.getText();
            } else if (Util.isString(locale)) {
                nextLocale = locale;
            } else {
                throw new Error('The parameter locale must be an instance of the Event or a string');
            }
            if (Util.notEmpty(nextLocale)) {
                Messages.instance.setLocale(nextLocale).load.call(Messages.instance, Messages.locale(),
                    Messages.instance.setMessages.bind(Messages.instance));
            }
        }

        /**
         * Message function returns a message from the message bundle or a message key if the message was not found.
         * The function also supports message parameters that can be given as a comma separeted list.
         * @param {string} text 
         * @param {*} params 
         * @returns A resolved message or the given key if the message is not found.
         */
        static message(text, ...params) {
            return Messages.instance.getMessage(text, params);
        }

        /**
         * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
         * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
         * Set a message loader function.
         * The function receives two parameters a locale and a setMessages function. The locale is currently used locale
         * and the setMessages function applies the given messages.
         */
        static load(loader) {
            Messages.instance.setLoad(loader);
        }

        static get instance() {
            if(!this.ins)
                this.ins = new Messages();
            return this.ins;
        }
    }

    return {
        lang: Messages.lang,
        message: Messages.message,
        load: Messages.load,
        locale: Messages.locale
    };
}());



/**
 * Adds a script file on runtime into the head of the current html document where the method is called on.
 * Source is required options can be omitted.
 * @param {String} source URL or file name. *Requied
 * @param {object} options Optional settings object.
 * 
 * Option settings:
 * -------
 *  @param {String} id 
 *  @param {String} type 
 *  @param {String} text Content of the script element if any.
 *  @param {boolean} defer If true script is executed when page has finished parsing.
 *  @param {*} crossOrigin 
 *  @param {String} charset 
 *  @param {boolean} async If true script is executed asynchronously when available.
 */
const script = (function() {

    const addScript = (elem) => {
        const scripts = Tree.getHead().getByTag('script');
        if (scripts.length > 0) {
            const lastScript = scripts[scripts.length -1];
            lastScript.after(elem);
        } else {
            Tree.getHead().append(elem);
        }
    }

    return (source, options) => {
        if (Util.notEmpty(source)) {
            addScript(RMETemplateResolver.resolve({
                script: {
                    src: source,
                    ...options
                }
            }));
        }
    }
})();


/**
 * The function adds a callback function into the callback queue. The queue is invoked in the
 * function definition order. The queue will be run when the DOM tree is ready and
 * then the it is cleared.
 */
const ready = (function() {

    const callbacks = [];

    document.addEventListener("readystatechange", () => {
        if(document.readyState === "complete") {
            callbacks.forEach(callback => callback());
            callbacks.length = 0;
        }
    });

    return (callback) => {
        callbacks.push(callback);
    }

})();





/**
 * The hash based router implementation. The router is used via invoking the useHashRouter function.
 * This router is ment for the single page applications.
 */
const RMEHashRouter = (props, { asyncTask, updateState }) => {
    const { routes, url = location.hash, prevUrl, prevRoute, globalScrollTop, init } = props;

    if (!routes) {
        return null;
    }

    if (!init) {
        RMERouterContext.setRouter(routes, (url) => {
            updateState({
                url: url
            });
        });
        asyncTask(() => {
            window.addEventListener('hashchange', () => {
                updateState({
                    init: true,
                    url: location.hash
                });
            });
        });
    }

    let route;

    if (url !== prevUrl) {
        route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.hashMatch);
        asyncTask(() => {
            updateState({
                prevUrl: url,
                prevRoute: route
            }, false);
        });
    } else {
        route = prevRoute;
    }

    if (Util.notEmpty(route)) {
        if (Util.isFunction(route.onBefore)) {
            route.onBefore(route);
        }
        if (Util.isFunction(route.onAfter)) {
            asyncTask(() => route.onAfter(route));
        }
        if (route.hide) {
            location.href = prevUrl;
        }
        if (window.scrollY > 0 && ((route.scrolltop === true) || (route.scrolltop === undefined && globalScrollTop))) {
            scrollTo(0, 0);
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
};



/**
 * Simple router implementation ment to be only used in cases where the route is navigated only once after the page load.
 * The router is used via invoking the useAutoUrlRouter function. This router is not ment for the single page applications.
 */
const RMEOnLoadUrlRouter  = (props, { asyncTask }) => {
    const { routes } = props;

    if (!routes) {
        return null;
    }

    const route = RMERouterUtils.findRoute(location.pathname, routes, RMERouterUtils.urlMatch);

    if (Util.notEmpty(route)) {
        if (Util.isFunction(route.onBefore)) {
            route.onBefore(route);
        }
        if (Util.isFunction(route.onAfter)) {
            asyncTask(() => route.onAfter(route));
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
}



/**
 * The URL based router implementation. The router is used via invoking the useUrlRouter function.
 * This router is ideal for the single page applications. Router navigation is handled by the useRouter function.
 */
const RMEUrlRouter = (props, { updateState, asyncTask }) => {
    const { routes, url, prevUrl, prevRoute, skipPush, init, globalScrollTop } = props;

    if (!routes) {
        return null;
    }

    if (!init) {
        const updateUrl = (url, skipPush) => {
            updateState({
                init: true,
                url: url ?? location.pathname,
                skipPush
            });
        }
        RMERouterContext.setRouter(routes, (url) => updateUrl(url));
        asyncTask(() => {
            window.addEventListener('popstate', () => updateUrl(undefined, true));
            updateUrl(undefined, true);
        });
    }

    let route;

    if (url !== prevUrl) {
        route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.urlMatch);
        asyncTask(() => {
            updateState({
                prevUrl: url,
                prevRoute: route
            }, false);
        });
    } else {
        route = prevRoute;
    }

    if (Util.notEmpty(route)) {
        if (Util.isFunction(route.onBefore)) {
            route.onBefore(route);
        }
        if (Util.isFunction(route.onAfter)) {
            asyncTask(() => route.onAfter(route));
        }
        if (!route.hide && url !== prevUrl && !skipPush) {
            history.pushState(null, null, url);
        }
        if (window.scrollY > 0 && ((route.scrolltop === true) || (route.scrolltop === undefined && globalScrollTop))) {
            scrollTo(0, 0);
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
};



const RMERouterContext = (function() {

    class RouterContext {
        constructor() {
            this.ins;
            this.routers = [];
        }

        /**
         * Set a router into the context store by the key and the value.
         * @param {string} key the router key
         * @param {Function} value the router routes and the navigation hook
         */
        set(key, value) {
            if ((!!key && !!value) && !this.has(key)) {
                this.routers.push({ key, ...value });
            }
        }

        /**
         * Searches fo the routers by the router key if router is found the function will return true.
         * @param {string} key 
         * @returns True if found otherwise false
         */
        has(key) {
            return !!this.routers.find(route => route.key === key);
        }

        /**
         * Searches the router by the url. The navigation hook of the last mathced router is returned.
         * If no routers match then an empty function will be returned instead.
         * @param {string} url 
         * @returns The router navigation hook
         */
        get(url) {
            let found;
            let prevFoundRouter;

            if (url.match(/^\/[^#]/) || url === '/') {
                const urlRouters = this.routers.filter(router => router.key.match(/^:\//));

                found = urlRouters.find((router, idx) => {
                    const route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.urlMatch);

                    if (!!route) {
                        prevFoundRouter = router;
                    }
                    return !!route && idx === urlRouters.length - 1;
                });

                found = found || prevFoundRouter;
            } else {
                const hashRouters = this.routers.filter(router => router.key.match(/^:#?/));

                found = hashRouters.find((router, idx) => {
                    const route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.hashMatch);

                    if (!!route) {
                        prevFoundRouter = router;
                    }
                    return !!route && idx === hashRouters.length - 1;
                });

                found = found || prevFoundRouter;
            }

            return !!found ? found.navigateHook : () => undefined;
        }

        /**
         * Creates a string key from the route array
         * @param {array} routes 
         * @returns {string} RouterContext key
         */
        static createContextKey(routes) {
            return `:${routes.map(route => route.route).join(':')}`;
        }

        /**
         * Navigate to the given url. Function attempts to find the router by the url and
         * if found the navigation hook of the router is invoked with the url.
         * @param {string} url 
         */
        static navigateTo(url) {
            RouterContext.instance.get(RMERouterUtils.getUrlPath(url))(url);
        }

        /**
         * Set the route array and the router navigate hook into the RouterContext store
         * @param {array} routes the router routes
         * @param {Function} navigateHook the router navigation hook
         */
        static setRouter(routes, navigateHook) {
            RouterContext.instance.set(RouterContext.createContextKey(routes), { routes, navigateHook });
        }

        static get instance() {
            if (!this.ins) {
                this.ins = new RouterContext();
            }
            return this.ins;
        }
    }

    return RouterContext;

}());



const RMERouterUtils = (function() {

    /**
     * Cut the protocol and the domain off from the url if exist.
     * For example https://www.example.com/example -> /example
     * @param {string} url 
     * @returns The path of the url.
     */
    const getUrlPath = (url) => {
        return url.replace(/\:{1}\/{2}/, '').match(/\/{1}.*/).join();
    }

    /**
     * Function checks if the given URLs match and returns true if they match otherwise false is returned.
     * @param {string} oldUrl 
     * @param {string} newUrl 
     * @returns True or false
     */
    const urlMatch = (oldUrl, newUrl) => {
        oldUrl = Util.isString(oldUrl) ? oldUrl.replace(/\*/g, '.*').replace(/\/{2,}/g, '/') : oldUrl;
        const path = getUrlPath(newUrl);
        let found = path.match(oldUrl);
        if (Util.notEmpty(found)) {
            found = found.join();
        }

        return found === path && new RegExp(oldUrl).test(newUrl);
    }

    /**
     * Function checks if the given URLs match and returns true if they match otherwise false is returned.
     * @param {string} oldUrl 
     * @param {string} newUrl 
     * @returns True or false
     */
    const hashMatch = (oldUrl, newUrl) => {
        if (Util.isString(oldUrl)) {
            oldUrl = oldUrl.replace(/\*/g, '.*');
            if (oldUrl.charAt(0) !== '#') {
                oldUrl = `#${oldUrl}`;
            }
        }

        const hash = newUrl.match(/\#{1}.*/).join();
        let found = hash.match(oldUrl);
        found = Util.notEmpty(found) ? found.join() : null;

        return found === hash && new RegExp(oldUrl).test(newUrl);
    }

    /**
     * Function will search for the route by the given url parameter. A route will be returned if found otherwise
     * undefined is returned.
     * @param {string} url to match
     * @param {array} routes routes array
     * @param {Function} matcherHook matcher function
     * @see urlMatch - match by pathname
     * @see hashMatch - match by hash
     * @returns Found route object or undefined if not found
     */
    const findRoute = (url, routes, matcherHook) => {
        return url && routes.find((route) => matcherHook(route.route, url));
    }

    /**
     * Resolves the given element into a Template object
     * @param {string|Function|Elem} elem 
     * @param {object} props 
     * @returns Template object
     */
    const resolveRouteElem = (elem, props) => {
        if (Util.isFunction(elem) && RMEComponentManagerV2.hasComponent(elem.valueOf().name)) {
            return  { [elem.valueOf().name]: props };
        } else if (Util.isString(elem) && RMEComponentManagerV2.hasComponent(elem)) {
            return { [elem]: props };
        } else {
            return { _: elem.toTemplate() };
        }
    }

    return {
        getUrlPath,
        findRoute,
        urlMatch,
        hashMatch,
        resolveRouteElem
    }
}());




const useHashRouter = (function() {

    /**
     * The useHashRouter function creates and returns the hash based router component.
     * The router is suitable for single page applications.
     * @param {array} routes router routes
     * @param {object} settings router settings
     */
    return (routes, scrollTop = true) => {
        Component(RMEHashRouter);

        return {
            RMEHashRouter: {
                routes,
                globalScrollTop: scrollTop
            }
        };
    }
}());

const useOnLoadUrlRouter = (function() {

    /**
     * The useAutoUrlRouter function creates and returns the url based router component.
     * The router is suitable for web pages that only load one route once one the page load.
     * @param {array} routes router routes
     */
    return (routes) => {
        Component(RMEOnLoadUrlRouter);

        return {
            RMEOnLoadUrlRouter: {
                routes
            }
        }
    }
}());

/**
 * The useUrlRouter function creates and returns the url based router component.
 * The router is suitable for single page applications.
 * @param {array} routes router routes
 * @param {object} settings router settings
 */
const useUrlRouter = (function() {
    
    return (routes, scrollTop = true) => {
        Component(RMEUrlRouter);

        return {
            RMEUrlRouter: {
                routes,
                globalScrollTop: scrollTop,
            }
        }
    }
}());

const useRouter = (function() {

    /**
     * The useRouter function handles the navigation of the last matched router in the RouterContext.
     * This function is needed to handle the navigation when using the single page page application url router.
     * The parameter url can either be a string or an event. If the url is an event then the target url is read from the event.target.href attribute.
     * @param {string|Event} url the url to navigate to
     */
    return (url) => {
        if (Util.isString(url)) {
            RMERouterContext.navigateTo(url);
        } else if (url instanceof Event) {
            url.preventDefault();
            RMERouterContext.navigateTo(url.target.href);
        }
    }
}());





const RMETemplateFragmentHelper = (function() {

    // Fragment key can be any number of underscores (_).
    const FRAGMENT_REGEXP = /^_+$/g;

    class RMETemplateFragmentHelper {

        /**
         * Function takes the RME template as a parameter and tries to resolve a
         * fragment key from the given template.
         * @param {*} template 
         * @returns The fragment key if found otherwise undefined is returned.
         */
        getFragmentKey(template) {
            return Object.keys(template).find(this.isFragmentKey);
        }

        /**
         * Function takes the RME template as a parameter and tries to resolve the 
         * fragment value from the given template.
         * @param {*} template 
         * @param {*} templateValue 
         * @returns The fragment template value if found otherwise undefined is returned.
         */
        resolveFragmentValue(template, templateValue) {
            const fragmentKey = this.getFragmentKey(template);
            return template[fragmentKey] || template.fragment || templateValue;
        }

        /**
         * Function takes the RME template as a parameter and checks if the parameter is type fragment. 
         * If the parameter is a fragment type the function will return true
         * otherwise false is returned.
         * @param {*} template 
         * @returns True if the parameter is type fragment otherwise false is returned.
         */
        isFragment(template) {
            return Util.notEmpty(template) && (template === 'fragment' || Boolean(this.getFragmentKey(template)));
        }

        /**
         * Function will check if the given key is a fragment key. The function will
         * return true if the key is a fragment key otherwise false is returned.
         * @param {string} key 
         * @returns True if the key is a fragment key otherwise false is returned.
         */
        isFragmentKey(key) {
            return key.match(FRAGMENT_REGEXP) || key.indexOf('fragment') === 0;
        }

    }

    return new RMETemplateFragmentHelper();

}());




const RMETemplateResolver = (function() {
    /**
     * Template class reads a JSON format notation and creates an element tree from it.
     * The Template class has only one public method resolve that takes the template as parameter and returns 
     * the created element tree.
     */
    class Template {
        constructor() {
            this.template = {};
            this.root = null;
            this.appName;
            this.context;
        }

        /**
         * Method takes a template as parameter, starts resolving it and returns 
         * a created element tree. 
         * @param {object} template
         * @param {Elem} Elem
         * @param {string} appName
         * @returns Elem instance element tree.
         */
        setTemplateAndResolve(template, parent, appName = '', context = '') {
            this.template = template;
            this.appName = appName;
            this.context = context;
            if (parent) {
                this.root = parent;
                this.resolveNextParent(this.template, this.root, 1);
            } else {
                this.resolveRootAndTemplate();
                this.resolveNextParent(this.template, this.root, 1);
            }
            return this.root;
        }

        /**
         * Resolve the root and the template parameters
         */
        resolveRootAndTemplate() {
            const key = Object.keys(this.template).shift();
            this.root = this.resolveChild(key, this.template[key], null, 0, 0);
            
            if (Util.isFunction(this.template[key])) {
                this.template = this.template[key].call(this.root, this.root);
            } else {
                this.template = this.template[key];
            }
        }

        /**
         * Resolves properties of the each template object and returns them in the resolved array.
         * The array contains three arrays, attrs array, listeners array and children array.
         * @param {object} template 
         * @param {Elem} parent 
         * @returns Array that contains three arrays
         */
        resolveTemplateProperties(template, parent) {
            const attrs = [];
            const listeners = [];
            const children = [];

            if (Util.isString(template) || Util.isNumber(template)) {
                if (Util.isString(template) && Template.isMessage(template)) {
                    attrs.push({key: 'message', val: template});
                } else {
                    attrs.push({key: 'text', val: template});
                }
            } else if (Util.isArray(template)) {
                template.forEach(obj => {
                    const key = Object.keys(obj).shift();
                    const val = Object.values(obj).shift();
                    children.push({ key, val: Template.isComponent(key) && Util.isFunction(val) ? {} : val });
                });
            } else if (Util.isObject(template)) {
                Object.keys(template).forEach((key, i) => {
                    if (Template.isAttr(key, parent)) {
                        attrs.push({key, val: template[key]});
                    } else if (Template.isEventKeyVal(key, template[key])) {
                        listeners.push({parentProp: parent[key], func: template[key]});
                    } else if (Template.isTag(Template.getElementName(key))) {
                        children.push({key, val: template[key]});
                    } else if (Template.isComponent(key)) {
                        children.push({key, val: !Util.isFunction(template[key]) ? template[key] : {}});
                    } else if (RMETemplateFragmentHelper.isFragmentKey(key)) {
                        children.push({key, val: template[key]});
                    }
                });
            }

            return [attrs, listeners, children];
        }

        /**
         * Method resolves a given template recusively. The method and
         * parameters are used internally.
         * @param {object} template
         * @param {Elem} parent
         * @param {number} round
         * @param {number} invoked
         */
        resolveTemplate(template, parent, round, parentContext) {
            const [attrs, listeners, children] = this.resolveTemplateProperties(template, parent);

            attrs.forEach(attr => Template.resolveAttributes(parent, attr.key, this.resolveFunctionValue(attr.val, parent)));

            listeners.forEach(listener => this.bindEventToElement(parent, listener.func, listener.parentProp));

            children.forEach((rawChild, idx) => {
                if (RMETemplateFragmentHelper.isFragmentKey(rawChild.key)) {
                    this.resolveNextParent(rawChild.val, parent, round, parentContext + rawChild.key);
                } else {
                    const child = this.resolveChild(rawChild.key, rawChild.val, parent, round, idx, parentContext);
                    parent.append(child);

                    if (!Template.isComponent(rawChild.key)) {
                        this.resolveNextParent(rawChild.val, child, round, parentContext);
                    }
                }
            });

            round++;
        }

        /**
         * Resolves the next child element by the given parameters. The child can be a HTML element, a component or a fragment. Returns resolved child element.
         * @param {string} key child name e.g. component name, HTML tag or fragment
         * @param {object|array} val properties for the resolvable child
         * @param {Elem} parent Elem
         * @param {number} round number
         * @param {number} invoked number
         * @returns Elem instance child element
         */
        resolveChild(key, val, parent, round, invoked, parentContext = '') {
            const name = Template.getElementName(key);
            if (RMEComponentManagerV2.hasComponent(name)) {
                const component = RMEComponentManagerV2.getComponent(name, this.resolveComponentLiteralVal(val), `${parentContext}${round}${invoked}`, this.appName);
                if (RMETemplateFragmentHelper.isFragment(component) && Util.notEmpty(component)) {
                    this.resolveNextParent(RMETemplateFragmentHelper.resolveFragmentValue(component, val), parent, round);
                    return null;
                } else if (Util.notEmpty(component)) {
                    return this.resolveElement(key, component);
                }
                return component;
            } else {
                return Template.resolveStringNumber(this.resolveElement(key, val), val);
            }
        }

        /**
         * Resolves component literal values and converts it to a properties object that the component understands.
         * The given parameter is returned as is if the parameter is not a string nor a number literal.
         * @param {string|number} val 
         * @returns Resolved properties object or the given value if the value was not a string nor a number.
         */
        resolveComponentLiteralVal(val) {
            if (Util.isString(val) && Template.isMessage(val)) {
                return { message: val };
            } else if (Util.isString(val) || Util.isNumber(val)) {
                return { text: val };
            } else {
                return val
            }
        }

        /**
         * Resolves next parent element and its' attributes.
         * @param {object} obj 
         * @param {Elem} parent 
         * @param {number} round 
         * @param {string} parentContext 
         */
        resolveNextParent(obj, parent, round, parentContext = '') {
            const arr = Array.of(this.resolveFunctionValue(obj, parent)).flat();
            const parentTag = Util.isEmpty(parent) ? parentContext : parentContext + parent.getTagName().toLowerCase();
            arr.forEach((item, i) => this.resolveTemplate(item, parent, round, `${this.context}${parentTag}[${i}]`));
        }

        /**
         * Bind event listener from the source function to the target function.
         * @param {Elem} elemInstance 
         * @param {function} sourceFunction 
         * @param {function} targetFunction 
         */
        bindEventToElement(elemInstance, sourceFunction, targetFunction) {
            targetFunction.call(elemInstance, sourceFunction);
        }

        /**
         * Method resolves function based attribute values. If the given attribute value
         * is type function then the function is invoked and its return value will be returned otherwise
         * the given attribute value is returned.
         * @param {*} value
         * @param {Elem} parent
         * @returns Resolved attribute value.
         */
        resolveFunctionValue(value, parent) {
            return Util.isFunction(value) ? value.call(parent, parent) : value;
        }

        /**
         * Function will set String or Number values for the given element.
         * @param {object} elem 
         * @param {*} value 
         */
        static resolveStringNumber(elem, value) {
            if (Util.isString(value) && Template.isMessage(value)) {
                Template.resolveMessage(elem, value);
            } else if (Util.isString(value) || Util.isNumber(value)) {
                elem.setText(value);
            }
            return elem;
        }

        /**
         * Function will check if the given message is actually a message or not. The function
         * will return true if it is a message otherwise false is returned.
         * @param {string} message 
         * @returns True if the given message is actually a message otherwise returns false.
         */
        static isMessage(message) {
            message = Template.normalizeMessageString(message);
            return Util.notEmpty(RMEMessagesResolver.message(message)) && RMEMessagesResolver.message(message) != message;
        }

        /**
         * Resolves a element (HTML tag) and some basic attributes from the given tag.
         * @param {string} tag
         * @param {object} obj
         * @returns Null or resolved Elem instance elemenet.
         */
        resolveElement(tag, obj) {
            let resolved = null;
            let match = [];
            let el = Template.getElementName(tag);

            if (Util.isString(el) && Template.isTag(el)) {
                resolved = new Elem(el);
            } else {
                resolved = obj // for component parent element
            }

            match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id
            if (!Util.isEmpty(match))
                resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));

            match = this.cutAttributesIfFound(tag).match(/\.[a-zA-Z-0-9\-]+/g); //find classes
            if (!Util.isEmpty(match)) 
                resolved.addClasses(match.join(" ").replace(/\./g, ""));

            match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_\/\.&%@!?£$+¤|;\\<\\>\\{}"]+\]/g); //find attributes
            if (!Util.isEmpty(match))
                resolved = Template.addAttributes(resolved, match);

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
        static addAttributes(elem, attrArray) {
            let i = 0;
            let start = "[";
            let eq = "=";
            let end = "]";
            while(i < attrArray.length) {
                var attr = attrArray[i];
                let key = attr.substring(attr.indexOf(start) +1, attr.indexOf(eq));
                let val = attr.substring(attr.indexOf(eq) +1, attr.indexOf(end));
                Template.resolveAttributes(elem, key, val);
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
        static resolveAttributes(elem, key, val) {
            switch (key) {
                case 'id':
                    elem.setId(val);
                    break;
                case 'class':
                    elem.addClasses(val || '');
                    break;
                case 'text':
                    elem.setText(val || '');
                    break;
                case 'message':
                    Template.resolveMessage(elem, val);
                    break;
                case 'placeholder':
                    Template.resolvePlaceholder(elem, key, val);
                    break;
                case 'content':
                    Template.resolveContent(elem, key, val);
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
                    Template.resolveDefault(elem, key, val);
            }
        }

        /**
         * Resolves the placeholder. The method will first check if the value is a message.
         * @param {object} elem 
         * @param {string} key 
         * @param {*} val 
         */
        static resolvePlaceholder(elem, key, val) {
            const params = Template.getMessageParams(val);
            const message = Template.normalizeMessageString(val);
            elem.setAttribute(key, Template.isMessage(val) ? RMEMessagesResolver.message(message, params) : val);
        }

        /**
         * Resolves the attribute that did not match on cases. Usually nothing needs to be done except when handling html dom data-* attributes. In such case
         * this function will auto format the data-* attribute to a correct format.
         * @param {object} elem 
         * @param {string} key 
         * @param {*} val 
         */
        static resolveDefault(elem, key, val) {
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
        static resolveContent(elem, key, val) {
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
        static resolveMessage(elem, message) {
            if(Util.isEmpty(message))
                throw "message must not be empty";

            elem.message(Template.normalizeMessageString(message), Template.getMessageParams(message));
        }

        /**
         * Function will return message parameters in an array if found.
         * @param {string} message 
         * @returns Message params in the array or null if no params found.
         */
        static getMessageParams(message) {
            let match = Template.getMessageParameterString(message);
            match = match && match.join().replace(/({|}|:|;)/g, match.join()).split(match.join());
            return match && match.filter(Util.notEmpty);
        }

        /**
         * Get the parameter match array from the message string if found.
         * @param {string} message 
         * @returns The match array or null.
         */
        static getMessageParameterString(message) {
            return message.match(/\:?(\{.*\}\;?)/g);
        }

        /**
         * Removes parameter string from the message string if present.
         * @param {string} message 
         * @returns The normalized message string.
         */
        static normalizeMessageString(message) {
            const params = Template.getMessageParameterString(message);
            return Util.notEmpty(params) ? message.replace(params.join(), '') : message;
        }

        /**
         * Checks is a given key val an event listener key val.
         * @param {string} key
         * @param {function} val
         * @returns True if the given key val is event listener key val.
         */
        static isEventKeyVal(key, val) {
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
            return RMEComponentManagerV2.hasComponent(Template.getElementName(key));
        }

        /**
         * Method takes a template as parameter, starts resolving it and 
         * returns a created element tree.
         * @param {object} template - JSON notation template object
         * @param {Elem} Elem - Elem object (optional)
         * @param {string} appName - App instance name (optional)
         * @returns Element tree of Elem instance objects.
         */
        static resolve(template, parent, appName, context) {
            return Template.create().setTemplateAndResolve(template, parent, appName, context);
        }

        /**
         * Method will apply the properties given to the element. Old properties are overridden.
         * @param {object} elem 
         * @param {object} props 
         * @param {object} oldProps
         */
        static updateElemProps(elem, props, oldProps) {
            const combined = Template.combineProps(props, oldProps);
            Object.keys(combined).forEach((prop) => {
                if (Template.isEventKeyVal(prop, combined[prop])) {
                    elem[prop].call(elem, combined[prop]); // element event attribute -> elem, event function
                } else if (prop === 'class') {
                    elem.updateClasses(combined[prop] || '');
                } else if (prop === 'value') {
                    elem.setAttribute(prop, combined[prop]);
                    elem.setValue(combined[prop]);
                } else {
                    Template.resolveAttributes(elem, prop, combined[prop]);
                }
            });
        }

        static combineProps(newProps, oldProps) {
            Object.keys(oldProps).forEach(prop => {
                if (oldProps[prop] && !newProps[prop]) { // if no new prop but old exist
                    oldProps[prop] = prop === 'style' ? '' : undefined;
                }
            });

            return {
                ...oldProps,
                ...newProps
            }
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
            else if (key.indexOf("data") === 0 && (!RMEComponentManagerV2.hasComponent(key) && !Template.isElem(elem.getTagName(), ["data"]) || Template.isElem(elem.getTagName(), ["object"])))
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

    return Template;

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
        } catch (e) {}
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


