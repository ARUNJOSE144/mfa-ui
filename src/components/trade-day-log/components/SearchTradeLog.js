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
      mode: "",
      rowCount: 10,
      tradeDayList: [],
      dayList: [{ label: "Sunday", value: "Sunday" }, { label: "Monday", value: "Monday" }, { label: "Tuesday", value: "Tuesday" }, { label: "Wednesday", value: "Wednesday" }, { label: "Thursday", value: "Thursday" }, { label: "Friday", value: "Friday" }, { label: "Saturday", value: "Saturday" }],
      dateList: [],
      searchToken: 0,
      symbolList: [],
      movingStatus: [{ label: "Flat", value: "1" }, { label: "Up", value: "2" }, { label: "Down", value: "3" }],
      eventsList: [],
      showResultOf: null

    };

    this.props.setHeader("Search Day");
    this.loadData();
    this.getEventsList();
    this.getSymbols();
  }

  loadData = () => {
    for (var i = 1; i <= 31; i++) {
      this.state.dateList.push({ label: i + "", value: i + "" })
    }
    this.forceUpdate();
  }


  getEventsList = () => {
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/getEvents", "", (response, hasError) => {
      if (!hasError)
        this.setState({ eventsList: response.data })
    }, this.props.loadingFunction, { method: "GET", isAutoApiMsg: true });
  }



  getSymbols = () => {
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/getSymbols", "", (response, hasError) => {
      if (!hasError)
        this.state.symbolList = response.data;
      this.forceUpdate();
    }, this.props.loadingFunction, { method: "GET", isAutoApiMsg: true });

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
    if (!isTouched && (name == "searchTradeDate" || name == "searchDay" ||
      name == "searchDate" || name == "searchEvents" || name == "searchComment"/*  || name == "showResultOf" */)) {

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
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/search", request, (response, hasError) => {
      console.log("response : ", response)
      this.setState({ tradeDayList: response.data, dataTotalSize: response.dataTotalSize })
    }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true });
  }



  setBookMark = (name, parent, value, obj) => {

    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      return;
    }
    console.log("Name : ", name);
    console.log("value : ", value);
    console.log("parent : ", parent);
    console.log("obj : ", obj);


    if (validate(value) /* && validate(value.value) */) {
      parent.bookmark = value.value;
      var self = this;
      this.props.ajaxUtil.sendRequest("/bookMark?id=" + parent.id + "&value=" + value.value, "", (response, hasError) => {
        console.log("response : ", response)
        parent.bookmark = value.value;
        self.forceUpdate();
      }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true, method: 'GET' });
    }
    this.forceUpdate();
  }

  getRequest() {
    var searchDays = [];
    if (this.validate(this.state.searchDay)) {
      for (var i = 0; i < this.state.searchDay.length; i++) {
        searchDays.push(this.state.searchDay[i].label);
      }
    }

    var searchDates = [];
    if (this.validate(this.state.searchDate)) {
      console.log("this.state.searchDate) : ", this.state.searchDate)
      for (var i = 0; i < this.state.searchDate.length; i++) {
        searchDates.push(this.state.searchDate[i].label);
      }
    }

    if (validate(this.state.searchTradeDate)) {
      var searchTradeDate = new Date(this.state.searchTradeDate).getFullYear() + "-" + (new Date(this.state.searchTradeDate).getMonth() + 1) + "-" + new Date(this.state.searchTradeDate).getDate();
    }

    if (validate(this.state.searchEvents)) {
      var searchEvents = this.state.searchEvents.label;
    }



    return {
      "tradeDate": searchTradeDate,
      "dayList": searchDays,
      "dateList": searchDates,
      "events": searchEvents,
      "comments": this.state.searchComment,
      "rowCount": this.state.rowCount,

    }
  }


  onCancel = () => {
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
    var request = { id: question.id }
    if (validate(this.state.showResultOf)) {
      var showResultOf = [];
      for (var i = 0; i < this.state.showResultOf.length; i++) {
        showResultOf.push(this.state.showResultOf[i].value);
      }
    }
    request.showResultOf = showResultOf

    this.props.ajaxUtil.sendRequest("/tradeLog/v1/view", request, (response, hasError) => {
      question.sectorData = response.data.tradeLogDetailsTos;
      console.log("sectorData : ", question.sectorData)
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
        {this.validate(question.sectorData) && question.sectorData.map((sector, i) => (
          <Row style={{ margin: "15px", border: "2px solid red" }}>
            <div className='col-md-3'>
              <label style={{ color: "red", fontWeight: "bold", padding: "10px" }}>{this.getObjFromArray(this.state.symbolList, "value", sector.symbol).label}</label><br></br>
              <label style={{ fontSize: "15px" }} >Preopen : {this.getObjFromArray(this.state.movingStatus, "value", sector.preOpen).label}</label><br></br>
              <label style={{ fontSize: "15px" }} >First Half : {this.getObjFromArray(this.state.movingStatus, "value", sector.firstHalf).label}</label><br></br>
              <label style={{ fontSize: "15px" }} >Second Half : {this.getObjFromArray(this.state.movingStatus, "value", sector.secondHalf).label}</label><br></br>
              <label style={{ fontSize: "15px" }} >Comments : {sector.comments}</label><br></br>
            </div>

            {validate(sector.tradeLogImageTo) ?
              <div className='col-md-9'>
                <img src={BASE_URL + "/getDownloadFiles?imagePath=" + sector.tradeLogImageTo.imagePath} style={{ width: 700 }}  ></img>
              </div> : null}

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
        {this.state.tradeDayList.map((tradeDay, i) => (
          <div key={tradeDay.id} className={tradeDay.showDetails ? "activeQuestion" : ""} style={{
            backgroundColor: "white", marginTop: "10px",
            padding: "10px", fontSize: "17px", boxShadow: "3px 3px 5px 0px rgb(0 0 0 / 5%)",
          }}>
            <div className="mx-0" onClick={() => this.toggleDetails(tradeDay)} style={{ cursor: "pointer" }}>
              Trade Date  :  <b>{tradeDay.tradeDate}  </b>   , Day  : <b style={{ color: "yellowgreen" }}> {tradeDay.day}</b>

              {tradeDay.bookmark != "1" ? <i className="fa fa-trash" style={{ marginLeft: 15, float: "right", color: "red", marginTop: "0px", fontSize: "23px" }} onClick={() => this.deleteRow(tradeDay)}></i> : null}
              <i className="fa fa-edit" style={{ marginLeft: 15, float: "right", color: "green", marginTop: "3px", fontSize: "23px" }} onClick={() => this.goTo("EDIT", tradeDay)} ></i>
              {tradeDay.bookmark == "1" ? <i className="fa fa-star" style={{ marginLeft: 15, float: "right", color: "blueviolet", marginTop: "3px", fontSize: "23px" }} /* onClick={() => this.goTo("EDIT", question)} */ ></i> : null}
            </div>

            {tradeDay.showDetails ? <div style={{ backgroundColor: "#f8f8f8", padding: 15 }}>

              {/*       <div style={{ padding: "15px" }}>Id  :  <span style={infoCss}>{tradeDay.id}</span>
                ||  Subject :   <span style={infoCss}>{validate(this.getObjFromArray(this.state.subjects, "value", tradeDay.subjectId)) ?
                  this.getObjFromArray(this.state.subjects, "value", tradeDay.subjectId).label : "Not Mentioned"}</span>
                || Question From :   <span style={infoCss}>{validate(this.getObjFromArray(this.state.questionFromArray, "value", tradeDay.questionFrom)) ?
                  this.getObjFromArray(this.state.questionFromArray, "value", tradeDay.questionFrom).label : "Not Mentioned"}</span>

              </div> */}

              <div style={{ padding: "10px" }}>Trade Date  :  {tradeDay.tradeDate}</div>

              <div style={{ padding: "10px" }}>Day  :  {tradeDay.day}</div>

              <div style={{ padding: "10px" }}>Events  :  {tradeDay.events}</div>

              <div style={{ padding: "10px" }}>India Vix  :  {tradeDay.indiaVix}</div>

              <div style={{ padding: "10px" }}>comments  :  {tradeDay.comments}</div>

              {/*   <div style={{ padding: "15px" }}>Question :
                <textarea placeholder="Question" class="form-control" style={{ height: "300px" }} value={tradeDay.question} ></textarea>
              </div>
 */}
              {this.renderImages(tradeDay)}

              {/*  <FieldItem
                {...FormElements.bookmark}
                value={this.getObjFromArray(this.state.bookMarks, "value", tradeDay.bookmark)}
                onChange={this.setBookMark.bind(this, FormElements.bookmark.name, tradeDay)}
                values={this.state.bookMarks}
              /> */}

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
    this.state.searchTradeDate = ""
    this.state.searchDay = null
    this.state.searchDate = null
    this.state.tradeDayList = [];
    this.state.searchEvents = null
    this.state.searchComment = ""
    this.state.showResultOf = null

    this.state.rowCount = 10;
    this.forceUpdate();

  }

  render() {
    console.log("Ststet Search : ", this.state);
    if (this.state.isSuccess) {
      return <Redirect to="/trade-day-log" />;
    }

    if (this.state.mode === "EDIT") {
      const editUrl = `/trade-day-log/edit/${this.state.selectedQuestionId}`;
      return (
        <Switch>
          <Redirect to={editUrl} />
        </Switch>
      );
    }
    if (this.state.mode === "CREATE") {
      return (
        <Switch>
          <Redirect to="/trade-day-log/create" push />
        </Switch>
      );
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">

          <div className="form-Brick-Head" style={{ marginBottom: "10px" }}>

            <span><CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Create New Question" isButtonGroup={true} onClick={() => this.setState({ mode: "CREATE" })} /></span>
            <span><CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Reset" isButtonGroup={true} onClick={() => this.resetFrom()} /></span>
            <span><CustomButton style={BUTTON_STYLE.BRICK} type={BUTTON_TYPE.PRIMARY} size={BUTTON_SIZE.MEDIUM} align="left" label="Go Back" isButtonGroup={true} onClick={() => this.onCancel()} /></span>

            <span>Search For Days </span>

          </div>

          <div className="form-Brick-body">
            <Row className="mx-0">

              <FieldItem
                {...FormElements.searchTradeDate}
                value={this.state.searchTradeDate}
                onChange={this.handleChange.bind(this, FormElements.searchTradeDate.name)}
                width="md"
                className={validate(this.state.searchTradeDate) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchDay}
                value={this.state.searchDay}
                values={this.state.dayList}
                onChange={this.handleChange.bind(this, FormElements.searchDay.name)}
                width="md"
                className={validate(this.state.searchDay) && this.state.searchDay.length > 0 ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchDate}
                value={this.state.searchDate}
                values={this.state.dateList}
                onChange={this.handleChange.bind(this, FormElements.searchDate.name)}
                width="md"
                className={validate(this.state.searchDate) && this.state.searchDate.length > 0 ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchEvents}
                value={this.state.searchEvents}
                values={this.state.eventsList}
                onChange={this.handleChange.bind(this, FormElements.searchEvents.name)}
                width="md"
                className={validate(this.state.searchEvents) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.searchComment}
                value={this.state.searchComment}
                onChange={this.handleChange.bind(this, FormElements.searchComment.name)}
                width="md"
                className={validate(this.state.searchComment) ? "activeSearch" : ""}
              />

              <FieldItem
                {...FormElements.showResultOf}
                value={this.state.showResultOf}
                values={this.state.symbolList}
                onChange={this.handleChange.bind(this, FormElements.showResultOf.name)}
                width="md"
                className={validate(this.state.showResultOf) && this.state.showResultOf.length > 0 ? "activeSearch" : ""}
              />


            </Row>
          </div>


          <span> <b style={{ color: 'green' }}>{this.state.tradeDayList.length}</b> Result  {this.state.tradeDayList.length != 0 ? "Out of " + this.state.dataTotalSize : ""}</span>
          {this.renderQuestion()}




        </div>


        <div className="container-fluid">

          {this.state.tradeDayList.length != 0 ?
            <FieldItem
              {...FormElements.rowCount}
              value={this.state.rowCount}
              onChange={this.handleChange.bind(this, FormElements.rowCount.name)}
              width="md"
              className="rowcountForQuestionSearch"

            /> : null}



        </div>
        <div style={{ height: "100px" }}></div>
      </div>
    );
  }

}
