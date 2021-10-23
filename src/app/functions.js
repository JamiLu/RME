import Component from '../component';
import App from './app';
import Util from '../util';
import RMEComponentManager from '../component/manager';
import ValueStore from './valueStore';


/**
 * The createApp function is a shortcut function to create an RME application.
 * @param {string} selector
 * @param {function} component
 * @param {string} appName
 * @returns a created app instance.
 */
const createApp = (function() {

    return (selector, component, appName) => {
        if (component.valueOf().name.length === 0) {
            throw new Error('The app function must be a named function.');
        }
        if (Util.isFunction(component) && !RMEComponentManager.hasComponent(component.valueOf().name))
            Component(component);

        return App.name(appName).root(selector).create({[component.valueOf().name]: {}});
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

    return (refName, value, update, appName) => {
        const name = Util.isString(update) ? update : appName;
        const stateRef = Util.isString(refName) ? refName : refName.stateRef;
        App.get(name).setState(stateRef, value, update);
        return App.get(name).getState(stateRef);
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


export { createApp, useState, useValue }