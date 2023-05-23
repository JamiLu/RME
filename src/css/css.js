import Tree from '../tree';
import Template from '../template';
import Util from '../util';


/**
 * A CSS function will either create a new style element containing given css and other parameters 
 * or it will append to a existing style element if the element is found by given parameters.
 * @param {string} css string
 * @param {object} config properties object of the style element
 */
const CSS = (function() {

    const getStyles = config => {
        const styles = Tree.getHead().getByTag('style');
        if (Util.isEmpty(config) && !Util.isArray(styles)) {
            return styles;
        } else if (Util.isArray(styles)) {
            return styles.find(style => arePropertiesSame(style.getProps(), config));
        } else if (!Util.isEmpty(styles) && arePropertiesSame(styles.getProps(), config)) {
            return styles;
        }
    };

    const propsWithoutContent = props => {
        let newProps = {
            ...props
        }
        delete newProps.text;
        return newProps;
    }

    const arePropertiesSame = (oldProps, newProps) => 
        JSON.stringify(propsWithoutContent(oldProps)) === JSON.stringify(newProps || {});

    const hasStyles = config => !Util.isEmpty(getStyles(config));

    const hasContent = (content, config) => {
        const styles = getStyles(config);
        if (!Util.isEmpty(styles)) {
            return styles.getContent().match(content) !== null
        }
    };

    return (content, config) => {
        if (!hasStyles(config)) {
            Tree.getHead().append(Template.resolve({
                style: {
                    content,
                    ...config
                }
            }));
        } else if (!hasContent(content, config)) {
            const style = getStyles(config);
            if (!Util.isEmpty(style)) {
                const prevContent = style.getContent();
                style.setContent(prevContent+content);
            }
        }
    }
})();

export default CSS;