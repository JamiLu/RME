import Util from '../util';
import RMEComponentManagerV2 from '../component/manager';

const RMERouterUtils = (function() {

    /**
     * Cut the protocol and the domain off from the url if exist.
     * For example https://www.example.com/example -> /example
     * @param {string} url 
     * @returns The path of the url.
     */
    const getUrlPath = (url) => {
        return url.replace(/\:{1}\/{2}/, '').match(/\/{1}.*/).join();
    }

    /**
     * Function checks if the given URLs match and returns true if they match otherwise false is returned.
     * @param {string} oldUrl 
     * @param {string} newUrl 
     * @returns True or false
     */
    const urlMatch = (oldUrl, newUrl) => {
        oldUrl = Util.isString(oldUrl) ? oldUrl.replace(/\*/g, '.*').replace(/\/{2,}/g, '/') : oldUrl;
        const path = getUrlPath(newUrl);
        let found = path.match(oldUrl);
        if (Util.notEmpty(found)) {
            found = found.join();
        }

        return found === path && new RegExp(oldUrl).test(newUrl);
    }

    /**
     * Function checks if the given URLs match and returns true if they match otherwise false is returned.
     * @param {string} oldUrl 
     * @param {string} newUrl 
     * @returns True or false
     */
    const hashMatch = (oldUrl, newUrl) => {
        if (Util.isString(oldUrl)) {
            oldUrl = oldUrl.replace(/\*/g, '.*');
            if (oldUrl.charAt(0) !== '#') {
                oldUrl = `#${oldUrl}`;
            }
        }

        const hash = newUrl.match(/\#{1}.*/).join();
        let found = hash.match(oldUrl);
        found = Util.notEmpty(found) ? found.join() : null;

        return found === hash && new RegExp(oldUrl).test(newUrl);
    }

    /**
     * Function will search for the route by the given url parameter. A route will be returned if found otherwise
     * undefined is returned.
     * @param {string} url to match
     * @param {array} routes routes array
     * @param {Function} matcherHook matcher function
     * @see urlMatch - match by pathname
     * @see hashMatch - match by hash
     * @returns Found route object or undefined if not found
     */
    const findRoute = (url, routes, matcherHook) => {
        return url && routes.find((route) => matcherHook(route.route, url));
    }

    /**
     * Resolves the given element into a Template object
     * @param {string|Function|Elem} elem 
     * @param {object} props 
     * @returns Template object
     */
    const resolveRouteElem = (elem, props) => {
        if (Util.isFunction(elem) && RMEComponentManagerV2.hasComponent(elem.valueOf().name)) {
            return  { [elem.valueOf().name]: props };
        } else if (Util.isString(elem) && RMEComponentManagerV2.hasComponent(elem)) {
            return { [elem]: props };
        } else {
            return { _: elem.toTemplate() };
        }
    }

    return {
        getUrlPath,
        findRoute,
        urlMatch,
        hashMatch,
        resolveRouteElem
    }
}());

export default RMERouterUtils;
