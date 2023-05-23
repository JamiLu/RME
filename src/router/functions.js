import Component from '../component';
import RMEHashRouter from './hashRouter';
import RMEUrlRouter from './urlRouter';
import RMEOnLoadUrlRouter from './onLoadUrlRouter';
import RMERouterContext from './routerContext';
import Util from '../util';


const useHashRouter = (function() {

    /**
     * The useHashRouter function creates and returns the hash based router component.
     * The router is suitable for single page applications.
     * @param {array} routes router routes
     */
    return (routes, globalScrollTop = true) => {
        Component(RMEHashRouter);

        return {
            RMEHashRouter: {
                routes,
                globalScrollTop
            }
        };
    }
}());

const useAutoUrlRouter = (function() {

    /**
     * The useAutoUrlRouter function creates and returns the url based router component.
     * The router is suitable for web pages that only load one route once one the page load.
     * @param {array} routes router routes
     */
    return (routes) => {
        Component(RMEOnLoadUrlRouter);

        return {
            RMEOnLoadUrlRouter: {
                routes
            }
        }
    }
}());

/**
 * The useUrlRouter function creates and returns the url based router component.
 * The router is suitable for single page applications.
 * @param {array} routes router routes
 */
const useUrlRouter = (function() {
    
    return (routes, globalScrollTop = true) => {
        Component(RMEUrlRouter);

        return {
            RMEUrlRouter: {
                listenLoad: false,
                routes,
                globalScrollTop,
            }
        }
    }
}());

const useRouter = (function() {

    /**
     * The useRouter function handles the navigation of the last matched router in the RouterContext.
     * This function is needed to handle the navigation when using the single page page application url router.
     * The parameter url can either be a string or an event. If the url is an event then the target url is read from the event.target.href attribute.
     * @param {string|Event} url the url to navigate to
     */
    return (url) => {
        if (Util.isString(url)) {
            RMERouterContext.navigateTo(url);
        } else if (url instanceof Event) {
            url.preventDefault();
            RMERouterContext.navigateTo(url.target.href);
        }
    }
}());

export { useHashRouter, useAutoUrlRouter, useUrlRouter, useRouter }
