/* import { FieldItem, FIELD_TYPES } from '@6d-ui/fields'; */

import classnames from 'classnames';
import React, { Component } from 'react';
import { Col, Container, ModalBody, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../generic/fields/elements/fieldItem/FieldTypes';
import { USER_MGMNT as FormElements } from './util/FormElements';



const VIEWDOCUMENT = 6;
const CHANGESTATUS = 7;

export default class UserMoreInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 0,
      activeTab: '1',
      isLoading: true,
      firstName: '',
      lastName: '',
      userName: '',
      empCode: '',
      msisdn: '',
      telephone: '',
      emailId: '',
      empId: '',
      designation: '',
      reportingMgr: '',
      territoryType: '',
      territory: [],
      status: '',
      address1: '',
      address2: '',
      city: '',
      region: '',
      zipCode: '',
      isSuccess: false,
      teritoryOptions: [],
      teritoryTypeOptions: [],
      userType: 1,
      organisationName: ""
    };
    this.toggle = this.toggle.bind(this);
    //  this.loadSearch              = this.loadSearch.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.getLocationTypes = this.getLocationTypes.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.viewDataCallBack = this.viewDataCallBack.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    this.FORM_MODAL = props.FORM_MODAL;
  }

  componentDidMount() {
    this.viewDataCallBack();
    this.updateWindowDimensions();
    console.log("View Info : ", this.props.response);

    this.forceUpdate();
  }

  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }

  viewDataCallBack() {
    const userDetails = this.props.response;




    this.setState({
      isLoading: false,
      userId: userDetails.userId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      userName: userDetails.userName,
      empCode: userDetails.empCode,
      msisdn: userDetails.msisdn,
      emailId: userDetails.email,
      telephone: userDetails.telephone,
      empId: userDetails.empNumber,

      status: userDetails.statusName,
      statusId: userDetails.statusId,
      hierachyId: userDetails.hierarchyId,
      hierarchyName: userDetails.hierarchyName,
      roleId: userDetails.roleId,
      roleName: userDetails.roleName,
      parentId: userDetails.parentId,
      parentName: userDetails.parent,
      userType: userDetails.typeOfUser,
      organisationName: userDetails.organisationName,
      callCenterName:userDetails.callCenterName,
      businessBookName:userDetails.businessBookName

    });
  }



  toggleAction(type) {
    this.setState({ modal: type });
  }

  getLocation(reportingMgrId, locationType, locations) {
    const optionList = [];
    let url = '';

    if (!reportingMgrId && reportingMgrId === undefined)
      url = `${this.props.url_User.VIEW_LOCATION_URL}0&locationType=${locationType}&locationId=0`;
    else
      url = `${this.props.url_User.VIEW_LOCATION_URL}${reportingMgrId}&locationType=${locationType}&locationId=0`;

    return optionList;
  }

  getTerritory(teritoryOptions, locations) {
    let locationsOpts = [];
    teritoryOptions.forEach(options => {
      let selected = locations.find(selectedItems => options.value === selectedItems);
      selected && locationsOpts.push(options);
    });
    this.setState({ "territory": locationsOpts });
  }

  toggle(tab) {
    this.state.activeTab !== tab && this.setState({ activeTab: tab })
  }

  onCancel() {
    this.setState({ isSuccess: true });
  }

  onResetPassConfirmCallBack(userId) {
    this.props.ajaxUtil.sendRequest(`${this.props.url_User.RESETPASSWORD_URL}${userId}`, {}, null, null,
      { method: 'GET', isShowSuccess: true });
  }

  getLocationTypes(teritoryType) {
    const optionList = [];
    const request = {
      "filters": [
        {
          "name": "locationType",
          "value": teritoryType
        }]
    }
    return optionList;
  }

  getSelectedLocality(selected, optionsList) {
    let locality;
    optionsList.forEach((options) => {
      if (selected === options.value)
        locality = options.label;
    });
    return locality;
  }

  buildRequest(request) {
    if (!request)
      return;

    const api_request = {
      pageNumber: request.pageNumber || "",
      rowCount: request.rowCount,
      orderByCol: "id",
      sort: "asc",
      totalRecords: request.totalRecords || "",
      keyword: request.keyword
    }

    const reqFilters = [{
      name: "channelType",
      value: this.state.channelPartnerTypeId
    }];

    api_request.filters = reqFilters;
    return api_request;
  }

  parseResponse(response) {
    const optionList = [];
    if (response) {
      response.channelPartnerEnitities.forEach((options) => {
        const temp = {
          label: `${options.name} ( ${options.id} )`,
          value: options.id
        }
        optionList.push(temp);
      });
      return { data: optionList, totalRecords: response.search.totalRecords }
    }
    else
      return { data: null, totalRecords: 0 }
  }

  resetPassword() {
    this.props.setModalPopup({
      'rowId': this.state.msisdn,
      'isOpen': true,
      'onConfirmCallBack': this.onResetPassConfirmCallBack.bind(this),
      'content': "Do you really want to reset the password for this account ?",
      'title': "Confirm Reset Password",
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Reset"
    });
  }

  render() {
    const { salesPersonCheck = {}, documents = [], products = [], entities = [] } = this.state;
    const height = { height: this.state.windowHeight - 131 };


    return (
      <ModalBody className="px-4 py-4 overlay_position scrollbar" style={height}>
        <div className="form-tab wizardTab">
          <Row>
            <Col md="9">
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' }, { done: this.state.activeTab === '2' || this.state.activeTab === '3' }, 'rounded')}
                    onClick={() => { this.toggle('1'); }}>
                    Personal Information
                                </NavLink>
                </NavItem>

                {this.state.userType !== 2 && this.props.isComplexTab && <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' }, { done: this.state.activaTab === '4' }, 'rounded')}
                    onClick={() => { this.toggle('3'); }}>
                    User Association
                                </NavLink>
                </NavItem>
                }

              </Nav>
            </Col>

          </Row>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Container className="bg-white mt-3 pt-3 border">
                <Row className="mx-0">
                  <FieldItem
                    {...FormElements.userName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.userName}
                    width="md"
                    placeholder="" />
                  <FieldItem
                    {...FormElements.firstName}
                    value={this.state.firstName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder="" />
                  <FieldItem
                    {...FormElements.lastName}
                    value={this.state.lastName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder="" />

                  <FieldItem
                    {...FormElements.msisdn}
                    value={this.state.msisdn}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder="" />
                  <FieldItem
                    {...FormElements.telephone}
                    value={this.state.telephone}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder="" />
                  <FieldItem
                    {...FormElements.emailId}
                    value={this.state.emailId}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder="" />

                  {this.state.userType !== 4 ?
                    <FieldItem
                      {...FormElements.empId}
                      value={this.state.empId}
                      type={FIELD_TYPES.VIEW_DETAILS_BOX}
                      width="md"
                      placeholder=""
                    /> : null}


                  {this.state.userType === 4 ?
                    <FieldItem
                      {...FormElements.organisationName}
                      value={this.state.organisationName}
                      type={FIELD_TYPES.VIEW_DETAILS_BOX}
                      width="md"
                    /> : null}

                  {this.state.userType === 2 ?
                    <FieldItem
                      {...FormElements.adminType}
                      value={this.state.adminType}
                      type={FIELD_TYPES.VIEW_DETAILS_BOX}
                      width="md"
                    /> : null}

                </Row>
              </Container>
            </TabPane>

            <TabPane tabId="3">
              <Container className="bg-white mt-3 pt-3 border">
                <Row>
                  <FieldItem
                    {...FormElements.hierarchyName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.hierarchyName}
                    width="md"
                    placeholder="" />
                  <FieldItem
                    {...FormElements.roleName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.roleName}
                    width="md"
                    placeholder="" />
                  {this.state.parentId == 1 ? null :
                    <FieldItem
                      {...FormElements.reportingName}
                      type={FIELD_TYPES.VIEW_DETAILS_BOX}
                      value={this.state.parentName}
                      width="md"
                      placeholder="" />
                  }
                  {/* {this.state.businessBookName?( */}
                  <FieldItem
                    {...FormElements.businessBook}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.businessBookName}
                    width="md"
                    placeholder="" />{/* ):""} */}

                    {/* {this.state.callCenterName?( */}
                    <FieldItem
                    {...FormElements.callCenter}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.callCenterName}
                    width="md"
                    placeholder="" />{/* ):""} */}
                </Row>
              </Container>
            </TabPane>

          </TabContent>
          <div className="clearfix p-2 bg-white border border-top-0">
            <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.LARGE}
              color={COLOR.PRIMARY}
              align="right"
              label="Cancel"
              isButtonGroup={true}
              onClick={this.props.onCancel}
            />
            {/*  <CustomButton
              style={BUTTON_STYLE.BRICK}
              type={BUTTON_TYPE.SECONDARY}
              size={BUTTON_SIZE.LARGE}
              color={COLOR.PRIMARY}
              align="right"
              label="Edit"
              isButtonGroup={true}
              onClick={this.props.onEditClick}
            /> */}
          </div>
        </div>
        {/* <Popup
          type={POPUP_ALIGN.RIGHT}
          title={this.state.modalTitle}
          isOpen={this.state.isEntity && this.state.modal === this.FORM_MODAL.Create}
          minWidth="25%"
          isView={false}
          close={this.toggleAction}
          component={
            <ComplexSelectorModal
              ajaxUtil={this.props.ajaxUtil}
              authKey={this.props.ajaxUtil.getAuthKey()}
              url={this.props.url_ChannelPartners_SearchUrl}
              isView={true}
              onCancel={() => this.toggleAction(0)}
              title={this.state.modalTitle}
              selectedItems={this.state.modalSelected}
              listItems={this.state.modalSelected}
              isRadioButton={this.state.isEntity ? true : false}
              parseResponse={this.parseResponse}
              buildRequest={this.buildRequest.bind(this)}
            />
          }
        /> */}
        {/* <Popup
          type={POPUP_ALIGN.RIGHT}
          title={this.state.modalTitle}
          isOpen={!this.state.isEntity && this.state.modal === this.FORM_MODAL.Create}
          minWidth="25%"
          isView={false}
          close={this.toggleAction}
          component={
            <SelectorModal
              {...this.state}
              ajaxUtil={this.props.ajaxUtil}
              isView={true}
              onCancel={() => this.toggleAction(0)}
              title={this.state.modalTitle}
              listItems={this.state.modalList}
              selectedItems={this.state.modalSelected}
            />
          }
        /> */}

       {/*  <DocumentViewer
          isOpen={this.state.modal === VIEWDOCUMENT}
          srcPath={`${this.props.url_User.FILE_VIEW}/${this.state.userId}/doc/${this.state.selectedDocId}`}
          toggleModal={this.toggleAction}
          ajaxUtil={this.props.ajaxUtil}
          loadingFunction={this.props.loadingFunction}
        /> */}
       {/*  <Popup
          type={POPUP_ALIGN.CENTER}
          title="Change Status"
          isOpen={this.state.modal === CHANGESTATUS}
          close={this.toggleAction}
          minWidth="450px"
          component={
            <ChangeStatusModal
              ajaxUtil={this.props.ajaxUtil}
              setNotification={this.props.setNotification}
              url_User={this.props.url_User}
              user={this.state.userId}
              status={this.state.statusId}
              toggleAction={this.toggleAction}
              onSuccess={selectedStatusId =>
                this.setState({ statusId: selectedStatusId }, () => this.props.onSuccess())
              }
            />
          }
        /> */}
      </ModalBody>
    );
  }

}
