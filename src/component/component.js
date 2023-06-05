import Util from '../util';
import RMEComponentManagerV2 from './manager';

/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 * @param {function} components commma separated list of components
 * @returns The given component function or a list of component functions if a list was given.
 */
const Component = (function() {

    const resolveComponent = component => {
        if (Util.isFunction(component)) {
            RMEComponentManagerV2.addComponent(component.valueOf().name, component);
        }
    }

    return (...components) => {
        components.forEach(component => 
            !Util.isEmpty(component.valueOf().name) && resolveComponent(component));

        return components.length === 0 ? components[0] : components;
    }

})();

export default Component;
