import Util from '../util';

const Http = (function() {
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
            if (window.Promise) {
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
            return new Http({method: 'GET', url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do POST XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static post(url, data, requestContentType) {
            return new Http({method: 'POST', url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do PUT XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data 
         * @param {string} requestContentType 
         */
        static put(url, data, requestContentType) {
            return new Http({method: 'PUT', url: url, data: data, contentType: requestContentType}).instance();
        }

        /**
         * Do DELETE XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} requestContentType 
         */
        static delete(url, requestContentType) {
            return new Http({method: 'DELETE', url: url, data: undefined, contentType: requestContentType}).instance();
        }

        /**
         * Do PATH XMLHttpRequest. If a content type is not specified JSON will be default. Promise will be used if available.
         * @param {string} url *Required
         * @param {*} data
         * @param {*} requestContentType 
         */
        static patch(url, data, requestContentType) {
            return new Http({method: "PATCH", url: url, data: data, contentType: requestContentType}).instance();
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
    }
    /**
     * Content-Type application/json
     */
    Http.JSON = 'application/json';
    /**
     * Content-Type multipart/form-data
     */
    Http.FORM_DATA = 'multipart/form-data';
    /**
     * Content-Type text/plain
     */
    Http.TEXT_PLAIN = 'text/plain';

    /**
     * The XMLHttpRequest made into the Promise pattern.
     */
    class HttpAjax {
        constructor(config) {
            this.config = config;
            this.data = isContentTypeJson(config.contentType) ? JSON.stringify(config.data) : config.data;
            this.xhr = new XMLHttpRequest();
            this.xhr.open(config.method, config.url);

            if (config.contentType)
                this.xhr.setRequestHeader('Content-Type', config.contentType);
            if (config.headers)
                setXhrHeaders(this.xhr, config.headers);
        }
        then(successHandler, errorHandler) {
            this.xhr.onload = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                isResponseOK(this.xhr.status) ? successHandler(resolveResponse(this.xhr.response), this.xhr) : errorHandler(this.xhr)
            };
            if (this.config.onProgress) {
                this.xhr.onprogress = (event) => {
                    this.config.onProgress(event);
                };
            }
            if (this.config.onTimeout) {
                this.xhr.ontimeout = (event) => {
                    this.config.onTimeout(event);
                }
            }
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if (errorHandler)
                    errorHandler(this.xhr);
            };
            this.data ? this.xhr.send(this.data) : this.xhr.send();
            return this;
        }
        catch(errorHandler) {
            this.xhr.onerror = () => {
                this.xhr.responseJSON = tryParseJSON(this.xhr.responseText);
                if (errorHandler)
                    errorHandler(this.xhr);
            }
        }
    }

    /**
     * XMLHttpRequest using the Promise.
     */
    class HttpPromiseAjax {
        constructor(config) {
            this.promise = new Promise((resolve, reject) => {
                new HttpAjax(config).then((response) => resolve(response), (error) => reject(error));
            });
        }
        instance() {
            return this.promise;
        }
    }

    const resolveResponse = (response) => {
        const resp = tryParseJSON(response);
        return Util.notEmpty(resp) ? resp : response;
    }
    
    const setXhrHeaders = (xhr, headers) => {
        Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));
    }
    
    const isResponseOK = (status) => {
        return Boolean([200, 201, 202, 203, 204, 205, 206, 207, 208, 226].find(num => num === status));
    }
    
    const isContentTypeJson = (contentType) => {
        return Http.JSON.search(contentType.toLowerCase()) > -1 || contentType.toLowerCase().search(Http.JSON) > -1;
    }
    
    const tryParseJSON = (text) => {
        try {
            return JSON.parse(text);
        } catch(e) {}
    }

    return Http;
}());

export default Http;