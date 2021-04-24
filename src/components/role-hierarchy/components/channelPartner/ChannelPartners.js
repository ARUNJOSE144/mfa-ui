import React, { Component ,Fragment } from 'react';
import { ModalBody, Row, ModalFooter } from 'reactstrap';
import { Redirect, withRouter } from 'react-router-dom';
import _ from 'lodash';
import HierarchicalView from './HierarchicalView';
import SearchFilter from './SearchFilter';
import { CustomButton, BUTTON_STYLE, BUTTON_TYPE, BUTTON_SIZE, COLOR } from '@6d-ui/buttons';
import { DataTableContainer } from '@6d-ui/data-table';
import { FieldItem, FIELD_TYPES } from "@6d-ui/fields";
import { Popup, POPUP_ALIGN } from '@6d-ui/popup';
import { treeToArray } from '../util/util';
import { CHANNEL_PARTNERS as DataTableHeader } from "../util/DataTableHeader";

class ChannelPartners extends Component {
    constructor(props) {
        super(props);
        this.FORM_MODAL = props.globalConstants.FORM_MODAL;

        this.state = {
            'modal': 0,
        };
        this.deleteRow = this.deleteRow.bind(this);
        this.toggleAction = this.toggleAction.bind(this);
        this.channelSelectComp = this.channelSelectComp.bind(this);
    }
    componentDidMount() {
        this.getChannelTypes();
    }
   
