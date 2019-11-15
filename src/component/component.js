import Util from '../util';
import RME from '../rme';
import App from '../app';

/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 */
const Component = (function() {

    const resolveComponent = component => {
        if (Util.isObject(component)) {
            App.component({[component.name]: component.comp})(component.appName);
            App.setState(component.name+component.stateRef, component.initialState, false);
        } else if (Util.isFunction(component) && Util.isEmpty(component.prototype)) {
            RME.component({[component.name]: component});
        } else if (Util.isFunction(component)) {
            const comp = new component();
            App.component({[component.name]: comp.render})(comp.appName);
            let state = {};
            if (!Util.isEmpty(comp.onBeforeCreate))
                state.onBeforeCreate = comp.onBeforeCreate;
            if (!Util.isEmpty(comp.shouldComponentUpdate))
                state.shouldComponentUpdate = comp.shouldComponentUpdate;
            if (!Util.isEmpty(comp.onAfterCreate))
                state.onAfterCreate = comp.onAfterCreate;
            if (!Util.isEmpty(comp.onAfterRender))
                state.onAfterRender = comp.onAfterRender;
            state = {
                ...state,
                ...comp.initialState
            }
            App.get(comp.appName).setState(component.name, state, false);
        }
    }

    return (...components) => {
        components.forEach(component => 
            !Util.isEmpty(component.name) && resolveComponent(component));
    }

})();

const bindState = (function() {

    const getStateRef = state => {
        return state && state.stateRef ? state.stateRef : '';
    }

    const removeStateRef = state => {
        let obj = {
            ...state
        }
        delete obj.stateRef
        return obj;
    }

    return (component, state, appName) => ({
        comp: component,
        name: component.name,
        appName: appName,
        stateRef: getStateRef(state),
        initialState: {
            ...removeStateRef(state)
        }
    })

})();

export default Component;

export { bindState }