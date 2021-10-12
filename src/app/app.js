import RME from '../rme';
import Util from '../util';
import RMEElemRenderer from './renderer';
import Template from '../template';
import Tree from '../tree';

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
                    let freshStage = Template.isTemplate(this.rawStage) ? Template.resolve(this.rawStage) : this.rawStage.duplicate();
    
                    if (!Util.isEmpty(this.router)) {
                        let state = this.router.getCurrentState();
                        if (!Util.isEmpty(state.current)) {
                            let selector = state.root;
                            let element = state.current;
                            if (Template.isFragment(element)) {
                                const fragment = {};
                                fragment[state.rootElem.toLiteralString()] = {
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
         * 
         * If two parameters are given then the first parameter is a component name
         * and the value parameter should describe the component state object as follows. (refName, {key: val, key: val}).
         * The value parameter may also be a function that returns the component state object respectively.
         * 
         * The last parameter update is a boolean value that only if explicitly set to false then the app is not updated
         * after setting the state has occured.
         * 
         * This function will store the state into this application instance state. 
         * @param {*} refName stateRef.
         * @param {*} value new state to set.
         * @param {boolean} update if set to false rerender wont happen after set state.
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

export default App;