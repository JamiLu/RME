import Util from '../util';
import Template from '../template';

/**
 * Manages RME components
 */
const RMEComponentManager = (function() {

    class RMEComponentManager {
        constructor() {
            this.components = {};
            this.componentGetters = {};
        }

        addComponent(component, props) {
            if (Util.isFunction(component)) {
                component = component.call();
            }

            Object.keys(component).forEach((p) => {
                this.components[p] = {
                    component: component[p], 
                    update: Util.isFunction(props) ? props : undefined
                };
            });
        }

        getComponent(name, props) {
            let comp = this.components[name];
            if (!comp) {
                throw new Error(`Cannot find a component: "${name}"`);
            }
            if (Util.notEmpty(props) && Util.isFunction(comp.update)) {
                let stateRef = props.stateRef;
                if (Util.isEmpty(props.stateRef))
                    stateRef = name;
                else if (props.stateRef.search(name) === -1)
                    stateRef = `${name}${props.stateRef}`;

                props["stateRef"] = stateRef;
                const newProps = comp.update.call()(stateRef);
                const nextProps = {...props, ...newProps}; // nextProps is created for the sake of shouldComponentUpdate
                if (!nextProps.shouldComponentUpdate || nextProps.shouldComponentUpdate(nextProps) !== false) {
                    props = this.extendProps(props, newProps);
                }
            }
            if (Util.isEmpty(props))
                props = {};

            this.inflateGetterValues(name, props);

            if (Util.notEmpty(props.onBeforeCreate) && Util.isFunction(props.onBeforeCreate))
                props.onBeforeCreate.call(props, props);
            
            let ret = comp.component.call(props, props);
            
            if (Template.isTemplate(ret))
                ret = Template.resolve(ret);
            
            if (Util.notEmpty(props.onAfterCreate) && Util.isFunction(props.onAfterCreate))
                props.onAfterCreate.call(props, ret, props);
            
            if (Util.notEmpty(this.defaultApp) && Util.notEmpty(props.onAfterRender) && Util.isFunction(props.onAfterRender))
                this.defaultApp.addAfterRefreshCallback(props.onAfterRender.bind(ret, ret, props));

            return ret;
        }

        inflateGetterValues(component, props) {
            const mapper = this.getGetters(component);
            if (Util.notEmpty(mapper)) {
                const p = Object.keys(mapper)
                .reduce((prev, curr) => {
                    prev[curr] = Util.isFunction(mapper[curr]) ? mapper[curr]() : mapper[curr];
                    return prev;
                }, {});

                this.extendProps(props, p);
            }
        }

        extendProps(props, newProps) {
            if (Util.notEmpty(newProps)) {
                Object.keys(newProps).forEach(key => props[key] = newProps[key]);
            }
            return props;
        }

        /**
         * Function checks if the given components exists or not
         * @param {string} name 
         * @returns True if the component exists.
         */
        hasComponent(name) {
            return Util.notEmpty(this.components[name.replace('component:', '')]);
        }

        bindGetters(component, getters) {
            this.componentGetters[component] = getters;
        }

        getGetters(component) {
            return this.componentGetters[component];
        }
    }

    const manager = new RMEComponentManager();

    return manager;

})();

export default RMEComponentManager;