import { tryParseJSON, isContentTypeJson, setXhrHeaders, isResponseOK, resolveResponse } from './httpUtil';

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

export default HttpPromiseAjax;