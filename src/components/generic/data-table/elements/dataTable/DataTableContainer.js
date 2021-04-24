import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { POPUP_ALIGN } from "../../../../generic/popup/constants/Types";
import Popup from "../../../../generic/popup/elements/Popup";
import { FORM_MODAL } from '../../constants/ModalTypes';
import { DataTable } from './DataTable';
import DataTableUtils from './util/DataTableUtils';
import DataTableUtilsV3 from './util/DataTableUtilsV3';




export default class DataTableContainer extends Component {

    constructor(props) {
        super(props);

        console.log('prevstate:->', props.previousState);

        const { tabPriv } = props;

        const tabPrivConst = props.menuPrivilages ? {
            "create": _.includes(props.privilages, props.menuPrivilages.create),
            "edit": _.includes(props.privilages, props.menuPrivilages.edit),
            "delete": _.includes(props.privilages, props.menuPrivilages.delete),
            "download": _.includes(props.privilages, props.menuPrivilages.download),
            "info": _.includes(props.privilages, props.menuPrivilages.info)
        } : {};

        this.tabPriv = Object.assign(tabPrivConst, tabPriv);


        const dtOpts = {
            'listUrl': props.listUrl,
            'searchFilters': props.tableSearchFilters,
            'setState': data => this.setState(data),
            'listName': props.listName,
            'rowIdParam': props.rowIdParam,
            'labelList': props.tableHeaderLabels,
            'loadingFunction': props.loadingFunction,
            'makeCallBack': props.ajaxUtil.makeCallBack,
            'authKey': props.ajaxUtil.getAuthKey(),
            'channel': props.ajaxUtil.getChannel(),
            'deleteMessage': props.deleteMessage,
            'deleteMessageParam': props.deleteMessageParam,
            'apiVersion': props.apiVersion,
            'postRequestCallback': props.postRequestCallback,
        }

        this.dataTable = props.apiVersion == 3 ? new DataTableUtilsV3(dtOpts) : new DataTableUtils(dtOpts);

        this.state = !props.previousState ? {
            'keyword': '',
            'rowCount': props.defaultRowCount || 10,
            'orderByCol': props.orderByCol,
            'sort': "desc",
            'modal': 0,
            'filterParams': {}
        } : {
                'modal': 0,
                'keyword': props.previousState.keyword,
                'rowCount': props.previousState.rowCount,
                'orderByCol': props.previousState.orderByCol,
                'sort': props.previousState.sort,
                'filterParams': props.previousState.filterParams,
                "userChannelType": props.previousState.userChannelType,
                "userEntityType": props.previousState.userEntityType
            };
    }

    componentDidMount() {
        this.dataTable.load(true, null, true, this.state);
        this.state.reloadTable = this.props.reloadTable;
    }

    componentWillReceiveProps(props) {
        if (this.state.reloadTable !== props.reloadTable) {
            this.state.reloadTable = props.reloadTable;
            this.dataTable.load(true, null, true, this.state);
        }
    }

    componentWillUnmount() {
        this.props.saveState && this.props.saveState(this.state);
    }

    onSearch = data => {
        this.dataTable.load(true, { "isAdvanceSearch": true, "keyword": "", ...data }, false, this.state);
    }

    loadDataTable = (isReset, data, firstLoad) => {
        this.dataTable.load(isReset, data, firstLoad, this.state);
    }

    togglePopup = (...popupArgs) => {
        const responseList = this.dataTable.getResponseList();
        if (popupArgs[0] === FORM_MODAL.SearchFilter)
            this.setState({ isSearchPopupOpen: true })
        else
            this.setState({ isSearchPopupOpen: false })
        this.props.togglePopup(...popupArgs, responseList);
    }

    handleExtraButtonClick = (buttonClickFn, ...btnArgs) => {
        const responseList = this.dataTable.getResponseList();
        buttonClickFn(responseList, ...btnArgs);
    }

    deleteRow = (obj, message) => this.props.deleteRow(obj, message, this.deleteCallBack);

    deleteCallBack = () => {
        if (this.state.rowData && this.state.rowData.length === 1 && this.state.pageNumber !== 1) {
            this.dataTable.load(false, { "pageNumber": (this.state.pageNumber - 1) }, false, this.state);
        } else {
            this.dataTable.load(false, { "pageNumber": this.state.pageNumber }, false, this.state);
        }
    }

