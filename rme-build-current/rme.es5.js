"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/** RME BUILD FILE **/

/**
 * General Utility methods.
 */
var Util = /*#__PURE__*/function () {
  function Util() {
    _classCallCheck(this, Util);
  }

  _createClass(Util, null, [{
    key: "isEmpty",
    value:
    /**
     * Checks is a given value empty.
     * @param {*} value
     * @returns True if the give value is null, undefined, an empty string or an array and lenght of the array is 0.
     */
    function isEmpty(value) {
      return value === null || value === undefined || Util.isString(value) && value === "" || Util.isObject(value) && Object.keys(value).length === 0 || Util.isArray(value) && value.length === 0;
    }
    /**
     * Checks is the given value not empty. This function is a negation to the Util.isEmpty function.
     * @param {*} value 
     * @returns True if the value is not empty otherwise false.
     */

  }, {
    key: "notEmpty",
    value: function notEmpty(value) {
      return !Util.isEmpty(value);
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
    value: function isBoolean(_boolean) {
      return Util.isType(_boolean, "boolean");
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
  }]);

  return Util;
}();
/**
 * Manages between component shareable values.
 */


var ValueStore = function () {
  var ValueStore = /*#__PURE__*/function () {
    function ValueStore() {
      _classCallCheck(this, ValueStore);

      this.values = new Map();
      this.valueRefGenerator = new RefGenerator('val');
    }
    /**
     * The function will set the given value to the app instance and return a getter and a setter function
     * for the given value. Values can be shared and used in between any component.
     * @param {*} value 
     * @returns An array containing the getter and the setter functions for the given value.
     */


    _createClass(ValueStore, [{
      key: "useValue",
      value: function useValue(value, appName) {
        var _this = this;

        if (Util.isFunction(value)) {
          value = value(value);
        }

        var ref = this.valueRefGenerator.next();
        this.values.set(ref, value);

        var getter = function getter() {
          return _this.values.get(ref);
        };

        var setter = function setter(next, update) {
          if (Util.isFunction(next)) {
            next = next(getter());
          }

          _this.values.set(ref, next);

          if (update !== false) {
            RMEAppManager.getOrDefault(appName).refresh();
          }
        };

        return [getter, setter];
      }
    }]);

    return ValueStore;
  }();

  var RefGenerator = /*#__PURE__*/function () {
    function RefGenerator(feed) {
      _classCallCheck(this, RefGenerator);

      this.feed = feed || "";
      this.seq = 0;
    }

    _createClass(RefGenerator, [{
      key: "next",
      value: function next() {
        var ref = this.feed + this.seq;
        this.seq++;
        return ref;
      }
    }]);

    return RefGenerator;
  }();

  var valueStore = new ValueStore();
  return valueStore;
}();
/**
 * The createApp function is a shortcut function to create an RME application.
 * @param {string} selector
 * @param {function} component
 * @param {string} appName
 * @returns a created app instance.
 */


var createApp = function () {
  var matchSelector = function matchSelector(key) {
    var match = key.match(/#[a-zA-Z-0-9\-]+/); // id

    if (!match) {
      match = key.match(/\.[a-zA-Z-0-9\-]+/); // class
    }

    return match ? match.join() : undefined;
  };

  return function (template) {
    if (!Util.isObject(template)) {
      throw new Error('The app creation template must be an object.');
    }

    var selector = matchSelector(Object.keys(template).shift());

    if (Util.isEmpty(selector)) {
      throw new Error('The root selector could not be parsed from the template. Selector should be type an #id or a .class');
    }

    return RMEAppBuilder.root(selector).create(Object.values(template).shift());
  };
}();
/**
 * The function will set the given value in the app value state. The value is accessible by
 * a returned getter and a setter function.
 * @param {*} value Value to set in the app state
 * @param {string} appName Optional app name
 * @returns An array containing the getter and the setter functions for the given value.
 */


var useValue = function () {
  return function (value, appName) {
    return ValueStore.useValue(value, appName);
  };
}();
/**
 * Keeps RME App instances in memory
 */


var RMEAppManager = function () {
  var seq = 0;
  var prefix = 'app';

  var _useValue = useValue({}),
      _useValue2 = _slicedToArray(_useValue, 2),
      getFrom = _useValue2[0],
      setTo = _useValue2[1];
  /**
   * Set application instance in to the manager
   * @param {string} name 
   * @param {*} value 
   */


  var set = function set(name, value) {
    return setTo(function (store) {
      return _objectSpread(_objectSpread({}, store), {}, _defineProperty({}, name, value));
    }, false);
  };
  /**
   * Get application instance from the store by name
   * @param {string} name 
   * @returns Application instance
   */


  var get = function get(name) {
    return getFrom()[name];
  };
  /**
   * Get application instance by name or return default application instance.
   * The default application instance is returned if the given name parameter is empty.
   * @param {string} name 
   * @returns Application instance
   */


  var getOrDefault = function getOrDefault(name) {
    return Util.notEmpty(name) ? get(name) : get("".concat(prefix, "0"));
  };
  /**
   * Returns an array containing all application instances.
   * @returns Array
   */


  var getAll = function getAll() {
    return Object.values(getFrom());
  };
  /**
   * Creates a next available application name.
   * @returns Application name
   */


  var createName = function createName() {
    while (Util.notEmpty(get(prefix + seq))) {
      seq++;
    }

    return prefix + seq;
  };

  return {
    set: set,
    get: get,
    getAll: getAll,
    createName: createName,
    getOrDefault: getOrDefault
  };
}();

var RMEAppBuilder = function () {
  var holder = {
    appRoot: undefined
  };

  var Builder = /*#__PURE__*/function () {
    function Builder() {
      _classCallCheck(this, Builder);
    }

    _createClass(Builder, null, [{
      key: "root",
      value:
      /**
       * Function will set a root for an application. If the root is not set then body is used by default.
       * @param {string} root 
       * @returns Builder
       */
      function root(_root) {
        holder.appRoot = Util.isString(_root) && _root;
        return Builder;
      }
      /**
       * Reset Builder settings
       * @returns Builder
       */

    }, {
      key: "reset",
      value: function reset() {
        holder.appRoot = undefined;
        return Builder;
      }
      /**
       * Function creates an application. The given parameter can either be a Template object or an Elem object.
       * @param {*} object 
       * @returns AppInstance
       */

    }, {
      key: "create",
      value: function create(object) {
        if (!(RMETemplateResolver.isTemplate(object) || RMETemplateFragmentHelper.isFragment(object))) {
          throw new Error('App template must start with a valid html tag or a fragment key');
        }

        var app = new AppInstance(RMEAppManager.createName(), holder.appRoot, object);
        RMEAppManager.set(app.name, app);
        Builder.reset();
        return app;
      }
    }]);

    return Builder;
  }();

  var AppInstance = /*#__PURE__*/function () {
    function AppInstance(name, root, object) {
      _classCallCheck(this, AppInstance);

      this.rawStage = object;
      this.name = name;
      this.root;
      this.renderer;
      this.oldStage = "";
      this.ready = false;
      this.refreshQueue;
      this.bindReadyListener(root);
    }

    _createClass(AppInstance, [{
      key: "bindReadyListener",
      value: function bindReadyListener(root) {
        var _this2 = this;

        ['loading', 'interactive'].includes(document.readyState) ? ready(function () {
          return _this2.init(root);
        }) : this.init(root);
      }
      /**
       * Initialize the Application
       * @param {string} root 
       */

    }, {
      key: "init",
      value: function init(root) {
        this.root = Util.isEmpty(root) ? Tree.getBody() : Tree.getFirst(root);
        this.renderer = new RMEElemRenderer(this.root);
        this.ready = true;
        this.refresh();
      }
    }, {
      key: "refresh",
      value: function refresh() {
        var _this3 = this;

        if (this.ready) {
          if (this.refreshQueue) {
            Browser.clearTimeout(this.refreshQueue);
          }

          this.refreshQueue = Browser.setTimeout(function () {
            var freshStage = RMETemplateResolver.resolve(_defineProperty({}, _this3.root.toLiteralString(), _objectSpread({}, _this3.rawStage)), null, _this3.name);

            if (_this3.oldStage !== freshStage.toString()) {
              _this3.oldStage = _this3.renderer.merge(freshStage).toString();
            }

            Browser.clearTimeout(_this3.refreshQueue);
          });
        }
      }
    }]);

    return AppInstance;
  }();

  return {
    root: Builder.root,
    create: Builder.create
  };
}();

var RMEElemRenderer = /*#__PURE__*/function () {
  function RMEElemRenderer(root) {
    _classCallCheck(this, RMEElemRenderer);

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


  _createClass(RMEElemRenderer, [{
    key: "merge",
    value: function merge(newStage) {
      this.updateEventListeners(this.root, newStage);

      var _this$getChildren = this.getChildren(this.root, newStage),
          _this$getChildren2 = _slicedToArray(_this$getChildren, 2),
          oldChildren = _this$getChildren2[0],
          newChildren = _this$getChildren2[1];

      if (Util.isEmpty(this.root.getChildren())) {
        this.root.render(newChildren);
      } else {
        var i = 0;

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

  }, {
    key: "getChildren",
    value: function getChildren(oldNode, newNode) {
      return [Array.of(oldNode.getChildren()).flat(), Array.of(newNode.getChildren()).flat()];
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
    value: function render(parent, newParent, oldNode, newNode, index) {
      if (!oldNode && newNode) {
        parent.append(newNode.duplicate());
      } else if (oldNode && !newNode) {
        this.tobeRemoved.push({
          parent: parent,
          child: this.wrap(parent.dom().children[index])
        });
      } else if (this.hasNodeChanged(oldNode, newNode)) {
        if (oldNode.getTagName() !== newNode.getTagName() || oldNode.dom().children.length > 0 || newNode.dom().children.length > 0) {
          this.wrap(parent.dom().children[index]).replace(newNode.duplicate());
        } else {
          oldNode.setProps(_objectSpread(_objectSpread({}, this.getBrowserSetStyle(parent, index)), newNode.getProps()));
        }
      } else {
        if (parent.dom().children.length > newParent.dom().children.length) {
          var _i2 = 0;

          var _this$getChildren3 = this.getChildren(parent, newParent),
              _this$getChildren4 = _slicedToArray(_this$getChildren3, 2),
              oldChildren = _this$getChildren4[0],
              newChildren = _this$getChildren4[1];

          while (_i2 < newChildren.length) {
            this.updateEventListeners(oldChildren[_i2], newChildren[_i2]);
            _i2++;
          }
        }

        var i = 0;
        var oldLength = oldNode ? oldNode.dom().children.length : 0;
        var newLength = newNode ? newNode.dom().children.length : 0;

        while (i < newLength || i < oldLength) {
          this.render(this.wrap(parent.dom().children[index]), this.wrap(newParent.dom().children[index]), oldNode ? this.wrap(oldNode.dom().children[i]) : null, newNode ? this.wrap(newNode.dom().children[i]) : null, i);
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

  }, {
    key: "getBrowserSetStyle",
    value: function getBrowserSetStyle(parent, index) {
      var props = this.wrap(parent.dom().children[index]).getProps();
      return props.style ? {
        style: props.style
      } : null;
    }
    /**
     * Update event listeners of the old node to event listeners of the new node.
     * @param {object} oldNode 
     * @param {object} newNode 
     */

  }, {
    key: "updateEventListeners",
    value: function updateEventListeners(oldNode, newNode) {
      var listeners = this.getEventListeners(newNode);

      if (Object.keys(listeners).length > 0) {
        oldNode.setProps(_objectSpread(_objectSpread({}, oldNode.getProps()), listeners));
      }
    }
    /**
     * Get event listeners of the node
     * @param {object} node 
     * @returns An object containing defined event listeners
     */

  }, {
    key: "getEventListeners",
    value: function getEventListeners(node) {
      var props = node.getProps();

      for (var p in props) {
        if (props.hasOwnProperty(p) && p.indexOf('on') !== 0) {
          delete props[p];
        }
      }

      return props;
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
     * Function takes two Elem objects as parameter and compares them if they are equal or have some properties changed.
     * @param {object} oldNode 
     * @param {object} newNode 
     * @returns True if the given Elem objects are the same and nothing is changed otherwise false is returned.
     */

  }, {
    key: "hasNodeChanged",
    value: function hasNodeChanged(oldNode, newNode) {
      return !!oldNode && !!newNode && oldNode.getProps(true) !== newNode.getProps(true);
    }
    /**
     * Function takes DOM node as a parameter and wraps it to Elem object.
     * @param {object} node 
     * @returns the Wrapped Elem object.
     */

  }, {
    key: "wrap",
    value: function wrap(node) {
      if (node) return Elem.wrap(node);
    }
  }]);

  return RMEElemRenderer;
}();
/**
 * Browser class contains all the rest utility functions which JavaScript has to offer from Window, Navigator, Screen, History, Location objects.
 */


var Browser = /*#__PURE__*/function () {
  function Browser() {
    _classCallCheck(this, Browser);
  }

  _createClass(Browser, null, [{
    key: "setTimeout",
    value:
    /**
     * Sets a timeout where the given callback function will be called once after the given milliseconds of time. Params are passed to callback function.
     * @param {function} callback
     * @param {number} milliseconds
     * @param {*} params
     * @returns The timeout object.
     */
    function setTimeout(callback, milliseconds) {
      for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
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
      for (var _len2 = arguments.length, params = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        params[_key2 - 2] = arguments[_key2];
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
    key: "toBase64",
    value: function toBase64(string) {
      return window.btoa(string);
    }
    /**
     * Decodes a base 64 encoded string.
     * @param {string} string
     * @returns The base64 decoded string.
     */

  }, {
    key: "fromBase64",
    value: function fromBase64(string) {
      return window.atob(string);
    }
    /**
     * Scroll once to a given location (xPos, yPos)
     * @param {number} xPos
     * @param {number} yPos
     */

  }, {
    key: "scrollTo",
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

var RMEAppComponent = /*#__PURE__*/function () {
  function RMEAppComponent(renderHook, appName, parentContext) {
    _classCallCheck(this, RMEAppComponent);

    this.store = useValue({}, appName);
    this.appName = appName;
    this.parentContext = parentContext;
    this.shouldUpdate = true;
    this.renderHook = renderHook;
    this.afterRenderTasks = [];
    this.prevProps = {};
    this.prevResult;
  }

  _createClass(RMEAppComponent, [{
    key: "render",
    value: function render(props) {
      var _this4 = this;

      var _this$store = _slicedToArray(this.store, 2),
          getState = _this$store[0],
          setState = _this$store[1];

      var nextProps = _objectSpread(_objectSpread({}, props), getState());

      var ops = {
        setState: setState,
        updateState: function updateState(next, update) {
          setState(function (state) {
            return _objectSpread(_objectSpread({}, state), Util.isFunction(next) ? next(getState()) : next);
          }, update);
        },
        isStateEmpty: function isStateEmpty() {
          return Object.keys(getState()).length === 0;
        },
        shouldComponentUpdate: function shouldComponentUpdate(shouldUpdateHook) {
          if (Util.isFunction(shouldUpdateHook)) {
            _this4.shouldUpdate = shouldUpdateHook(nextProps, _this4.prevProps) !== false;
          }
        },
        asyncTask: function asyncTask(asyncTaskHook) {
          if (Util.isFunction(asyncTaskHook)) {
            _this4.afterRenderTasks.push(asyncTaskHook);
          }
        }
      };
      var result;

      if (this.shouldUpdate) {
        result = this.renderHook(nextProps, ops);
        result = RMETemplateResolver.isTemplate(result) ? RMETemplateResolver.resolve(result, null, this.appName, this.parentContext) : result;
      } else {
        result = this.prevResult;
      }

      this.prevResult = result;
      this.prevProps = nextProps;

      if (this.afterRenderTasks.length > 0) {
        Browser.setTimeout( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _this4.afterRenderTasks.forEach( /*#__PURE__*/function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(hook) {
                      return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              return _context.abrupt("return", hook());

                            case 1:
                            case "end":
                              return _context.stop();
                          }
                        }
                      }, _callee);
                    }));

                    return function (_x) {
                      return _ref2.apply(this, arguments);
                    };
                  }());

                  _this4.afterRenderTasks.length = 0;

                case 2:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        })));
      }

      return result;
    }
  }]);

  return RMEAppComponent;
}();
/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 * @param {function} components commma separated list of components
 */


var Component = function () {
  var resolveComponent = function resolveComponent(component) {
    if (Util.isFunction(component)) {
      RMEComponentManagerV2.addComponent(component.valueOf().name, component);
    }
  };

  return function () {
    for (var _len3 = arguments.length, components = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      components[_key3] = arguments[_key3];
    }

    components.forEach(function (component) {
      return !Util.isEmpty(component.valueOf().name) && resolveComponent(component);
    });
  };
}();
/**
 * Manages RME components
 */


var RMEComponentManagerV2 = function () {
  var RMEComponentManager = /*#__PURE__*/function () {
    function RMEComponentManager() {
      _classCallCheck(this, RMEComponentManager);

      this.componentFunctionMap = {};
      this.componentInstanceMap = {};
    }

    _createClass(RMEComponentManager, [{
      key: "hasComponent",
      value: function hasComponent(name) {
        return this.componentFunctionMap[name] !== undefined;
      }
    }, {
      key: "addComponent",
      value: function addComponent(name, renderHook) {
        if (!this.hasComponent(name)) {
          this.componentFunctionMap[name] = renderHook;
        }
      }
    }, {
      key: "getComponent",
      value: function getComponent(name, props) {
        var parentContext = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var appName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var component = this.componentInstanceMap[appName + name + parentContext];

        if (!component) {
          component = new RMEAppComponent(this.componentFunctionMap[name], appName, parentContext);
          this.componentInstanceMap[appName + name + parentContext] = component;
        }

        return component.render(props);
      }
    }]);

    return RMEComponentManager;
  }();

  return new RMEComponentManager();
}();
/**
 * A CSS function will either create a new style element containing given css and other parameters 
 * or it will append to a existing style element if the element is found by given parameters.
 * @param {string} css string
 * @param {object} config properties object of the style element
 */


var CSS = function () {
  var getStyles = function getStyles(config) {
    var styles = Tree.getHead().getByTag('style');

    if (Util.isEmpty(config) && !Util.isArray(styles)) {
      return styles;
    } else if (Util.isArray(styles)) {
      return styles.find(function (style) {
        return arePropertiesSame(style.getProps(), config);
      });
    } else if (!Util.isEmpty(styles) && arePropertiesSame(styles.getProps(), config)) {
      return styles;
    }
  };

  var propsWithoutContent = function propsWithoutContent(props) {
    var newProps = _objectSpread({}, props);

    delete newProps.text;
    return newProps;
  };

  var arePropertiesSame = function arePropertiesSame(oldProps, newProps) {
    return JSON.stringify(propsWithoutContent(oldProps)) === JSON.stringify(newProps || {});
  };

  var hasStyles = function hasStyles(config) {
    return !Util.isEmpty(getStyles(config));
  };

  var hasContent = function hasContent(content, config) {
    var styles = getStyles(config);

    if (!Util.isEmpty(styles)) {
      return styles.getContent().match(content) !== null;
    }
  };

  return function (content, config) {
    if (!hasStyles(config)) {
      Tree.getHead().append(RMETemplateResolver.resolve({
        style: _objectSpread({
          content: content
        }, config)
      }));
    } else if (!hasContent(content, config)) {
      var style = getStyles(config);

      if (!Util.isEmpty(style)) {
        var prevContent = style.getContent();
        style.setContent(prevContent + content);
      }
    }
  };
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
  var Elem = /*#__PURE__*/function () {
    function Elem(type) {
      _classCallCheck(this, Elem);

      if (Util.isString(type)) {
        this.html = document.createElement(type);
      } else if (type.nodeType !== undefined && type.ownerDocument !== undefined && type.nodeType >= 1 && type.ownerDocument instanceof Document) {
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
        elem && this.html.appendChild(elem.dom());
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
    }, {
      key: "toLiteralString",
      value: function toLiteralString() {
        return RMEElemTemplater.toLiteralString(this);
      }
      /**
       * Converts this Elem object to JSON template object.
       * @param {boolean} deep default true if true children will also be templated.
       * @returns Template representation of the element tree.
       */

    }, {
      key: "toTemplate",
      value: function toTemplate(deep) {
        return RMEElemTemplater.toTemplate(this, deep);
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
        if (Util.isBoolean(json) && json === true) return JSON.stringify(RMEElemTemplater.getElementProps(this));else return RMEElemTemplater.getElementProps(this);
      }
      /**
       * Method will override old properties with the given properties.
       * @param {object} props 
       * @returns Elem instance.
       */

    }, {
      key: "setProps",
      value: function setProps(props) {
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

    }, {
      key: "render",
      value: function render() {
        var newState = [];
        var i = 0;

        for (var _len4 = arguments.length, elems = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          elems[_key4] = arguments[_key4];
        }

        var max = elems.length;

        while (i < max) {
          if (Util.isArray(elems[i])) newState = newState.concat(elems[i]);else newState.push(elems[i]);
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
        this.setAttribute('tabindex', idx);
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
        return this.getAttribute('tabindex');
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
       * @returns a value of the attribute.
       */

    }, {
      key: "getAttribute",
      value: function getAttribute(attr) {
        return this.html.getAttribute(attr);
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
        var attrNode = this.html.getAttributeNode(attr);
        if (attrNode) this.html.removeAttributeNode(attrNode);
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
        this.setAttribute('name', name);
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
        return this.getAttribute('name');
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
        this.setAttribute('type', type);
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
        return this.getAttribute('type');
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
        this.setAttribute('src', source);
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
        return this.getAttribute('src');
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
        this.setAttribute('href', href);
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
        return this.getAttribute('href');
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
        this.setAttribute('placeholder', placeholder);
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
        return this.getAttribute('placeholder');
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
        this.setAttribute('size', size);
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
        return this.getAttribute('size');
      }
      /**
       * Set maximum length of an input field.
       * @param {number} length 
       * @returns Elem instance.
       */

    }, {
      key: "setMaxLength",
      value: function setMaxLength(length) {
        this.setAttribute('maxlength', length);
        return this;
      }
      /**
       * @returns Max length of this element.
       */

    }, {
      key: "getMaxLength",
      value: function getMaxLength() {
        return this.getAttribute('maxlength');
      }
      /**
       * Set minimum length of an input field.
       * @param {number} length 
       * @returns Elem instance.
       */

    }, {
      key: "setMinLength",
      value: function setMinLength(length) {
        this.setAttribute('minlength', length);
        return this;
      }
      /**
       * @returns Min lenght of this element.
       */

    }, {
      key: "getMinLength",
      value: function getMinLength() {
        return this.getAttribute('minlength');
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
      value: function setEditable(_boolean2) {
        this.setAttribute('contenteditable', _boolean2);
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
        return this.getAttribute('contenteditable');
      }
      /**
       * Set this element disabled.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setDisabled",
      value: function setDisabled(_boolean3) {
        if (Util.isBoolean(_boolean3) && _boolean3 === true || Util.isString(_boolean3) && _boolean3 === 'disabled') {
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

    }, {
      key: "getDisabled",
      value: function getDisabled() {
        return this.getAttribute('disabled');
      }
      /**
       * Set this element checked.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setChecked",
      value: function setChecked(_boolean4) {
        if (Util.isBoolean(_boolean4) && _boolean4 === true || Util.isString(_boolean4) && _boolean4 === 'checked') {
          this.setAttribute('checked', 'checked');
          this.html.checked = true;
        } else {
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

    }, {
      key: "getChecked",
      value: function getChecked() {
        return this.getAttribute('checked');
      }
      /**
       * Set this element selected.
       * 
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setSelected",
      value: function setSelected(_boolean5) {
        if (Util.isBoolean(_boolean5) && _boolean5 === true || Util.isString(_boolean5) && _boolean5 === 'selected') {
          this.setAttribute('selected', 'selected');
        } else {
          this.removeAttribute('selected');
        }

        return this;
      }
      /**
       * Get this element selected selected attribute value.
       * 
       * @returns selected attribute value.
       */

    }, {
      key: "getSelected",
      value: function getSelected() {
        return this.getAttribute('selected');
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
        var addClassesArray = classes.trim().split(' ');
        var origClassName = this.getClasses();
        var origClassesArray = origClassName.split(' ');
        addClassesArray = addClassesArray.filter(function (clazz) {
          return origClassName.match(clazz) === null;
        });
        this.html.className = origClassesArray.concat(addClassesArray).join(' ').trim();
        return this;
      }
      /**
       * Update classes on this element. Previous classes are overridden.
       * 
       * @param {String} classes 
       */

    }, {
      key: "updateClasses",
      value: function updateClasses(classes) {
        this.addClasses(classes);
        var origClassName = this.getClasses();
        var origClassesArray = origClassName.split(' ');
        var updateClassesArray = [];
        classes.trim().split(' ').forEach(function (clazz) {
          if (origClassesArray.filter(function (cl) {
            return cl === clazz;
          }).length > 0) updateClassesArray.push(clazz);
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
      value: function setVisible(_boolean6) {
        this.html.style.visibility = _boolean6 ? "" : "hidden";
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
      value: function display(_boolean7) {
        this.html.style.display = _boolean7 ? "" : "none";
        return this;
      }
      /**
       * Set this element draggable.
       * @param {boolean} boolean 
       * @returns Elem instance.
       */

    }, {
      key: "setDraggable",
      value: function setDraggable(_boolean8) {
        this.setAttribute("draggable", _boolean8);
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

        for (var _len5 = arguments.length, params = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          params[_key5 - 1] = arguments[_key5];
        }

        while (i < params.length) {
          if (Util.isArray(params[i])) paramArray = paramArray.concat(params[i]);else paramArray.push(params[i]);
          i++;
        }

        this.setText(RMEMessagesResolver.message(_message, paramArray));
        return this;
      }
      /**
       * Do click on this element.
       * @returns Elem instance.
       */

    }, {
      key: "click",
      value: function click() {
        var _this5 = this;

        Browser.setTimeout(function () {
          return _this5.html.click();
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
        var _this6 = this;

        Browser.setTimeout(function () {
          return _this6.html.focus();
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
        var _this7 = this;

        Browser.setTimeout(function () {
          return _this7.html.blur();
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
        return RMETemplateResolver.resolve(this.toTemplate());
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

    }, {
      key: "wrapElems",
      value: function wrapElems(htmlDoc) {
        var wrapped = Array.from(htmlDoc).map(Elem.wrap);
        return wrapped.length === 1 ? wrapped[0] : wrapped;
      }
    }]);

    return Elem;
  }();
  /**
   * RenderHelper class is a helper class of the Elem class. The RenderHelper class chiefly
   * stores previous state of the Elem in an array and in a string.
   */


  var RenderHelper = /*#__PURE__*/function () {
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
/**
 * RMEElemTemplater class is able to create a Template out of an Elem object.
 */


var RMEElemTemplater = /*#__PURE__*/function () {
  function RMEElemTemplater() {
    _classCallCheck(this, RMEElemTemplater);

    this.instance;
    this.template;
    this.deep = true;
  }

  _createClass(RMEElemTemplater, [{
    key: "toTemplate",
    value: function toTemplate(elem, deep) {
      if (Util.notEmpty(deep)) this.deep = deep;
      this.resolve(elem, {});
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
      var _this8 = this;

      var resolved = this.resolveElem(elem, this.resolveProps(elem));
      Object.keys(parent).forEach(function (key) {
        if (Util.isArray(parent[key]._)) {
          parent[key]._.push(resolved);
        } else {
          _this8.extendMap(parent[key], resolved);
        }
      });
      var children = Array.of(elem.getChildren()).flat();

      if (children.length > 0 && this.deep) {
        children.forEach(function (child) {
          return _this8.resolve(child, resolved);
        });
      }

      this.template = resolved;
    }
    /**
     * Copies values from the next map into the first map
     * @param {object} map first map
     * @param {object} next next map
     */

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
        el[elName] = _objectSpread(_objectSpread({}, props), {}, {
          _: []
        });
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
      if (props["class"]) return tag + "." + props["class"].replace(/ /g, ".");else return tag;
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
        if (props.hasOwnProperty(p) && p !== 'id' && p !== 'class' && p.indexOf('on') !== 0) {
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
     * Resolves a html data-* attributes by removing '-' and setting the next character to uppercase. 
     * Resolves an aria* attirubtes by setting the next character to uppercase.
     * If the attribute is not a data-* or an aria attribute then it is directly returned.
     * @param {string} attrName 
     * @returns Resolved attribute name.
     */

  }, {
    key: "resolveAttributeNames",
    value: function resolveAttributeNames(attrName) {
      if (attrName.indexOf('data') === 0 && attrName.length > 'data'.length) {
        while (attrName.search('-') > -1) {
          attrName = attrName.replace(/-\w/, attrName.charAt(attrName.search('-') + 1).toUpperCase());
        }

        return attrName;
      } else if (attrName.indexOf('aria') === 0) {
        return attrName.replace(attrName.charAt('aria'.length), attrName.charAt('aria'.length).toUpperCase());
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
  }, {
    key: "toLiteralString",
    value: function toLiteralString(elem) {
      var props = this.resolveProps(elem);
      var string = this.resolveId(elem.getTagName().toLowerCase(), props);
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

  }], [{
    key: "toTemplate",
    value: function toTemplate(elem, deep) {
      return RMEElemTemplater.getInstance().toTemplate(elem, deep);
    }
    /**
     * Function resolves and returns properties of a given Elem object.
     * @param {object} elem 
     * @returns The properties object of the given Elem.
     */

  }, {
    key: "getElementProps",
    value: function getElementProps(elem) {
      return RMEElemTemplater.getInstance().resolveProps(elem);
    }
  }, {
    key: "toLiteralString",
    value: function toLiteralString(elem) {
      return RMEElemTemplater.getInstance().toLiteralString(elem);
    }
  }, {
    key: "getInstance",
    value: function getInstance() {
      if (!this.instance) this.instance = new RMEElemTemplater();
      return this.instance;
    }
  }]);

  return RMEElemTemplater;
}();

var Fetch = function () {
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
  var Fetch = /*#__PURE__*/function () {
    function Fetch() {
      _classCallCheck(this, Fetch);
    }
    /**
     * Does Fetch GET request. Content-Type JSON is used by default.
     * @param {string} url *Required
     * @param {string} contentType
     */


    _createClass(Fetch, [{
      key: "get",
      value: function get(url, contentType) {
        return this["do"]({
          url: url,
          init: {
            method: 'GET'
          },
          contentType: getDefaultContentType(contentType)
        });
      }
      /**
       * Does Fetch POST request. Content-Type JSON is used by default.
       * @param {string} url *Required
       * @param {*} body 
       * @param {string} contentType 
       */

    }, {
      key: "post",
      value: function post(url, body, contentType) {
        return this["do"]({
          url: url,
          body: body,
          init: {
            method: 'POST'
          },
          contentType: getDefaultContentType(contentType)
        });
      }
      /**
       * Does Fetch PUT request. Content-Type JSON is used by default.
       * @param {string} url *Required
       * @param {*} body 
       * @param {string} contentType 
       */

    }, {
      key: "put",
      value: function put(url, body, contentType) {
        return this["do"]({
          url: url,
          body: body,
          init: {
            method: 'PUT'
          },
          contentType: getDefaultContentType(contentType)
        });
      }
      /**
       * Does Fetch DELETE request. Content-Type JSON is used by default.
       * @param {string} url 
       * @param {string} contentType 
       */

    }, {
      key: "delete",
      value: function _delete(url, contentType) {
        return this["do"]({
          url: url,
          init: {
            method: 'DELETE'
          },
          contentType: getDefaultContentType(contentType)
        });
      }
      /**
       * Does Fetch PATCH request. Content-Type JSON is used by default.
       * @param {string} url 
       * @param {*} body
       * @param {string} contentType
       */

    }, {
      key: "patch",
      value: function patch(url, body, contentType) {
        var _this$do;

        return this["do"]((_this$do = {
          url: url
        }, _defineProperty(_this$do, "url", url), _defineProperty(_this$do, "body", body), _defineProperty(_this$do, "init", {
          method: 'PATCH'
        }), _defineProperty(_this$do, "contentType", getDefaultContentType(contentType)), _this$do));
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

    }, {
      key: "do",
      value: function _do(config) {
        if (Util.isEmpty(config) || !Util.isObject(config) || Util.isEmpty(config.url)) {
          throw new Error("Error in fetch config object ".concat(JSON.stringify(config), ", url must be set"));
        }

        if (!config.init) config.init = {};

        if (config.contentType && config.contentType !== 'buffer') {
          if (!config.init.headers) config.init.headers = new Headers({});
          if (!config.init.headers.has('Content-Type')) config.init.headers.set('Content-Type', config.contentType);
        }

        if ((config.body || config.init.body) && isContentType(config.contentType, Http.JSON)) {
          config.init.body = JSON.stringify(config.body || config.init.body);
        } else if (config.body) {
          config.init.body = config.body;
        }

        if (config.method) {
          config.init.method = config.method;
        }

        return fetch(config.url, config.init).then( /*#__PURE__*/function () {
          var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(response) {
            var res;
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (response.ok) {
                      _context3.next = 2;
                      break;
                    }

                    throw Error("Error in requesting url: ".concat(config.url, ", method: ").concat(config.init.method));

                  case 2:
                    if (!isContentType(config.contentType, Http.JSON)) {
                      _context3.next = 7;
                      break;
                    }

                    _context3.next = 5;
                    return response.text();

                  case 5:
                    res = _context3.sent;
                    return _context3.abrupt("return", res.length > 0 ? JSON.parse(res) : res);

                  case 7:
                    if (!isContentType(config.contentType, Http.TEXT_PLAIN)) {
                      _context3.next = 9;
                      break;
                    }

                    return _context3.abrupt("return", response.text());

                  case 9:
                    if (!isContentType(config.contentType, Http.FORM_DATA)) {
                      _context3.next = 11;
                      break;
                    }

                    return _context3.abrupt("return", response.formData());

                  case 11:
                    if (!isContentType(config.contentType, Http.OCTET_STREAM)) {
                      _context3.next = 13;
                      break;
                    }

                    return _context3.abrupt("return", response.blob());

                  case 13:
                    if (!(config.contentType === 'buffer')) {
                      _context3.next = 15;
                      break;
                    }

                    return _context3.abrupt("return", response.arrayBuffer());

                  case 15:
                    return _context3.abrupt("return", response);

                  case 16:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3);
          }));

          return function (_x2) {
            return _ref3.apply(this, arguments);
          };
        }());
      }
    }]);

    return Fetch;
  }();

  var isContentType = function isContentType(contentTypeA, contentTypeB) {
    return Util.notEmpty(contentTypeA) && contentTypeA.search(contentTypeB) > -1;
  };

  var getDefaultContentType = function getDefaultContentType(contentType) {
    if (contentType === undefined) {
      return Http.JSON;
    } else if (contentType === null) {
      return null;
    } else {
      return contentType;
    }
  };

  return new Fetch();
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
   *  }
   * 
   * If contentType is not defined, application/json is used, if set to null, default is used, otherwise used defined is used.
   * If contentType is application/json, data is automatically stringified with JSON.stringify()
   * 
   * Http class automatically tries to parse reuqest.responseText to JSON using JSON.parse().
   * If parsing succeeds, parsed JSON will be set on request.responseJSON attribute.
   */
  var Http = /*#__PURE__*/function () {
    function Http(config) {
      _classCallCheck(this, Http);

      config.contentType = config.contentType === undefined ? Http.JSON : config.contentType;

      if (window.Promise) {
        this.self = new HttpPromiseAjax(config).instance();
      } else {
        this.self = new HttpAjax(config);
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
          method: 'GET',
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
          method: 'POST',
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
          method: 'PUT',
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
          method: 'DELETE',
          url: url,
          data: undefined,
          contentType: requestContentType
        }).instance();
      }
      /**
       * Do PATH XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
       * @param {string} url *Required
       * @param {*} data
       * @param {*} requestContentType 
       */

    }, {
      key: "patch",
      value: function patch(url, data, requestContentType) {
        return new Http({
          method: "PATCH",
          url: url,
          data: data,
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
    }]);

    return Http;
  }();
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

  var HttpAjax = /*#__PURE__*/function () {
    function HttpAjax(config) {
      _classCallCheck(this, HttpAjax);

      this.config = config;
      this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
      this.xhr = new XMLHttpRequest();
      this.xhr.open(config.method, config.url);
      if (config.contentType) this.xhr.setRequestHeader('Content-Type', config.contentType);
      if (config.headers) setXhrHeaders(this.xhr, config.headers);
    }

    _createClass(HttpAjax, [{
      key: "then",
      value: function then(successHandler, errorHandler) {
        var _this9 = this;

        this.xhr.onload = function () {
          _this9.xhr.responseJSON = tryParseJSON(_this9.xhr.responseText);
          isResponseOK(_this9.xhr.status) ? successHandler(isContentTypeJson(_this9.config.contentType) ? resolveResponse(_this9.xhr.response) : _this9.xhr) : errorHandler(_this9.xhr);
        };

        if (this.config.onProgress) {
          this.xhr.onprogress = function (event) {
            _this9.config.onProgress(event);
          };
        }

        if (this.config.onTimeout) {
          this.xhr.ontimeout = function (event) {
            _this9.config.onTimeout(event);
          };
        }

        this.xhr.onerror = function () {
          _this9.xhr.responseJSON = tryParseJSON(_this9.xhr.responseText);
          if (errorHandler) errorHandler(_this9.xhr);
        };

        this.data ? this.xhr.send(this.data) : this.xhr.send();
        return this;
      }
    }, {
      key: "catch",
      value: function _catch(errorHandler) {
        var _this10 = this;

        this.xhr.onerror = function () {
          _this10.xhr.responseJSON = tryParseJSON(_this10.xhr.responseText);
          if (errorHandler) errorHandler(_this10.xhr);
        };
      }
    }]);

    return HttpAjax;
  }();
  /**
   * XMLHttpRequest using the Promise.
   */


  var HttpPromiseAjax = /*#__PURE__*/function () {
    function HttpPromiseAjax(config) {
      _classCallCheck(this, HttpPromiseAjax);

      this.promise = new Promise(function (resolve, reject) {
        new HttpAjax(config).then(function (response) {
          return resolve(response);
        }, function (error) {
          return reject(error);
        });
      });
    }

    _createClass(HttpPromiseAjax, [{
      key: "instance",
      value: function instance() {
        return this.promise;
      }
    }]);

    return HttpPromiseAjax;
  }();

  var resolveResponse = function resolveResponse(response) {
    var resp = tryParseJSON(response);
    return Util.notEmpty(resp) ? resp : response;
  };

  var setXhrHeaders = function setXhrHeaders(xhr, headers) {
    Object.keys(headers).forEach(function (header) {
      return xhr.setRequestHeader(header, headers[header]);
    });
  };

  var isResponseOK = function isResponseOK(status) {
    return Boolean([200, 201, 202, 203, 204, 205, 206, 207, 208, 226].find(function (num) {
      return num === status;
    }));
  };

  var isContentTypeJson = function isContentTypeJson(contentType) {
    return contentType && (Http.JSON.search(contentType.toLowerCase()) > -1 || contentType.toLowerCase().search(Http.JSON) > -1);
  };

  var tryParseJSON = function tryParseJSON(text) {
    try {
      return JSON.parse(text);
    } catch (e) {}
  };

  return Http;
}();
/**
 * Key class does not have any methods as it only contains key mappings for keyevent. For example:
 * 
 * onKeyDown(function(event) {
 *  if(event.key === Key.ENTER)
 *    //do something.
 * });
 */


var Key = /*#__PURE__*/_createClass(function Key() {
  _classCallCheck(this, Key);
});
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

var useMessages = function () {
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
  return function (locale, loader) {
    if (Util.isFunction(loader)) {
      RMEMessagesResolver.load(function (locale, setMessages) {
        return setMessages(loader(locale));
      });
    }

    if (Util.isString(locale) || locale instanceof Event) {
      RMEMessagesResolver.lang(locale);
    }

    return RMEMessagesResolver.locale();
  };
}();

var useMessage = function () {
  /**
   * UseMessage function takes a message key and possible message parameters and attempts to resolve them to a
   * translated message. If the given key could not be resolved then it will be returned.
   * @param {string} key message key
   * @param {array} params message params
   * @returns Resolved message
   */
  return function (key) {
    for (var _len6 = arguments.length, params = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      params[_key6 - 1] = arguments[_key6];
    }

    return RMEMessagesResolver.message.apply(RMEMessagesResolver, [key].concat(params));
  };
}();

var RMEMessagesResolver = function () {
  /**
   * Messages class handles internationalization. The class offers public methods that enable easy 
   * using of translated content.
   */
  var Messages = /*#__PURE__*/function () {
    function Messages() {
      var _this11 = this;

      _classCallCheck(this, Messages);

      this.ins = this;
      this.messages = [];
      this.locale = '';
      this.translated = [];

      this.load = function () {};

      this.messagesType;
      this.ready = false;
      ready(function () {
        _this11.ready = true;

        _this11.runTranslated();
      });
    }
    /**
     * Loader function is used to load new messages.
     * The loader function is called automatically when the locale used in the Messages changes.
     * @param {function} loader
     */


    _createClass(Messages, [{
      key: "setLoad",
      value: function setLoad(loader) {
        if (!Util.isFunction(loader)) {
          throw new Error('Message loader must be a function');
        }

        this.load = loader;
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

    }, {
      key: "getMessage",
      value: function getMessage(text) {
        for (var _len7 = arguments.length, params = new Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
          params[_key7 - 1] = arguments[_key7];
        }

        if (Util.isEmpty(params.flat(2))) {
          return this.resolveMessage(text);
        } else {
          var msg = this.resolveMessage(text);
          return this.resolveParams(msg, params.flat(2));
        }
      }
      /**
       * Resolves translated message key and returns a resolved message if exist
       * otherwise returns the given key.
       * @param {string} text key
       * @returns A resolved message if exist otherwise the given key.
       */

    }, {
      key: "resolveMessage",
      value: function resolveMessage(text) {
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
       * @param {string} text key
       * @returns A resolved message
       */

    }, {
      key: "resolveMessagesArray",
      value: function resolveMessagesArray(text) {
        var i = 0;
        var msg = text;

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

    }, {
      key: "resolveParams",
      value: function resolveParams(msg, params) {
        if (Util.notEmpty(msg)) {
          params.forEach(function (param, i) {
            return msg = msg.replace("{".concat(i, "}"), param);
          });
          return msg;
        }
      }
      /**
       * Function goes through the translated objects array and sets a translated message to the translated elements.
       */

    }, {
      key: "runTranslated",
      value: function runTranslated() {
        if (this.ready) {
          RMEAppManager.getAll().forEach(function (app) {
            return app.refresh();
          });
        }
      }
      /**
       * Returns currently used locale string used by the Messages.
       * @returns Locale string
       */

    }], [{
      key: "locale",
      value: function locale() {
        return Messages.instance.locale;
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
        var nextLocale;

        if (locale instanceof Event) {
          locale.preventDefault();
          var el = Elem.wrap(locale.target);
          nextLocale = el.getHref() || el.getValue() || el.getText();
        } else if (Util.isString(locale)) {
          nextLocale = locale;
        } else {
          throw new Error('The parameter locale must be an instance of the Event or a string');
        }

        if (Util.notEmpty(nextLocale)) {
          Messages.instance.setLocale(nextLocale).load.call(Messages.instance, Messages.locale(), Messages.instance.setMessages.bind(Messages.instance));
        }
      }
      /**
       * Message function returns a message from the message bundle or a message key if the message was not found.
       * The function also supports message parameters that can be given as a comma separeted list.
       * @param {string} text 
       * @param {*} params 
       * @returns A resolved message or the given key if the message is not found.
       */

    }, {
      key: "message",
      value: function message(text) {
        for (var _len8 = arguments.length, params = new Array(_len8 > 1 ? _len8 - 1 : 0), _key8 = 1; _key8 < _len8; _key8++) {
          params[_key8 - 1] = arguments[_key8];
        }

        return Messages.instance.getMessage(text, params);
      }
      /**
       * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
       * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
       * Set a message loader function.
       * The function receives two parameters a locale and a setMessages function. The locale is currently used locale
       * and the setMessages function applies the given messages.
       */

    }, {
      key: "load",
      value: function load(loader) {
        Messages.instance.setLoad(loader);
      }
    }, {
      key: "instance",
      get: function get() {
        if (!this.ins) this.ins = new Messages();
        return this.ins;
      }
    }]);

    return Messages;
  }();

  _defineProperty(Messages, "ins", void 0);

  return {
    lang: Messages.lang,
    message: Messages.message,
    load: Messages.load,
    locale: Messages.locale
  };
}();
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


var script = function () {
  var addScript = function addScript(elem) {
    var scripts = Tree.getHead().getByTag('script');

    if (scripts.length > 0) {
      var lastScript = scripts[scripts.length - 1];
      lastScript.after(elem);
    } else {
      Tree.getHead().append(elem);
    }
  };

  return function (source, options) {
    if (Util.notEmpty(source)) {
      addScript(RMETemplateResolver.resolve({
        script: _objectSpread({
          src: source
        }, options)
      }));
    }
  };
}();
/**
 * The function adds a callback function into the callback queue. The queue is invoked in the
 * function definition order. The queue will be run when the DOM tree is ready and
 * then the it is cleared.
 */


var ready = function () {
  var callbacks = [];
  document.addEventListener("readystatechange", function () {
    if (document.readyState === "complete") {
      callbacks.forEach(function (callback) {
        return callback();
      });
      callbacks.length = 0;
    }
  });
  return function (callback) {
    callbacks.push(callback);
  };
}();
/**
 * The hash based router implementation. The router is used via invoking the useHashRouter function.
 * This router is ment for the single page applications.
 */


var RMEHashRouter = function RMEHashRouter(props, _ref4) {
  var asyncTask = _ref4.asyncTask,
      updateState = _ref4.updateState;
  var routes = props.routes,
      _props$url = props.url,
      url = _props$url === void 0 ? location.hash : _props$url,
      prevUrl = props.prevUrl,
      prevRoute = props.prevRoute,
      globalScrollTop = props.globalScrollTop,
      init = props.init;

  if (!routes) {
    return null;
  }

  if (!init) {
    RMERouterContext.setRouter(routes, function (url) {
      updateState({
        url: url
      });
    });
    asyncTask(function () {
      window.addEventListener('hashchange', function () {
        updateState({
          init: true,
          url: location.hash
        });
      });
    });
  }

  var route;

  if (url !== prevUrl) {
    route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.hashMatch);
    asyncTask(function () {
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
      asyncTask(function () {
        return route.onAfter(route);
      });
    }

    if (route.hide) {
      location.href = prevUrl;
    }

    if (window.scrollY > 0 && (route.scrolltop === true || route.scrolltop === undefined && globalScrollTop)) {
      scrollTo(0, 0);
    }
  }

  return {
    _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
  };
};
/**
 * Simple router implementation ment to be only used in cases where the route is navigated only once after the page load.
 * The router is used via invoking the useAutoUrlRouter function. This router is not ment for the single page applications.
 */


var RMEOnLoadUrlRouter = function RMEOnLoadUrlRouter(props, _ref5) {
  var asyncTask = _ref5.asyncTask;
  var routes = props.routes;

  if (!routes) {
    return null;
  }

  var route = RMERouterUtils.findRoute(location.pathname, routes, RMERouterUtils.urlMatch);

  if (Util.notEmpty(route)) {
    if (Util.isFunction(route.onBefore)) {
      route.onBefore(route);
    }

    if (Util.isFunction(route.onAfter)) {
      asyncTask(function () {
        return route.onAfter(route);
      });
    }
  }

  return {
    _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
  };
};
/**
 * The URL based router implementation. The router is used via invoking the useUrlRouter function.
 * This router is ideal for the single page applications. Router navigation is handled by the useRouter function.
 */


var RMEUrlRouter = function RMEUrlRouter(props, _ref6) {
  var updateState = _ref6.updateState,
      asyncTask = _ref6.asyncTask;
  var routes = props.routes,
      url = props.url,
      prevUrl = props.prevUrl,
      prevRoute = props.prevRoute,
      skipPush = props.skipPush,
      init = props.init,
      globalScrollTop = props.globalScrollTop;

  if (!routes) {
    return null;
  }

  if (!init) {
    var updateUrl = function updateUrl(url, skipPush) {
      updateState({
        init: true,
        url: url !== null && url !== void 0 ? url : location.pathname,
        skipPush: skipPush
      });
    };

    RMERouterContext.setRouter(routes, function (url) {
      return updateUrl(url);
    });
    asyncTask(function () {
      window.addEventListener('popstate', function () {
        return updateUrl(undefined, true);
      });
      updateUrl(undefined, true);
    });
  }

  var route;

  if (url !== prevUrl) {
    route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.urlMatch);
    asyncTask(function () {
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
      asyncTask(function () {
        return route.onAfter(route);
      });
    }

    if (!route.hide && url !== prevUrl && !skipPush) {
      history.pushState(null, null, url);
    }

    if (window.scrollY > 0 && (route.scrolltop === true || route.scrolltop === undefined && globalScrollTop)) {
      scrollTo(0, 0);
    }
  }

  return {
    _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
  };
};

var RMERouterContext = function () {
  var RouterContext = /*#__PURE__*/function () {
    function RouterContext() {
      _classCallCheck(this, RouterContext);

      this.ins;
      this.routers = [];
    }
    /**
     * Set a router into the context store by the key and the value.
     * @param {string} key the router key
     * @param {Function} value the router routes and the navigation hook
     */


    _createClass(RouterContext, [{
      key: "set",
      value: function set(key, value) {
        if (!!key && !!value && !this.has(key)) {
          this.routers.push(_objectSpread({
            key: key
          }, value));
        }
      }
      /**
       * Searches fo the routers by the router key if router is found the function will return true.
       * @param {string} key 
       * @returns True if found otherwise false
       */

    }, {
      key: "has",
      value: function has(key) {
        return !!this.routers.find(function (route) {
          return route.key === key;
        });
      }
      /**
       * Searches the router by the url. The navigation hook of the last mathced router is returned.
       * If no routers match then an empty function will be returned instead.
       * @param {string} url 
       * @returns The router navigation hook
       */

    }, {
      key: "get",
      value: function get(url) {
        var found;
        var prevFoundRouter;

        if (url.match(/^\/[^#]/) || url === '/') {
          var urlRouters = this.routers.filter(function (router) {
            return router.key.match(/^:\//);
          });
          found = urlRouters.find(function (router, idx) {
            var route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.urlMatch);

            if (!!route) {
              prevFoundRouter = router;
            }

            return !!route && idx === urlRouters.length - 1;
          });
          found = found || prevFoundRouter;
        } else {
          var hashRouters = this.routers.filter(function (router) {
            return router.key.match(/^:#?/);
          });
          found = hashRouters.find(function (router, idx) {
            var route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.hashMatch);

            if (!!route) {
              prevFoundRouter = router;
            }

            return !!route && idx === hashRouters.length - 1;
          });
          found = found || prevFoundRouter;
        }

        return !!found ? found.navigateHook : function () {
          return undefined;
        };
      }
      /**
       * Creates a string key from the route array
       * @param {array} routes 
       * @returns {string} RouterContext key
       */

    }], [{
      key: "createContextKey",
      value: function createContextKey(routes) {
        return ":".concat(routes.map(function (route) {
          return route.route;
        }).join(':'));
      }
      /**
       * Navigate to the given url. Function attempts to find the router by the url and
       * if found the navigation hook of the router is invoked with the url.
       * @param {string} url 
       */

    }, {
      key: "navigateTo",
      value: function navigateTo(url) {
        RouterContext.instance.get(RMERouterUtils.getUrlPath(url))(url);
      }
      /**
       * Set the route array and the router navigate hook into the RouterContext store
       * @param {array} routes the router routes
       * @param {Function} navigateHook the router navigation hook
       */

    }, {
      key: "setRouter",
      value: function setRouter(routes, navigateHook) {
        RouterContext.instance.set(RouterContext.createContextKey(routes), {
          routes: routes,
          navigateHook: navigateHook
        });
      }
    }, {
      key: "instance",
      get: function get() {
        if (!this.ins) {
          this.ins = new RouterContext();
        }

        return this.ins;
      }
    }]);

    return RouterContext;
  }();

  return RouterContext;
}();

var RMERouterUtils = function () {
  /**
   * Cut the protocol and the domain off from the url if exist.
   * For example https://www.example.com/example -> /example
   * @param {string} url 
   * @returns The path of the url.
   */
  var getUrlPath = function getUrlPath(url) {
    return url.replace(/\:{1}\/{2}/, '').match(/\/{1}.*/).join();
  };
  /**
   * Function checks if the given URLs match and returns true if they match otherwise false is returned.
   * @param {string} oldUrl 
   * @param {string} newUrl 
   * @returns True or false
   */


  var urlMatch = function urlMatch(oldUrl, newUrl) {
    oldUrl = Util.isString(oldUrl) ? oldUrl.replace(/\*/g, '.*').replace(/\/{2,}/g, '/') : oldUrl;
    var path = getUrlPath(newUrl);
    var found = path.match(oldUrl);

    if (Util.notEmpty(found)) {
      found = found.join();
    }

    return found === path && new RegExp(oldUrl).test(newUrl);
  };
  /**
   * Function checks if the given URLs match and returns true if they match otherwise false is returned.
   * @param {string} oldUrl 
   * @param {string} newUrl 
   * @returns True or false
   */


  var hashMatch = function hashMatch(oldUrl, newUrl) {
    if (Util.isString(oldUrl)) {
      oldUrl = oldUrl.replace(/\*/g, '.*');

      if (oldUrl.charAt(0) !== '#') {
        oldUrl = "#".concat(oldUrl);
      }
    }

    var hash = newUrl.match(/\#{1}.*/).join();
    var found = hash.match(oldUrl);
    found = Util.notEmpty(found) ? found.join() : null;
    return found === hash && new RegExp(oldUrl).test(newUrl);
  };
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


  var findRoute = function findRoute(url, routes, matcherHook) {
    return url && routes.find(function (route) {
      return matcherHook(route.route, url);
    });
  };
  /**
   * Resolves the given element into a Template object
   * @param {string|Function|Elem} elem 
   * @param {object} props 
   * @returns Template object
   */


  var resolveRouteElem = function resolveRouteElem(elem, props) {
    if (Util.isFunction(elem) && RMEComponentManagerV2.hasComponent(elem.valueOf().name)) {
      return _defineProperty({}, elem.valueOf().name, props);
    } else if (Util.isString(elem) && RMEComponentManagerV2.hasComponent(elem)) {
      return _defineProperty({}, elem, props);
    } else {
      return {
        _: elem.toTemplate()
      };
    }
  };

  return {
    getUrlPath: getUrlPath,
    findRoute: findRoute,
    urlMatch: urlMatch,
    hashMatch: hashMatch,
    resolveRouteElem: resolveRouteElem
  };
}();

var useHashRouter = function () {
  /**
   * The useHashRouter function creates and returns the hash based router component.
   * The router is suitable for single page applications.
   * @param {array} routes router routes
   * @param {object} settings router settings
   */
  return function (routes) {
    var scrollTop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    Component(RMEHashRouter);
    return {
      RMEHashRouter: {
        routes: routes,
        globalScrollTop: scrollTop
      }
    };
  };
}();

var useOnLoadUrlRouter = function () {
  /**
   * The useAutoUrlRouter function creates and returns the url based router component.
   * The router is suitable for web pages that only load one route once one the page load.
   * @param {array} routes router routes
   */
  return function (routes) {
    Component(RMEOnLoadUrlRouter);
    return {
      RMEOnLoadUrlRouter: {
        routes: routes
      }
    };
  };
}();
/**
 * The useUrlRouter function creates and returns the url based router component.
 * The router is suitable for single page applications.
 * @param {array} routes router routes
 * @param {object} settings router settings
 */


var useUrlRouter = function () {
  return function (routes) {
    var scrollTop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    Component(RMEUrlRouter);
    return {
      RMEUrlRouter: {
        routes: routes,
        globalScrollTop: scrollTop
      }
    };
  };
}();

var useRouter = function () {
  /**
   * The useRouter function handles the navigation of the last matched router in the RouterContext.
   * This function is needed to handle the navigation when using the single page page application url router.
   * The parameter url can either be a string or an event. If the url is an event then the target url is read from the event.target.href attribute.
   * @param {string|Event} url the url to navigate to
   */
  return function (url) {
    if (Util.isString(url)) {
      RMERouterContext.navigateTo(url);
    } else if (url instanceof Event) {
      url.preventDefault();
      RMERouterContext.navigateTo(url.target.href);
    }
  };
}();

var RMETemplateFragmentHelper = function () {
  // Fragment key can be any number of underscores (_).
  var FRAGMENT_REGEXP = /^_+$/g;

  var RMETemplateFragmentHelper = /*#__PURE__*/function () {
    function RMETemplateFragmentHelper() {
      _classCallCheck(this, RMETemplateFragmentHelper);
    }

    _createClass(RMETemplateFragmentHelper, [{
      key: "getFragmentKey",
      value:
      /**
       * Function takes the RME template as a parameter and tries to resolve a
       * fragment key from the given template.
       * @param {*} template 
       * @returns The fragment key if found otherwise undefined is returned.
       */
      function getFragmentKey(template) {
        return Object.keys(template).find(this.isFragmentKey);
      }
      /**
       * Function takes the RME template as a parameter and tries to resolve the 
       * fragment value from the given template.
       * @param {*} template 
       * @param {*} templateValue 
       * @returns The fragment template value if found otherwise undefined is returned.
       */

    }, {
      key: "resolveFragmentValue",
      value: function resolveFragmentValue(template, templateValue) {
        var fragmentKey = this.getFragmentKey(template);
        return template[fragmentKey] || template.fragment || templateValue;
      }
      /**
       * Function takes the RME template as a parameter and checks if the parameter is type fragment. 
       * If the parameter is a fragment type the function will return true
       * otherwise false is returned.
       * @param {*} template 
       * @returns True if the parameter is type fragment otherwise false is returned.
       */

    }, {
      key: "isFragment",
      value: function isFragment(template) {
        return Util.notEmpty(template) && (template === 'fragment' || Boolean(this.getFragmentKey(template)));
      }
      /**
       * Function will check if the given key is a fragment key. The function will
       * return true if the key is a fragment key otherwise false is returned.
       * @param {string} key 
       * @returns True if the key is a fragment key otherwise false is returned.
       */

    }, {
      key: "isFragmentKey",
      value: function isFragmentKey(key) {
        return key.match(FRAGMENT_REGEXP) || key.indexOf('fragment') === 0;
      }
    }]);

    return RMETemplateFragmentHelper;
  }();

  return new RMETemplateFragmentHelper();
}();

var RMETemplateResolver = function () {
  /**
   * Template class reads a JSON format notation and creates an element tree from it.
   * The Template class has only one public method resolve that takes the template as parameter and returns 
   * the created element tree.
   */
  var Template = /*#__PURE__*/function () {
    function Template() {
      _classCallCheck(this, Template);

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


    _createClass(Template, [{
      key: "setTemplateAndResolve",
      value: function setTemplateAndResolve(template, parent) {
        var appName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var context = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
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

    }, {
      key: "resolveRootAndTemplate",
      value: function resolveRootAndTemplate() {
        var key = Object.keys(this.template).shift();
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

    }, {
      key: "resolveTemplateProperties",
      value: function resolveTemplateProperties(template, parent) {
        var attrs = [];
        var listeners = [];
        var children = [];

        if (Util.isString(template) || Util.isNumber(template)) {
          if (Util.isString(template) && Template.isMessage(template)) {
            attrs.push({
              key: 'message',
              val: template
            });
          } else {
            attrs.push({
              key: 'text',
              val: template
            });
          }
        } else if (Util.isArray(template)) {
          template.forEach(function (obj) {
            var key = Object.keys(obj).shift();
            var val = Object.values(obj).shift();
            children.push({
              key: key,
              val: Template.isComponent(key) && Util.isFunction(val) ? {} : val
            });
          });
        } else if (Util.isObject(template)) {
          Object.keys(template).forEach(function (key, i) {
            if (Template.isAttr(key, parent)) {
              attrs.push({
                key: key,
                val: template[key]
              });
            } else if (Template.isEventKeyVal(key, template[key])) {
              listeners.push({
                parentProp: parent[key],
                func: template[key]
              });
            } else if (Template.isTag(Template.getElementName(key))) {
              children.push({
                key: key,
                val: template[key]
              });
            } else if (Template.isComponent(key)) {
              children.push({
                key: key,
                val: !Util.isFunction(template[key]) ? template[key] : {}
              });
            } else if (RMETemplateFragmentHelper.isFragmentKey(key)) {
              children.push({
                key: key,
                val: template[key]
              });
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

    }, {
      key: "resolveTemplate",
      value: function resolveTemplate(template, parent, round, parentContext) {
        var _this12 = this;

        var _this$resolveTemplate = this.resolveTemplateProperties(template, parent),
            _this$resolveTemplate2 = _slicedToArray(_this$resolveTemplate, 3),
            attrs = _this$resolveTemplate2[0],
            listeners = _this$resolveTemplate2[1],
            children = _this$resolveTemplate2[2];

        attrs.forEach(function (attr) {
          return Template.resolveAttributes(parent, attr.key, _this12.resolveFunctionValue(attr.val, parent));
        });
        listeners.forEach(function (listener) {
          return _this12.bindEventToElement(parent, listener.func, listener.parentProp);
        });
        children.forEach(function (rawChild, idx) {
          if (RMETemplateFragmentHelper.isFragmentKey(rawChild.key)) {
            _this12.resolveNextParent(rawChild.val, parent, round, parentContext + rawChild.key);
          } else {
            var child = _this12.resolveChild(rawChild.key, rawChild.val, parent, round, idx, parentContext);

            parent.append(child);

            if (!Template.isComponent(rawChild.key)) {
              _this12.resolveNextParent(rawChild.val, child, round, parentContext);
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

    }, {
      key: "resolveChild",
      value: function resolveChild(key, val, parent, round, invoked) {
        var parentContext = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
        var name = Template.getElementName(key);

        if (RMEComponentManagerV2.hasComponent(name)) {
          var component = RMEComponentManagerV2.getComponent(name, this.resolveComponentLiteralVal(val), "".concat(parentContext).concat(round).concat(invoked), this.appName);

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

    }, {
      key: "resolveComponentLiteralVal",
      value: function resolveComponentLiteralVal(val) {
        if (Util.isString(val) && Template.isMessage(val)) {
          return {
            message: val
          };
        } else if (Util.isString(val) || Util.isNumber(val)) {
          return {
            text: val
          };
        } else {
          return val;
        }
      }
      /**
       * Resolves next parent element and its' attributes.
       * @param {object} obj 
       * @param {Elem} parent 
       * @param {number} round 
       * @param {string} parentContext 
       */

    }, {
      key: "resolveNextParent",
      value: function resolveNextParent(obj, parent, round) {
        var _this13 = this;

        var parentContext = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
        var arr = Array.of(this.resolveFunctionValue(obj, parent)).flat();
        var parentTag = Util.isEmpty(parent) ? parentContext : parentContext + parent.getTagName().toLowerCase();
        arr.forEach(function (item, i) {
          return _this13.resolveTemplate(item, parent, round, "".concat(_this13.context).concat(parentTag, "[").concat(i, "]"));
        });
      }
      /**
       * Bind event listener from the source function to the target function.
       * @param {Elem} elemInstance 
       * @param {function} sourceFunction 
       * @param {function} targetFunction 
       */

    }, {
      key: "bindEventToElement",
      value: function bindEventToElement(elemInstance, sourceFunction, targetFunction) {
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

    }, {
      key: "resolveFunctionValue",
      value: function resolveFunctionValue(value, parent) {
        return Util.isFunction(value) ? value.call(parent, parent) : value;
      }
      /**
       * Function will set String or Number values for the given element.
       * @param {object} elem 
       * @param {*} value 
       */

    }, {
      key: "resolveElement",
      value:
      /**
       * Resolves a element (HTML tag) and some basic attributes from the given tag.
       * @param {string} tag
       * @param {object} obj
       * @returns Null or resolved Elem instance elemenet.
       */
      function resolveElement(tag, obj) {
        var resolved = null;
        var match = [];
        var el = Template.getElementName(tag);

        if (Util.isString(el) && Template.isTag(el)) {
          resolved = new Elem(el);
        } else {
          resolved = obj; // for component parent element
        }

        match = tag.match(/[a-z0-9]+\#[a-zA-Z0-9\-]+/); //find id

        if (!Util.isEmpty(match)) resolved.setId(match.join().replace(/[a-z0-9]+\#/g, ""));
        match = this.cutAttributesIfFound(tag).match(/\.[a-zA-Z-0-9\-]+/g); //find classes

        if (!Util.isEmpty(match)) resolved.addClasses(match.join(" ").replace(/\./g, ""));
        match = tag.match(/\[[a-zA-Z0-9\= \:\(\)\#\-\_\/\.&%@!?£$+¤|;\\<\\>\\{}"]+\]/g); //find attributes

        if (!Util.isEmpty(match)) resolved = Template.addAttributes(resolved, match);
        return resolved;
      }
      /**
       * Function will cut off the element tag attributes if found.
       * @param {string} tag 
       * @returns Element tag without attributes.
       */

    }, {
      key: "cutAttributesIfFound",
      value: function cutAttributesIfFound(tag) {
        var idx = tag.indexOf('[');
        return tag.substring(0, idx > 0 ? idx : tag.length);
      }
      /**
       * Adds resolved attributes to an element.
       * @param {object} elem
       * @param {array} elem
       * @returns The given elem instance.
       */

    }], [{
      key: "resolveStringNumber",
      value: function resolveStringNumber(elem, value) {
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

    }, {
      key: "isMessage",
      value: function isMessage(message) {
        message = Template.normalizeMessageString(message);
        return Util.notEmpty(RMEMessagesResolver.message(message)) && RMEMessagesResolver.message(message) != message;
      }
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

    }, {
      key: "resolveAttributes",
      value: function resolveAttributes(elem, key, val) {
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

    }, {
      key: "resolvePlaceholder",
      value: function resolvePlaceholder(elem, key, val) {
        var params = Template.getMessageParams(val);
        var message = Template.normalizeMessageString(val);
        elem.setAttribute(key, Template.isMessage(val) ? RMEMessagesResolver.message(message, params) : val);
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
        elem.message(Template.normalizeMessageString(message), Template.getMessageParams(message));
      }
      /**
       * Function will return message parameters in an array if found.
       * @param {string} message 
       * @returns Message params in the array or null if no params found.
       */

    }, {
      key: "getMessageParams",
      value: function getMessageParams(message) {
        var match = Template.getMessageParameterString(message);
        match = match && match.join().replace(/({|}|:|;)/g, match.join()).split(match.join());
        return match && match.filter(Util.notEmpty);
      }
      /**
       * Get the parameter match array from the message string if found.
       * @param {string} message 
       * @returns The match array or null.
       */

    }, {
      key: "getMessageParameterString",
      value: function getMessageParameterString(message) {
        return message.match(/\:?(\{.*\}\;?)/g);
      }
      /**
       * Removes parameter string from the message string if present.
       * @param {string} message 
       * @returns The normalized message string.
       */

    }, {
      key: "normalizeMessageString",
      value: function normalizeMessageString(message) {
        var params = Template.getMessageParameterString(message);
        return Util.notEmpty(params) ? message.replace(params.join(), '') : message;
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
       * Function will try to parse an element name from the given string. If the given string
       * is no empty a matched string is returned. If the given string is empty nothing is returned
       * @param {string} str 
       * @returns The matched string.
       */

    }, {
      key: "getElementName",
      value: function getElementName(str) {
        if (Util.notEmpty(str)) return str.match(/component:?[a-zA-Z0-9_]+|[a-zA-Z0-9_]+/).join();
      }
      /**
       * Checks that the given component exist with the given key or the key starts with component keyword and the component exist. 
       * @param {string} key
       * @returns True if the component exist or the key contains component keyword and exist, otherwise false.
       */

    }, {
      key: "isComponent",
      value: function isComponent(key) {
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

    }, {
      key: "resolve",
      value: function resolve(template, parent, appName, context) {
        return Template.create().setTemplateAndResolve(template, parent, appName, context);
      }
      /**
       * Method will apply the properties given to the element. Old properties are overridden.
       * @param {object} elem 
       * @param {object} props 
       * @param {object} oldProps
       */

    }, {
      key: "updateElemProps",
      value: function updateElemProps(elem, props, oldProps) {
        var combined = Template.combineProps(props, oldProps);
        Object.keys(combined).forEach(function (prop) {
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
    }, {
      key: "combineProps",
      value: function combineProps(newProps, oldProps) {
        Object.keys(oldProps).forEach(function (prop) {
          if (oldProps[prop] && !newProps[prop]) {
            // if no new prop but old exist
            oldProps[prop] = prop === 'style' ? '' : undefined;
          }
        });
        return _objectSpread(_objectSpread({}, oldProps), newProps);
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
       * @returns True if the given tag is a HTML tag or a RME component otherwise false.
       */

    }, {
      key: "isTagOrComponent",
      value: function isTagOrComponent(tag) {
        return Template.isComponent(tag) || Template.isTag(Template.getElementName(tag));
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
        var tagArray = tags[tag.charAt(0)];

        if (tagArray) {
          while (i < tagArray.length) {
            if (tagArray[i] === tag) return true;
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

    }, {
      key: "isAttr",
      value: function isAttr(key, elem) {
        /**
         * special cases below.
         */
        if (key === "span" && Template.isElem(elem.getTagName(), ["col", "colgroup"])) //special case, span might be an attribute also for these two elements.
          return true;else if (key === "label" && Template.isElem(elem.getTagName(), ["track", "option", "optgroup"])) return true;else if (key === "title" && (elem.parent() === null || elem.parent().getTagName().toLowerCase() !== "head")) return true;else if (key === "cite" && Template.isElem(elem.getTagName(), ["blockquote", "del", "ins", "q"])) return true;else if (key === "form" && Template.isElem(elem.getTagName(), ["button", "fieldset", "input", "label", "meter", "object", "output", "select", "textarea"])) return true;else if (key.indexOf("data") === 0 && (!RMEComponentManagerV2.hasComponent(key) && !Template.isElem(elem.getTagName(), ["data"]) || Template.isElem(elem.getTagName(), ["object"]))) return true;
        var attrs = {
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
        };
        var i = 0;
        var keys = attrs[key.substring(0, 1)];

        if (keys) {
          while (i < keys.length) {
            if (keys[i] === key) return true;
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

    }, {
      key: "isAriaKey",
      value: function isAriaKey(key) {
        if (key.indexOf('aria') === 0) {
          var ariaKeys = ['aria-activedescendant', 'aria-atomic', 'aria-autocomplete', 'aria-braillelabel', 'aria-brailleroledescription', 'aria-busy', 'aria-checked', 'aria-colcount', 'aria-colindex', 'aria-colindextext', 'aria-colspan', 'aria-controls', 'aria-current', 'aria-describedby', 'aria-description', 'aria-details', 'aria-disabled', 'aria-dropeffect', 'aria-errormessage', 'aria-expanded', 'aria-flowto', 'aria-grabbed', 'aria-haspopup', 'aria-hidden', 'aria-invalid', 'aria-keyshortcuts', 'aria-label', 'aria-labelledby', 'aria-level', 'aria-live', 'aria-multiline', 'aria-multiselectable', 'aria-orientation', 'aria-owns', 'aria-placeholder', 'aria-posinset', 'aria-pressed', 'aria-readonly', 'aria-relevant', 'aria-required', 'aria-roledescription', 'aria-rowcount', 'aria-rowindex', 'aria-rowindextext', 'aria-rowspan', 'aria-selected', 'aria-setsize', 'aria-sort', 'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext'];
          var normalizedKey = Template.normalizeKey(key);
          return Boolean(ariaKeys.find(function (ariaKey) {
            return ariaKey === normalizedKey;
          }));
        }

        return false;
      }
    }, {
      key: "normalizeKey",
      value: function normalizeKey(key) {
        var capital = key.search(/[A-Z]/);
        return capital > -1 ? "".concat(key.substring(0, capital), "-").concat(key.substr(capital).toLowerCase()) : key;
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

  return Template;
}();
/**
 * Tree class reads the HTML Document Tree and returns elements found from there. The Tree class does not have 
 * HTML Document Tree editing functionality except setTitle(title) method that will set the title of the HTML Document.
 * 
 * Majority of the methods in the Tree class will return found elements wrapped in an Elem instance as it offers easier
 * operation functionalities.
 */


var Tree = /*#__PURE__*/function () {
  function Tree() {
    _classCallCheck(this, Tree);
  }

  _createClass(Tree, null, [{
    key: "get",
    value:
    /**
     * Uses CSS selector to find elements on the HTML Document Tree. 
     * Found elements will be wrapped in an Elem instance.
     * If found many then an array of Elem instances are returned otherwise a single Elem instance.
     * @param {string} selector 
     * @returns An array of Elem instances or a single Elem instance.
     */
    function get(selector) {
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
      try {
        return Elem.wrap(document.body);
      } catch (e) {}
    }
    /**
     * @returns head wrapped in an Elem instance.
     */

  }, {
    key: "getHead",
    value: function getHead() {
      try {
        return Elem.wrap(document.head);
      } catch (e) {}
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
      try {
        return Elem.wrap(document.activeElement);
      } catch (e) {}
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
