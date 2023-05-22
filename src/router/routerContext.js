import RMERouterUtils from './routerUtils';

const RMERouterContext = (function() {

    class RouterContext {
        constructor() {
            this.ins;
            this.routers = [];
        }

        /**
         * Set a router into the context store by the key and the value.
         * @param {string} key the router key
         * @param {Function} value the router routes and the navigation hook
         */
        set(key, value) {
            if ((!!key && !!value) && !this.has(key)) {
                this.routers.push({ key, ...value });
            }
        }

        /**
         * Searches fo the routers by the router key if router is found the function will return true.
         * @param {string} key 
         * @returns True if found otherwise false
         */
        has(key) {
            return !!this.routers.find(route => route.key === key);
        }

        /**
         * Searches the router by the url. The navigation hook of the last mathced router is returned.
         * If no routers match then an empty function will be returned instead.
         * @param {string} url 
         * @returns The router navigation hook
         */
        get(url) {
            let found;
            let prevFoundRouter;

            if (url.match(/^\/[^#]/) || url === '/') {
                const urlRouters = this.routers.filter(router => router.key.match(/^:\//));

                found = urlRouters.find((router, idx) => {
                    const route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.urlMatch);

                    if (!!route) {
                        prevFoundRouter = router;
                    }
                    return !!route && idx === urlRouters.length - 1;
                });

                found = found || prevFoundRouter;
            } else {
                const hashRouters = this.routers.filter(router => router.key.match(/^:#?/));

                found = hashRouters.find((router, idx) => {
                    const route = RMERouterUtils.findRoute(url, router.routes, RMERouterUtils.hashMatch);

                    if (!!route) {
                        prevFoundRouter = router;
                    }
                    return !!route && idx === hashRouters.length - 1;
                });

                found = found || prevFoundRouter;
            }

            return !!found ? found.navigateHook : () => undefined;
        }

        /**
         * Creates a string key from the route array
         * @param {array} routes 
         * @returns {string} RouterContext key
         */
        static createContextKey(routes) {
            return `:${routes.map(route => route.route).join(':')}`;
        }

        /**
         * Navigate to the given url. Function attempts to find the router by the url and
         * if found the navigation hook of the router is invoked with the url.
         * @param {string} url 
         */
        static navigateTo(url) {
            RouterContext.instance.get(RMERouterUtils.getUrlPath(url))(url);
        }

        /**
         * Set the route array and the router navigate hook into the RouterContext store
         * @param {array} routes the router routes
         * @param {Function} navigateHook the router navigation hook
         */
        static setRouter(routes, navigateHook) {
            RouterContext.instance.set(RouterContext.createContextKey(routes), { routes, navigateHook });
        }

        static get instance() {
            if (!this.ins) {
                this.ins = new RouterContext();
            }
            return this.ins;
        }
    }

    return RouterContext;

}());

export default RMERouterContext;
