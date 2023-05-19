import RMEAppManager from '../app/manager';
import Elem from '../elem';
import Util from '../util';
import { ready } from '../rme';

let Messages = (function() {
    /**
     * Messages class handles internationalization. The class offers public methods that enable easy 
     * using of translated content.
     */
    class Messages {
        static ins;
        constructor() {
            this.ins = this;
            this.messages = [];
            this.locale = '';
            this.translated = [];
            this.load = function() {};
            this.messagesType;
            this.ready = false;
            ready(() => {
                this.ready = true;
                this.runTranslated();
            });
        }

        /**
         * Loader function is used to load new messages.
         * The loader function is called automatically when the locale used in the Messages changes.
         * @param {function} loader
         */
        setLoad(loader) {
            if (!Util.isFunction(loader)) {
                throw new Error('Message loader must be a function');
            }
            this.load = loader;
        }

        setLocale(locale) {
            this.locale = locale;
            return this;
        }

        setMessages(messages) {
            if (Util.isArray(messages)) {
                this.messagesType = 'array';
            } else if (Util.isObject(messages)) {
                this.messagesType = 'map';
            } else {
                throw new Error('Given messages must be an array or an object');
            }
            this.messages = messages;
            this.runTranslated();
        }

        /**
         * GetMessage function is used to retrieve translated messages. The function also supports message parameters
         * that can be given as a comma separeted list.
         * @param {string} text
         * @param {*} params
         * @returns A resolved message or the given key if the message is not found.
         */
        getMessage(text, ...params) {
            if (Util.isEmpty(params.flat(2))) {
                return this.resolveMessage(text);
            } else {
                let msg = this.resolveMessage(text);
                return this.resolveParams(msg, params.flat(2));
            }
        }

        /**
         * Resolves translated message key and returns a resolved message if exist
         * otherwise returns the given key.
         * @param {string} text 
         * @returns A resolved message if exist otherwise the given key.
         */
        resolveMessage(text) {
            if (this.messagesType === 'array') {
                return this.resolveMessagesArray(text);
            } else if (this.messagesType === 'map') {
                return this.resolveMessagesMap(text);
            }
        }

        /**
         * Resolves a translated message key from the map. Returns a resolved message 
         * if found otherwise returns the key.
         * @param {string} text 
         * @returns A resolved message
         */
        resolveMessagesMap(text) {
            let msg = text;
            for (let i in this.messages) {
                if (i === text) {
                    msg = this.messages[i];
                    break;
                }
            }
            return msg;
        }

        /**
         * Resolves a translated message key from the array. Returns a resolved message
         * if found otherwise returns the key.
         * @param {string} text 
         * @returns A resolved message
         */
        resolveMessagesArray(text) {
            let i = 0;
            let msg = text;
            while (i < this.messages.length) {
                if (Util.notEmpty(this.messages[i][text])) {
                    msg = this.messages[i][text];
                    break;
                }
                i++;
            }
            return msg;
        }

        /**
         * Resolves the message parameters if exist otherwise does nothing.
         * @param {string} msg 
         * @param {*} params 
         * @returns The message with resolved message parameteres if parameters exist.
         */
        resolveParams(msg, params) {
            if (Util.notEmpty(msg)) {
                let i = 0;
                while (i < params.length) {
                    msg = msg.replace(`{${i}}`, params[i]);
                    i++;
                }
                return msg;
            }
        }

        /**
         * Function goes through the translated objects array and sets a translated message to the translated elements.
         */
        runTranslated() {
            if (this.ready) {
                RMEAppManager.getAll().forEach(app => app.refresh());
            }
        }

        /**
         * Returns currently used locale string used by the Messages.
         * @returns Locale string
         */
        static locale() {
            return Messages.instance.locale;
        }

        /**
         * Lang function is used to change or set the current locale to be the given locale. After calling this method
         * the Messages.load function will be automatically invoked.
         * @param {string} locale String
         * @param {object} locale Event
         */
        static lang(locale) {
            let nextLocale;
            if (locale instanceof Event) {
                locale.preventDefault();
                const el = Elem.wrap(locale.target);
                nextLocale = el.getHref() || el.getValue() || el.getText();
            } else if (Util.isString(locale)) {
                nextLocale = locale;
            } else {
                throw new Error('The parameter locale must be an instance of the Event or a string');
            }
            if (Util.notEmpty(nextLocale)) {
                Messages.instance.setLocale(nextLocale).load.call(Messages.instance, Messages.locale(),
                    Messages.instance.setMessages.bind(Messages.instance));
            }
        }

        /**
         * Message function returns a message from the message bundle or a message key if the message was not found.
         * The function also supports message parameters that can be given as a comma separeted list.
         * @param {string} text 
         * @param {*} params 
         * @returns A resolved message or the given key if the message is not found.
         */
        static message(text, ...params) {
            return Messages.instance.getMessage(text, params);
        }

        /**
         * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
         * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
         * Set a message loader function.
         * The function receives two parameters a locale and a setMessages function. The locale is currently used locale
         * and the setMessages function applies the given messages.
         */
        static load(loader) {
            Messages.instance.setLoad(loader);
        }

        static get instance() {
            if(!this.ins)
                this.ins = new Messages();
            return this.ins;
        }
    }

    return {
        lang: Messages.lang,
        message: Messages.message,
        load: Messages.load,
        locale: Messages.locale
    };
}());

export default Messages;