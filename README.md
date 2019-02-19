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
- [https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.js](https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.js)
- [https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.es5.js](https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.es5.js)
- [https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.es5.min.js](https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.es5.min.js)

Basics
-----

__See Basics online from:__ [http://jlcv.sytes.net/rme/howto](http://jlcv.sytes.net/rme/howto)

Download a script file and place it to a project folder or simply use a github online url as follows. 

`<script src="https://github.com/JamiLu/RME/releases/download/v1.2.0/rme.es5.min.js"></script>`

Then simply copy paste code clips below to your js file and voilà. 

Start by creating a new application. Default application does not need to be named. If a root is not specified then the Document Body is used by automatic. This following line of code will create a single div element inside of the Body element. Inside the div there will be three components that we will take a closer look just below.
```javascript
App.create({
    div: [
        {todoExample: {}},

        {formExample: {}},
        
        {filterExample: {}}
    ]
}).setState({
    lister: {list: [{li: () => "What groceries should I buy?"}]}
});
```
Above you can see that after we have created the application by calling the App.create(...) function we can also call setState(..) function that will set state for the application. In the setState function we give it an object that in the first level tells which component the state is set to and next level will be name of the state property and the third level will be the given state value. After calling setState the Application will rerender itself. 

Function setState can also take two parameters but then the first parameter is a component name that the state is set to and the next parameter is the state object that the component receives.

Now we can create a component that contains other components and even a stateful component. The next component contains a div that contains h2, input and button elements. Below them there is a lister component that is explained below.
```javascript
RME.component({ todoExample: () => 
    ({div: {
        h2: () => "Todo Example",
        "input[type=text][placeholder=Type & Press Enter to Add]": {
            onKeyDown: (event) => {
                if(event.key === Key.ENTER) {
                    App.mergeState({lister: {list: {li: {text: event.target.value}}}});
                    event.target.value = "";
                }
            }
        },
        button: {
            text: "Clear list",
            onClick: () => App.clearState("lister", true)
        },
        lister: {}
    }})
});
```

The component below is our lister component that is a stateful component as it has its own state that can be updated. Each state property and other properties also are given to the template in a props object.
```javascript
App.component({ lister: props => ({ul: props.list}) })();
```

Lets create other example component that we will see in action later. This component also has couple of insteresting elements. A statefulHeader component actually only prints what user types on a form component. Because form is an HTML 5
tag so we have to explicitly tell the RME that this form is actually our component that we want to use. Normally it is a good practise to name well own components that they wont get mixed with the HTML 5 tags and attributes.
```javascript
RME.component({ formExample: () => 
    ({div: {
        h2: () => "Form Example",
        statefulHeader: {fname: "", lname: ""},
        "component:form": {
            input: (event) => {
                let state = App.getState("statefulHeader");
                state[event.target.name] = event.target.value
                App.mergeState("statefulHeader", state);
            }
        }
    }})
});
```

This is the statefulHeader component that stores two values to the state of the component and then prints them as they are updated.
```javascript
App.component({ statefulHeader: props => 
    ({h5: {text: `Welcome ${props.fname} ${props.lname}`}})
})();
```

Here is our form component that has one property input which is actually onInput event action. Elements inside the component are on purposely typed a bit inconsistent fashion only to demonstrate possibilities of JSON templates.
```javascript
RME.component({form: props => ({
    div: {
        "label[for=fname]": {
            text: "First name"
        },
        input: {
            id: "fname",
            name: "fname",
            type: "text",
            placeholder: "First name",
            onInput: props.input
        },
        br: {},
        "label[for=lname]": {
            text: "Last name"
        },
        "input#lname[type=text][name=lname][placeholder=Last name]": {
            onInput: props.input
        },
    }})
});
```

Lets hard code dummy data for our next component and save it into the RME instance storage.
```javascript
RME.storage("countryList", [
    {country: "Finland", capital: "Helsinki"}, {country: "Sweden", capital: "Stockholm"}, {country: "Norway", capital: "Oslo"},
    {country: "Iceland", capital: "Reykjavik"}, {country: "England", capital: "London"}, {country: "America", capital: "Washington"}, 
    {country: "Mexico", capital: "Mexico City"}, {country: "Peru", capital: "Lima"}, {country: "Egypt", capital: "Kairo"}, {country: "China", capital: "Beijing"},
    {country: "Japan", capital: "Tokyo"}, {country: "South Korea", capital: "Seoul"}, {country: "Malaysia", capital: "Kuala Lumpur"}, {country: "Namibia", capital: "Windhoek"}, {country: "South Africa", capital: "Cape Town"}]);
```

Now we add one more component. The component has an input that is used to filter the data and a table that shows the filtered data. Default values can be given as properties to components directly and they will be overridden by state properties if they are named equally and the component has state.
```javascript
RME.component({ filterExample: () => 
    ({div: {
        h2: () => "Filter Example",
        "input[type=text][placeholder=Type to Filter Country]": {
            onInput: (event) => App.setState({myTable: {rows: RME.storage("countryList").filter(row => row.country.toLowerCase().search(event.target.value) > -1)}})
        },
        myTable: {rows: RME.storage("countryList")}
    }})
});
```

This is as simple as it gets when creating a table from the rows that come in the props object.
```javascript
App.component({ myTable: props => 
    ({table: props.rows.map((row) => ({
        tr: [
            {td: () => row.country},
            {td: () => row.capital}
        ],
    }))})
})();
```

Classes & Functions
----
>Not comprehensive. Just to name few.

* RME
  - run(runnable) **Runs application script type fuction _(runnable)_ immediately _MAX 1 run per RME application_**
  - ready(runnable) **Runs application script type function _(runnable)_ when body is ready _MAX 1 ready per RME application_**
  - component(object|function(){}) **Create and return created component on the callback**
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
  - scroll(auto) **Method sets default level behavior for route naviagation. A value true sets the browser to auto-scroll up when navigating to a new resource and a value false will not auto-scroll up. Default value is true.**
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
