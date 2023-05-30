import RMEAppComponent from './RmeAppComponent';

/**
 * Manages RME components
 */
const RMEComponentManagerV2 = (function() {

    class RMEComponentManager {
        constructor() {
            this.componentFunctionMap = {};
            this.componentInstanceMap = {};
        }

        hasComponent(name) {
            return this.componentFunctionMap[name] !== undefined;
        }

        addComponent(name, renderHook) {
            if (!this.hasComponent(name)) {
                this.componentFunctionMap[name] = renderHook;
            }
        }

        getComponent(name, props, parent, parentContext = '', appName = '') {
            let component = this.componentInstanceMap[appName + name + parentContext];
            if (!component) {
                component = new RMEAppComponent(this.componentFunctionMap[name], appName, parentContext);
                this.componentInstanceMap[appName + name + parentContext] = component;
            }
            
            return component.render(props, parent);
        }

    }

    return new RMEComponentManager();

})();

export default RMEComponentManagerV2;
