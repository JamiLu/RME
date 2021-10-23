/**
 * Keeps app instances in memory
 */
const AppManager = (function() {

    class AppManager {
        constructor() {
            this.apps = {};
        }

        set(name, value) {
            this.apps[name] = value;
        }

        get(name) {
            return this.apps[name];
        }
    }

    const manager = new AppManager();

    return manager;

})();

export default AppManager;