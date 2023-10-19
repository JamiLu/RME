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

        const oldChildren = this.root.children;
        const newChildren = newStage.children;

        let i = 0;
        while (i < newChildren.length || i < oldChildren.length) {
            this.render(this.root, oldChildren[i], newChildren[i], i);
            i++;
        }
        
        this.removeToBeRemoved();

        return this.root;
    }

    /**
     * Function is called recusively and goes through a oldStage and a newStage simultaneosly in recursion and comparing them and updating changed content.
     * @param {object} parent Node
     * @param {object} oldNode Elem
     * @param {object} newNode Elem
     * @param {number} index 
     */
    render(parent, oldNode, newNode, index) {
        if (!oldNode && newNode) {
            parent.append(newNode.duplicate());
        } else if (oldNode && !newNode) {
            this.tobeRemoved.push({ parent, child: oldNode, index });
        } else if (oldNode.getTagName() !== newNode.getTagName() && (oldNode.children.length === 0 || newNode.children.length === 0)) {
            oldNode.setParams(newNode.attributes, newNode.listeners);
            oldNode.replace(index, parent, newNode);
        } else {
            if (!!oldNode && !!newNode && !oldNode.equals(newNode)) {
                oldNode.setProps({
                    ...this.getBrowserSetStyle(oldNode),
                    ...newNode.getPropsObj(),
                });
                this.updateEventListeners(oldNode, newNode);
                oldNode.setParams(newNode.attributes);
            }
            
            let i = 0;
            let oldLength = oldNode ? oldNode.children.length : 0;
            let newLength = newNode ? newNode.children.length : 0;
            
            while (i < newLength || i < oldLength) {
                this.render(
                    parent.children[index],
                    oldNode ? oldNode.children[i] : null,
                    newNode ? newNode.children[i] : null,
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
    getBrowserSetStyle(oldNode) {
        const style = oldNode.getAttribute('style');
        return style ? { style } : null
    }

    /**
     * Update event listeners of the old node to event listeners of the new node.
     * @param {object} oldNode 
     * @param {object} newNode 
     */
    updateEventListeners(oldNode, newNode) {
        if (newNode.hasListeners()) {
            oldNode.updateListeners(newNode.listeners);
        }
    }


    /**
     * Function removes all the marked as to be removed elements which did not come in the new stage by starting from the last to the first.
     */
    removeToBeRemoved() {
        if(this.tobeRemoved.length > 0) {
            let lastIdx = this.tobeRemoved.length - 1;
            while (lastIdx >= 0) {
                this.tobeRemoved[lastIdx].parent.remove(this.tobeRemoved[lastIdx].index, this.tobeRemoved[lastIdx].child);
                lastIdx--;
            }
            this.tobeRemoved = [];
        }
    }

}

export default RMEElemRenderer;
