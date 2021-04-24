import _ from "lodash";
import { Component, default as React } from "react";
import { Row } from "reactstrap";
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import FieldItem from '../../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../../generic/fields/elements/formValidator/FormValidator';
import { CommissionUserAttachmnet as FormElements } from "./FormElements";
//const moment = require('moment');





class AttachSystemRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
      user: "",
      systemRole: "",
      systemRoleList: [],
      userList: [],

    };
  }


  componentDidMount() {
    this.getUers();
    this.getSystemRoles();
  }

  getUers = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest(this.props.url_commission.GET_COMMISSION_AGENTS, {}, response => {
      self.state.userList = self.createSelectOptions(response.responseObj, "userId", "userName");
      self.forceUpdate();
    }, this.props.loadingFunction, { method: "GET", isShowSuccess: false });
  }


  getSystemRoles = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest('role/v1/getAllSystemRoles', {}, response => {
      self.state.systemRoleList = self.createSelectOptions(response.roleMasterList, "roleId", "roleName");
      self.forceUpdate();
    }, this.props.loadingFunction, { method: "POST", isShowSuccess: false });
  }


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


  validate = (val) => {
    if (val !== null && val !== undefined && val !== "")
      return true;
    else return false;
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


  onSubmitClick() {
    const preValidate = (name, value, field) => {
      if (name === 'roleId')
        return { hasError: false, errorMsg: '' };
    }
    let hasError = false;
    const fields = this.state.fields;
    const that = this;
    _.forEach(FormElements, function (value, name) {
      const validate = validateForm(name, that.state[name], FormElements[name], null, null);
      if (validate) {
        if (hasError === false) hasError = validate.hasError;
        fields[name] = validate;
      } else {
        fields[name] = { hasError: false, errorMsg: '' };
      }
    });
    this.setState({ fields });

    if (hasError === true) {
      this.props.setNotification({ message: this.props.messagesUtil.EMPTY_FIELD_MSG, hasError: true, timestamp: new Date().getTime() });
      return false;
    }

    var request = {};
    request.userId = this.state.user.value;
    request.roleId = this.state.systemRole.value;

    var self = this;
    this.props.ajaxUtil.sendRequest('/role/v1/attachSystemRoleToUser', request, (response, hasError) => {
      if (!hasError)
        this.setState({ isSuccess: true })
      this.ResetData();
    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }

  ResetData = () => {
    this.setState({ user: null, systemRole: null });
  }
  render() {
    console.log("user attaching state : ", this.state);
    return (
      <div className="custom-container sdfsdfsd">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Attach System Role</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">

              <FieldItem
                {...FormElements.user}
                values={this.state.userList}
                value={this.state.user}
                onChange={this.handleChange.bind(this, "user")}
                touched={this.state.fields.user && this.state.fields.user.hasError}
                error={this.state.fields.user && this.state.fields.user.errorMsg}
                ismandatory={true}
                width="md"
              />
              <FieldItem
                {...FormElements.systemRole}
                values={this.state.systemRoleList}
                value={this.state.systemRole}
                onChange={this.handleChange.bind(this, "systemRole")}
                touched={this.state.fields.systemRole && this.state.fields.systemRole.hasError}
                error={this.state.fields.systemRole && this.state.fields.systemRole.errorMsg}
                ismandatory={true}
                width="md"
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
            label="Attach"
            isButtonGroup={true}
            onClick={() => this.onSubmitClick()}
          />
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Reset"
            isButtonGroup={true}
            onClick={() => this.ResetData()}
          />

        </div>
      </div>
    );
  }
}
export default AttachSystemRole;
