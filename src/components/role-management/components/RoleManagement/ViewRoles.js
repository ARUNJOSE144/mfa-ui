import React, { Component } from "react";
import { Redirect, Switch } from "react-router-dom";
import DataTableContainer from '../../../generic/data-table/elements/dataTable/DataTableContainer';
import { validate } from "../../../generic/fields/elements/fieldItem/utils";
import { POPUP_ALIGN } from '../../../generic/popup/constants/Types';
import Popup from '../../../generic/popup/elements/Popup';
import { ROLES as DataTableHeader } from '../util/DataTableHeader';
import EditRole from './EditRole';
//const modules = [];

export default class View extends Component {
  constructor(props) {
    super(props);
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;

    this.state = {

    }

    this.toggleAction = this.toggleAction.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    props.setHeader("Roles");
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
    let request = {};
    request.roleId = rowId;
    this.props.ajaxUtil.sendRequest(`${this.props.url_Roles.DELETE_URL}`, request, function (resp, hasError) {
      if (resp && !hasError) {
        self.props.setNotification({ message: resp.responseMsg, hasError: false });
        callback();
      } else {
        self.props.setNotification({ message: resp.responseMsg, hasError: true });
      }
    }, this.props.loadingFunction, { method: 'POST', isProceedOnError: true, isShowSuccess: false, isShowFailure: false });

  }
  validate = val => {
    if (val !== null && val !== "" && val !== undefined) {
      return true;
    } else {
      return false;
    }
  };
  toggleAction(type, id, data) {
    if (type === 3) {

      let selectedRecord;
      for (let i = 0; i < data.length; i++) {
        if (this.validate(data[i])) {
          if (data[i].roleId === id) {
            selectedRecord = data[i];
            break;
          }
        }

      }
      this.setState({ selectedRecord: selectedRecord });
      this.EditRole(type);
    }
    else if (type === 4) {

      let selectedRecord;
      for (let i = 0; i < data.length; i++) {
        if (this.validate(data[i])) {
          if (data[i].roleId === id) {
            selectedRecord = data[i];
            break;
          }
        }

      }
      this.setState({ selectedRecord: selectedRecord });
      this.EditRole(type)
    } else {
      this.setState({ modal: type, actionParamId: id });

    }
  }

  setModalConf = (isOpen, component, title, type, className) => {
    className = className || "hierarchy-modal";
    this.setState({ modal: { isOpen, component, title, type, className } });
  };
  reloadTable = () => {
    this.setState({ reload: new Date() })
  }
  getRecord = (data, field, value) => {
    if (validate(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data[i][field] === value) {
          return data[i];
        }
      }
    }

  }
  EditRole = (type) => {
    const header = type === 3 ? `Edit` : `View`;
    const createComp = () => (
      <EditRole
        type={type}
        selectedRecord={this.state.selectedRecord}
        onCancel={this.setModalConf}
        closeRole={this.closeRole}
        reloadTable={this.reloadTable}
        {...this.props}
      />
    );
    this.setModalConf(true, createComp, header);
  }
  closeRole = () => {
    this.setState({
      modal: {
        isOpen: false
      }
    })
  }


  render() {
    const { modal } = this.state;
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
      tableHeaderLabels: DataTableHeader.LABEL_LIST,
      loadingFunction: this.props.loadingFunction,
      header: "Roles",
      togglePopup: this.toggleAction,
      deleteRow: this.deleteRow,
      deleteMessage: 'Are you sure to Delete role',
      deleteMessageParam: ['roleName'],
      saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
      orderByCol: "roleId",
      /*  tabPriv: { info: true }, */
      renderSearchFilter: this.renderSearchFilter,
      isSearchOnEnter: false,
      reloadTable: this.state.reload,
      emptyMsg: "No Roles Available",
    }

    if (this.state.modal === 2) {
      return (
        <Switch>
          <Redirect to="/RoleManagement/create" push />
        </Switch>
      );
    }
    /* if (this.state.modal === 3) {
      const editUrl = `/RoleManagement/edit/${this.state.actionParamId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    } */

    return (
      <div className="custom-container">
        <DataTableContainer
          {...propsForDataTable}
        >
        </DataTableContainer>
        {
          modal && modal.component ? (
            <Popup
              type={POPUP_ALIGN.RIGHT}
              close={this.setModalConf}
              title={modal.title}
              isOpen={modal.isOpen}
              minWidth="75%"
              //minHeight="50%"
              component={<modal.component />}
            />
          ) : null
        }
        {/* <Popup
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
        /> */}
      </div>
    );
  }
}


