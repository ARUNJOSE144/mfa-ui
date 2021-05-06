import _ from "lodash";
import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Redirect, Switch } from "react-router-dom";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import { POPUP_ALIGN } from '../../generic/popup/constants/Types';
import Popup from '../../generic/popup/elements/Popup';
import { getIcon } from "../../home/Utils";
import RoleDetails from "./RoleDetails";
import SearchFilter from "./SearchFilter";
const modules = [];

export default class View extends Component {
  constructor(props) {
    super(props);
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;


    this.state = {
      roleId: "",
      roleName: "",
      permissions: "",
      data: [],


      page: 1,
      dataTotalSize: 0,
      recordCount: 10,
      searchKey: "",
      roleNameSort: ""
    };



    this.toggleAction = this.toggleAction.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    props.setHeader("System Roles");
  }

  componentDidMount() {
    this.getRolesList();
  }


  sizePerPageListChange = (sizePerPage) => {
    this.state.recordCount = sizePerPage;
    this.getRolesList(true);
  }

  onPageChange = (page, sizePerPage) => {
    this.state.page = page;
    this.forceUpdate();
    this.getRolesList(false);
  }

  onSearchChange = (searchText, colInfos, multiColumnSearch) => {
    this.state.searchKey = searchText;
    this.getRolesList(true);
  }

  onExportToCSV = () => {
    this.downloadReport();
  }

  resetList = () => {
    this.state.dataTotalSize = 0;
    this.state.page = 1;
    this.forceUpdate();
  }

  onKeyUp = (event) => {
    if (event.key === 'Enter' && event.target.value <= 100 && event.target.value >= 1) {
      this.state.recordCount = event.target.value;
      this.getRolesList(true);
    }
  }



  openEditMode = (row) => {
    this.setState({ modal: 3, roleId: row.roleId });
  }

  openViewMode = (row) => {
    this.setState({ modal: 4, roleId: row.roleId });
  }


  createCustomToolBar = (props) => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className='col-md-8 datatabletoolsButtons' >
            <h5 style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>All Roles |  {this.state.dataTotalSize}</h5>
            <CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Create" isButtonGroup={true} onClick={() => this.setState({ modal: 2 })} />

