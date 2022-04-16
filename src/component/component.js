import Util from '../util';
import App from '../app';
import RMEComponentManager from './manager';


/**
 * AppSetInitialStateJob is used internally to set a state for components in a queue. An application
 * instance might have not been created at the time when components are created so the queue will wait 
 * until the application instance is created and then sets the state for the components in the queue.
 */
const AppSetInitialStateJob = (function () {
    
    class InitStateJob {
        constructor() {
            this.updateJob;
            this.updateJobMap = {};
            this.appNameList = [];
        }

        resolveUpdateJobs() {
            if (!this.updateJob)
                this.updateJob = Util.setInterval(() => {
                    const appName = this.getAppNameIfPresent();
                    if (!Util.isEmpty(appName)) {
                        this.updateJobMap[appName].forEach(job => job());
                        this.updateJobMap[appName] = [];
                        this.appNameList = this.appNameList.filter(app => app !== appName);

                        if (this.appNameList.length === 0) {
                            Util.clearInterval(this.updateJob);
                            this.updateJob = undefined;
                        }
                    }
                });
        }

        getAppNameIfPresent() {
            return this.appNameList.find(appName => App.get(appName === "undefined" ? undefined : appName));
        }

        addToQueue(appName, job) {
            let updateQueue = this.updateJobMap[appName] || [];
            updateQueue.push(job);
            this.updateJobMap[appName] = updateQueue;
            this.appNameList = Object.keys(this.updateJobMap);
            this.resolveUpdateJobs();
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
            AppSetInitialStateJob.addToQueue(appName, () => App.get(appName).setState(stateRef, initialState));
        }
    }

    const bindGetState = (component, appName) => {
        const stateGetter = Util.isEmpty(appName) ? () => (state) => App.getState(state) : (state) => App.get(appName).getState(state);
        RMEComponentManager.addComponent(component, stateGetter);
    }

    const resolveComponent = component => {
        if (Util.isObject(component)) {
            bindGetState({[component.name]: component.comp}, component.appName);
            resolveInitialState(component.initialState, component.name+component.stateRef, component.appName);
        } else if (Util.isFunction(component) && Util.isEmpty(component.prototype) || Util.isEmpty(component.prototype.render)) {
            RMEComponentManager.addComponent({[component.valueOf().name]: component});
        } else if (Util.isFunction(component) && !Util.isEmpty(component.prototype.render)) {
            const comp = new component();
            bindGetState({[component.valueOf().name]: comp.render}, comp.appName);
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
            !Util.isEmpty(component.valueOf().name) && resolveComponent(component));
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
        name: component.valueOf().name,
        appName: appName,
        stateRef: getStateRef(state),
        initialState: {
            ...removeStateRef(state)
        }
    })

})();

/**
 * The function will bind an array of getter functions for the component. The getters are invoked
 * when the component is invoked. The values returend by the getters are set in the component properties.
 * @param {*} component
 * @param {Array} mapper Value mapper
 */
const bindGetters = (function() {

    return (component, mapper) => {
        let name;
        if (Util.isFunction(component))
            name = component.valueOf().name;
        else if (Util.isObject(component)) {
            name = component.name;
        }

        RMEComponentManager.bindGetters(name, mapper);

        return component;
    }

})();

export default Component;

export { bindState, bindGetters }