import Http from './index';

/**
 * Before using this class you should also be familiar on how to use fetch since usage of this class
 * will be quite similar to fetch except predefined candy that is added on a class.
 *
 * The class is added some predefined candy over the JavaScript Fetch interface.
 * get|post|put|delete methods will automatically use JSON as a Content-Type
 * and request methods will be predefined also.
 *
 * FOR Fetch
 * A Config object supports following:
 *  {
 *      url: url,
 *      method: method,
 *      contentType: contentType,
 *      init: init
 *  }
 *
 *  All methods also take init object as an alternative parameter. Init object is the same object that fetch uses.
 *  For more information about init Google JavaScript Fetch or go to https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 *
 *  If a total custom request is desired you should use a method do({}) e.g.
 *  do({url: url, init: init}).then((resp) => resp.json()).then((resp) => console.log(resp)).catch((error) => console.log(error));
 */
class HttpFetchRequest {
    constructor() {}
    /**
     * Does Fetch GET request. Content-Type JSON is used by default.
     * @param {stirng} url *Required
     * @param {*} init 
     */
    get(url, init) {
        if(!init) init = {};
        init.method = "GET";
        return this.do({url: url, init: init, contentType: Http.JSON});
    }
    /**
     * Does Fetch POST request. Content-Type JSON is used by default.
     * @param {string} url *Required
     * @param {*} body 
     * @param {*} init 
     */
    post(url, body, init) {
        if(!init) init = {};
        init.method = "POST";
        init.body = body;
        return this.do({url: url, init: init, contentType: Http.JSON});
    }
    /**
     * Does Fetch PUT request. Content-Type JSON is used by default.
     * @param {string} url *Required
     * @param {*} body 
     * @param {*} init 
     */
    put(url, body, init) {
        if(!init) init = {};
        init.method = "PUT";
        init.body = body;
        return this.do({url: url, init: init, contentType: Http.JSON});
    }
    /**
     * Does Fetch DELETE request. Content-Type JSON is used by default.
     * @param {string} url 
     * @param {*} init 
     */
    delete(url, init) {
        if(!init) init = {};
        init.method = "DELETE";
        return this.do({url: url,  init: init, contentType: Http.JSON});
    }
    /**
     * Does any Fetch request a given config object defines.
     * 
     * Config object can contain parameters:
     * {
     *      url: url,
     *      method: method,
     *      contentType: contentType,
     *      init: init
     *  }
     * @param {object} config 
     */
    do(config) {
        if(!config.init) config.init = {};
        if(config.contentType) {
            if(!config.init.headers)
                config.init.headers = new Headers({});
            if(!config.init.headers.has("Content-Type"))
                config.init.headers.set("Content-Type", config.contentType);
        }
        if(config.method) {
            config.init.method = config.method;
        }
        return fetch(config.url, config.init);
    }
}

export default HttpFetchRequest;