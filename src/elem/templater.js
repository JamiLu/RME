import Util from '../util';

/**
 * RMEElemTemplater class is able to create a Template out of an Elem object.
 */
class RMEElemTemplater {
    constructor() {
        this.instance;
        this.template;
        this.deep = true;
    }

    toTemplate(elem, deep) {
        if (Util.notEmpty(deep))
            this.deep = deep;

        this.resolve(elem, {});
        return this.template;
    }

    /**
     * Function is called recursively and resolves an Elem object and its children in recursion
     * @param {object} elem 
     * @param {object} parent 
     */
    resolve(elem, parent) {
        let resolved = this.resolveElem(elem, this.resolveProps(elem));
        Object.keys(parent).forEach(key => {
            if (Util.isArray(parent[key]._)) {
                parent[key]._.push(resolved);
            } else {
                this.extendMap(parent[key], resolved);
            }
        });

        const children = Array.of(elem.getChildren()).flat();
        if (children.length > 0 && this.deep) {
            children.forEach(child => this.resolve(child, resolved));
        }
        this.template = resolved;
    }

    /**
     * Copies values from the next map into the first map
     * @param {object} map first map
     * @param {object} next next map
     */
    extendMap(map, next) {
        for(let v in next) {
            if(next.hasOwnProperty(v)) {
                map[v] = next[v];
            }
        }
    }

    /**
     * Function will attach given properties into a given Elem and returns the resolved Elem.
     * @param {object} elem 
     * @param {object} props 
     * @returns The resolved elem with attached properties.
     */
    resolveElem(elem, props) {
        const el = {};
        const children = elem.getChildren();
        if (Util.isArray(children) && children.length > 1) {
            let elTag = elem.getTagName().toLowerCase();
            let elName = this.resolveId(elTag, props);
            elName = this.resolveClass(elName, props);
            elName = this.resolveAttrs(elName, props);
            el[elName] = {
                ...props,
                _: [],
            };
        } else {
            el[elem.getTagName().toLowerCase()] = props
        }
        return el;
    }

    /**
     * Function will place an ID attribute into an element tag if the ID attribute is found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with the ID or without.
     */
    resolveId(tag, props) {
        if(props.id)
            return tag+"#"+props.id;
        else
            return tag;
    }

    /**
     * Function will place a class attribute into an element tag if the class attribute is found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with the classes or without.
     */
    resolveClass(tag, props) {
        if(props.class)
            return tag+"."+props.class.replace(/ /g, ".");
        else
            return tag;
    }

    /**
     * Function will resolve all other attributes and place them into an element tag if other attributes are found.
     * @param {string} tag 
     * @param {object} props 
     * @returns The element tag with other attributes or without.
     */
    resolveAttrs(tag, props) {
        let tagName = tag;
        for (let p in props) {
            if (props.hasOwnProperty(p) && p !== 'id' && p !== 'class' && p.indexOf('on') !== 0) {
                tagName += `[${p}=${props[p]}]`
            }
        }
        return tagName;
    }

    /**
     * Resolves a given Elem object and returns its properties in an object.
     * @param {object} elem 
     * @returns The properties object of the given element.
     */
    resolveProps(elem) {
        let props = {};
        let attributes = elem.dom().attributes;
        let a = 0;
        if(attributes) {
            while(a < attributes.length) {
                props[this.resolveAttributeNames(attributes[a].name)] = attributes[a].value;
                a++;
            }
        }

        if(elem.dom().hasChildNodes() && elem.dom().childNodes[0].nodeType === 3) {
            props["text"] = elem.getText();
        }

        for(let p in elem.dom()) {
            if(p.indexOf("on") !== 0 || Util.isEmpty(elem.dom()[p]))
                continue;
            else
                props[this.resolveListeners(p)] = elem.dom()[p];
        }

        return props;
    }

    /**
     * Resolves a html data-* attributes by removing '-' and setting the next character to uppercase. 
     * Resolves an aria* attirubtes by setting the next character to uppercase.
     * If the attribute is not a data-* or an aria attribute then it is directly returned.
     * @param {string} attrName 
     * @returns Resolved attribute name.
     */
    resolveAttributeNames(attrName) {
        if (attrName.indexOf('data') === 0 && attrName.length > 'data'.length) {
            while(attrName.search('-') > -1) {
                attrName = attrName.replace(/-\w/, attrName.charAt(attrName.search('-') + 1).toUpperCase());
            }
            return attrName
        } else if (attrName.indexOf('aria') === 0) {
            return attrName.replace(attrName.charAt('aria'.length), attrName.charAt('aria'.length).toUpperCase());
        } else {
            return attrName;
        }
    }

