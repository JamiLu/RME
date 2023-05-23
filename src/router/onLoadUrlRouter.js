import RMERouterUtils from './routerUtils';
import Util from '../util';

/**
 * Simple router implementation ment to be only used in cases where the route is navigated only once after the page load.
 * The router is used via invoking the useAutoUrlRouter function. This router is not ment for the single page applications.
 */
const RMEOnLoadUrlRouter  = (props, { asyncTask }) => {
    const { routes } = props;

    if (!routes) {
        return null;
    }

    const route = RMERouterUtils.findRoute(location.pathname, routes, RMERouterUtils.urlMatch);

    if (Util.notEmpty(route)) {
        if (Util.isFunction(route.onBefore)) {
            route.onBefore(route);
        }
        if (Util.isFunction(route.onAfter)) {
            asyncTask(() => route.onAfter(route));
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
}

export default RMEOnLoadUrlRouter;
