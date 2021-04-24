import React from 'react';
import NodeInput from './NodeInput';
import NodeMenu from './NodeMenu';

const TreeNode = props => {
    const {
        nodes,
        onNodeSelect,
        selected,
        isEdit,
        isCreate,
        onCreateClick,
        onEditClick,
        isParentSelected,
        parent,
        setNodeAction,
        setNodeInput,
        nodeInput
    } = props;

    return (
        <ul>
            {
                (isParentSelected && isCreate)
                    ? <li>
                        <div className="node-bullet"></div>
                        <div className="tree-node">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div className="d-flex align-items-center node-label">
                                                {/* <NodeSelectInput {...{setNodeInput, nodeInput, activateDraw, parent}} /> */}
                                                <NodeInput {...{setNodeInput, nodeInput}} />
                                            </div>
                                        </td>
                                        <td className="tree-view-btn-grp">
                                            <i className="fa fa-times" onClick={() => setNodeAction()}></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </li>
                    : null
            }
            {
                nodes && nodes.map((node, index) => {
                    const { id, children } = node;
                    return (
                        <li key={index}>
                            <div className="node-bullet"></div>
                            <div className={`tree-node d-flex align-items-center${selected === id ? " selected" : ""}`}>
                                <table>
                                    <tbody>
                                        {renderNodeItems(props, node)}
                                    </tbody>
                                </table>
                            </div>
                            <TreeNode
                                isEdit={isEdit}
                                onEditClick={onEditClick}
                                isCreate={isCreate}
                                onCreateClick={onCreateClick}
                                nodes={children}
                                onNodeSelect={onNodeSelect}
                                selected={selected}
                                isParentSelected={selected === id}
                                parent={node}
                                setNodeAction={setNodeAction}
                                nodeInput={nodeInput}
                                setNodeInput={setNodeInput}
                                activateDraw={props.activateDraw}
                            />
                        </li>
                    )
                })
            }
            {
                (nodes && nodes.length)
                    ? (
                        <li>
                            <div className="node-bullet-o"></div>
                            {parent && <div className="add-node" onClick={()=>onCreateClick(parent.id,parent)}>
                                Add Node
                            </div>}
                        </li>
                    ) : null
            }
        </ul>
    );
}

const renderNodeItems = (props, node) => {
    const { onNodeSelect, selected, isEdit, setNodeAction, setNodeInput, nodeInput } = props;
    const { id, name } = node;
    if (selected !== id) {
        return (
            <tr>
                <td onClick={() => onNodeSelect(id)}>
                    {/* <i className={`fa ${selected === id ? "fa-map" : "fa-map-o"}`}></i> */}
                    {/* <i className="fa fa-circle"></i> */}
                    <div className="d-flex align-items-center node-label">
                        {name}
                    </div>
                </td>
            </tr>
        );
    } else if (isEdit) {
        return (
            <tr>
                <td>
                    {/* <i className={`fa ${selected === id ? "fa-map" : "fa-map-o"}`}></i> */}
                    <div className="d-flex align-items-center node-label">
                        <NodeInput {...{setNodeInput, nodeInput}} />
                    </div>
                </td>
                <td className="tree-view-btn-grp">
                    <i className="fa fa-times" onClick={() => setNodeAction(0)}></i>
                </td>
            </tr>
        );
    } else {
        return (
            <tr>
                <td onClick={() => onNodeSelect(id)}>
                    {/* <i className={`fa ${selected === id ? "fa-map" : "fa-map-o"}`}></i> */}
                    <div className="d-flex align-items-center node-label">
                        {name}
                    </div>
                </td>
                <td className="tree-view-btn-grp">
                    <NodeMenu setNodeAction={setNodeAction} nodeInput={name} node={node}/>
                </td>
            </tr>
        );
    }
}

export default TreeNode;
