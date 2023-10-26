class RMEElemRenderer {
    constructor(root) {
        this.root = root;
        this.mergedStage;
        this.pendingRemove = [];
    }

    /**
     * Function merges a newStage to a oldStage. Merge rules are following.
     * New stage has what old stage doesn't > add it.
     * New stage has what old stage has > has it changed ? yes > change|update it : no > do nothing.
     * New stage doesn't have what old stage has > remove it.
     * @param {object} newStage
     * @returns The merged stage.
     */
    merge(newStage) {
        this.root.updateListeners(newStage);

        const oldChildren = this.root.children;
        const newChildren = newStage.children;

        let i = 0;
        while (i < newChildren.length || i < oldChildren.length) {
            this.render(this.root, oldChildren[i], newChildren[i], i);
            i++;
        }
        
        this.clearPending();

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
            this.pendingRemove.push({ parent, child: oldNode, index });
        } else if (oldNode.getTagName() !== newNode.getTagName()) {
            oldNode.setParams(newNode.attributes, newNode.listeners);
            oldNode.replace(index, parent, newNode);
        } else {
            if (!!oldNode && !!newNode && oldNode.getTagName() === newNode.getTagName() && !oldNode.equals(newNode)) {
                oldNode.setProps(newNode.getPropsObj());
                oldNode.updateListeners(newNode);
                oldNode.updateAttributes(newNode);
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
     * Function removes all the marked as to be removed elements which did not come in the new stage by starting from the last to the first.
     */
    clearPending() {
        if (this.pendingRemove.length > 0) {
            let lastIdx = this.pendingRemove.length - 1;
            while (lastIdx >= 0) {
                this.pendingRemove[lastIdx].parent.remove(this.pendingRemove[lastIdx].index, this.pendingRemove[lastIdx].child);
                lastIdx--;
            }
            this.pendingRemove.length = 0;
        }
    }

}

export default RMEElemRenderer;
