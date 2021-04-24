/* import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, CustomButton } from '@6d-ui/buttons'; */
/* import { Popup, POPUP_ALIGN } from '@6d-ui/popup'; */
import _ from 'lodash';
import React, { Component } from 'react';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import { DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, ModalBody, UncontrolledDropdown } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import { POPUP_ALIGN } from '../../../generic/popup/constants/Types';
import Popup from '../../../generic/popup/elements/Popup';
import AttributeView from './AttributeView';
import FormTab from './FormTab';
import OrgNodeForm from './OrgNodeForm';






// const treedata = {
//     label: 'CCO',
//     id: 1,
//     children: [
//         {
//             label: 'Zonal Manager',
//             id: 11,
//             children: [
//                 {
//                     label: 'Area Manager',
//                     id: 111
//                 },
//                 {
//                     label: 'Super Visor',
//                     id: 112
//                 }
//             ]
//         },
//         {
//             label: 'Zonal Distributer',
//             id: 12
//         }
//     ]
// };

export default class ViewForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeName: ''
        }
        this.handleNodeInputChange = this.handleNodeInputChange.bind(this);
        this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
        this.handleMandatorySelect = this.handleMandatorySelect.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.attributeComp = this.attributeComp.bind(this);
        this.loadWholeNodeData = this.loadWholeNodeData.bind(this);

        this.onNodeSelect = this.onNodeSelect.bind(this);
        this.getNodeMenu = this.getNodeMenu.bind(this);
        this.NodeComponent = this.NodeComponent.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        this.loadWholeNodeData();

        const that = this;
        this.props.ajaxUtil.sendRequest(this.props.url_GetRoles, {}, (resp) => {
            const entityRoles = _.map(resp, role => { return { value: role.roleId, label: role.roleName } });
            that.setState({ entityRoles });
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    loadWholeNodeData(options) {
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.VIEW_NODE_URL + '/' + this.props.nodeId, {}, (response, hasError) => {
            const selectedAttributes = {};
            let treedata, nodeName, hasMultiLocation;
            if (response && !hasError) {

                const { channelTypeNodes } = response;
                hasMultiLocation = channelTypeNodes.multipleLocation === 1;
                nodeName = channelTypeNodes.nodeName;
                treedata = channelTypeNodes.organisationNodes;
                _.each(channelTypeNodes.fields, ({ fieldId, isMandatory }) => {
                    selectedAttributes[fieldId] = { isMandatory }
                })

            }
            this.setState({ selectedAttributes, treedata, isEdit: false, isCreate: false, nodeName, hasMultiLocation, ...options });
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    handleNodeInputChange(e) {
        this.setState({ nodeName: e.target.value });
    }

    handleAttributeSelect(fieldId, isChecked) {
        const selectedAttributes = this.state.selectedAttributes || {};
        isChecked ? selectedAttributes[fieldId] = { isMandatory: false } : delete selectedAttributes[fieldId]
        this.setState({ selectedAttributes })
    }

    handleMandatorySelect(fieldId, isChecked) {
        const selectedAttributes = this.state.selectedAttributes || {};
        if (_.has(selectedAttributes, fieldId)) {
            selectedAttributes[fieldId] = { isMandatory: isChecked }
            this.setState({ selectedAttributes })
        }
    }

    attributeComp(props) {
        const { handleAttributeSelect, handleMandatorySelect } = this;
        const { selectedAttributes } = this.state;
        return <AttributeView {...{ handleAttributeSelect, handleMandatorySelect, selectedAttributes }} {...props} />
    }

    treeComponent() {
        const { treedata } = this.state;
        return treedata
            ? (
                <div className="org-view-container">
                    <OrgChart tree={this.convertTreeData(treedata)} NodeComponent={this.NodeComponent} />
                </div>
            )
            : <span style={{ display: 'block', textAlign: 'center' }}>
                {/* <Button onClick={this.onAddNodeClick.bind(this)} className="btn-dataTable btn-primary-dataTable">
                    Create
                </Button> */}
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.MEDIUM}
                    label="Create"
                    onClick={this.onAddNodeClick.bind(this)}
                />
            </span>
    }

    // NodeComponent(nodeData) {
    //     const { node } = nodeData;
    //     return (
    //         <div className="org-node">
    //             <span className="label-span">{node.name}</span>
    //         </div>
    //     );
    // }

    toggleModal(modal) {
        modal = modal;
        this.setState({ modal });
    }

    onNodeSelect(node) {
        const selected = this.state.selected === node.nodeId ? null : node.nodeId
        this.setState({ selected })
    }

    onNodeViewClick(node) {
        const component = () => <OrgNodeForm
            node={node}
            allRoles={this.state.entityRoles}
            onCancel={this.toggleModal}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            onSubmitCallBack={this.loadWholeNodeData}
            channelType={this.props.nodeId}
            disabled />
        this.toggleModal({ isOpen: true, component, title: 'View Designation' });
    }

    onNodeEditClick(node) {
        const component = () => <OrgNodeForm
            onSubmitCallBack={this.loadWholeNodeData}
            channelType={this.props.nodeId}
            node={node}
            allRoles={this.state.entityRoles}
            onCancel={this.toggleModal}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            action="update" />
        this.toggleModal({ isOpen: true, component, title: 'Update Designation' });
    }

    onAddNodeClick(node) {
        const component = () => <OrgNodeForm
            channelType={this.props.nodeId}
            parent={node}
            allRoles={this.state.entityRoles}
            onCancel={this.toggleModal}
            action="create"
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
            onSubmitCallBack={this.loadWholeNodeData} />
        this.toggleModal({ isOpen: true, component, title: 'Create Designation' });
    }

    onDeleteNodeClick(node) {
        this.props.setModalPopup({
            "rowId": node.nodeId,
            "isOpen": true,
            "onConfirmCallBack": () => alert(),
            "title": "Confirm Delete",
            "content": "Do you really want to delete this node.?",
            "CancelBtnLabel": "Cancel",
            "confirmBtnLabel": "Delete"
        });
    }

    getNodeMenu(node, parent, index) {
        return (
            <UncontrolledDropdown>
                <DropdownToggle tag="div">
                    <img src={`${process.env.PUBLIC_URL}/images/icons/menu-o-sm.svg`} alt="" />
                </DropdownToggle>
                <DropdownMenu right className="fs-13 org-node-dropdown">
                    <DropdownItem onClick={() => this.onNodeViewClick(node)}>View</DropdownItem>
                    <DropdownItem onClick={() => this.onNodeEditClick(node)}>Edit</DropdownItem>
                    <DropdownItem onClick={() => this.onAddNodeClick(node)}>Add</DropdownItem>
                    <DropdownItem className="text-danger" onClick={() => this.onDeleteNodeClick(node)}>Delete</DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );
    }

    NodeComponent({ node }) {
        const isSelected = node.nodeId === this.state.selected;
        const style = isSelected ? { borderColor: '#0185E1', background: '#0185E1', color: '#FFFFFF' } : {};
        return (
            <div className="org-node" {...!isSelected ? { onClick: () => this.onNodeSelect(node) } : {}} style={style}>
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td className="px-2">
                                <span>{node.name}</span>
                            </td>
                            {isSelected && <td>{this.getNodeMenu(node)}</td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    convertTreeData(treeData, parentId) {
        const realData = {};
        realData.name = treeData.nodeName;
        realData.nodeId = treeData.nodeId;
        realData.type = treeData.type;
        realData.parentId = parentId;
        // const roles = [];
        // realData.roles = treeData.roles && treeData.roles.map(role => { return { roleId: role.value } });
        realData.roles = treeData.roles;
        realData.children = treeData.children && treeData.children.map(child => this.convertTreeData(child, realData.nodeId));
        return realData;
    }

    nodeComponent(props) {
        const { node } = props;
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <div className="tree-node">
                                <div className="node-label d-flex align-items-center">
                                    {node.nodeName}
                                </div>
                            </div>
                        </td>
                        <td>
                            <span className="role-label-span">Roles</span>
                        </td>
                        <td>
                            {
                                node.roles && node.roles.length > 0 && node.roles.map(role => role.roleName).join(', ')
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    render() {
        const { handleAttributeSelect, handleMandatorySelect } = this;
        const { selectedAttributes, modal, hasMultiLocation } = this.state;
        const height = {
            height: this.state.windowHeight ? this.state.windowHeight - 131 : 'unset'
        }
        const { node } = this.props;
        return (
            <ModalBody className="hierarchy-modal-body">
                <div className="overlay_position scrollbar" style={height}>
                    <div className="clearfix">
                        <table className="main-details-group float-left">
                            <tbody>
                                <tr>
                                    <td>
                                        <Label>
                                            {node.type === this.props.const_SalesHierarchy.BU_NODE_TYPE ? 'Business Unit Name' : 'Node Name'}
                                        </Label>
                                    </td>
                                    <td>
                                        <FormGroup>
                                            <Input value={this.state.nodeName} type="text" disabled style={{ backgroundColor: '#ffffff', border: '1px solid #949494' }} />
                                        </FormGroup>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <Button className="float-right btn-dataTable btn-primary-dataTable" onClick={this.props.onEditBtnClick}>
                            Edit
                        </Button> */}
                        <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.MEDIUM}
                            align="right"
                            label="Edit"
                            onClick={this.props.onEditBtnClick}
                        />
                    </div>
                    <FormTab
                        // treeComponent={() => <TreeView nodeComponent={this.nodeComponent} data={this.state.treedata} />}
                        treeComponent={this.treeComponent.bind(this)}
                        attributeComp={this.attributeComp}
                        {...{ handleAttributeSelect, handleMandatorySelect, selectedAttributes, hasMultiLocation }}
                        action={this.props.action}
                        node={this.props.node}
                        isView={true}
                        const_SalesHierarchy={this.props.const_SalesHierarchy}
                    />
                </div>
                {/* <ModalFooter>
                    <Button color="primary">Create</Button>
                    <Button color="secondary">Cancel</Button>
                </ModalFooter> */}

                {
                    modal && modal.component
                        ? <Popup
                            type={POPUP_ALIGN.RIGHT}
                            close={this.toggleModal}
                            title={modal.title}
                            isOpen={modal.isOpen}
                            component={<modal.component />}
                        />
                        : null
                }
            </ModalBody>
        );
    }

}
