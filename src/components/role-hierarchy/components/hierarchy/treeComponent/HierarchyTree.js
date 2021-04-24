import React from 'react';

function createNodes(props) {
    const treeData = props.data
    // if (typeof treeData.name === 'undefined') return null;
    //let children = createChildren(treeData.children);
    return (
        <ul>
            <li>
                {
                    props.nodeComponent
                        ? <props.nodeComponent node={treeData} index={0} />
                        : <div className="tree-node">
                            <div className="node-label d-flex align-items-center">
                                {treeData.nodeName}
                            </div>
                        </div>
                }
                {createChildren(treeData, props)}
            </li>
        </ul>
    );
}

function createChildren(node, props) {
    const { children } = node;
    // if (typeof node === 'undefined' || node.length === 0) return null;
    return (
        <ul>
            {
                children.map((value, index) => {
                    const babies = value.children && value.children.length > 0 ? createChildren(value, props) : [];
                    return (
                        <li key={index}>
                            {
                                props.nodeComponent
                                    ? <props.nodeComponent node={value} parent={node} index={index} />
                                    : <div className="tree-node">
                                        <div className="node-label d-flex align-items-center">
                                            {value.nodeName}
                                        </div>
                                    </div>
                            }
                            {babies}
                        </li>
                    )
                })
            }
            {/* <li>
                <div className="node-bullet-o"></div>
                <div className="add-node" onClick={() => props.addMember(node)}>Add Node</div>
            </li> */}
        </ul>
    )

}

const TreeView = props => {
    return (
        <div className="tree-view tree-view2">
            {props.data && createNodes(props)}
        </div>
    );
}

export default TreeView;
