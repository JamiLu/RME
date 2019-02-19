/**
 * Browser class contains all the rest utility functions which JavaScript has to offer from Window, Navigator, Screen, History, Location objects.
 */
class Browser {
    /**
     * Scroll once to a given location (xPos, yPos)
     * @param {number} xPos
     * @param {number} yPos
     */
    static scrollTo(xPos, yPos) {
        window.scrollTo(xPos, yPos);
    }

    /**
     * Scroll multiple times by given pixel amount (xPx, yPx)
     * @param {number} xPx
     * @param {number} yPx
     */
    static scrollBy(xPx, yPx) {
        window.scrollBy(xPx, yPx);
    }

    /**
     * Opens a new browser window.
     * 
     * Name pamareter can have following values: name or target value (name|_blank|_parent|_self|_top)
     * 
     * Specs parameter is defined as comma,separated,list,without,whitespace and it can have following values:
     * channelmode=yes|no|1|0,
     * direcotries=yes|no|1|0,
     * fullscreen=yes|no|1|0,
     * height=pixels,
     * left=pixels,
     * location=yes|no|1|0,
     * menubar=yes|no|1|0,
     * resizable=yes|no|1|0,
     * scrollbars=yes|no|1|0,
     * status=yes|no|1|0,
     * titlebar=yes|no|1|0,
     * toolbar|yes|no|1|0,
     * top=pixels,
     * width=pixels min 100
     * 
     * Replace parameter defines is a new history entry created or is current replaced with the new one.
     * If true the current entry is replaced with the new one. If false a new history entry is created.
     * @param {string} url 
     * @param {string} name 
     * @param {string} specs 
     * @param {boolean} replace 
     * @returns Reference to the opened window or null if opening the window failes.
     */
    static open(url, name, specs, replace) {
        return window.open(url, name, specs, replace);
    }

    /**
     * Closes a given opened window. Same as calling openedWindow.close();
     * @param {*} openedWindow 
     */
    static close(openedWindow) {
        openedWindow.close();
    }

    /**
     * Opens a print webpage dialog.
     */
    static print() {
        window.print();
    }

    /**
     * Displays an alert dialog with a given message and an OK button.
     * @param {string} message
     */
    static alert(message) {
        window.alert(message);
    }

    /**
     * Displays a confirm dialog with a given message, OK and Cancel button.
     * @param {string} message
     * @returns True if OK was pressed otherwise false.
     */
    static confirm(message) {
        return window.confirm(message);
    }

    /**
     * Displays a prompt dialog with a given message, a prefilled default text, OK and Cancel button.
     * @param {string} message
     * @param {string} defaultText
     * @returns If OK was pressed and an input field has text then the text is returned. 
     * If the input does not have text and OK was pressed then empty string is returned.
     * If Cancel was pressed then null is returned.
     */
    static prompt(message, defaultText) {
        return window.prompt(message, defaultText);
    }

    /**
     * Method is used to make a media query to the viewport/screen object. The media query is done according to a given mediaString.
     * Syntax of the media string would be (min-width: 300px) but using this method enables user to omit parentheses(). 
     * Which then leads to syntax min-width: 300px.
     * 
     * Method returns a MediaQueryList object which has few neat properties. Matches and media in addition it has 
     * two functions addListener and removeListener which can be used to query media in realtime. Usage could be something following:
     * 
     * var matcher = Browser.mediaMatcher("max-height: 300px");
     * 
     * matcher.addlistener(function(matcher) {
     *  if(matcher.matches)
     *      Tree.getBody().setStyles({backgroundColor: "red"});
     *  else
     *      Tree.getBody().setStyles({backgroundColor: "green"});
     * });
     * 
     * matcher.media returns the media query string.
     * 
     * matcher.matches returns the boolean indicating does it does the query string match or not. True if it matches, otherwise false.
     * 
     * mathcer.addListener(function(matcher)) is used to track changes on the viewport/screen.
     * 
     * matcher.removeListener(listenerFunction) is used to remove a created listener.
     * @param {string} mediaString 
     * @returns MediaQueryList object.
     */
    static mediaMatcher(mediaString) {
        if(mediaString.indexOf("(") !== 0)
            mediaString = "("+mediaString;
        if(mediaString.indexOf(")") !== mediaString.length -1)
            mediaString = mediaString+")";
        return window.matchMedia(mediaString);
    }

    /**
     * Loads one page back in the browsers history list.
     */
    static pageBack() {
        history.back();
    }

    /**
     * Loads one page forward in the browsers history list.
     */
    static pageForward() {
        history.forward();
    }

    /**
     * Loads to specified page in the browsers history list. A parameter can either be a number or string.
     * If the parameter is number then positive and negative values are allowed as positive values will go forward
     * and negative values will go backward. 
     * If the parameter is string then it must be partial or full url of the page in the history list.
     * @param {string|number} numberOfPagesOrUrl
     */
    static pageGo(numberOfPagesOrUrl) {
        history.go(numberOfPagesOrUrl)
    }

    /**
     * Create a new history entry with given parameters without reloading the page. State object will be the state
     * next history entry will be using. Title is ignored value by the history object at the time but it could be 
     * the same title what the HTML Document page has at the moment of create the new history entry. New url must 
     * be of the same origin (e.g. www.example.com) but the rest of url could be anything.
     * @param {object} stateObject 
     * @param {string} title 
     * @param {string} newURL 
     */
    static pushState(stateObject, title, newURL) {
        history.pushState(stateObject, title, newURL);
    }

