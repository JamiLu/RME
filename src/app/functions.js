import RMEAppBuilder from './app';
import Util from '../util';
import ValueStore from './valueStore';


/**
 * The createApp function is a shortcut function to create an RME application.
 * @param {string} selector
 * @param {function} component
 * @param {string} appName
 * @returns a created app instance.
 */
const createApp = (function() {

    const matchSelector = (key) => {
        let match = key.match(/#[a-zA-Z-0-9\-]+/); // id
        if (!match) {
            match = key.match(/\.[a-zA-Z-0-9\-]+/); // class
        }
        return match ? match.join() : undefined;
    }

    return (template, appName) => {
        if (!Util.isObject(template)) {
            throw new Error('The app creation template must be an object.');
        }
        const selector = matchSelector(Object.keys(template).shift());
        if (Util.isEmpty(selector)) {
            throw new Error('The root selector could not be parsed from the template. Selector should be type an #id or a .class');
        }

        return RMEAppBuilder.name(appName).root(selector).create(Object.values(template).shift());
    }

})();

/**
 * The function will set the given value in the app value state. The value is accessible by
 * a returned getter and a setter function.
 * @param {*} value Value to set in the app state
 * @param {string} appName Optional app name
 * @returns An array containing the getter and the setter functions for the given value.
 */
const useValue = (function() {

    return (value, appName) => ValueStore.useValue(value, appName);

})();


export { createApp, useValue }
