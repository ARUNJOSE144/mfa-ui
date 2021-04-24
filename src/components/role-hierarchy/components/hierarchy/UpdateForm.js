import React, { Component } from 'react';
import {
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { Popup, POPUP_ALIGN} from '@6d-ui/popup';
import {CustomButton, BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE} from '@6d-ui/buttons';
import { FieldItem } from '@6d-ui/fields';

import FormTab from './FormTab';
import _ from 'lodash';
import AttributeSelect from './AttributeSelect';
import OrgChart from 'react-orgchart';
import OrgNodeForm from './OrgNodeForm';
import { FIELDS as CHANNELTYPEFIELDS, BUSINESS_LOCATION_GROUP, PERSONAL_DETAILS_GROUP } from '../util/ChannelTypeFields';


export default class UpdateForm extends Component {

    constructor(props) {
        super(props);
        this.state = { nodeName: '' }
        this.handleNodeInputChange = this.handleNodeInputChange.bind(this);
        this.handleAttributeSelect = this.handleAttributeSelect.bind(this);
        this.handleMandatorySelect = this.handleMandatorySelect.bind(this);
        this.handleMultiLocationSelect = this.handleMultiLocationSelect.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.attributeComp = this.attributeComp.bind(this);


        this.onNodeSelect = this.onNodeSelect.bind(this);
        this.getNodeMenu = this.getNodeMenu.bind(this);
        this.NodeComponent = this.NodeComponent.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loadWholeNodeData = this.loadWholeNodeData.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        const that = this;
        this.props.ajaxUtil.sendRequest(this.props.url_GetRoles, {}, (resp) => {
            const entityRoles = _.map(resp, role => { return { value: role.roleId, label: role.roleName } });
            that.setState({ entityRoles });
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
        this.loadWholeNodeData();
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    onSubmitClick() {
        const { selectedAttributes, nodeName } = this.state;
        const { nodeId } = this.props;
        const errors = {};

        // const rawOrgData = this.refTreeComponent.state.data.children[0];
        // const organisationNodes = rawOrgData && this.convertTreeData(rawOrgData);
        const fields = selectedAttributes && _.map(selectedAttributes, (val, key) => {
            return { fieldId: key, isMandatory: val.isMandatory ? 1 : 2 };
        });
        this.state.nodeName || (errors.nodeName = "This Field is mandatory");
        _.isEmpty(fields) && (errors.fields = "Please select at least one attribute");
        // for (var key in errors) {
        //     store.dispatch(this.props.setNotification({"message" : errors[key], "hasError" : true, "timestamp" : new Date().getTime()}));
        // }

        if (_.isEmpty(errors)) {
            const reqData = {
                nodeName,
                nodeId,
                // parentNodeId: this.props.parentEntityId,
                fields,
                multipleLocation: this.state.hasMultiLocation ? 1 : 0
                //  organisationNodes
            }

            this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.UPDATE_NODE_URL, reqData, (resp, hasError) => {
                if (resp && !hasError) {
                    this.props.createCallBack();
                } else {
                    const errMessage = resp && resp.responseMsg ? resp.responseMsg : "Request failed. Please try again later"
                    this.props.setNotification({ "message": errMessage, "hasError": true, "timestamp": new Date().getTime() });
                }
            }, this.props.loadingFunction, { isShowSuccess: false });
        } else {
            this.setState({ errors });
            this.props.setNotification({ "message": "Please provide all the required values", "hasError": true, "timestamp": new Date().getTime() });
        }

    }


    findFromTree(source, id) {
        for (const key in source) {
            var item = source[key];
            if (item.fields && item.fields.hasOwnProperty(id))
                return item;

            // Item not returned yet. Search its subGroups by recursive call.
            if (item.subGroups) {
                var subresult = this.findFromTree(item.subGroups, id);

                // If the item was found in the subchildren, return it.
                if (subresult)
                    return subresult;
            }
        }
        // Nothing found yet? return null.
        return null;
    }

    convertTreeData(treeData) {
        const realData = {};
        realData.nodeName = treeData.name
        // const roles = [];
        realData.roles = treeData.roles && treeData.roles.map(role => { return { roleId: role.value } });
        realData.children = treeData.children && treeData.children.map(child => this.convertTreeData(child));
        return realData;
    }

    convertTreeDataForInput(treeData, parentId) {
        const realData = {};
        realData.name = treeData.nodeName
        realData.nodeId = treeData.nodeId
        realData.parentId = parentId;
        // const roles = [];
        //realData.roles = treeData.roles && treeData.roles.map(role => { return { value: role.roleId, label: role.roleName } });
        realData.roles = treeData.roles;
        realData.children = treeData.children ? treeData.children.map(child => this.convertTreeDataForInput(child, realData.nodeId)) : [];
        return realData;
    }


    handleNodeInputChange(value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) return;
        this.setState({ nodeName: value });
    }

    handleAttributeSelect(fieldId, isChecked) {
        const selectedAttributes = this.state.selectedAttributes || {};

        const selectedGroup = this.findFromTree(CHANNELTYPEFIELDS, fieldId);

        isChecked ? selectedAttributes[fieldId] = { isMandatory: false } : delete selectedAttributes[fieldId];
        this.setState({ selectedAttributes: this.checkIfPersonalDetailsGroup(selectedGroup, selectedAttributes) });
    }

    handleMandatorySelect(fieldId, isChecked) {
        const selectedAttributes = this.state.selectedAttributes || {};
        if (_.has(selectedAttributes, fieldId)) {
            selectedAttributes[fieldId] = { isMandatory: isChecked }
            this.setState({ selectedAttributes })
        }
    }

    checkIfPersonalDetailsGroup = (group, selectedAttributes) => {
        if (group) {
            if (PERSONAL_DETAILS_GROUP.AUTHORISED_PERSON_GROUPID === group.groupId) {
                for (var key in group.fields) {
                    if (selectedAttributes.hasOwnProperty(key)) {
                        selectedAttributes[18] = { isMandatory: true };
                    }
                }
            }
            if (PERSONAL_DETAILS_GROUP.CONTACT_PERSON_GROUPID === group.groupId) {
                for (var key in group.fields) {
                    if (selectedAttributes.hasOwnProperty(key)) {
                        selectedAttributes[12] = { isMandatory: true };
                    }
                }
            }
        }
        return selectedAttributes;
    }

    handleMultiLocationSelect(evt) {
        const hasMultiLocation = evt.target.checked || false;
        let { selectedAttributes } = this.state;
        if (hasMultiLocation) {
            delete selectedAttributes[BUSINESS_LOCATION_GROUP.FIELDID_LATTITUDE];
            delete selectedAttributes[BUSINESS_LOCATION_GROUP.FIELDID_LONGITUDE];
        }
        this.setState({ hasMultiLocation, selectedAttributes });
    }

    attributeComp(props) {
        const { handleAttributeSelect, handleMandatorySelect } = this;
        const { selectedAttributes } = this.state;
        return <AttributeSelect {...{ handleAttributeSelect, handleMandatorySelect, selectedAttributes }} {...props} />
    }

    getComponentTreeRef(ref) {
        this.refTreeComponent = ref;
    }

    render() {
        const { handleAttributeSelect, handleMandatorySelect, handleMultiLocationSelect } = this;
        const { selectedAttributes, errors, entityRoles, treedata, modal, hasMultiLocation } = this.state;
        const { action, node } = this.props;
        const height = {
            height: this.state.windowHeight - 131
        }
        const getComponentTreeRef = this.getComponentTreeRef.bind(this);
        return (
            <ModalBody className="hierarchy-modal-body">
                <div className="overlay_position scrollbar" style={height}>
                    <div className="clearfix">
                        <table className="main-details-group float-left">
                            <tbody>
                                <tr>
                                    <td>
                                        <Label>
                                            <Label>
                                                {node.type === this.props.const_SalesHierarchy.BU_NODE_TYPE ? 'Business Unit Name' : 'Node Name'}
                                            </Label>
                                        </Label>
                                    </td>
                                    <td>
                                        <FormGroup className={`required${errors && errors.nodeName ? ' has-danger' : ''}`}>
                                            {/* <Input value={this.state.nodeName} type="text" onChange={this.handleNodeInputChange} /> */}
                                            <FieldItem
                                                value={this.state.nodeName}
                                                customWidth={true}
                                                onChange={this.handleNodeInputChange}
                                            />
                                        </FormGroup>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        {errors && errors.nodeName ? <div className="text-help text-danger">This Field is mandatory</div> : null}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {/* <Button className="float-right btn-dataTable btn-primary-dataTable" onClick={this.props.onEditCancelBtnClick}>
                            Cancel
                        </Button> */}
                        <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.MEDIUM}
                            align="right"
                            label="Cancel"
                            onClick={this.props.onEditCancelBtnClick}
                        />
                    </div>

                    <FormTab
                        treeComponent={this.treeComponent.bind(this)}
                        attributeComp={this.attributeComp}
                        const_SalesHierarchy={this.props.const_SalesHierarchy}
                        {...{ handleAttributeSelect, handleMandatorySelect, handleMultiLocationSelect, selectedAttributes, getComponentTreeRef, entityRoles, treedata, action, node, hasMultiLocation }}
                    />

                </div>
                <ModalFooter>
                    {/* <Button className="btn-form btn-block-c" color="secondary-form" onClick={() => this.props.onCancel(false)}>Cancel</Button>
                    <Button className="btn-form btn-block-c" color="primary-form" onClick={this.onSubmitClick.bind(this)}>Update</Button> */}
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={() => this.props.onCancel(false)}
                    />
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Update"
                        isButtonGroup={true}
                        onClick={this.onSubmitClick.bind(this)}
                    />
                </ModalFooter>


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


    loadWholeNodeData(options) {

        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.VIEW_NODE_URL + '/' + this.props.nodeId, {}, (response, hasError) => {
            const selectedAttributes = {};
            let treedata, nodeName, hasMultiLocation;
            if (response && !hasError) {
                const { channelTypeNodes } = response;
                hasMultiLocation = channelTypeNodes.multipleLocation === 1 ? true : false;
                nodeName = channelTypeNodes.nodeName;
                treedata = channelTypeNodes.organisationNodes && this.convertTreeDataForInput(channelTypeNodes.organisationNodes);
                _.each(channelTypeNodes.fields, ({ fieldId, isMandatory }) => {
                    selectedAttributes[fieldId] = { isMandatory: isMandatory === 1 ? true : false }
                })
                this.addDefaultMandatoryFields(CHANNELTYPEFIELDS, selectedAttributes)

            }
            
            this.setState({ selectedAttributes, treedata, nodeName, hasMultiLocation, isEdit: false, isCreate: false, ...options });
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    addDefaultMandatoryFields(channeltypefields, selectedAttributes) {
        channeltypefields.forEach(group => {
            if (!_.isEmpty(group.fields)) {
                let { fields } = group
                for (var key in fields) {
                    var field = fields[key];
                    field.isMandatory && (selectedAttributes[key] = { isMandatory: true });
                }
            }
            if (!_.isEmpty(group.subGroups)) {
                selectedAttributes = this.addDefaultMandatoryFields(group.subGroups, selectedAttributes);
            }
        })
        return selectedAttributes;
    }


    treeComponent() {
        const { treedata } = this.state;
        return treedata
            ? (
                <div className="org-view-container">
                    <OrgChart tree={treedata} NodeComponent={this.NodeComponent} />
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

    toggleModal(modal) {
        modal = modal;
        this.setState({ modal });
    }

    onNodeSelect(node) {
        const selected = this.state.selected === node.nodeId ? null : node.nodeId
        this.setState({ selected })
    }

    onNodeEditClick(node) {
        const component = () => <OrgNodeForm
            channelType={this.props.nodeId}
            onSubmitCallBack={this.loadWholeNodeData}
            node={node}
            allRoles={this.state.entityRoles}
            onCancel={this.toggleModal}
            action="update"
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
        />
        this.toggleModal({ isOpen: true, component, title: 'Update Designation' });
    }

    onAddNodeClick(node) {
        const component = () => <OrgNodeForm
            parent={node}
            onSubmitCallBack={this.loadWholeNodeData}
            allRoles={this.state.entityRoles}
            onCancel={this.toggleModal}
            action="create"
            channelType={this.props.nodeId}
            const_SalesHierarchy={this.props.const_SalesHierarchy}
            ajaxUtil={this.props.ajaxUtil}
            loadingFunction={this.props.loadingFunction}
        />
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
                    <DropdownItem onClick={() => this.onNodeEditClick(node)}>Edit Branch</DropdownItem>
                    <DropdownItem onClick={() => this.onAddNodeClick(node)}>Add Branch</DropdownItem>
                    <DropdownItem className="text-danger" onClick={() => this.onDeleteNodeClick(node)}>Delete Node</DropdownItem>
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

}