    resolveListeners(name) {
        switch(name) {
            case "onanimationstart":
                return "onAnimationStart";
            case "onanimationiteration":
                return "onAnimationIteration";
            case "onanimationend":
                return "onAnimationEnd";
            case "ontransitionend":
                return "onTransitionEnd";
            case "ondrag":
                return "onDrag"
            case "ondragend":
                return "onDragEnd";
            case "ondragenter":
                return "onDragEnter";
            case "ondragover":
                return "onDragOver";
            case "ondragstart":
                return "onDragStart";
            case "ondrop":
                return "onDrop"; 
            case "onclick":
                return "onClick";
            case "ondblclick":
                return "onDoubleClick";
            case "oncontextmenu":
                return "onContextMenu";
            case "onmousedown":
                return "onMouseDown";
            case "onmouseenter":
                return "onMouseEnter";
            case "onmouseleave":
                return "onMouseLeave";
            case "onmousemove":
                return "onMouseMove";
            case "onmouseover":
                return "onMouseOver";
            case "onmouseout":
                return "onMouseOut";
            case "onmouseup":
                return "onMouseUp";
            case "onwheel":
                return "onWheel";
            case "onscroll":
                return "onScroll";
            case "onresize":
                return "onResize";
            case "onerror":
                return "onError";
            case "onload":
                return "onLoad";
            case "onunload":
                return "onUnload";
            case "onbeforeunload":
                return "onBeforeUnload";
            case "onkeyup":
                return "onKeyUp";
            case "onkeydown":
                return "onKeyDown";
            case "onkeypress":
                return "onKeyPress";
            case "oninput":
                return "onInput";
            case "onchange":
                return "onChange";
            case "onsubmit":
                return "onSubmit";
            case "onselect":
                return "onSelect";
            case "onreset":
                return "onReset"
            case "onfocus":
                return "onFocus";
            case "onfocusin":
                return "onFocusIn";
            case "onfocusout":
                return "onFocusOut";
            case "onblur":
                return "onBlur";
            case "oncopy":
                return "onCopy";
            case "oncut":
                return "onCut";
            case "onpaste":
                return "onPaste";
            case "onabort":
                return "onAbort";
            case "onwaiting":
                return "onWaiting";
            case "onvolumechange":
                return "onVolumeChange";
            case "ontimeupdate":
                return "onTimeUpdate";
            case "onseeking":
                return "onSeeking";
            case "onseekend":
                return "onSeekEnd";
            case "onratechange":
                return "onRateChange";
            case "onprogress":
                return "onProgress";
            case "onloadmetadata":
                return "onLoadMetadata";
            case "onloadeddata":
                return "onLoadedData";
            case "onloadstart":
                return "onLoadStart";
            case "onplaying":
                return "onPlaying";
            case "onplay":
                return "onPlay";
            case "onpause":
                return "onPause";
            case "onended":
                return "onEnded";
            case "ondurationchange":
                return "onDurationChange";
            case "oncanplay":
                return "onCanPlay";
            case "oncanplaythrough":
                return "onCanPlayThrough";
            case "onstalled":
                return "onStalled";
            case "onsuspend":
                return "onSuspend";
            case "onpopstate":
                return "onPopState";
            case "onstorage":
                return "onStorage";
            case "onhashchange":
                return "onHashChange";
            case "onafterprint":
                return "onAfterPrint";
            case "onbeforeprint":
                return "onBeforePrint";
            case "onpagehide":
                return "onPageHide";
            case "onpageshow":
                return "onPageShow";
        }
    }

    toLiteralString(elem) {
        const props = this.resolveProps(elem);
        let string = this.resolveId(elem.getTagName().toLowerCase(), props);
        string = this.resolveClass(string, props);
        string = this.resolveAttrs(string, props);
        return string;
    }

    /**
     * Function by default resolves a given element and its' children and returns template representation of the element.
     * @param {object} elem 
     * @param {boolean} deep 
     * @returns Template object representation of the Elem
     */
    static toTemplate(elem, deep) {
        return RMEElemTemplater.getInstance().toTemplate(elem, deep);
    }

    /**
     * Function resolves and returns properties of a given Elem object.
     * @param {object} elem 
     * @returns The properties object of the given Elem.
     */
    static getElementProps(elem) {
        return RMEElemTemplater.getInstance().resolveProps(elem);
    }

    static toLiteralString(elem) {
        return RMEElemTemplater.getInstance().toLiteralString(elem);
    }

    static getInstance() {
        if(!this.instance)
            this.instance = new RMEElemTemplater();
        return this.instance;
    }
}

export default RMEElemTemplater;