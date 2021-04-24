import { Component, default as React } from "react";
import { Redirect, Switch } from "react-router-dom";
import { Row } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import FieldItem from '../../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../../generic/fields/elements/formValidator/FormValidator';
import { checkForPrivilege } from "../util/util";
import { CREATE_HIERARCHY as FormElements } from "./FormElements";
import _ from "lodash";

class CreateHierarchy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      permissions: "",
      modules: [],
      isSuccess: 0,
      fields: [["hierarchyName"]],

      hierarchyName: "",
      parentRoleName: "",
      freeRootNodes: [],
      hierarchyId: "",
      optionList: [],
      hierarchyTypesCreateTags: ["createResidentialHierarchy", "createCommercialHierarchy", "createEmaHierarchy"],

      optionValues: {
        "createResidentialHierarchy": { value: "1", label: "Residential" },
        "createCommercialHierarchy": { value: "2", label: "Commercial" },
        "createEmaHierarchy": { value: "3", label: "EMA" }
      },

    };
  }



  /* setUserTypes = () => {
    if (this.props.userId === "1") {
      this.state.userTypes.push(this.getObjById("2"))
    } if (checkForPrivilege(this.props.privilages, 7010) || checkForPrivilege(this.props.privilages, 7011)) {
      this.state.userTypes.push(this.getObjById("3"))
    } if (checkForPrivilege(this.props.privilages, 7012)) {
      this.state.userTypes.push(this.getObjById("4"))
    }

  }

  getObjById = (id) => {
    for (var i = 0; i < UserTypeFormElements.userTypeOptions.length; i++) {
      if (UserTypeFormElements.userTypeOptions[i].value === id) {
        return UserTypeFormElements.userTypeOptions[i];
      }
    }
  } */


  
  componentDidMount() {
    this.setHierarchyTypeOptions();
    this.props.setHeader("Create Hierarchy");
    var self = this;
    this.props.ajaxUtil.sendRequest(
      this.props.const_SalesHierarchy.GET_ROLE_ROOT_NODES,
      {},
      response => {
        console.log("free nodes list : ", response);
        if (!response) {
          this.props.setNotification({
            message: "Failed to load modules",
            hasError: true,
            timestamp: new Date().getTime()
          });
        } else {
          if (response.roleRootList && response.roleRootList.length === 0) {
            this.props.setNotification({
              message: "Role Root Nodes Are Not Available",
              hasError: true,
              timestamp: new Date().getTime()
            });
            this.goto("2");
          }

          self.setState({
            freeRootNodes: self.createSelectOptions(
              response.roleRootList,
              "id",
              "name"
            )
          });
        }
      },
      this.props.loadingFunction,
      { method: "GET", isShowSuccess: false }
    );
  }


  setHierarchyTypeOptions = () => {
    console.log("--------------------this.statehierarchyTypesCreateTags : ", this.state.hierarchyTypesCreateTags);
    console.log("--------------------this.props.privilages : ", this.props.privilages);
    console.log("-------------------- this.props.menuPrivilages : ", this.props.menuPrivilages);
    console.log("--------------------this.state.optionValues : ", this.state.optionValues);
    for (var i = 0; i < this.state.hierarchyTypesCreateTags.length; i++)
      if (checkForPrivilege(this.props.privilages, this.props.menuPrivilages[this.state.hierarchyTypesCreateTags[i]])) {
        this.state.optionList.push(this.state.optionValues[this.state.hierarchyTypesCreateTags[i]]);
      }
  }


  handleChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      value = this.state[name];
    } else if (name != null && name != undefined && name != "") {
      this.setState({ [name]: value });
    }

    if (isTouched) {
      value = this.state[name];
    }
    const fields = this.state.fields;
    const validate = validateForm(name, value, FormElements[name], null, null);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: "" };
    }
    this.setState({ [name]: value, fields });
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
  };

  goto = val => {
    this.setState({ isSuccess: val });
  };

  onSubmit = () => {
    const preValidate = (name, value, field) => {
      if (name === "roleId") return { hasError: false, errorMsg: "" };
    };
    let hasError = false;
    const fields = this.state.fields;
    const that = this;
    _.forEach(FormElements, function (value, name) {
      const validate = validateForm(
        name,
        that.state[name],
        FormElements[name],
        preValidate,
        null
      );
      console.log("VALIDATE", name, validate);
      if (validate) {
        if (hasError === false) hasError = validate.hasError;
        fields[name] = validate;
      } else {
        fields[name] = { hasError: false, errorMsg: "" };
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

    var reqData = {
      name: this.state.hierarchyName,
      rootNodeId: this.state.parentRoleName.value,
      userId: this.props.userId,
      typeOfHierarchy: this.state.hierarchyType.value
    };

    console.log("Sublmit Request : ", reqData);
    var self = this;
    this.props.ajaxUtil.sendRequest(
      this.props.const_SalesHierarchy.CREATE_HIERARCHY_URL,
      reqData,
      (response, hasError) => {
        console.log("free nodes list : ", response);
        if (!hasError) {
          this.state.hierarchyId = response.responseObj.id;
          self.goto("1");
        }
      },
      this.props.loadingFunction,
      { method: "POST", isShowSuccess: false, isAutoApiMsg: true }
    );
  };

  render() {
    if (this.state.isSuccess === "1") {
      const treeUrl = `/roleHierarchies/tree/${this.state.hierarchyId}/edit`;
      return (
        <Switch>
          <Redirect to={treeUrl} />
        </Switch>
      );
    }

    if (this.state.isSuccess === "2") {
      const treeUrl = `/roleHierarchyMain`;
      return (
        <Switch>
          <Redirect to={treeUrl} />
        </Switch>
      );
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Hierarchy Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.hierarchyName}
                value={this.state.hierarchyName}
                onChange={this.handleChange.bind(this, FormElements.hierarchyName.name)}
                touched={this.state.fields.hierarchyName && this.state.fields.hierarchyName.hasError}
                error={this.state.fields.hierarchyName && this.state.fields.hierarchyName.errorMsg}
                ismandatory={true}
                width="md"
              />
              <FieldItem
                {...FormElements.parentRoleName}
                value={this.state.parentRoleName}
                values={this.state.freeRootNodes}
                onChange={this.handleChange.bind(this, FormElements.parentRoleName.name)}
                touched={this.state.fields.parentRoleName && this.state.fields.parentRoleName.hasError}
                error={this.state.fields.parentRoleName && this.state.fields.parentRoleName.errorMsg}
                ismandatory={true}
                width="md"
              />


              <FieldItem
                {...FormElements.hierarchyType}
                value={this.state.hierarchyType}
                values={this.state.optionList}
                onChange={this.handleChange.bind(this, FormElements.hierarchyType.name)}
              />
            </Row>
          </div>
        </div>
        <div className="container-fluid">
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Create & Continue"
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
export default CreateHierarchy;
