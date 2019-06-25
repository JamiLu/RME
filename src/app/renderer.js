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
    merge(oldStage, newStage) {
        if (Util.isEmpty(this.root.getChildren())) {
            this.root.append(newStage);
            this.mergedStage = newStage;
        } else {
            this.render(this.root, oldStage, newStage, 0);
            this.mergedStage = oldStage;
            this.removeToBeRemoved();
        }
        return this.mergedStage;
    }

    /**
     * Function is called recusively and goes through a oldStage and a newStage simultaneosly in recursion and comparing them and updating changed content.
     * @param {object} parent 
     * @param {object} oldNode 
     * @param {object} newNode 
     * @param {number} index 
     */
    render(parent, oldNode, newNode, index) {
        if (!oldNode && newNode) {
            parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
            this.tobeRemoved.push({parent: parent, child: this.wrap(parent.dom().children[index])});
        } else if (this.hasNodeChanged(oldNode, newNode)) {
            let duplicated = newNode.duplicate();
            let willFocus = oldNode.dom() === document.activeElement;
            if (this.isInputableNode(newNode)) {
                this.wrap(parent.dom().children[index]).replace(duplicated);
                duplicated.dom().selectionStart = duplicated.getValue().length;
                duplicated.dom().selectionEnd = duplicated.getValue().length;
            } else {
                this.wrap(parent.dom().children[index]).replace(duplicated);
            }
            if (willFocus) 
                duplicated.focus();
        } else {
            let i = 0;
            let oldLength = oldNode ? oldNode.dom().children.length : 0;
            let newLength = newNode ? newNode.dom().children.length : 0;
            
            while(i < newLength || i < oldLength) {
                this.render(
                    this.wrap(parent.dom().children[index]),
                    oldNode ? this.wrap(oldNode.dom().children[i]) : null,
                    newNode ? this.wrap(newNode.dom().children[i]) : null,
                    i);
                i++;
            }
        }
    }

    /**
     * Fuction tests if a given node is inputable. The node is inputable in following cases:
     *  - The node is a textarea
     *  - The node is type of text, password, search, tel, url
     *  - The node has an attribute contentEditable === true
     * @param {*} node 
     * @returns True if the node is inputable otherwise false.
     */
    isInputableNode(node) {
        let tag = node.getTagName().toLowerCase();
        return (tag === 'textarea')
            || (tag === 'input' && ['text', 'password', 'search', 'tel', 'url'].indexOf(node.dom().type) > -1)
            || (Util.isBoolean(node.dom().contentEditable) && node.dom().contentEditable === true)
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
        return !Util.isEmpty(oldNode) && !Util.isEmpty(newNode) && (oldNode.getTagName() !== newNode.getTagName() || oldNode.getProps(true) !== newNode.getProps(true));
    }

    /**
     * Function takes DOM node as a parameter and wraps it to Elem object.
     * @param {object} node 
     * @returns the Wrapped Elem object.
     */
    wrap(node) {
        if (!Util.isEmpty(node))
            return Elem.wrap(node);
    }

}

export default RMEElemRenderer;