    getChannelTypes(opts) {
        this.props.ajaxUtil.sendRequest(this.props.url_SalesHierarchy_ListUrl, {}, (response) => {
            if (response) {
                const { channelTypeNodes } = response;
                const channelTypeOptions = [];
                if (channelTypeNodes.type === this.props.url_SalesHierarchy_OpNodeType) {
                    channelTypeOptions.push(
                        ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                            child => {
                                const salesEntites = [];
                                child.children && child.children.map(subChild => salesEntites.push(...treeToArray(subChild)));
                                const tempChild = { ...this.getOptionsForSelect(child) }
                                tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                                return tempChild;
                            }
                        ) : [])
                    );
                } else if (channelTypeNodes.type === this.props.url_SalesHierarchy_BuNodeType) {
                    channelTypeOptions.push(
                        ...(channelTypeNodes.children ? channelTypeNodes.children.map(
                            child => {
                                const salesEntites = [];
                                child.children && child.children.map(subChild => salesEntites.push(...treeToArray(subChild)));
                                const tempChild = { ...this.getOptionsForSelect(child) }
                                tempChild.children = salesEntites.map(salesEntity => this.getOptionsForSelect(salesEntity));
                                return tempChild;
                            }
                        ) : [])
                    );
                } else {
                    const tempArray = treeToArray(channelTypeNodes);
                    channelTypeOptions.push(...tempArray.map(obj => this.getOptionsForSelect(obj)));
                }
                this.setState({ channelTypeOptions })
            }
        }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
    }

    getOptionsForSelect(rawOpt) {
        if (!_.isEmpty(rawOpt)) {
            return {
                label: rawOpt.nodeName,
                value: rawOpt.nodeId,
                parentId: rawOpt.parentNodeId,
                type: rawOpt.type,
                parentTypeId: rawOpt.parentType
            }
        }
        return {};
    }

    deleteRow(obj, message, callback) {
        this.props.setModalPopup({
            'rowId': obj,
            'isOpen': true,
            'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
            'title': "Confirm Delete",
            'content': message,
            'CancelBtnLabel': "Cancel",
            'confirmBtnLabel': "Delete"
        });
    }

    onConfirmCallBack(rowId) {
        this.props.ajaxUtil.sendRequest(
            this.props.url_ChannelPartners.DELETE_URL,
            { "roleId": rowId },
            callback,
            this.props.loadingFunction,
            { isProceedOnError: false }
        );
    }

    toggleAction(type, rowId) {
        this.setState({
            "modal": type,
            "actionParamId": rowId
        });
    }

    onRedirectToCreate() {
        if (this.state.selectedChannelType) {
            this.setState({ modal: 'redirectToCreate' })
        } else {
            this.props.setNotification({
                message: this.props.messagesUtil.EMPTY_CHANNEL_TYPE_MSG,
                hasError: true,
                timestamp: new Date().getTime()
            });
        }
    }

    // getFormData(data) {
    //     this.state.dataTable.load(true, { "isAdvanceSearch": true, "keyword": "", ...data }, false, this.state);
    // }

    handleCreateChannelTypeChange = (val, obj) => {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) return;
        if (val) {
            this.setState({ selectedChannelType: val, selectedParentChannelType: val.parentTypeId, selectedParentId: val.parentId })
        } else {
            this.setState({ selectedChannelType: undefined, selectedParentChannelType: undefined, selectedParentId: undefined })
        }
    }

    channelSelectComp() {
        return (
            <ModalBody className="bg-white">
                <Row>
                    <FieldItem
                        label="Select Channel Type"
                        values={this.state.channelTypeOptions}
                        value={this.state.selectedChannelType}
                        type={FIELD_TYPES.NESTED_DROP_DOWN}
                        width="sm"
                        onChange={this.handleCreateChannelTypeChange}
                        touched={false}
                        error=""
                        placeholder="Select"
                        disabled={false}
                    />
                </Row>
                <ModalFooter>
                    {/* <Button color="secondary" className="btn-dataTable" onClick={this.toggleAction}>Cancel</Button> */}
                    <CustomButton
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.MEDIUM}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={this.toggleAction}
                    />
                    {/* <Button color="primary" className="btn-dataTable" onClick={this.onRedirectToCreate.bind(this)}>Next</Button> */}
                    <CustomButton
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.MEDIUM}
                        align="right"
                        label="Next"
                        isButtonGroup={true}
                        onClick={this.onRedirectToCreate.bind(this)}
                    />
                </ModalFooter>
            </ModalBody>
        )
    }
    handleSearchFilterSubmit = onSearchFn => data => {
        this.setState({ filterParams: data || {} });
        onSearchFn(data);
    }

    renderSearchFilter = searchFilterProps => <SearchFilter
        onCancel={() => searchFilterProps.togglePopup(0, null)}
        onSubmitClick={this.handleSearchFilterSubmit(searchFilterProps.onSearch)}
        ajaxUtil={this.props.ajaxUtil}
        loadingFunction={this.props.loadingFunction}
        url_SalesHierarchy_ListUrl={this.props.url_SalesHierarchy_ListUrl}
        url_SalesHierarchy_OpNodeType={this.props.url_SalesHierarchy_OpNodeType}
        url_SalesHierarchy_BuNodeType={this.props.url_SalesHierarchy_BuNodeType}
        {...this.state}
    />
    render() {
        const propsForDataTable = {
            privilages: this.props.privilages,
            menuPrivilages: this.props.menuPrivilages,
            tabPriv: { info: false },
            ajaxUtil: this.props.ajaxUtil,
            listUrl: this.props.url_ChannelPartners.SEARCH_URL,
            listName: 'channelPartnerEnitities',
            apiVersion: 2,
            defaultRowCount: this.props.globalConstants.INITIAL_ROW_COUNT,
            rowIdParam: 'id',
            orderByCol: "id",
            tableHeaderLabels: DataTableHeader.LABEL_LIST,
            loadingFunction: this.props.loadingFunction,
            filterLabelList: DataTableHeader.SEARCH_FIELDS,
            tableSearchFilters: DataTableHeader.SEARCH_FILTERS,
            renderSearchFilter: this.renderSearchFilter,
            deleteMessage: 'Confirm Delete the Channel Partner',
            deleteMessageParam: ['name'],
            saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
            header: "Channel Partners",
            togglePopup: this.toggleAction,
            deleteRow: this.deleteRow
        }
        if (this.state.modal === this.FORM_MODAL.View)
            return <Redirect to={`/channelPartners/view/${this.state.actionParamId}`} push />
        else if (this.state.modal === 'redirectToCreate')
            return <Redirect to={`/channelPartners/create/${this.state.selectedChannelType.value}/${this.state.selectedParentChannelType}/${this.state.selectedParentId}`} push />
        else {
            return (
                <div className="custom-container">
                    <div className="container-fluid clearfix">
                        <CustomButton
                            style={BUTTON_STYLE.ROUNDED}
                            type={BUTTON_TYPE.SECONDARY}
                            size={BUTTON_SIZE.MEDIUM}
                            color={COLOR.PRIMARY}
                            align="right"
                            label="Switch View"
                            isButtonGroup={false}
                            onClick={ev => this.setState({ viewMode: this.state.viewMode === 'tree' ? 'flat' : 'tree' })}
                        />
                    </div>
                    {
                        this.state.viewMode === 'tree'
                            ? <HierarchicalView
                                url_ChannelPartners={this.props.url_ChannelPartners}
                                url_User={this.props.url_User}
                                ajaxUtil={this.props.ajaxUtil}
                                loadingFunction={this.props.loadingFunction}
                            />
                            : <DataTableContainer
                                {...propsForDataTable}
                            >
                            </DataTableContainer>
                    }
                    {/* <Popup
                        type={POPUP_ALIGN.CENTER}
                        title="Advanced Search"
                        isOpen={this.state.modal === this.FORM_MODAL.SearchFilter}
                        close={this.toggleAction}
                        component={
                            <SearchFilter {...this.state}
                                onCancel={() => this.toggleAction(false, 0)}
                                onSubmitClick={this.getFormData}
                                ajaxUtil={this.props.ajaxUtil}
                                loadingFunction={this.props.loadingFunction}
                                url_SalesHierarchy_ListUrl={this.props.url_SalesHierarchy_ListUrl}
                                url_SalesHierarchy_OpNodeType={this.props.url_SalesHierarchy_OpNodeType}
                                url_SalesHierarchy_BuNodeType={this.props.url_SalesHierarchy_BuNodeType}
                            />
                        }
                    /> */}
                    <Popup
                        type={POPUP_ALIGN.CENTER}
                        title="Create"
                        isOpen={this.state.modal === this.FORM_MODAL.Create}
                        close={this.toggleAction}
                        minWidth="450px"
                        component={
                            this.channelSelectComp()
                        }
                    />
                </div>
            );
        }
    }
}

export default withRouter(ChannelPartners);
// export default withCache(withRouter(ChannelPartners));
