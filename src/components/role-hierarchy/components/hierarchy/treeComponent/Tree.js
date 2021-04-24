import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import FieldItem from '../../../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../../../generic/fields/elements/fieldItem/FieldTypes';



const TreeData = {
    groupDropOptionId: 39,
    groupDropFieldId: 6,
    parentId: 0,
    name: 'CCO',
    exportValue: 'BD',
    showChildren: true,
    editMode: false,
    children: []
};

export default class TreeView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: TreeData,
            editableNode: ''
        }
    }

    componentWillReceiveProps(newProps) {
        const { treedata } = newProps;

        if (this.props.treedata !== newProps.treedata && treedata) {
            TreeData.children = [treedata];
            this.setState({ data: TreeData });
        }
        // else {
        //     TreeData.children = [{
        //         children:[],
        //         editMode: true,
        //         exportValue:"Admin",
        //         name:"Admin",
        //     }];
        // }
    }

    addRoot = () => {
        let root = {
            name: '',
            exportValue: '',
            showChildren: true,
            editMode: true,
            children: []
        }

        this.setState({
            data: root
        });
    }

    handleInputChange = (e, value) => {
        value[e.target.name] = e.target.value;
        this.setState({ value });
    }

    handleDropDownChange = (selected, value) => {

        value["roles"] = selected;
        this.setState({ value });
    }

    deleteNode = (parent, index) => {
        parent.splice(index, 1);
        this.setState({ parent });
    }

    makeEditable = (value) => {
        this.state.editableNode = JSON.parse(JSON.stringify(value));
        value.editMode = true;
        this.setState({ value });
    }

    closeForm = (value, parent, index) => {
        if (value.name !== '' && value.exportValue !== '') {
            value.name = this.state.editableNode.name;
            value.exportValue = this.state.editableNode.exportValue;
            value.editMode = false;
            this.setState({ value });
        }
        else {

            parent.splice(index, 1);
            this.setState({ parent });
        }
    }

    doneEdit = (value) => {
        value.editMode = false;
        this.setState({ value });
    }

    toggleView = (ob) => {
        ob.showChildren = !ob.showChildren;
        this.setState({ ob });
    }

    addMember = (parent) => {
        let newChild = {
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        }
        parent.push(newChild);
        this.setState({ parent });
    }

    addChild = (node) => {
        node.showChildren = true;
        node.children.push({
            name: '',
            exportValue: '',
            showChildren: false,
            editMode: true,
            children: []
        });
        this.setState({ node });
    }

    nodeEditForm = (value, parent, index) => {
        return (
            <div className="node node_edit" onClick={(e) => { e.stopPropagation() }}>
                <form className="node_edit_form">
                    <div className="field name">
                        <input value={value.name}
                            type="text"
                            name='name'
                            placeholder='Option'
                            onChange={(e) => { this.handleInputChange(e, value) }}
                        />
                    </div>
                    <div className="field code">
                        <input value={value.exportValue}
                            type="text"
                            name='exportValue'
                            placeholder='Value'
                        // onChange={(e) => { this.handleInputChange(e, value) }}
                        />
                    </div>
                    <div className="field action_node">
                        <span className="fa fa-check" onClick={(e) => { this.doneEdit(value) }}></span>
                        <span className="fa fa-close" onClick={(e) => { this.closeForm(value, parent, index) }}></span>
                    </div>
                </form>
            </div>
        )
    }

    makeChildren = (node) => {
        if (typeof node === 'undefined' || node.length === 0) return null;

        let children;
        children = node.map((value, index) => {

            let item = null;

            // A node has children and want to show her children
            let babies = value.children.length > 0 ? this.makeChildren(value.children) : [];
            let normalMode = (

                <div className="tree-node">
                    <table>
                        <tbody>
                            <tr>
                                <td className="input-node">
                                    <div className="d-flex align-items-center node-label">
                                        <input value={value.name}
                                            type="text"
                                            name='name'
                                            placeholder='name'
                                            onChange={(e) => { this.handleInputChange(e, value) }} />
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center ml-4 select-node">
                                        <FieldItem
                                            values={this.props.entityRoles}
                                            value={value.roles}
                                            type={FIELD_TYPES.MUTLI_SELECT}
                                            width="xs"
                                            onChange={(selected) => this.handleDropDownChange(selected, value)}
                                            error=""
                                            getOnlyInput={true}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex align-items-center ml-3">
                                        {this.getNodeMenu(value, node, index)}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
            item = (
                <li key={index} onClick={(e) => { e.stopPropagation(); this.toggleView(value) }}>
                    <div className="node-bullet"></div>
                    {/* {(value.editMode) ? this.nodeEditForm(value, node, index) : normalMode} */}
                    {normalMode}
                    {babies}
                </li>
            )

            return item;
        });

        return (
            <ul >
                {children}
                <li>
                    <div className="node-bullet-o"></div>
                    <div className="add-node" onClick={() => this.addMember(node)}>Add Node</div>
                </li>
            </ul>
        );
    }

    getNodes = () => {
        if (typeof this.state.data.name === 'undefined') return null;
        let children = this.makeChildren(this.state.data.children);

        return (
            <ul>
                <li>
                    <div className="node-bullet"></div>
                    <div className="d-flex align-items-center" style={{ height: '48px' }}>
                        Organization
                </div>
                    {children}
                </li>
                <li>
                    <div className="node-bullet-o"></div>
                    <div className="add-node" onClick={() => this.addMember(this.state.data.children)}>Add Node</div>
                </li>
            </ul>
        );
    }

    getNodeMenu = (node, parent, index) => {
        return (
            <UncontrolledDropdown>
                <DropdownToggle tag="div" className="menu-icon-o"></DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem onClick={() => this.addChild(node)}>Add Branch</DropdownItem>
                    <DropdownItem className="text-danger" onClick={() => this.deleteNode(parent, index)}>Delete Node</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    render() {
        return (
            <div className="tree-view">
                {this.getNodes()}
            </div>
        );
    }
}
