import RME from '../rme';
import Elem from '../elem';
import Tree from '../tree';
import Template from '../template';
import Browser from '../browser';
import Util from '../util';

let Router = (function() {
    /**
     * Router class handles and renders route elements that are given by Router.routes() method.
     * The method takes an array of route objects that are defined as follows: {route: "url", elem: elemObject, hide: true|false|undefined}.
     * The first element the array of route objects is by default the root route object in which all other route objects 
     * are rendered into.
     */
    class Router {
        constructor() {
            this.instance = null;
            this.root = null;
            this.origRoot = null;
            this.routes = [];
            this.origRoutes = [];
            this.currentRoute = {};
            this.prevUrl = location.pathname;
            this.loadCall = () => this.navigateUrl(location.pathname);
            this.hashCall = () => this.navigateUrl(location.hash);
            this.useHistory =  true;
            this.autoListen = true;
            this.useHash = false;
            this.scrolltop = true;
            this.app;
            this.registerRouter();
        }

        /**
         * Initializes the Router.
         */
        registerRouter() {
            document.addEventListener("readystatechange", () => {
                if(document.readyState === "complete") {
                    let check = Util.setInterval(() => {
                        let hasRoot = !Util.isEmpty(this.root.elem) ? document.querySelector(this.root.elem) : false;
                        if(hasRoot) {
                            Util.clearInterval(check);
                            this.resolveRoutes();
                        }
                    }, 50)
                }
            });
        }

        /**
         * Register listeners according to the useHistory and the autoListen state.
         */
        registerListeners() {
            if(this.useHistory && this.autoListen)
                window.addEventListener("load", this.loadCall);
            else if(!this.useHistory && this.autoListen)
                window.addEventListener("hashchange", this.hashCall);
            
            if(!this.autoListen)
                window.addEventListener("popstate", this.onPopState.bind(this));
        }

        /**
         * Clear the registered listeners.
         */
        clearListeners() {
            window.removeEventListener("load", this.loadCall);
            window.removeEventListener("hashchange", this.hashCall);

            if(!this.autoListen)
                window.removeEventListener("popstate", this.onPopState);
        }

        /**
         * On popstate call is registered if the auto listen is false. It listens the browsers history change and renders accordingly.
         */
        onPopState() {
            if(this.useHistory)
                this.renderRoute(location.pathname);
            else 
                this.renderRoute(location.hash);
        }

        /**
         * Set the router to use a history implementation or an anchor hash implementation.
         * If true then the history implementation is used. Default is true.
         * @param {boolean} use
         */
        setUseHistory(use) {
            this.useHistory = use;
        }

        /**
         * Set the Router to auto listen url change to true or false.
         * @param {boolean} listen
         */
        setAutoListen(listen) {
            this.autoListen = listen;
        }

        /**
         * Set auto scroll up true or false.
         * @param {boolean} auto 
         */
        setAutoScrollUp(auto) {
            this.scrolltop = auto;
        }

        /**
         * Set the app instance that the Router invokes on update.
         * @param {object} appInstance 
         */
        setApp(appInstance) {
            this.app = appInstance;
        }

        /**
         * Resolves the root and the first page.
         */
        resolveRoutes() {
            if(Util.isString(this.root.elem)) {
                this.root.elem = this.resolveElem(this.root.elem);
            } else if(Util.isEmpty(this.root)) {
                this.root = this.routes.shift();
                this.root.elem = this.resolveElem(this.root.elem);
                this.origRoot = this.root.elem;
            }
            if(this.useHash) {
                this.renderRoute(location.hash);
            } else {
                this.renderRoute(location.pathname);
            }
        }

        /**
         * Set the routes and if a root is not set then the first element will be the root route element.
         * @param {array} routes
         */
        setRoutes(routes) {
            this.routes = routes;
        }

        /**
         * Add a route into the Router. {route: "url", elem: elemObject}
         * @param {object} route
         */
        addRoute(route) {
            this.routes.push(route);
        }

        /**
         * Set a root route object into the Router. {route: "url", elem: elemObject}
         * @param {object} route
         */
        setRoot(route) {
            this.root = route;
            this.origRoot = route.elem;
        }

        /**
         * @deprecated
         * Resolve route elements.
         * @param {array} routes 
         */
        resolveRouteElems(routes) {
            let i = 0;
            while (i < routes.length) {
                routes[i].elem = this.resolveElem(routes[i].elem);
                i++;
            }
            return routes;
        }

        /**
         * Method resolves element. If elem is string gets a component of the name if exist otherwise creates a new elemen of the name.
         * If both does not apply then method assumes the elem to be an element and returns it.
         * @param {*} elem 
         */
        resolveElem(elem, props) {
            if (Util.isString(elem) && RME.hasComponent(elem)) {
                return RME.component(elem, props);
            } else if (Util.isString(elem) && this.isSelector(elem)) {
                return Tree.getFirst(elem);
            } else if (elem instanceof Elem) {
                return elem;
            } else if (Util.isEmpty(elem)) {
                return elem;
            }
            throw new Error(`Could not resolve a route elem: ${elem}`);
        }

        /**
         * Function checks if a tag starts with a dot or hashtag or is a HTML tag.
         * If described conditions are met then the tag is supposed to be a selector.
         * @param {string} tag 
         * @returns True if the tag is a selector otherwise false.
         */
        isSelector(tag) {
            return tag.charAt(0) === '.'
                || tag.charAt(0) === '#'
                || Template.isTag(tag);
        }

        /**
         * Method navigates to the url and renders a route element inside the root route element if found.
         * @param {string} url
         */
        navigateUrl(url) {
            var route = this.findRoute(url);
            if (!Util.isEmpty(route) && this.useHistory && !route.hide) {
                history.pushState(null, null, url);
            } else if(!Util.isEmpty(route) && !route.hide) {
                location.href = url;
            }
            if (!Util.isEmpty(this.root) && !Util.isEmpty(route)) {
                if ((route.scrolltop === true) || (route.scrolltop === undefined && this.scrolltop))
                    Browser.scrollTo(0, 0);
                this.prevUrl = this.getUrlPath(url);
                this.currentRoute = route;
                if (Util.isEmpty(this.app)) {
                    if (!Util.isEmpty(route.onBefore)) route.onBefore();
                    this.root.elem.render(this.resolveElem(route.elem, route.compProps));
                    if (!Util.isEmpty(route.onAfter)) route.onAfter();
                } else {
                    if (!Util.isEmpty(route.onBefore)) route.onBefore();
                    this.app.refresh();
                }
            }
        }

        /**
         * Method looks for a route by the url. If the router is found then it will be returned otherwise returns null
         * @param {string} url
         * @param {boolean} force
         * @returns The found router or null if not found.
         */
        findRoute(url, force) {
            var i = 0;
            if(!Util.isEmpty(url) && (this.prevUrl !== this.getUrlPath(url) || force)) {
                while(i < this.routes.length) {
                    if(this.matches(this.routes[i].route, url))
                        return this.routes[i];
                    i++;
                }
            }
            return null;
        }

        /**
         * Method will look for a route by the url and if the route is found then it will be rendered 
         * inside the root route element.
         * @param {string} url
         */
        renderRoute(url) {
            var route = this.findRoute(url, true);
            if(!Util.isEmpty(route) && Util.isEmpty(this.app)) {
                if (!Util.isEmpty(route.onBefore)) route.onBefore();
                this.root.elem.render(this.resolveElem(route.elem, route.compProps));
                this.currentRoute = route;
                if (!Util.isEmpty(route.onAfter)) route.onAfter();
            } else if(Util.isEmpty(this.app)) {
                this.root.elem.render();
            } else if(!Util.isEmpty(route) && !Util.isEmpty(this.app)) {
                if (!Util.isEmpty(route.onBefore)) route.onBefore();
                this.app.refresh();
                this.currentRoute = route;
            }

            this.prevUrl = location.pathname;
        }

        /**
         * Method matches a given url parameters and returns true if the urls matches.
         * @param {string} url
         * @param {string} newUrl
         * @returns True if the given urls matches otherwise false.
         */
        matches(url, newUrl) {
            if (this.useHistory) {
                url = Util.isString(url) ? url.replace(/\*/g, '.*').replace(/\/{2,}/g, '/') : url;
                let path = this.getUrlPath(newUrl);
                let found = path.match(url);
                if (!Util.isEmpty(found))
                    found = found.join();
                return found === path && new RegExp(url).test(newUrl);
            } else {
                if (Util.isString(url) && url.charAt(0) === '*')
                    url = '.*';
                else if (Util.isString(url) && url.charAt(0) !== '#')
                    url = `#${url}`;
                let hash = newUrl.match(/\#{1}.*/).join();
                let found = hash.match(url);
                if (!Util.isEmpty(found))
                    found = found.join();
                return found === hash && new RegExp(url).test(newUrl);
            }
        }

        /**
         * Cut the protocol and domain of the url off if exist.
         * For example https://www.example.com/example -> /example
         * @param {string} url 
         * @returns The path of the url.
         */
        getUrlPath(url) {
            return url.replace(/\:{1}\/{2}/, '').match(/\/{1}.*/).join();
        }

        /**
         * @returns The current status of the Router in an object.
         */
        getCurrentState() {
            return {
                root: this.origRoot,
                current: this.resolveElem(this.currentRoute.elem, this.currentRoute.compProps),
                onAfter: this.currentRoute.onAfter
            }
        }

        /**
         * Method will try to find a route according to the given parameter. The supported parameter combinations are url, event or elem & event. 
         * The first paramter can either be an URL or an Event or an Elem. The second parameter is an Event if the first parameter is an Elem.
         * If the route is found, then the Router will update a new url to the browser and render the found route element.
         * @param {string} url
         * @param {object} url type event
         * @param {object} url type Elem
         * @param {object} event
         */
        static navigate(url, event) {
            if(Util.isString(url))
                Router.getInstance().navigateUrl(url);
            else if(Util.isObject(url) && url instanceof Event) {
                if(!Router.getInstance().autoListen || Router.getInstance().useHash)
                    url.preventDefault();
                Router.getInstance().navigateUrl(url.target.href);
            } else if(Util.isObject(url) && url instanceof Elem && !Util.isEmpty(event) && Util.isObject(event) && event instanceof Event) {
                if(!Router.getInstance().autoListen || Router.getInstance().useHash)
                    event.preventDefault();
                Router.getInstance().navigateUrl(url.getHref());
            }
        }

        /**
         * Set a root element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {object} elem
         * @returns Router
         */
        static root(elem) {
            Router.getInstance().setRoot({elem: elem});
            return Router;
        }

        /**
         * Add a new route element into the Router. Elem parameter must be an Elem object in order to the Router is able to render it.
         * @param {string} url
         * @param {object} elem
         * @param {boolean} hide
         */
        static add(url, elem, hide) {
            Router.getInstance().addRoute({route: url, elem: elem, hide: hide});
            return Router;
        }

        /**
         * Set an array of routes that the Router uses. If a root is not set then the first item in the given routes array will be the root route element.
         * @param {array} routes
         */
        static routes(routes) {
            if(!Util.isArray(routes))
                throw "Could not set routes. Given parameter: \"" + routes + "\" is not an array."
            Router.getInstance().setRoutes(routes);
            return Router;
        }

        /**
         * Method sets the Router to use an url implementation. The url implementation defaults to HTML standard that pressing a link
         * will cause the browser reload a new page. After reload the new page is rendered. If you wish to skip reload then you should 
         * set the parameter manual to true.
         * @param {boolean} manual
         * @returns Router
         */
        static url(manual) {
            Router.getInstance().setUseHistory(true);
            Router.getInstance().registerListeners();
            if(Util.isBoolean(manual) && manual) {
                Router.manual();
            }
            return Router;
        }

        /**
         * Method sets the Router not to automatically follow url changes. If this method is invoked 
         * the user must explicitly define a method that calls Router.navigate in order to have navigation working
         * properly when going forward and backward in the history. The method will not 
         * do anything if the url implementation is not used.
         * @returns Router
         */
        static manual() {
            if(Router.getInstance().useHistory) {
                Router.getInstance().clearListeners();
                Router.getInstance().setAutoListen(false);
                Router.getInstance().registerListeners();
            }
            return Router;
        }

        /**
         * Method sets the Router to use a hash implementation. When this implementation is used 
         * there is no need to manually use Router.navigate function because change
         * of the hash is automatically followed.
         * @returns Router
         */
        static hash() {
            Router.getInstance().setUseHistory(false);
            Router.getInstance().setAutoListen(true);
            Router.getInstance().registerListeners();
            Router.getInstance().useHash = true;
            return Router;
        }

        /**
         * Method sets default level behavior for route naviagation. If the given value is true then the Browser auto-scrolls up 
         * when navigating to a new resource. If set false then the Browser does not auto-scroll up. Default value is true.
         * @param {boolean} auto 
         * @returns Router
         */
        static scroll(auto) {
            if(Util.isBoolean(auto)) {
                Router.getInstance().setAutoScrollUp(auto);
            }
            return Router;
        }

        /**
         * Set the app instance to be invoked on the Router update.
         * @param {object} appInstance 
         * @returns Router
         */
        static setApp(appInstance) {
            if(!Util.isEmpty(appInstance))
                Router.getInstance().setApp(appInstance);
            return Router;
        }

        /**
         * @returns The current status of the router.
         */
        static getCurrentState() {
            return Router.getInstance().getCurrentState();
        }

        static getInstance() {
            if(Util.isEmpty(this.instance))
                this.instance = new Router();
            return this.instance;
        }
    }
    return {
        navigate: Router.navigate,
        root: Router.root,
        add: Router.add,
        routes: Router.routes,
        url: Router.url,
        hash: Router.hash,
        scroll: Router.scroll,
        getCurrentState: Router.getCurrentState,
        setApp: Router.setApp,
    }
}());

export default Router;