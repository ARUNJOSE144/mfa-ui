import _ from 'lodash';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Col, Container, Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import Permissions from './Permissions';
import { ROLES as FormElements } from './util/FormElements';


export default class CreateRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: '',
      modules: [],
      isSuccess: false,
      fields: {},
      files: [],
    };
    /*  this.getRequest = this.getRequest.bind(this);
     this.handleSwitch = this.handleSwitch.bind(this);
     this.getPermissions = this.getPermissions.bind(this);
     this.handleDropDownChange = this.handleDropDownChange.bind(this); */
    this.props.setHeader("Create Question");
  }





  handleChange(name, value, obj) {
    console.log("name----value----obj---", name, value, obj);
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
    /*   const fields = this.state.fields;
      const that = this;
      _.forEach(FormElements, function (value, name) {
        const validate = validateForm(name, that.state[name], FormElements[name], preValidate, null);
        if (validate) {
          if (hasError === false) hasError = validate.hasError;
          fields[name] = validate;
        } else {
          fields[name] = { hasError: false, errorMsg: '' };
        }
      });
      this.setState({ fields }); */

    if (hasError === true) {
      this.props.setNotification({
        message: this.props.messagesUtil.EMPTY_FIELD_MSG,
        hasError: true,
        timestamp: new Date().getTime()
      });
      console.log("----Role mngt state change : ", this.state);
      return false;
    }
    const request = this.getRequest();
    /*  var self = this;
     this.props.ajaxUtil.sendRequest(this.props.url_Roles.CREATE_URL, request, function (resp, hasError) {
 
       if (resp && !hasError) {
         self.props.setNotification({ message: "Role Created Successfully", hasError: false });
         self.setState({ isSuccess: true });
       } else {
         self.props.setNotification({ message: resp.responseMsg, hasError: true });
       }
     }, this.props.loadingFunction, { isProceedOnError: true, isShowSuccess: false, isShowFailure: false }); */

    this.props.ajaxUtil.sendRequest("/question/v1/create", request, (response, hasError) => {
      if (!hasError)
        this.setState({ isSuccess: true })
    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }


  getRequest() {



    var formData = new FormData();
    formData.append('name', this.state.questionName);
    formData.append('key', this.state.questionKey);
    formData.append('question', this.state.question);
    formData.append('answer', this.state.answer);
    //formData.append('files', files)

    for (var i = 0; i < this.state.files.length; i++) {
      formData.append('file' + parseInt(i + 1), this.state.files[i].img)
    }

    return formData;
    /*  return {
       "name": this.state.questionName,
       "key": this.state.questionKey,
       "question": this.state.question,
       "answer": this.state.answer,
     } */
  }


  onCancel() {
    this.setState({ isSuccess: true });
  }

  onFileChange = (e) => {
    var newImg = {}
    newImg.img = e.target.files[0];
    newImg.url = URL.createObjectURL(newImg.img);
    this.state.files.push(newImg);
    this.forceUpdate();
  }


  renderImages = () => {
    return (
      <React.Fragment>
        {this.state.files.map((file, i) => (
          <div className="col-md-3">
            <img src={file.url} style={{ width: 100 }}></img>
            <span aria-hidden="true" style={{ right: 30, position: "absolute", }} className=" default-segment-ModalCloseIcon my-2" onClick={() => this.resetImage("smallImg")}>
              &times;
            </span>
          </div>
        ))}
      </React.Fragment>
    );
  }



  render() {

    console.log("Create questions : ", this.state)
    if (this.state.isSuccess) {
      return <Redirect to="/Questions" />;
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Question Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.questionName}
                value={this.state.questionName}
                onChange={this.handleChange.bind(this, FormElements.questionName.name)}
                touched={this.state.fields.questionName && this.state.fields.questionName.hasError}
                error={this.state.fields.questionName && this.state.fields.questionName.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.questionKey}
                value={this.state.questionKey}
                onChange={this.handleChange.bind(this, FormElements.questionKey.name)}
                touched={this.state.fields.questionKey && this.state.fields.questionKey.hasError}
                error={this.state.fields.questionKey && this.state.fields.questionKey.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.question}
                value={this.state.question}
                onChange={this.handleChange.bind(this, FormElements.question.name)}
                touched={this.state.fields.question && this.state.fields.question.hasError}
                error={this.state.fields.question && this.state.fields.question.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.answer}
                value={this.state.answer}
                onChange={this.handleChange.bind(this, FormElements.answer.name)}
                touched={this.state.fields.answer && this.state.fields.answer.hasError}
                error={this.state.fields.answer && this.state.fields.answer.errorMsg}
                width="md"
              />

              <input type="file" onChange={(e) => this.onFileChange(e)} />

              {this.renderImages()}



            </Row>
          </div>
        </div>


        <div className="container-fluid">
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
            label="Cancel"
            isButtonGroup={true}
            onClick={this.onCancel.bind(this)}
          />
        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    );
  }

}
