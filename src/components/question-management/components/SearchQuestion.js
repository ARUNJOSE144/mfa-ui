import React, { Component } from 'react';
import { Redirect, Switch } from 'react-router-dom';
import { Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR } from '../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../generic/buttons/elements/CustomButton';
import FieldItem from '../../generic/fields/elements/fieldItem/FieldItem';
import { validate } from '../../generic/fields/elements/fieldItem/utils';
import { validateForm } from '../../generic/fields/elements/formValidator/FormValidator';
import { ROLES as FormElements } from './util/FormElements';
export const { BASE_URL } = window;


const infoCss = {
  fontWeight: 900,
  color: "orange"
}

export default class SearchQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: '',
      modules: [],
      isSuccess: false,
      fields: {},
      questionList: [],
      prevKey: "",
      questionFromArray: [{ label: "Others", value: "1" }, { label: "Chegg", value: "2" }, { label: "Bartleby ", value: "3" }, { label: "File Load ", value: "4" }],
      HavingAnswerArray: [{ label: "Yes", value: "1" }, { label: "No", value: "2" }],
      mode: "",
      selectedQuestionId: "",
      searchToken: 0,
      subjects: [],
    };

    this.props.setHeader("Search Question");
    this.getSubjects();
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
    this.state[name] = value;
    this.state.fields = fields;
    this.forceUpdate();
    if (!isTouched && (name == "searchQuestionKey" || name == "searchQuestion" ||
      name == "searchAnswer" || name == "searchQuestionName" || name == "searchQuestionFrom" ||
      name == "searchHavingAnswer" || name == "searchSubject")) {

      var self = this;
      this.state.searchToken = this.state.searchToken + 1;
      var currentPrevToken = this.state.searchToken;
      setTimeout(function () {
        if (self.state.searchToken === currentPrevToken) {
          self.state.searchToken = 0;
          self.loadSearchResults();
        }
      }, 500);


    }
  }


  loadSearchResults = () => {
    const request = this.getRequest();
    this.props.ajaxUtil.sendRequest("/question/v1/searchQuestion", request, (response, hasError) => {
      console.log("response : ", response)
      this.setState({ questionList: response })
    }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true });
  }


  getRequest() {
    var searchQuestionFrom = "";
    if (this.validate(this.state.searchQuestionFrom)) {
      searchQuestionFrom = this.state.searchQuestionFrom.value;
    }

    var searchHavingAnswer = "";
    if (this.validate(this.state.searchHavingAnswer)) {
      searchHavingAnswer = this.state.searchHavingAnswer.value;
    }

    var searchSubject = ""
    if (this.validate(this.state.searchSubject)) {
      searchSubject = this.state.searchSubject.value;
    }

    return {
      "key": this.state.searchQuestionKey,
      "question": this.state.searchQuestion,
      "answer": this.state.searchAnswer,
      "name": this.state.searchQuestionName,
      "questionFrom": searchQuestionFrom,
      "havingAnswer": searchHavingAnswer,
      "subjectId": searchSubject
    }
  }


  onCancel() {
    this.setState({ isSuccess: true });
  }

  validate = (val) => {
    if (val != null && val != undefined && val != "") {
      return true;
    } else {
      return false;
    }
  }


  loadImageDetails = (question) => {
    this.props.ajaxUtil.sendRequest("/question/v1/getImageDetails", { questionId: question.id }, (response, hasError) => {
      console.log("response : ", response)
      question.imageDetails = response;
    }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true });
  }


  loadQuestionDetails = (question) => {
    this.props.ajaxUtil.sendRequest("/question/v1/view", { id: question.id }, (response, hasError) => {
      question.question = response.data.question;
      question.answer = response.data.answer;
      question.subjectId = response.data.subjectId;
      question.questionFrom = response.data.questionFrom;

      this.forceUpdate();
    }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true });
  }
  toggleDetails = (question) => {

    question.showDetails = !question.showDetails;
    if (question.showDetails) {
      this.loadQuestionDetails(question);
      if (!this.validate(question.imageDetails)) {
        this.loadImageDetails(question);
      }
    }
    this.forceUpdate();
  }



  getObjFromArray = (data, key, value) => {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] == value) {
        return JSON.parse(JSON.stringify(data[i]));
      }
    }
  }

  renderImages = (question) => {
    return (
      <React.Fragment>
        {this.validate(question.imageDetails) && question.imageDetails.map((image, i) => (
          <Row style={{ margin: "15px", border: "2px solid red" }}>
            <img src={BASE_URL + "/getDownloadFiles?imagePath=" + image.image} style={{ width: 1100 }} ></img>
          </Row>
        ))}
      </React.Fragment>
    );
  }


  deleteRow(obj, message, callback) {

    this.props.setModalPopup({
      'rowId': obj.id,
      'isOpen': true,
      'onConfirmCallBack': this.onConfirmCallBack.bind(this, callback),
      'title': "Confirm Delete",
      'content': "Do you want to delete the Question?",
      'CancelBtnLabel': "Cancel",
      'confirmBtnLabel': "Delete"
    });
  }

  onConfirmCallBack(callback, rowId) {
    var self = this;
    this.props.ajaxUtil.sendRequest("/question/v1/delete", { id: rowId }, function (resp, hasError) {
      self.loadSearchResults();
    }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false, isShowFailure: false, isAutoApiMsg: true });
  }



  renderQuestion = () => {
    return (
      <React.Fragment>
        {this.state.questionList.map((question, i) => (
          <div key={question.id} className={question.showDetails ? "activeQuestion" : ""} style={{
            backgroundColor: "white", marginTop: "10px",
            padding: "10px", fontSize: "17px", boxShadow: "3px 3px 5px 0px rgb(0 0 0 / 5%)",
          }}>
            <div className="mx-0" onClick={() => this.toggleDetails(question)} style={{ cursor: "pointer" }}>
              Name  :  <b>{question.name}  </b>   , Keys  : <b style={{ color: "yellowgreen" }}> {question.key}</b>

              <i className="fa fa-trash" style={{ float: "right", color: "red", marginTop: "0px", fontSize: "23px" }} onClick={() => this.deleteRow(question)}></i>
              <i className="fa fa-edit" style={{ marginRight: 15, float: "right", color: "green", marginTop: "3px", fontSize: "23px" }} onClick={() => this.goTo("EDIT", question)} ></i>
            </div>

            {question.showDetails ? <div style={{ backgroundColor: "#f8f8f8", padding: 15 }}>

              <div style={{ padding: "15px" }}>Id  :  <span style={infoCss}>{question.id}</span>
                ||  Subject :   <span style={infoCss}>{validate(this.getObjFromArray(this.state.subjects, "value", question.subjectId)) ?
                  this.getObjFromArray(this.state.subjects, "value", question.subjectId).label : "Not Mentioned"}</span>
                || Question From :   <span style={infoCss}>{validate(this.getObjFromArray(this.state.questionFromArray, "value", question.questionFrom)) ?
                  this.getObjFromArray(this.state.questionFromArray, "value", question.questionFrom).label : "Not Mentioned"}</span>

              </div>

              <div style={{ padding: "15px" }}>Name  :  {question.name}</div>

              <div style={{ padding: "15px" }}>Keys  :  {question.key}</div>

              <div style={{ padding: "15px" }}>Question :
                <textarea placeholder="Question" class="form-control" style={{ height: "300px" }} value={question.question} >{/* {question.question} */}</textarea>
              </div>

              <div style={{ padding: "15px" }}>Answer :
                <textarea placeholder="Answer" class="form-control" style={{ height: "300px" }} value={question.answer}>{/* {question.answer} */}</textarea>
              </div>

              {/*  <img src="E:/images/IMG_202109141252213180.png" style={{ width: 100 }}></img> */}

              {this.renderImages(question)}

            </div> : null}


          </div>
        ))}
      </React.Fragment>
    );
  }


  getSubjects = () => {
    this.props.ajaxUtil.sendRequest("/question/v1/getSubjectCategories", "", (response, hasError) => {
      if (!hasError)
        for (var i = 0; i < response.list.length; i++) {
          response.list[i].value = response.list[i].id;
          response.list[i].label = response.list[i].name;
        }
      this.setState({ subjects: response.list })
    }, this.props.loadingFunction, { method: "GET", isAutoApiMsg: true });
  }



  goTo = (mode, question) => {
    this.state.mode = mode;
    this.state.selectedQuestionId = question.id;
    this.forceUpdate();
  }

  resetFrom = () => {
    this.state.searchQuestionKey = ""
    this.state.searchQuestion = ""
    this.state.searchAnswer = ""
    this.state.searchQuestionName = ""
    this.state.searchQuestionFrom = null;
    this.state.searchHavingAnswer = null;
    this.state.searchSubject = null;
    this.state.questionList = [];
    this.forceUpdate();

  }

  render() {
    console.log("Ststet Search : ", this.state);
    if (this.state.isSuccess) {
      return <Redirect to="/Questions" />;
    }

    if (this.state.mode === "EDIT") {
      const editUrl = `/Questions/edit/${this.state.selectedQuestionId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    }
    if (this.state.mode === "CREATE") {
      return (
        <Switch>
          <Redirect to="/Questions/create" push />
        </Switch>
      );
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">

          <div className="form-Brick-Head" style={{ marginBottom: "10px" }}>

            <span><CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Create New Question" isButtonGroup={true} onClick={() => this.setState({ mode: "CREATE" })} /></span>
            <span><CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Reset" isButtonGroup={true} onClick={() => this.resetFrom()} /></span>

            <span>Search For Question </span>

          </div>

          <div className="form-Brick-body">
            <Row className="mx-0">


              <FieldItem
                {...FormElements.searchQuestionName}
                value={this.state.searchQuestionName}
                onChange={this.handleChange.bind(this, FormElements.searchQuestionName.name)}
                width="md"
                className={validate(this.state.searchQuestionName) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchQuestionKey}
                value={this.state.searchQuestionKey}
                onChange={this.handleChange.bind(this, FormElements.searchQuestionKey.name)}
                width="md"
                className={validate(this.state.searchQuestionKey) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchQuestion}
                value={this.state.searchQuestion}
                onChange={this.handleChange.bind(this, FormElements.searchQuestion.name)}
                width="md"
                className={validate(this.state.searchQuestion) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchAnswer}
                value={this.state.searchAnswer}
                onChange={this.handleChange.bind(this, FormElements.searchAnswer.name)}
                width="md"
                className={validate(this.state.searchAnswer) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchSubject}
                value={this.state.searchSubject}
                onChange={this.handleChange.bind(this, FormElements.searchSubject.name)}
                width="md"
                values={this.state.subjects}
                className={validate(this.state.searchSubject) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchQuestionFrom}
                value={this.state.searchQuestionFrom}
                onChange={this.handleChange.bind(this, FormElements.searchQuestionFrom.name)}
                width="md"
                values={this.state.questionFromArray}
                className={validate(this.state.searchQuestionFrom) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchHavingAnswer}
                value={this.state.searchHavingAnswer}
                onChange={this.handleChange.bind(this, FormElements.searchHavingAnswer.name)}
                width="md"
                values={this.state.HavingAnswerArray}
                className={validate(this.state.searchHavingAnswer) ? "activeSearch" : ""}
              />

            </Row>
          </div>


          <span> <b style={{ color: 'green' }}>{this.state.questionList.length}</b> Questions Found </span>
          {this.renderQuestion()}


        </div>


        <div className="container-fluid">

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
