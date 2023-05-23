import { useValue } from '../app';
import Template from '../template';
import Browser from '../browser';
import Util from '../util';

class RMEAppComponent {
    constructor(renderHook, appName, parentContext) {
        this.store = useValue({}, appName);
        this.appName = appName;
        this.parentContext = parentContext;
        this.shouldUpdate = true;
        this.renderHook = renderHook;
        this.afterRenderTasks = [];
        this.prevProps = {}
        this.prevResult;
    }

    render(props) {
        const [getState, setState] = this.store;

        const nextProps = {
            ...props,
            ...getState()
        }

        const ops = {
            setState,
            updateState: (next, update) => {
                setState(state => ({
                    ...state,
                    ...(Util.isFunction(next) ? next(getState()) : next)
                }), update);
            },
            isStateEmpty: () => Object.keys(getState()).length === 0,
            shouldComponentUpdate: (shouldUpdateHook) => {
                if (Util.isFunction(shouldUpdateHook)) {
                    this.shouldUpdate = shouldUpdateHook(nextProps, this.prevProps) !== false;
                }
            },
            asyncTask: (asyncTaskHook) => {
                if (Util.isFunction(asyncTaskHook)) {
                    this.afterRenderTasks.push(asyncTaskHook)
                }
            }
        };

        let result;

        if (this.shouldUpdate) {
            result = this.renderHook(nextProps, ops);
            result = Template.isTemplate(result) ? Template.resolve(result, null, this.appName, this.parentContext) : result;
        } else {
            result = this.prevResult;
        }

        this.prevResult = result;
        this.prevProps = nextProps;

        if (this.afterRenderTasks.length > 0) {
            Browser.setTimeout(async () => {
                this.afterRenderTasks.forEach(async hook => hook());
                this.afterRenderTasks.length = 0;
            });
        }

        return result;
    }


}

export default RMEAppComponent;
