/* import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR, CustomButton } from "@6d-ui/buttons"; */

import classnames from "classnames";
import _ from "lodash";
import React, { Component } from "react";
import { Container, ModalBody, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../generic/fields/elements/fieldItem/FieldTypes';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import { USER_MGMNT as FormElements } from "./util/FormElements";


const DECIMAL_REGEX = /^[+-]?\d+(\.\d+)?$/;
const MSISDN_REGEX = /^[0-9]{8,12}$/;
const VIEWDOCUMENT = 6;

export default class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: 0,
      activeTab: "1",
      isSuccess: false,
      tabData: ["1", "2", "3", "4", "5"],
      fields: {},
      designation: "",
      products: [{ threshold: "", msisdn: "", simSerialNo: "" }],
      documents: [{}],
      businessBookOptions: [],
      callCenterOptions: [],
      hierarchyCreatePrivilageTags: ["createResidentialHierarchy", "createCommercialHierarchy", "createEmaHierarchy"],
    };
    this.toggle = this.toggle.bind(this);
    this.getRequest = this.getRequest.bind(this);
    this.loadSearch = this.loadSearch.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.viewDataCallBack = this.viewDataCallBack.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.FORM_MODAL = props.FORM_MODAL;
  }

  componentDidMount() {
    this.viewDataCallBack();

    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions);
    this.getBusinessBook();
    this.getCallCenter();
  }

  getBusinessBook = () => {
    //var self = this;
    let businessBook = [];
    this.props.ajaxUtil.sendRequest("businessBook/v1/getAllBusinessBooks", {}, response => {
      //this.setState({ businessBookOptions: this.createSelectOptions(response.responseObj, "bookId", "name") })
      let optionList = [];
      console.log("<><><><>" + JSON.stringify(response));
      businessBook = response.responseObj;
      businessBook.forEach(options => {
        const temp = {
          value: options.bookId,
          label: options.name,
        };
        optionList.push(temp);
      });
      this.setState({ businessBookOptions: optionList });
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  }

  getCallCenter = () => {
    var self = this;
    let callCenter = [];
    this.props.ajaxUtil.sendRequest("commissioning/v1/getAllCallCenters", {}, response => {
      //self.setState({ callCenterOptions: this.createSelectOptions(response.responseObj, "id", "name") })
      let optionList = [];
      console.log("<><><><>" + JSON.stringify(response));
      callCenter = response.responseObj;
      callCenter.forEach(options => {
        const temp = {
          value: options.id,
          label: options.name,
        };
        optionList.push(temp);
      });
      this.setState({ callCenterOptions: optionList });
    }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
  }

  /* createSelectOptions = (data, key, value) => {
    if (this.validate(data) && data.length !== null) {
      for (var i = 0; i < data.length; i++) {
        data[i].value = data[i][key];
        data[i].label = data[i][value];
      }
    } else {
      data = [];
    }
    return data;
  } */

  fetchRolesDetails = values => {
    let roleEntities = [];
    var reqData = {
      //userId: this.props.userId,
      userId: parseInt(this.props.userId),
      hierarchyId: parseInt(values),
      adminCheck: "1",
      //adminCheck: containAtleastOnePrivilage(this.props.privilages, this.props.roleHierarchyPrivilages, this.state.hierarchyCreatePrivilageTags) ? "1" : "0",
    };
    let self = this;
    this.props.ajaxUtil.sendRequest(`/user/v1/getChildRolesByUserId`, reqData, function (response, hasError) {
      let optionList = [];
      console.log("<><><><>" + JSON.stringify(response));
      roleEntities = response.responseObj;
      roleEntities.forEach(options => {
        const temp = {
          value: options.roleId,
          label: options.roleName,
          parentRoleIdInHierarchy: options.parentRoleIdInHierarchy
        };
        optionList.push(temp);
      });
      self.setState({ roleOptions: optionList });
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }


  viewDataCallBack() {

    console.log("============= resp ==============", this.props.response);
    const userDetails = this.props.response;

    this.setState({
      userId: userDetails.userId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      userName: userDetails.userName,
      empCode: userDetails.empCode,
      msisdn: userDetails.msisdn,
      telephone: userDetails.telephone,
      emailId: userDetails.email,
      empId: userDetails.empNumber,

      hierachyId: userDetails.hierarchyId,
      hierarchyName: userDetails.hierarchyName,
      roleId: userDetails.roleId,
      roleName: userDetails.roleName,
      parentId: userDetails.parentId,
      parentName: userDetails.parent,
      roleOptions: [],
      rootRoleOptns: [],
      reportingMgrOptions: [],
      Role: { label: userDetails.roleName, value: userDetails.roleId },
      reportingTo: { label: userDetails.parent, value: userDetails.parentId },
      userType: userDetails.typeOfUser,
      organisationName: userDetails.organisationName,
      //callCenterName:userDetails.callCenterName,
      //businessBookName:userDetails.businessBookName
      businessBookName: { label: userDetails.businessBookName, value: userDetails.businessBookId },
      callCenterName: { label: userDetails.callCenterName, value: userDetails.callCenterId }
    });
    if (userDetails.typeOfUser !== 2) {
      this.fetchRolesDetails(userDetails.hierarchyId);
      this.fetchUserDetails(userDetails.hierarchyId, userDetails.roleId, userDetails.userId);
    }
  }

  fetchUserDetails(hierarchyId, roleId, currentUserId) {
    var reqData = {
      hierarchyId: hierarchyId,
      roleId: roleId,
      currentUserId: currentUserId,
      loginUserId: parseInt(this.props.userId)
    };
    let userEntities = [];
    let self = this;
    this.props.ajaxUtil.sendRequest(`user/v1/getParentUsers`, reqData, (response, hasError) => {
      const optionList = [];
      userEntities = response.allRoles;
      response.forEach(options => {
        const temp = {
          value: options.userId,
          label: options.firstName
        };
        optionList.push(temp);
      });
      self.setState({ reportingMgrOptions: optionList });
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false, isProceedOnError: false });
  }

  anyChildUsers(userId, value, name) {
    var reqData = {
      currentParentId: userId
    };
    this.props.ajaxUtil.sendRequest(`user/v1/getReportingUsers`, reqData, (response, hasError) => {
      if (response != null && response != undefined) {
        if (response.responseObj != null && response.responseObj.length > 0) {
          this.props.setNotification({ message: "Child Users exist cannot change role", hasError: hasError, timestamp: new Date().getTime() });
        } else {
          if (parseInt(value.parentRoleIdInHierarchy) < 0) {
            var obj = [
              {
                value: 1,
                label: "Admin"
              }
            ];
            this.setState({ roleId: value.value, reportingMgrOptions: obj, [name]: value, parentId: 1 });
          } else {
            this.setState({ [name]: value });
            this.fetchUserDetails(this.state.hierachyId, value.value, this.state.userId);
            this.setState({
              roleId: value.value,
              reportingTo: { label: null, value: null },
              parentId: 0
            });
          }
        }
      }
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false, isProceedOnError: false });
  }

  loadSearch(name) {
    switch (name) {
      case "location":
        this.setState({ modal: this.FORM_MODAL.Create, modalTitle: "Locations", modalList: this.state.teritoryOptions, modalSelected: this.state.territory, isEntity: 0 });
        break;
      case "entityList":
        this.setState({ modal: this.FORM_MODAL.Create, modalTitle: "Entity", modalSelected: this.state.entity, isEntity: 1 });
        break;
      default:
        break;
    }
  }

  toggleAction(type) {
    this.setState({ modal: type });
  }

  submitModal(name, selectedItem) {
    const items = [];
    selectedItem.forEach((item, index) => {
      items.push(item);
    });

    switch (name) {
      case "Locations":
        this.setState({ territory: items, modal: 0 });
        break;
      case "Entity":
        this.setState({ entity: items, associatedEntities: [], modal: 0 });
        break;
      default:
        break;
    }
  }

  toggle(tab) {
    this.state.activeTab !== tab && this.setState({ activeTab: tab });
  }

  onCancel() {
    this.setState({ isSuccess: true });
  }

  handleChange(name, value, obj) {
    console.log(name, value, obj, "value:::" + JSON.stringify(value));
    const { isTouched } = obj || { isTouched: false };

    if (isTouched) {
      value = this.state[name];
    }
    const fields = this.state.fields;
    const validate = validateForm(name, value, FormElements[name], null);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: "" };
    }
    if (isTouched && fields[name] && fields[name].hasError) {
      this.setState({ fields });
      return false;
    }
    if (fields[name] && fields[name].hasError) {
      this.setState({ [name]: value, fields });
      return false;
    }
    if (isTouched && fields[name] && !fields[name].hasError) {
      return false;
    }
    //this.setState({ [name]: value});
    switch (name) {
      case "Role":
        if (value) {
          this.anyChildUsers(this.state.userId, value, name);
        }
        break;
      case "reportingTo":
        console.log("reportingTo");
        if (value) {
          //console.log("in ifff"+);
          this.setState({ [name]: value });
          this.setState({ parentId: value.value });
        }
        break;

      case "msisdn":
        var number = this.checkPhNumberFormat(value);
        this.setState({ [name]: number, fields });
        break;
      case "telephone":
        var number = this.checkPhNumberFormat(value);
        this.setState({ [name]: number, fields });
        break;
      default:
        console.log("default");
        this.setState({ [name]: value, fields });
        break;
    }
  }

  preValidate(name, value, field) {
    if (this.state.designation && this.state.designation.parentId !== 0) {
      if (this.state.salesPersonCheck.salesPerson) {
        //territoryType and territory are mandatory
        if (
          (name === "territoryType" || name === "territory") &&
          !value &&
          _.size(value) === 0
        ) {
          return {
            hasError: true,
            errorMsg:
              field.messages && field.messages.mandatory
                ? field.messages.mandatory
                : this.props.messagesUtil.MANDATORY
          };
        }
      }
    } else {
      //reportingMgr - Not Mandatory
      if (name === "reportingMgr") return { hasError: false, errorMsg: "" };
    }
    if (
      this.state.cpType &&
      this.state.cpType === 1 &&
      this.props.userChannelType.toString() === this.state.channelPartnerTypeId
    ) {
      //entity - Not Mandatory
      if (name === "entity") return { hasError: false, errorMsg: "" };
    }
  }

  checkPhNumberFormat = (value) => {
    if (value) {
      var number = value.replace(/[^\d]/g, "");
      console.log(number, "fghfg");

      if (number.length == 7) {
        number = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      } else if (number.length == 10) {
        number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      }
    }
    return number;
  };

  updateCheck(response, hasError) {
    if (!hasError) {
      this.props.setNotification({
        message: response.responseMsg,
        hasError: false,
        timestamp: new Date().getTime()
      });
      this.props.onCancel();
      this.props.onSuccess();
    }
  }



  onSubmitClick() {

    if (this.validateTab(0)) {
      const request = this.getRequest();
      this.props.ajaxUtil.sendRequest(
        this.props.url_User.EDIT_URL,
        request,
        this.updateCheck.bind(this),
        this.props.loadingFunction,
        { isShowSuccess: false }
      );
    }
  }


  getRequest() {

    console.log("========= this.state.callCenterName ==============", this.state.callCenterName);
    console.log("========= this.state.businessBookName ==============", this.state.businessBookName);
    return {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userName: this.state.userName,
      msisdn: this.state.msisdn,
      telephone: this.state.telephone,
      email: this.state.emailId,
      empNumber: this.state.empId,
      userId: this.state.userId,
      parentId: this.state.parentId,
      roleId: this.state.roleId,
      hierarchyId: this.state.hierachyId,
      typeOfUser: this.state.userType,
      callCenterId: this.state.callCenterName.value,
      businessBookId: this.state.businessBookName.value,
    };
  }

  getSelectValue(value) {
    const valueType = typeof value;
    if (
      valueType !== "undefined" &&
      value !== null &&
      valueType !== "string" &&
      valueType !== "number" &&
      valueType !== "boolean"
    )
      return value.value;
    return value;
  }

  validateTab(tab) {
    let hasError = false,
      errorMsg;
    const fields = this.state.fields;
    const that = this;

    let rootNode = ["Role", "reportingTo"];
    if (this.state.parentId == 1) {
      rootNode = ["Role"];
    }
    const tabFieldMap = [
      [
        "firstName",
        "lastName",
        "userName",
        // 'empCode',
        "msisdn",
        "telephone",
        "reportingMgr"
        // 'territoryType',
        // 'territory',
        // 'entity'
      ],
      ["address1", "address2", "city", "region", "zipCode"],
      rootNode
    ];
    _.forEach(FormElements, function (value, name) {
      if (that.state.activeTab === "1" || tab === 0) {
        if (tabFieldMap[0].includes(name)) {
          const validate = validateForm(
            name,
            that.state[name],
            FormElements[name],
            null,
            null
          );
          if (validate) {
            if (hasError === false) hasError = validate.hasError;
            fields[name] = validate;
          } else {
            fields[name] = { hasError: false, errorMsg: "" };
          }
        }
      }
      if (that.state.activeTab === "2" || tab === 0) {
        if (tabFieldMap[1].includes(name)) {
          const validate = validateForm(
            name,
            that.state[name],
            FormElements[name]
          );
          if (validate) {
            if (hasError === false) hasError = validate.hasError;
            fields[name] = validate;
          } else {
            fields[name] = { hasError: false, errorMsg: "" };
          }
        }
      }
      if (that.state.activeTab === "3" || tab === 0) {
        if (tabFieldMap[2].includes(name)) {
          const validate = validateForm(
            name,
            that.state[name],
            FormElements[name],
            null,
            null
          );
          if (validate) {
            if (hasError === false) hasError = validate.hasError;
            fields[name] = validate;
          } else {
            fields[name] = { hasError: false, errorMsg: "" };
          }
        }
      }
    });
    that.setState({ fields });
    if (hasError) {
      switch (that.state.activeTab) {
        case "4":
          that.props.setNotification({ message: errorMsg, hasError: true });
          return false;
          break;
        case "5":
          that.props.setNotification({
            message: "Please input valid documents and document types",
            hasError: true
          });
          return false;
          break;
        default:
          that.props.setNotification({
            message: that.props.messagesUtil.EMPTY_FIELD_MSG,
            hasError: true,
            timestamp: new Date().getTime()
          });
          return false;
          break;
      }
    } else {
      if (tab === 0) return true;
      else this.toggle(tab);
    }
  }

  // product functions
  handleProductRemove = product => {
    this.props.setModalPopup({
      rowId: product.id,
      isOpen: true,
      onConfirmCallBack: this.removeProduct,
      title: "Confirm Removal",
      content: "Do you really want to remove this product.?",
      CancelBtnLabel: "Cancel",
      confirmBtnLabel: "Remove"
    });
  };

  handleProductUpdate = (product, successCallback) => {
    if (this.validateProducts(product)) {
      this.props.ajaxUtil.sendRequest(
        `${this.props.url_User.UPDATE_PRODUCTS}/${this.state.userId}`,
        { ...product },
        (response, hasError) => {
          if (!hasError) {
            this.fetchProducts();
            successCallback();
          }
        },
        this.props.loadingFunction,
        { method: "POST" }
      );
    }
  };

  handleProductSave = (product, successCallback) => {
    if (this.validateProducts(product)) {
      this.props.ajaxUtil.sendRequest(
        `${this.props.url_User.ADD_PRODUCTS}/${this.state.userId}`,
        { ...product },
        (response, hasError) => {
          if (!hasError) {
            this.fetchProducts();
            successCallback();
          }
        },
        this.props.loadingFunction,
        { method: "POST" }
      );
    }
  };

  validateProducts(product) {
    let error = { hasError: false, errorMsg: "" };
    if (!product.productId) {
      error.hasError = true;
      error.errorMsg = "Please select a valid product";
    } else if (!product.threshold) {
      error.hasError = true;
      error.errorMsg = "Please enter valid threshold";
    } else if (!DECIMAL_REGEX.test(product.threshold)) {
      error.hasError = true;
      error.errorMsg = "Please enter valid threshold";
    } else if (product.msisdn && !MSISDN_REGEX.test(product.msisdn)) {
      error.hasError = true;
      error.errorMsg = "Please enter valid msisdn with length 8-15";
    }

    if (error.hasError) {
      this.props.setNotification({
        message: error.errorMsg,
        hasError: true,
        timestamp: new Date().getTime()
      });
      return false;
    }
    return true;
  }

  removeProduct = productId => {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_User.DELETE_PRODUCTS}/${this.state.userId}/${productId}`,
      {},
      (response, hasError) => {
        if (!hasError) {
          this.fetchProducts();
        }
      },
      this.props.loadingFunction,
      { method: "DELETE" }
    );
  };

  fetchProducts = () => {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_User.LIST_PRODUCTS}/${this.state.userId}`,
      {},
      (response, hasError) => {
        if (!hasError) {
          this.setState({ products: response });
        }
      },
      this.props.loadingFunction,
      { method: "GET", isShowSuccess: false }
    );
  };

  // =====================================================
  // documents functions
  onDrop(files) {
    const { newDocument = {} } = this.state;
    newDocument.file = files[0];
    newDocument.docName = files[0].name;
    this.setState({ newDocument });
  }
  handleDocTypeChange(value) {
    const { newDocument = {} } = this.state;
    newDocument.docType = value;
    this.setState({ newDocument });
  }

  saveDocument = () => {
    const { newDocument = {}, userId } = this.state;
    if (
      !newDocument.docType ||
      !newDocument.docType.value ||
      !newDocument.file
    ) {
      this.props.setNotification({
        message: "Please Enter all document details",
        hasError: true,
        timestamp: new Date().getTime()
      });
      return;
    }
    const fromData = new FormData();
    fromData.append("file", newDocument.file);
    this.props.ajaxUtil.sendRequest(
      `${
      this.props.url_User.SAVE_DOCUMENT
      }${userId}&docType=${newDocument.docType && newDocument.docType.value}`,
      fromData,
      (response, hasError) => {
        if (!hasError) {
          const newDocument = {};
          this.setState({ newDocument });
          this.fetchDocuments();
        }
      },
      this.props.loadingFunction,
      null
    );
  };

  handleDocumentDelete = clickData => {
    this.props.setModalPopup({
      rowId: clickData.rowId,
      isOpen: true,
      onConfirmCallBack: this.deleteDocument,
      title: "Confirm Removal",
      content: "Do you really want to remove this document.?",
      CancelBtnLabel: "Cancel",
      confirmBtnLabel: "Remove"
    });
  };

  deleteDocument = rowId => {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_User.DELETE_DOCUMENT}/${rowId}`,
      {},
      (response, hasError) => {
        if (!hasError) {
          this.fetchDocuments();
        }
      },
      this.props.loadingFunction,
      { method: "DELETE" }
    );
  };

  fetchDocuments = () => {
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_User.LIST_ALL_FILES}/${this.state.userId}`,
      {},
      (response, hasError) => {
        if (!hasError) {
          this.setState({ documents: response });
        }
      },
      this.props.loadingFunction,
      { method: "GET", isShowSuccess: false }
    );
  };

  buildRequest(request) {
    if (!request) return;

    const api_request = {
      pageNumber: request.pageNumber || "",
      rowCount: request.rowCount,
      orderByCol: "id",
      sort: "asc",
      totalRecords: request.totalRecords || "",
      keyword: request.keyword
    };

    const reqFilters = [
      {
        name: "channelType",
        value: this.state.channelPartnerTypeId
      }
    ];

    api_request.filters = reqFilters;
    return api_request;
  }

  parseResponse(response) {
    const optionList = [];
    if (response) {
      response.channelPartnerEnitities.forEach(options => {
        const temp = {
          label: `${options.name} ( ${options.id} )`,
          value: options.id
        };
        optionList.push(temp);
      });
      return { data: optionList, totalRecords: response.search.totalRecords };
    } else return { data: null, totalRecords: 0 };
  }

  // =====================================================

  render() {
    console.log("this.state.userType", this.state.userType);
    console.log("this.state.response", this.props.response);

    const {
      salesPersonCheck = {},
      documents = [],
      newDocument = {}
    } = this.state;
    const height = { height: this.state.windowHeight - 131 };


    const getEntity = () => {
      if (
        this.state.cpType &&
        this.state.cpType !== 1 &&
        this.props.userChannelType.toString() !==
        this.state.channelPartnerTypeId
      ) {
        return (
          <FieldItem
            {...FormElements.entity}
            value={this.state.entity}
            onClick={() => {
              this.loadSearch("entityList");
            }}
            fieldValue={_.size(this.state.entity) + " Selected"}
            touched={
              this.state.fields.entity && this.state.fields.entity.hasError
            }
            error={
              this.state.fields.entity && this.state.fields.entity.errorMsg
            }
            width="md"
          />
        );
      }
    };

    const dzStyle = {
      width: "100px",
      padding: ".375rem .75rem",
      border: "1px solid",
      color: "#0096DE",
      cursor: "pointer",
      textAlign: "center",
      lineHeight: 1.5,
      fontSize: "1rem"
    };

    return (
      <ModalBody className="px-4 py-4">
        <div
          className="form-tab wizardTab overlay_position scrollbar"
          style={height}
        >
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === "1" },
                  { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("1") },
                  "rounded"
                )}
              >                Personal Information
              </NavLink>
            </NavItem>

            {this.state.userType !== 2 ?
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === "3" },
                    { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("3") },
                    "rounded"
                  )}
                >                User Association
              </NavLink>
              </NavItem> : null}


          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Container className="bg-white mt-3 pt-3 border">
                <Row className="mx-0">

                  <FieldItem
                    {...FormElements.userName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    value={this.state.userName}
                    width="md"
                    placeholder=""
                  />
                  <FieldItem
                    {...FormElements.firstName}
                    value={this.state.firstName}
                    onChange={this.handleChange.bind(this, FormElements.firstName.name)}
                    touched={this.state.fields.firstName && this.state.fields.firstName.hasError}
                    error={this.state.fields.firstName && this.state.fields.firstName.errorMsg}
                    width="md"
                    placeholder=""
                  />
                  <FieldItem
                    {...FormElements.lastName}
                    value={this.state.lastName}
                    onChange={this.handleChange.bind(this, FormElements.lastName.name)}
                    touched={this.state.fields.lastName && this.state.fields.lastName.hasError}
                    error={this.state.fields.lastName && this.state.fields.lastName.errorMsg}
                    width="md"
                    placeholder=""
                  />


                  <FieldItem
                    {...FormElements.msisdn}
                    value={this.state.msisdn}
                    onChange={this.handleChange.bind(this, FormElements.msisdn.name)}
                    touched={this.state.fields.msisdn && this.state.fields.msisdn.hasError}
                    error={this.state.fields.msisdn && this.state.fields.msisdn.errorMsg}
                    width="md"
                    placeholder=""
                  />

                  <FieldItem
                    {...FormElements.telephone}
                    value={this.state.telephone}
                    onChange={this.handleChange.bind(this, FormElements.telephone.name)}
                    touched={this.state.fields.telephone && this.state.fields.telephone.hasError}
                    error={this.state.fields.telephone && this.state.fields.telephone.errorMsg}
                    width="md"
                    placeholder=""
                  />
                  <FieldItem
                    {...FormElements.emailId}
                    value={this.state.emailId}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder=""
                  />

                  <FieldItem
                    {...FormElements.empId}
                    value={this.state.empId}
                    onChange={this.handleChange.bind(this, FormElements.empId.name)}
                    touched={this.state.fields.empId && this.state.fields.empId.hasError}
                    error={this.state.fields.empId && this.state.fields.empId.errorMsg}
                    width="md"
                    placeholder=""
                  />
                </Row>
              </Container>
              <div>
                <div style={{ height: "30px" }} />
                <CustomButton
                  style={BUTTON_STYLE.BRICK}
                  type={BUTTON_TYPE.PRIMARY}
                  size={BUTTON_SIZE.LARGE}
                  align="right"
                  label={this.state.userType === 2 ? "Create" : "Next"}
                  isButtonGroup={true}
                  onClick={this.state.userType === 2 ? (this.onSubmitClick.bind(this)) : (this.validateTab.bind(this, "3"))}
                />
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
              </div>
            </TabPane>
            <TabPane tabId="2">
              <Container className="bg-white mt-3 pt-3 border">
                <Row className="mx-0">

                </Row>
              </Container>
              <div>
                <div style={{ height: "30px" }} />
                <div>
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Next"
                    isButtonGroup={true}
                    onClick={this.validateTab.bind(this, "3")}
                  />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Prev"
                    isButtonGroup={true}
                    onClick={() => {
                      this.toggle("1");
                    }}
                  />
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
                </div>
              </div>
            </TabPane>
            <TabPane tabId="3">
              <Container className="bg-white mt-3 pt-3 border">
                <Row>
                  <FieldItem
                    {...FormElements.hierarchyName}
                    value={this.state.hierarchyName}
                    type={FIELD_TYPES.VIEW_DETAILS_BOX}
                    width="md"
                    placeholder=""
                  />
                  <FieldItem
                    {...FormElements.Role}
                    value={this.state.Role}
                    values={this.state.roleOptions}
                    onChange={this.handleChange.bind(this, FormElements.Role.name)}
                    touched={this.state.fields.Role && this.state.fields.Role.hasError}
                    error={this.state.fields.Role && this.state.fields.Role.errorMsg}
                    width="md"
                  />
                  {this.state.parentId == 1 ? null : (
                    <FieldItem
                      {...FormElements.reportingTo}
                      value={this.state.reportingTo}
                      values={this.state.reportingMgrOptions}
                      onChange={this.handleChange.bind(this, FormElements.reportingTo.name)}
                      touched={this.state.fields.designation && this.state.fields.designation.hasError}
                      error={this.state.fields.designation && this.state.fields.designation.errorMsg}
                      width="md"
                    />
                  )}

                  {/* {this.props.response.businessBookName?( */}
                  <FieldItem
                    {...FormElements.businessBook}
                    value={this.state.businessBookName}
                    values={this.state.businessBookOptions}
                    onChange={this.handleChange.bind(this, "businessBookName")}
                    touched={this.state.fields.businessBook && this.state.fields.businessBook.hasError}
                    error={this.state.fields.businessBook && this.state.fields.businessBook.errorMsg}
                    width="md"
                  />{/* ):""} */}

                  {/* {this.props.response.callCenterName?( */}
                  <FieldItem
                    {...FormElements.callCenter}
                    value={this.state.callCenterName}
                    values={this.state.callCenterOptions}
                    onChange={this.handleChange.bind(this, "callCenterName")}
                    touched={this.state.fields.callCenter && this.state.fields.callCenter.hasError}
                    error={this.state.fields.callCenter && this.state.fields.callCenter.errorMsg}
                    width="md"
                  />{/* ):""} */}
                </Row>
              </Container>
              <div>
                <div style={{ height: "20px" }} />
                <CustomButton
                  style={BUTTON_STYLE.BRICK}
                  type={BUTTON_TYPE.PRIMARY}
                  size={BUTTON_SIZE.LARGE}
                  align="right"
                  label="Create"
                  isButtonGroup={true}
                  onClick={this.onSubmitClick.bind(this)}
                />
                <CustomButton
                  style={BUTTON_STYLE.BRICK}
                  type={BUTTON_TYPE.SECONDARY}
                  size={BUTTON_SIZE.LARGE}
                  color={COLOR.PRIMARY}
                  align="right"
                  label="Prev"
                  isButtonGroup={true}
                  onClick={() => {
                    this.toggle("1");
                  }}
                />
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
              </div>
            </TabPane>
          </TabContent>
        </div>
       {/*  <Popup
          type={POPUP_ALIGN.RIGHT}
          title={this.state.modalTitle}
          isOpen={
            this.state.isEntity && this.state.modal === this.FORM_MODAL.Create
          }
          close={this.toggleAction}
          minWidth="25%"
          isView={false}
          component={
            <ComplexSelectorModal
              url={this.props.url_ChannelPartners_SearchUrl}
              ajaxUtil={this.props.ajaxUtil}
              authKey={this.props.ajaxUtil.getAuthKey()}
              parseResponse={this.parseResponse}
              buildRequest={this.buildRequest.bind(this)}
              onCancel={() => this.toggleAction(0)}
              onSubmitClick={this.submitModal.bind(this, "Entity")}
              title={this.state.modalTitle}
              isRadioButton={this.state.isEntity ? true : false}
              selectedItems={this.state.entity}
              listItems={this.state.entity}
            />
          }
        /> */}
        {/* <Popup
          type={POPUP_ALIGN.RIGHT}
          title={this.state.modalTitle}
          isOpen={
            !this.state.isEntity && this.state.modal === this.FORM_MODAL.Create
          }
          close={this.toggleAction}
          minWidth="25%"
          isView={false}
          component={
            <SelectorModal
              {...this.state}
              ajaxUtil={this.props.ajaxUtil}
              onCancel={() => this.toggleAction(0)}
              onSubmitClick={this.submitModal.bind(this, "Locations")}
              title={this.state.modalTitle}
              listItems={this.state.modalList}
              selectedItems={this.state.modalSelected}
              isRadioButton={
                this.state.salesPersonCheck
                  ? this.state.salesPersonCheck.fieldAgent
                    ? true
                    : false
                  : false
              }
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
      </ModalBody>
    );
  }
}
