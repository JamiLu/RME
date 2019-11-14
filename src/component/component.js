import Util from '../util';
import RME from '../rme';
import App from '../app';

const Component = (function() {

    const resolveComponent = component => {
        if (Util.isFunction(component) && Util.isEmpty(component.prototype)) {
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
        components.forEach(component => resolveComponent(component));
    }

})();

export default Component;