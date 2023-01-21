import _ from "lodash";
import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Redirect, Switch } from "react-router-dom";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import { checkForPrivilage, formatDate, getIcon } from "../../home/Utils";
const modules = [];

/* eslint-disable */
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
    props.setHeader("Trade Day Log");
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
    this.setState({ modal: 3, id: row.id });
  }

  openViewMode = (row) => {
    this.setState({ modal: 4, roleId: row.roleId });
  }


  createCustomToolBar = (props) => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className='col-md-8 datatabletoolsButtons' >
            <h5 style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>All |  {this.state.dataTotalSize}</h5>
            {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.create) ? <CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Create New Log" isButtonGroup={true} onClick={() => this.setState({ modal: 2 })} /> : null}
            {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.create) ? <CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Search Log" isButtonGroup={true} onClick={() => this.setState({ modal: 4 })} /> : null}

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

    this.props.ajaxUtil.sendRequest("/tradeLog/v1/list", request, function (resp, hasError) {

      /*  for (var i = 0; i < resp.list.length; i++) {
         resp.list[i].havingAnswer == "1" ? resp.list[i].havingAnswer = "Yes" : resp.list[i].havingAnswer = "No";
       } */

      self.setState({ dataTotalSize: resp.dataTotalSize, data: resp.list })
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
  }


  deleteRow(obj, message, callback) {

    this.props.setModalPopup({
      'rowId': obj.id,
      'isOpen': true,
      'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
      'title': "Confirm Delete",
      'content': "Do you want to delete the Question?",
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Delete"
    });
  }

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/delete", { id: rowId }, function (resp, hasError) {
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
          <Redirect to="/trade-day-log/create/0" push />
        </Switch>
      );
    }
    if (this.state.modal === 4) {
      return (
        <Switch>
          <Redirect to="/trade-day-log/questionSearch" push />
        </Switch>
      );
    }

    if (this.state.modal === 3) {
      const editUrl = `/trade-day-log/create/${this.state.id}`;
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
          <TableHeaderColumn isKey dataField="id" className="dth" columnClassName="dtd" width={50} hidden={false}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="tradeDate" className="dth" columnClassName="dtd" width={80} dataSort>Trade Date</TableHeaderColumn>
          <TableHeaderColumn dataField="day" className="dth" columnClassName="dtd" width={60} >Day</TableHeaderColumn>
          <TableHeaderColumn dataField="events" className="dth" columnClassName="dtd" width={180} >Events</TableHeaderColumn>
          <TableHeaderColumn dataField="comments" className="dth" columnClassName="dtd" width={180} >Comments</TableHeaderColumn>


          <TableHeaderColumn className="dth" columnClassName="dtd" width={80} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => formatDate(row.createDate)}>Created Date</TableHeaderColumn>
          <TableHeaderColumn className="dth" columnClassName="dtd" width={80} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => formatDate(row.modifiedDate)}>Modified Date</TableHeaderColumn>
          {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.edit) ? <TableHeaderColumn className="dth" columnClassName="dtd" width={40} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-pencil", () => this.openEditMode(row))}>Edit</TableHeaderColumn> : null}
          {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.delete) ? <TableHeaderColumn className="dth" columnClassName="dtd" width={40} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-trash", () => this.deleteRow(row))}>Delete</TableHeaderColumn> : null}
        </BootstrapTable >


      </div>
    );
  }
}


