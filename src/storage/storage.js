/**
 * Storage class is a wrapper interface for the LocalStorage and thus provides get, set, remove and clear methods of the LocalStorage.
 */
class Storage {
    /**
     * Save data into the local storage. 
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {
        localStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the local storage.
     * @param {string} key
     */
    static get(key) {
        return localStorage.getItem(key);
    }
    /**
     * Remove data from the local storage.
     * @param {string} key
     */
    static remove(key) {
        localStorage.removeItem(key);
    }
    /**
     * Clears the local storage.
     */
    static clear() {
        localStorage.clear();
    }
}

export default Storage;