          </div>
          <div className='col-md-4' >
            {props.components.searchPanel}
          </div>
        </div>
      </div>
    );
  };




  getRolesList = (isReset) => {
    if (isReset)
      this.resetList();
    var self = this;
    var request = {
      "recordCount": this.state.recordCount,
      "firstRecord": this.state.recordCount * this.state.page - this.state.recordCount,
      "dataTotalSize": this.state.dataTotalSize,
      "searchKey1": this.state.searchKey,
    }
    this.props.ajaxUtil.sendRequest("/role/v1/search", request, function (resp, hasError) {
      self.setState({ dataTotalSize: resp.dataTotalSize, data: resp.list })
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
  }


  deleteRow(obj, message, callback) {
    if (obj.roleId === 1) {
      this.props.setNotification({ message: "Can't Delete Admin Role", hasError: true, timestamp: new Date().getTime() });
      return;
    }
    this.props.setModalPopup({
      'rowId': obj.roleId,
      'isOpen': true,
      'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
      'title': "Confirm Delete",
      'content': "Do you want to delete the Role?",
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Delete"
    });
  }

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.url_Roles.DELETE_URL, { roleId: rowId }, function (resp, hasError) {
      self.getRolesList(true);
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
  }

  toggleAction(type, id) {
    if (type === this.FORM_MODAL.View) {
      this.props.ajaxUtil.sendRequest(this.props.url_Roles.GET_FEATURES,
        {},
        response => {
          if (!response) {
            this.props.setNotification({
              message: "Failed to load modules",
              hasError: true,
              timestamp: new Date().getTime()
            });
          } else {
            _.pullAll(modules, modules);
            response.modules.forEach((module, index) => {
              modules.push(module);
            });
            this.props.ajaxUtil.sendRequest(this.props.url_Roles.VIEW_URL,
              { roleId: id },
              this.viewDataCallBack.bind(this),
              this.props.loadingFunction,
              { isShowSuccess: false });
          }
        },
        this.props.loadingFunction,
        { method: "GET", isShowSuccess: false });
      return false;
    } else {
      this.setState({ modal: type, actionParamId: id });
    }
  }

  viewDataCallBack(response) {
    if (!response) {
      this.props.setNotification({
        message: "Failed to load Role Details",
        hasError: true,
        timestamp: new Date().getTime()
      });
    } else {
      const roleDetails = response.roleMaster;
      const roleFeatures = roleDetails.featureList;
      const currentFeatures = [];
      roleFeatures.forEach((features, index) => {
        currentFeatures.push(features.featureId);
      });
      const permissions = {};
      modules.forEach((module, index) => {
        permissions[module.moduleId] = this.getCurrentPermissions(
          module.features,
          currentFeatures
        );
      });
      this.setState({
        isLoading: false,
        roleId: roleDetails.roleId,
        roleName: roleDetails.roleName,
        roleDesc: roleDetails.roleDesc,
        createdUser: roleDetails.createdUser,
        createdDate: roleDetails.createdDate,
        permissions: permissions,
        modules: modules,
        modal: 4
      });
    }
  }
  getCurrentPermissions(permissions, currentFeatures) {
    const permissionList = [];
    _.forEach(permissions, function (feature) {
      if (_.indexOf(currentFeatures, _.parseInt(feature.featureId)) >= 0) {
        const temp = {
          value: feature.featureId,
          label: feature.featurName
        };
        permissionList.push(temp);
      }
    });
    return permissionList;
  }

  handleSearchFilterSubmit = onSearchFn => data => {
    this.setState({ filterParams: data || {} });
    onSearchFn(data);
  }

  renderSearchFilter = searchFilterProps => <SearchFilter
    {...this.state}
    ajaxUtil={this.props.ajaxUtil}
    onCancel={() => searchFilterProps.toggleAction(0, null)}
    onSubmitClick={this.handleSearchFilterSubmit(searchFilterProps.onSearch)}
    {...this.state.filterParams}
  />

  render() {

    var options = {
      noDataText: 'No records found...',
      page: this.state.page,  // which page you want to show as default
      // clearSearch: true,
      sizePerPageList: [{ text: '10', value: 10 }, { text: '50', value: 50 }, { text: '100', value: 100 }],  // you can change the dropdown list for size per page
      sizePerPage: this.state.recordCount,  // which size per page you want to locate as default
      prePage: 'Prev', // Previous page button text
      nextPage: 'Next', // Next page button text
      firstPage: 'First', // First page button text
      lastPage: 'Last', // Last page button text
      paginationPosition: 'bottom',  // default is bottom, top and both is all available
      toolBar: this.createCustomToolBar,
      onPageChange: this.onPageChange,
      onSizePerPageList: this.sizePerPageListChange,
      onSearchChange: this.onSearchChange,
      onSortChange: this.onSortChange,
      onExportToCSV: this.onExportToCSV
    };

    if (this.state.modal === 2) {
      return (
        <Switch>
          <Redirect to="/Roles/create" push />
        </Switch>
      );
    }
    if (this.state.modal === 3) {
      const editUrl = `/Roles/edit/${this.state.roleId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    }

    return (
      <div className="custom-container">
        <BootstrapTable
          ref="table"
          pagination={true}
          remote={true}
          options={options}
          data={this.state.data}
          exportCSV={true}
          version="4"
          search
          fetchInfo={{ dataTotalSize: this.state.dataTotalSize }}        >
          <TableHeaderColumn isKey dataField="id" className="dth" columnClassName="dtd" width={0} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="roleName" className="dth" columnClassName="dtd" width={130} dataSort>Role Name</TableHeaderColumn>
          <TableHeaderColumn dataField="createDate" className="dth" columnClassName="dtd" width={130} >Created Date</TableHeaderColumn>
          <TableHeaderColumn dataField="description" className="dth" columnClassName="dtd" width={130}>Description</TableHeaderColumn>
          <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-eye", () => this.openViewMode(row))}>View</TableHeaderColumn>
          <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-pencil", () => this.openEditMode(row))}>Edit</TableHeaderColumn>
          <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-trash", () => this.deleteRow(row))}>Delete</TableHeaderColumn>
        </BootstrapTable >

        <Popup
          type={POPUP_ALIGN.RIGHT}
          title="View"
          isOpen={this.state.modal === 4}
          close={this.toggleAction}
          minWidth="85%"
          component={
            <RoleDetails
              {...this.state}
              ajaxUtil={this.props.ajaxUtil}
              onCancel={() => this.toggleAction(0, null)}
            />
          }
        />
      </div>
    );
  }
}


