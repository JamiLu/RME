import Util from '../util';
import HttpFetchRequest from './fetchRequest';

let Http = (function() {
    /**
     * FOR XmlHttpRequest
     * A config object supports following. More features could be added.
     *  {
     *    method: method,
     *    url: url,
     *    data: data,
     *    contentType: contentType,
     *    onProgress: function(event),
     *    onTimeout: function(event),
     *    headers: headersObject{"header": "value"},
     *    useFetch: true|false **determines that is fetch used or not.
     *  }
     * 
     * If contentType is not defined, application/json is used, if set to null, default is used, otherwise used defined is used.
     * If contentType is application/json, data is automatically stringified with JSON.stringify()
     * 
     * Http class automatically tries to parse reuqest.responseText to JSON using JSON.parse().
     * If parsing succeeds, parsed JSON will be set on request.responseJSON attribute.
     */
    class Http {
        constructor(config) {
            config.contentType = config.contentType === undefined ? Http.JSON : config.contentType;
            if(config.useFetch) {
                this.self = new HttpFetchRequest();
            } else if(window.Promise) {
                this.self = new HttpPromiseAjax(config).instance();
            } else {
                this.self = new HttpAjax(config);
            }
        }

        instance() {
            return this.self;
        }

        /**
         * Do GET XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {string} requestContentType 
         */
        static get(url, requestContentType) {
            return new Http({method: "GET", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do POST XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static post(url, data, requestContentType) {
            return new Http({method: "POST", url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do PUT XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static put(url, data, requestContentType) {
            return new Http({method: "PUT", url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do DELETE XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} requestContentType 
         */
        static delete(url, requestContentType) {
            return new Http({method: "DELETE", url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Does any XMLHttpRequest that is defined by a given config object. Promise will be used if available.
         * 
         * Config object can contain parameters:
         * {
         *    method: method,
         *    url: url,
         *    data: data,
         *    contentType: contentType,
         *    onProgress: function(event),
         *    onTimeout: function(event),
         *    headers: headersObject{"header": "value"},
         *    useFetch: true|false **determines that is fetch used or not.
         *  }
         * @param {object} config 
         */
        static do(config) {
            return new Http(config).instance();
        }

        /**
         * Uses Fetch interface to make a request to server.
         * 
         * Before using fetch you should also be familiar on how to use fetch since usage of this function
         * will be quite similar to fetch except predefined candy that is added.
         *
         * The fetch interface adds some predefined candy over the JavaScript Fetch interface.
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
        static fetch() {
            return new Http({useFetch: true}).instance();
        }
    }
    /**
     * Content-Type application/json;charset=UTF-8
     */
    Http.JSON = "application/json;charset=UTF-8";
    /**
     * Content-Type multipart/form-data
     */
    Http.FORM_DATA = "multipart/form-data";
    /**
     * Content-Type text/plain
     */
    Http.TEXT_PLAIN = "text/plain";

    /**
     * Old Fashion XMLHttpRequest made into the Promise pattern.
     */
    class HttpAjax {
        constructor(config) {
            this.progressHandler = config.onProgress ? config.onProgress : function(event) {};
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.xhr = new XMLHttpRequest();
            this.xhr.open(config.method, config.url);
            if(config.contentType)
                this.xhr.setRequestHeader("Content-Type", config.contentType);
            if(config.headers)
                setXhrHeaders(this.xhr, config.headers);
        }
        then(successHandler, errorHandler) {
            this.xhr.onload = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                isResponseOK(this.xhr.status) ? successHandler(resolveResponse(this.xhr.response), this.xhr) : errorHandler(this.xhr)
            };
            this.xhr.onprogress = (event) => {
                if(this.progressHandler)
                    this.progressHandler(event);
            };
            if(this.xhr.ontimeout && config.onTimeout) {
                this.xhr.ontimeout = (event) => {
                    config.onTimeout(event);
                }
            }
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if(errorHandler)
                    errorHandler(this.xhr);
            };
            this.data ? this.xhr.send(this.data) : this.xhr.send();
            return this;
        }
        catch(errorHandler) {
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responrenderseText);
                if(errorHandler)
                    errorHandler(this.xhr);
            }
        }
    }

    /**
     * XMLHttpRequest using the Promise.
     */
    class HttpPromiseAjax {
        constructor(config) {
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.promise = new Promise((resolve, reject) => {
                var request = new XMLHttpRequest();
                request.open(config.method, config.url);
                if(config.contentType)
                    request.setRequestHeader("Content-Type", config.contentType);
                if(config.headers)
                    setXhrHeaders(request, config.headers);
                request.onload = () => {
                    request.responseJSON = tryParseJSON(request.responseText);
                    isResponseOK(request.status) ? resolve(resolveResponse(request.response)) : reject(request);
                };
                if(request.ontimeout && config.onTimeout) {
                    request.ontimeout = (event) => {
                        config.onTimeout(event);
                    }
                }
                request.onprogress = (event) => {
                    if(config.onProgress)
                        config.onProgress(event);
                }
                request.onerror = () => {
                    request.responseJSON = tryParseJSON(request.responseText);
                    reject(request)
                };
                this.data ? request.send(this.data) : request.send();
            });
        }
        instance() {
            return this.promise;
        }
    }

    const resolveResponse = (response) => {
        let resp = tryParseJSON(response);
        if(Util.isEmpty(resp))
            resp = response;
        return resp;
    }
    
    const setXhrHeaders = (xhr, headers) => {
        for(let header in headers) {
            if(headers.hasOwnProperty(header))
                xhr.setRequestHeader(header, headers[header]);
        }
    }
    
    const isResponseOK = (status) => {
        let okResponses = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
        let i = 0;
        while(i < okResponses.length) {
            if(okResponses[i] === status)
                return true;
            i++;
        }
        return false;
    }
    
    const isContentTypeJson = (contentType) => {
        return contentType === Http.JSON;
    }
    
    const tryParseJSON = (text) => {
        try {
            return JSON.parse(text);
        } catch(e) {}
    }

    return Http;
}());

export default Http;