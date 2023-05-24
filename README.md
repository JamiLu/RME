RME.js
======

RME stands for Rest Made Easy. The RME is a Javascript library or a framework that will enable user to create single page applications
without any configurations at all. 

Links
-----
 - [https://jamilu.github.io/RME/](https://jamilu.github.io/RME/) Online Docs & Examples

Download
-----
- [https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.js](https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.js)
- [https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.es5.js](https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.es5.js)
- [https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.es5.min.js](https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.es5.min.js)

NPM
---
Install RME: 

`npm i rme.js`

On an appropriate js file import what is needed. Possible imports below:

```
import {
    createApp,
    useValue,
    Component,
    useMessage,
    useMessages,
    useHashRouter,
    useUrlRouter,
    useOnLoadUrlRouter,
    useRouter,
    CSS,
    script,
    ready,
    Elem,
    Tree,
    Http,
    Fetch,
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

`<script src="https://github.com/JamiLu/RME/releases/download/v2.0.0/rme.es5.min.js"></script>`

__Or use NPM__

`npm i rme.js`

`import { createApp, Component, useValue, Key } from 'rme.js'`

Then simply copy paste code clips below to your js file and voilà. 

The first exmaple demonstrates use case of the `useValue` function that can be used to share a value between components without passing it forward.

```javascript
const [getValue, setValue] = useValue(0);

const Clicker = () => ({
    'div.bar-item': {
        button: {
            text: 'Add one',
            onClick: () => setValue(val => val+1)
        }
    }
});

const ShowValue = () => ({
    'div.clicker-number': `${getValue()}`
});

const ClickAndShowExample = () => ({
    _: {
        h2: 'Click and Show Example',
        'div.bar': {
            Clicker,
            ShowValue
        }
    }
});

Component(Clicker, ShowValue, ClickAndShowExample);
```

The second exmaple introduces the second parameter of the component named `ops`. The `ops` parameter is an object that has operational functions of the component.
Below is shown the usage of the `setState`, `updateState` and `asyncTask` functions.

```javascript
const TodoExample = ({ list = [] }, ops) => {

    if (list.length === 0) {
        ops.asyncTask(() => ops.setState({list: [{li: 'What groceries should I buy?'}] }));
    }

    return {
        _: {
            h2: 'Todo Example',
            'input[type=text][placeholder=Type & Press Enter to Add]': {
                onKeyDown: event => {
                    if(event.key === Key.ENTER) {
                        ops.updateState(state => ({
                            list: state.list.concat({li: event.target.value})
                        }));
                        event.target.value = '';
                    }
                }
            },
            button: {
                text: 'Clear list',
                onClick: () => ops.setState({list: [{li: 'What groceries should I buy?'}]})
            },
            Lister: { list }
        }
    }
};

const Lister = ({ list }) => ({ ul: list });

Component(TodoExample, Lister);
```

The third example shows the two paramters of the component function named `props` and `ops`. Below is shown the usage of the `updateState` function.

```javascript
const FormExample = (props, ops) => ({
    _: {
        h2: 'Form Example',
        TitleHeader: props,
        Form: {
            input: event => {
                ops.updateState({ [event.target.name]: event.target.value });
            }
        }
    }
});

const TitleHeader = ({ fname, lname }) => ({h5: `Welcome ${fname || ''} ${lname || ''}`});

const Form = ({ input }) => ({
    div: {
        'label[for=fname]': 'First name',
        'input#fname[type=text][name=fname][placeholder=First name]': {
            onInput: input
        },
        br: {},
        'label[for=lname]': 'Last name',
        'input#lname[type=text][name=lname][placeholder=Last name]': {
            onInput: input
        },
    }
});

Component(FormExample, TitleHeader, Form);
```

The fourth example combines the learned and demonstrates the usage.

```javascript
const [getCountryList] = useValue([
    {country: 'Finland', capital: 'Helsinki'}, {country: 'Sweden', capital: 'Stockholm'}, {country: 'Norway', capital: 'Oslo'},
    {country: 'Iceland', capital: 'Reykjavik'}, {country: 'England', capital: 'London'}, {country: 'America', capital: 'Washington'}, 
    {country: 'Mexico', capital: 'Mexico City'}, {country: 'Peru', capital: 'Lima'}, {country: 'Egypt', capital: 'Kairo'}, 
    {country: 'China', capital: 'Beijing'}, {country: 'Japan', capital: 'Tokyo'}, {country: 'South Korea', capital: 'Seoul'}, 
    {country: 'Malaysia', capital: 'Kuala Lumpur'}, {country: 'Namibia', capital: 'Windhoek'}, {country: 'South Africa', capital: 'Cape Town'}]);

const FilterExample = ({ rows }, ops) => {
    if (!rows) {
        ops.asyncTask(() => ops.setState({rows: getCountryList()}));
    }

    return {
        _: {
            h2: 'Filter Example',
            'input[type=text][placeholder=Type to Filter Country]': {
                onInput: event => 
                    ops.setState({
                        rows: getCountryList()
                            .filter(row => `${row.country}${row.capital}`.toLowerCase().search(event.target.value) > -1)
                    })
            },
            MyTable: { rows }
        }
    }
};

const MyTable = ({ rows = [] }) => ({
    table: rows.map(row => ({
        tr: [
            { td: row.country },
            { td: row.capital }
        ],
    }))
});

Component(FilterExample, MyTable);
```

Then create the application by the `createApp` function.

```javascript
createApp({
    '#app': {
        'div.container': {
            ClickAndShowExample,
            TodoExample,
            FormExample,
            FilterExample
        }
    }
});
```

Below is shown the exmaple `index.html`. The first selector of the create app object should match the selector where the app is desired to be created.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Demo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

Classes & Functions
----
>Not comprehensive. Just to name few.

* Global functions
  - createApp(initAppTemplateObject) **Create a new App and insert it into the given locator**
  - useValue(initialValue) **Create a shareable value that can be used between any component**
  - useMessage(key, ...params) **Resolves a given message key**
  - useMessages(locale, loader) **Initialize messages and change locale**
  - useHashRouter(routes, settings) **Initialize and create SPA hash based router component**
  - useUrlRouter(routes, settings) **Initialize and create SPA suitable url based router compoment**
  - useOnLoadUrlRouter(routes) **Initialize and create onload rendered url based router**
  - useRouter(url) **Navigate the router to render the matching component**
  - Component(...components) **Component function receives a comma separate list of component functions.**
  - CSS(content, properties) **Creates a dynamic style component with content and optional properties if given.**
  - script(src, options) **Attach a script file to the dom header**
  - ready(callback) **Add a callback function to be run when the DOM tree is ready. Calling the ready twice will create two callback functions.**
* Fetch **Uses the Fetch API of the browser**
  - get(url, contentType) **Get request, defaults to JSON**
  - post(url, body, contentType) **Post request, defaults to JSON**
  - put(url, body, contentType) **Put request, defaults to JSON**
  - patch(url, body, contentType) **Patch request, defaults to JSON**
  - delete(url, contentType) **Delete request, defaults to JSON**
  - do(config) **Config object: {url: url, method: method, body: body, contentType: contentType, init: initObject}**
* Http **Uses XMLHttpRequest object wrapped in the Promise if the browser supports it**
  - get(url, contentType) **Get request, defaults to JSON**
  - post(url, data, contentType) **Post request, defaults to JSON**
  - put(url, data, contentType) **Put request, defaults to JSON**
  - patch(url, data, contentType) **Patch request, defaults to JSON**
  - delete(url, contentType) **Delete request, defaults to JSON**
  - do(config) **Config object: {method: method, url: url, data: data, contentType: contentType, onProgress: function(event), onTimeout: function(event), headers: {"header": "value"} }**
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
* Util
  - many utility methods that this Framework also uses such as.
  - isEmpty(value) **Returns true if null | undefined | "" | array.length === 0 | object keys === 0**
  - notEmpty(value) **Returns true if the value is not empty !Util.isEmpty**
  - getType(value) **Returns the type of the given value**
  - isType(value, type) **Checks if value is a given type and returns true false accordigly**
  - isFunction(value) 
  - isBoolean(value)
  - isString(value)
  - isNumber(value)
  - isSymbol(value)
  - isObject(value)
  - isArray(value)
* Browser
  - All other methods that you might think of that JavaScript has from **Window**, **Navigator**, **History**, **Location** and **Screen** objects.

Lisence
-----
This library is released under a [MIT License](/LICENSE)
