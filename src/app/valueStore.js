import Util from '../util';
import RMEAppManager from './manager';

/**
 * Manages between component shareable values.
 */
const ValueStore = (function() {

    class ValueStore {
        constructor() {
            this.values = new Map();
            this.valueRefGenerator = new RefGenerator('val');
        }
    
        /**
         * The function will set the given value to the app instance and return a getter and a setter function
         * for the given value. Values can be shared and used in between any component.
         * @param {*} value 
         * @returns An array containing the getter and the setter functions for the given value.
         */
        useValue(value, appName) {
            if (Util.isFunction(value)) {
                value = value(value);
            }
            const ref = this.valueRefGenerator.next();
            this.values.set(ref, value);
    
            const getter = () => this.values.get(ref);
            const setter = (next, update) => {
                if (Util.isFunction(next)) {
                    next = next(getter());
                }
    
                this.values.set(ref, next);
                
                if (update !== false) {
                    RMEAppManager.getOrDefault(appName).refresh();
                }
            }
            return [getter, setter];
        }
    }
    
    class RefGenerator {
        constructor(feed) {
            this.feed = feed || "";
            this.seq = 0;
        }
    
        next() {
            const ref = this.feed+this.seq;
            this.seq++
            return ref;
        }
    }
    
    const valueStore = new ValueStore();

    return valueStore;

})();

export default ValueStore;
