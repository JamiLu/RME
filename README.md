RME - RestMadeEasy
======

RME is a functional JavaScript library that enables user to make small and medium size websites with ease only writing 
JavaScript. 

The RME does not require any installation nor any other libraries. Just download a script file and place it to a project
folder or simply use a github online url as follows. 

`<script src="https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.es5.min.js"></script>`

I am currenlty working on comprehensive documentation, hopefully coming soon.

Download
-----
[https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.js](https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.js)
[https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.es5.js](https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.es5.js)
[https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.es5.min.js](https://github.com/JamiLu/RME/releases/download/v0.0.1-alpha/rme.es5.min.js)

Basics
-----

```javascript
RME.run(function() {
  alert("this script is run immediately");
});
```

```javascript
RME.ready(function() {
  Tree.getBody().setText("this script waits untill body is ready and then it will run");
});
```

```javascript
//this is how to create a component. (components does not even need to be in the same JS file.)
RME.component(function() {
  return {
    myFirstComponent: function() {
      return this.x * this.y;
    }
  }
});
//this is how to use a component
console.log(RME.component("myFirstComponent", {x: 2, y: 5});
```

```javascript
//this is how to add script files on the go.
RME.script("myComponentLib.js");
```

```javascript
//this is how to use RME instance storage that is available for all RME functions to use (run(), ready(), component()),
RME.storage("foo", "bar");
//this is how to get stored data. (that can be anything)
console.log(RME.storage("foo"));
```

```javascript
//This is how to create a Hello World Application.
RME.ready(function() {
  Tree.getBody().append(new Elem("div").setText("Hello World"));
});
```

```javascript
//This is how to create a bit more complex Hello World
RME.ready(function() {
  var abc = [
    new Elem("li").setText("JavaScript rules"),
    new Elem("li").setText("RME is the best"),
    new Elem("li").setText("You really should try it out")
  ]

  //Rendering a list inside the Body is not necessary to be done inside the component but it explains how these components might be very handy. (as they can be anything and have any functionality)
  Tree.getBody().append(RME.component("lister", {list: abc}));
});

RME.component(function() {
  return {
    lister: function() {
      return new Elem("ul").render(this.list);
    }
  }
});
```

```javascript
//Conditional rendering
RME.ready(function() {
  var state = {
    show: true
  }
  var text = new Text();
  Tree.getBody().append(new Elem("div").setId("myDiv").render(state.show ? text : []));
  
  Tree.getBody().append(RME.component("showB", {clickFuntion: toggle}));
  
  function toggle() {
      state.show = !state.show;
      Tree.get("#myDiv").render(state.show ? text : []);
  }

  //This Text is only a simple basic function which enables grouping or wrapping one or bunch of Elemens into a one resusable Object.
  function Text() {
      return new Elem("span").setText("showing text");
  }
});

RME.component(function() {
    return {
        showB : function() {
            return new Elem("button").setText("show&hide").onclick(this.clickFuntion);
        }
    }
});
```

Classes & Functions
----
>Not comprehensive. Just to name few.

* RME
  - run(runnable) **Runs application script type fuction _(runnable)_ immediately _MAX 1 run per RME application_**
  - ready(runnable) **Runs application script type function _(runnable)_ when body is ready _MAX 1 ready per RME application_**
  - component(function(){}) **Create and return created component on the callback**
  - component("componentName", {param: 1, param: 2}) **Get and invoke the component**
  - storage(key, val) **Store data in RME instance**
  - storage(key) **Read data from RME instance storage**
  - onrmestoragechange(rmeState) **If defined, will be invoked every time when something was saved into the storage. Changed state will be given as parameter to the callback**
  - script(source, id, type, text, defer, crossOrigin, charset, async) **Other way to add a script file on the go _source is required other parameters optional_**
  - config().addScript(Elem) **Add a Script element to the head on the fly**
  - config().removeScript(id|source) **Finds a script according to ID or source property**
* Http
  - get(url).then(success).catch(error)
  - post()...
  - put()...
  - delete()...
  - do(customObject).then(success).catch(error)
  - fetch().get(url).then(success).then(response).catch(error)
  - fetch().post().....
  - fetch().put()...
  - fetch().delete()....
  - fetch().do(custom).then(success).then(response).catch(error)
  > Side note, fetch having two **then** is just how it works, dont believe check fetch manual. 
* Elem
  - constructor(type|html) **If type is string creates a new JavaScript element of that type _OR_ If type is JavaScript html object then only wraps that object inside of this Elem object**
  - render(elem, elem, elem|arrayOfElems|arrayOfElems, arrayOfElems, elem) **Renders the Elem instance objects that contain html data to insert into the HTML document tree. Can render multiple elements.**
  - append(elem) **Appends an element inside this Elem**
  - remove(elem) **Removes an element from thie Elem**
  - replace(elem) **Replaces _THIS_ elemet with _NEW_**
  - before(elem) **Inserts new element before this**
  - after(elem) **Inserts new element after this**
  - wrap(html) **Returns wrapped html object (Elem instance)**
  - create(type) **Returns new JavaScript html object (Elem instance)**
  - wrapElems(elemArray) **Returns an Array of wrapped html objects if many or one if only one. (Elem instances)**
  - dom() **Returns the javascript html object that this (Elem instance) holds**
  - and many many many more methods. All setter methods and methods that does not return some value are so called Builder methods that they can chained as follows setText("text").setName("name").setId("id").setType("text").addClasses("one two three");
* Tree
  - get(cssSelector) **Returns an Array of Elem objects or one Elem object**
  - getFirst(cssSelector) **Returns one Elem object**
  - getById(id) **Returns one Elem object**
  - getByName(name) **Returns an Array of Elem objects or one Elem object**
  - getByClass(classname) **Returns an Array of Elem objects or one Elem object**
  - getByTag(tag) **Returns an array of Elem objects or one Elem object**
  - getBody() **Returns the body wrapped in Elem instance**
  - getHead() **Retuns the head wrapped in Elem instance**
  - getTitle() **Returns document title string**
  - setTitle(string) **Sets document title string**
  - and other methods that searches elements from the html document tree, _but does not return an Elem instance_
* Key
  - no methods, only **Key** constants for keyevent such as Key.ENTER
* Cookie
  - set(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) **name and value are necessary parameters**
  - get(name)
  - remove(name)
* Session
  - set(key, value)
  - get(key)
  - remove(key)
  - clear()
* Storage **html web storage**
  - set(key, value)
  - get(key)
  - remove(key)
  - clear()
* Util
  - many utility methods that this Framework also uses such as.
  - isEmpty(value) **Returns true if null | undefined | ""**
  - getType(value) **Returns the type of the given value**
  - isType(value, type) **Checks if value is a given type and returns true false accordigly**
  - isFunction(value) 
  - isBoolean(value)
  - isString(value)
  - isNumber(value)
  - isSymbol(value)
  - isObject(value)
  - isArray(value)
  - setTimeout(callback, ms) **Returns timeout object**
  - clearTimeout(timoutObject)
  - setInterval(callback, ms) **Returns interval object**
  - clearInterval(intervalObject)
  - encodeBase64String(string) **Returns base64 encoded string**
  - decodeBase64String(string) **Returns base64 decoded string**
* Browser
  - All other methods that you might think of that JavaScript has from **Window**, **Navigator**, **History**, **Location** and **Screen** objects.

Lisence
-----
This library is released under a [MIT License](/LICENSE)
