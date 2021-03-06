"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var RME = function () {
  /**
   * RME stands for Rest Made Easy. This is a small easy to use library that enables you to create RESTfull webpages with ease and speed.
   * This library is free to use under the MIT License.
   * 
   * RME class is a core of the RME library. The RME class offers functionality to start a RME application, control components, external script files and rme storage.
   */
  var RME =
  /*#__PURE__*/
  function () {
    function RME() {
      _classCallCheck(this, RME);

      this.instance = this;

      this.completeRun = function () {};

      this.runner = function () {};

      this.onStorageChange = function (state) {};

      this.components = {};
      this.rmeState = {};
      this.router;
      this.messages;
      this.defaultApp;
    }

    _createClass(RME, [{
      key: "complete",
      value: function complete() {
        this.completeRun.call();
      }
    }, {
      key: "start",
      value: function start() {
        this.runner.call();
      }
    }, {
      key: "setComplete",
      value: function setComplete(runnable) {
        this.completeRun = runnable;
      }
    }, {
      key: "setRunner",
      value: function setRunner(runnable) {
        this.runner = runnable;
        return this.instance;
      }
    }, {
      key: "addComponent",
      value: function addComponent(runnable, props) {
        var comp;
        if (Util.isFunction(runnable)) comp = runnable.call();else if (Util.isObject(runnable)) comp = runnable;

        for (var p in comp) {
          if (comp.hasOwnProperty(p)) {
            this.components[p] = {
              component: comp[p],
              update: Util.isFunction(props) ? props : undefined
            };
          }
        }

        comp = null;
      }
    }, {
      key: "getComponent",
      value: function getComponent(name, props) {
        var comp = this.components[name];
        if (!comp) throw "Cannot find a component: \"" + name + "\"";

        if (!Util.isEmpty(props) && Util.isFunction(comp.update)) {
          var state = Util.isEmpty(props.key) ? name : "".concat(name).concat(props.key);
          props["ref"] = state;
          props = this.extendProps(props, comp.update.call()(state));
        }

        var ret = comp.component.call(props, props);
        if (Template.isTemplate(ret)) return Template.resolve(ret);else return ret;
      }
    }, {
      key: "extendProps",
      value: function extendProps(props, newProps) {
        if (!Util.isEmpty(newProps)) {
          for (var p in newProps) {
            if (newProps.hasOwnProperty(p)) {
              props[p] = newProps[p];
            }
          }
        }

        return props;
      }
    }, {
      key: "setRmeState",
      value: function setRmeState(key, value) {
        this.rmeState[key] = value;
        this.onStorageChange.call(this, this.rmeState);
      }
    }, {
      key: "getRmeState",
      value: function getRmeState(key) {
        return this.rmeState[key];
      }
    }, {
      key: "configure",
      value: function configure(config) {
        this.router = config.router;
        this.messages = config.messages;
        this.defaultApp = config.app;
        if (!Util.isEmpty(this.router)) this.router.setApp(this.defaultApp);
        if (!Util.isEmpty(this.messages)) this.messages.setApp(this.defaultApp);
        if (!Util.isEmpty(this.defaultApp)) this.defaultApp.setRouter(this.router);
      }
      /** 
       * Runs a runnable script immedeately. If multpile run functions are declared they will be invoked by the declaration order.
       */

    }], [{
      key: "run",
      value: function run(runnable) {
        if (runnable && Util.isFunction(runnable)) RME.getInstance().setRunner(runnable).start();
      }
      /**
       * Waits until body has been loaded and then runs a runnable script. 
       * If multiple ready functions are declared the latter one is invoked.
       */

    }, {
      key: "ready",
      value: function ready(runnable) {
        if (runnable && Util.isFunction(runnable)) RME.getInstance().setComplete(runnable);
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

    }, {
      key: "component",
      value: function component(runnable, props) {
        if (runnable && (Util.isFunction(runnable) || Util.isObject(runnable))) RME.getInstance().addComponent(runnable, props);else if (runnable && Util.isString(runnable)) return RME.getInstance().getComponent(runnable, props);
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

    }, {
      key: "storage",
      value: function storage(key, value) {
        if (!Util.isEmpty(key) && !Util.isEmpty(value)) RME.getInstance().setRmeState(key, value);else if (!Util.isEmpty(key) && Util.isEmpty(value)) return RME.getInstance().getRmeState(key);
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

    }, {
      key: "script",
      value: function script(source, id, type, text, defer, crossOrigin, charset, async) {
        if (!Util.isEmpty(source)) {
          var sc = new Elem("script").setSource(source);
          if (!Util.isEmpty(id)) sc.setId(id);
          if (!Util.isEmpty(type)) sc.setType(type);
          if (!Util.isEmpty(text)) sc.setText(text);
          if (!Util.isEmpty(defer)) sc.setAttribute("defer", defer);
          if (!Util.isEmpty(crossOrigin)) sc.setAttribute("crossOrigin", crossOrigin);
          if (!Util.isEmpty(charset)) sc.setAttribute("charset", charset);
          if (!Util.isEmpty(async)) sc.setAttribute("async", async);
          RME.addScript(sc);
        }
      }
      /**
       * This is called when ever a new data is saved into the RME instance storage.
       * Callback function has one paramater newState that is the latest snapshot of the 
       * current instance storage.
       * @param {function} listener 
       */

    }, {
      key: "onStorageChange",
      value: function onStorageChange(listener) {
        if (listener && Util.isFunction(listener)) RME.getInstance().onrmestoragechange = listener;
      }
      /**
       * Function checks if a component with the given name exists.
       * @param {string} name 
       * @returns True if the component exist otherwise false
       */

    }, {
      key: "hasComponent",
      value: function hasComponent(name) {
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

    }, {
      key: "use",
      value: function use(config) {
        RME.getInstance().configure(config);
      }
    }, {
      key: "addScript",
      value: function addScript(elem) {
        var scripts = Tree.getScripts();
        var lastScript = scripts[scripts.length - 1];
        lastScript.after(elem);
      }
    }, {
      key: "removeScript",
      value: function removeScript(sourceOrId) {
        if (sourceOrId.indexOf("#") === 0) {
          Tree.getHead().remove(Tree.get(sourceOrId));
        } else {
          var scripts = Tree.getScripts();

          for (var s in scripts) {
            if (scripts.hasOwnProperty(s)) {
              var src = !Util.isEmpty(scripts[s].getSource()) ? scripts[s].getSource() : "";

              if (src.search(sourceOrId) > -1 && src.search(sourceOrId) === src.length - sourceOrId.length) {
                Tree.getHead().remove(scripts[s]);
                break;
              }
            }
          }
        }
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (!this.instance) this.instance = new RME();
        return this.instance;
      }
    }]);

    return RME;
  }();

  document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") RME.getInstance().complete();
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
  };
}();

var App = function () {
  var App =
  /*#__PURE__*/
  function () {
    function App() {
      _classCallCheck(this, App);

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


    _createClass(App, null, [{
      key: "name",
      value: function name(_name) {
        App.init().name = App.checkName(_name);
        return App;
      }
      /**
       * Function will set a root for an application. If the root is not set then body is used by default.
       * @param {string} root 
       * @returns App.
       */

    }, {
      key: "root",
      value: function root(_root) {
        if (!Util.isEmpty(_root) && Util.isString(_root)) App.init().root = _root;
        return App;
      }
      /**
       * Function will check if a given name is empty or not. If the name is empty then a next available default name is returned.
       * @param {string} name 
       * @returns Checked name.
       */

    }, {
      key: "checkName",
      value: function checkName(name) {
        if (!Util.isEmpty(name)) {
          return App.init().prefix + name;
        } else {
          while (Util.isEmpty(App.init().name)) {
            name = App.init().prefix + App.init().seq;
            name = RME.storage(name);

            if (Util.isEmpty(name)) {
              App.init().name = App.init().prefix + App.init().seq;
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

    }, {
      key: "reset",
      value: function reset() {
        App.init().name = undefined;
        App.init().root = undefined;
        App.init().seq = 0;
      }
      /**
       * Function creates an application. The given parameter can either be a Template object or an Elem object. 
       * @param {object} object 
       * @returns Created application instance.
       */

    }, {
      key: "create",
      value: function create(object) {
        var name = !Util.isEmpty(App.init().name) ? App.init().name : App.checkName();
        var root = !Util.isEmpty(App.init().root) ? App.init().root : undefined;
        var app = new AppInstance(name, root, object);
        RME.storage(name, app);
        App.reset();
        return app;
      }
      /**
       * Gets Application instance by name. If the name is empty then default application instance is retrieved.
       * @param {string} name 
       * @returns Application instance.
       */

    }, {
      key: "get",
      value: function get(name) {
        if (Util.isEmpty(name)) return App.name(0).getInstance();else {
          var app = App.name(name).getInstance();
          if (Util.isEmpty(app)) throw "Could not find app with name: " + name;else return app;
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

    }, {
      key: "setState",
      value: function setState(refName, value) {
        return App.get().setState(refName, value);
      }
      /**
       * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is given. 
       * Otherwise whole default application state is given.
       * @param {string} refName 
       */

    }, {
      key: "getState",
      value: function getState(refName) {
        return App.get().getState(refName);
      }
      /**
       * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is checked.
       * Otherwised default application state is checked.
       * @param {string} refName 
       * @returns True if state empty otherwise false.
       */

    }, {
      key: "isStateEmpty",
      value: function isStateEmpty(refName) {
        return App.get().isStateEmpty(refName);
      }
      /**
       * Function takes two optional parameters. If refName is given then only a state of the component with the refName is cleared otherwise 
       * whole default application state is cleared. If update is given then after clearing the state the application is refreshed.
       * @param {string} refName 
       * @param {boolean} update 
       */

    }, {
      key: "clearState",
      value: function clearState(refName, update) {
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

    }, {
      key: "mergeState",
      value: function mergeState(key, value) {
        return App.get().mergeState(key, value);
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (Util.isEmpty(App.init().name)) throw "No App instance selected, invoke a function name() first";
        var app = RME.storage(App.init().name);
        App.reset();
        return app;
      }
      /**
       * Function creates a statefull component. The state of the component is stored in an application that this component is bound to.
       * @param {object} component 
       */

    }, {
      key: "component",
      value: function component(_component) {
        var bindState = function bindState(appName) {
          var updater = Util.isEmpty(appName) ? function () {
            return function (state) {
              return App.getState(state);
            };
          } : function () {
            return function (state) {
              return App.get(appName).getState(state);
            };
          };
          RME.component(_component, updater);
        };

        return bindState;
      }
    }, {
      key: "init",
      value: function init() {
        if (Util.isEmpty(this.self)) this.self = new App();
        return this.self;
      }
    }]);

    return App;
  }();

  var AppInstance =
  /*#__PURE__*/
  function () {
    function AppInstance(name, root, object) {
      _classCallCheck(this, AppInstance);

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

    _createClass(AppInstance, [{
      key: "bindReadyListener",
      value: function bindReadyListener(root) {
        var _this = this;

        if (document.readyState === "loading" || document.readyState === "interactive") {
          // DOMContentLoaded
          document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") _this.init(root);
          });
        } else {
          this.init(root);
        }
      }
      /**
       * Initialize the Application
       * @param {string} root 
       */

    }, {
      key: "init",
      value: function init(root) {
        this.root = Util.isEmpty(root) ? Tree.getBody() : Tree.getFirst(root);
        this.renderer = new Renderer(this.root);
        this.ready = true;
        this.refreshApp();
      }
    }, {
      key: "refreshApp",
      value: function refreshApp() {
        var _this2 = this;

        if (this.ready) {
          Util.setTimeout(function () {
            var freshStage = Template.isTemplate(_this2.rawStage) ? Template.resolve(_this2.rawStage) : _this2.rawStage;

            if (!Util.isEmpty(_this2.router)) {
              var state = _this2.router.getCurrentState();

              if (!Util.isEmpty(state.current)) {
                var selector = state.root;
                var element = state.current;
                freshStage.getFirst(selector).append(element);
              }
            }

            if (_this2.oldStage.toString() !== freshStage.toString()) {
              _this2.oldStage = _this2.renderer.merge(_this2.oldStage, freshStage);
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

    }, {
      key: "setState",
      value: function setState(refName, value) {
        if (Util.isString(refName)) {
          this.state[refName] = value;
          this.refreshApp();
        } else if (Util.isObject(refName)) {
          for (var p in refName) {
            if (refName.hasOwnProperty(p)) this.state[p] = refName[p];
          }

          this.refreshApp();
        }
      }
      /**
       * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is given. 
       * Otherwise whole application state of this application instance is given.
       * @param {string} refName 
       */

    }, {
      key: "getState",
      value: function getState(refName) {
        if (Util.isString(refName)) {
          return !Util.isEmpty(this.state[refName]) ? this.state[refName] : {};
        } else if (Util.isEmpty(refName)) {
          return this.state;
        }
      }
      /**
       * Function takes one optional parameter. If refName is given then only a state of a component referred by the refName is checked.
       * Otherwise whole application state of this application instance is checked.
       * @param {string} refName 
       * @returns True if state empty otherwise false.
       */

    }, {
      key: "isStateEmpty",
      value: function isStateEmpty(refName) {
        if (Util.isEmpty(refName)) return this.recursiveCheckMapIsEmpty(this.state);else return this.recursiveCheckMapIsEmpty(this.state[refName]);
      }
    }, {
      key: "recursiveCheckMapIsEmpty",
      value: function recursiveCheckMapIsEmpty(map) {
        for (var key in map) {
          if (map.hasOwnProperty(key)) {
            if (!Util.isEmpty(map[key])) return false;
            if (Util.isObject(map[key])) this.recursiveCheckMapIsEmpty(map[key]);
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

    }, {
      key: "clearState",
      value: function clearState(refName, update) {
        if (Util.isEmpty(refName)) this.recursiveClearMap(this.state);else this.recursiveClearMap(this.state[refName]);

        if (Util.isBoolean(update) && update === true) {
          this.refreshApp();
        }
      }
    }, {
      key: "recursiveClearMap",
      value: function recursiveClearMap(map) {
        for (var key in map) {
          if (map.hasOwnProperty(key)) {
            if (Util.isString(map[key])) map[key] = "";else if (Util.isArray(map[key])) map[key] = [];else if (Util.isObject(map[key])) this.recursiveClearMap(map[key]);
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

    }, {
      key: "mergeState",
      value: function mergeState(refName, value) {
        var newState = {};

        if (Util.isString(refName)) {
          newState[refName] = value;
        } else if (Util.isObject(refName)) {
          for (var p in refName) {
            if (refName.hasOwnProperty(p)) newState[p] = refName[p];
          }
        }

        this.recursiveMergeState(this.state, newState);
        this.refreshApp();
      }
    }, {
      key: "recursiveMergeState",
      value: function recursiveMergeState(oldMap, newMap) {
        for (var key in newMap) {
          if (newMap.hasOwnProperty(key)) {
            if (Util.isArray(oldMap[key]) && !Util.isArray(newMap[key])) oldMap[key].push(newMap[key]);else if (Util.isArray(oldMap[key]) && Util.isArray(newMap[key])) oldMap[key] = oldMap[key].concat(newMap[key]);else if (Util.isObject(oldMap[key]) && Util.isObject(newMap[key])) this.recursiveMergeState(oldMap[key], newMap[key]);else if (Util.isEmpty(oldMap[key])) oldMap[key] = newMap[key];
          }
        }
      }
    }, {
      key: "setRouter",
      value: function setRouter(router) {
        this.router = router;
      }
    }]);

    return AppInstance;
  }();

  var Renderer =
  /*#__PURE__*/
  function () {
    function Renderer(root) {
      _classCallCheck(this, Renderer);

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


    _createClass(Renderer, [{
      key: "merge",
      value: function merge(oldStage, newStage) {
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

    }, {
      key: "render",
      value: function render(parent, oldNode, newNode, index) {
        if (!oldNode && newNode) {
          parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
          this.tobeRemoved.push({
            parent: parent,
            child: this.wrap(parent.dom().children[index])
          });
        } else if (this.hasNodeChanged(oldNode, newNode)) {
          if (this.isValueElem(newNode.getTagName()) && this.comparePropsWithoutValue(oldNode, newNode)) oldNode.setValue(newNode.getValue());else this.wrap(parent.dom().children[index]).replace(newNode.duplicate());
        } else {
          var i = 0;
          var oldLength = oldNode ? oldNode.dom().children.length : 0;
          var newLength = newNode ? newNode.dom().children.length : 0;

          while (i < newLength || i < oldLength) {
            this.render(this.wrap(parent.dom().children[index]), oldNode ? this.wrap(oldNode.dom().children[i]) : null, newNode ? this.wrap(newNode.dom().children[i]) : null, i);
            i++;
          }
        }
      }
      /**
       * Function removes all the marked as to be removed elements which did not come in the new stage by starting from the last to the first.
       */

    }, {
      key: "removeToBeRemoved",
      value: function removeToBeRemoved() {
        if (this.tobeRemoved.length > 0) {
          var lastIdx = this.tobeRemoved.length - 1;

          while (lastIdx >= 0) {
            this.tobeRemoved[lastIdx].parent.remove(this.tobeRemoved[lastIdx].child);
            lastIdx--;
          }

          this.tobeRemoved = [];
        }
      }
      /**
       * Function takes two Elem objects as parameter and compares them if they are equal or have some properties changed ignoring a value attribute.
       * @param {object} oldNode 
       * @param {object} newNode 
       * @returns True if the given Elem objects are the same and nothing is changed otherwise false is returned.
       */

    }, {
      key: "comparePropsWithoutValue",
      value: function comparePropsWithoutValue(oldNode, newNode) {
        var o = oldNode.getProps();
        var n = newNode.getProps();
        o.value = "";
        n.value = "";
        return JSON.stringify(o) === JSON.stringify(n);
      }
      /**
       * Function takes two Elem objects as parameter and compares them if they are equal or have some properties changed.
       * @param {object} oldNode 
       * @param {object} newNode 
       * @returns True if the given Elem objects are the same and nothing is changed otherwise false is returned.
       */

    }, {
      key: "hasNodeChanged",
      value: function hasNodeChanged(oldNode, newNode) {
        return !Util.isEmpty(oldNode) && !Util.isEmpty(newNode) && (oldNode.getTagName() !== newNode.getTagName() || oldNode.getProps(true) !== newNode.getProps(true));
      }
      /**
       * Function takes DOM node as a parameter and wraps it to Elem object.
       * @param {object} node 
       * @returns the Wrapped Elem object.
       */

    }, {
      key: "wrap",
      value: function wrap(node) {
        if (!Util.isEmpty(node)) return Elem.wrap(node);
      }
      /**
       * Function takes an element tag string and compares it to other elements that have a value attribute. If the given tag is a tag of the element that has the tag attribute
       * true is returned otherwise false will be returned.
       * @param {string} tag 
       * @returns True if the give tag is an element that has a value attribute otherwise false is returned.
       */

    }, {
      key: "isValueElem",
      value: function isValueElem(tag) {
        tag = tag.toLowerCase();
        return tag === "button" || tag === "input" || tag === "li" || tag === "option" || tag === "meter" || tag === "progress" || tag === "param";
      }
    }]);

    return Renderer;
  }();

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
    mergeState: App.mergeState
  };
}();

var Http = function () {
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
  var Http =
  /*#__PURE__*/
  function () {
    function Http(config) {
      _classCallCheck(this, Http);

      config.contentType = config.contentType === undefined ? Http.JSON : config.contentType;

      if (config.useFetch) {
        this.self = new FetchRequest();
      } else if (window.Promise) {
        this.self = new PromiseAjax(config).instance();
      } else {
        this.self = new Ajax(config);
      }
    }

    _createClass(Http, [{
      key: "instance",
      value: function instance() {
        return this.self;
      }
      /**
       * Do GET XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
       * @param {string} url *Required
       * @param {string} requestContentType 
       */

    }], [{
      key: "get",
      value: function get(url, requestContentType) {
        return new Http({
          method: "GET",
          url: url,
          data: undefined,
          contentType: requestContentType
        }).instance();
      }
      /**
       * Do POST XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
       * @param {string} url *Required
       * @param {*} data 
       * @param {string} requestContentType 
       */

    }, {
      key: "post",
      value: function post(url, data, requestContentType) {
        return new Http({
          method: "POST",
          url: url,
          data: data,
          contentType: requestContentType
        }).instance();
      }
      /**
       * Do PUT XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
       * @param {string} url *Required
       * @param {*} data 
       * @param {string} requestContentType 
       */

    }, {
      key: "put",
      value: function put(url, data, requestContentType) {
        return new Http({
          method: "PUT",
          url: url,
          data: data,
          contentType: requestContentType
        }).instance();
      }
      /**
       * Do DELETE XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
       * @param {string} url *Required
       * @param {*} requestContentType 
       */

    }, {
      key: "delete",
      value: function _delete(url, requestContentType) {
        return new Http({
          method: "DELETE",
          url: url,
          data: undefined,
          contentType: requestContentType
        }).instance();
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

    }, {
      key: "do",
      value: function _do(config) {
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

    }, {
      key: "fetch",
      value: function fetch() {
        return new Http({
          useFetch: true
        }).instance();
      }
    }]);

    return Http;
  }();
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

  var Ajax =
  /*#__PURE__*/
  function () {
    function Ajax(config) {
      _classCallCheck(this, Ajax);

      this.progressHandler = config.onProgress ? config.onProgress : function (event) {};
      this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
      this.xhr = new XMLHttpRequest();
      this.xhr.open(config.method, config.url);
      if (config.contentType) this.xhr.setRequestHeader("Content-Type", config.contentType);
      if (config.headers) setXhrHeaders(this.xhr, config.headers);
    }

    _createClass(Ajax, [{
      key: "then",
      value: function then(successHandler, errorHandler) {
        var _this3 = this;

        this.xhr.onload = function () {
          _this3.xhr.responseJSON = tryParseJSON(_this3.xhr.responseText);
          isResponseOK(_this3.xhr.status) ? successHandler(resolveResponse(_this3.xhr.response), _this3.xhr) : errorHandler(_this3.xhr);
        };

        this.xhr.onprogress = function (event) {
          if (_this3.progressHandler) _this3.progressHandler(event);
        };

        if (this.xhr.ontimeout && config.onTimeout) {
          this.xhr.ontimeout = function (event) {
            config.onTimeout(event);
          };
        }

        this.xhr.onerror = function () {
          _this3.xhr.responseJSON = tryParseJSON(_this3.xhr.responseText);
          if (errorHandler) errorHandler(_this3.xhr);
        };

        this.data ? this.xhr.send(this.data) : this.xhr.send();
        return this;
      }
    }, {
      key: "catch",
      value: function _catch(errorHandler) {
        var _this4 = this;

        this.xhr.onerror = function () {
          _this4.xhr.responseJSON = tryParseJSON(_this4.xhr.responrenderseText);
          if (errorHandler) errorHandler(_this4.xhr);
        };
      }
    }]);

    return Ajax;
  }();
  /**
   * XMLHttpRequest using the Promise.
   */


  var PromiseAjax =
  /*#__PURE__*/
  function () {
    function PromiseAjax(config) {
      var _this5 = this;

      _classCallCheck(this, PromiseAjax);

      this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
      this.promise = new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open(config.method, config.url);
        if (config.contentType) request.setRequestHeader("Content-Type", config.contentType);
        if (config.headers) setXhrHeaders(request, config.headers);

        request.onload = function () {
          request.responseJSON = tryParseJSON(request.responseText);
          isResponseOK(request.status) ? resolve(resolveResponse(request.response)) : reject(request);
        };

        if (request.ontimeout && config.onTimeout) {
          request.ontimeout = function (event) {
            config.onTimeout(event);
          };
        }

        request.onprogress = function (event) {
          if (config.onProgress) config.onProgress(event);
        };

        request.onerror = function () {
          request.responseJSON = tryParseJSON(request.responseText);
          reject(request);
        };

        _this5.data ? request.send(_this5.data) : request.send();
      });
    }

    _createClass(PromiseAjax, [{
      key: "instance",
      value: function instance() {
        return this.promise;
      }
    }]);

    return PromiseAjax;
  }();
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


  var FetchRequest =
  /*#__PURE__*/
  function () {
    function FetchRequest() {
      _classCallCheck(this, FetchRequest);
    }
    /**
     * Does Fetch GET request. Content-Type JSON is used by default.
     * @param {stirng} url *Required
     * @param {*} init 
     */


    _createClass(FetchRequest, [{
      key: "get",
      value: function get(url, init) {
        if (!init) init = {};
        init.method = "GET";
        return this.do({
          url: url,
          init: init,
          contentType: Http.JSON
        });
      }
      /**
       * Does Fetch POST request. Content-Type JSON is used by default.
       * @param {string} url *Required
       * @param {*} body 
       * @param {*} init 
       */

    }, {
      key: "post",
      value: function post(url, body, init) {
        if (!init) init = {};
        init.method = "POST";
        init.body = body;
        return this.do({
          url: url,
          init: init,
          contentType: Http.JSON
        });
      }
      /**
       * Does Fetch PUT request. Content-Type JSON is used by default.
       * @param {string} url *Required
       * @param {*} body 
       * @param {*} init 
       */

    }, {
      key: "put",
      value: function put(url, body, init) {
        if (!init) init = {};
        init.method = "PUT";
        init.body = body;
        return this.do({
          url: url,
          init: init,
          contentType: Http.JSON
        });
      }
      /**
       * Does Fetch DELETE request. Content-Type JSON is used by default.
       * @param {string} url 
       * @param {*} init 
       */

    }, {
      key: "delete",
      value: function _delete(url, init) {
        if (!init) init = {};
        init.method = "DELETE";
        return this.do({
          url: url,
          init: init,
          contentType: Http.JSON
        });
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

    }, {
      key: "do",
      value: function _do(config) {
        if (!config.init) config.init = {};

        if (config.contentType) {
          if (!config.init.headers) config.init.headers = new Headers({});
          if (!config.init.headers.has("Content-Type")) config.init.headers.set("Content-Type", config.contentType);
        }

        if (config.method) {
          config.init.method = config.method;
        }

        return fetch(config.url, config.init);
      }
    }]);

    return FetchRequest;
  }();

  var resolveResponse = function resolveResponse(response) {
    var resp = tryParseJSON(response);
    if (Util.isEmpty(resp)) resp = response;
    return resp;
  };

  function setXhrHeaders(xhr, headers) {
    for (var header in headers) {
      if (headers.hasOwnProperty(header)) xhr.setRequestHeader(header, headers[header]);
    }
  }

  function isResponseOK(status) {
    var okResponses = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
    var i = 0;

    while (i < okResponses.length) {
      if (okResponses[i] === status) return true;
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
    } catch (e) {}
  }

  return Http;
}();

var Elem = function () {
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
  var Elem =
  /*#__PURE__*/
  function () {
    function Elem(type) {
      _classCallCheck(this, Elem);

      if (Util.isString(type)) {
        this.html = document.createElement(type);
      } else if (type.nodeType !== undefined && type.ownerDocument !== undefined && type.nodeType >= 1 && type.ownerDocument instanceof HTMLDocument) {
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


    _createClass(Elem, [{
      key: "setText",
      value: function setText(text) {
        if (this.html.hasChildNodes()) {
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

    }, {
      key: "getText",
      value: function getText() {
        var text = "";
        this.html.childNodes.forEach(function (node) {
          if (node.nodeType === 3) {
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

    }, {
      key: "getContent",
      value: function getContent() {
        return this.html.innerHTML;
      }
      /**
       * Set content that can be text or html.
       * 
       * @param {String} html 
       * @returns Elem instance.
       */

    }, {
      key: "setContent",
      value: function setContent(html) {
        this.html.innerHTML = html;
        return this;
      }
      /**
       * Set value of this element.
       * 
       * @param {String} value 
       * @returns Elem instance.
       */

    }, {
      key: "setValue",
      value: function setValue(value) {
        this.html.value = value;
        return this;
      }
      /**
       * Get value of this element.
       * 
       * @returns value of this element.
       */

    }, {
      key: "getValue",
      value: function getValue() {
        return this.html.value;
      }
      /**
       * Set id of this element.
       * 
       * @param {String} id 
       * @returns Elem instance.
       */

    }, {
      key: "setId",
      value: function setId(id) {
        this.html.id = id;
        return this;
      }
      /**
       * Get id of this element.
       * 
       * @returns id of this element.
       */

    }, {
      key: "getId",
      value: function getId() {
        return this.html.id;
      }
      /**
       * Append an element inside this element.
       * 
       * @param {Elem} elem 
       * @returns Elem instance.
       */

    }, {
      key: "append",
      value: function append(elem) {
        this.html.appendChild(Template.isTemplate(elem) ? Template.resolve(elem).dom() : elem.dom());
        return this;
      }
      /**
       * Remove an element from this element.
       * 
       * @param {Elem} elem 
       * @returns Elem isntance.
       */

    }, {
      key: "remove",
      value: function remove(elem) {
        this.html.removeChild(elem.dom());
        return this;
      }
      /**
       * Replace this element with a new element.
       * 
       * @param {Elem} newElem 
       * @returns Elem instance.
       */

    }, {
      key: "replace",
      value: function replace(newElem) {
        this.html.parentElement.replaceChild(newElem.dom(), this.html);
        return this;
      }
      /**
       * Insert a new element before this element.
       * 
       * @param {Elem} newElem 
       * @returns Elem instance.
       */

    }, {
      key: "before",
      value: function before(newElem) {
        this.html.parentElement.insertBefore(newElem.dom(), this.html);
        return this;
      }
      /**
       * Insert a new elem after this element.
       * 
       * @param {Elem} newElem 
       * @returns Elem isntance.
       */

    }, {
      key: "after",
      value: function after(newElem) {
        if (this.html.nextElementSibling !== null) this.html.parentElement.insertBefore(newElem.dom(), this.html.nextElementSibling);else this.html.parentElement.appendChild(newElem.dom());
        return this;
      }
      /**
       * @returns String presentation of this component.
       */

    }, {
      key: "toString",
      value: function toString() {
        return "<" + this.getTagName().toLowerCase() + ">" + this.getContent() + "</" + this.getTagName().toLowerCase() + ">";
      }
      /**
       * Converts this Elem object to JSON template object.
       * @param {boolean} deep default true if true children will also be templated.
       * @returns Template representation of the element tree.
       */

    }, {
      key: "toTemplate",
      value: function toTemplate(deep) {
        return Templater.toTemplate(this, deep);
      }
      /**
       * Returns properties of an Elem in an object. If a boolean json is true
       * then the returned object is returned as JSON string.
       * @param {boolean} json 
       * @returns Properties of the elem in the properties object.
       */

    }, {
      key: "getProps",
      value: function getProps(json) {
        if (Util.isBoolean(json) && json === true) return JSON.stringify(Templater.getElementProps(this));else return Templater.getElementProps(this);
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

    }, {
      key: "render",
      value: function render() {
        var newState = [];
        var i = 0;
        var max = arguments.length;

        while (i < max) {
          if (Util.isArray(i < 0 || arguments.length <= i ? undefined : arguments[i])) newState = newState.concat(i < 0 || arguments.length <= i ? undefined : arguments[i]);else newState.push(i < 0 || arguments.length <= i ? undefined : arguments[i]);
          i++;
        }

        if (!RenderHelper.isNewStateEqualToPrevState(newState)) {
          RenderHelper.setPrevState(null);

          while (this.html.firstChild) {
            this.html.removeChild(this.html.firstChild);
          }

          i = 0;
          max = newState.length;

          while (i < max) {
            if (!Util.isEmpty(newState[i])) this.append(newState[i]);
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

    }, {
      key: "getChildren",
      value: function getChildren() {
        return Elem.wrapElems(this.html.children);
      }
      /**
       * Uses CSS selector to find all matching child elements in this Element. Found elements will be wrapped in an Elem instance.
       * @param {string} selector 
       * @returns An array of Elem instances or a single Elem instance.
       */

    }, {
      key: "get",
      value: function get(selector) {
        return Elem.wrapElems(this.html.querySelectorAll(selector));
      }
      /**
       * Uses CSS selector to find the first match child element in this Element.
       * Found element will be wrapped in an Elem instance.
       * @param {string} selector 
       * @returns An Elem instance.
       */

    }, {
      key: "getFirst",
      value: function getFirst(selector) {
        return Elem.wrap(this.html.querySelector(selector));
      }
      /**
       * Uses a HTML Document tag name to find matching elements in this Element e.g. div, span, p.
       * Found elements will be wrapped in an Elem instance.
       * If found many then an array of Elem instanes are returned otherwise a single Elem instance.
       * @param {string} tag 
       * @returns An array of Elem instances or a single Elem instance.
       */

    }, {
      key: "getByTag",
      value: function getByTag(tag) {
        return Elem.wrapElems(this.html.getElementsByTagName(tag));
      }
      /**
       * Uses a HTML Document element class string to find matching elements in this Element e.g. "main emphasize-green".
       * Method will try to find elements having any of the given classes. Found elements will be wrapped in an Elem instance.
       * If found many then an array of Elem instances are returned otherwise a single Elem instance.
       * @param {string} classname 
       * @returns An array of Elem instances or a single Elem instance.
       */

    }, {
      key: "getByClass",
      value: function getByClass(classname) {
        return Elem.wrapElems(this.html.getElementsByClassName(classname));
      }
      /**
       * Set a title of this element.
       * 
       * @param {String} text 
       * @returns Elem instance.
       */

    }, {
      key: "setTitle",
      value: function setTitle(text) {
        this.html.title = text;
        return this;
      }
      /**
       * Get a title of this element.
       * 
       * @returns The title of this element.
       */

    }, {
      key: "getTitle",
      value: function getTitle() {
        return this.html.title;
      }
      /**
       * Set a tab index of this element.
       * 
       * @param {Number} idx 
       * @returns Elem instance.
       */

    }, {
      key: "setTabIndex",
      value: function setTabIndex(idx) {
        this.html.tabIndex = idx;
        return this;
      }
      /**
       * Get a tab index of this element.
       * 
       * @returns A tab index value of this element.
       */

    }, {
      key: "getTabIndex",
      value: function getTabIndex() {
        return this.html.tabIndex;
      }
      /**
       * Get a tag name of this element.
       * 
       * @returns A tag name of this element.
       */

    }, {
      key: "getTagName",
      value: function getTagName() {
        return this.html.tagName;
      }
      /**
       * Set an attribute of this element.
       * 
       * @param {String} attr Attribute
       * @param {String} value Value
       * @returns Elem isntance.
       */

    }, {
      key: "setAttribute",
      value: function setAttribute(attr, value) {
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

    }, {
      key: "getAttribute",
      value: function getAttribute(attr) {
        return this.html.getAttributeNode(attr);
      }
      /**
       * Removes an attribute of this element.
       * 
       * @param {String} attr 
       * @returns Elem instance.
       */

    }, {
      key: "removeAttribute",
      value: function removeAttribute(attr) {
        this.html.removeAttributeNode(this.getAttribute(attr));
        return this;
      }
      /**
       * Set a name of this element.
       * 
       * @param {String} name 
       * @returns Elem instance.
       */

    }, {
      key: "setName",
      value: function setName(name) {
        this.setAttribute("name", name);
        return this;
      }
      /**
       * Get a name of this element.
       * 
       * @returns name string of this element.
       */

    }, {
      key: "getName",
      value: function getName() {
        return this.getAttribute("name").value;
      }
      /**
       * Set a type of this element.
       * 
       * @param {String} type 
       * @returns Elem instance.
       */

    }, {
      key: "setType",
      value: function setType(type) {
        this.setAttribute("type", type);
        return this;
      }
      /**
       * Get a type of this element.
       * 
       * @returns type string of this element.
       */

    }, {
      key: "getType",
      value: function getType() {
        return this.getAttribute("type").value;
      }
      /**
       * Set a source of this element.
       * 
       * @param {String} source 
       * @returns Elem instance.
       */

    }, {
      key: "setSource",
      value: function setSource(source) {
        this.setAttribute("src", source);
        return this;
      }
      /**
       * Get a source of this element.
       * 
       * @returns source string of this element.
       */

    }, {
      key: "getSource",
      value: function getSource() {
        return this.getAttribute("src").value;
      }
      /**
       * Set a href of this element.
       * 
       * @param {String} href 
       * @returns Elem instance.
       */

    }, {
      key: "setHref",
      value: function setHref(href) {
        this.setAttribute("href", href);
        return this;
      }
      /**
       * Get a href of this element.
       * 
       * @returns href of this element.
       */

    }, {
      key: "getHref",
      value: function getHref() {
        return this.getAttribute("href").value;
      }
      /**
       * Set a placeholder of this element.
       * 
       * @param {String} placeholder 
       * @returns Elem instance.
       */

    }, {
      key: "setPlaceholder",
      value: function setPlaceholder(placeholder) {
        this.setAttribute("placeholder", placeholder);
        return this;
      }
      /**
       * Get a placeholder of this element.
       * 
       * @returns placeholder of this element.
       */

    }, {
      key: "getPlaceholder",
      value: function getPlaceholder() {
        return this.getAttribute("placeholder").value;
      }
      /**
       * Sets size of this element.
       * 
       * @param {*} size 
       * @returns Elem instance.
       */

    }, {
      key: "setSize",
      value: function setSize(size) {
        this.setAttribute("size", size);
        return this;
      }
      /**
       * Get size of this element.
       * 
       * @returns size of this element.
       */

    }, {
      key: "getSize",
      value: function getSize() {
        return this.getAttribute("size").value;
      }
      /**
       * Set maximum length of an input field.
       * @param {number} length 
       * @returns Elem instance.
       */

    }, {
      key: "setMaxLength",
      value: function setMaxLength(length) {
        this.html.maxLength = length;
        return this;
      }
      /**
       * @returns Max length of this element.
       */

    }, {
      key: "getMaxLength",
      value: function getMaxLength() {
        return this.html.maxLength;
      }
      /**
       * Set minimum length of an input field.
       * @param {number} length 
       * @returns Elem instance.
       */

    }, {
      key: "setMinLength",
      value: function setMinLength(length) {
        this.html.minLength = length;
        return this;
      }
      /**
       * @returns Min lenght of this element.
       */

    }, {
      key: "getMinLength",
      value: function getMinLength() {
        return this.html.minLength;
      }
      /**
       * Set data to be stored into this dom element by a given key.
       * @param {string} key 
       * @param {*} value 
       * @returns Elem instance.
       */

    }, {
      key: "setData",
      value: function setData(key, value) {
        this.html.dataset[key] = value;
        return this;
      }
      /**
       * Get data by a given key from this dom element.
       * @param {string} key 
       * @returns Retrieved data.
       */

    }, {
      key: "getData",
      value: function getData(key) {
        return this.html.dataset[key];
      }
      /**
       * Set this element content editable.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setEditable",
      value: function setEditable(boolean) {
        this.setAttribute("contenteditable", boolean);
        return this;
      }
      /**
       * Get this element content editable.
       * 
       * @returns content editable state of this element.
       */

    }, {
      key: "getEditable",
      value: function getEditable() {
        return this.getAttribute("contenteditable").value;
      }
      /**
       * Set this element disabled.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setDisabled",
      value: function setDisabled(boolean) {
        this.html.disabled = boolean;
        return this;
      }
      /**
       * Get this element disabled state.
       * 
       * @returns disabled state of this element.
       */

    }, {
      key: "getDisabled",
      value: function getDisabled() {
        return this.html.disabled;
      }
      /**
       * Set this element checked.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setChecked",
      value: function setChecked(boolean) {
        this.html.checked = boolean;
        return this;
      }
      /**
       * Get this element checked state.
       * 
       * @returns checked state of this element.
       */

    }, {
      key: "getChecked",
      value: function getChecked() {
        return this.html.checked;
      }
      /**
       * Add classes to this element.
       * 
       * @param {String} classes 
       * @returns Elem instance.
       */

    }, {
      key: "addClasses",
      value: function addClasses(classes) {
        var toAdd = classes.trim().split(" ");
        var origClass = " ".concat(this.getClasses(), " ");
        var i = 0;

        while (i < toAdd.length) {
          var clazz = toAdd[i];
          if (origClass.match(" ".concat(clazz, " ")) === null) origClass += " " + clazz;
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

    }, {
      key: "removeClasses",
      value: function removeClasses(classes) {
        var toRm = classes.trim().split(" ");
        var origClass = "".concat(this.getClasses());
        var i = 0;

        while (i < toRm.length) {
          var clazz = toRm[i];
          if (origClass.match("".concat(clazz)) !== null) origClass = origClass.replace(clazz, "").trim();
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

    }, {
      key: "toggleClasses",
      value: function toggleClasses(classes) {
        var cArr = classes.split(" ");
        var origClass = "".concat(this.getClasses());
        var toAdd = "";
        var toRm = "";
        var i = 0;

        while (i < cArr.length) {
          if (origClass.match("".concat(cArr[i])) !== null) toRm += " " + cArr[i];else toAdd += " " + cArr[i];
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

    }, {
      key: "getClasses",
      value: function getClasses() {
        return this.html.className;
      }
      /**
       * Set styles of this element in camelCase in the JSON notation e.g. {height: "10px", maxHeight: "30px",...}
       * 
       * @param {Object} styleMap 
       * @returns Elem instance.
       */

    }, {
      key: "setStyles",
      value: function setStyles(styleMap) {
        for (var style in styleMap) {
          if (styleMap.hasOwnProperty(style)) this.html.style[style] = styleMap[style];
        }

        return this;
      }
      /**
       * Get style of this element. 
       * 
       * @param {String} styleName Style name in camelCase if necessary e.g. maxHeight
       * @returns value of the given style of this element.
       */

    }, {
      key: "getStyle",
      value: function getStyle(styleName) {
        return this.html.style[styleName];
      }
      /**
       * Set visibility of this element hidden or visible.
       * true = visible, false = hidden
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setVisible",
      value: function setVisible(boolean) {
        this.html.style.visibility = boolean ? "" : "hidden";
        return this;
      }
      /**
       * Set display state of this element initial or none.
       * true = initial, false = none
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "display",
      value: function display(boolean) {
        this.html.style.display = boolean ? "" : "none";
        return this;
      }
      /**
       * Set this element draggable.
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setDraggable",
      value: function setDraggable(boolean) {
        this.setAttribute("draggable", boolean);
        return this;
      }
      /**
       * Set translated text of this element.
       * @param {string} message 
       * @param {*} params 
       */

    }, {
      key: "message",
      value: function message(_message) {
        var i = 0;
        var paramArray = [];

        while (i < (arguments.length <= 1 ? 0 : arguments.length - 1)) {
          if (Util.isArray(i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1])) paramArray = paramArray.concat(i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);else paramArray.push(i + 1 < 1 || arguments.length <= i + 1 ? undefined : arguments[i + 1]);
          i++;
        }

        paramArray.push(this);
        this.setText(Messages.message(_message, paramArray));
        return this;
      }
      /**
       * Do click on this element.
       * @returns Elem instance.
       */

    }, {
      key: "click",
      value: function click() {
        var _this6 = this;

        Util.setTimeout(function () {
          return _this6.html.click();
        });
        return this;
      }
      /**
       * Do focus on this element.
       * @returns Elem instance.
       */

    }, {
      key: "focus",
      value: function focus() {
        var _this7 = this;

        Util.setTimeout(function () {
          return _this7.html.focus();
        });
        return this;
      }
      /**
       * Do blur on this element.
       * @returns Elem instance.
       */

    }, {
      key: "blur",
      value: function blur() {
        var _this8 = this;

        Util.setTimeout(function () {
          return _this8.html.blur();
        });
        return this;
      }
      /**
       * Clones this element and child elements if deep true. Returned clone will be wrapped in Elem instance.
       * 
       * @param {boolean} deep if true children will be cloned too.
       * @returns a clone of this element wrapped in Elem instance. If deep is true children will be cloned also.
       */

    }, {
      key: "clone",
      value: function clone(deep) {
        return Elem.wrap(this.html.cloneNode(deep));
      }
      /**
       * @returns HTML Document Element that this element contains.
       */

    }, {
      key: "dom",
      value: function dom() {
        return this.html;
      }
      /**
       * @returns A duplicated Elem object
       */

    }, {
      key: "duplicate",
      value: function duplicate() {
        return Template.resolve(this.toTemplate());
      }
      /**
       * @returns height of this element.
       */

    }, {
      key: "height",
      value: function height() {
        return this.html.height;
      }
      /**
       * @returns width of this element.
       */

    }, {
      key: "width",
      value: function width() {
        return this.html.width;
      }
      /**
       * @returns position from top relative to offsetParent.
       */

    }, {
      key: "top",
      value: function top() {
        return this.html.offsetTop;
      }
      /**
       * @returns position from left relative to offsetParent.
       */

    }, {
      key: "left",
      value: function left() {
        return this.html.offsetLeft;
      }
      /**
       * @returns a parent of this element wrapped in Elem instance or null if no parent.
       */

    }, {
      key: "parent",
      value: function parent() {
        return this.html.parentElement !== null ? Elem.wrap(this.html.parentElement) : null;
      }
      /**
       * @returns a next element of this element wrapped in Elem instance or null if no next.
       */

    }, {
      key: "next",
      value: function next() {
        return this.html.nextElementSibling !== null ? Elem.wrap(this.html.nextElementSibling) : null;
      }
      /**
       * @returns a previous element of this element wrapped in Elem instance or null if no previous.
       */

    }, {
      key: "previous",
      value: function previous() {
        return this.html.previousElementSibling !== null ? Elem.wrap(this.html.previousElementSibling) : null;
      }
      /**
       * @returns a first child element of this element wrapped in Elem instance or null if no children.
       */

    }, {
      key: "getFirstChild",
      value: function getFirstChild() {
        return this.html.firstElementChild !== null ? Elem.wrap(this.html.firstElementChild) : null;
      }
      /**
       * @returns a last child element of this element wrapped in Elem instance or null if no children.
       */

    }, {
      key: "getLastChild",
      value: function getLastChild() {
        return this.html.lastElementChild !== null ? Elem.wrap(this.html.lastElementChild) : null;
      }
      /**
       * Method does es5 standard extension to an element. This method can be used to add additional functionality
       * to this element. Method returns the given child reference.
       * @param {object} child 
       * @returns child instance.
       */

    }, {
      key: "extend",
      value: function extend(child) {
        child.prototype = this;
        child.prototype.constructor = child;
        return child;
      } //EVENTS BELOW
      //Animation events

    }, {
      key: "onAnimationStart",
      value: function onAnimationStart(handler) {
        this.html.onanimationstart = handler;
        return this;
      }
    }, {
      key: "onAnimationIteration",
      value: function onAnimationIteration(handler) {
        this.html.onanimationiteration = handler;
        return this;
      }
    }, {
      key: "onAnimationEnd",
      value: function onAnimationEnd(handler) {
        this.html.onanimationend = handler;
        return this;
      }
    }, {
      key: "onTransitionEnd",
      value: function onTransitionEnd(handler) {
        this.html.ontransitionend = handler;
        return this;
      } //Drag events

      /**
       * Adds onDrag listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDrag",
      value: function onDrag(handler) {
        this.html.ondrag = handler;
        return this;
      }
      /**
       * Adds onDragEnd listener to this element.
       * @param {function} handler 
       * @return Elem instance.
       */

    }, {
      key: "onDragEnd",
      value: function onDragEnd(handler) {
        this.html.ondragend = handler;
        return this;
      }
      /**
       * Adds onDragEnter listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDragEnter",
      value: function onDragEnter(handler) {
        this.html.ondragenter = handler;
        return this;
      }
      /**
       * Adds onDragOver listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDragOver",
      value: function onDragOver(handler) {
        this.html.ondragover = handler;
        return this;
      }
      /**
       * Adds onDragStart listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDragStart",
      value: function onDragStart(handler) {
        this.html.ondragstart = handler;
        return this;
      }
      /**
       * Adds onDrop listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDrop",
      value: function onDrop(handler) {
        this.html.ondrop = handler;
        return this;
      } //Mouse events

      /**
       * Adds onClick listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onClick",
      value: function onClick(handler) {
        this.html.onclick = handler;
        return this;
      }
      /**
       * Adds onDoubleClick listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDoubleClick",
      value: function onDoubleClick(handler) {
        this.html.ondblclick = handler;
        return this;
      }
      /**
       * Adds onContextMenu listener to this element. Usually fired by mouse right click.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onContextMenu",
      value: function onContextMenu(handler) {
        this.html.oncontextmenu = handler;
        return this;
      }
      /**
       * Adds onMouseDown listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseDown",
      value: function onMouseDown(handler) {
        this.html.onmousedown = handler;
        return this;
      }
      /**
       * Adds onMouseEnter listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseEnter",
      value: function onMouseEnter(handler) {
        this.html.onmouseenter = handler;
        return this;
      }
      /**
       * Adds onMouseLeave listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseLeave",
      value: function onMouseLeave(handler) {
        this.html.onmouseleave = handler;
        return this;
      }
      /**
       * Adds onMouseMove listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseMove",
      value: function onMouseMove(handler) {
        this.html.onmousemove = handler;
        return this;
      }
      /**
       * Adds onMouseOver listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseOver",
      value: function onMouseOver(handler) {
        this.html.onmouseover = handler;
        return this;
      }
      /**
       * Adds onMouseOut listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseOut",
      value: function onMouseOut(handler) {
        this.html.onmouseout = handler;
        return this;
      }
      /**
       * Adds onMouseUp listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onMouseUp",
      value: function onMouseUp(handler) {
        this.html.onmouseup = handler;
        return this;
      }
      /**
       * Adds onWheel listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onWheel",
      value: function onWheel(handler) {
        this.html.onwheel = handler;
        return this;
      } //UI events

      /**
       * Adds onScroll listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onScroll",
      value: function onScroll(handler) {
        this.html.onscroll = handler;
        return this;
      }
      /**
       * Adds onResize listener to this element (supported: body).
       * @param {function} handler 
       */

    }, {
      key: "onResize",
      value: function onResize(handler) {
        this.html.onresize = handler;
        return this;
      }
      /**
       * Adds onError listener to this element (supported: img, input[type=img], object, link, script).
       * Is fired when an error occurs while downloading an external file.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onError",
      value: function onError(handler) {
        this.html.onerror = handler;
        return this;
      }
      /**
       * Adds onLoad listener to this element (supported: body, img, input[type=img], script, link, style, frame, iframe).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onLoad",
      value: function onLoad(handler) {
        this.html.onload = handler;
        return this;
      }
      /**
       * Adds onUnload listener to this element. Is fired when the page is unloaded or browser window is closed (supported: body).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onUnload",
      value: function onUnload(handler) {
        this.html.onunload = handler;
        return this;
      }
      /**
       * Adds onBeforeUnload listener to this element. Is fired before unload (supported: body).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onBeforeUnload",
      value: function onBeforeUnload(handler) {
        this.html.onbeforeunload = handler;
        return this;
      } //Key events

      /**
       * Adds onKeyUp listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onKeyUp",
      value: function onKeyUp(handler) {
        this.html.onkeyup = handler;
        return this;
      }
      /**
       * Adds onKeyDown listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onKeyDown",
      value: function onKeyDown(handler) {
        this.html.onkeydown = handler;
        return this;
      }
      /**
       * Adds onKeyPress listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onKeyPress",
      value: function onKeyPress(handler) {
        this.html.onkeypress = handler;
        return this;
      }
      /**
       * Adds onInput listener to this element (supported: input, textarea).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onInput",
      value: function onInput(handler) {
        this.html.oninput = handler;
        return this;
      } //Events (changing state)

      /**
       * Adds onChange listener to this element (supported: input, select, textarea).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onChange",
      value: function onChange(handler) {
        this.html.onchange = handler;
        return this;
      }
      /**
       * Adds onSubmit listener to this element (supported: form).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onSubmit",
      value: function onSubmit(handler) {
        this.html.onsubmit = handler;
        return this;
      }
      /**
       * Adds onSelect listener to this element. Is fired when a text is selected inside an input field (supported: input[type=text|password|file], textarea). 
       * @param {function} handler 
       * @returns Elem isntance.
       */

    }, {
      key: "onSelect",
      value: function onSelect(handler) {
        this.html.onselect = handler;
        return this;
      }
      /**
       * Adds onReset listener to this element (supported: form).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onReset",
      value: function onReset(handler) {
        this.html.onreset = handler;
        return this;
      }
      /**
       * Adds onFocus listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onFocus",
      value: function onFocus(handler) {
        this.html.onfocus = handler;
        return this;
      }
      /**
       * Adds onFocusIn listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onFocusIn",
      value: function onFocusIn(handler) {
        this.html.onfocusin = handler;
        return this;
      }
      /**
       * Adds onFocusOut listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onFocusOut",
      value: function onFocusOut(handler) {
        this.html.onfocusout = handler;
        return this;
      }
      /**
       * Adds onBlur listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onBlur",
      value: function onBlur(handler) {
        this.html.onblur = handler;
        return this;
      } //Clipboard events

      /**
       * Adds onCopy listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onCopy",
      value: function onCopy(handler) {
        this.html.oncopy = handler;
        return this;
      }
      /**
       * Adds onCut listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onCut",
      value: function onCut(handler) {
        this.html.oncut = handler;
        return this;
      }
      /**
       * Adds onPaste listener to this element.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onPaste",
      value: function onPaste(handler) {
        this.html.onpaste = handler;
        return this;
      } //Media events

      /**
       * Adds onAbort listener to this element. Is fired when media data download is aborted (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onAbort",
      value: function onAbort(handler) {
        this.html.onabort = handler;
        return this;
      }
      /**
       * Adds onWaiting listener to this element. Is fired when video stops and waits to buffer next frame (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onWaiting",
      value: function onWaiting(handler) {
        this.html.onwaiting = handler;
        return this;
      }
      /**
       * Adds onVolumeChange listener to this element. Is fired when the volume is changed (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onVolumeChange",
      value: function onVolumeChange(handler) {
        this.html.onvolumechange = handler;
        return this;
      }
      /**
       * Adds onTimeTupdate listener to this element. Is fired when playing or a new position is selected on a seekbar (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onTimeUpdate",
      value: function onTimeUpdate(handler) {
        this.html.ontimeupdate = handler;
        return this;
      }
      /**
       * Adds onSeeking listener to this element. Is fired when a new position was selected on a seekbar (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onSeeking",
      value: function onSeeking(handler) {
        this.html.onseeking = handler;
        return this;
      }
      /**
       * Adds onSeekEnd listener to this element. Is fired after a new position was selected on a seekbar (supported: audio, video).
       * @param {*} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onSeekEnd",
      value: function onSeekEnd(handler) {
        this.html.onseekend = handler;
        return this;
      }
      /**
       * Adds onRateChange listener to this element. Is fired when playback rate (speed slow motion, fast forward) changes (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onRateChange",
      value: function onRateChange(handler) {
        this.html.onratechange = handler;
        return this;
      }
      /**
       * Adds onProgress listener on an element. Is fired when browser is downloading media (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onProgress",
      value: function onProgress(handler) {
        this.html.onprogress = handler;
        return this;
      }
      /**
       * Adds onLoadMetadata listener to this element. Is fired when media metadata was downloaded (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onLoadMetadata",
      value: function onLoadMetadata(handler) {
        this.html.onloadmetadata = handler;
        return this;
      }
      /**
       * Adds onLoadedData listener on an element. Is fired when media frame data was loaded, but not enough data to play next frame (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onLoadedData",
      value: function onLoadedData(handler) {
        this.html.onloadeddata = handler;
        return this;
      }
      /**
       * Adds onLoadStart listener on an element. Is fired when browser starts looking for media (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onLoadStart",
      value: function onLoadStart(handler) {
        this.html.onloadstart = handler;
        return this;
      }
      /**
       * Adds onPlaying listener to this element. Is fired when the media is playing after paused by user or stopped for buffering (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onPlaying",
      value: function onPlaying(handler) {
        this.html.onplaying = handler;
        return this;
      }
      /**
       * Adds onPlay listener to this element. Is fired when the media starts to play e.g. play button is pressed. (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onPlay",
      value: function onPlay(handler) {
        this.html.onplay = handler;
        return this;
      }
      /**
       * Adds onPause listener to this element. Is fired when the media is paused. (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onPause",
      value: function onPause(handler) {
        this.html.onpause = handler;
        return this;
      }
      /**
       * Adds onEnded listener to this element. Is fired when the end of media file has been reached (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onEnded",
      value: function onEnded(handler) {
        this.html.onended = handler;
        return this;
      }
      /**
       * Adds onDurationChange listener to this element. Is fired when media duration changes (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onDurationChange",
      value: function onDurationChange(handler) {
        this.html.ondurationchange = handler;
        return this;
      }
      /**
       * Adds onCanPlay listener to this element. Is fired when enough data to play (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onCanPlay",
      value: function onCanPlay(handler) {
        this.html.oncanplay = handler;
        return this;
      }
      /**
       * Adds canPlayThrough listener to this element. Is fired when can play through without buffering (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onCanPlayThrough",
      value: function onCanPlayThrough(handler) {
        this.html.oncanplaythrough = handler;
        return this;
      }
      /**
       * Adds onStalled listener to this element. Is fired when browser is trying to get data but data not available (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onStalled",
      value: function onStalled(handler) {
        this.html.onstalled = handler;
        return this;
      }
      /**
       * Adds onSuspend listener to this element. Is fired when browser intentionally does not retrive media data (supported: audio, video).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onSuspend",
      value: function onSuspend(handler) {
        this.html.onsuspend = handler;
        return this;
      } //Browser events

      /**
       * Adds onPopState listener to this element. Is fired when window history changes.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onPopState",
      value: function onPopState(handler) {
        this.html.onpopstate = handler;
        return this;
      }
      /**
       * Adds onStorage listener to this element. Is fired when WebStorage changes.
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onStorage",
      value: function onStorage(handler) {
        this.html.onstorage = handler;
        return this;
      }
      /**
       * Add onHashChange listener to this element. Is fired when hash part of the url changes (supported: body).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onHashChange",
      value: function onHashChange(handler) {
        this.html.onhashchange = handler;
        return this;
      }
      /**
       * Adds onAfterPrint listener to this element. Is fired when a print dialogue is closed (Safari, Opera not supported).
       * @param {function} handler 
       * @returns Elem instance.
       */

    }, {
      key: "onAfterPrint",
      value: function onAfterPrint(handler) {
        this.html.onafterprint = handler;
        return this;
      }
      /**
       * Adds onBeforePrint listener to this element. Is fired when a print dialogue is opened (Safari, Opera not supported).
       * @param {function} handler 
       */

    }, {
      key: "onBeforePrint",
      value: function onBeforePrint(handler) {
        this.html.onbeforeprint = handler;
        return this;
      }
      /**
       * Adds onPageHide listener to this element. Is fired when user navigates away from webpage (supported: body).
       * @param {function} handler 
       */

    }, {
      key: "onPageHide",
      value: function onPageHide(handler) {
        this.html.onpagehide = handler;
        return this;
      }
      /**
       * Adds onPageShow listener to this element. Is fired when user navigates to webpage (supported: body).
       * @param {function} handler 
       */

    }, {
      key: "onPageShow",
      value: function onPageShow(handler) {
        this.html.onpageshow = handler;
        return this;
      }
      /**
       * Creates a new HTML element and wraps it into this Elem instance.
       * @param type
       * @returns Elem instance.
       */

    }], [{
      key: "create",
      value: function create(type) {
        return new Elem(type);
      }
      /**
       * Does not create a new HTML element, but merely wraps an existing instance of the HTML element into
       * this Elem instance.
       * @param html
       * @returns Elem instance.
       */

    }, {
      key: "wrap",
      value: function wrap(html) {
        if (!Util.isEmpty(html)) return new Elem(html);else throw "Could not wrap a html element - html: " + html;
      }
      /**
       * Takes an array of HTMLDocument elements and wraps them inside an Elem instance.
       * If the given array contains more than one htmlDoc element otherwise then this method will
       * return an array of Elem instances, otherwise single Elem instance is returned.
       * 
       * @param {Array} htmlDoc 
       * @returns An array of the Elem objects or a single Elem object. 
       */

    }, {
      key: "wrapElems",
      value: function wrapElems(htmlDoc) {
        var eArr = [];
        var i = 0;

        while (i < htmlDoc.length) {
          eArr.push(Elem.wrap(htmlDoc[i]));
          i++;
        }

        return eArr.length === 1 ? eArr[0] : eArr;
      }
    }]);

    return Elem;
  }();
  /**
   * Templater class is able to create a Template out of an Elem object.
   */


  var Templater =
  /*#__PURE__*/
  function () {
    function Templater() {
      _classCallCheck(this, Templater);

      this.instance;
      this.template = {};
      this.deep = true;
    }

    _createClass(Templater, [{
      key: "toTemplate",
      value: function toTemplate(elem, deep) {
        if (!Util.isEmpty(deep)) this.deep = deep;
        this.resolve(elem, this.template);
        return this.template;
      }
      /**
       * Function is called recursively and resolves an Elem object and its children in recursion
       * @param {object} elem 
       * @param {object} parent 
       */

    }, {
      key: "resolve",
      value: function resolve(elem, parent) {
        var resolved = this.resolveElem(elem, this.resolveProps(elem));

        for (var p in parent) {
          if (parent.hasOwnProperty(p)) {
            if (Util.isArray(parent[p])) parent[p].push(resolved);else this.extendMap(parent[p], resolved);
          }
        }

        var i = 0;
        var children = Util.isArray(elem.getChildren()) ? elem.getChildren() : [elem.getChildren()];

        if (children && this.deep) {
          while (i < children.length) {
            this.resolve(children[i], resolved);
            i++;
          }
        }

        this.template = resolved;
      }
    }, {
      key: "extendMap",
      value: function extendMap(map, next) {
        for (var v in next) {
          if (next.hasOwnProperty(v)) {
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

    }, {
      key: "resolveElem",
      value: function resolveElem(elem, props) {
        var el = {};
        var children = elem.getChildren();

        if (Util.isArray(children) && children.length > 1) {
          var elTag = elem.getTagName().toLowerCase();
          var elName = this.resolveId(elTag, props);
          elName = this.resolveClass(elName, props);
          elName = this.resolveAttrs(elName, props);
          el[elName] = [];
        } else {
          el[elem.getTagName().toLowerCase()] = props;
        }

        return el;
      }
      /**
       * Function will place an ID attribute into an element tag if the ID attribute is found.
       * @param {string} tag 
       * @param {object} props 
       * @returns The element tag with the ID or without.
       */

    }, {
      key: "resolveId",
      value: function resolveId(tag, props) {
        if (props.id) return tag + "#" + props.id;else return tag;
      }
      /**
       * Function will place a class attribute into an element tag if the class attribute is found.
       * @param {string} tag 
       * @param {object} props 
       * @returns The element tag with the classes or without.
       */

    }, {
      key: "resolveClass",
      value: function resolveClass(tag, props) {
        if (props.class) return tag + "." + props.class.replace(/ /g, ".");else return tag;
      }
      /**
       * Function will resolve all other attributes and place them into an element tag if other attributes are found.
       * @param {string} tag 
       * @param {object} props 
       * @returns The element tag with other attributes or without.
       */

    }, {
      key: "resolveAttrs",
      value: function resolveAttrs(tag, props) {
        var tagName = tag;

        for (var p in props) {
          if (props.hasOwnProperty(p) && p !== "id" && p !== "class") {
            tagName += "[".concat(p, "=").concat(props[p], "]");
          }
        }

        return tagName;
      }
      /**
       * Resolves a given Elem object and returns its properties in an object.
       * @param {object} elem 
       * @returns The properties object of the given element.
       */

    }, {
      key: "resolveProps",
      value: function resolveProps(elem) {
        var props = {};
        var attributes = elem.dom().attributes;
        var a = 0;

        if (attributes) {
          while (a < attributes.length) {
            props[this.resolveAttributeNames(attributes[a].name)] = attributes[a].value;
            a++;
          }
        }

        if (elem.dom().hasChildNodes() && elem.dom().childNodes[0].nodeType === 3) {
          props["text"] = elem.getText();
        }

        for (var p in elem.dom()) {
          if (p.indexOf("on") !== 0 || Util.isEmpty(elem.dom()[p])) continue;else props[this.resolveListeners(p)] = elem.dom()[p];
        }

        return props;
      }
      /**
       * Resolves html data-* attributes by removing '-' and setting the next character to uppercase. If the attribute is not 
       * data-* attribute then it is directly returned.
       * @param {string} attrName 
       * @returns Resolved attribute name.
       */

    }, {
      key: "resolveAttributeNames",
      value: function resolveAttributeNames(attrName) {
        if (attrName.indexOf("data" === 0 && attrName.length > "data".length)) {
          while (attrName.search("-") > -1) {
            attrName = attrName.replace(/-\w/, attrName.charAt(attrName.search("-") + 1).toUpperCase());
          }

          return attrName;
        } else {
          return attrName;
        }
      }
    }, {
      key: "resolveListeners",
      value: function resolveListeners(name) {
        switch (name) {
          case "onanimationstart":
            return "onAnimationStart";

          case "onanimationiteration":
            return "onAnimationIteration";

          case "onanimationend":
            return "onAnimationEnd";

          case "ontransitionend":
            return "onTransitionEnd";

          case "ondrag":
            return "onDrag";

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
            return "onReset";

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

    }], [{
      key: "toTemplate",
      value: function toTemplate(elem, deep) {
        return Templater.getInstance().toTemplate(elem, deep);
      }
      /**
       * Function resolves and returns properties of a given Elem object.
       * @param {object} elem 
       * @returns The properties object of the given Elem.
       */

    }, {
      key: "getElementProps",
      value: function getElementProps(elem) {
        return Templater.getInstance().resolveProps(elem);
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (!this.instance) this.instance = new Templater();
        return this.instance;
      }
    }]);

    return Templater;
  }();
  /**
   * RenderHelper class is a helper class of the Elem class. The RenderHelper class chiefly
   * stores previous state of the Elem in an array and in a string.
   */


  var RenderHelper =
  /*#__PURE__*/
  function () {
    function RenderHelper() {
      _classCallCheck(this, RenderHelper);

      this.instance;
      this.prevState = [];
      this.prevStateString = "";
    }
    /**
     * Set previous state.
     * @param {array} state 
     */


    _createClass(RenderHelper, null, [{
      key: "setPrevState",
      value: function setPrevState(state) {
        RenderHelper.getInstance().prevState = state;
        RenderHelper.getInstance().prevStateString = Util.isEmpty(state) ? "" : state.toString();
      }
      /**
       * @returns A previous state array.
       */

    }, {
      key: "getPrevState",
      value: function getPrevState() {
        return RenderHelper.getInstance().prevState;
      }
      /**
       * Compares new state previous state.
       * @param {array} newState 
       * @returns True if the new state and the previous state are equal otherwise false.
       */

    }, {
      key: "isNewStateEqualToPrevState",
      value: function isNewStateEqualToPrevState(newState) {
        return RenderHelper.getInstance().prevStateString === newState.toString();
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (!this.instance) this.instance = new RenderHelper();
        return this.instance;
      }
    }]);

    return RenderHelper;
  }();

  return Elem;
}();

var Template = function () {
  /**
   * Template class reads a JSON format notation and creates an element tree from it.
   * The Template class has only one public method resolve that takes the template as parameter and returns 
   * the created element tree.
   */
  var Template =
  /*#__PURE__*/
  function () {
    function Template() {
      _classCallCheck(this, Template);

      this.template = {};
      this.root = null;
      /**
       * Deprecated, is replaced with Template.isAttr(key, elem); function.
       * These attributes are supported inside an object notation: {div: {text: "some", class: "some", id:"some"....}}
       */

      this.attributes = ["id", "name", "class", "text", "value", "content", "tabIndex", "type", "src", "href", "editable", "placeholder", "size", "checked", "disabled", "visible", "display", "draggable", "styles", "for", "message", "target", "title", "click", "focus", "blur"];
    }
    /**
     * Method takes a template as parameter, starts resolving it and returns 
     * a created element tree. 
     * @param {object} template
     * @returns Elem instance element tree.
     */


    _createClass(Template, [{
      key: "setTemplateAndResolve",
      value: function setTemplateAndResolve(template) {
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

    }, {
      key: "resolve",
      value: function resolve(template, parent, round) {
        for (var obj in template) {
          if (template.hasOwnProperty(obj)) {
            if (round === 0) {
              ++round;
              this.root = this.resolveElement(obj, template[obj]);
              if (Util.isArray(template[obj])) this.resolveArray(template[obj], this.root, round);else if (!this.isComponent(obj) && Util.isObject(template[obj])) this.resolve(template[obj], this.root, round);else if (Util.isFunction(template[obj])) this.resolveFunction(this.root, template[obj]);
            } else {
              ++round;

              if (Template.isAttr(obj, parent)) {
                this.resolveAttributes(parent, obj, template[obj]);
              } else if (this.isEventKeyVal(obj, template[obj])) {
                parent[obj].call(parent, template[obj]);
              } else {
                var child = this.resolveElement(obj, template[obj]);
                parent.append(child);

                if (Util.isArray(template[obj])) {
                  this.resolveArray(template[obj], child, round);
                } else if (!this.isComponent(obj) && Util.isObject(template[obj])) {
                  this.resolve(template[obj], child, round);
                } else if (Util.isFunction(template[obj])) {
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

    }, {
      key: "resolveArray",
      value: function resolveArray(array, parent, round) {
        var i = 0;

        while (i < array.length) {
          var o = array[i];

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              if (Util.isObject(o[key])) {
                this.resolve(o, parent, round);
              } else if (Util.isFunction(o[key])) {
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

    }, {
      key: "resolveFunction",
      value: function resolveFunction(elem, func) {
        var ret = func.call(elem, elem);

        if (!Util.isEmpty(ret) && Util.isString(ret)) {
          if (this.isMessage(ret)) {
            this.resolveMessage(elem, ret);
          } else {
            elem.setText(ret);
          }
        } else if (!Util.isEmpty(ret) && Util.isNumber(ret)) {
          elem.setText(ret);
        }
      }
      /**
       * Function will check if the given message is actually a message or not. The function
       * will return true if it is a message otherwise false is returned.
       * @param {string} message 
       * @returns True if the given message is actually a message otherwise returns false.
       */

    }, {
      key: "isMessage",
      value: function isMessage(message) {
        var params = this.getMessageParams(message);
        if (!Util.isEmpty(params)) message = message.replace(params.join(), "");
        return !Util.isEmpty(Messages.message(message)) && Messages.message(message) != message;
      }
      /**
       * Resolves an element and some basic attributes from a give tag. Method throws an exception if 
       * the element could not be resolved.
       * @param {string} tag
       * @param {object} obj
       * @returns Null or resolved Elem instance elemenet.
       */

    }, {
      key: "resolveElement",
      value: function resolveElement(tag, obj) {
        var resolved = null;
        var match = [];
        var el = tag.match(/component:?[a-zA-Z0-9]+|[a-zA-Z0-9]+/).join();

        if (this.isComponent(el)) {
          el = el.replace(/component:/, "");
          resolved = RME.component(el, obj);
        } else if (Util.isEmpty(el)) throw "Template resolver could not find element: \"" + el + "\" from the given tag: \"" + tag + "\"";else resolved = new Elem(el);

        match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id

        if (!Util.isEmpty(match)) resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));
        match = tag.match(/\.[a-zA-Z-0-9\-]+/g); //find classes

        if (!Util.isEmpty(match)) resolved.addClasses(match.join(" ").replace(/\./g, ""));
        match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_&%@!?£$+¤|\\<\\>\\"]+\]/g); //find attributes

        if (!Util.isEmpty(match)) resolved = this.addAttributes(resolved, match);
        return resolved;
      }
      /**
       * Adds resolved attributes to an element.
       * @param {object} elem
       * @param {array} elem
       * @returns The given elem instance.
       */

    }, {
      key: "addAttributes",
      value: function addAttributes(elem, attrArray) {
        var i = 0;
        var start = "[";
        var eq = "=";
        var end = "]";

        while (i < attrArray.length) {
          var attr = attrArray[i];
          var key = attr.substring(attr.indexOf(start) + 1, attr.indexOf(eq));
          var val = attr.substring(attr.indexOf(eq) + 1, attr.indexOf(end));
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

    }, {
      key: "resolveAttributes",
      value: function resolveAttributes(elem, key, val) {
        switch (key) {
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

    }, {
      key: "resolveDefault",
      value: function resolveDefault(elem, key, val) {
        if (key.indexOf("data") === 0 && key.length > "data".length) elem.setData(key.replace(/[A-Z]/, key.charAt(4).toLowerCase()).replace("data", ""), val);else elem.setAttribute(key, val);
      }
      /**
       * Function sets the content of the element according to the element.
       * @param {object} elem 
       * @param {string} key 
       * @param {string} val 
       */

    }, {
      key: "resolveContent",
      value: function resolveContent(elem, key, val) {
        if (elem.getTagName().toLowerCase() === "meta") elem.setAttribute(key, val);else elem.setContent(val);
      }
      /**
       * Function sets a translated message to the element. If the message contains message parameters then the paramters
       * are resolved first.
       * @param {object} elem 
       * @param {string} message 
       */

    }, {
      key: "resolveMessage",
      value: function resolveMessage(elem, message) {
        if (Util.isEmpty(message)) throw "message must not be empty";
        var matches = this.getMessageParams(message);

        if (Util.isEmpty(matches)) {
          elem.message(message);
        } else {
          Util.setTimeout(function () {
            var end = message.indexOf(":") > 0 ? message.indexOf(":") : message.indexOf("{");
            message = message.substring(0, end);
            matches = matches.join().match(/([^\{\}\:\;]*)/g);
            var params = [];
            var i = 0;

            while (i < matches.length) {
              if (!Util.isEmpty(matches[i])) params.push(matches[i]);
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

    }, {
      key: "getMessageParams",
      value: function getMessageParams(message) {
        return message.match(/\:?(\{.*\}\;?)/g);
      }
      /**
       * Deprecated
       * Checks is a given key is an attribute key.
       * @param {key}
       * @returns True if the given key is attribute key otherwise false.
       */

    }, {
      key: "isAttributeKey",
      value: function isAttributeKey(key) {
        var i = 0;

        while (i < this.attributes.length) {
          if (key === this.attributes[i]) {
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

    }, {
      key: "isEventKeyVal",
      value: function isEventKeyVal(key, val) {
        return key.indexOf("on") === 0 && Util.isFunction(val);
      }
      /**
       * Checks that the given component exist with the given key or the key starts with component keyword and the component exist. 
       * @param {string} key
       * @returns True if the component exist or the key contains component keyword and exist, otherwise false.
       */

    }, {
      key: "isComponent",
      value: function isComponent(key) {
        return RME.hasComponent(key) || key.indexOf("component:") === 0 && RME.hasComponent(key.replace(/component:/, ""));
      }
      /**
       * Method takes a template as parameter, starts resolving it and 
       * returns a created element tree.
       * @param {object} template
       * @returns Elem instance element tree.
       */

    }], [{
      key: "resolveTemplate",
      value: function resolveTemplate(template) {
        return Template.create().setTemplateAndResolve(template);
      }
    }, {
      key: "create",
      value: function create() {
        return new Template();
      }
      /**
       * Method checks if the given object is an unresolved JSON template.
       * @param {object} object 
       * @returns True if the given object is an unresolved JSON template, otherwise false.
       */

    }, {
      key: "isTemplate",
      value: function isTemplate(object) {
        var isTemplate = false;

        if (Util.isObject(object) && !Util.isArray(object) && !(object instanceof Elem)) {
          for (var p in object) {
            isTemplate = object.hasOwnProperty(p) && Template.isTagOrComponent(p);
            if (isTemplate) break;
          }
        }

        return isTemplate;
      }
      /**
       * Method takes a string and returns true if the given string is a html tag or a component, otherwise returns false.
       * @param {string} tag 
       * @returns True if the given tag is a HTML tag otherwise false.
       */

    }, {
      key: "isTagOrComponent",
      value: function isTagOrComponent(tag) {
        tag = tag.match(/component:?[a-zA-Z0-9]+|[a-zA-Z0-9]+/).join().replace("component:", "");
        if (RME.hasComponent(tag)) return true;
        return Template.isTag(tag);
      }
      /**
       * Method takes a string and returns true if the given string is a html tag, otherwise returns false.
       * @param {string} tag 
       * @returns True if the given tag is a HTML tag otherwise false.
       */

    }, {
      key: "isTag",
      value: function isTag(tag) {
        var tags = {
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
          t: ["table", "textarea", "td", "tr", "tt", "th", "thead", "tbody", "tfoot", "template", "time", "title", "track"],
          u: ["u", "ul"],
          v: ["var", "video"],
          w: ["wbr"]
        };
        var i = 0;
        var tagArray = tags[tag.substring(0, 1)];

        while (i < tagArray.length) {
          if (tagArray[i] === tag) return true;
          i++;
        }

        return false;
      }
      /**
       * Function checks if the given key is an attribute and returns true if it is otherwise false.
       * @param {string} key 
       * @param {object} elem 
       * @returns True if the given key as an attribute otherwise false.
       */

    }, {
      key: "isAttr",
      value: function isAttr(key, elem) {
        /**
         * special cases below.
         */
        if (key === "span" && Template.isElem(elem.getTagName(), ["col", "colgroup"])) //special case, span might be an attribute also for these two elements.
          return true;else if (key === "label" && Template.isElem(elem.getTagName(), ["track", "option", "optgroup"])) return true;else if (key === "title" && (elem.parent() === null || elem.parent().getTagName().toLowerCase() !== "head")) return true;else if (key === "cite" && Template.isElem(elem.getTagName(), ["blockquote", "del", "ins", "q"])) return true;else if (key === "form" && Template.isElem(elem.getTagName(), ["button", "fieldset", "input", "label", "meter", "object", "output", "select", "textarea"])) return true;else if (key.indexOf("data") === 0 && (!RME.hasComponent(key) && !Template.isElem(elem.getTagName(), ["data"]) || Template.isElem(elem.getTagName(), ["object"]))) return true;
        var attrs = {
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
        };
        var i = 0;
        var keys = attrs[key.substring(0, 1)];

        if (keys) {
          while (i < keys.length) {
            if (keys[i] === key) return true;
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

    }, {
      key: "isElem",
      value: function isElem(elemTag, array) {
        var i = 0;

        while (i < array.length) {
          if (array[i] === elemTag.toLowerCase()) return true;
          i++;
        }

        return false;
      }
    }]);

    return Template;
  }();

  return {
    resolve: Template.resolveTemplate,
    isTemplate: Template.isTemplate
  };
}();
/**
 * Tree class reads the HTML Document Tree and returns elements found from there. The Tree class does not have 
 * HTML Document Tree editing functionality except setTitle(title) method that will set the title of the HTML Document.
 * 
 * Majority of the methods in the Tree class will return found elements wrapped in an Elem instance as it offers easier
 * operation functionalities.
 */


var Tree =
/*#__PURE__*/
function () {
  function Tree() {
    _classCallCheck(this, Tree);
  }

  _createClass(Tree, null, [{
    key: "get",

    /**
     * Uses CSS selector to find elements on the HTML Document Tree. 
     * Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} selector 
     * @returns An array of Elem instances or a single Elem instance.
     */
    value: function get(selector) {
      return Elem.wrapElems(document.querySelectorAll(selector));
    }
    /**
     * Uses CSS selector to find the first match element on the HTML Document Tree.
     * Found element will be wrapped in an Elem instance.
     * @param {string} selector 
     * @returns An Elem instance.
     */

  }, {
    key: "getFirst",
    value: function getFirst(selector) {
      return Elem.wrap(document.querySelector(selector));
    }
    /**
     * Uses a HTML Document tag name to find matched elements on the HTML Document Tree e.g. div, span, p.
     * Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instanes are returned otherwise a single Elem instance.
     * @param {string} tag 
     * @returns An array of Elem instances or a single Elem instance.
     */

  }, {
    key: "getByTag",
    value: function getByTag(tag) {
      return Elem.wrapElems(document.getElementsByTagName(tag));
    }
    /**
     * Uses a HTML Document element name attribute to find matching elements on the HTML Document Tree.
     * Found elements will be wrappedn in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} name 
     * @returns An array of Elem instances or a single Elem instance.
     */

  }, {
    key: "getByName",
    value: function getByName(name) {
      return Elem.wrapElems(document.getElementsByName(name));
    }
    /**
     * Uses a HTML Document element id to find a matching element on the HTML Document Tree.
     * Found element will be wrapped in an Elem instance.
     * @param {string} id 
     * @returns Elem instance.
     */

  }, {
    key: "getById",
    value: function getById(id) {
      return Elem.wrap(document.getElementById(id));
    }
    /**
     * Uses a HTML Document element class string to find matching elements on the HTML Document Tree e.g. "main emphasize-green".
     * Method will try to find elements having any of the given classes. Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} classname 
     * @returns An array of Elem instances or a single Elem instance.
     */

  }, {
    key: "getByClass",
    value: function getByClass(classname) {
      return Elem.wrapElems(document.getElementsByClassName(classname));
    }
    /**
     * @returns body wrapped in an Elem instance.
     */

  }, {
    key: "getBody",
    value: function getBody() {
      return Elem.wrap(document.body);
    }
    /**
     * @returns head wrapped in an Elem instance.
     */

  }, {
    key: "getHead",
    value: function getHead() {
      return Elem.wrap(document.head);
    }
    /**
     * @returns title of the html document page.
     */

  }, {
    key: "getTitle",
    value: function getTitle() {
      return document.title;
    }
    /**
     * Set an new title for html document page.
     * @param {string} title 
     */

  }, {
    key: "setTitle",
    value: function setTitle(title) {
      document.title = title;
    }
    /**
     * @returns active element wrapped in an Elem instance.
     */

  }, {
    key: "getActiveElement",
    value: function getActiveElement() {
      return Elem.wrap(document.activeElement);
    }
    /**
     * @returns array of anchors (<a> with name attribute) wrapped in Elem an instance.
     */

  }, {
    key: "getAnchors",
    value: function getAnchors() {
      return Elem.wrapElems(document.anchors);
    }
    /**
     * @returns <html> element.
     */

  }, {
    key: "getHtmlElement",
    value: function getHtmlElement() {
      return document.documentElement;
    }
    /**
     * @returns <!DOCTYPE> element.
     */

  }, {
    key: "getDoctype",
    value: function getDoctype() {
      return document.doctype;
    }
    /**
     * @returns an arry of embedded (<embed>) elements wrapped in Elem an instance.
     */

  }, {
    key: "getEmbeds",
    value: function getEmbeds() {
      return Elem.wrapElems(document.embeds);
    }
    /**
     * @returns an array of image elements (<img>) wrapped in an Elem instance.
     */

  }, {
    key: "getImages",
    value: function getImages() {
      return Elem.wrapElems(document.images);
    }
    /**
     * @returns an array of <a> and <area> elements that have href attribute wrapped in an Elem instance.
     */

  }, {
    key: "getLinks",
    value: function getLinks() {
      return Elem.wrapElems(document.links);
    }
    /**
     * @returns an array of scripts wrapped in an Elem instance.
     */

  }, {
    key: "getScripts",
    value: function getScripts() {
      return Elem.wrapElems(document.scripts);
    }
    /**
     * @returns an array of form elements wrapped in an Elem instance.
     */

  }, {
    key: "getForms",
    value: function getForms() {
      return Elem.wrapElems(document.forms);
    }
  }]);

  return Tree;
}();

var Router = function () {
  /**
   * Router class handles and renders route elements that are given by Router.routes() method.
   * The method takes an array of route objects that are defined as follows: {route: "url", elem: elemObject, hide: true|false|undefined}.
   * The first element the array of route objects is by default the root route object in which all other route objects 
   * are rendered into.
   */
  var Router =
  /*#__PURE__*/
  function () {
    function Router() {
      var _this9 = this;

      _classCallCheck(this, Router);

      this.instance = null;
      this.root = null;
      this.origRoot = null;
      this.routes = [];
      this.origRoutes = [];
      this.currentRoute = {};
      this.prevUrl = location.pathname;

      this.loadCall = function () {
        return _this9.navigateUrl(location.pathname);
      };

      this.hashCall = function () {
        return _this9.navigateUrl(location.hash);
      };

      this.useHistory = true;
      this.autoListen = true;
      this.useHash = false;
      this.scrolltop = true;
      this.app;
      this.registerRouter();
    }
    /**
     * Initializes the Router.
     */


    _createClass(Router, [{
      key: "registerRouter",
      value: function registerRouter() {
        var _this10 = this;

        document.addEventListener("readystatechange", function () {
          if (document.readyState === "complete") {
            var check = Util.setInterval(function () {
              var hasRoot = !Util.isEmpty(_this10.root.elem) ? document.querySelector(_this10.root.elem) : false;

              if (hasRoot) {
                Util.clearInterval(check);

                _this10.resolveRoutes();
              }
            }, 50);
          }
        });
      }
      /**
       * Register listeners according to the useHistory and the autoListen state.
       */

    }, {
      key: "registerListeners",
      value: function registerListeners() {
        if (this.useHistory && this.autoListen) window.addEventListener("load", this.loadCall);else if (!this.useHistory && this.autoListen) window.addEventListener("hashchange", this.hashCall);
        if (!this.autoListen) window.addEventListener("popstate", this.onPopState.bind(this));
      }
      /**
       * Clear the registered listeners.
       */

    }, {
      key: "clearListeners",
      value: function clearListeners() {
        window.removeEventListener("load", this.loadCall);
        window.removeEventListener("hashchange", this.hashCall);
        if (!this.autoListen) window.removeEventListener("popstate", this.onPopState);
      }
      /**
       * On popstate call is registered if the auto listen is false. It listens the browsers history change and renders accordingly.
       */

    }, {
      key: "onPopState",
      value: function onPopState() {
        if (this.useHistory) this.renderRoute(location.pathname);else this.renderRoute(location.hash);
      }
      /**
       * Set the router to use a history implementation or an anchor hash implementation.
       * If true then the history implementation is used. Default is true.
       * @param {boolean} use
       */

    }, {
      key: "setUseHistory",
      value: function setUseHistory(use) {
        this.useHistory = use;
      }
      /**
       * Set the Router to auto listen url change to true or false.
       * @param {boolean} listen
       */

    }, {
      key: "setAutoListen",
      value: function setAutoListen(listen) {
        this.autoListen = listen;
      }
      /**
       * Set auto scroll up true or false.
       * @param {boolean} auto 
       */

    }, {
      key: "setAutoScrollUp",
      value: function setAutoScrollUp(auto) {
        this.scrolltop = auto;
      }
      /**
       * Set the app instance that the Router invokes on update.
       * @param {object} appInstance 
       */

    }, {
      key: "setApp",
      value: function setApp(appInstance) {
        this.app = appInstance;
      }
      /**
       * Resolves the root and the first page.
       */

    }, {
      key: "resolveRoutes",
      value: function resolveRoutes() {
        if (Util.isString(this.root.elem)) {
          this.root.elem = this.resolveElem(this.root.elem);
        } else if (Util.isEmpty(this.root)) {
          this.root = this.routes.shift();
          this.root.elem = this.resolveElem(this.root.elem);
          this.origRoot = this.root.elem;
        }

        if (this.useHash) {
          this.renderRoute(location.hash);
        } else {
          this.renderRoute(location.pathname);
        }
      }
      /**
       * Set the routes and if a root is not set then the first element will be the root route element.
       * @param {array} routes
       */

    }, {
      key: "setRoutes",
      value: function setRoutes(routes) {
        this.routes = routes;
      }
      /**
       * Add a route into the Router. {route: "url", elem: elemObject}
       * @param {object} route
       */

    }, {
      key: "addRoute",
      value: function addRoute(route) {
        this.routes.push(route);
      }
      /**
       * Set a root route object into the Router. {route: "url", elem: elemObject}
       * @param {object} route
       */

    }, {
      key: "setRoot",
      value: function setRoot(route) {
        this.root = route;
        this.origRoot = route.elem;
      }
      /**
       * Resolve route elements.
       * @param {array} routes 
       */

    }, {
      key: "resolveRouteElems",
      value: function resolveRouteElems(routes) {
        var i = 0;

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

    }, {
      key: "resolveElem",
      value: function resolveElem(elem) {
        if (Util.isString(elem) && RME.hasComponent(elem)) {
          return RME.component(elem);
        } else if (Util.isString(elem)) {
          return Tree.getFirst(elem);
        }

        return elem;
      }
      /**
       * Method navigates to the url and renders a route element inside the root route element if found.
       * @param {string} url
       */

    }, {
      key: "navigateUrl",
      value: function navigateUrl(url) {
        var route = this.findRoute(url);

        if (!Util.isEmpty(route) && this.useHistory && !route.hide) {
          history.pushState(null, null, url);
        } else if (!Util.isEmpty(route) && !route.hide) {
          location.href = route.route.indexOf("#") === 0 ? route.route : "#" + route.route;
        }

        if (!Util.isEmpty(this.root) && !Util.isEmpty(route)) {
          if (route.scrolltop === true || route.scrolltop === undefined && this.scrolltop) Browser.scrollTo(0, 0);
          this.prevUrl = url;
          this.currentRoute = route;
          if (Util.isEmpty(this.app)) this.root.elem.render(this.resolveElem(route.elem));else this.app.refresh();
        }
      }
      /**
       * Method looks for a route by the url. If the router is found then it will be returned otherwise returns null
       * @param {string} url
       * @param {boolean} force
       * @returns The found router or null if not found.
       */

    }, {
      key: "findRoute",
      value: function findRoute(url, force) {
        var i = 0;

        if (!Util.isEmpty(url) && (this.prevUrl !== url || force)) {
          while (i < this.routes.length) {
            if (this.matches(this.routes[i].route, url)) return this.routes[i];
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

    }, {
      key: "renderRoute",
      value: function renderRoute(url) {
        var route = this.findRoute(url, true);

        if (!Util.isEmpty(route) && Util.isEmpty(this.app)) {
          this.root.elem.render(this.resolveElem(route.elem));
          this.currentRoute = route;
        } else if (Util.isEmpty(this.app)) {
          this.root.elem.render();
        } else if (!Util.isEmpty(route) && !Util.isEmpty(this.app)) {
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

    }, {
      key: "matches",
      value: function matches(url, newUrl) {
        if (this.useHistory) {
          url = url.replace(/\*/g, ".*").replace(/\/{2,}/g, "/");
          var path = newUrl.replace(/\:{1}\/{2}/, "").match(/\/{1}.*/).join();
          var found = newUrl.match(url);
          if (!Util.isEmpty(found)) found = found.join();
          return found === path && new RegExp(url).test(newUrl);
        } else {
          url = url.indexOf("#") === 0 ? url : "#" + url;
          var hash = newUrl.match(/\#{1}.*/).join();
          var found = newUrl.match(url);
          if (!Util.isEmpty(found)) found = found.join();
          return url === found && found === hash;
        }
      }
      /**
       * @returns The current status of the Router in an object.
       */

    }, {
      key: "getCurrentState",
      value: function getCurrentState() {
        return {
          root: this.origRoot,
          current: this.resolveElem(this.currentRoute.elem)
        };
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

    }], [{
      key: "navigate",
      value: function navigate(url, event) {
        if (Util.isString(url)) Router.getInstance().navigateUrl(url);else if (Util.isObject(url) && url instanceof Event) {
          if (!Router.getInstance().autoListen || Router.getInstance().useHash) url.preventDefault();
          Router.getInstance().navigateUrl(url.target.href);
        } else if (Util.isObject(url) && url instanceof Elem && !Util.isEmpty(event) && Util.isObject(event) && event instanceof Event) {
          if (!Router.getInstance().autoListen || Router.getInstance().useHash) event.preventDefault();
          Router.getInstance().navigateUrl(url.getHref());
        }
      }
      /**
       * Set a root element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
       * @param {object} elem
       * @returns Router
       */

    }, {
      key: "root",
      value: function root(elem) {
        Router.getInstance().setRoot({
          elem: elem
        });
        return Router;
      }
      /**
       * Add a new route element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
       * @param {string} url
       * @param {object} elem
       * @param {boolean} hide
       */

    }, {
      key: "add",
      value: function add(url, elem, hide) {
        Router.getInstance().addRoute({
          route: url,
          elem: elem,
          hide: hide
        });
        return Router;
      }
      /**
       * Set an array of routes that the Router uses. If a root is not set then the first item in the given routes array will be the root route element.
       * @param {array} routes
       */

    }, {
      key: "routes",
      value: function routes(_routes) {
        if (!Util.isArray(_routes)) throw "Could not set routes. Given parameter: \"" + _routes + "\" is not an array.";
        Router.getInstance().setRoutes(_routes);
        return Router;
      }
      /**
       * Method sets the Router to use an url implementation. The url implementation defaults to HTML standard that pressing a link
       * will cause the browser reload a new page. After reload the new page is rendered. If you wish to skip reload then you should 
       * set the parameter manual to true.
       * @param {boolean} manual
       * @returns Router
       */

    }, {
      key: "url",
      value: function url(manual) {
        Router.getInstance().setUseHistory(true);
        Router.getInstance().registerListeners();

        if (Util.isBoolean(manual) && manual) {
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

    }, {
      key: "manual",
      value: function manual() {
        if (Router.getInstance().useHistory) {
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

    }, {
      key: "hash",
      value: function hash() {
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

    }, {
      key: "scroll",
      value: function scroll(auto) {
        if (Util.isBoolean(auto)) {
          Router.getInstance().setAutoScrollUp(auto);
        }

        return Router;
      }
      /**
       * Set the app instance to be invoked on the Router update.
       * @param {object} appInstance 
       * @returns Router
       */

    }, {
      key: "setApp",
      value: function setApp(appInstance) {
        if (!Util.isEmpty(appInstance)) Router.getInstance().setApp(appInstance);
        return Router;
      }
      /**
       * @returns The current status of the router.
       */

    }, {
      key: "getCurrentState",
      value: function getCurrentState() {
        return Router.getInstance().getCurrentState();
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (Util.isEmpty(this.instance)) this.instance = new Router();
        return this.instance;
      }
    }]);

    return Router;
  }();

  return {
    navigate: Router.navigate,
    root: Router.root,
    add: Router.add,
    routes: Router.routes,
    url: Router.url,
    hash: Router.hash,
    scroll: Router.scroll,
    getCurrentState: Router.getCurrentState,
    setApp: Router.setApp
  };
}();

var Messages = function () {
  /**
   * Messages class handles internationalization. The class offers public methods that enable easy 
   * using of translated content.
   */
  var Messages =
  /*#__PURE__*/
  function () {
    function Messages() {
      _classCallCheck(this, Messages);

      this.instance = this;
      this.messages = [];
      this.locale = "";
      this.translated = [];

      this.load = function () {};

      this.messagesType;
      this.app;
      this.ready = false;
      this.registerMessages();
    }
    /**
     * Initializes the Messages
     */


    _createClass(Messages, [{
      key: "registerMessages",
      value: function registerMessages() {
        var _this11 = this;

        document.addEventListener("readystatechange", function () {
          if (document.readyState === "complete") {
            _this11.ready = true;

            _this11.runTranslated.call(_this11);
          }
        });
      }
    }, {
      key: "setLoad",
      value: function setLoad(loader) {
        this.load = loader;
      }
    }, {
      key: "setAppInstance",
      value: function setAppInstance(appInstance) {
        this.app = appInstance;
      }
    }, {
      key: "setLocale",
      value: function setLocale(locale) {
        this.locale = locale;
        return this;
      }
    }, {
      key: "setMessages",
      value: function setMessages(messages) {
        if (Util.isArray(messages)) this.messagesType = "array";else if (Util.isObject(messages)) this.messagesType = "map";else throw "messages must be type array or object";
        this.messages = messages;
        this.runTranslated.call(this);
      }
    }, {
      key: "getMessage",
      value: function getMessage(text) {
        for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          params[_key - 1] = arguments[_key];
        }

        if (Util.isEmpty(params[0][0])) {
          return this.resolveMessage(text);
        } else {
          this.getTranslatedElemIfExist(text, params[0][0]);
          var msg = this.resolveMessage(text);
          return this.resolveParams(msg, params[0][0]);
        }
      }
      /**
       * Resolves translated message key and returns a resolved message if exist
       * otherwise returns the given key.
       * @param {string} text 
       * @returns A resolved message if exist otherwise the given key.
       */

    }, {
      key: "resolveMessage",
      value: function resolveMessage(text) {
        if (this.messagesType === "array") {
          return this.resolveMessagesArray(text);
        } else if (this.messagesType === "map") {
          return this.resolveMessagesMap(text);
        }
      }
      /**
       * Resolves a translated message key from the map. Returns a resolved message 
       * if found otherwise returns the key.
       * @param {string} text 
       * @returns A resolved message
       */

    }, {
      key: "resolveMessagesMap",
      value: function resolveMessagesMap(text) {
        var msg = text;

        for (var i in this.messages) {
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
       * @param {string} text 
       * @returns A resolved message
       */

    }, {
      key: "resolveMessagesArray",
      value: function resolveMessagesArray(text) {
        var i = 0;
        var msg = text;

        while (i < this.messages.length) {
          if (!Util.isEmpty(this.messages[i][text])) {
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

    }, {
      key: "resolveParams",
      value: function resolveParams(msg, params) {
        if (!Util.isEmpty(msg)) {
          var i = 0;

          while (i < params.length) {
            msg = msg.replace("{" + i + "}", params[i]);
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

    }, {
      key: "getTranslatedElemIfExist",
      value: function getTranslatedElemIfExist(key, params) {
        if (Util.isEmpty(this.app)) {
          var last = params[params.length - 1];

          if (Util.isObject(last) && last instanceof Elem) {
            last = params.pop();
            this.translated.push({
              key: key,
              params: params,
              obj: last
            });
          }
        }
      }
      /**
       * Function goes through the translated objects array and sets a translated message to the translated elements.
       */

    }, {
      key: "runTranslated",
      value: function runTranslated() {
        var _this12 = this;

        if (Util.isEmpty(this.app) && this.ready) {
          Util.setTimeout(function () {
            var i = 0;

            while (i < _this12.translated.length) {
              _this12.translated[i].obj.setText.call(_this12.translated[i].obj, Messages.message(_this12.translated[i].key, _this12.translated[i].params));

              i++;
            }
          });
        } else if (this.ready) {
          this.app.refresh();
        }
      }
      /**
       * Function returns current locale of the Messages
       * @returns Current locale
       */

    }], [{
      key: "locale",
      value: function locale() {
        return Messages.getInstance().locale;
      }
      /**
       * Lang function is used to change or set the current locale to be the given locale. After calling this method
       * the Messages.load function will be automatically invoked.
       * @param {string} locale String
       * @param {object} locale Event
       */

    }, {
      key: "lang",
      value: function lang(locale) {
        var loc;

        if (Util.isObject(locale) && locale instanceof Event) {
          locale.preventDefault();
          var el = Elem.wrap(locale.target);
          loc = el.getHref();
          if (Util.isEmpty(loc)) loc = el.getValue();
          if (Util.isEmpty(loc)) loc = el.getText();
        } else if (Util.isString(locale)) loc = locale;else throw "Given parameter must be type string or instance of Event, given value: " + locale;

        if (!Util.isEmpty(loc)) Messages.getInstance().setLocale(loc).load.call(null, Messages.getInstance().locale, Messages.getInstance().setMessages.bind(Messages.getInstance()));
      }
      /**
       * Message function is used to retrieve translated messages. The function also supports message parameters
       * that can be given as a comma separeted list. 
       * @param {string} text 
       * @param {*} params 
       * @returns A resolved message or the given key if the message is not found.
       */

    }, {
      key: "message",
      value: function message(text) {
        for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          params[_key2 - 1] = arguments[_key2];
        }

        return Messages.getInstance().getMessage(text, params);
      }
      /**
       * Load function is used to load new messages or change already loaded messages.
       * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
       * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
       * This function is called automatically when language is changed by calling the Messages.lang() function.
       * @param {function} loader 
       */

    }, {
      key: "load",
      value: function load(loader) {
        if (!Util.isFunction(loader)) throw "loader must be type function " + Util.getType(loader);
        Messages.getInstance().setLoad(loader);
      }
      /**
       * Set the app instance to be invoked on the Messages update.
       * @param {object} appInstance 
       */

    }, {
      key: "setApp",
      value: function setApp(appInstance) {
        Messages.getInstance().setAppInstance(appInstance);
        return Messages;
      }
    }, {
      key: "getInstance",
      value: function getInstance() {
        if (!this.instance) this.instance = new Messages();
        return this.instance;
      }
    }]);

    return Messages;
  }();

  return {
    lang: Messages.lang,
    message: Messages.message,
    load: Messages.load,
    locale: Messages.locale,
    setApp: Messages.setApp
  };
}();
/**
 * Key class does not have any methods as it only contains key mappings for keyevent. For example:
 * 
 * onKeyDown(function(event) {
 *  if(event.key === Key.ENTER)
 *    //do something.
 * });
 */


var Key = function Key() {
  _classCallCheck(this, Key);
};
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

var Cookie = function () {
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
  var Cookies =
  /*#__PURE__*/
  function () {
    function Cookies() {
      _classCallCheck(this, Cookies);
    }

    _createClass(Cookies, null, [{
      key: "get",

      /**
       * Get a cookie by name. If the cookie is found a cookie object is returned otherwise null.
       * 
       * @param {String} name 
       * @returns cookie object
       */
      value: function get(name) {
        if (navigator.cookieEnabled) {
          var retCookie = null;
          var cookies = document.cookie.split(";");
          var i = 0;

          while (i < cookies.length) {
            var cookie = cookies[i];
            var eq = cookie.search("=");
            var cn = cookie.substr(0, eq).trim();
            var cv = cookie.substr(eq + 1, cookie.length).trim();

            if (cn === name) {
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

    }, {
      key: "set",
      value: function set(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
        if (navigator.cookieEnabled) {
          document.cookie = Cookie.create(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean).toString();
        }
      }
      /**
       * Remove a cookie by name. Method will set the cookie expired and then remove it.
       * @param {string} name
       */

    }, {
      key: "remove",
      value: function remove(name) {
        var co = Cookies.get(name);

        if (!Util.isEmpty(co)) {
          co.setExpired();
          document.cookie = co.toString();
        }
      }
    }]);

    return Cookies;
  }();
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


  var Cookie =
  /*#__PURE__*/
  function () {
    function Cookie(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
      _classCallCheck(this, Cookie);

      this.cookieName = !Util.isEmpty(name) && Util.isString(name) ? name.trim() : "";
      this.cookieValue = !Util.isEmpty(value) && Util.isString(value) ? value.trim() : "";
      this.cookieExpires = !Util.isEmpty(expiresDate) && Util.isString(expiresDate) ? expiresDate.trim() : "";
      this.cookiePath = !Util.isEmpty(cookiePath) && Util.isString(cookiePath) ? cookiePath.trim() : "";
      this.cookieDomain = !Util.isEmpty(cookieDomain) && Util.isString(cookieDomain) ? cookieDomain.trim() : "";
      this.cookieSecurity = !Util.isEmpty(setSecureBoolean) && Util.isBoolean(setSecureBoolean) ? "secure=secure" : "";
    }

    _createClass(Cookie, [{
      key: "setExpired",
      value: function setExpired() {
        this.cookieExpires = new Date(1970, 0, 1).toString();
      }
    }, {
      key: "toString",
      value: function toString() {
        return this.cookieName + "=" + this.cookieValue + "; expires=" + this.cookieExpires + "; path=" + this.cookiePath + "; domain=" + this.cookieDomain + "; " + this.cookieSecurity;
      }
    }], [{
      key: "create",
      value: function create(name, value, expires, cpath, cdomain, setSecure) {
        return new Cookie(name, value, expires, cpath, cdomain, setSecure);
      }
    }]);

    return Cookie;
  }();

  return Cookies;
}();
/**
 * Session class is a wrapper interface for the SessionStorage and thus provides get, set, remove and clear methods of the SessionStorage.
 */


var Session =
/*#__PURE__*/
function () {
  function Session() {
    _classCallCheck(this, Session);
  }

  _createClass(Session, null, [{
    key: "set",

    /**
     * Save data into the Session.
     * @param {string} key
     * @param {*} value
     */
    value: function set(key, value) {
      sessionStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the Session.
     * @param {string} key
     */

  }, {
    key: "get",
    value: function get(key) {
      return sessionStorage.getItem(key);
    }
    /**
     * Remove data from the Session.
     * @param {string} key
     */

  }, {
    key: "remove",
    value: function remove(key) {
      sessionStorage.removeItem(key);
    }
    /**
     * Clears the Session.
     */

  }, {
    key: "clear",
    value: function clear() {
      sessionStorage.clear();
    }
  }]);

  return Session;
}();
/**
 * Storage class is a wrapper interface for the LocalStorage and thus provides get, set, remove and clear methods of the LocalStorage.
 */


var Storage =
/*#__PURE__*/
function () {
  function Storage() {
    _classCallCheck(this, Storage);
  }

  _createClass(Storage, null, [{
    key: "set",

    /**
     * Save data into the local storage. 
     * @param {string} key
     * @param {*} value
     */
    value: function set(key, value) {
      localStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the local storage.
     * @param {string} key
     */

  }, {
    key: "get",
    value: function get(key) {
      return localStorage.getItem(key);
    }
    /**
     * Remove data from the local storage.
     * @param {string} key
     */

  }, {
    key: "remove",
    value: function remove(key) {
      localStorage.removeItem(key);
    }
    /**
     * Clears the local storage.
     */

  }, {
    key: "clear",
    value: function clear() {
      localStorage.clear();
    }
  }]);

  return Storage;
}();
/**
 * General Utility methods.
 */


var Util =
/*#__PURE__*/
function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "isEmpty",

    /**
     * Checks is a given value empty.
     * @param {*} value
     * @returns True if the give value is null, undefined, an empty string or an array and lenght of the array is 0.
     */
    value: function isEmpty(value) {
      return value === null || value === undefined || value === "" || Util.isArray(value) && value.length === 0;
    }
    /**
     * Get the type of the given value.
     * @param {*} value
     * @returns The type of the given value.
     */

  }, {
    key: "getType",
    value: function getType(value) {
      return _typeof(value);
    }
    /**
     * Checks is a given value is a given type.
     * @param {*} value
     * @param {string} type
     * @returns True if the given value is the given type otherwise false.
     */

  }, {
    key: "isType",
    value: function isType(value, type) {
      return Util.getType(value) === type;
    }
    /**
     * Checks is a given parameter a function.
     * @param {*} func 
     * @returns True if the given parameter is fuction otherwise false.
     */

  }, {
    key: "isFunction",
    value: function isFunction(func) {
      return Util.isType(func, "function");
    }
    /**
     * Checks is a given parameter a boolean.
     * @param {*} boolean
     * @returns True if the given parameter is boolean otherwise false.
     */

  }, {
    key: "isBoolean",
    value: function isBoolean(boolean) {
      return Util.isType(boolean, "boolean");
    }
    /**
     * Checks is a given parameter a string.
     * @param {*} string
     * @returns True if the given parameter is string otherwise false.
     */

  }, {
    key: "isString",
    value: function isString(string) {
      return Util.isType(string, "string");
    }
    /**
     * Checks is a given parameter a number.
     * @param {*} number
     * @returns True if the given parameter is number otherwise false.
     */

  }, {
    key: "isNumber",
    value: function isNumber(number) {
      return Util.isType(number, "number");
    }
    /**
     * Checks is a given parameter a symbol.
     * @param {*} symbol
     * @returns True if the given parameter is symbol otherwise false.
     */

  }, {
    key: "isSymbol",
    value: function isSymbol(symbol) {
      return Util.isType(symbol, "symbol");
    }
    /**
     * Checks is a given parameter a object.
     * @param {*} object
     * @returns True if the given parameter is object otherwise false.
     */

  }, {
    key: "isObject",
    value: function isObject(object) {
      return Util.isType(object, "object");
    }
    /**
     * Checks is a given parameter an array.
     * @param {*} array
     * @returns True if the given parameter is array otherwise false.
     */

  }, {
    key: "isArray",
    value: function isArray(array) {
      return Array.isArray(array);
    }
    /**
     * Sets a timeout where the given callback function will be called once after the given milliseconds of time. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The timeout object.
     */

  }, {
    key: "setTimeout",
    value: function setTimeout(callback, milliseconds) {
      if (!Util.isFunction(callback)) {
        throw "callback not fuction";
      }

      for (var _len3 = arguments.length, params = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        params[_key3 - 2] = arguments[_key3];
      }

      return window.setTimeout(callback, milliseconds, params);
    }
    /**
     * Removes a timeout that was created by setTimeout method.
     * @param {object} timeoutObject
     */

  }, {
    key: "clearTimeout",
    value: function clearTimeout(timeoutObject) {
      window.clearTimeout(timeoutObject);
    }
    /**
     * Sets an interval where the given callback function will be called in intervals after milliseconds of time has passed. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The interval object.
     */

  }, {
    key: "setInterval",
    value: function setInterval(callback, milliseconds) {
      if (!Util.isFunction(callback)) {
        throw "callback not fuction";
      }

      for (var _len4 = arguments.length, params = new Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        params[_key4 - 2] = arguments[_key4];
      }

      return window.setInterval(callback, milliseconds, params);
    }
    /**
     * Removes an interval that was created by setInterval method.
     */

  }, {
    key: "clearInterval",
    value: function clearInterval(intervalObject) {
      window.clearInterval(intervalObject);
    }
    /**
     * Encodes a string to Base64.
     * @param {string} string
     * @returns The base64 encoded string.
     */

  }, {
    key: "encodeBase64String",
    value: function encodeBase64String(string) {
      if (!Util.isString(string)) {
        throw "the given parameter is not a string: " + string;
      }

      return window.btoa(string);
    }
    /**
     * Decodes a base 64 encoded string.
     * @param {string} string
     * @returns The base64 decoded string.
     */

  }, {
    key: "decodeBase64String",
    value: function decodeBase64String(string) {
      if (!Util.isString(string)) {
        throw "the given parameter is not a string: " + string;
      }

      return window.atob(string);
    }
  }]);

  return Util;
}();
/**
 * Browser class contains all the rest utility functions which JavaScript has to offer from Window, Navigator, Screen, History, Location objects.
 */


var Browser =
/*#__PURE__*/
function () {
  function Browser() {
    _classCallCheck(this, Browser);
  }

  _createClass(Browser, null, [{
    key: "scrollTo",

    /**
     * Scroll once to a given location (xPos, yPos)
     * @param {number} xPos
     * @param {number} yPos
     */
    value: function scrollTo(xPos, yPos) {
      window.scrollTo(xPos, yPos);
    }
    /**
     * Scroll multiple times by given pixel amount (xPx, yPx)
     * @param {number} xPx
     * @param {number} yPx
     */

  }, {
    key: "scrollBy",
    value: function scrollBy(xPx, yPx) {
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

  }, {
    key: "open",
    value: function open(url, name, specs, replace) {
      return window.open(url, name, specs, replace);
    }
    /**
     * Closes a given opened window. Same as calling openedWindow.close();
     * @param {*} openedWindow 
     */

  }, {
    key: "close",
    value: function close(openedWindow) {
      openedWindow.close();
    }
    /**
     * Opens a print webpage dialog.
     */

  }, {
    key: "print",
    value: function print() {
      window.print();
    }
    /**
     * Displays an alert dialog with a given message and an OK button.
     * @param {string} message
     */

  }, {
    key: "alert",
    value: function alert(message) {
      window.alert(message);
    }
    /**
     * Displays a confirm dialog with a given message, OK and Cancel button.
     * @param {string} message
     * @returns True if OK was pressed otherwise false.
     */

  }, {
    key: "confirm",
    value: function confirm(message) {
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

  }, {
    key: "prompt",
    value: function prompt(message, defaultText) {
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

  }, {
    key: "mediaMatcher",
    value: function mediaMatcher(mediaString) {
      if (mediaString.indexOf("(") !== 0) mediaString = "(" + mediaString;
      if (mediaString.indexOf(")") !== mediaString.length - 1) mediaString = mediaString + ")";
      return window.matchMedia(mediaString);
    }
    /**
     * Loads one page back in the browsers history list.
     */

  }, {
    key: "pageBack",
    value: function pageBack() {
      history.back();
    }
    /**
     * Loads one page forward in the browsers history list.
     */

  }, {
    key: "pageForward",
    value: function pageForward() {
      history.forward();
    }
    /**
     * Loads to specified page in the browsers history list. A parameter can either be a number or string.
     * If the parameter is number then positive and negative values are allowed as positive values will go forward
     * and negative values will go backward. 
     * If the parameter is string then it must be partial or full url of the page in the history list.
     * @param {string|number} numberOfPagesOrUrl
     */

  }, {
    key: "pageGo",
    value: function pageGo(numberOfPagesOrUrl) {
      history.go(numberOfPagesOrUrl);
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

  }, {
    key: "pushState",
    value: function pushState(stateObject, title, newURL) {
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

  }, {
    key: "replaceState",
    value: function replaceState(stateObject, title, newURL) {
      history.replaceState(stateObject, title, newURL);
    }
    /**
     * Loads a new page.
     * @param {string} newURL
     */

  }, {
    key: "newPage",
    value: function newPage(newURL) {
      location.assign(newURL);
    }
    /**
     * Reloads a current page. If a parameter force is true then the page will be loaded from the server 
     * otherwise from the browsers cache.
     * @param {boolean} force
     */

  }, {
    key: "reloadPage",
    value: function reloadPage(force) {
      location.reload(force);
    }
    /**
     * Replaces a current page with a new one. If the page is replaced then it wont be possible to go back
     * to the previous page from the history list.
     * @param {string} newURL
     */

  }, {
    key: "replacePage",
    value: function replacePage(newURL) {
      location.replace(newURL);
    }
    /**
     * @returns Anchor part of the url e.g. #heading2.
     */

  }, {
    key: "getAnchorHash",
    value: function getAnchorHash() {
      return location.hash;
    }
    /**
     * Sets a new anhorpart of the url e.g. #heading3.
     * @param {string} hash
     */

  }, {
    key: "setAnchorHash",
    value: function setAnchorHash(hash) {
      location.hash = hash;
    }
    /**
     * @returns Hostname and port in host:port format.
     */

  }, {
    key: "getHostnamePort",
    value: function getHostnamePort() {
      return location.host;
    }
    /**
     * Set a hostname and port in format host:port.
     * @param {string} hostPort
     */

  }, {
    key: "setHostnamePort",
    value: function setHostnamePort(hostPort) {
      location.host = hostPort;
    }
    /**
     * @returns Hostname e.g. www.google.com.
     */

  }, {
    key: "getHostname",
    value: function getHostname() {
      return location.hostname;
    }
    /**
     * Set a hostname
     * @param {string} hostname
     */

  }, {
    key: "setHostname",
    value: function setHostname(hostname) {
      location.hostname = hostname;
    }
    /**
     * @returns Entire URL of the webpage.
     */

  }, {
    key: "getURL",
    value: function getURL() {
      return location.href;
    }
    /**
     * Set location of a current page to point to a new location e.g. http://some.url.test or #someAcnhor on the page.
     * @param {string} newURL
     */

  }, {
    key: "setURL",
    value: function setURL(newURL) {
      location.href = newURL;
    }
    /**
     * @returns protocol, hostname and port e.g. https://www.example.com:443
     */

  }, {
    key: "getOrigin",
    value: function getOrigin() {
      return location.origin;
    }
    /**
     * @returns Part of the URL after the slash(/) e.g. /photos/
     */

  }, {
    key: "getPathname",
    value: function getPathname() {
      return location.pathname;
    }
    /**
     * Sets a new pathname for this location.
     * @param {string} pathname 
     */

  }, {
    key: "setPathname",
    value: function setPathname(pathname) {
      location.pathname = pathname;
    }
    /**
     * @returns Port number of the connection between server and client.
     */

  }, {
    key: "getPort",
    value: function getPort() {
      return location.port;
    }
    /**
     * Sets a new port number for the connection between server and client.
     * @param {number} portNumber 
     */

  }, {
    key: "setPort",
    value: function setPort(portNumber) {
      location.port = portNumber;
    }
    /**
     * @returns Protocol part of the URL e.g. http: or https:.
     */

  }, {
    key: "getProtocol",
    value: function getProtocol() {
      return location.protocol;
    }
    /**
     * Set a new protocol for this location to use.
     * @param {string} protocol 
     */

  }, {
    key: "setProtocol",
    value: function setProtocol(protocol) {
      location.protocol = protocol;
    }
    /**
     * @returns Part of the URL after the question(?) mark. e.g. ?attr=value&abc=efg.
     */

  }, {
    key: "getSearchString",
    value: function getSearchString() {
      return location.search;
    }
    /**
     * Sets a new searchString into the URL
     * @param {string} searchString 
     */

  }, {
    key: "setSearchString",
    value: function setSearchString(searchString) {
      location.search = searchString;
    }
    /**
     * @returns Codename of the browser.
     */

  }, {
    key: "getCodename",
    value: function getCodename() {
      return navigator.appCodeName;
    }
    /**
     * @returns Name of the browser.
     */

  }, {
    key: "getName",
    value: function getName() {
      return navigator.appName;
    }
    /**
     * @returns Version of the browser.
     */

  }, {
    key: "getVersion",
    value: function getVersion() {
      return navigator.appVersion;
    }
    /**
     * @returns True if cookies are enabled otherwise false.
     */

  }, {
    key: "isCookiesEnabled",
    value: function isCookiesEnabled() {
      return navigator.cookieEnabled;
    }
    /**
     * @returns GeoLocation object.
     */

  }, {
    key: "getGeoLocation",
    value: function getGeoLocation() {
      return navigator.geolocation;
    }
    /**
     * @returns Language of the browser.
     */

  }, {
    key: "getLanguage",
    value: function getLanguage() {
      return navigator.language;
    }
    /**
     * @returns A platform name of which the browser is compiled on.
     */

  }, {
    key: "getPlatform",
    value: function getPlatform() {
      return navigator.platform;
    }
    /**
     * @returns A name of an engine of the browser.
     */

  }, {
    key: "getProduct",
    value: function getProduct() {
      return navigator.product;
    }
    /**
     * @returns A header string sent to a server by the browser.
     */

  }, {
    key: "getUserAgentHeader",
    value: function getUserAgentHeader() {
      return navigator.userAgent;
    }
    /**
     * @returns Color depth of the current screen.
     */

  }, {
    key: "getColorDepth",
    value: function getColorDepth() {
      return screen.colorDepth;
    }
    /**
     * @returns Total height of the current screen.
     */

  }, {
    key: "getFullScreenHeight",
    value: function getFullScreenHeight() {
      return screen.height;
    }
    /**
     * @returns Total width of the current screen.
     */

  }, {
    key: "getFullScreenWidth",
    value: function getFullScreenWidth() {
      return screen.width;
    }
    /**
     * @returns Height of the current screen excluding OS. taskbar.
     */

  }, {
    key: "getAvailableScreenHeight",
    value: function getAvailableScreenHeight() {
      return screen.availHeight;
    }
    /**
     * @returns Width of the current screen exluding OS. taskbar.
     */

  }, {
    key: "getAvailableScreenWidth",
    value: function getAvailableScreenWidth() {
      return screen.availWidth;
    }
  }]);

  return Browser;
}();
