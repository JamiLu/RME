import Elem from '../elem';
import Util from '../util';

let Messages = (function() {
    /**
     * Messages class handles internationalization. The class offers public methods that enable easy 
     * using of translated content.
     */
    class Messages {
        constructor() {
            this.instance = this;
            this.messages = [];
            this.locale = "";
            this.translated = [];
            this.load = function() {};
            this.messagesType;
            this.app;
            this.ready = false;
            this.registerMessages();
        }

        /**
         * Initializes the Messages
         */
        registerMessages() {
            document.addEventListener("readystatechange", () => {
                if(document.readyState === "complete") {
                    this.ready = true;
                    this.runTranslated.call(this);
                }
            });
        }

        setLoad(loader) {
            this.load = loader;
        }

        setAppInstance(appInstance) {
            this.app = appInstance;
        }

        setLocale(locale) {
            this.locale = locale;
            return this;
        }

        setMessages(messages) {
            if(Util.isArray(messages))
                this.messagesType = "array";
            else if(Util.isObject(messages))
                this.messagesType = "map";
            else
                throw "messages must be type array or object";
            this.messages = messages;
            this.runTranslated.call(this);
        }

        getMessage(text, ...params) {
            if(Util.isEmpty(params[0][0])) {
                return this.resolveMessage(text);
            } else {
                this.getTranslatedElemIfExist(text, params[0][0]);
                let msg = this.resolveMessage(text);
                return this.resolveParams(msg, params[0][0]);
            }
        }

        /**
         * Resolves translated message key and returns a resolved message if exist
         * otherwise returns the given key.
         * @param {string} text 
         * @returns A resolved message if exist otherwise the given key.
         */
        resolveMessage(text) {
            if(this.messagesType === "array") {
                return this.resolveMessagesArray(text);
            } else if(this.messagesType === "map") {
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
            for(let i in this.messages) {
                if(i === text) {
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
            while(i < this.messages.length) {
                if(!Util.isEmpty(this.messages[i][text])) {
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
            if(!Util.isEmpty(msg)) {
                let i = 0;
                while(i < params.length) {
                    msg = msg.replace("{"+i+"}", params[i]);
                    i++;
                }
                return msg;
            }
        }

        /**
         * Function gets a Elem object and inserts it into a translated object array if it exists.
         * @param {string} key 
         * @param {*} params 
         */
        getTranslatedElemIfExist(key, params) {
            let last = params[params.length - 1];
            if (Util.isObject(last) && last instanceof Elem) {
                last = params.pop()
                if (Util.isEmpty(this.app)) {
                    this.translated.push({key: key, params: params, obj: last});
                }
            }
        }

        /**
         * Function goes through the translated objects array and sets a translated message to the translated elements.
         */
        runTranslated() {
            if(Util.isEmpty(this.app) && this.ready) {
                Util.setTimeout(() => {
                    let i = 0;
                    while(i < this.translated.length) {
                        this.translated[i].obj.setText.call(this.translated[i].obj, Messages.message(this.translated[i].key, this.translated[i].params));
                        i++;
                    }
                });
            } else if(this.ready) {
                this.app.refresh();
            }
        }

        /**
         * Function returns current locale of the Messages
         * @returns Current locale
         */
        static locale() {
            return Messages.getInstance().locale;
        }

        /**
         * Lang function is used to change or set the current locale to be the given locale. After calling this method
         * the Messages.load function will be automatically invoked.
         * @param {string} locale String
         * @param {object} locale Event
         */
        static lang(locale) {
            let loc;
            if(Util.isObject(locale) && locale instanceof Event) {
                locale.preventDefault();
                let el = Elem.wrap(locale.target);
                loc = el.getHref();
                if(Util.isEmpty(loc))
                    loc = el.getValue();
                if(Util.isEmpty(loc))
                    loc = el.getText();
            } else if(Util.isString(locale))
                loc = locale;
            else
                throw "Given parameter must be type string or instance of Event, given value: " + locale;
            if(!Util.isEmpty(loc))
                Messages.getInstance().setLocale(loc).load.call(null, 
                    Messages.getInstance().locale, Messages.getInstance().setMessages.bind(Messages.getInstance()));
        }

        /**
         * Message function is used to retrieve translated messages. The function also supports message parameters
         * that can be given as a comma separeted list. 
         * @param {string} text 
         * @param {*} params 
         * @returns A resolved message or the given key if the message is not found.
         */
        static message(text, ...params) {
            return Messages.getInstance().getMessage(text, params);
        }

        /**
         * Load function is used to load new messages or change already loaded messages.
         * Implementation of the function receives two parameters. The one of the parameters is the changed locale and 
         * the other is setMessages(messagesArrayOrObject) function that is used to change the translated messages.
         * This function is called automatically when language is changed by calling the Messages.lang() function.
         * @param {function} loader 
         */
        static load(loader) {
            if(!Util.isFunction(loader))
                throw "loader must be type function " + Util.getType(loader);
            Messages.getInstance().setLoad(loader);
        }

        /**
         * Set the app instance to be invoked on the Messages update.
         * @param {object} appInstance 
         */
        static setApp(appInstance) {
            Messages.getInstance().setAppInstance(appInstance);
            return Messages;
        }

        static getInstance() {
            if(!this.instance)
                this.instance = new Messages();
            return this.instance;
        }
    }

    return {
        lang: Messages.lang,
        message: Messages.message,
        load: Messages.load,
        locale: Messages.locale,
        setApp: Messages.setApp
    };
}());

export default Messages;