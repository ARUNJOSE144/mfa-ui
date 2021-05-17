import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Redirect, Switch } from "react-router-dom";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import { checkForPrivilage, getIcon, validate } from "../../home/Utils";

/* eslint-disable */
export default class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      userName: "",
      data: [],


      page: 1,
      dataTotalSize: 0,
      recordCount: 10,
      searchKey: "",
      userNameSort: ""
    };



    props.setHeader("User");
  }

  componentDidMount() {
    this.getUsersList();
  }


  sizePerPageListChange = (sizePerPage) => {
    this.state.recordCount = sizePerPage;
    this.getUsersList(true);
  }

  onPageChange = (page, sizePerPage) => {
    this.state.page = page;
    this.forceUpdate();
    this.getUsersList(false);
  }

  onSearchChange = (searchText, colInfos, multiColumnSearch) => {
    this.state.searchKey = searchText;
    this.getUsersList(true);
  }

  onExportToCSV = () => {
    this.downloadReport();
  }

  resetList = () => {
    this.state.dataTotalSize = 0;
    this.state.page = 1;
    this.forceUpdate();
  }

  openEditMode = (row) => {
    this.setState({ modal: 3, userId: row.userId });
  }

  openViewMode = (row) => {
    this.setState({ modal: 4, userId: row.userId });
  }


  createCustomToolBar = (props) => {
    return (
      <div className="col-md-12">
        <div className="row">
          <div className='col-md-8 datatabletoolsButtons' >
            <h5 style={{ fontWeight: 700, fontSize: 14, marginTop: 10 }}>All Users |  {this.state.dataTotalSize}</h5>
            {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.create) ? <CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Create" isButtonGroup={true} onClick={() => this.setState({ modal: 2 })} /> : null}
          </div>
          <div className='col-md-4' >
            {props.components.searchPanel}
          </div>
        </div>
      </div>
    );
  };

  getUsersList = (isReset) => {
    if (isReset)
      this.resetList();
    var self = this;
    var request = {
      "recordCount": this.state.recordCount,
      "firstRecord": this.state.recordCount * this.state.page - this.state.recordCount,
      "dataTotalSize": this.state.dataTotalSize,
      "searchKey1": this.state.searchKey,
    }
    this.props.ajaxUtil.sendRequest("/user/v1/search", request, function (resp, hasError) {
      self.formatReponse(resp.list)
      self.setState({ dataTotalSize: resp.dataTotalSize, data: resp.list })
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
  }



  formatReponse = (list) => {
    if (validate(list)) {
      list.forEach(element => {
        element.roleId = element.role.roleId;
        element.roleName = element.role.roleName;
      });
    }
    console.log("======================list : ", list)
  }

  deleteRow(obj, message, callback) {
    if (obj.userId === 1) {
      this.props.setNotification({ message: "Can't Delete Admin User", hasError: true, timestamp: new Date().getTime() });
      return;
    }
    this.props.setModalPopup({
      'rowId': obj.userId,
      'isOpen': true,
      'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
      'title': "Confirm Delete",
      'content': "Do you want to delete the User?",
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Delete"
    });
  }

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest("/user/v1/delete", { userId: rowId }, function (resp, hasError) {
      self.getUsersList(true);
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
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
          <Redirect to="/User/create" push />
        </Switch>
      );
    }
    if (this.state.modal === 3) {
      const editUrl = `/User/edit/${this.state.userId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    }

    console.log("privilages : ", this.props.privilages);
    console.log("menuprivilages : ", this.props.menuPrivilages);

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
          <TableHeaderColumn isKey dataField="id" className="dth" columnClassName="dtd" /* width='0' */ hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="name" className="dth" columnClassName="dtd" width='220'  >Name</TableHeaderColumn>
          <TableHeaderColumn dataField="username" className="dth" columnClassName="dtd" width='200'  >UserName</TableHeaderColumn>
          <TableHeaderColumn dataField="emailId" className="dth" columnClassName="dtd" width='200' >EmailId</TableHeaderColumn>
          <TableHeaderColumn dataField="roleName" className="dth" columnClassName="dtd" width='130'  >Role</TableHeaderColumn>

          <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-eye", () => this.openViewMode(row))}>View</TableHeaderColumn>
          {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.edit) ? <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-pencil", () => this.openEditMode(row))}>Edit</TableHeaderColumn> : null}
          {checkForPrivilage(this.props.privilages, this.props.menuPrivilages.delete) ? <TableHeaderColumn className="dth" columnClassName="dtd" width={60} headerAlign='center' dataAlign='center' dataFormat={(cell, row) => getIcon(row, "fa fa-trash", () => this.deleteRow(row))}>Delete</TableHeaderColumn> : null}
        </BootstrapTable >
      </div>
    );
  }
}


