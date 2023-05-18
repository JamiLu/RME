import Util from '../util';
import { useValue } from './functions';

/**
 * Keeps RME App instances in memory
 */
const RMEAppManager = (function() {

    let seq = 0;
    const prefix = 'app';
    const [getFrom, setTo] = useValue({});

    /**
     * Set application instance in to the manager
     * @param {string} name 
     * @param {*} value 
     */
    const set = (name, value) => 
        setTo(store => ({
            ...store,
            [name]: value
        }), false);

    /**
     * Get application instance from the store by name
     * @param {string} name 
     * @returns Application instance
     */
    const get = (name) => getFrom()[name];

    /**
     * If the given name parameter is not empty then it will be returned otherwise a 
     * next available application name is created and returned.
     * @see createName
     * @param {name} name 
     * @returns Application name
     */
    const checkName = (name) => Util.notEmpty(name) ? name : createName();

    /**
     * Get application instance by name or return default application instance.
     * The default application instance is returned if the given name parameter is empty.
     * @param {string} name 
     * @returns Application instance
     */
    const getOrDefault = (name) => Util.notEmpty(name) ? get(name) : get(`${prefix}0`);

    /**
     * Creates a next available application name.
     * @returns Application name
     */
    const createName = () => {
        while (Util.notEmpty(get(prefix + seq))) {
            seq++;
        }
        return prefix + seq;
    }

    return {
        set,
        get,
        checkName,
        getOrDefault
    }

})();

export default RMEAppManager;
