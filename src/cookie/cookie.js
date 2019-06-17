import Util from '../util';

let Cookie = (function() {
    /**
     * Cookie interface offers an easy way to get, set or remove cookies in application logic.
     * The Cookie interface handles Cookie objects under the hood. The cookie object may hold following values:
     * 
     * {
     *    name: "name",
     *    value: "value",
     *    expiresDate: "expiresDate e.g. Date.toUTCString()",
     *    cookiePath: "cookiePath absolute dir",
     *    cookieDomain: "cookieDomain e.g example.com",
     *    setSecureBoolean: true|false
     * }
     * 
     * The cookie object also has methods toString() and setExpired(). Notice that setExpired() method wont delete the cookie but merely 
     * sets it expired. To remove a cookie you should invoke remove(name) method of the Cookie interface.
     */
    class Cookie {
        /**
         * Get a cookie by name. If the cookie is found a cookie object is returned otherwise null.
         * 
         * @param {String} name 
         * @returns cookie object
         */
        static get(name) {
            if(navigator.cookieEnabled) {
                var retCookie = null;
                var cookies = document.cookie.split(";");
                var i = 0;
                while(i < cookies.length) {
                    var cookie = cookies[i];
                    var eq = cookie.search("=");
                    var cn = cookie.substr(0, eq).trim();
                    var cv = cookie.substr(eq + 1, cookie.length).trim();
                    if(cn === name) {
                        retCookie = new CookieInstance(cn, cv);
                        break;
                    }
                    i++;
                }
                return retCookie;
            }
        }
        /**
         * Set a cookie. Name and value parameters are essential on saving the cookie and other parameters are optional.
         * 
         * @param {string} name
         * @param {string} value
         * @param {string} expiresDate
         * @param {string} cookiePath
         * @param {string} cookieDomain
         * @param {boolean} setSecureBoolean
         */
        static set(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
            if(navigator.cookieEnabled) {
                document.cookie = CookieInstance.create(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean).toString();
            }
        }
        /**
         * Remove a cookie by name. Method will set the cookie expired and then remove it.
         * @param {string} name
         */
        static remove(name) {
            var co = Cookie.get(name);
            if(!Util.isEmpty(co)) {
                co.setExpired();
                document.cookie = co.toString();
            }
        }
    }

    /**
     * Cookie object may hold following values:
     *
     * {
     *    name: "name",
     *    value: "value",
     *    expiresDate: "expiresDate e.g. Date.toUTCString()",
     *    cookiePath: "cookiePath absolute dir",
     *    cookieDomain: "cookieDomain e.g example.com",
     *    setSecureBoolean: true|false
     * }
     * 
     * The cookie object also has methods toString() and setExpired(). Notice that setExpired() method wont delete the cookie but merely 
     * sets it expired. To remove a cookie you should invoke remove(name) method of the Cookie interface.
     */
    class CookieInstance {
        constructor(name, value, expiresDate, cookiePath, cookieDomain, setSecureBoolean) {
            this.cookieName = !Util.isEmpty(name) && Util.isString(name) ? name.trim() : "";
            this.cookieValue = !Util.isEmpty(value) && Util.isString(value) ? value.trim() : "";
            this.cookieExpires = !Util.isEmpty(expiresDate) && Util.isString(expiresDate) ? expiresDate.trim() : "";
            this.cookiePath = !Util.isEmpty(cookiePath) && Util.isString(cookiePath) ? cookiePath.trim() : "";
            this.cookieDomain = !Util.isEmpty(cookieDomain) && Util.isString(cookieDomain) ? cookieDomain.trim() : "";
            this.cookieSecurity = !Util.isEmpty(setSecureBoolean) && Util.isBoolean(setSecureBoolean) ? "secure=secure" : "";
        }

        setExpired() {
            this.cookieExpires = new Date(1970,0,1).toString();
        }

        toString() {
            return this.cookieName+"="+this.cookieValue+"; expires="+this.cookieExpires+"; path="+this.cookiePath+"; domain="+this.cookieDomain+"; "+this.cookieSecurity;
        }
        static create(name, value, expires, cpath, cdomain, setSecure) {
                return new CookieInstance(name, value, expires, cpath, cdomain, setSecure);
        }
    }

    return Cookie;
}());

export default Cookie;