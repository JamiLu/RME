import RMERouterContext from './RouterContext';
import RMERouterUtils from './RouterUtils';
import Util from '../util';

/**
 * The URL based router implementation. The router is used via invoking the useUrlRouter function.
 * This router is ideal for the single page applications. Router navigation is handled by the useRouter function.
 */
const RMEUrlRouter = (props, { updateState, asyncTask }) => {
    const { routes, url, prevUrl, prevRoute, skipPush, init, didChange, globalScrollTop } = props;

    if (!routes) {
        return null;
    }

    if (!init) {
        const updateUrl = (url, skipPush, didChange) => {
            updateState({
                init: true,
                url: url ? url : location.pathname,
                skipPush,
                didChange
            });
        }
        RMERouterContext.setRouter(routes, (url) => updateUrl(url, false, true));
        asyncTask(() => {
            window.addEventListener('popstate', () => updateUrl(undefined, true, true));
            updateUrl(undefined, true, true);
        });
    }

    let route;

    if (url !== prevUrl) {
        route = RMERouterUtils.findRoute(url, routes, RMERouterUtils.urlMatch);
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
        if (!route.hide && url !== prevUrl && !skipPush) {
            history.pushState(null, null, url);
        }
        if (didChange && window.scrollY > 0 && ((route.scrolltop === true) || (route.scrolltop === undefined && globalScrollTop))) {
            scrollTo(0, 0);
        }
        asyncTask(() => updateState({ didChange: false }, false));
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
};

export default RMEUrlRouter;
