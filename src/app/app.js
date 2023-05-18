import Util from '../util';
import RMEElemRenderer from './renderer';
import Template from '../template';
import Tree from '../tree';
import RMEAppManager from './manager';
import RMETemplateFragmentHelper from '../template/fragment';
import { ready } from '../rme';

const RMEAppBuilder = (function() {

    const holder = {
        appRoot: undefined
    }

    class Builder {

        /**
         * Function will set a root for an application. If the root is not set then body is used by default.
         * @param {string} root 
         * @returns Builder
         */
        static root(root) {
            holder.appRoot = Util.isString(root) && root;
            return Builder;
        }
    
        /**
         * Reset Builder settings
         * @returns Builder
         */
        static reset() {
            holder.appRoot = undefined;
            return Builder;
        }
    
        /**
         * Function creates an application. The given parameter can either be a Template object or an Elem object.
         * @param {*} object 
         * @returns AppInstance
         */
        static create(object) {
            if (!(Template.isTemplate(object) || RMETemplateFragmentHelper.isFragment(object))) {
                throw new Error('App template must start with a valid html tag or a fragment key');
            }
            const app = new AppInstance(RMEAppManager.createName(), holder.appRoot, object);
            RMEAppManager.set(app.name, app);
            Builder.reset();
            return app;
        }
    }

    class AppInstance {
        constructor(name, root, object) {
            this.rawStage = object;
            this.name = name;
            this.root; 
            this.state = {};
            this.renderer;
            this.oldStage = "";
            this.router;
            this.ready = false;
            this.refresh = this.refreshApp.bind(this);
            this.afterRefreshCallQueue = [];
            this.refreshQueue;
            this.bindReadyListener(root);
        }
    
        bindReadyListener(root) {
            ['loading','interactive'].includes(document.readyState) 
                ? ready(() => this.init(root))
                : this.init(root);
        }
    
        /**
         * Initialize the Application
         * @param {string} root 
         */
        init(root) {
            this.root = Util.isEmpty(root) ? Tree.getBody() : Tree.getFirst(root);
            this.renderer = new RMEElemRenderer(this.root);
            this.ready = true;
            this.refreshApp();
        }
    
        refreshApp() {
            if (this.ready) {
                if (this.refreshQueue)
                    Util.clearTimeout(this.refreshQueue);

                this.refreshQueue = Util.setTimeout(() => {
                    const freshStage = Template.resolve({[this.root.toLiteralString()]: { ...this.rawStage }}, null, this.name);
    
                    if (Util.notEmpty(this.router)) {
                        let state = this.router.getCurrentState();
                        if (Util.notEmpty(state.current)) {
                            let selector = state.root;
                            let element = state.current;
                            if (RMETemplateFragmentHelper.isFragment(element)) {
                                const fragment = {};
                                fragment[state.rootElem.toLiteralString()] = {
                                    ...RMETemplateFragmentHelper.resolveFragmentValue(element, fragment)
                                };
                                freshStage.getFirst(selector).replace(Template.resolve(fragment));
                            } else {
                                freshStage.getFirst(selector).append(element);
                            }
                            if (Util.notEmpty(state.onAfter)) this.afterRefreshCallQueue.push(state.onAfter);
                        }
                    }

                    if (this.oldStage.toString() !== freshStage.toString()) {
                        this.oldStage = this.renderer.merge(freshStage);
                    }
                    this.refreshAppDone();
                    Util.clearTimeout(this.refreshQueue);
                });
            }
        }

        refreshAppDone() {
            this.afterRefreshCallQueue.forEach(callback => callback());
            this.afterRefreshCallQueue = [];
        }

        addAfterRefreshCallback(callback) {
            if(Util.isFunction(callback)) {
                this.afterRefreshCallQueue.push(callback)
            }
        }
    
        setRouter(router) {
            this.router = router;
        }
    
    }

    return {
        root: Builder.root,
        create: Builder.create
    }
}());

export default RMEAppBuilder;
