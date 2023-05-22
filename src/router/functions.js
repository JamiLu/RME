import Component from '../component';
import RMEHashRouter from './hashRouter';
import RMEUrlRouter from './urlRouter';
import RMEOnLoadUrlRouter from './onLoadUrlRouter';
import RMERouterContext from './routerContext';
import Util from '../util';


const useHashRouter = (function() {

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

    return (routes) => {
        Component(RMEOnLoadUrlRouter);

        return {
            RMEOnLoadUrlRouter: {
                routes
            }
        }
    }
}());

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
