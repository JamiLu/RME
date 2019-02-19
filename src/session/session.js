/**
 * Session class is a wrapper interface for the SessionStorage and thus provides get, set, remove and clear methods of the SessionStorage.
 */
class Session {
    /**
     * Save data into the Session.
     * @param {string} key
     * @param {*} value
     */
    static set(key, value) {
        sessionStorage.setItem(key, value);
    }
    /**
     * Get the saved data from the Session.
     * @param {string} key
     */
    static get(key) {
        return sessionStorage.getItem(key);
    }
    /**
     * Remove data from the Session.
     * @param {string} key
     */
    static remove(key) {
        sessionStorage.removeItem(key);
    }
    /**
     * Clears the Session.
     */
    static clear() {
        sessionStorage.clear();
    }
}

export default Session;