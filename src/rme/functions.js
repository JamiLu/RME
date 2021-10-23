import Util from '../util';
import Template from '../template';
import Tree from '../tree';

/**
 * The configure function will configure given Components. Advantage of this function is that the Compoments can be given in 
 * any order and they will be recognized automatically.
 * 
 * Example use case would be to invoke configure(App.get(), Router, Messages);
 * 
 * This function can be conbined with a createApp('#app', AppComponent) function as follows:
 * configure(createApp('#app', AppComponent), Router, Messages); This is probably the shortest way to 
 * create the RME application.
 * @param {*} params comma separated list of components
 */
const configure = (function() {

    return (...params) => {
        let config = {};
        params.forEach(param => {
            if (param.routes) {
                config = {
                    ...config,
                    router: param
                }
            } else if (param.load) {
                config = {
                    ...config,
                    messages: param
                }
            } else if (param.name) {
                config = {
                    ...config,
                    app: param
                }
            } 
        });

        if (Util.notEmpty(config.router))
            config.router.setApp(config.app);

        if (Util.notEmpty(config.messages))
            config.messages.setApp(config.app);

        if (Util.notEmpty(config.app))
            config.app.setRouter(config.router);
    }

})();


/**
 * Adds a script file on runtime into the head of the current html document where the method is called on.
 * Source is required options can be omitted.
 * @param {String} source URL or file name. *Requied
 * @param {object} options Optional settings object.
 * 
 * Option settings:
 * -------
 *  @param {String} id 
 *  @param {String} type 
 *  @param {String} text Content of the script element if any.
 *  @param {boolean} defer If true script is executed when page has finished parsing.
 *  @param {*} crossOrigin 
 *  @param {String} charset 
 *  @param {boolean} async If true script is executed asynchronously when available.
 */
const script = (function() {

    const addScript = (elem) => {
        const scripts = Tree.getHead().getByTag('script');
        if (scripts.length > 0) {
            const lastScript = scripts[scripts.length -1];
            lastScript.after(elem);
        } else {
            Tree.getHead().append(elem);
        }
    }

    return (source, options) => {
        if (Util.notEmpty(source)) {
            addScript(Template.resolve({
                script: {
                    src: source,
                    ...options
                }
            }));
        }
    }
})();


/**
 * The function adds a callback function into the callback queue. The queue is invoked in the
 * function definition order. The queue will be run when the DOM tree is ready and
 * then the it is cleared.
 */
const ready = (function() {

    const callbacks = [];

    document.addEventListener("readystatechange", () => {
        if(document.readyState === "complete") {
            callbacks.forEach(callback => callback());
            callbacks.length = 0;
        }
    });

    return (callback) => {
        callbacks.push(callback);
    }

})();

export default configure;

export { script, ready }