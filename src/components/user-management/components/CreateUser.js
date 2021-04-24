/* import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR, CustomButton } from "@6d-ui/buttons"; */
/* 
import { FieldItem, validateForm } from "@6d-ui/fields"; */
/* import { ComplexSelectorModal, SelectorModal } from "@6d-ui/form"; */
/* import { Popup, POPUP_ALIGN } from "@6d-ui/popup"; */
import classnames from "classnames";
import _ from "lodash";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import { USER_MGMNT as FormElements, USER_PRIVILAGE_HIERARCHY_MAPPING as privilageHierarchyMapping, USER_TYPE_FROM_ELEMENTS as UserTypeFormElements } from "./util/FormElements";
import { checkForPrivilege, containAtleastOnePrivilage } from "./util/util";




const DECIMAL_REGEX = /^[+-]?\d+(\.\d+)?$/;
const MSISDN_REGEX = /^[0-9]{8,12}$/;

export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Options: [],
      values: [{ value: 1, label: "Call Center" },
      { value: 2, label: "Business Book" }
      ],
      //callCenterOptions: [{ value: 1, label: "Call Center" }],
      //businessBookOptions: [{ value: 1, label: "Business Book" }],
      callCenterOptions: [],
      businessBookOptions: [],
      toggle: [],
      callCenterSelction: "",
      businessBookSelection: "",
      systemRole: "",
      Selected: "",
      privilage: [],
      Admin: [
        { value: 1, label: "Hierarchy Management" },
        { value: 2, label: "Plan Creation" },
        { value: 3, label: "Plan Assignment" },
        { value: 4, label: "Plan Calculation" },
        { value: 5, label: "View Commission Plan" },
        { value: 6, label: "Approval Commission" }
      ],
      CSR: [
        { value: 1, label: "View Plan Associated to CSR" },
        { value: 2, label: "View Approved Commsion" },

      ],
      Manager: [
        { value: 1, label: "Residential/Commercial" },
        { value: 2, label: "Approval Commsion" },
        { value: 3, label: "View Approved Commsion" },
      ],

      fields: {},
      systemUserSelect: "",
      roleOptions: [],
      rootRoleOptns: [],
      reportingMgrOptions: [],
      roleHeirarchy: "",
      teritoryTypeOptions: [],
      teritoryOptions: [],
      isSuccess: false,
      activeTab: "1",
      products: [{ threshold: "", msisdn: "", simSerialNo: "" }],
      documents: [{}],
      tabData: ["1", "2", "3", "4"],
      searchParam: "",
      hierarchyId: 0,
      roleId: 0,
      reportingToId: 0,
      hierarchyName: "",
      planCatagories: [],
      userCreatePrivilageTags: ["createResidentialUser", "createCommericialUser", "createEMAUser"],
      hierarchyCreatePrivilageTags: ["createResidentialHierarchy", "createCommercialHierarchy", "createEmaHierarchy"],
      userType: "",
      fields: [],
      adminTypeList: [],
      adminType: "",
      userTypes: [],
    };
    this.FORM_MODAL = props.globalConstants.FORM_MODAL;
    this.getRequest = this.getRequest.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.toggle = this.toggle.bind(this);
  }


  //filtering the hierarchy create list based on the privilages
  loadHierrachyBasedOnPrivilages = () => {
    var privilagedCategories = [];
    for (var i = 0; i < this.state.userCreatePrivilageTags.length; i++) {
      var pervTag = this.state.userCreatePrivilageTags[i];
      if (checkForPrivilege(this.props.privilages, this.props.menuPrivilages[pervTag])) {
        var categoryId = privilageHierarchyMapping[this.props.menuPrivilages[pervTag]]
        for (var j = 0; j < this.state.rootRoleOptns.length; j++) {
          var cat = this.state.rootRoleOptns[j];
          if (cat.type === categoryId) {
            privilagedCategories.push(cat);
          }
        }
      }
    }
    this.setState({ rootRoleOptns: privilagedCategories })
  }




  setUserTypes = () => {
    if (this.props.userId === "1") {
      this.state.userTypes.push(this.getObjById("2"));
      this.setDefaultUserType(this.getObjById("2"));
    } if (checkForPrivilege(this.props.privilages, 7010) || checkForPrivilege(this.props.privilages, 7011)) {
      if (this.props.typeOfUser === 2) {
        this.state.userTypes.push(this.getObjById("2"));
        this.setDefaultUserType(this.getObjById("2"));
      }
      this.state.userTypes.push(this.getObjById("3"))
      //this.setDefaultUserType(this.getObjById("3"));
    } if (checkForPrivilege(this.props.privilages, 7012)) {
      if (this.props.typeOfUser === 2) {
        this.state.userTypes.push(this.getObjById("2"));
        this.setDefaultUserType(this.getObjById("2"));
      }
      this.state.userTypes.push(this.getObjById("4"))
      //this.setDefaultUserType(this.getObjById("4"));
    }
  }


  setDefaultUserType = (opt) => {
    if (this.state.userType === "") {
      this.state.userType = opt;
    }

  }


  createCatIdsForView = () => {
    var ids = [];
    if (checkForPrivilege(this.props.privilages, 7010))
      ids.push(1);
    if (checkForPrivilege(this.props.privilages, 7011))
      ids.push(2);
    if (checkForPrivilege(this.props.privilages, 7012))
      ids.push(3);
    return ids;
  }

  getCatIdsForHierarchy = () => {
    var ids = [];
    if (checkForPrivilege(this.props.privilages, 27000))
      ids.push(1);
    if (checkForPrivilege(this.props.privilages, 27001))
      ids.push(2);
    if (checkForPrivilege(this.props.privilages, 27002))
      ids.push(3);
    return ids.join();
  }

  getObjById = (id) => {
    for (var i = 0; i < UserTypeFormElements.userTypeOptions.length; i++) {
      if (UserTypeFormElements.userTypeOptions[i].value === id) {
        return UserTypeFormElements.userTypeOptions[i];
      }
    }
  }


  componentDidMount() {
    console.log("jnjhjashjas : ", this.props);
    if (this.props.userId === "1") {
      //this.fetchRootRoles();
    } else {
      /* this.getHierarcyIdByUserId(this.props.userId); */
    }
    this.getPlanCategories();
    this.getAdminTypes();
    this.setUserTypes();
    this.getHerarchiesByType();
    this.getBusinessBook();
    this.getCallCenter()

  }

  /*  getAdminTypes = () => {
     var self = this;
     this.props.ajaxUtil.sendRequest("user/v1/getFreeAdminTypes", {}, response => {
       self.setState({ adminTypeList: this.createSelectOptions(response.responseObj, "id", "name") })
 
 
 
     }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
   } */
  getAdminTypes = () => {
    this.props.ajaxUtil.sendRequest(`user/v1/getAdminTypes`, {}, (response, hasError) => {
      if (!hasError) {
        this.setState({
          adminTypeList: (this.createSelectOptions(response, "id", "name")),
        })
      }
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  };

  getPlanCategories = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.const_Commission.GET_PLAN_CATEGORIES_URL, {}, response => {
      self.setState({ planCatagories: response.responseObj })

    }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
  }


  getHerarchiesByType = () => {
    var self = this;
    let rootRoles = [];
    var catIds = this.getCatIdsForHierarchy();
    this.props.ajaxUtil.sendRequest("roleHierarchy/v1/getHierarchiesByType?hierarchyTypeIds=" + catIds, {}, response => {
      const optionList = [];
      rootRoles = response.hierarchyList;
      rootRoles.forEach(options => {
        const temp = { value: options.id, label: options.name, type: options.type };
        optionList.push(temp);
      });

      console.log("--------self.state.rootRoleOptns : ", optionList);
      self.state.rootRoleOptns = optionList;
      // self.loadHierrachyBasedOnPrivilages();
      this.forceUpdate();

    }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
  }



  getHierarcyIdByUserId = userId => {
    var reqData = { userId: userId };
    var self = this;
    this.props.ajaxUtil.sendRequest(`roleHierarchy/v1/getHierarchyIdByPassingUserId`, reqData, response => {
      let res = response.responseObj;
      if (res != null) {
        let values = { value: res.hierarchyId };
        self.setState({ hierarchyName: res.hierarchy, hierarchyId: res.hierarchyId, roleHierarchy: res.hierarchyId });
        self.fetchRolesDetails(values);
      }
    },
      this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  };


  createSelectOptions = (data, key, value) => {
    if (this.validate(data) && data.length !== null) {
      for (var i = 0; i < data.length; i++) {
        data[i].value = data[i][key];
        data[i].label = data[i][value];
      }
    } else {
      data = [];
    }
    return data;
  }

  fetchRootRoles() {
    let rootRoles = [];
    let self = this;
    this.props.ajaxUtil.sendRequest(`role/v1/getRoleHiearchyNodes`, {}, (response, hasError) => {
      const optionList = [];
      rootRoles = response.hierarchies;
      rootRoles.forEach(options => {
        const temp = { value: options.id, label: options.name, type: options.type };
        optionList.push(temp);
      });
      self.state.rootRoleOptns = optionList;
      self.loadHierrachyBasedOnPrivilages();
    },
      this.props.loadingFunction, { method: "GET", isShowSuccess: false, isProceedOnError: false });
  }


  validate = val => {
    if (val !== null && val !== "" && val !== undefined) {
      return true;
    } else {
      return false;
    }
  };

  fetchRolesDetails = values => {
    let roleEntities = [];
    var reqData = {
      userId: parseInt(this.props.userId),
      hierarchyId: parseInt(values.value),
      adminCheck: containAtleastOnePrivilage(this.props.privilages, this.props.roleHierarchyPrivilages, this.state.hierarchyCreatePrivilageTags) ? "1" : "0",
    };
    let self = this;
    this.props.ajaxUtil.sendRequest(`/user/v1/getChildRolesByUserId`, reqData, function (response, hasError) {
      let optionList = [];
      console.log("<><><><>" + JSON.stringify(response));
      roleEntities = response.responseObj;
      roleEntities.forEach(options => {
        const temp = { value: options.roleId, label: options.roleName, parentRoleIdInHierarchy: options.parentRoleIdInHierarchy, placeHolder: options.placeHolderRole };
        optionList.push(temp);
      });
      self.setState({ roleOptions: optionList });
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  };


  fetchUserDetails(values) {
    var reqData = {
      hierarchyId: this.state.hierarchyId,
      roleId: values.value,
      loginUserId: parseInt(this.props.userId)
    };
    let userEntities = [];
    let self = this;
    this.props.ajaxUtil.sendRequest(`user/v1/getParentUsers`, reqData, (response, hasError) => {
      const optionList = [];
      userEntities = response.allRoles;
      response.forEach(options => {
        const temp = { value: options.userId, label: options.firstName };
        optionList.push(temp);
      });
      self.setState({ reportingMgrOptions: optionList });
    },
      this.props.loadingFunction, { method: "POST", isShowSuccess: false, isProceedOnError: false });
  }



  fetchProductsAndDocsForDropDown = () => {
    this.props.ajaxUtil.sendRequest(
      `${this.props.globalConstants.GET_PRODUCTS_URL}`,
      {},
      (response, hasError) => {
        const productOptions = response.map(
          ({ productId, productName, type }) => ({
            label: productName,
            value: productId,
            type: type
          })
        );
        this.setState({ productOptions });
      },
      this.props.loadingFunction,
      { method: "GET", isShowSuccess: false, isProceedOnError: false }
    );

    this.props.ajaxUtil.sendRequest(
      `${this.props.url_DocType_List}`,
      {
        searchParams: {
          pageNumber: 1,
          rowCount: 20,
          orderByCol: "doccTypeId",
          sort: "asc",
          keyword: ""
        }
      },
      (response, hasError) => {
        const {
          searchResponse: { rowData = [] }
        } = response;
        this.setState({
          docTypeOptions: rowData.map(({ rowId, columnValues }) => ({
            label: columnValues[1].value,
            value: rowId
          }))
        });
      },
      this.props.loadingFunction,
      { method: "POST", isShowSuccess: false, isProceedOnError: false }
    );
  };


  toggleAction(type) {
    this.setState({ modal: type });
  }

  submitModal(name, value) {
    const items = [];
    value.forEach((item, index) => {
      items.push(item);
    });

    switch (name) {
      case "Locations":
        this.setState({
          territory: items,
          modal: 0
        });
        break;
      case "Entity":
        this.setState({
          entity: items,
          modal: 0
        });
        break;
      default:
        break;
    }
  }

  getBusinessBook = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest("businessBook/v1/getAllBusinessBooks", {}, response => {
      self.setState({ businessBookOptions: this.createSelectOptions(response.responseObj, "bookId", "name") })
    }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
  }

  getCallCenter = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest("commissioning/v1/getAllCallCenters", {}, response => {
      self.setState({ callCenterOptions: this.createSelectOptions(response.responseObj, "id", "name") })
    }, this.props.loadingFunction, { method: "POST", isAutoApiMsg: false, isShowSuccess: false });
  }


  handleChange(name, value, obj) {

    if (value !== null && value.value !== null) {
      if (name === "planTypes") {

        if (value.value === 1) {
          this.setState({ Options: this.state.callCenterOptions, toggle: 1 });

        }
        if (value.value === 2) {
          this.setState({ Options: this.state.businessBookOptions, toggle: 2 });
        }

      }
    }
    console.log("name>>>" + name);
    console.log("value>>>" + JSON.stringify(value));
    console.log("obj111>>>" + JSON.stringify(obj));
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      value = this.state[name];
    }
    const fields = this.state.fields;
    const validate = validateForm(name, value, FormElements[name], null, null);
    console.log("validate>>>" + validate);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: "" };
    }
    console.log("Erroe>>>" + JSON.stringify(fields));
    console.log("fields[name].hasError:::::::::" + fields[name].hasError);
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

    // alert(JSON.stringify(value));
    this.setState({ [name]: value, fields });
    switch (name) {
      case "systemRole":
        if (value.value === 1) {
          this.setState({ privilage: this.state.Admin, systemRole: value.value });
          break;
        }
        if (value.value === 2) {
          this.setState({ privilage: this.state.CSR, systemRole: value.value });
          break;
        }
        if (value.value === 3) {
          this.setState({ privilage: this.state.Manager, systemRole: value.value });
          break;
        }


      case "roleHierarchy":
        if (value) {
          this.fetchRolesDetails(value);
          this.setState({ hierarchyId: value.value, systemRole: value.value });
        }
        break;


      case "Role":
        if (value) {
          if (parseInt(value.parentRoleIdInHierarchy) < 0) {
            var obj = [
              {
                value: 1,
                label: "Admin"
              }
            ];
            this.setState({ reportingMgrOptions: obj, reportingToId: 1 });
          } else {
            this.setState({ reportingToId: 0 });
            this.fetchUserDetails(value);
          }
          this.setState({ roleId: value.value });
        }
        break;
      case "reportingTo":
        if (value) {
          this.setState({ reportingToId: value.value });
        }
        break;

      case "msisdn":
        var number = this.checkPhNumberFormat(value);
        this.setState({ [name]: number });
        break;

      case "telephone":
        var number = this.checkPhNumberFormat(value);
        this.setState({ [name]: number });
        break;

      case "userType": this.resetFormValues();
        break;


      default:
        this.setState({ [name]: value, fields });
        break;
    }
  }

  preValidate(name, value, field) {
    if (this.state.designation && this.state.designation.parentId !== 0) {
      if (this.state.isSalesPerson) {
        //territoryType and territory are mandatory
        if (
          (name === "territoryType" || name === "territory") &&
          (!value || _.size(value) === 0)
        )
          return {
            hasError: true,
            errorMsg:
              field.messages && field.messages.mandatory
                ? field.messages.mandatory
                : this.props.messagesUtil.MANDATORY
          };
      }
    } else {
      //reportingMgr - Not Mandatory
      if (name === "reportingMgr") return { hasError: false, errorMsg: "" };
    }
    if (
      this.props.match.params.type === "1" ||
      this.props.userChannelType.toString() === this.props.match.params.id
    ) {
      //entity - Not Mandatory
      if (name === "entity") return { hasError: false, errorMsg: "" };
    }
  }

  resetFormValues = () => {
    this.state.firstName = "";
    this.state.lastName = "";
    this.state.userName = "";
    this.state.emailId = "";
    this.state.msisdn = "";
    this.state.telephone = "";
    this.state.empId = "";
    this.state.organisationName = "",
      this.state.toggle = [],
      this.state.callCenterSelction = "",
      this.state.businessBookSelection = ""
  }

  onSubmitClick(currentTabId) {
    const request = this.getRequest();
    /*  var userTypeMap = { "3": "0", "4": "1" } 
     request.userType = userTypeMap[currentTabId]; */

    var self = this;

    this.props.ajaxUtil.sendRequest(`${this.props.url_User.CREATE_URL}`, request, (response, hasError) => {
      if (!hasError) this.setState({ isSuccess: true });
    }, this.props.loadingFunction, { isAutoApiMsg: true });

  }

  getRequest() {
    const items = [];

    /* console.log("============ bb ==========",this.state.callCenter);
    var callCenter = this.state.callCenter.id;
    var callCenter1 = this.state.callCenter.value;
    console.log("============ value ==========",callCenter);
    console.log("============ value1 ==========",callCenter1);
    return; */


    return {

      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userName: this.state.userName,
      msisdn: this.state.msisdn,
      telephone: this.state.telephone,
      email: this.state.emailId,
      empNumber: this.state.empId,
      systemRole: this.state.systemRole,
      parentId: this.state.userType.value === "2" ? "1" : this.state.reportingToId + "",
      roleId: this.state.roleId + "",
      hierarchyId: this.state.hierarchyId + "",
      typeOfUser: this.state.userType.value,


      //typeOfAdmin: this.state.userType.value === "2" ? this.state.adminType[0].value : "-1",
      typeOfAdmin: this.props.typeOfUser !== 2 ? this.state.adminType[0].value : "-1",
      organisationName: this.state.organisationName,

      address: {
        addressLine1: "abcd",
        addressLine2: "abcd",
        city: "abcd",
        region: "abcd",
        zip: "123456"
      },
      callCenterId: this.state.callCenter !== undefined ? this.state.callCenter.value : "",
      businessBookId: this.state.businessBook !== undefined ? this.state.businessBook.value : "",


    };
  }

  getselectedAdminTypes = () => {
    var types = [];
    for (var i = 0; i < this.state.adminType.length; i++) {
      types.push(parseInt(this.state.adminType[i].value));
    }
    return types;
  }

  checkPhNumberFormat = (value) => {
    if (value) {
      var number = value.replace(/[^\d]/g, "");
      if (number.length === 7) {
        number = number.replace(/(\d{3})(\d{4})/, "$1-$2");
      } else if (number.length === 10) {
        number = number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      }
    }
    return number;
  };



  onCancel() {
    this.setState({ isSuccess: true });
  }

  toggle(tab) {
    this.state.activeTab !== tab && this.setState({ activeTab: tab });
  }

  validateTab(currentTabId, nextTabId) {
    console.log("--------------- :currentTabId : ", currentTabId);
    console.log("--------------- :nextTabId : ", nextTabId);
    var isValidateFailed = false;
    var fields = [];
    const tabFieldMap = [
      [],
      ["firstName", "lastName", "userName", "msisdn ", "emailId", "telephone"/* ,"adminType" */],
      ["roleHierarchy", "Role"/* , "reportingTo" */, "region", "zipCode"],
    ];


    for (var j = 0; j < tabFieldMap[currentTabId - 1].length; j++) {
      var name = tabFieldMap[currentTabId - 1][j];
      const validate = validateForm(name, this.state[name], FormElements[name], null, null);
      fields[name] = validate;
      console.log(fields[name]);
      if (validate.hasError) {
        isValidateFailed = true;
      }

    }

    if (currentTabId === 2 && this.state.userType.value !== "4") {
      const validate = validateForm("empId", this.state["empId"], FormElements["empId"], null, null);
      fields["empId"] = validate;
      if (validate.hasError) {
        isValidateFailed = true;
      }
    }

    /*  if (currentTabId == 2 && this.state.userType.value == "2") { */
    if (currentTabId === 2 && this.props.typeOfUser !== 2) {
      const validate = validateForm("adminType", this.state["adminType"], FormElements["adminType"], null, null);
      fields["adminType"] = validate;
      if (validate.hasError) {
        isValidateFailed = true;
      }
    }

    if (currentTabId === 3 && this.state.reportingToId !== 1) {
      const validate = validateForm("reportingTo", this.state["reportingTo"], FormElements["reportingTo"], null, null);
      fields["reportingTo"] = validate;
      if (validate.hasError) {
        isValidateFailed = true;
      }
    }



    this.setState({ fields: fields });
    if (isValidateFailed) {
      this.props.setNotification({ message: this.props.messagesUtil.EMPTY_FIELD_MSG, hasError: true, timestamp: new Date().getTime() });
      return;
    }
    if (nextTabId === "submit") {
      this.onSubmitClick(currentTabId);
      return;
    }

    this.toggle(nextTabId);
  }

  validateProducts = products => {
    if (!products) return { hasError: false, errorMsg: "" };
    let error = {};
    for (let i = 0, len = products.length; i < len; i++) {
      let product = products[i];
      if (
        product.productId ||
        product.threshold ||
        product.msisdn ||
        product.simNo
      ) {
        if (!product.productId || !product.productId.value) {
          error.hasError = true;
          error.errorMsg = "Please select valid product for all products";
          return error;
        }
        if (!product.threshold) {
          error.hasError = true;
          error.errorMsg = "Please enter valid threshold for all products";
          return error;
        }
        if (!DECIMAL_REGEX.test(product.threshold)) {
          error.hasError = true;
          error.errorMsg = "Please enter valid threshold for all products";
          return error;
        }
        if (product.msisdn && !MSISDN_REGEX.test(product.msisdn)) {
          error.hasError = true;
          error.errorMsg =
            "Please enter valid msisdn with length 8-15 for all products";
          return error;
        }
      }
    }
    return { hasError: false, errorMsg: "" };
  };

  // functions for product

  addProductInput() {
    const products = [...this.state.products];
    products.push({ threshold: "", msisdn: "", simSerialNo: "" });
    this.setState({ products });
  }

  handleProductSelect(value, index) {
    const products = [...this.state.products];
    products[index].productId = value;
    this.setState({ products });
  }

  handleProductRemove(index) {
    const products = [...this.state.products];
    products.splice(index, 1);
    this.setState({ products });
  }

  handleProductInputChange(value, index, name) {
    const products = [...this.state.products];
    products[index][name] = value;
    this.setState({ products });
  }

  // =======================================

  // functions for documents

  addDocumentInput() {
    const documents = [...this.state.documents];
    documents.push({});
    this.setState({ documents });
  }

  handleDocTypeSelect(value, index) {
    const documents = [...this.state.documents];
    documents[index].docType = value;
    this.setState({ documents });
  }

  handleDocumentRemove(index) {
    const documents = [...this.state.documents];
    documents.splice(index, 1);
    this.setState({ documents });
  }

  handleDocumentDrop(files, index) {
    const documents = [...this.state.documents];
    documents[index].file = files[0];
    documents[index].docName = files[0].name;

    const fromData = new FormData();
    fromData.append("file", files[0]);
    fromData.append("fileName", files[0].name);
    this.props.ajaxUtil.sendRequest(
      `${this.props.url_User.FILE_STORE}`,
      fromData,
      response => {
        if (response) {
          documents[index].docId = response.docId;
        }
        this.setState({ documents });
      },
      null,
      { isShowSuccess: false, isShowFailure: false }
    );
  }

  // ======================================

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
        value: this.props.match.params.id
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


  getNextTabId = () => {
    console.log("userType : " + this.state.userType.value)
    switch (this.state.userType.value) {
      case "2": return "submit";
      case "3": return "3";
      case "4": return "3";
      default:
        break;
    }

  }



  render() {
    console.log("===================stste : ", this.state);
    const { ProductInput } = this.props;
    if (this.state.isSuccess) {
      return <Redirect to="/User" />;
    }

    const getReportingManager = () => {
      if (this.state.designation && this.state.designation.parentId !== 0) {
        return (
          <FieldItem
            {...FormElements.reportingMgr}
            value={this.state.reportingMgr}
            values={this.state.reportingMgrOptions}
            onChange={this.handleChange.bind(this, FormElements.reportingMgr.name)}
            touched={this.state.fields.reportingMgr && this.state.fields.reportingMgr.hasError}
            error={this.state.fields.reportingMgr && this.state.fields.reportingMgr.errorMsg}
            width="md"
          />
        );
      }
    };



    return (
      <div className="custom-container">
        <div className="container-fluid top-padding">
          <div className="form-tab wizardTab">
            <Nav tabs>


              <NavItem>
                <NavLink
                  className={classnames(
                    { active: this.state.activeTab === "1" },
                    { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("1") }, "rounded")}                >
                  User Type
                </NavLink>
              </NavItem>

              {this.state.userType.value === "2" || this.state.userType.value === "3" || this.state.userType.value === "4" ?
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: this.state.activeTab === "2" },
                      { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("2") }, "rounded")}                >
                    Personal Information
                </NavLink>
                </NavItem> : null}

              {this.state.userType.value === "3" || this.state.userType.value === "4" ?
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: this.state.activeTab === "3" },
                      { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("3") }, "rounded")}                >
                    User Association
                </NavLink>
                </NavItem> : null}

              {/*   {this.state.userType.value === "1" ?
                <NavItem>
                  <NavLink
                    className={classnames(
                      { active: this.state.activeTab === "4" },
                      { done: this.state.tabData.indexOf(this.state.activeTab) > this.state.tabData.indexOf("1") }, "rounded")}  >
                    Admin Personal Information
                </NavLink>
                </NavItem> : null} */}

            </Nav>
            <TabContent activeTab={this.state.activeTab} className="pt-3">


              <TabPane tabId="1">
                <div className="form-Brick-body">
                  <Row className="mx-0">
                    <FieldItem
                      {...UserTypeFormElements.userType}
                      value={this.state.userType}
                      values={this.state.userTypes}
                      onChange={this.handleChange.bind(this, UserTypeFormElements.userType.name)}
                    /* isWithoutValue={true} */
                    />
                  </Row>
                </div>
                <div>
                  <div style={{ height: "20px" }} />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Next"
                    isButtonGroup={true}
                    onClick={this.validateTab.bind(this, 1, "2")}
                  />

                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={this.onCancel.bind(this)}
                  />
                </div>
                <div style={{ height: "100px" }} />
              </TabPane>



              <TabPane tabId="2">
                <div className="form-Brick-body">
                  <Row className="mx-0">
                    <FieldItem
                      {...FormElements.firstName}
                      value={this.state.firstName}
                      onChange={this.handleChange.bind(this, FormElements.firstName.name)}
                      touched={this.state.fields.firstName && this.state.fields.firstName.hasError}
                      error={this.state.fields.firstName && this.state.fields.firstName.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...FormElements.lastName}
                      value={this.state.lastName}
                      onChange={this.handleChange.bind(this, FormElements.lastName.name)}
                      touched={this.state.fields.lastName && this.state.fields.lastName.hasError}
                      error={this.state.fields.lastName && this.state.fields.lastName.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...FormElements.userName}
                      value={this.state.userName}
                      onChange={this.handleChange.bind(this, FormElements.userName.name)}
                      touched={this.state.fields.userName && this.state.fields.userName.hasError}
                      error={this.state.fields.userName && this.state.fields.userName.errorMsg}
                      width="md"
                    />
                    {/* <FieldItem
                      {...FormElements.empCode}
                      value={this.state.empCode}
                      onChange={this.handleChange.bind(this, FormElements.empCode.name)}
                      touched={this.state.fields.empCode && this.state.fields.empCode.hasError}
                      error={this.state.fields.empCode && this.state.fields.empCode.errorMsg}
                      width="md" /> */}
                    <FieldItem
                      {...FormElements.msisdn}
                      value={this.state.msisdn}
                      onChange={this.handleChange.bind(this, FormElements.msisdn.name)}
                      touched={this.state.fields.msisdn && this.state.fields.msisdn.hasError}
                      error={this.state.fields.msisdn && this.state.fields.msisdn.errorMsg}
                      width="md"
                    />

                    <FieldItem
                      {...FormElements.telephone}
                      value={this.state.telephone}
                      onChange={this.handleChange.bind(this, FormElements.telephone.name)}
                      touched={this.state.fields.telephone && this.state.fields.telephone.hasError}
                      error={this.state.fields.telephone && this.state.fields.telephone.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...FormElements.emailId}
                      value={this.state.emailId}
                      onChange={this.handleChange.bind(this, FormElements.emailId.name)}
                      touched={this.state.fields.emailId && this.state.fields.emailId.hasError}
                      error={this.state.fields.emailId && this.state.fields.emailId.errorMsg}
                      width="md"
                    />

                    {this.state.userType.value !== "4" ?
                      <FieldItem
                        {...FormElements.empId}
                        value={this.state.empId}
                        onChange={this.handleChange.bind(this, FormElements.empId.name)}
                        touched={this.state.fields.empId && this.state.fields.empId.hasError}
                        error={this.state.fields.empId && this.state.fields.empId.errorMsg}
                        width="md"
                      /> : null}

                    {this.state.userType.value === "4" ?
                      <FieldItem
                        {...FormElements.organisationName}
                        value={this.state.organisationName}
                        onChange={this.handleChange.bind(this, FormElements.organisationName.name)}
                        touched={this.state.fields.organisationName && this.state.fields.organisationName.hasError}
                        error={this.state.fields.organisationName && this.state.fields.organisationName.errorMsg}
                        width="md"
                      /> : null}


                    {/*  {this.state.userType.value === "2" ? */}
                    {this.props.typeOfUser != 2 ?
                      <FieldItem
                        {...FormElements.adminType}
                        value={this.state.adminType}
                        values={this.state.adminTypeList}
                        onChange={this.handleChange.bind(this, FormElements.adminType.name)}
                        touched={this.state.fields.adminType && this.state.fields.adminType.hasError}
                        error={this.state.fields.adminType && this.state.fields.adminType.errorMsg}
                        width="md"
                      /> : null}

                  </Row>
                </div>
                <div>
                  <div style={{ height: "20px" }} />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label={this.state.userType.value === "2" ? "Create" : "Next"}
                    isButtonGroup={true}
                    onClick={this.validateTab.bind(this, 2, this.getNextTabId())}
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
                    onClick={this.onCancel.bind(this)}
                  />
                </div>
                <div style={{ height: "100px" }} />
              </TabPane>

              <TabPane tabId="3">
                <Row>
                  {/*  {this.props.userId == "1" ? ( */}
                  <FieldItem
                    {...FormElements.roleHierarchy}
                    value={this.state.roleHierarchy}
                    values={this.state.rootRoleOptns}
                    onChange={this.handleChange.bind(this, FormElements.roleHierarchy.name)}
                    touched={this.state.fields.roleHierarchy && this.state.fields.roleHierarchy.hasError}
                    error={this.state.fields.roleHierarchy && this.state.fields.roleHierarchy.errorMsg}
                    width="md"
                  />
                  {/*   ) : (
                      <FieldItem
                        {...FormElements.hierarchyName}
                        value={this.state.hierarchyName}
                        type={FIELD_TYPES.VIEW_DETAILS_BOX}
                        width="md"
                        placeholder=""
                      />
                    )} */}

                  <FieldItem
                    {...FormElements.Role}
                    value={this.state.Role}
                    values={this.state.roleOptions}
                    onChange={this.handleChange.bind(this, FormElements.Role.name)}
                    touched={this.state.fields.Role && this.state.fields.Role.hasError}
                    error={this.state.fields.Role && this.state.fields.Role.errorMsg}
                    width="md"
                  />
                  {this.state.reportingToId === 1 ? null : (
                    <FieldItem
                      {...FormElements.reportingTo}
                      value={this.state.reportingTo}
                      values={this.state.reportingMgrOptions}
                      onChange={this.handleChange.bind(this, FormElements.reportingTo.name)}
                      touched={this.state.fields.reportingTo && this.state.fields.reportingTo.hasError}
                      error={this.state.fields.reportingTo && this.state.fields.reportingTo.errorMsg}
                      width="md"
                    />
                  )}


                </Row>
                <Row>
                  {/* <FieldItem
                    {...FormElements.planTypes}
                    onChange={this.handleChange.bind(this, FormElements.planTypes.name)}
                    touched={false}
                    ismandatory={true}
                    value={this.state.toggle}
                    values={this.state.values}
                    isWithoutLabel={false}
                    isListedInput={false}
                    width="md"
                  /> */}
                  {/*  {this.state.toggle == 1 ? */}
                  <FieldItem
                    {...FormElements.callCenter}
                    values={this.state.callCenterOptions}
                    value={this.state.callCenter}
                    onChange={this.handleChange.bind(this, FormElements.callCenter.name)}
                    touched={this.state.fields.callCenter && this.state.fields.callCenter.hasError}
                    error={this.state.fields.callCenter && this.state.fields.callCenter.errorMsg}
                    width="md"
                  /> {/* : null} */}
                  {/*  {this.state.toggle == 2 ? */}
                  <FieldItem
                    {...FormElements.businessBook}
                    values={this.state.businessBookOptions}
                    value={this.state.businessBook}
                    onChange={this.handleChange.bind(this, FormElements.businessBook.name)}
                    touched={this.state.fields.businessBook && this.state.fields.businessBook.hasError}
                    error={this.state.fields.businessBook && this.state.fields.businessBook.errorMsg}
                    width="md"
                  /> {/* : null} */}


                </Row>
                <div>
                  <div style={{ height: "20px" }} />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Create"
                    isButtonGroup={true}
                    onClick={this.validateTab.bind(this, 3, "submit")}
                  />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Prev"
                    isButtonGroup={true}
                    onClick={() => { this.toggle("2"); }}
                  />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={this.onCancel.bind(this)}
                  />
                </div>
                <div style={{ height: "100px" }} />
              </TabPane>

              {/* <TabPane tabId="4">
                <div className="form-Brick-body">
                  <Row className="mx-0">
                    <FieldItem
                      {...AdminFormElements.firstName}
                      value={this.state.firstName}
                      onChange={this.handleChange.bind(this, AdminFormElements.firstName.name)}
                      touched={this.state.fields.firstName && this.state.fields.firstName.hasError}
                      error={this.state.fields.firstName && this.state.fields.firstName.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...AdminFormElements.lastName}
                      value={this.state.lastName}
                      onChange={this.handleChange.bind(this, AdminFormElements.lastName.name)}
                      touched={this.state.fields.lastName && this.state.fields.lastName.hasError}
                      error={this.state.fields.lastName && this.state.fields.lastName.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...AdminFormElements.emailId}
                      value={this.state.emailId}
                      onChange={this.handleChange.bind(this, AdminFormElements.emailId.name)}
                      touched={this.state.fields.emailId && this.state.fields.emailId.hasError}
                      error={this.state.fields.emailId && this.state.fields.emailId.errorMsg}
                      width="md"
                    />
                    <FieldItem
                      {...AdminFormElements.adminType}
                      value={this.state.adminType}
                      onChange={this.handleChange.bind(this, AdminFormElements.adminType.name)}
                      touched={this.state.fields.adminType && this.state.fields.adminType.hasError}
                      error={this.state.fields.adminType && this.state.fields.adminType.errorMsg}
                      width="md"
                      isWithoutValue={true}
                    />
                  </Row>
                </div>
                <div>
                  <div style={{ height: "20px" }} />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.LARGE}
                    align="right"
                    label="Create"
                    isButtonGroup={true}
                    onClick={this.validateTab.bind(this, 4, "submit")}
                  />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Prev"
                    isButtonGroup={true}
                    onClick={() => { this.toggle("1"); }}
                  />
                  <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.LARGE}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={this.onCancel.bind(this)}
                  />
                </div>
                <div style={{ height: "100px" }} />
              </TabPane> */}

            </TabContent>
          </div>
          {/*  <Popup
            type={POPUP_ALIGN.RIGHT}
            title={this.state.modalTitle}
            minWidth="25%"
            isView={false}
            isOpen={
              !this.state.isEntity &&
              this.state.modal === this.FORM_MODAL.Create
            }
            close={this.toggleAction}
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
                  this.state.isFieldAgent || this.state.isEntity ? true : false
                }
              />
            }
          /> */}
          {/*  <Popup
            type={POPUP_ALIGN.RIGHT}
            title={this.state.modalTitle}
            minWidth="25%"
            isView={false}
            isOpen={
              this.state.isEntity && this.state.modal === this.FORM_MODAL.Create
            }
            close={this.toggleAction}
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
        </div>
      </div>
    );
  }
}
