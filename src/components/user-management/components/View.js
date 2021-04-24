import _ from 'lodash';
import React, { Component, Fragment } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import DataTableContainer from '../../generic/data-table/elements/dataTable/DataTableContainer';
import { POPUP_ALIGN } from '../../generic/popup/constants/Types';
import Popup from '../../generic/popup/elements/Popup';
import EditModal from './Edit';
/* import SearchFilter from './SearchFilter'; */
import MoreInfo from './MoreInfo';
/* import ChannelSelect from './parts/ChannelSelect'; */
import { USER_MGMNT as DataTableHeader } from './util/DataTableHeader';
import { checkForPrivilege, containAtleastOnePrivilage, containAtleastOnePrivilageId, treeToArray } from './util/util';






class View extends Component {
  constructor(props) {
    super(props);
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;

    if (!props.previousState) {
      this.state = {
        'userChannelType': props.userChannelType,
        'userEntityType': props.userEntityType,
        'modal': 0,
        'filterParams': {},
        channelTypeOptions: [],
        api_getRepMgnrList: false,
        api_getLocTypeList: false,
        api_getLocList: false
      };
    } else {
      this.state = {
        'modal': 0,
        'filterParams': props.previousState.filterParams,
        "userChannelType": props.previousState.userChannelType,
        "userEntityType": props.previousState.userEntityType,
        'ajaxUtil': props.previousState.ajaxUtil,
        'URL': props.previousState.URL,
        channelTypeOptions: props.previousState.channelTypeOptions,
        api_getRepMgnrList: false,
        api_getLocTypeList: false,
        api_getLocList: false
      };
    }

    this.toggleAction = this.toggleAction.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.getReportingMgrOptions = this.getReportingMgrOptions.bind(this);
    this.getLocationTypes = this.getLocationTypes.bind(this);
    this.getLocation = this.getLocation.bind(this);
    props.setHeader("User");

    //setting table level privilages
    this.state.userCreatePrivilageTags = ["createResidentialUser", "createCommericialUser", "createEMAUser"];
    this.state.userDeletePrivilageTags = ["deleteResidentialUser", "deleteCommericialUser", "deleteEMAUser"];
    this.state.userEditPrivilageTags = ["editResidentialUser", "editCommericialUser", "editEMAUser"];
    this.props.menuPrivilages.create = containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, this.state.userCreatePrivilageTags);
    this.props.menuPrivilages.edit = containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, this.state.userEditPrivilageTags);
    this.props.menuPrivilages.delete = containAtleastOnePrivilageId(this.props.privilages, this.props.menuPrivilages, this.state.userDeletePrivilageTags);
    this.state.hierarchyTypeIds = this.createCatIdsForView();

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
  reassignbuttonStyle = {
    position: 'absolute',
    marginLeft: 200,
    marginTop: 15,
    /* background: blue; */
    color: '#ffffff',
    backgroundColor: '#0185E1',
    border: '1px solid #0185E1',
    height: 30,
    cursor: 'pointer',
    /* margin-top: 0; */
    textAlign: 'center',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    fontSize: 12,
    borderRadius: 2,
    width: 100,
    zIndex: 100
  };


  componentDidMount() {
    // alert("userId::"+this.props.userId);

    console.log("---- privilages : ", this.props.privilages);
    console.log("----menu privilages : ", this.props.menuPrivilages);

  }

  createCatIdsForView = () => {
    var ids = [];
    if (checkForPrivilege(this.props.privilages, 7040))
      ids.push(1);
    if (checkForPrivilege(this.props.privilages, 7041))
      ids.push(2);
    if (checkForPrivilege(this.props.privilages, 7042))
      ids.push(3);
    return ids;
  }

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest(`${this.props.url_User.DELETE_URL}${rowId}`, {}, function (resp, hasError) {
      if (resp && !hasError) {
        self.props.setNotification({ message: resp.responseMsg, hasError: false });
        callback();
      } else {
        self.props.setNotification({ message: resp.responseMsg, hasError: true });
      }
    }, this.props.loadingFunction, { method: 'DELETE', isProceedOnError: true, isShowSuccess: false, isShowFailure: false });

  }

  toggleAction = (type, rowId) => {
    let self = this;
    if (type === this.FORM_MODAL.Create) {
      this.setState({
        'modal': 'redirect',
        selectedChannelType: true
      });
      /*   if (this.state.channelTypeOptions && this.state.channelTypeOptions.length !== 0)
         this.setState({ 'modal': this.FORM_MODAL.Create });
       else
         this.getChannelTypes(this.FORM_MODAL.Create);  */
    }
    else if (type === this.FORM_MODAL.Edit) {
      var reqData = {
        "userId": `${rowId}`,
      }
      this.props.ajaxUtil.sendRequest(`/user/v1/view`, reqData, (response, hasError) => {
        this.setState({ "modal": type, "viewResponse": response, "actionParamId": rowId },
          console.log("response Edit:::::" + JSON.stringify(response))
          // this.getReportingMgrOptions(response.channelType, response.designationId, response.parentId),
          // this.getLocation(response.parentId, response.teritoryTypeId)
        );
      }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isProceedOnError: false });

    } else if (type === this.FORM_MODAL.View) {
      var reqData = {
        "userId": `${rowId}`,
      }
      this.props.ajaxUtil.sendRequest(`/user/v1/view`, reqData, (response, hasError) => {
        console.log("response viw:::::" + JSON.stringify(response))
        self.setState({ "modal": type, "viewResponse": response, "actionParamId": rowId });
      }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isProceedOnError: false });

    } /* else if (type === this.FORM_MODAL.SearchFilter) {
      if (this.state.channelTypeOptions && this.state.channelTypeOptions.length !== 0)
        this.setState({ 'modal': this.FORM_MODAL.SearchFilter });
      else {
      
      }
    } */ else
      this.setState({ modal: type })
  }

  //reporting manager dropdown
  getReportingMgrOptions(channelPartnerTypeId, designationId, parentId) {
    const designationEntites = [];
    const optionList = [];
    var territoryType = null;
    this.props.ajaxUtil.sendRequest(`${this.props.url_User.GET_DESIGNATION_URL}/${channelPartnerTypeId}`, {}, (response, hasError) => {
      designationEntites.push(...treeToArray(response));
      designationEntites.forEach((options) => {
        if (options.nodeId === designationId) {
          const request = {
            "filters": [{
              "name": "designationId",
              "value": options.parentId
            }]
          }
          this.props.ajaxUtil.sendRequest(this.props.url_User.VIEW_REPMGR_URL, request, (response, hasError) => {
            response.forEach((options) => {
              const temp = {
                'value': options.userId,
                'label': `${options.firstName} ${options.lastName}`,
                'teritoryType': options.teritoryType
              }
              optionList.push(temp);
              if (options.userId === parentId)
                territoryType = options.teritoryType;
            });
            this.setState({ reportingMgrOptions: optionList, api_getRepMgnrList: true });
            this.getLocationTypes(territoryType, false)
          }, this.props.loadingFunction, { isShowSuccess: false, isProceedOnError: false });
        }
      });
    }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
  }

  //location type dropdown
  getLocationTypes(teritoryType, includeParentLocType) {
    const optionList = [];
    var request = {};
    if (this.state.reportingMgrOptions && this.state.reportingMgrOptions.length === 0)
      teritoryType = 0;
    if (includeParentLocType) {
      request = {
        "filters": [
          {
            "name": "locationType",
            "value": teritoryType
          },
          {
            "name": "includeParentLocType",
            "value": true
          }
        ]
      }
    } else {
      request = {
        "filters": [
          {
            "name": "locationType",
            "value": teritoryType
          }
        ]
      }
    }
    this.props.ajaxUtil.sendRequest(this.props.url_User.VIEW_LOCATIONTYPE_URL, request, (response, hasError) => {
      response.locTypes.forEach((options) => {
        const temp = {
          'value': options.locTypeId,
          'label': options.name
        }
        optionList.push(temp);
      });
      this.setState({ teritoryTypeOptions: optionList, api_getLocTypeList: true });
    }, this.props.loadingFunction, { isShowSuccess: false, isProceedOnError: false });
  }

  //location selector modal
  getLocation(reportingMgrId, locationType) {
    const optionList = [];
    var url = '';
    if (!reportingMgrId || reportingMgrId === undefined)
      url = `${this.props.url_User.VIEW_LOCATION_URL}0&locationType=${locationType}&locationId=0`;
    else
      url = `${this.props.url_User.VIEW_LOCATION_URL}${reportingMgrId}&locationType=${locationType}&locationId=0`;
    this.props.ajaxUtil.sendRequest(url, {}, (response, hasError) => {
      response.childLocList.locDetails.forEach((options) => {
        const temp = {
          'value': options.locId,
          'label': options.locName
        }
        optionList.push(temp);
      });
      this.setState({ teritoryOptions: optionList, api_getLocList: true });
    }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
  }

  //Channel Type dropDown(create)
  getChannelTypes(type) {
    this.props.ajaxUtil.sendRequest(this.props.url_SalesHierarchy.LIST_URL, {}, (response, hasError) => {
      const { channelTypeNodes } = response;
      const channelTypeOptions = [];
      if (channelTypeNodes.type === this.props.url_SalesHierarchy.OP_NODE_TYPE) {
        channelTypeOptions.push(this.getOptionsForSelect(channelTypeNodes));
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
      } else if (channelTypeNodes.type === this.props.url_SalesHierarchy.BU_NODE_TYPE) {
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
      this.setState({ channelTypeOptions, modal: type });
    }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false, isProceedOnError: false });
  }

  getOptionsForSelect(rawOpt) {
    if (!_.isEmpty(rawOpt)) {
      return {
        label: rawOpt.nodeName,
        value: rawOpt.nodeId,
        type: rawOpt.type
      }
    }
    return {};
  }

/*   handleSearchFilterSubmit = onSearchFn => data => {
    //alert(this.props.ajaxUtil);
    this.setState({ filterParams: data || {} });
    onSearchFn(data);
  } */

/*   renderSearchFilter = searchFilterProps => <SearchFilter

    ajaxUtil={this.props.ajaxUtil}
    onCancel={() => searchFilterProps.togglePopup(0, null)}
    onSubmitClick={this.handleSearchFilterSubmit(searchFilterProps.onSearch)}
  />
 */

  goto = (page) => {
    this.setState({ modal: page });
  }

  render() {
    let fullUrl = this.props.url_User.LIST_URL + "?UserId=" + this.props.userId
    console.log("fullUrl>>" + fullUrl);

    const extraButtons = [];

    containAtleastOnePrivilage(this.props.privilages, this.props.menuPrivilages, this.state.userCreatePrivilageTags) ?
      extraButtons.push({
        label: "Reassign",
        icon: "fa fa-exchange",
        onClick: () => this.goto(5)
      }) : null;

    const propsForDataTable = {
      privilages: this.props.privilages,
      menuPrivilages: this.props.menuPrivilages,
      ajaxUtil: this.props.ajaxUtil,
      listUrl: this.props.url_User.LIST_URL + "?UserId=" + this.props.userId + "&hierarchyTypeIds=" + this.state.hierarchyTypeIds.join(),
      previousState: this.props.previousState,
      apiVersion: 2,
      defaultRowCount: this.props.globalConstants.INITIAL_ROW_COUNT,
      listName: 'userList',
      rowIdParam: 'userId',
      tableHeaderLabels: DataTableHeader.LABEL_LIST,
      loadingFunction: this.props.loadingFunction,
      filterLabelList: DataTableHeader.SEARCH_FIELDS,
      header: "Users",
      togglePopup: this.toggleAction,
      tableSearchFilters: DataTableHeader.SEARCH_FILTERS,
      renderSearchFilter: this.renderSearchFilter,
      deleteRow: this.deleteRow,
      deleteMessageParam: ['firstName', 'lastName'],
      deleteMessage: 'Are you sure to Delete User ',
      saveState: state => this.props.saveCurrentState({ [this.props.previousStateKey]: state }),
      orderByCol: "registeredDate",
      tabPriv: { info: true },
      extraButtons: extraButtons,
      isSearchOnEnter: false

    }

    if (this.state.modal === 5) {
      const reassignUrl = `/user/reassign/`;
      return (
        <Switch>
          <Redirect to={reassignUrl} />
        </Switch>
      );
    }

    if (this.state.modal === 'redirect') {
      return <Redirect to={`/User/create/`} push />
    }
    else {
      return (
        <div className="custom-container">
          {/* <div><button style={this.reassignbuttonStyle} onClick={() => this.goto(5)}>Reassign User</button></div> */}
          <DataTableContainer
            {...propsForDataTable}
          >
            {
              childProps => <Fragment>
                <Popup
                  type={POPUP_ALIGN.RIGHT}
                  title="View"
                  isOpen={this.state.modal === this.FORM_MODAL.View}

                  close={() => this.toggleAction(0, null)}
                  minWidth="85%"
                  component={
                    <MoreInfo
                      ajaxUtil={this.props.ajaxUtil}
                      setNotification={this.props.setNotification}
                      setModalPopup={this.props.setModalPopup}
                      url_User={this.props.url_User}
                      url_ChannelPartners_SearchUrl={this.props.url_ChannelPartners_SearchUrl}
                      FORM_MODAL={this.FORM_MODAL}
                      isComplexTab={this.props.isComplexTab}
                      response={this.state.viewResponse}
                      onCancel={() => this.toggleAction(0, null)}
                      onSuccess={() => childProps.loadDataTable(false, null, false)}
                      onEditClick={() => this.toggleAction(3, this.state.actionParamId)}
                    />
                  }
                />
                <Popup
                  type={POPUP_ALIGN.RIGHT}
                  title="Edit"
                  isOpen={this.state.modal === this.FORM_MODAL.Edit
                    // && this.state.api_getRepMgnrList
                    // && this.state.api_getLocTypeList
                    // && this.state.api_getLocList
                  }
                  close={this.toggleAction}
                  minWidth="85%"
                  component={
                    <EditModal
                      ajaxUtil={this.props.ajaxUtil}
                      userChannelType={this.state.userChannelType}
                      userEntityType={this.state.userEntityType}
                      response={this.state.viewResponse}
                      messagesUtil={this.props.messagesUtil}
                      setNotification={this.props.setNotification}
                      setModalPopup={this.props.setModalPopup}
                      url_User={this.props.url_User}
                      globalConstants={this.props.globalConstants}
                      url_DocType_List={this.props.url_DocType_List}
                      url_SalesHierarchy={this.props.url_SalesHierarchy}
                      url_ChannelPartners_SearchUrl={this.props.url_ChannelPartners_SearchUrl}
                      loadingFunction={this.props.loadingFunction}
                      FORM_MODAL={this.FORM_MODAL}
                      FormElements={this.props.FormElements}
                      isComplexTab={this.props.isComplexTab}
                      reportingMgrOptions={this.state.reportingMgrOptions}
                      teritoryTypeOptions={this.state.teritoryTypeOptions}
                      teritoryOptions={this.state.teritoryOptions}
                      onCancel={() => this.toggleAction(0, null)}
                      onSuccess={() => childProps.loadDataTable(false, null, false)}
                      userId={this.props.userId}
                    />
                  }
                />
              </Fragment>
            }
          </DataTableContainer>

         {/*  <Popup
            type={POPUP_ALIGN.CENTER}
            title="Create"
            isOpen={this.state.modal === this.FORM_MODAL.Create}
            close={this.toggleAction}
            minWidth="450px"
            component={
              <ChannelSelect
                messagesUtil={this.props.messagesUtil}
                setNotification={this.props.setNotification}
                channelTypeOptions={this.state.channelTypeOptions}
                onCancel={() => this.toggleAction(0, null)}
                onSelect={(selectedChannelType, selectedParentChannelType) =>
                  this.setState({
                    selectedChannelType,
                    modal: 'redirect',
                    selectedParentChannelType
                  })
                }
              />
            }
          /> */}
        </div>
      );
    }
  }
}

export default View;
