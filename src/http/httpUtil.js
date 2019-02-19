import Util from '../util';
import Http from './http';

const resolveResponse = (response) => {
    let resp = tryParseJSON(response);
    if(Util.isEmpty(resp))
        resp = response;
    return resp;
}

const setXhrHeaders = (xhr, headers) => {
    for(var header in headers) {
        if(headers.hasOwnProperty(header))
            xhr.setRequestHeader(header, headers[header]);
    }
}

const isResponseOK = (status) => {
    var okResponses = [200, 201, 202, 203, 204, 205, 206, 207, 208, 226];
    var i = 0;
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

export {
    resolveResponse,
    setXhrHeaders,
    isResponseOK,
    isContentTypeJson,
    tryParseJSON
}