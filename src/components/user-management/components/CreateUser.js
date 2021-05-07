import _ from 'lodash';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import { getSelectOptions } from '../../home/Utils';
import { USERS as FormElements } from './util/FormElements';


export default class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSuccess: false,
      roles: [],
      fields: {}
    };

    this.props.setHeader("User");
  }

  componentDidMount() {
    this.getRoles();
  }



  handleChange = (name, value, obj) => {
    console.log("name", name);
    console.log("value", value);
    console.log("obj", obj);
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


  getRoles = () => {
    var self = this;
    this.props.ajaxUtil.sendRequest("/role/v1/getAllRoles", "", (response, hasError) => {
      if (!hasError) {
        self.setState({ roles: getSelectOptions(response.list, "roleId", "roleName") })
      }
    }, this.props.loadingFunction, { method: "GET", isShowSuccess: false });
  }



  onSubmitClick = () => {
    let hasError = false;
    const fields = this.state.fields;
    const that = this;
    _.forEach(FormElements, function (value, name) {
      const validate = validateForm(name, that.state[name], FormElements[name], "", null);
      if (validate) {
        if (hasError === false) hasError = validate.hasError;
        fields[name] = validate;
      } else {
        fields[name] = { hasError: false, errorMsg: '' };
      }
    });
    console.log("===========Validated Fied Obj : ", fields);
    this.setState({ fields });


    if (hasError === true) {
      this.props.setNotification({ message: this.props.messagesUtil.EMPTY_FIELD_MSG, hasError: true, timestamp: new Date().getTime() });
      console.log("----User mngt state change : ", this.state);
      return false;
    }
    const request = this.getRequest();
    this.props.ajaxUtil.sendRequest("/user/v1/create", request, (response, hasError) => {
      if (!hasError)
        this.setState({ isSuccess: true })
    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }



  getRequest = () => {
    return {
      "userName": this.state.userName,
      "name": this.state.name,
      "emailId": this.state.emailId,
      "contactNumber": this.state.contactNumber,
      "roleId": this.state.role.value
    }
  }



  onCancel = () => {
    this.setState({ isSuccess: true });
  }


  render() {
    if (this.state.isSuccess) {
      return <Redirect to="/User" />;
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>User Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.name}
                value={this.state.name}
                onChange={this.handleChange.bind(this, FormElements.name.name)}
                touched={this.state.fields.name && this.state.fields.name.hasError}
                error={this.state.fields.name && this.state.fields.name.errorMsg}
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
              <FieldItem
                {...FormElements.emailId}
                value={this.state.emailId}
                onChange={this.handleChange.bind(this, FormElements.emailId.name)}
                touched={this.state.fields.emailId && this.state.fields.emailId.hasError}
                error={this.state.fields.emailId && this.state.fields.emailId.errorMsg}
                width="md"
              />
              <FieldItem
                {...FormElements.contactNumber}
                value={this.state.contactNumber}
                onChange={this.handleChange.bind(this, FormElements.contactNumber.name)}
                touched={this.state.fields.contactNumber && this.state.fields.contactNumber.hasError}
                error={this.state.fields.contactNumber && this.state.fields.contactNumber.errorMsg}
                width="md"
              />
              <FieldItem
                {...FormElements.role}
                value={this.state.role}
                values={this.state.roles}
                onChange={this.handleChange.bind(this, FormElements.role.name)}
                touched={this.state.fields.role && this.state.fields.role.hasError}
                error={this.state.fields.role && this.state.fields.role.errorMsg}
                width="md"
              />
            </Row>
          </div>
        </div>

        <div className="form-Brick">
        </div>
        <div className="container-fluid">
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label="Create"
            isButtonGroup={true}
            onClick={this.onSubmitClick}
          />
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.SECONDARY}
            size={BUTTON_SIZE.LARGE}
            color={COLOR.PRIMARY}
            align="right"
            label="Cancel"
            isButtonGroup={true}
            onClick={this.onCancel}
          />
        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    );
  }

}
