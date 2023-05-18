import Messages from './messages';
import Util from '../util'

const useMessages = (function() {

    return (locale, loader) => {
        if (Util.isFunction(loader)) {
            Messages.load((locale, setMessages) => setMessages(loader(locale)));
        }
        if (Util.isString(locale) || locale instanceof Event) {
            Messages.lang(locale);
        }
        return Messages; // return Messages.locale() when the class is not needed
    }
}());

export { useMessages }
