import RMERouterUtils from './routerUtils';
import RMERouterContext from './routerContext';
import Util from '../util';

/**
 * The hash based router implementation. The router is used via invoking the useHashRouter function.
 * This router is ment for the single page applications.
 */
const RMEHashRouter = (props, { asyncTask, updateState }) => {
    const { routes, url = location.hash, prevUrl, prevRoute, globalScrollTop, init } = props;

    if (!routes) {
        return null;
    }

    if (!init) {
        RMERouterContext.setRouter(routes, (url) => {
            updateState({
                url: url
            });
        });
        asyncTask(() => {
            window.addEventListener('hashchange', () => {
                updateState({
                    init: true,
                    url: location.hash
                });
            });
        });
    }

    let route;

    if (url !== prevUrl) {
        route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.hashMatch);
        asyncTask(() => {
            updateState({
                prevUrl: url,
                prevRoute: route
            }, false);
        });
    } else {
        route = prevRoute;
    }

    if (Util.notEmpty(route)) {
        if (Util.isFunction(route.onBefore)) {
            route.onBefore(route);
        }
        if (Util.isFunction(route.onAfter)) {
            asyncTask(() => route.onAfter(route));
        }
        if (route.hide) {
            location.href = prevUrl;
        }
        if (window.scrollY > 0 && ((route.scrolltop === true) || (route.scrolltop === undefined && globalScrollTop))) {
            scrollTo(0, 0);
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
};

export default RMEHashRouter;
