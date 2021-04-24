import _ from "lodash";
import React, { Component } from "react";
import { Row } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import FieldItem from '../../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';
import { validateForm } from '../../../generic/fields/elements/formValidator/FormValidator';
import { ROLES as FormElements } from './FormElements';
const modules = [];

export default class EditRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roleManagementRoleName: this.props.selectedRecord.roleName,
      roleManagementRoleDesc: this.props.selectedRecord.roleDesc,
      isSuccess: false,
      fields: {}
    };

  }


  handleChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
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
  }

  createCheck(response, hasError) {
    if (!hasError) {
      this.setState({ isSuccess: true });
    }
  }

  EditRole = () => {

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
    let request = {};
    request.roleId = this.props.selectedRecord.roleId;
    request.roleName = this.state.roleManagementRoleName;
    request.roleDesc = this.state.roleManagementRoleDesc;
    this.props.ajaxUtil.sendRequest(`${this.props.url_Roles.UPDATE_URL}`, request, (response, hasError) => {
      //console.log("-----------------data--------------------" + this.props.const_Commission.ATTACH_USERS);
      if (!hasError) {
        this.setState({ isSuccess: true });
        this.props.closeRole();
        this.props.reloadTable();
      }

    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }


  render() {
    console.log("venky", this.props.type)

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Role Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.roleManagementRoleName}
                value={this.state.roleManagementRoleName}
                onChange={this.handleChange.bind(this, FormElements.roleManagementRoleName.name)}
                touched={this.state.fields.roleManagementRoleName && this.state.fields.roleManagementRoleName.hasError}
                error={this.state.fields.roleManagementRoleName && this.state.fields.roleManagementRoleName.errorMsg}
                type={this.props.type == 3 ? FIELD_TYPES.TEXT :FIELD_TYPES.TEXT_BOX_DISABLED}
              />
              <FieldItem
                {...FormElements.roleManagementRoleDesc}
                value={this.state.roleManagementRoleDesc}
                onChange={this.handleChange.bind(this, FormElements.roleManagementRoleDesc.name)}
                touched={this.state.fields.roleManagementRoleDesc && this.state.fields.roleManagementRoleDesc.hasError}
                error={this.state.fields.roleManagementRoleDesc && this.state.fields.roleManagementRoleDesc.errorMsg}
                type={this.props.type == 3 ? FIELD_TYPES.TEXT :FIELD_TYPES.TEXT_BOX_DISABLED}
              />
            </Row>
          </div>
        </div>

        <div className="container-fluid">
          {this.props.type === 3 ? <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Update"
            isButtonGroup={true}
            onClick={() => this.EditRole()}
          /> : null}
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.SECONDARY}
            size={BUTTON_SIZE.LARGE}
            color={COLOR.PRIMARY}
            align="right"
            label="Cancel"
            isButtonGroup={true}
            onClick={() => this.props.closeRole()}
          />
        </div>
        <div
          style={{
            height: "100px"
          }}
        />
      </div>
    );
  }
}
