import Messages from './messages';
import Util from '../util';

const useMessages = (function() {

    /**
     * UseMessages function has three functionalities. 1. Set a message loader function. 2. Change locale. 3. Return currenly used locale string.
     * If the locale parameter is set then the locale is changed to the given locale. The locale parameter can be either a string or an Event.
     * If the locale is an Event then the locale string is attempted to be parsed from the href, the value or the text of the Event.target.
     * If the loader parameter is set then the existing message loader function will be replaced with the currently given.
     * The useMessage function will return the currently used locale string as a return value.
     * @param {string|Event} locale
     * @param {Function} loader
     * @returns Locale string
     */
    return (locale, loader) => {
        if (Util.isFunction(loader)) {
            Messages.load((locale, setMessages) => setMessages(loader(locale)));
        }
        if (Util.isString(locale) || locale instanceof Event) {
            Messages.lang(locale);
        }
        return Messages.locale();
    }
}());

const useMessage = (function (){

    /**
     * UseMessage function takes a message key and possible message parameters and attempts to resolve them to a
     * translated message. If the given key could not be resolved then it will be returned.
     * @param {string} key message key
     * @param {array} params message params
     * @returns Resolved message
     */
    return (key, ...params) => {
        return Messages.message(key, ...params);
    }
}());

export { useMessages, useMessage }
