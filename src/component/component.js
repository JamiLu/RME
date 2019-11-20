import Util from '../util';
import RME from '../rme';
import App from '../app';


/**
 * AppSetInitialStateJob is used internally to set a state for components in a queue. An application
 * instance might have not been created at the time when components are created so the queue will wait 
 * until the application instance is created and then sets the state for the components in the queue.
 */
const AppSetInitialStateJob = (function () {
    
    class InitStateJob {
        constructor() {
            this.updateQueue = [];
            this.updateJob;
        }

        resolveUpdateJobs(resolveCondition) {
            if (!this.updateJob)
                this.updateJob = Util.setInterval(() => {
                    if (resolveCondition()) {
                        this.updateQueue.forEach(job => job());
                        this.updateQueue = [];
                        Util.clearInterval(this.updateJob);
                        this.updateJob = undefined;
                    }
                });
        }

        addToQueue(job) {
            this.updateQueue.push(job);
            return this;
        }
    }

    const initStateJob = new InitStateJob();

    return {
        addToQueue: initStateJob.addToQueue.bind(initStateJob),
        resolveUpdateJobs: initStateJob.resolveUpdateJobs.bind(initStateJob)
    }

})();

/**
 * Component resolves comma separated list of components that may be function or class.
 * Function component example: const Comp = props => ({h1: 'Hello'});
 * Class component example: class Comp2 {.... render(props) { return {h1: 'Hello'}}};
 * Resolve components Component(Comp, Comp2);
 * @param {function} components commma separated list of components
 */
const Component = (function() {


    const resolveInitialState = (initialState, stateRef, appName) => {
        if (!Util.isEmpty(App.get(appName))) {
            App.get(appName).setState(stateRef, initialState, false);
        } else {
            AppSetInitialStateJob.addToQueue(() => App.get(appName).setState(stateRef, initialState))
                .resolveUpdateJobs(() => !Util.isEmpty(App.get(appName)));
        }
    }

    const resolveComponent = component => {
        if (Util.isObject(component)) {
            App.component({[component.name]: component.comp})(component.appName);
            resolveInitialState(component.initialState, component.name+component.stateRef, component.appName);
        } else if (Util.isFunction(component) && Util.isEmpty(component.prototype) || Util.isEmpty(component.prototype.render)) {
            RME.component({[component.name]: component});
        } else if (Util.isFunction(component) && !Util.isEmpty(component.prototype.render)) {
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
            const ref = comp.stateRef || state.stateRef || '';
            resolveInitialState(state, component.name+ref, comp.appName);
        }
    }

    return (...components) => {
        components.forEach(component => 
            !Util.isEmpty(component.name) && resolveComponent(component));
    }

})();

/**
 * A bindState function transfers a function component to a stateful component just like it was created 
 * using class or App class itself. The function receives three parameters. The function component,
 * an optional state object and an optinal appName.
 * Invoking examples:
 * Component(bindState(StatefulComponent));
 * Component(bindState(OtherComponent, { initialValue: 'initialText' }));
 * @param {function} component
 * @param {object} state
 * @param {string} appName
 */
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