    /**
     * Replace a history entry with given parameters without reloading the page. State object will be the state
     * next history entry will be using. Title is ignored value by the history object at the time but it could be 
     * the same title what the HTML Document page has at the moment of create the new history entry. New url must 
     * be of the same origin (e.g. www.example.com) but the rest of url could be anything.
     * @param {object} stateObject 
     * @param {string} title 
     * @param {string} newURL 
     */
    static replaceState(stateObject, title, newURL) {
        history.replaceState(stateObject, title, newURL);
    }

    /**
     * Loads a new page.
     * @param {string} newURL
     */
    static newPage(newURL) {
        location.assign(newURL);
    }

    /**
     * Reloads a current page. If a parameter force is true then the page will be loaded from the server 
     * otherwise from the browsers cache.
     * @param {boolean} force
     */
    static reloadPage(force) {
        location.reload(force);
    }

    /**
     * Replaces a current page with a new one. If the page is replaced then it wont be possible to go back
     * to the previous page from the history list.
     * @param {string} newURL
     */
    static replacePage(newURL) {
        location.replace(newURL);
    }

    /**
     * @returns Anchor part of the url e.g. #heading2.
     */
    static getAnchorHash() {
        return location.hash;
    }

    /**
     * Sets a new anhorpart of the url e.g. #heading3.
     * @param {string} hash
     */
    static setAnchorHash(hash) {
        location.hash = hash;
    }

    /**
     * @returns Hostname and port in host:port format.
     */
    static getHostnamePort() {
        return location.host;
    }

    /**
     * Set a hostname and port in format host:port.
     * @param {string} hostPort
     */
    static setHostnamePort(hostPort) {
        location.host = hostPort;
    }

    /**
     * @returns Hostname e.g. www.google.com.
     */
    static getHostname() {
        return location.hostname;
    }

    /**
     * Set a hostname
     * @param {string} hostname
     */
    static setHostname(hostname) {
        location.hostname = hostname;
    }

    /**
     * @returns Entire URL of the webpage.
     */
    static getURL() {
        return location.href;
    }

    /**
     * Set location of a current page to point to a new location e.g. http://some.url.test or #someAcnhor on the page.
     * @param {string} newURL
     */
    static setURL(newURL) {
        location.href = newURL;
    }

    /**
     * @returns protocol, hostname and port e.g. https://www.example.com:443
     */
    static getOrigin() {
        return location.origin;
    }

    /**
     * @returns Part of the URL after the slash(/) e.g. /photos/
     */
    static getPathname() {
        return location.pathname;
    }

    /**
     * Sets a new pathname for this location.
     * @param {string} pathname 
     */
    static setPathname(pathname) {
        location.pathname = pathname;
    }

    /**
     * @returns Port number of the connection between server and client.
     */
    static getPort() {
        return location.port;
    }

    /**
     * Sets a new port number for the connection between server and client.
     * @param {number} portNumber 
     */
    static setPort(portNumber) {
        location.port = portNumber;
    }

    /**
     * @returns Protocol part of the URL e.g. http: or https:.
     */
    static getProtocol() {
        return location.protocol;
    }

    /**
     * Set a new protocol for this location to use.
     * @param {string} protocol 
     */
    static setProtocol(protocol) {
        location.protocol = protocol;
    }

    /**
     * @returns Part of the URL after the question(?) mark. e.g. ?attr=value&abc=efg.
     */
    static getSearchString() {
        return location.search;
    }

    /**
     * Sets a new searchString into the URL
     * @param {string} searchString 
     */
    static setSearchString(searchString) {
        location.search = searchString;
    }

    /**
     * @returns Codename of the browser.
     */
    static getCodename() {
        return navigator.appCodeName;
    }

    /**
     * @returns Name of the browser.
     */
    static getName() {
        return navigator.appName;
    }

    /**
     * @returns Version of the browser.
     */
    static getVersion() {
        return navigator.appVersion;
    }

    /**
     * @returns True if cookies are enabled otherwise false.
     */
    static isCookiesEnabled() {
        return navigator.cookieEnabled;
    }

    /**
     * @returns GeoLocation object.
     */
    static getGeoLocation() {
        return navigator.geolocation;
    }

    /**
     * @returns Language of the browser.
     */
    static getLanguage() {
        return navigator.language;
    }

    /**
     * @returns A platform name of which the browser is compiled on.
     */
    static getPlatform() {
        return navigator.platform;
    }

    /**
     * @returns A name of an engine of the browser.
     */
    static getProduct() {
        return navigator.product;
    }

    /**
     * @returns A header string sent to a server by the browser.
     */
    static getUserAgentHeader() {
        return navigator.userAgent;
    }

    /**
     * @returns Color depth of the current screen.
     */
    static getColorDepth() {
        return screen.colorDepth;
    }

    /**
     * @returns Total height of the current screen.
     */
    static getFullScreenHeight() {
        return screen.height;
    }

    /**
     * @returns Total width of the current screen.
     */
    static getFullScreenWidth() {
        return screen.width;
    }

    /**
     * @returns Height of the current screen excluding OS. taskbar.
     */
    static getAvailableScreenHeight() {
        return screen.availHeight;
    }

    /**
     * @returns Width of the current screen exluding OS. taskbar.
     */
    static getAvailableScreenWidth() {
        return screen.availWidth;
    }
}

export default Browser;