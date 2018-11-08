RME.js
======

RME is a functional JavaScript library that enables user to make small and medium size websites with ease only writing 
JavaScript. 

The RME does not require any installation nor any other libraries. 

Documentation
-----
 - [http://jlcv.sytes.net/rme/](http://jlcv.sytes.net/rme/)

Download
-----
- [https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.js](https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.js)
- [https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.es5.js](https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.es5.js)
- [https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.es5.min.js](https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.es5.min.js)

Basics
-----

__See Basics online from:__ [http://jlcv.sytes.net/rme/howto](http://jlcv.sytes.net/rme/howto)

Download a script file and place it to a project folder or simply use a github online url as follows. 

`<script src="https://github.com/JamiLu/RME/releases/download/v1.1.1/rme.es5.min.js"></script>`

Then simply copy paste code clips below to your js file and voilà. __Remember__ only __1__ ready() function per RME application.

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
RME.component({ myFirstComponent: (props) => props.x * props.y });
//this is how to use a component
console.log(RME.component("myFirstComponent", {x: 2, y: 5}));
```

```javascript
//this is how to add script files on the go. This method should be invoked before the script is needed.
RME.script("myComponentLib.js");
```

```javascript
//this is how to use RME instance storage that is available for all RME functions to use (run(), ready(), component()),
RME.storage("foo", "bar");
//this is how to get stored data. (that can be anything)
console.log(RME.storage("foo"));
```

```javascript
//This is how to create a div inside the body and set a text inside the div.
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
  ];

//Render the list inside the body using a component.
  Tree.getBody().append(RME.component("lister", {list: abc}));
});

RME.component({ lister: (props) => new Elem("ul").render(props.list) });
```

```javascript
//Conditional rendering
RME.ready(function() {
  var state = {
    show: true
  }
  
  function toggle() {
      state.show = !state.show;
      Tree.get("#myDiv").render(state.show ? table : []);
  }

  function Table() {
       return Template.resolve({
           table: [
               {tr: [
                   {td: {text: "I love this script"}},
                   {td: {text: "Feel the same burn?"}}
               ]},
               {tr: [
                   {td: {text: "The inventor"}},
                   {td: {text: "Jami Lu"}}
               ]}
           ]
       });
    }
    
    var table = new Table();
    Tree.getBody().append(new Elem("div").setId("myDiv").render(state.show ? table : []));
    Tree.getBody().append(RME.component("showB", {click: toggle}));
});

RME.component({ showB : (props) => new Elem("button").setText("show&hide").onClick(props.click) });
```

```javascript
//an extra example, an interactive form.
RME.ready(function() {
  var state = {
        fname: "",
        lname: "",
    }
    Tree.getBody().append(new Elem("h1").setText("Welcome"));
    Tree.getBody().append(RME.component("form", {input: print}));    

    function print(elem) {
        state[elem.getName()] = elem.getValue();
        
        Tree.get("h1").setText("Welcome " +state.firstName +" "+state.lastName);
    }
});

RME.component({form: (props) => t = {
    div: {
        "label[for=fname]": {
            text: "First name"
        },
        "input#fname[type=text][name=fname][placeholder=First name]": {
            onInput: props.input
        },
        br: {},
        "label[for=lname]": {
            text: "Last name"
        },
        "input#lname[type=text][name=lname][placeholder=Last name]": {
            onInput: props.input
        },
    }
}});
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
  - script(source, id, type, text, defer, crossOrigin, charset, async) **Add a script file on the go _source is required other parameters are optional_**
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
* Template
  - resolve(template) **Resolves a given JSON format template and returns a created Elem instance element tree.**
  - isTemplate(object) **Method checks if the given object is an unresolved JSON template and returns true if it is an unresolved JSON template, otherwise false.**
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
* Messages
  - locale() **Function returns current locale of the Messages.**
  - lang(locale) **Lang function is used to change or set the current locale to be the given locale. After calling this method the Messages.load function will be automatically invoked.**
  - message(message, ...params) **Message function is used to retrieve translated messages. The function also supports message parameters that can be given as a comma separeted list.**
  - load(loader) **Load function is used to load new messages or change already loaded messages. The one of the parameters is the changed locale and the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages. The loader function is called automatically when language is changed by calling the Messages.lang() function.**
* Router
  - navigate(url) **Navigates to the url, updates url on the browser and renders route element if found.**
  - root(elem) **Set a root route element to the Router**
  - add(url, elem, hide) **Add a route to the Router**
  - routes(array) **Set routes array. The first element in the array will be removed from the array and set as root render element**
  - hash() **Use hash implementation**
  - url() **Use default URL implementation**
  - manual() **Set URL implementation to manual, Router.navigate need to be invoked in order to change pages**
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
