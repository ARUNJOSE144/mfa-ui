import _ from "lodash";
import { Component, default as React } from 'react';
import { Redirect, Switch } from "react-router-dom";
import { Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import { USER_PRIVILAGE_HIERARCHY_MAPPING as privilageHierarchyMapping, USER_REASSIGN as FormElements } from './util/FormElements';
import { checkForPrivilege } from './util/util';
export default class UserReassign extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: '',
      modules: [],
      isSuccess: 0,
      fields: [[
        '',
      ]
      ],
      hierarchyList: [],
      hierarchy: null,

      childRoleList: [],
      role: null,

      userList: [],
      user: null,

      reportingUsersList: [],
      reportingUsers: null,

      reportToList: [],
      reportTo: null,

      userId: "1",
      hierarchyName: "",
      userCreatePrivilageTags: ["createResidentialUser", "createCommericialUser", "createEMAUser"]
    };
  }

  componentDidMount() {
    this.props.setHeader("User Reassigning");
    this.getAllHierarcyies();
    if (this.state.userId !== "1") {
      this.getUserHierarchyDetails(this.state.userId);
    }
  }


  //filtering the hierarchy create list based on the privilages
  loadHierrachyBasedOnPrivilages = () => {
    var privilagedCategories = [];
    console.log("---------this.state.userCreatePrivilageTags", this.state.userCreatePrivilageTags);
    console.log("---------this.props.privilages", this.props.privilages);
    console.log("---------privilageHierarchyMapping", privilageHierarchyMapping);
    console.log("---------this.state.hierarchyList", this.state.hierarchyList);



    for (var i = 0; i < this.state.userCreatePrivilageTags.length; i++) {
      var pervTag = this.state.userCreatePrivilageTags[i];
      if (checkForPrivilege(this.props.privilages, this.props.menuPrivilages[pervTag])) {
        var categoryId = privilageHierarchyMapping[this.props.menuPrivilages[pervTag]]
        for (var j = 0; j < this.state.hierarchyList.length; j++) {
          var cat = this.state.hierarchyList[j];
          if (cat.type === categoryId) {
            privilagedCategories.push(cat);
          }
        }
      }
    }
    console.log("---------privilagedCategories", privilagedCategories);


    this.setState({ hierarchyList: privilagedCategories })
  }


  getUserHierarchyDetails = (userId) => {
    var reqData = { "userId": userId }
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_HIERARCHY_ID_FROM_USER_ID, reqData, (response) => {
      console.log("GET_HIERARCHY_ID_FROM_USER_ID : ", response);
      if (response && this.validate(response.responseObj) && this.validate(response.responseObj.hierarchyId)) {
        var hierarchy = {};
        hierarchy.value = response.responseObj.hierarchyId;
        hierarchy.label = response.responseObj.hierarchy;
        self.setState({ hierarchy: hierarchy, hierarchyName: response.responseObj.hierarchy });

        this.getChildRole();
      } else {
        alert("No heirarchy selected for the user ");
      }
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
  }


  getAllHierarcyies = () => {
    var self = this;
    var reqData = { "userId": this.props.userId }
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_HIERARCHY_LIST_WITH_TYPE, {}, (response) => {
      console.log("getAllHierarcyies : ", response);
      

      var rootRoles = response.hierarchies;
      var optionList=[];
      rootRoles.forEach(options => {
        const temp = { value: options.id, label: options.name, type: options.type };
        optionList.push(temp);
      });
      /* self.state.rootRoleOptns = optionList;
      self.loadHierrachyBasedOnPrivilages();
 */


      self.state.hierarchyList = optionList;
      self.loadHierrachyBasedOnPrivilages();



      //self.setState({ hierarchyList: this.createSelectOptions(response.hierarchyList, "id", "name") });
    }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false });
  }

  getChildRole = () => {
    var self = this;
    var reqData = this.getCommonRequest();
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_CHILD_ROLES, reqData, (response) => {
      console.log("childRoleList : ", response);
      self.setState({ childRoleList: this.createSelectOptions(response.responseObj, "roleId", "roleName") });
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
  }

  getUserListByRole = () => {
    var self = this;
    var reqData = this.getCommonRequest();
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_USERS_BY_ROLE_ID, reqData, (response) => {
      self.setState({ userList: this.createSelectOptions(response.responseObj, "userId", "username") });
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
  }

  getReportingUsers = () => {
    var self = this;
    var reqData = this.getCommonRequest();
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_REPORTING_USERS, reqData, (response) => {
      //console.log("----------Response for GET_REPORTING_USERS : ",response);
      self.setState({ reportingUsersList: this.createSelectOptions(response.responseObj, "userId", "username") });
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
  }

  getReportingToUsers = () => {
    var result = [];
    for (var i = 0; i < this.state.userList.length; i++) {
      var user = this.state.userList[i];
      if (user.value !== this.state.user.value)
        result.push(user);
    }
    console.log("item  removed : ", result);
    this.setState({ reportToList: result });
  }



  handleChange(name, value, obj) {

    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      value = this.state[name];
    }
    else if (name != null && name != undefined && name != "") {
      //this.setState({ [name]: value });
      this.state[name] = value;
    }

    if (isTouched) {
      value = this.state[name];
    }
    const fields = this.state.fields;
    const validate = validateForm(name, value, FormElements[name], null, null);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: '' };
    }
    this.setState({ [name]: value, fields });


    if (!isTouched) {
      console.log("clicked     --------  name : ", name);
      /* var emptyOption = { label: "", value: "" }; */
      switch (name) {
        case "hierarchy":
          this.state.childRoleList = [];
          this.state.role = null;
          this.state.userList = [];
          this.state.user = null;
          this.state.reportingUsersList = [];
          this.state.reportingUsers = [];
          this.state.reportToList = [];
          this.state.reportTo = null;
          this.getChildRole();
          break;

        case "role":
          this.state.userList = [];
          this.state.user = null;
          this.state.reportingUsersList = [];
          this.state.reportingUsers = [];
          this.state.reportToList = [];
          this.state.reportTo = null;
          this.getUserListByRole();
          break;
        case "user":
          this.state.reportingUsersList = [];
          this.state.reportingUsers = [];
          this.state.reportToList = [];
          this.state.reportTo = null;
          this.getReportingUsers();
          break;
        case "reportingUsers":
          this.state.reportToList = [];
          this.state.reportTo = null;
          this.getReportingToUsers();
          break;
      }
    }


  }

  getCommonRequest = () => {
    var commonReq = {};
    if (this.validate(this.props.userId))
      commonReq["userId"] = this.props.userId
    if (this.validate(this.state.hierarchy))
      commonReq["hierarchyId"] = this.state.hierarchy.value;
    if (this.validate(this.state.role))
      commonReq["roleId"] = this.state.role.value;

    if (this.validate(this.state.user))
      commonReq["currentParentId"] = this.state.user.value;

    if (this.validate(this.state.reportingUsers)) {
      var list = [];
      for (var i = 0; i < this.state.reportingUsers.length; i++) {
        list.push(this.state.reportingUsers[i].value)
      } commonReq["userList"] = list;
    }

    if (this.validate(this.state.reportTo))
      commonReq["newParentId"] = this.state.reportTo.value;

    return commonReq;
  }



  validate = (val) => {
    if (val !== null && val !== "" && val !== undefined) {
      return true;
    } else {
      return false;
    }
  }



  createSelectOptions = (data, key, value) => {
    var options = [];
    for (var i = 0; i < data.length; i++) {
      var opt = {};
      opt.value = data[i][key];
      opt.label = data[i][value];
      options.push(opt);
    }
    return options;
  }

  goto = (val) => {
    this.setState({ isSuccess: val });
  }

  onSubmit = () => {
    const preValidate = (name, value, field) => {
      if (name === 'roleId')
        return { hasError: false, errorMsg: '' };
    }
    let hasError = false;
    const fields = this.state.fields;
    const that = this;
    _.forEach(FormElements, function (value, name) {
      const validate = validateForm(name, that.state[name], FormElements[name], preValidate, null);
      console.log("VALIDATE", name, validate);
      if (validate) {
        if (hasError === false) hasError = validate.hasError;
        fields[name] = validate;
      } else {
        fields[name] = { hasError: false, errorMsg: '' };
      }
    });
    console.log("prrrrps : ", this.props);
    this.setState({ fields });
    if (hasError === true) {
      this.props.setNotification({
        message: this.props.messagesUtil.EMPTY_FIELD_MSG,
        hasError: true,
        timestamp: new Date().getTime()
      });
      return false;
    }



    var reqData = this.getCommonRequest();
    console.log("Final Request for Reassigning -------", reqData);

    console.log("Sublmit Request : ", reqData);
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.REASSIGN_USERS, reqData, (response) => {
      console.log("free nodes list : ", response);
      if (!response) {
        self.props.setNotification({
          message: "Failed to load modules",
          hasError: true,
          timestamp: new Date().getTime()
        });
      } else {
        // this.state.hierarchyId = response.responseObj.id;
        self.goto("2");
      }
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: true });
  }




  render() {

    if (this.state.isSuccess === "2") {
      const url = `/User`;
      return (
        <Switch>
          <Redirect to={url} />
        </Switch>
      );
    }

    console.log("Latest State : ", this.state);

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">


              {this.state.userId === "1" ?
                <FieldItem
                  {...FormElements.hierarchy}
                  value={this.state.hierarchy}
                  values={this.state.hierarchyList}
                  onChange={this.handleChange.bind(this, FormElements.hierarchy.name)}
                  touched={this.state.fields.hierarchy && this.state.fields.hierarchy.hasError}
                  error={this.state.fields.hierarchy && this.state.fields.hierarchy.errorMsg}
                  ismandatory={true}
                  width="md"
                  disabled={true}
                />
                : <FieldItem
                  {...FormElements.hierarchyTextBox}
                  value={this.state.hierarchyName}
                  onChange={this.handleChange.bind(this, FormElements.hierarchyTextBox.name)}
                  touched={this.state.fields.hierarchyTextBox && this.state.fields.hierarchyTextBox.hasError}
                  error={this.state.fields.hierarchyTextBox && this.state.fields.hierarchyTextBox.errorMsg}
                  ismandatory={true}
                  width="md"
                  disabled={true}
                />}

              <FieldItem
                {...FormElements.role}
                value={this.state.role}
                values={this.state.childRoleList}
                onChange={this.handleChange.bind(this, FormElements.role.name)}
                touched={this.state.fields.role && this.state.fields.role.hasError}
                error={this.state.fields.role && this.state.fields.role.errorMsg}
                ismandatory={true}
                width="md" />

              <FieldItem
                {...FormElements.user}
                value={this.state.user}
                values={this.state.userList}
                onChange={this.handleChange.bind(this, FormElements.user.name)}
                touched={this.state.fields.user && this.state.fields.user.hasError}
                error={this.state.fields.user && this.state.fields.user.errorMsg}
                ismandatory={true}
                width="md" />

              <FieldItem
                {...FormElements.reportingUsers}
                value={this.state.reportingUsers}
                values={this.state.reportingUsersList}
                onChange={this.handleChange.bind(this, FormElements.reportingUsers.name)}
                touched={this.state.fields.reportingUsers && this.state.fields.reportingUsers.hasError}
                error={this.state.fields.reportingUsers && this.state.fields.reportingUsers.errorMsg}
                ismandatory={true}
                width="md" />

              <FieldItem
                {...FormElements.reportTo}
                value={this.state.reportTo}
                values={this.state.reportToList}
                onChange={this.handleChange.bind(this, FormElements.reportTo.name)}
                touched={this.state.fields.reportTo && this.state.fields.reportTo.hasError}
                error={this.state.fields.reportTo && this.state.fields.reportTo.errorMsg}
                ismandatory={true}
                width="md" />
            </Row>
          </div>
        </div>


        <div className="container-fluid">
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Reassign"
            isButtonGroup={true}
            onClick={this.onSubmit}
          />
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.SECONDARY}
            size={BUTTON_SIZE.LARGE}
            color={COLOR.PRIMARY}
            align="right"
            label="Cancel"
            isButtonGroup={true}
            onClick={() => this.goto("2")}
          />
        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    );
  }

}
