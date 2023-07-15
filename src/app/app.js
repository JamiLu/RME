import Util from '../util';
import Browser from '../browser';
import RMEElemRenderer from './renderer';
import RMETemplateResolver from '../template';
import Tree from '../tree';
import RMEAppManager from './manager';
import RMETemplateElement from '../template/RMETemplateElement';
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
            if (!(RMETemplateResolver.isTemplate(object) || RMETemplateFragmentHelper.isFragment(object))) {
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
            this.renderer;
            this.oldStage = "";
            this.ready = false;
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
            this.root = Util.isEmpty(root) ? Tree.getBody() : new RMETemplateElement(Tree.getFirst(root).dom());
            this.renderer = new RMEElemRenderer(this.root);
            this.ready = true;
            this.refresh();
        }
    
        refresh() {
            if (this.ready) {
                if (this.refreshQueue) {
                    Browser.clearTimeout(this.refreshQueue);
                }
                this.refreshQueue = Browser.setTimeout(() => {
                    console.time('resolve');
                    const freshStage = RMETemplateResolver.resolve({[this.root.toLiteralString()]: { ...this.rawStage }}, null, this.name);
                    console.timeEnd('resolve');

                    if (this.oldStage !== freshStage.toString()) {
                        console.time('merge');
                        this.oldStage = this.renderer.merge(freshStage).toString();
                        console.timeEnd('merge');
                    }
                    Browser.clearTimeout(this.refreshQueue);
                });
            }
        }
    }

    return {
        root: Builder.root,
        create: Builder.create
    }
}());

export default RMEAppBuilder;