    validateExportFunctionality = () => {
        if (this.props.exportTypes) {
            let hasErrorLabel = false;
            let hasErrorURL = false;
            this.props.exportTypes.map(item => {
                if (!item.label)
                    hasErrorLabel = true;
                if (!item.url)
                    hasErrorURL = true;
            });
            if (hasErrorLabel)
                console.warn("Please provide :label key for each object in :exportType prop to show export buttons.");
            if (hasErrorURL)
                console.warn("Please provide :url key for each object in :exportType prop for export buttons to work properly.");
        } else {
            console.warn("Please provide :exportType prop as array to show export buttons.");
        }
        if (!this.props.exportResponseHandler)
            console.warn("Please provide :exportResponseHandler prop as function to handle export response.");
        if (!this.props.setNotification)
            console.warn("Please provide :setNotification prop as function to handle export notification.");
        if (!this.props.exportFileName)
            console.warn("Please provide :exportFileName prop as string to set exporting file name. NOTE: Extension is not needed!");
    }

    render() {

        let exportProps = {};
        if (this.props.hasExport && this.props.apiVersion == 3) {
            this.validateExportFunctionality();
            exportProps = {
                exportCall: this.dataTable.exportDetails.bind(this, this.state),
                exportTypes: this.props.exportTypes,
                exportResponseHandler: this.props.exportResponseHandler,
                setNotification: this.props.setNotification,
                exportFileName: this.props.exportFileName
            }
        }
        return (
            <Fragment>

                <DataTable
                    commonSearch={this.state.keyword}
                    changeAttributes={this.dataTable.changeAttributes.bind(this, this.state)}
                    totalPages={this.state.totalPages}
                    startRow={this.state.startRow}
                    endRow={this.state.endRow}
                    rowData={this.state.rowData}
                    currentPage={this.state.pageNumber}
                    totalRecords={this.state.totalRecords}
                    labelList={this.props.tableHeaderLabels}
                    actions={this.tabPriv}
                    orderByCol={this.state.orderByCol}
                    sort={this.state.sort}
                    filters={this.state.filters}
                    rowCount={this.state.rowCount}
                    currentRow={this.state.currentRow}
                    highlightRow={this.dataTable.highlightRow}
                    toggleAction={this.togglePopup}
                    searchHelpText="Search"
                    deleteRow={this.deleteRow}
                    filterLabelList={this.props.filterLabelList}
                    header={this.props.header}
                    setPageState={data => this.setState(data)}
                    hasExport={this.props.hasExport}
                    tableButtons={this.props.tableButtons}
                    extraButtons={this.props.extraButtons}
                    removeSearch={this.props.removeSearch ? true : false}
                    onExtraButtonClick={this.handleExtraButtonClick}
                    emptyMsg={this.props.emptyMsg}
                    isSearchOnEnter={this.props.isSearchOnEnter}
                    checkBoxRerquired={this.props.checkBoxRerquired}
                    privilages={this.props.privilages}
                    {...exportProps}

                />

                {/* Search Filter Popup */}
                {
                    this.props.renderSearchFilter && <Popup
                        type={POPUP_ALIGN.CENTER}
                        title="Advanced Search"
                        isOpen={this.state.isSearchPopupOpen}
                        close={this.togglePopup}
                        component={
                            this.props.renderSearchFilter({
                                togglePopup: this.togglePopup,
                                onSearch: this.onSearch,
                                filterParams: this.state.filterParams
                            })
                        }
                    />
                }

                {this.props.children && this.props.children({ loadDataTable: this.loadDataTable })}

            </Fragment>
        )
    }

}


DataTableContainer.propTypes = {
    privilages: PropTypes.array,
    menuPrivilages: PropTypes.object,
    ajaxUtil: PropTypes.object,
    listUrl: PropTypes.string,
    apiVersion: PropTypes.number,
    defaultRowCount: PropTypes.number,
    orderByCol: PropTypes.string.isRequired,
    listName: PropTypes.string,
    tableHeaderLabels: PropTypes.array,
    loadingFunction: PropTypes.func,
    filterLabelList: PropTypes.object,
    header: PropTypes.string,
    togglePopup: PropTypes.func,
    searchFilterComponent: PropTypes.element,
    deleteRow: PropTypes.func,
    deleteMessage: PropTypes.string,
    deleteMessageParam: PropTypes.array,
    rowIdParam: PropTypes.string,
    renderSearchFilter: PropTypes.func,
    children: PropTypes.func,
    saveState: PropTypes.func,
    previousState: PropTypes.object,
    postRequestCallback: PropTypes.func,
    hasFilter: PropTypes.boolean,
    hasExport: PropTypes.boolean,
    tableButtons: PropTypes.object,
    extraButtons: PropTypes.array,
    removeSearch: PropTypes.boolean,
    emptyMsg: PropTypes.string
};

DataTableContainer.defaultProps = {
    listName: 'content'
}