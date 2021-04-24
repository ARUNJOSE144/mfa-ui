import _ from "lodash";
import React, { Component } from "react";
import { Redirect, Switch } from "react-router-dom";
import DataTableContainer from '../../generic/data-table/elements/dataTable/DataTableContainer';
import { POPUP_ALIGN } from '../../generic/popup/constants/Types';
import Popup from '../../generic/popup/elements/Popup';
import RoleDetails from "./RoleDetails";
import SearchFilter from "./SearchFilter";
import { ROLES as DataTableHeader } from './util/DataTableHeader';
const modules = [];

export default class View extends Component {
  constructor(props) {
    super(props);
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;

    if (!props.previousState) {
      this.state = {
        filterParams: {}
      };
    } else {
      this.state = {
        roleId: "",
        roleName: "",
        permissions: "",
        ajaxUtil: props.previousState.ajaxUtil,
        filterParams: props.previousState.filterParams,
      };
    }

    this.toggleAction = this.toggleAction.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    props.setHeader("System Roles");
  }

  deleteRow(obj, message, callback) {
    if (obj === 1) {
      this.props.setNotification({ message: "Can't Delete Admin Role", hasError: true, timestamp: new Date().getTime() });
      return;
    }
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

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.url_Roles.DELETE_URL, { roleId: rowId }, function (resp, hasError) {
        callback();
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

    const propsForDataTable = {
      privilages: this.props.privilages,
      menuPrivilages: this.props.menuPrivilages,
      ajaxUtil: this.props.ajaxUtil,
      listUrl: this.props.url_Roles.SEARCH_URL,
      previousState: this.props.previousState,
      apiVersion: 2,
      defaultRowCount: this.props.globalConstants.INITIAL_ROW_COUNT,
      listName: 'roleList',
      rowIdParam: 'roleId',
      tableHeaderLabels: DataTableHeader.LABEL_LIST_SYSTEM,
      loadingFunction: this.props.loadingFunction,
      header: "System Roles",
      togglePopup: this.toggleAction,
      deleteRow: this.deleteRow,
      deleteMessage: 'Are you sure to Delete role',
      deleteMessageParam: ['roleName'],
      saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
      orderByCol: "roleId",
      tabPriv: { info: true },
      renderSearchFilter: this.renderSearchFilter,
      isSearchOnEnter: false
    }

    if (this.state.modal === 2) {
      return (
        <Switch>
          <Redirect to="/Roles/create" push />
        </Switch>
      );
    }
    if (this.state.modal === 3) {
      const editUrl = `/Roles/edit/${this.state.actionParamId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    }

    return (
      <div className="custom-container">
        <DataTableContainer
          {...propsForDataTable}
        >
        </DataTableContainer>

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


