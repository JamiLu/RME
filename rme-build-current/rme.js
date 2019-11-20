/** RME BUILD FILE **/



let App = (function() {

    class App {
        constructor() {
            this.self;
            this.seq = 0;
            this.prefix = "app";
            this.name;
            this.root;
        }

        /**
         * Function will set a name for an application. If the name is not set then a default name is used.
         * @param {string} name 
         * @returns App.
         */
        static name(name) {
            App.init().name = App.checkName(name);
            return App;
        }

        /**
         * Function will set a root for an application. If the root is not set then body is used by default.
         * @param {string} root 
         * @returns App.
         */
        static root(root) {
            if (!Util.isEmpty(root) && Util.isString(root)) 
                App.init().root = root;

            return App;
        }

        /**
         * Function will check if a given name is empty or not. If the name is empty then a next available default name is returned.
         * @param {string} name 
         * @returns Checked name.
         */
        static checkName(name) {
            if (!Util.isEmpty(name)) {
                return App.init().prefix+name;
            } else {
                while(Util.isEmpty(App.init().name)) {
                    name = App.init().prefix + App.init().seq;
                    name = RME.storage(name);
                    if(Util.isEmpty(name)) {
                        App.init().name = App.init().prefix+App.init().seq;
                        break;
                    } else {
                        App.init().seq++;
                    }
                }
                return App.init().name;
            }
        }

        /**
         * Resets settings that are used to create an application.
         */
        static reset() {
            App.init().name = undefined;
            App.init().root = undefined;
            App.init().seq = 0;
        }

        /**
         * Function creates an application. The given parameter can either be a Template object or an Elem object. 
         * @param {object} object 
         * @returns Created application instance.
         */
        static create(object) {
            let name = !Util.isEmpty(App.init().name) ? App.init().name : App.checkName();
            let root = !Util.isEmpty(App.init().root) ? App.init().root : undefined;
            let app = new AppInstance(name, root, object);
            RME.storage(name, app);
            App.reset();
            return app;
        }
        
        /**
         * Gets Application instance by name. If the name is empty then default application instance is retrieved.
         * @param {string} name 
         * @returns Application instance.
         */
        static get(name) {
            if(Util.isEmpty(name))
               return App.name(0).getInstance();
            else {
                let app = App.name(name).getInstance();
                if(Util.isEmpty(app))
                    throw "Could not find app with name: "+name;
                else
                    return app;
            }
        }

        /**
         * Function takes three parameters that enable setting state for components.
         * If only one parameter is given then the parameter must be an object or a function. 
         * The object should define a component name and its values as follows. ({refName: {key: val, key: val}}) and
         * the function should return a object describing the component respectively.
         * If two parameters are given then the first parameter is a component name
         * and the value parameter should describe the component state object as follows. (refName, {key: val, key: val}).
         * The value parameter may also be a function that returns the component state object respectively.
         * The last parameter update is a boolean value that only if explicitly set to false then the app is not updated
         * after setting the state has occured.
         * This function will store the state into the default application state. 
         * @param {*} refName 
         * @param {*} value 
         * @param {boolean} update
         */
        static setState(refName, value, update) {
            return App.get().setState(refName, value, update);
        }

        /**
         * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is given. 
         * Otherwise whole default application state is given.
         * @param {string} refName 
         */
        static getState(refName) {
            return App.get().getState(refName);
        }

        /**
         * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is checked.
         * Otherwised default application state is checked.
         * @param {string} refName 
         * @returns True if state empty otherwise false.
         */
        static isStateEmpty(refName) {
            return App.get().isStateEmpty(refName);
        }

        /**
         * Function takes two optional parameters. If refName is given then only a state of the component with the refName is cleared otherwise 
         * whole default application state is cleared. If update is given then after clearing the state the application is refreshed.
         * @param {string} refName 
         * @param {boolean} update 
         */
        static clearState(refName, update) {
            return App.get().clearState(refName, update);
        }

        /**
         * Function takes three parameters. If the first parameter is string then the second parameter must be an object or a function.
         * The first parameter refName is a component name and the second parameter is the state of the component as follows: (compName, {key: val, key: val})
         * or if the second parameter is a function then the function should return the changed state of the component in an object respectively.
         * If the first parameter is an object or a function then the second parameter is omitted. 
         * In this case the object must contain a component name and the changed state of the component as follows: ({compName: {val: key, val: key}}).
         * If the first parameter is a function then the function should return the changed state of the component in an object respectively.
         * The state is stored into the default application state.
         * @param {string} refName 
         * @param {object} value 
         */
        static mergeState(key, value, update) {
            return App.get().mergeState(key, value, update);
        }

        static getInstance() {
            if (Util.isEmpty(App.init().name))
                throw "No App instance selected, invoke a function name() first";
            let app = RME.storage(App.init().name);
            App.reset();
            return app;
        }

        /**
         * Function creates a statefull component. The state of the component is stored in an application that this component is bound to.
         * @param {object} component 
         */
        static component(component) {
            const bindState = (appName) => {
                let updater = Util.isEmpty(appName) ? () => (state) => App.getState(state) : () => (state) => App.get(appName).getState(state);
                RME.component(component, updater);
            }
            return bindState;
        }

        static init() {
            if (Util.isEmpty(this.self))
                this.self = new App();
            return this.self;
        }

    }

    class AppInstance {
        constructor(name, root, object) {
            this.rawStage = object;
            this.name = name;
            this.root; 
            this.state = {};
            this.renderer;
            this.oldStage = "";
            this.router;
            this.ready = false;
            this.setState = this.setState.bind(this);
            this.getState = this.getState.bind(this);
            this.refresh = this.refreshApp.bind(this);
            this.afterRefreshCallQueue = [];
            this.refreshQueue;
            this.bindReadyListener(root);
        }
    
        bindReadyListener(root) {
            if(document.readyState === "loading" || document.readyState === "interactive") { // DOMContentLoaded
                document.addEventListener("readystatechange", () => {
                    if(document.readyState === "complete")
                        this.init(root);
                });
            } else {
                this.init(root);
            }
        }
    
        /**
         * Initialize the Application
         * @param {string} root 
         */
        init(root) {
            this.root = Util.isEmpty(root) ? Tree.getBody() : Tree.getFirst(root);
            this.renderer = new RMEElemRenderer(this.root);
            this.ready = true;
            this.refreshApp();
        }
    
        refreshApp() {
            if (this.ready) {
                if (this.refreshQueue)
                    Util.clearTimeout(this.refreshQueue);

                this.refreshQueue = Util.setTimeout(() => {
                    let freshStage = Template.isTemplate(this.rawStage) ? Template.resolve(this.rawStage) : this.rawStage;
    
                    if (!Util.isEmpty(this.router)) {
                        let state = this.router.getCurrentState();
                        if (!Util.isEmpty(state.current)) {
                            let selector = state.root;
                            let element = state.current;
                            if (Template.isFragment(element)) {
                                const fragment = {};
                                fragment[state.rootElem.getTagName().toLowerCase()+selector] = {
                                    ...element.fragment
                                };
                                freshStage.getFirst(selector).replace(Template.resolve(fragment));
                            } else {
                                freshStage.getFirst(selector).append(element);
                            }
                            if (!Util.isEmpty(state.onAfter)) this.afterRefreshCallQueue.push(state.onAfter);
                        }
                    }
    
                    if (this.oldStage.toString() !== freshStage.toString()) {
                        this.oldStage = this.renderer.merge(this.oldStage, freshStage);
                    }
                    this.refreshAppDone();
                    Util.clearTimeout(this.refreshQueue);
                });
            }
        }

        refreshAppDone() {
            this.afterRefreshCallQueue.forEach(callback => callback());
            this.afterRefreshCallQueue = [];
        }

        addAfterRefreshCallback(callback) {
            if(Util.isFunction(callback)) {
                this.afterRefreshCallQueue.push(callback)
            }
        }
    
        /**
         * Function takes three parameters that enable setting state for components.
         * If only one parameter is given then the parameter must be an object or a function. 
         * The object should define a component name and its values as follows. ({refName: {key: val, key: val}}) and
         * the function should return a object describing the component respectively.
         * If two parameters are given then the first parameter is a component name
         * and the value parameter should describe the component state object as follows. (refName, {key: val, key: val}).
         * The value parameter may also be a function that returns the component state object respectively.
         * The last parameter update is a boolean value that only if explicitly set to false then the app is not updated
         * after setting the state has occured.
         * This function will store the state into this application instance state. 
         * @param {*} refName 
         * @param {*} value 
         * @param {boolean} update
         */
        setState(refName, value, update) {
            if (Util.isString(refName) && Util.isFunction(value)) {
                this.state[refName] = value(this.state[refName]);
            } else if (Util.isString(refName) && Util.isObject(value)) {
                this.state[refName] = value;
            } else {
                let state = {};
                if (Util.isFunction(refName))
                    state = refName(this.state);
                else if (Util.isObject(refName))
                    state = refName;

                    for (let p in state) {
                        if (state.hasOwnProperty(p))
                            this.state[p] = state[p];
                    }
            }

            if (update !== false)
                this.refreshApp();
        }
    
        /**
         * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is given. 
         * Otherwise whole application state of this application instance is given.
         * @param {string} refName 
         */
        getState(refName) {
            if(Util.isString(refName)) {
                return !Util.isEmpty(this.state[refName]) ? this.state[refName] : {};
            } else if(Util.isEmpty(refName)) {
                return this.state;
            }
        }
    
        /**
         * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is checked.
         * Otherwise whole application state of this application instance is checked.
         * @param {string} refName 
         * @returns True if state empty otherwise false.
         */
        isStateEmpty(refName) {
            if(Util.isEmpty(refName))
                return this.recursiveCheckMapIsEmpty(this.state);
            else
                return this.recursiveCheckMapIsEmpty(this.state[refName]);
        }
    
        recursiveCheckMapIsEmpty(map) {
            for(let key in map) {
                if(map.hasOwnProperty(key)) {
                    if(!Util.isEmpty(map[key]))
                        return false;
                    if(Util.isObject(map[key]))
                        this.recursiveCheckMapIsEmpty(map[key]);
                }
            }
            return true;
        }
    
        /**
         * Function takes two optional parameters. If refName is given then only a state of the component with the refName is cleared otherwise 
         * whole application state of this application instance is cleared. The application is updated unless the update parameter is 
         * explicitly set false.
         * @param {string} refName 
         * @param {boolean} update 
         */
        clearState(refName, update) {
            if(Util.isEmpty(refName))
                this.recursiveClearMap(this.state);
            else 
                this.recursiveClearMap(this.state[refName]);
    
            if(update !== false) {
                this.refreshApp();
            }
        }
    
        recursiveClearMap(map) {
            for(let key in map) {
                if(map.hasOwnProperty(key)) {
                    if(Util.isString(map[key]))
                        map[key] = "";
                    else if(Util.isArray(map[key]))
                        map[key] = [];
                    else if(Util.isObject(map[key]))
                        this.recursiveClearMap(map[key]);
                }
            }
        }
    
        /**
         * Function takes three parameters. If the first parameter is string then the second parameter must be an object or a function.
         * The first parameter refName is a component name and the second parameter is the state of the component as follows: (compName, {key: val, key: val})
         * or if the second parameter is a function then the function should return the changed state of the component in an object respectively.
         * If the first parameter is an object or a function then the second parameter is omitted. 
         * In this case the object must contain a component name and the changed state of the component as follows: ({compName: {val: key, val: key}}).
         * If the first parameter is a function then the function should return the changed state of the component in an object respectively.
         * The state is stored into this application instance state.
         * @param {string} refName 
         * @param {object} value 
         * @param {boolean} update
         */
        mergeState(refName, value, update) {
            let newState = {};
            if (Util.isString(refName) && Util.isFunction(value)) {
                newState[refName] = value(this.state[refName]);
            } else if (Util.isString(refName) && Util.isObject(value)) {
                newState[refName] = value;
            } else {
                let state = {};
                if (Util.isFunction(refName))
                    state = refName(this.state);
                else if (Util.isObject(refName))
                    state = refName;

                for (let p in state) {
                    if (state.hasOwnProperty(p))
                        newState[p] = state[p]
                }
            }
            this.recursiveMergeState(this.state, newState);
            if (update !== false)
                this.refreshApp();
        }
    
        recursiveMergeState(oldMap, newMap) {
            for(let key in newMap) {
                if(newMap.hasOwnProperty(key)) {
                    if(Util.isArray(oldMap[key]) && !Util.isArray(newMap[key]))
                        oldMap[key].push(newMap[key]);
                    else if(Util.isArray(oldMap[key]) && Util.isArray(newMap[key]))
                        oldMap[key] = oldMap[key].concat(newMap[key]);
                    else if(Util.isObject(oldMap[key]) && Util.isObject(newMap[key]))
                        this.recursiveMergeState(oldMap[key], newMap[key]);
                    else
                        oldMap[key] = newMap[key];
                }
            }
        }
    
        setRouter(router) {
            this.router = router;
        }
    
    }

    return {
        name: App.name,
        root: App.root,
        create: App.create,
        get: App.get,
        component: App.component,
        setState: App.setState,
        getState: App.getState,
        clearState: App.clearState,
        isStateEmpty: App.isStateEmpty,
        mergeState: App.mergeState,
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
    merge(oldStage, newStage) {
        if (Util.isEmpty(this.root.getChildren())) {
            this.root.append(newStage);
            this.mergedStage = newStage;
        } else {
            this.render(this.root, oldStage, newStage, 0);
            this.mergedStage = oldStage;
            this.removeToBeRemoved();
        }
        return this.mergedStage;
    }

    /**
     * Function is called recusively and goes through a oldStage and a newStage simultaneosly in recursion and comparing them and updating changed content.
     * @param {object} parent 
     * @param {object} oldNode 
     * @param {object} newNode 
     * @param {number} index 
     */
    render(parent, oldNode, newNode, index) {
        if (!oldNode && newNode) {
            parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
            this.tobeRemoved.push({parent: parent, child: this.wrap(parent.dom().children[index])});
        } else if (this.hasNodeChanged(oldNode, newNode)) {
            if (oldNode.getTagName() !== newNode.getTagName() || (oldNode.dom().children.length > 0 || newNode.dom().children.length > 0)) {
                this.wrap(parent.dom().children[index]).replace(newNode.duplicate());
            } else {
                oldNode.setProps(newNode.getProps());
            }
        } else {
            let i = 0;
            let oldLength = oldNode ? oldNode.dom().children.length : 0;
            let newLength = newNode ? newNode.dom().children.length : 0;
            
            while(i < newLength || i < oldLength) {
                this.render(
                    this.wrap(parent.dom().children[index]),
                    oldNode ? this.wrap(oldNode.dom().children[i]) : null,
                    newNode ? this.wrap(newNode.dom().children[i]) : null,
                    i);
                i++;
            }
        }
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
        return !Util.isEmpty(oldNode) && !Util.isEmpty(newNode) && oldNode.getProps(true) !== newNode.getProps(true);
    }

    /**
     * Function takes DOM node as a parameter and wraps it to Elem object.
     * @param {object} node 
     * @returns the Wrapped Elem object.
     */
    wrap(node) {
        if (!Util.isEmpty(node))
            return Elem.wrap(node);
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




/**
 * AppSetInitialStateJob is used internally to set a state for components in a queue. An application
 * instance might have not been created at the time when components are created so the queue will wait 
 * until the application instance is created and then sets the state for the components in the queue.
 */
const AppSetInitialStateJob = (function () {
    
    class InitStateJob {
        constructor() {
            this.updateQueue = [];
            this.updateJob;
        }

        resolveUpdateJobs(resolveCondition) {
            if (!this.updateJob)
                this.updateJob = Util.setInterval(() => {
                    if (resolveCondition()) {
                        this.updateQueue.forEach(job => job());
                        this.updateQueue = [];
                        Util.clearInterval(this.updateJob);
                        this.updateJob = undefined;
                    }
                });
        }

        addToQueue(job) {
            this.updateQueue.push(job);
            return this;
        }
    }

    const initStateJob = new InitStateJob();

    return {
        addToQueue: initStateJob.addToQueue.bind(initStateJob),
        resolveUpdateJobs: initStateJob.resolveUpdateJobs.bind(initStateJob)
    }

})();

/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 * @param {function} components commma separated list of components
 */
const Component = (function() {


    const resolveInitialState = (initialState, stateRef, appName) => {
        if (!Util.isEmpty(App.get(appName))) {
            App.get(appName).setState(stateRef, initialState, false);
        } else {
            AppSetInitialStateJob.addToQueue(() => App.get(appName).setState(stateRef, initialState))
                .resolveUpdateJobs(() => !Util.isEmpty(App.get(appName)));
        }
    }

    const resolveComponent = component => {
        if (Util.isObject(component)) {
            App.component({[component.name]: component.comp})(component.appName);
            resolveInitialState(component.initialState, component.name+component.stateRef, component.appName);
        } else if (Util.isFunction(component) && Util.isEmpty(component.prototype) || Util.isEmpty(component.prototype.render)) {
            RME.component({[component.name]: component});
        } else if (Util.isFunction(component) && !Util.isEmpty(component.prototype.render)) {
            const comp = new component();
            App.component({[component.name]: comp.render})(comp.appName);
            let state = {};
            if (!Util.isEmpty(comp.onBeforeCreate))
                state.onBeforeCreate = comp.onBeforeCreate;
            if (!Util.isEmpty(comp.shouldComponentUpdate))
                state.shouldComponentUpdate = comp.shouldComponentUpdate;
            if (!Util.isEmpty(comp.onAfterCreate))
                state.onAfterCreate = comp.onAfterCreate;
            if (!Util.isEmpty(comp.onAfterRender))
                state.onAfterRender = comp.onAfterRender;
            state = {
                ...state,
                ...comp.initialState
            }
            const ref = comp.stateRef || state.stateRef || '';
            resolveInitialState(state, component.name+ref, comp.appName);
        }
    }

    return (...components) => {
        components.forEach(component => 
            !Util.isEmpty(component.name) && resolveComponent(component));
    }

})();

/**
 * A bindState function transfers a function component to a stateful component just like it was created 
 * using class or App class itself. The function receives three parameters. The function component,
 * an optional state object and an optinal appName.
 * Invoking examples:
 * Component(bindState(StatefulComponent));
 * Component(bindState(OtherComponent, { initialValue: 'initialText' }));
 * @param {function} component
 * @param {object} state
 * @param {string} appName
 */
const bindState = (function() {

    const getStateRef = state => {
        return state && state.stateRef ? state.stateRef : '';
    }

    const removeStateRef = state => {
        let obj = {
            ...state
        }
        delete obj.stateRef
        return obj;
    }

    return (component, state, appName) => ({
        comp: component,
        name: component.name,
        appName: appName,
        stateRef: getStateRef(state),
        initialState: {
            ...removeStateRef(state)
        }
    })

})();







let Cookie = (function() {
    /**
     * Cookie interface offers an easy way to get, set or remove cookies in application logic.
     * The Cookie interface handles Cookie objects under the hood. The cookie object may hold following values:
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
                        retCookie = new CookieInstance(cn, cv);
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
                document.cookie = CookieInstance.create(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean).toString();
            }
        }
        /**
         * Remove a cookie by name. Method will set the cookie expired and then remove it.
         * @param {string} name
         */
        static remove(name) {
            var co = Cookie.get(name);
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
    class CookieInstance {
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
                return new CookieInstance(name, value, expires, cpath, cdomain, setSecure);
        }
    }

    return Cookie;
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
            if(!Util.isEmpty(elem))
                this.html.appendChild(Template.isTemplate(elem) ? Template.resolve(elem).dom() : elem.dom());
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


/**
 * RMEElemTemplater class is able to create a Template out of an Elem object.
 */
class RMEElemTemplater {
    constructor() {
        this.instance;
        this.template = {};
        this.deep = true;
    }

    toTemplate(elem, deep) {
        if(!Util.isEmpty(deep))
            this.deep = deep;
        this.resolve(elem, this.template);
        return this.template;
    }

    /**
     * Function is called recursively and resolves an Elem object and its children in recursion
     * @param {object} elem 
     * @param {object} parent 
     */
    resolve(elem, parent) {
        let resolved = this.resolveElem(elem, this.resolveProps(elem));
        for(let p in parent) {
            if(parent.hasOwnProperty(p)) {
                if(Util.isArray(parent[p]))
                    parent[p].push(resolved);
                else
                    this.extendMap(parent[p], resolved);
            }
        }

        let i = 0;
        let children = Util.isArray(elem.getChildren()) ? elem.getChildren() : [elem.getChildren()];
        if(children && this.deep) {
            while(i < children.length) {
                this.resolve(children[i], resolved);
                i++;
            }
        }
        this.template = resolved;
    }

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
        let el = {};
        let children = elem.getChildren();
        if(Util.isArray(children) && children.length > 1) {
            let elTag = elem.getTagName().toLowerCase();
            let elName = this.resolveId(elTag, props);
            elName = this.resolveClass(elName, props);
            elName = this.resolveAttrs(elName, props);
            el[elName] = [];
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
        for(let p in props) {
            if(props.hasOwnProperty(p) && p !== "id" && p !== "class") {
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
     * Resolves html data-* attributes by removing '-' and setting the next character to uppercase. If the attribute is not 
     * data-* attribute then it is directly returned.
     * @param {string} attrName 
     * @returns Resolved attribute name.
     */
    resolveAttributeNames(attrName) {
        if(attrName.indexOf("data" === 0 && attrName.length > "data".length)) {
            while(attrName.search("-") > -1) {
                attrName = attrName.replace(/-\w/, attrName.charAt(attrName.search("-") + 1).toUpperCase());
            }
            return attrName
        } else {
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

    static getInstance() {
        if(!this.instance)
            this.instance = new RMEElemTemplater();
        return this.instance;
    }
}



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
            Tree.getHead().append({
                style: {
                    content,
                    ...config
                }
            });
        } else if (!hasContent(content, config)) {
            const style = getStyles(config);
            if (!Util.isEmpty(style)) {
                const prevContent = style.getContent();
                style.setContent(prevContent+content);
            }
        }
    }
})();




const EventPipe = (function() {

    /**
     * EventPipe class can be used to multicast and send custom events to registered listeners.
     * Each event in an event queue will be sent to each registerd listener.
     */
    class EventPipe {
        constructor() {
            this.eventsQueue = [];
            this.callQueue = [];
            this.loopTimeout;
        }

        containsEvent() {
            return this.eventsQueue.find(ev => ev.type === event.type);
        }

        /**
         * Function sends an event object though the EventPipe. The event must have a type attribute
         * defined otherwise an error is thrown. 
         * Example defintion of the event object. 
         * { 
         *   type: 'some event',
         *   ...payload
         * }
         * If an event listener is defined the sent event will be received on the event listener.
         * @param {object} event 
         */
        send(event) {
            if (Util.isEmpty(event.type))
                throw new Error('Event must have type attribute.');
            
            if (!this.containsEvent())
                this.eventsQueue.push(event);

            this.loopEvents();
        }

        loopEvents() {
            if (this.loopTimeout)
                Util.clearTimeout(this.loopTimeout);

            this.loopTimeout = Util.setTimeout(() => {
                this.callQueue.forEach(eventCallback => 
                    this.eventsQueue.forEach(ev => eventCallback(ev)));

                this.eventsQueue = [];
                this.callQueue = [];
            });
        }

        /**
         * Function registers an event listener function that receives an event sent through the
         * EventPipe. Each listener will receive each event that are in an event queue. The listener
         * function receives the event as a parameter.
         * @param {function} eventCallback 
         */
        receive(eventCallback) {
            this.callQueue.push(eventCallback);
        }

    }

    const eventPipe = new EventPipe();

    return {
        send: eventPipe.send.bind(eventPipe),
        receive: eventPipe.receive.bind(eventPipe)
    }

})();



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
class HttpFetchRequest {
    constructor() {}
    /**
     * Does Fetch GET request. Content-Type JSON is used by default.
     * @param {stirng} url *Required
     * @param {*} init 
     */
    get(url, init) {
        if(!init) init = {};
        init.method = "GET";
        return this.do({url: url, init: init, contentType: Http.JSON});
    }
    /**
     * Does Fetch POST request. Content-Type JSON is used by default.
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
     * Does Fetch PUT request. Content-Type JSON is used by default.
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
     * Does Fetch DELETE request. Content-Type JSON is used by default.
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
            if(!config.init.headers.has("Content-Type"))
                config.init.headers.set("Content-Type", config.contentType);
        }
        if(config.method) {
            config.init.method = config.method;
        }
        return fetch(config.url, config.init);
    }
}


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
                this.self = new HttpFetchRequest();
            } else if(window.Promise) {
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
    class HttpAjax {
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
                isResponseOK(this.xhr.status) ? successHandler(resolveResponse(this.xhr.response), this.xhr) : errorHandler(this.xhr)
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
    class HttpPromiseAjax {
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
                    isResponseOK(request.status) ? resolve(resolveResponse(request.response)) : reject(request);
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

    const resolveResponse = (response) => {
        let resp = tryParseJSON(response);
        if(Util.isEmpty(resp))
            resp = response;
        return resp;
    }
    
    const setXhrHeaders = (xhr, headers) => {
        for(let header in headers) {
            if(headers.hasOwnProperty(header))
                xhr.setRequestHeader(header, headers[header]);
        }
    }
    
    const isResponseOK = (status) => {
        let okResponses = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
        let i = 0;
        while(i < okResponses.length) {
            if(okResponses[i] === status)
                return true;
            i++;
        }
        return false;
    }
    
    const isContentTypeJson = (contentType) => {
        return contentType === Http.JSON;
    }
    
    const tryParseJSON = (text) => {
        try {
            return JSON.parse(text);
        } catch(e) {}
    }

    return Http;
}());




let RME = (function() {
    /**
     * RME stands for Rest Made Easy. This is a small easy to use library that enables you to create RESTfull webpages with ease and speed.
     * This library is free to use under the MIT License.
     * 
     * RME class is a core of the RME library. The RME class offers functionality to start a RME application, control components, external script files and rme storage.
     */
    class RME {
        constructor() {
            this.instance = this;
            this.completeRun = function() {};
            this.runner = function() {};
            this.onStorageChange = function(state) {};
            this.components = {};
            this.rmeState = {};
            this.router;
            this.messages;
            this.defaultApp;
        }

        complete() {
            this.completeRun.call();
        }

        start() {
            this.runner.call();
        }

        setComplete(runnable) {
            this.completeRun = runnable;
        }

        setRunner(runnable) {
            this.runner = runnable;
            return this.instance;
        }

        addComponent(runnable, props) {
            var comp;
            if(Util.isFunction(runnable))
                comp = runnable.call();
            else if(Util.isObject(runnable))
                comp = runnable;
            for(var p in comp) {
                if(comp.hasOwnProperty(p)) {
                    this.components[p] = {component: comp[p], update: Util.isFunction(props) ? props : undefined};
                }
            }
            comp = null;
        }

        getComponent(name, props) {
            let comp = this.components[name];
            if (!comp)
                throw "Cannot find a component: \""+name+"\"";
            if (!Util.isEmpty(props) && Util.isFunction(comp.update)) {
                let stateRef = props.stateRef;
                if (Util.isEmpty(props.stateRef))
                    stateRef = name;
                else if (props.stateRef.search(name) === -1)
                    stateRef = `${name}${props.stateRef}`;

                props["stateRef"] = stateRef;
                const newProps = comp.update.call()(stateRef);
                const nextProps = {...props, ...newProps};
                if (!nextProps.shouldComponentUpdate || nextProps.shouldComponentUpdate(nextProps) !== false) {
                    props = this.extendProps(props, newProps);
                }
            }
            if (Util.isEmpty(props))
                props = {};
            if (!Util.isEmpty(props.onBeforeCreate) && Util.isFunction(props.onBeforeCreate))
                props.onBeforeCreate.call(props, props);
            let ret = comp.component.call(props, props);
            if (Template.isTemplate(ret))
                ret = Template.resolve(ret);
            if (!Util.isEmpty(props.onAfterCreate) && Util.isFunction(props.onAfterCreate))
                props.onAfterCreate.call(props, ret, props);
            if (!Util.isEmpty(this.defaultApp) && !Util.isEmpty(props.onAfterRender) && Util.isFunction(props.onAfterRender))
                this.defaultApp.addAfterRefreshCallback(props.onAfterRender.bind(ret, ret, props));

            return ret;
        }

        extendProps(props, newProps) {
            if(!Util.isEmpty(newProps)) {
                for(let p in newProps) {
                    if(newProps.hasOwnProperty(p)) {
                        props[p] = newProps[p];
                    }
                }
            }
            return props;
        }

        setRmeState(key, value) {
            this.rmeState[key] = value;
            this.onStorageChange.call(this, this.rmeState);
        }

        getRmeState(key) {
            return this.rmeState[key];
        }

        configure(config) {
            this.router = config.router;
            this.messages = config.messages;
            this.defaultApp = config.app;
            
            if(!Util.isEmpty(this.router))
                this.router.setApp(this.defaultApp);
            if(!Util.isEmpty(this.messages))
                this.messages.setApp(this.defaultApp);
            if(!Util.isEmpty(this.defaultApp))
                this.defaultApp.setRouter(this.router);
        }

        /** 
         * Runs a runnable script immedeately. If multpile run functions are declared they will be invoked by the declaration order.
         */
        static run(runnable) {
            if(runnable && Util.isFunction(runnable))
                RME.getInstance().setRunner(runnable).start();
        }

        /**
         * Waits until body has been loaded and then runs a runnable script. 
         * If multiple ready functions are declared the latter one is invoked.
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
            if(runnable && (Util.isFunction(runnable) || Util.isObject(runnable)))
                RME.getInstance().addComponent(runnable, props);
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
                RME.addScript(sc);
            }
        }

        /**
         * This is called when ever a new data is saved into the RME instance storage.
         * Callback function has one paramater newState that is the latest snapshot of the 
         * current instance storage.
         * @param {function} listener 
         */
        static onStorageChange(listener) {
            if(listener && Util.isFunction(listener))
                RME.getInstance().onrmestoragechange = listener;
        }

        /**
         * Function checks if a component with the given name exists.
         * @param {string} name 
         * @returns True if the component exist otherwise false
         */
        static hasComponent(name) {
            return !Util.isEmpty(RME.getInstance().components[name.replace("component:", "")]);
        }

        /**
         * Function receives an object as a parameter that holds three properties router, messages and app. The function will
         * autoconfigure the Router, the Messages and the App instance to be used as default.
         * 
         * The config object represented
         * {
         * router: Router reference
         * messages: Messages reference
         * app: App instance
         * }
         * @param {object} config 
         */
        static use(config) {
            RME.getInstance().configure(config);
        }

        static addScript(elem) {
            let scripts = Tree.getScripts();
            let lastScript = scripts[scripts.length -1];
            lastScript.after(elem);
        }

        static removeScript(sourceOrId) {
            if(sourceOrId.indexOf("#") === 0) {
                Tree.getHead().remove(Tree.get(sourceOrId));
            } else {
                let scripts = Tree.getScripts();
                for(let s in scripts) {
                    if(scripts.hasOwnProperty(s)) {
                        let src = !Util.isEmpty(scripts[s].getSource()) ? scripts[s].getSource() : "";
                        if(src.search(sourceOrId) > -1 && src.search(sourceOrId) === src.length - sourceOrId.length) {
                            Tree.getHead().remove(scripts[s]);
                            break;
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
    
    document.addEventListener("readystatechange", () => {
        if(document.readyState === "complete")
            RME.getInstance().complete();
    });

    return {
        run: RME.run,
        ready: RME.ready,
        component: RME.component,
        storage: RME.storage,
        script: RME.script,
        onStorageChange: RME.onStorageChange,
        hasComponent: RME.hasComponent,
        use: RME.use
    }
}());



let Messages = (function() {
    /**
     * Messages class handles internationalization. The class offers public methods that enable easy 
     * using of translated content.
     */
    class Messages {
        constructor() {
            this.instance = this;
            this.messages = [];
            this.locale = "";
            this.translated = [];
            this.load = function() {};
            this.messagesType;
            this.app;
            this.ready = false;
            this.registerMessages();
        }

        /**
         * Initializes the Messages
         */
        registerMessages() {
            document.addEventListener("readystatechange", () => {
                if(document.readyState === "complete") {
                    this.ready = true;
                    this.runTranslated.call(this);
                }
            });
        }

        setLoad(loader) {
            this.load = loader;
        }

        setAppInstance(appInstance) {
            this.app = appInstance;
        }

        setLocale(locale) {
            this.locale = locale;
            return this;
        }

        setMessages(messages) {
            if(Util.isArray(messages))
                this.messagesType = "array";
            else if(Util.isObject(messages))
                this.messagesType = "map";
            else
                throw "messages must be type array or object";
            this.messages = messages;
            this.runTranslated.call(this);
        }

        getMessage(text, ...params) {
            if(Util.isEmpty(params[0][0])) {
                return this.resolveMessage(text);
            } else {
                this.getTranslatedElemIfExist(text, params[0][0]);
                let msg = this.resolveMessage(text);
                return this.resolveParams(msg, params[0][0]);
            }
        }

        /**
         * Resolves translated message key and returns a resolved message if exist
         * otherwise returns the given key.
         * @param {string} text 
         * @returns A resolved message if exist otherwise the given key.
         */
        resolveMessage(text) {
            if(this.messagesType === "array") {
                return this.resolveMessagesArray(text);
            } else if(this.messagesType === "map") {
                return this.resolveMessagesMap(text);
            }
        }

        /**
         * Resolves a translated message key from the map. Returns a resolved message 
         * if found otherwise returns the key.
         * @param {string} text 
         * @returns A resolved message
         */
        resolveMessagesMap(text) {
            let msg = text;
            for(let i in this.messages) {
                if(i === text) {
                    msg = this.messages[i];
                    break;
                }
            }
            return msg;
        }

        /**
         * Resolves a translated message key from the array. Returns a resolved message
         * if found otherwise returns the key.
         * @param {string} text 
         * @returns A resolved message
         */
        resolveMessagesArray(text) {
            let i = 0;
            let msg = text;
            while(i < this.messages.length) {
                if(!Util.isEmpty(this.messages[i][text])) {
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
            if(!Util.isEmpty(msg)) {
                let i = 0;
                while(i < params.length) {
                    msg = msg.replace("{"+i+"}", params[i]);
                    i++;
                }
                return msg;
            }
        }

        /**
         * Function gets a Elem object and inserts it into a translated object array if it exists.
         * @param {string} key 
         * @param {*} params 
         */
        getTranslatedElemIfExist(key, params) {
            if(Util.isEmpty(this.app)) {
                let last = params[params.length - 1];
                if(Util.isObject(last) && last instanceof Elem) {
                    last = params.pop();
                    this.translated.push({key: key, params: params, obj: last});
                }
            }
        }

        /**
         * Function goes through the translated objects array and sets a translated message to the translated elements.
         */
        runTranslated() {
            if(Util.isEmpty(this.app) && this.ready) {
                Util.setTimeout(() => {
                    let i = 0;
                    while(i < this.translated.length) {
                        this.translated[i].obj.setText.call(this.translated[i].obj, Messages.message(this.translated[i].key, this.translated[i].params));
                        i++;
                    }
                });
            } else if(this.ready) {
                this.app.refresh();
            }
        }

        /**
         * Function returns current locale of the Messages
         * @returns Current locale
         */
        static locale() {
            return Messages.getInstance().locale;
        }

        /**
         * Lang function is used to change or set the current locale to be the given locale. After calling this method
         * the Messages.load function will be automatically invoked.
         * @param {string} locale String
         * @param {object} locale Event
         */
        static lang(locale) {
            let loc;
            if(Util.isObject(locale) && locale instanceof Event) {
                locale.preventDefault();
                let el = Elem.wrap(locale.target);
                loc = el.getHref();
                if(Util.isEmpty(loc))
                    loc = el.getValue();
                if(Util.isEmpty(loc))
                    loc = el.getText();
            } else if(Util.isString(locale))
                loc = locale;
            else
                throw "Given parameter must be type string or instance of Event, given value: " + locale;
            if(!Util.isEmpty(loc))
                Messages.getInstance().setLocale(loc).load.call(null, 
                    Messages.getInstance().locale, Messages.getInstance().setMessages.bind(Messages.getInstance()));
        }

        /**
         * Message function is used to retrieve translated messages. The function also supports message parameters
         * that can be given as a comma separeted list. 
         * @param {string} text 
         * @param {*} params 
         * @returns A resolved message or the given key if the message is not found.
         */
        static message(text, ...params) {
            return Messages.getInstance().getMessage(text, params);
        }

        /**
         * Load function is used to load new messages or change already loaded messages.
         * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
         * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
         * This function is called automatically when language is changed by calling the Messages.lang() function.
         * @param {function} loader 
         */
        static load(loader) {
            if(!Util.isFunction(loader))
                throw "loader must be type function " + Util.getType(loader);
            Messages.getInstance().setLoad(loader);
        }

        /**
         * Set the app instance to be invoked on the Messages update.
         * @param {object} appInstance 
         */
        static setApp(appInstance) {
            Messages.getInstance().setAppInstance(appInstance);
            return Messages;
        }

        static getInstance() {
            if(!this.instance)
                this.instance = new Messages();
            return this.instance;
        }
    }

    return {
        lang: Messages.lang,
        message: Messages.message,
        load: Messages.load,
        locale: Messages.locale,
        setApp: Messages.setApp
    };
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




let Router = (function() {
    /**
     * Router class handles and renders route elements that are given by Router.routes() method.
     * The method takes an array of route objects that are defined as follows: {route: "url", elem: elemObject, hide: true|false|undefined}.
     * The first element the array of route objects is by default the root route object in which all other route objects 
     * are rendered into.
     */
    class Router {
        constructor() {
            this.instance = null;
            this.root = null;
            this.origRoot = null;
            this.routes = [];
            this.origRoutes = [];
            this.currentRoute = {};
            this.prevUrl = location.pathname;
            this.loadCall = () => this.navigateUrl(location.pathname);
            this.hashCall = () => this.navigateUrl(location.hash);
            this.useHistory =  true;
            this.autoListen = true;
            this.useHash = false;
            this.scrolltop = true;
            this.app;
            this.registerRouter();
        }

        /**
         * Initializes the Router.
         */
        registerRouter() {
            document.addEventListener("readystatechange", () => {
                if(document.readyState === "complete") {
                    let check = Util.setInterval(() => {
                        let hasRoot = !Util.isEmpty(this.root.elem) ? document.querySelector(this.root.elem) : false;
                        if(hasRoot) {
                            Util.clearInterval(check);
                            this.resolveRoutes();
                        }
                    }, 50)
                }
            });
        }

        /**
         * Register listeners according to the useHistory and the autoListen state.
         */
        registerListeners() {
            if(this.useHistory && this.autoListen)
                window.addEventListener("load", this.loadCall);
            else if(!this.useHistory && this.autoListen)
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
        }

        /**
         * Set the Router to auto listen url change to true or false.
         * @param {boolean} listen
         */
        setAutoListen(listen) {
            this.autoListen = listen;
        }

        /**
         * Set auto scroll up true or false.
         * @param {boolean} auto 
         */
        setAutoScrollUp(auto) {
            this.scrolltop = auto;
        }

        /**
         * Set the app instance that the Router invokes on update.
         * @param {object} appInstance 
         */
        setApp(appInstance) {
            this.app = appInstance;
        }

        /**
         * Resolves the root and the first page.
         */
        resolveRoutes() {
            if(Util.isString(this.root.elem)) {
                this.root.elem = this.resolveElem(this.root.elem);
            } else if(Util.isEmpty(this.root)) {
                this.root = this.routes.shift();
                this.root.elem = this.resolveElem(this.root.elem);
                this.origRoot = this.root.elem;
            }
            if(this.useHash) {
                this.renderRoute(location.hash);
            } else {
                this.renderRoute(location.pathname);
            }
        }

        /**
         * Set the routes and if a root is not set then the first element will be the root route element.
         * @param {array} routes
         */
        setRoutes(routes) {
            this.routes = routes;
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
            this.origRoot = route.elem;
        }

        /**
         * @deprecated
         * Resolve route elements.
         * @param {array} routes 
         */
        resolveRouteElems(routes) {
            let i = 0;
            while (i < routes.length) {
                routes[i].elem = this.resolveElem(routes[i].elem);
                i++;
            }
            return routes;
        }

        /**
         * Method resolves element. If elem is string gets a component of the name if exist otherwise creates a new elemen of the name.
         * If both does not apply then method assumes the elem to be an element and returns it.
         * @param {*} elem 
         */
        resolveElem(elem, props) {
            if (Util.isString(elem) && RME.hasComponent(elem)) {
                return RME.component(elem, props);
            } else if (Util.isString(elem) && this.isSelector(elem)) {
                return Tree.getFirst(elem);
            } else if (elem instanceof Elem) {
                return elem;
            } else if (Util.isEmpty(elem)) {
                return elem;
            }
            throw new Error(`Could not resolve a route elem: ${elem}`);
        }

        /**
         * Function checks if a tag starts with a dot or hashtag or is a HTML tag.
         * If described conditions are met then the tag is supposed to be a selector.
         * @param {string} tag 
         * @returns True if the tag is a selector otherwise false.
         */
        isSelector(tag) {
            return tag.charAt(0) === '.'
                || tag.charAt(0) === '#'
                || Template.isTag(tag);
        }

        /**
         * Method navigates to the url and renders a route element inside the root route element if found.
         * @param {string} url
         */
        navigateUrl(url) {
            var route = this.findRoute(url);
            if (!Util.isEmpty(route) && this.useHistory && !route.hide) {
                history.pushState(null, null, url);
            } else if(!Util.isEmpty(route) && !route.hide) {
                location.href = url;
            }
            if (!Util.isEmpty(this.root) && !Util.isEmpty(route)) {
                if ((route.scrolltop === true) || (route.scrolltop === undefined && this.scrolltop))
                    Browser.scrollTo(0, 0);
                this.prevUrl = this.getUrlPath(url);
                this.currentRoute = route;
                if (Util.isEmpty(this.app)) {
                    if (!Util.isEmpty(route.onBefore)) route.onBefore();
                    this.root.elem.render(this.resolveElem(route.elem, route.compProps));
                    if (!Util.isEmpty(route.onAfter)) route.onAfter();
                } else {
                    if (!Util.isEmpty(route.onBefore)) route.onBefore();
                    this.app.refresh();
                }
            }
        }

        /**
         * Method looks for a route by the url. If the router is found then it will be returned otherwise returns null
         * @param {string} url
         * @param {boolean} force
         * @returns The found router or null if not found.
         */
        findRoute(url, force) {
            var i = 0;
            if(!Util.isEmpty(url) && (this.prevUrl !== this.getUrlPath(url) || force)) {
                while(i < this.routes.length) {
                    if(this.matches(this.routes[i].route, url))
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
            var route = this.findRoute(url, true);
            if(!Util.isEmpty(route) && Util.isEmpty(this.app)) {
                if (!Util.isEmpty(route.onBefore)) route.onBefore();
                this.root.elem.render(this.resolveElem(route.elem, route.compProps));
                this.currentRoute = route;
                if (!Util.isEmpty(route.onAfter)) route.onAfter();
            } else if(Util.isEmpty(this.app)) {
                this.root.elem.render();
            } else if(!Util.isEmpty(route) && !Util.isEmpty(this.app)) {
                if (!Util.isEmpty(route.onBefore)) route.onBefore();
                this.app.refresh();
                this.currentRoute = route;
            }

            this.prevUrl = location.pathname;
        }

        /**
         * Method matches a given url parameters and returns true if the urls matches.
         * @param {string} url
         * @param {string} newUrl
         * @returns True if the given urls matches otherwise false.
         */
        matches(url, newUrl) {
            if (this.useHistory) {
                url = Util.isString(url) ? url.replace(/\*/g, '.*').replace(/\/{2,}/g, '/') : url;
                let path = this.getUrlPath(newUrl);
                let found = path.match(url);
                if (!Util.isEmpty(found))
                    found = found.join();
                return found === path && new RegExp(url).test(newUrl);
            } else {
                if (Util.isString(url)) {
                    url = url.replace(/\*/g, '.*');
                    if (url.charAt(0) !== '#')
                        url = `#${url}`;
                }
                let hash = newUrl.match(/\#{1}.*/).join();
                let found = hash.match(url);
                if (!Util.isEmpty(found))
                    found = found.join();
                return found === hash && new RegExp(url).test(newUrl);
            }
        }

        /**
         * Cut the protocol and domain of the url off if exist.
         * For example https://www.example.com/example -> /example
         * @param {string} url 
         * @returns The path of the url.
         */
        getUrlPath(url) {
            return this.useHash ? url : url.replace(/\:{1}\/{2}/, '').match(/\/{1}.*/).join();
        }

        /**
         * @returns The current status of the Router in an object.
         */
        getCurrentState() {
            return {
                root: this.origRoot,
                rootElem: this.root.elem,
                current: this.resolveElem(this.currentRoute.elem, this.currentRoute.compProps),
                onAfter: this.currentRoute.onAfter
            }
        }

        /**
         * Method will try to find a route according to the given parameter. The supported parameter combinations are url, event or elem & event. 
         * The first paramter can either be an URL or an Event or an Elem. The second parameter is an Event if the first parameter is an Elem.
         * If the route is found, then the Router will update a new url to the browser and render the found route element.
         * @param {string} url
         * @param {object} url type event
         * @param {object} url type Elem
         * @param {object} event
         */
        static navigate(url, event) {
            if(Util.isString(url))
                Router.getInstance().navigateUrl(url);
            else if(Util.isObject(url) && url instanceof Event) {
                if(!Router.getInstance().autoListen || Router.getInstance().useHash)
                    url.preventDefault();
                Router.getInstance().navigateUrl(url.target.href);
            } else if(Util.isObject(url) && url instanceof Elem && !Util.isEmpty(event) && Util.isObject(event) && event instanceof Event) {
                if(!Router.getInstance().autoListen || Router.getInstance().useHash)
                    event.preventDefault();
                Router.getInstance().navigateUrl(url.getHref());
            }
        }

        /**
         * Set a root element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {object} elem
         * @returns Router
         */
        static root(elem) {
            Router.getInstance().setRoot({elem: elem});
            return Router;
        }

        /**
         * Add a new route element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {string} url
         * @param {object} elem
         * @param {boolean} hide
         */
        static add(url, elem, hide) {
            Router.getInstance().addRoute({route: url, elem: elem, hide: hide});
            return Router;
        }

        /**
         * Set an array of routes that the Router uses. If a root is not set then the first item in the given routes array will be the root route element.
         * @param {array} routes
         */
        static routes(routes) {
            if(!Util.isArray(routes))
                throw "Could not set routes. Given parameter: \"" + routes + "\" is not an array."
            Router.getInstance().setRoutes(routes);
            return Router;
        }

        /**
         * Method sets the Router to use an url implementation. The url implementation defaults to HTML standard that pressing a link
         * will cause the browser reload a new page. After reload the new page is rendered. If you wish to skip reload then you should 
         * set the parameter manual to true.
         * @param {boolean} manual
         * @returns Router
         */
        static url(manual) {
            Router.getInstance().setUseHistory(true);
            Router.getInstance().registerListeners();
            if(Util.isBoolean(manual) && manual) {
                Router.manual();
            }
            return Router;
        }

        /**
         * Method sets the Router not to automatically follow url changes. If this method is invoked 
         * the user must explicitly define a method that calls Router.navigate in order to have navigation working
         * properly when going forward and backward in the history. The method will not 
         * do anything if the url implementation is not used.
         * @returns Router
         */
        static manual() {
            if(Router.getInstance().useHistory) {
                Router.getInstance().clearListeners();
                Router.getInstance().setAutoListen(false);
                Router.getInstance().registerListeners();
            }
            return Router;
        }

        /**
         * Method sets the Router to use a hash implementation. When this implementation is used 
         * there is no need to manually use Router.navigate function because change
         * of the hash is automatically followed.
         * @returns Router
         */
        static hash() {
            Router.getInstance().setUseHistory(false);
            Router.getInstance().setAutoListen(true);
            Router.getInstance().registerListeners();
            Router.getInstance().useHash = true;
            return Router;
        }

        /**
         * Method sets default level behavior for route naviagation. If the given value is true then the Browser auto-scrolls up 
         * when navigating to a new resource. If set false then the Browser does not auto-scroll up. Default value is true.
         * @param {boolean} auto 
         * @returns Router
         */
        static scroll(auto) {
            if(Util.isBoolean(auto)) {
                Router.getInstance().setAutoScrollUp(auto);
            }
            return Router;
        }

        /**
         * Set the app instance to be invoked on the Router update.
         * @param {object} appInstance 
         * @returns Router
         */
        static setApp(appInstance) {
            if(!Util.isEmpty(appInstance))
                Router.getInstance().setApp(appInstance);
            return Router;
        }

        /**
         * @returns The current status of the router.
         */
        static getCurrentState() {
            return Router.getInstance().getCurrentState();
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
        url: Router.url,
        hash: Router.hash,
        scroll: Router.scroll,
        getCurrentState: Router.getCurrentState,
        setApp: Router.setApp,
    }
}());

/**
 * Session class is a wrapper interface for the SessionStorage and thus provides get, set, remove and clear methods of the SessionStorage.
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
 * Storage class is a wrapper interface for the LocalStorage and thus provides get, set, remove and clear methods of the LocalStorage.
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
                        ++round;
                        this.root = this.resolveElement(obj, template[obj]);
                        if (Util.isArray(template[obj]))
                            this.resolveArray(template[obj], this.root, round);
                        else if (!this.isComponent(obj) && Util.isObject(template[obj]))
                            this.resolve(template[obj], this.root, round);
                        else if (Util.isString(template[obj]) || Util.isNumber(template[obj]))
                            this.resolveStringNumber(this.root, template[obj]);
                        else if (Util.isFunction(template[obj]))
                            this.resolveFunction(this.root, template[obj], round);
                    } else {
                        ++round;
                        if (Template.isAttr(obj, parent)) {
                            this.resolveAttributes(parent, obj, this.resolveFunctionBasedAttribute(template[obj]));
                        } else if (this.isEventKeyVal(obj, template[obj])) {
                            parent[obj].call(parent, template[obj]);
                        } else {
                            var child = this.resolveElement(obj, template[obj]);
                            if (Template.isFragment(child)) {
                                this.resolveFragment(child.fragment || template[obj], parent, round);
                            } else {
                                parent.append(child);
                                if (Util.isArray(template[obj])) {
                                    this.resolveArray(template[obj], child, round);
                                } else if (!this.isComponent(obj) && Util.isObject(template[obj])) {
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

        /**
         * Method receives three parameters that represent pieces of the HTML tree. Method resolves
         * given parameters accordingly and eventually HTML nodes are appended into the HTML tree.
         * @param {*} fragment 
         * @param {*} parent 
         * @param {*} round 
         */
        resolveFragment(fragment, parent, round) {
            if (Util.isArray(fragment)) {
                this.resolveArray(fragment, parent, round);
            } else if (Util.isFunction(fragment)) {
                const ret = fragment.call(parent, parent);
                if (Util.isArray(ret))
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
                } else if(Util.isArray(ret)) {
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
            if (RME.hasComponent(el)) {
                el = el.replace(/component:/, "");
                resolved = RME.component(el, obj);
                if (Util.isEmpty(resolved))
                    return resolved;
            } else if (Util.isEmpty(el)) {
                throw `Template resolver could not find element: ${el} from the given tag: ${tag}`;
            } else if (el.indexOf('fragment') === 0) {
                return el.match(/fragment/).join();
            } else {
                resolved = new Elem(el);
            }

            match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id
            if (!Util.isEmpty(match))
                resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));

            match = this.cutAttributesIfFound(tag).match(/\.[a-zA-Z-0-9\-]+/g); //find classes
            if (!Util.isEmpty(match)) 
                resolved.addClasses(match.join(" ").replace(/\./g, ""));

            match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_\/\.&%@!?£$+¤|;\\<\\>\\"]+\]/g); //find attributes
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
         * Function will try to parse an element name from the given string. If the given string
         * is no empty a matched string is returned. If the given string is empty nothing is returned
         * @param {string} str 
         * @returns The matched string.
         */
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
         * Method takes a parameter and checks if the parameter is type fragment. 
         * If the parameter is type fragment the method will return true
         * otherwise false is returned.
         * @param {*} child 
         * @returns True if the parameter is type fragment otherwise false is returned.
         */
        static isFragment(child) {
            return !Util.isEmpty(child) && (child === 'fragment' || !Util.isEmpty(child.fragment))
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
        isTemplate: Template.isTemplate,
        isTag: Template.isTag,
        updateElemProps: Template.updateElemProps,
        isFragment: Template.isFragment,
        resolveToParent: Template.resolveToParent
    }
}());


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
        return (value === null || value === undefined || value === "") || (Util.isArray(value) && value.length === 0);
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
     * Sets a timeout where the given callback function will be called once after the given milliseconds of time. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The timeout object.
     */
    static setTimeout(callback, milliseconds, ...params) {
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
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
        if(!Util.isFunction(callback)) {
            throw "callback not fuction";
        }
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

