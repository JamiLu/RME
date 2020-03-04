RME.js
======

RME is a functional JavaScript library that enables user to make small and medium size websites with ease only writing 
JavaScript. 

Links
-----
 - [https://jamilu.github.io/RME/](https://jamilu.github.io/RME/) Online documentation
 - [https://jamilu.github.io/RME/#howto](https://jamilu.github.io/RME/#howto) Examples online

Download
-----
- [https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.js](https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.js)
- [https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.es5.js](https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.es5.js)
- [https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.es5.min.js](https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.es5.min.js)

NPM
---
Install RME: 

`npm i rme.js`

On an appropriate js file import what is needed. Possible imports below:

```
import RME, { 
    configure,
    createApp,
    useState,
    Component,
    bindState,
    CSS,
    App,
    Elem,
    Tree,
    Template,
    Messages,
    Router,
    EventPipe,
    Http,
    Cookie,
    Session,
    Storage,
    Key,
    Browser,
    Util
} from 'rme.js'
```

DEV project commands
---
Some run commands that has been defined for this dev project.

 - `npm run docs` will open documentation on the browser.
 - `npm run demo` will open rme demo on the browser.
 - `npm run calculator` will open rme made calculator on the browser.

Basics
-----

Download a script file and place it to a project folder or simply use a github online url as follows. 

`<script src="https://github.com/JamiLu/RME/releases/download/v1.5.8/rme.es5.min.js"></script>`

__Or use NPM__

`npm i rme.js`

`import RME, { App, Component, bindState, Key } from 'rme.js'`

Then simply copy paste code clips below to your js file and voilà. 

Start by creating a new application. Default application does not need to be named. If a root is not specified then the Document Body is used by automatic. This following line of code will create a div element inside of the element with id app. Inside the div there are three components that we will take a closer look just below.
```javascript
App.root('#app').create({
    div: [
        {TodoExample: {}},

        {FormExample: {}},
        
        {FilterExample: {}}
    ]
});
```

Now lets create the TodoExample component that will contain other components. This component defines a fragment that contains h2, input, button and also a component named Lister. The Lister component is explained just below. But to mention about `fragment` elements that they are special grouping or encapsuling elements that are not rendered themselves but only their content will be rendered into their parent element.
```javascript
const TodoExample = props => ({
    fragment: {
        h2: 'Todo Example',
        'input[type=text][placeholder=Type & Press Enter to Add]': {
            onKeyDown: event => {
                if(event.key === Key.ENTER) {
                    App.mergeState(props.stateRef, {
                        list: {li: event.target.value}
                    });
                    event.target.value = '';
                }
            }
        },
        button: {
            text: 'Clear list',
            onClick: () => App.clearState(props.stateRef)
        },
        Lister: {
            list: props.list
        }
    }
});

const Lister = props => ({ul: props.list});

Component(bindState(TodoExample, {list: [{li: 'What groceries should I buy?'}] }), Lister);
```
The `Component` function above creates components out of the named functions and the `bindState` function will bind state to the component. An initial state object can be given as a second attribute of the function but it is not necessary.

Next lets create the FormExample component. The component also defines a `fragment` that contains other elements and components. A TitleHeader component receives the state properties of the FormExample component. A Form component receives an input function that will be bound on input elements of the component. 
```javascript
const FormExample = props => ({
    fragment: {
        h2: 'Form Example',
        TitleHeader: props,
        Form: {
            input: event => {
                App.setState(props.stateRef, state => ({
                    ...state,
                    [event.target.name]: event.target.value
                }));
            }
        }
    }
});

const TitleHeader = props => ({h5: `Welcome ${props.fname || ''} ${props.lname || ''}`});
```
Every component that has state bound to it also has a property `stateRef` which is reference to the state of the component. By default it is a name of the component but it may be altered if needed. 

Here is the Form component that receives the input function in parameters that then is bound on the onInput property of the input fields.
```javascript
const Form = props => ({
    div: {
        'label[for=fname]': 'First name',
        'input#fname[type=text][name=fname][placeholder=First name]': {
            onInput: props.input
        },
        br: {},
        'label[for=lname]': 'Last name',
        'input#lname[type=text][name=lname][placeholder=Last name]': {
            onInput: props.input
        },
    }
});

Component(bindState(FormExample), TitleHeader, Form);
```

Now we can save some dummy data into the RME instance storage for a next component.
```javascript
RME.storage('countryList', [
    {country: 'Finland', capital: 'Helsinki'}, {country: 'Sweden', capital: 'Stockholm'}, {country: 'Norway', capital: 'Oslo'},
    {country: 'Iceland', capital: 'Reykjavik'}, {country: 'England', capital: 'London'}, {country: 'America', capital: 'Washington'}, 
    {country: 'Mexico', capital: 'Mexico City'}, {country: 'Peru', capital: 'Lima'}, {country: 'Egypt', capital: 'Kairo'}, {country: 'China', capital: 'Beijing'},
    {country: 'Japan', capital: 'Tokyo'}, {country: 'South Korea', capital: 'Seoul'}, {country: 'Malaysia', capital: 'Kuala Lumpur'}, {country: 'Namibia', capital: 'Windhoek'}, {country: 'South Africa', capital: 'Cape Town'}]);
```

The FilterExample component has an input field that is used to filter the data. The filtered data is then set into the state of the component. The `stateRef` is reference to the state of the stateful component. Default values are populated from the state of component. The default state is set using the `bindState` function with the initial state object as a second attribute.
```javascript
const FilterExample = props => ({
    fragment: {
        h2: 'Filter Example',
        'input[type=text][placeholder=Type to Filter Country]': {
            onInput: event => 
                App.setState(props.stateRef, {
                    rows: RME.storage('countryList')
                        .filter(row => row.country.toLowerCase().search(event.target.value) > -1)
                })
        },
        MyTable: {rows: props.rows}
    }
});
```

The MyTable component receives rows in props and populates a table element from the given properties.
```javascript
const MyTable = props => ({
    table: props.rows.map(row => ({
        tr: [
            {td: row.country},
            {td: row.capital}
        ],
    }))
});

Component(bindState(FilterExample, { rows: RME.storage('countryList') }), MyTable);
```

Classes & Functions
----
>Not comprehensive. Just to name few.

* Special global functions
  - Component(...components) **Component function receives a comma separate list of component functions.**
  - bindState(component, initialState, appName) **bindState function binds state into the given component. InitialState and appName attributes are not necessary.**
  - CSS(content, properties) **Creates a dynamic style component with content and optional properties if given.**
* RME
  - run(runnable) **Runs application script type fuction _(runnable)_ immediately**
  - ready(runnable) **Runs application script type function _(runnable)_ when body is ready _MAX 1 ready per RME application_**
  - use({config}) **Configures RME to use _Router_, _Messages_ and _App_ classes together**
  - component(object|function(){}) **Create and return created component on the callback**
  - component("componentName", {param: 1, param: 2}) **Get and invoke the component**
  - storage(key, val) **Store data in RME instance**
  - storage(key) **Read data from RME instance storage**
  - onStorageChange(rmeState) **If defined, will be invoked every time when something was saved into the storage. Changed state will be given as parameter to the callback**
  - script(source, id, type, text, defer, crossOrigin, charset, async) **Add a script file on the go _source is required other parameters are optional_**
* App **_Handles default application_**
  - root(selector) **Selects a root element for an application to work in**
  - name(appName) **Gives an applicatian a name**
  - create({template}|Elem) **Creates and instantiates a specified application**
  - get(appName) **Returns a specified application instance if empty a default application will be returned.**
  - component({ compName: props => {..}})(appName) **Create a statefull application component, _appName_ parameter is optional if not given the component is created for a default application**
  - setState(refName, () => {state}|{state}, update) **Set state according to application reference name, _FOR default app_**
  - getState(refName) **Get state according to application reference name, _FOR default app_**
  - mergeState(refName, () => {state}|{state}, update) **Merges state according to application reference name, _FOR default app_**
  - clearState(refName, update) **Clear state according to application reference name, update is boolean if true application is re-rendered, _FOR default app_**
* AppInstance **_Handles appropriate application instance received from App.get(appName)_**
  - setState(refName, () => {state}|{state}, update) **Set state according to application reference name**
  - getState(refName) **Get state according to application reference name**
  - mergeState(refName, () => {state}|{state}, update) **Merges state according to application reference name**
  - clearState(refName, update) **Clear state according to application reference name, update is boolean if true application is re-rendered**
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
  - isTag(tag) **Function checks if the given tag is the HTML5 tag and returns true if is otherwise false is returned.**
  - updateElemProps(elem, props) **Method will apply the properties given to the element. Old properties are overridden.**
  - isFragment(child) **Method takes a parameter and checks if the parameter is type fragment. If the parameter is type fragment the method will return true otherwise false is returned.**
  - resolveToParent(template, parent) **Method takes a template and a parent element as parameter and it resolves the given template into the given parent.**
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
  - hash() **Use hash based routing**
  - url(manual) **Use URL based routing. If manual is true then use Router.navigate to navigate next route.**
  - scroll(auto) **Method sets default level behavior for route naviagation. A value true sets the browser to auto-scroll up when navigating to a new resource and a value false will not auto-scroll up. Default value is true.**
* EventPipe **_This class is experimental and might be removed later_**
- send(event) **Can be used to send a custom event through the EventPipe. Method takes one object paremter that must atleast have one attribute "type" otherwise error is thrown**
- receive(event) **Is used to receive the sent event from the EventPipe. Method takes one paramter function which receives an event as parameter.**
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
