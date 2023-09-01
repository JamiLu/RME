import Elem from '../elem';
import Util from '../util';

class RMEElemRenderer {
    constructor(root) {
        this.root = root;
        this.mergedStage;
        this.tobeRemoved = [];
    }

    /**
     * Function merges a newStage to a oldStage. Merge rules are following.
     * New stage has what old stage doesn't > add it.
     * New stage has what old stage has > has it changed ? yes > change|update it : no > do nothing.
     * New stage doesn't have what old stage has > remove it.
     * @param {object} oldStage
     * @param {object} newStage
     * @returns The merged stage.
     */
    merge(newStage) {
        this.updateEventListeners(this.root, newStage);

        // const [ oldChildren, newChildren ] = this.getChildren(this.root, newStage);
        const oldChildren = this.root.getChildren();
        const newChildren = newStage.getChildren();

        if (Util.isEmpty(this.root.getChildren())) {
            this.root.render(newChildren);
        } else {
            let i = 0;
            while (i < newChildren.length || i < oldChildren.length) {
                this.render(this.root, newStage, oldChildren[i], newChildren[i], i);
                i++;
            }
            
            this.removeToBeRemoved();
        }

        return this.root;
    }

    /**
     * Get children of the oldNode and the newNode. Returns an array that contains two arrays where one is old children and another is new children
     * @param {Elem} oldNode
     * @param {Elem} newNode 
     * @returns Array that contains two arrays
     */
    getChildren(oldNode, newNode) {
        return [
            Array.of(oldNode.getChildren()).flat(),
            Array.of(newNode.getChildren()).flat()
        ]
    }

    /**
     * Function is called recusively and goes through a oldStage and a newStage simultaneosly in recursion and comparing them and updating changed content.
     * @param {object} parent 
     * @param {object} oldNode 
     * @param {object} newNode 
     * @param {number} index 
     */
    render(parent, newParent, oldNode, newNode, index) {
        console.log('OL', oldNode, 'NE', newNode);
        if (!oldNode && newNode) {
            // console.log('append', oldNode, newNode);
            parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
            this.tobeRemoved.push({parent: parent, child: this.wrap(parent.dom().children[index])});
        } else if (this.hasNodeChanged(oldNode, newNode)) {
            console.log('o', oldNode, 'n', newNode);
            if (oldNode.getTagName() !== newNode.getTagName() || (oldNode.dom().children.length > 0 || newNode.dom().children.length > 0)) {
                console.log('replace', oldNode, newNode);
                this.wrap(parent.rawChildren[index]).replace(newNode.duplicate());
            } else {
                oldNode.setProps({
                    ...this.getBrowserSetStyle(parent, index), 
                    ...newNode.getProps()
                });
            }
        } else {
            if (parent.dom().children.length > newParent.dom().children.length) {
                let i = 0;
                // const [ oldChildren, newChildren ] = this.getChildren(parent, newParent);
                const oldChildren = parent.getChildren();
                const newChildren = newParent.getChildren();
                while (i < newChildren.length) {
                    this.updateEventListeners(oldChildren[i], newChildren[i]);
                    i++;
                }
            }
            
            let i = 0;
            let oldLength = oldNode ? oldNode.dom().children.length : 0;
            let newLength = newNode ? newNode.dom().children.length : 0;
            
            while (i < newLength || i < oldLength) {
                this.render(
                    this.wrap(parent.rawChildren[index]), // this.wrap(parent.dom().children[index]),
                    this.wrap(newParent.rawChildren[index]), // this.wrap(newParent.dom().children[index]),
                    oldNode ? oldNode.children[i] : null, // oldNode ? this.wrap(oldNode.dom().children[i]) : null,
                    newNode ? newNode.getChildren()[i] : null, // newNode ? this.wrap(newNode.dom().children[i]) : null,
                    i);
                i++;
            }
        }
    }

    /**
     * Get browser set style of the node if present from the parent in the specific index.
     * @param {object} parent 
     * @param {number} index 
     * @returns Properties object containing the style attribute of the node in the shadow three.
     */
    getBrowserSetStyle(parent, index) {
        const props = this.wrap(parent.dom().children[index]).getProps();
        return props.style ? {style: props.style} : null
    }

    /**
     * Update event listeners of the old node to event listeners of the new node.
     * @param {object} oldNode 
     * @param {object} newNode 
     */
    updateEventListeners(oldNode, newNode) {
        const listeners = newNode.listeners;
        if (listeners.length > 0) {
            oldNode.updateListeners(listeners);
        }
    }

    /**
     * Get event listeners of the node
     * @param {object} node 
     * @returns An object containing defined event listeners
     */
    getEventListeners(node) {
        const props = node.getProps();
        for (let p in props) {
            if (props.hasOwnProperty(p) && p.indexOf('on') !== 0) {
                delete props[p]
            }
        }
        return props;
    }

    /**
     * Function removes all the marked as to be removed elements which did not come in the new stage by starting from the last to the first.
     */
    removeToBeRemoved() {
        if(this.tobeRemoved.length > 0) {
            let lastIdx = this.tobeRemoved.length - 1;
            while (lastIdx >= 0) {
                this.tobeRemoved[lastIdx].parent.remove(this.tobeRemoved[lastIdx].child);
                lastIdx--;
            }
            this.tobeRemoved = [];
        }
    }

    /**
     * Function takes two Elem objects as parameter and compares them if they are equal or have some properties changed.
     * @param {object} oldNode 
     * @param {object} newNode 
     * @returns True if the given Elem objects are the same and nothing is changed otherwise false is returned.
     */
    hasNodeChanged(oldNode, newNode) {
        // console.log('changed', oldNode, newNode, oldNode.stringProps !== newNode.stringProps)
        return !!oldNode && !!newNode && !oldNode.equals(newNode);
        // return !!oldNode && !!newNode && oldNode.getProps(true) !== newNode.getProps(true);
    }

    /**
     * Function takes DOM node as a parameter and wraps it to Elem object.
     * @param {object} node 
     * @returns the Wrapped Elem object.
     */
    wrap(node) {
        if (node) return Elem.wrap(node);
    }

}

export default RMEElemRenderer;
