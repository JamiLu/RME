import { tryParseJSON, isContentTypeJson, setXhrHeaders, isResponseOK, resolveResponse } from './httpUtil';

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

export default HttpAjax;