import RME from './rme';

/**
 * The configure function will configure given Components. This is a shortcut function of the
 * RME.use(config) function. Advantage of this function is that the Compoments can be given in 
 * any order and they will be recognized automatically.
 * 
 * Example use case would be to invoke configure(App.get(), Router, Messages); which would equal to
 * RME.use({
 *  messages: Messages,
 *  router: Router,
 *  app: App.get()
 * });
 * 
 * This function can be conbined with a createApp('#app', AppComponent) function as follows:
 * configure(createApp('#app', AppComponent), Router, Messages); This is probably the shortest way to 
 * create an RME application.
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
        RME.use(config);
    }

})();

export default configure;