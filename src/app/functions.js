import RME from '../rme';
import App from './app';
import Util from '../util';


/**
 * The createApp function is a shortcut function to create an RME application.
 * @param {string} selector
 * @param {function} component
 * @param {string} appName
 * @returns a created app instance.
 */
const createApp = (function() {

    return (selector, component, appName) => {
        return App.name(appName).root(selector).create(RME.component(component.name, {}));
    }

})();


/**
 * The useState function is a srhotcut function to set application component state.
 * @param {*} refName string, orbject or function. String is the stateRef. Object is the new state object.
 * Function receives a previous state as parameter and returns a new state object.
 * @param {*} value function or object. Object is the new state. Function receives a previous state as 
 * parameter and returns a new state object.
 * @param {*} update optional string or boolean. If string then works as appName otherwise works as normal.
 * @param {string} appName optional if not set default app is used .
 * @returns the new state
 */
const useState = (function() {

    const resolveAppName = (update, appName) => {
        if (Util.isString(update))
            return update;
        return appName;
    }

    return (refName, value, update, appName) => {
        let name = resolveAppName(update, appName);
        App.get(name).setState(refName, value, update);
        return App.get(name).getState(refName);
    }

})();


export { createApp, useState }