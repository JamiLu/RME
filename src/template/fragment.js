import Util from "../util";

const RMETemplateFragmentHelper = (function() {

    // Fragment key can be any number of underscores (_).
    const FRAGMENT_REGEXP = /^_+$/g;

    class RMETemplateFragmentHelper {

        /**
         * Function takes the RME template as a parameter and tries to resolve a
         * fragment key from the given template.
         * @param {*} template 
         * @returns The fragment key if found otherwise undefined is returned.
         */
        getFragmentKey(template) {
            return Object.keys(template).find(this.isFragmentKey);
        }

        /**
         * Function takes the RME template as a parameter and tries to resolve the 
         * fragment value from the given template.
         * @param {*} template 
         * @param {*} templateValue 
         * @returns The fragment template value if found otherwise undefined is returned.
         */
        resolveFragmentValue(template, templateValue) {
            const fragmentKey = this.getFragmentKey(template);
            return template[fragmentKey] || template.fragment || templateValue;
        }

        /**
         * Function takes the RME template as a parameter and checks if the parameter is type fragment. 
         * If the parameter is a fragment type the function will return true
         * otherwise false is returned.
         * @param {*} template 
         * @returns True if the parameter is type fragment otherwise false is returned.
         */
        isFragment(template) {
            return Util.notEmpty(template) && (template === 'fragment' || Boolean(this.getFragmentKey(template)));
        }

        /**
         * Function will check if the given key is a fragment key. The function will
         * return true if the key is a fragment key otherwise false is returned.
         * @param {string} key 
         * @returns True if the key is a fragment key otherwise false is returned.
         */
        isFragmentKey(key) {
            return key.match(FRAGMENT_REGEXP) || key.indexOf('fragment') === 0;
        }

    }

    return new RMETemplateFragmentHelper();

}());

export default RMETemplateFragmentHelper;