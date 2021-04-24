import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const NodeMenu = props => {
    const { node } = props;
    const { children } = node;
    return (
        <UncontrolledDropdown>
            <DropdownToggle tag="div" className="menu-icon-o">
                {/* <i className="fa fa-ellipsis-h" ></i> */}
                
            </DropdownToggle>
            <DropdownMenu right>
                <DropdownItem onClick={() => props.setNodeAction(4, props.nodeInput, node)} >View Details</DropdownItem>
                <DropdownItem onClick={() => props.setNodeAction(2, props.nodeInput)} >Edit Node</DropdownItem>
                {(!children || children.length < 1) && <DropdownItem onClick={() => props.setNodeAction(1, "", node)} >Add Branch</DropdownItem>}
                <DropdownItem className="text-danger" onClick={() => props.setNodeAction(3)} >Delete Node</DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
}

export default NodeMenu;