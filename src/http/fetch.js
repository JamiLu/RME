import Http from './index';
import Util from '../util';

const Fetch = (function() {
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
    class Fetch {
        constructor() {}

        /**
         * Does Fetch GET request. Content-Type JSON is used by default.
         * @param {stirng} url *Required
         * @param {*} config 
         */
        get(url, config = {}) {
            config.method = 'GET';
            return this.do({url: url, init: config, contentType: config.contentType || Http.JSON});
        }

        /**
         * Does Fetch POST request. Content-Type JSON is used by default.
         * @param {string} url *Required
         * @param {*} body 
         * @param {*} config 
         */
        post(url, body, config = {}) {
            config.method = 'POST';
            return this.do({url: url, body: body, init: config, contentType: config.contentType || Http.JSON});
        }

        /**
         * Does Fetch PUT request. Content-Type JSON is used by default.
         * @param {string} url *Required
         * @param {*} body 
         * @param {*} config 
         */
        put(url, body, config = {}) {
            config.method = 'PUT';
            return this.do({url: url, body: body, init: config, contentType: config.contentType || Http.JSON});
        }

        /**
         * Does Fetch DELETE request. Content-Type JSON is used by default.
         * @param {string} url 
         * @param {*} config 
         */
        delete(url, config = {}) {
            config.method = 'DELETE';
            return this.do({url: url, init: config, contentType: config.contentType || Http.JSON});
        }

        /**
         * Does Fetch PATCH request. Content-Type JSON is used by default.
         * @param {string} url 
         * @param {*} body
         * @param {*} config 
         */
        patch(url, body, config = {}) {
            config.method = 'PATCH';
            return this.do({url, url, body: body, init: config, contentType: config.contentType || Http.JSON});
        }

        /**
         * Does any Fetch request a given config object defines.
         * 
         * Config object can contain parameters:
         * {
         *      url: url,
         *      method: method,
         *      body: body,
         *      contentType: contentType,
         *      init: init
         *  }
         * @param {object} config 
         */
        do(config) {
            if (Util.isEmpty(config) || !Util.isObject(config) || Util.isEmpty(config.url)) {
                throw new Error(`Error in fetch config object ${JSON.stringify(config)}, url must be set`);
            }
            if (!config.init) config.init = {};
            if (config.contentType) {
                if (!config.init.headers)
                    config.init.headers = new Headers({});
                if (!config.init.headers.has('Content-Type'))
                    config.init.headers.set('Content-Type', config.contentType);
                
            }
            if ((config.body || config.init.body) && isContentType(config.contentType, Http.JSON)) {
                config.init.body = JSON.stringify(config.body || config.init.body);
            } else if (config.body) {
                config.init.body = config.body;
            }
            if (config.method) {
                config.init.method = config.method;
            }
            return fetch(config.url, config.init)
                .then((response) => {
                    if (!response.ok) {
                        throw Error(`Error in requesting url: ${config.url}, method: ${config.init.method}`);
                    }
                    if (isContentType(config.contentType, Http.JSON)) {
                        const res = response.text();
                        return res.length > 0 ? JSON.parse(res) : res; // Avoid null body failure
                    }
                    if (isContentType(config.contentType, Http.TEXT_PLAIN)) {
                        return response.text();
                    }
                    if (isContentType(config.contentType, Http.FORM_DATA)) {
                        return response.formData();
                    }
                    return response;
                });
        }
    }

    const isContentType = (contentTypeA, contentTypeB) => {
        return Util.notEmpty(contentTypeA) && contentTypeA.search(contentTypeB) > -1;
    }

    return new Fetch();

})();

export default Fetch;