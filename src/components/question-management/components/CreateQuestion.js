import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
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
      questionFromArray: [{ label: "Others ", value: "1" }, { label: "Chegg", value: "2" }, { label: "Bartleby ", value: "3" }],
      questionFrom: { label: "Others ", value: "1" },
    };
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

  check = (obj, flag) => {
    if (obj.hasError)
      flag.hasError = true;
    return obj;
  }

  onSubmitClick() {
    var flag = { hasError: false }
    const preValidate = (name, value, field) => {
      if (name === 'roleId')
        return { hasError: false, errorMsg: '' };
    }

    this.state.fields.questionName = this.check(validateForm("questionName", this.state.questionName, FormElements["questionName"], preValidate, null), flag);
    this.state.fields.questionKey = this.check(validateForm("questionKey", this.state.questionKey, FormElements["questionKey"], preValidate, null), flag);
    this.state.fields.question = this.check(validateForm("question", this.state.question, FormElements["question"], preValidate, null), flag);
    this.state.fields.answer = this.check(validateForm("answer", this.state.answer, FormElements["answer"], preValidate, null), flag);
    this.state.fields.questionFrom = this.check(validateForm("questionFrom", this.state.questionFrom, FormElements["questionFrom"], preValidate, null), flag);


    if (flag.hasError === true) {
      this.props.setNotification({
        message: this.props.messagesUtil.EMPTY_FIELD_MSG,
        hasError: true,
        timestamp: new Date().getTime()
      });
      console.log("----Role mngt state change : ", this.state);
      return false;
    }
    const request = this.getRequest();


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
    formData.append('answer', this.validate(this.state.answer) ? this.state.answer : "");
    formData.append('questionFrom', this.state.questionFrom.value);


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


  deleteImage = (files, i) => {
    files.splice(i, 1);
    this.forceUpdate();

  }

  renderImages = () => {
    return (


      this.state.files.map((file, i) => (
        <div className="col-md-3">
          <img src={file.url} style={{ width: 100 }}></img>
          <span aria-hidden="true" style={{ right: 30, position: "absolute", fontSize: "31px", color: "red", fontWeight: "800", cursor: "pointer" }} className=" default-segment-ModalCloseIcon my-2" onClick={() => this.deleteImage(this.state.files, i)}>
            &times;
          </span>
        </div>
      ))


    );
  }


  validate = (val) => {
    if (val != null && val != undefined && val != "")
      return true;
    else
      return false;

  }



  render() {

    console.log("Create questions : ", this.state)
    if (this.state.isSuccess) {
      return <Redirect to="/Questions/questionSearch" />;
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

              <FieldItem
                {...FormElements.questionFrom}
                value={this.state.questionFrom}
                onChange={this.handleChange.bind(this, FormElements.questionFrom.name)}
                values={this.state.questionFromArray}
                touched={this.state.fields.questionFrom && this.state.fields.questionFrom.hasError}
                error={this.state.fields.questionFrom && this.state.fields.questionFrom.errorMsg}
                width="md"
              />

              <div className="col-md-3">
                <div >
                  <label className="commonLabel"> Select Images</label>
                </div>
                <input type="file" onChange={(e) => this.onFileChange(e)} />
              </div>







            </Row>
          </div>
        </div>

        {this.state.files.length != 0 ?
          <div className="form-Brick-body" style={{ margin: "15px" }}>
            {this.renderImages()}
          </div>
          : null}


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
