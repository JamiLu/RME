import Util from '../util';
import RMEComponentManager from '../component/manager';

/**
 * RME stands for Rest Made Easy. This is a small easy to use library that enables you to create
 * RESTfull webpages with ease and speed.
 * 
 * This library is free to use under the MIT License.
 */
const RME = (function() {

    class RMEStorage {
        constructor() {
            this.rmeState = {};
        }

        setRmeStateProp(key, value) {
            this.rmeState[key] = value;
        }

        getRmeStateProp(key) {
            return this.rmeState[key];
        }

    }

    const rmeStorage = new RMEStorage();

    /**
     * This function is not the recommended way to use components and is for legacy support
     * and will be removed in later releases. The recommended way to use components is the 
     * Component function.
     * 
     * The function creates or retrieves a component. 
     * If the first parameter is a string the function will try to get the component from the 
     * component storage. Otherwise the function will set the component in the component storage.
     * @param {*} component function, object or string.
     * @param {Object} props 
     */
    const component = (component, props) => {
        if (component && (Util.isFunction(component) || Util.isObject(component)))
            RMEComponentManager.addComponent(component, props);
        else if (component && Util.isString(component))
            return RMEComponentManager.getComponent(component, props);
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
    const storage = (key, value) => {
        if (Util.notEmpty(key) && Util.notEmpty(value))
            rmeStorage.setRmeStateProp(key, value);
        else if (Util.notEmpty(key) && Util.isEmpty(value))
            return rmeStorage.getRmeStateProp(key);
    }

    return {
        component,
        storage,
    }
}());

export default RME;