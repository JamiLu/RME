import Elem from '../elem';
import Tree from '../tree';
import Template from '../template';
import Util from '../util';

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
            if(!comp)
                throw "Cannot find a component: \""+name+"\"";
            if(!Util.isEmpty(props) && Util.isFunction(comp.update)) {
                let state = Util.isEmpty(props.key) ? name : `${name}${props.key}`
                props["ref"] = state;
                const newProps = comp.update.call()(state);
                const nextProps = {...props, ...newProps};
                if (!nextProps.shouldComponentUpdate || nextProps.shouldComponentUpdate(nextProps) !== false) {
                    props = this.extendProps(props, newProps);
                }
            }
            if(Util.isEmpty(props))
                props = {};
            if(!Util.isEmpty(props.onBeforeCreate) && Util.isFunction(props.onBeforeCreate))
                props.onBeforeCreate.call(props, props);
            let ret = comp.component.call(props, props);
            if(Template.isTemplate(ret))
                ret = Template.resolve(ret);
            if(!Util.isEmpty(props.onAfterCreate) && Util.isFunction(props.onAfterCreate))
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

export default RME;