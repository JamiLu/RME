import RME from '../rme';
import Util from '../util';
import Renderer from './renderer';
import Template from '../template';
import Tree from '../tree';
import Util from '../util';

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
         * Function takes two parameters that enable setting state for components. If only one parameter is given then the parameter must be an object
         * that defines the component name and its values as follows. ({refName: {key: val, key: val}})
         * If two parameters are given then the first parameter is a component name and the values is component state object as follows. (refName, {key: val, key: val}).
         * Given states are stored into default application. 
         * @param {*} refName 
         * @param {*} value 
         */
        static setState(refName, value) {
            return App.get().setState(refName, value);
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
         * Function takes two parameters. If the first parameter is string then the second parameter must be an object. The first parameter refName 
         * defines a component and the second parameter is the state of the component as follows: (compName, {key: val, key: val}) If the first parameter is an object then the second parameter
         * is omitted. In this case the object must contain a component name and a state for the component as follows: ({compName: {val: key, val: key}}).
         * Given states are stored into default application.
         * @param {string} refName 
         * @param {object} value 
         */
        static mergeState(key, value) {
            return App.get().mergeState(key, value);
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
            this.renderer = new Renderer(this.root);
            this.ready = true;
            this.refreshApp();
        }
    
        refreshApp() {
            if(this.ready) {
                Util.setTimeout(() => {
                    let freshStage = Template.isTemplate(this.rawStage) ? Template.resolve(this.rawStage) : this.rawStage;
    
                    if(!Util.isEmpty(this.router)) {
                        let state = this.router.getCurrentState();
                        if(!Util.isEmpty(state.current)) {
                            let selector = state.root;
                            let element = state.current;
                            freshStage.getFirst(selector).append(element);
                        }
                    }
    
                    if(this.oldStage.toString() !== freshStage.toString()) {
                        this.oldStage = this.renderer.merge(this.oldStage, freshStage);
                    }
                });
            }
        }
    
        /**
         * Function takes two parameters that enable setting state for components. If only one parameter is given then the parameter must be an object
         * that defines the component name and its values as follows. ({refName: {key: val, key: val}})
         * If two parameters are given then the first parameter is a component name and the values is component state object as follows. (refName, {key: val, key: val}).
         * Given states are stored into this application instance state. 
         * @param {*} refName 
         * @param {*} value 
         */
        setState(refName, value) {
            if(Util.isString(refName)) {
                this.state[refName] = value;
                this.refreshApp();
            } else if(Util.isObject(refName)) {
                for(let p in refName) {
                    if(refName.hasOwnProperty(p))
                        this.state[p] = refName[p];
                }
                this.refreshApp();
            }
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
         * whole application state of this application instance is cleared. If update is given then after clearing the state the application is refreshed.
         * @param {string} refName 
         * @param {boolean} update 
         */
        clearState(refName, update) {
            if(Util.isEmpty(refName))
                this.recursiveClearMap(this.state);
            else 
                this.recursiveClearMap(this.state[refName]);
    
            if(Util.isBoolean(update) && update === true) {
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
         * Function takes two parameters. If the first parameter is string then the second parameter must be an object. The first parameter refName 
         * defines a component and the second parameter is the state of the component as follows: (compName, {key: val, key: val}) If the first parameter is an object then the second parameter
         * is omitted. In this case the object must contain a component name and a state for the component as follows: ({compName: {val: key, val: key}}).
         * Given states are stored into this application instance state.
         * @param {string} refName 
         * @param {object} value 
         */
        mergeState(refName, value) {
            let newState = {};
            if(Util.isString(refName)) {
                newState[refName] = value;
            } else if(Util.isObject(refName)) {
                for(let p in refName) {
                    if(refName.hasOwnProperty(p))
                        newState[p] = refName[p]
                }
            }
            this.recursiveMergeState(this.state, newState);
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
                    else if(Util.isEmpty(oldMap[key]))
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