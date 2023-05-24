import RMERouterContext from './RouterContext';
import RMERouterUtils from './RouterUtils';
import Util from '../util';

/**
 * The URL based router implementation. The router is used via invoking the useUrlRouter function.
 * This router is ideal for the single page applications. Router navigation is handled by the useRouter function.
 */
const RMEUrlRouter = (props, { updateState, asyncTask }) => {
    const { routes, url, prevUrl, prevRoute, skipPush, init, globalScrollTop } = props;

    if (!routes) {
        return null;
    }

    if (!init) {
        const updateUrl = (url, skipPush) => {
            updateState({
                init: true,
                url: url ?? location.pathname,
                skipPush
            });
        }
        RMERouterContext.setRouter(routes, (url) => updateUrl(url));
        asyncTask(() => {
            window.addEventListener('popstate', () => updateUrl(undefined, true));
            updateUrl(undefined, true);
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
        if (window.scrollY > 0 && ((route.scrolltop === true) || (route.scrolltop === undefined && globalScrollTop))) {
            scrollTo(0, 0);
        }
    }

    return {
        _: !!route ? RMERouterUtils.resolveRouteElem(route.elem, route.props) : null
    }
};

export default RMEUrlRouter;
