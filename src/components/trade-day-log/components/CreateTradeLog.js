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
      indiaVix: "",
      comments: "",
      events: [],
      modules: [],
      isSuccess: false,
      fields: {},
      files: [],
      sectorList: [{ "files": [], fields: {} }],
      symbolList: [{ label: "NIFTY", value: "1" }, { label: "BANK-NIFTY", value: "2" }, { label: "FIN-NIFTY", value: "3" }, { label: "DOW-JOHNS", value: "4" }, { label: "NASDAQ", value: "5" }, { label: "S&P 500", value: "6" }],
      movingStatus: [{ label: "Flat", value: "1" }, { label: "Up", value: "2" }, { label: "Down", value: "3" }],
      eventsList: []
    };
    this.props.setHeader("Record Day");
    this.getEventsList();
    this.getSymbols();
  }


  getSymbols = () => {
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/getSymbols", "", (response, hasError) => {
      if (!hasError)
        this.state.symbolList = response.data;
      this.forceUpdate();
    }, this.props.loadingFunction, { method: "GET", isAutoApiMsg: true });

  }




  handleChange(name, parent, value, obj) {
    console.log("name----", name);
    console.log("value---", value);
    console.log("obj---", obj);
    console.log("parent---", parent);

    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      value = parent[name];
    }
    /* if (!isTouched) { */
    const fields = parent.fields;
    const validate = validateForm(name, value, FormElements[name], null, null);
    if (validate) {
      fields[name] = validate;
    } else {
      fields[name] = { hasError: false, errorMsg: '' };
    }
    this.setState({ fields });
    parent[name] = value;
    this.forceUpdate();
    /* } */
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

    this.state.fields.tradeDate = this.check(validateForm("tradeDate", this.state.tradeDate, FormElements["tradeDate"], preValidate, null), flag);
    this.state.fields.events = this.check(validateForm("events", this.state.events, FormElements["events"], preValidate, null), flag);
    this.state.fields.comments = this.check(validateForm("comments", this.state.comments, FormElements["comments"], preValidate, null), flag);
    this.state.fields.indiaVix = this.check(validateForm("indiaVix", this.state.indiaVix, FormElements["indiaVix"], preValidate, null), flag);


    for (var i = 0; i < this.state.sectorList.length; i++) {
      var sector = this.state.sectorList[i];
      sector.fields.symbol = this.check(validateForm("symbol", sector.symbol, FormElements["symbol"], preValidate, null), flag);
      sector.fields.preOpen = this.check(validateForm("preOpen", sector.preOpen, FormElements["preOpen"], preValidate, null), flag);
      sector.fields.firstHalf = this.check(validateForm("firstHalf", sector.firstHalf, FormElements["firstHalf"], preValidate, null), flag);
      sector.fields.secondHalf = this.check(validateForm("secondHalf", sector.secondHalf, FormElements["secondHalf"], preValidate, null), flag);
    }

    if (flag.hasError === true) {
      this.props.setNotification({ message: this.props.messagesUtil.EMPTY_FIELD_MSG, hasError: true, timestamp: new Date().getTime() });
      this.forceUpdate();
      return false;
    }

    //check for the repeated symbol
    for (var i = 0; i < this.state.sectorList.length; i++) {
      var count = 0
      for (var j = 0; j < this.state.sectorList.length; j++) {
        if (this.state.sectorList[i].symbol.value == this.state.sectorList[j].symbol.value) {
          count++;
        }
      }
      if (count >= 2) {
        this.props.setNotification({ message: "Please remove duplicate symbols.....", hasError: true, timestamp: new Date().getTime() });
        return 0;
      }

    }


    const request = this.getRequest();


    this.props.ajaxUtil.sendRequest("/tradeLog/v1/create", request, (response, hasError) => {
      if (!hasError)
        this.setState({ isSuccess: true })
    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }



  getEventsList = () => {
    this.props.ajaxUtil.sendRequest("/tradeLog/v1/getEvents", "", (response, hasError) => {
      if (!hasError)
        this.setState({ eventsList: response.data })
    }, this.props.loadingFunction, { method: "GET", isAutoApiMsg: true });
  }





  getRequest() {
    var formData = new FormData();
    var tradeDate = new Date(this.state.tradeDate).getFullYear() + "-" + (new Date(this.state.tradeDate).getMonth() + 1) + "-" + new Date(this.state.tradeDate).getDate();
    formData.append('tradeDate', tradeDate);
    if (this.validate(this.state.comments)) {
      formData.append('comments', this.state.comments);
    }
    if (this.validate(this.state.indiaVix)) {
      formData.append('indiaVix', this.state.indiaVix);
    }
    formData.append('events', this.getEvents(this.state.events));
    var sectorList = [];
    for (var i = 0; i < this.state.sectorList.length; i++) {
      var sector = {};
      sector.symbol = this.state.sectorList[i].symbol.value;
      sector.preOpen = this.state.sectorList[i].preOpen.value;
      sector.firstHalf = this.state.sectorList[i].firstHalf.value;
      sector.secondHalf = this.state.sectorList[i].secondHalf.value;
      sector.comments = this.state.sectorList[i].symbolComments;
      sectorList.push(sector);

    }
    formData.append('tradeLogDetailsTosString', JSON.stringify(sectorList));



    //formData.append('files', files)

    for (var i = 0; i < this.state.files.length; i++) {
      formData.append('file' + parseInt(i + 1), this.state.files[i].img)
    }

    for (var i = 0; i < this.state.sectorList.length; i++) {
      var sector = this.state.sectorList[i];
      if (sector.symbol.value == "1" && sector.files.length == 1) {
        formData.append('niftyImage', sector.files[0].img)
      }
      if (sector.symbol.value == "2" && sector.files.length == 1) {
        formData.append('bankNiftyImage', sector.files[0].img)
      }
      if (sector.symbol.value == "3" && sector.files.length == 1) {
        formData.append('finNiftyImage', sector.files[0].img)
      }
      if (sector.symbol.value == "4" && sector.files.length == 1) {
        formData.append('dowJohnsImage', sector.files[0].img)
      }
      if (sector.symbol.value == "5" && sector.files.length == 1) {
        formData.append('nasdaqImage', sector.files[0].img)
      }
      if (sector.symbol.value == "6" && sector.files.length == 1) {
        formData.append('sp500Image', sector.files[0].img)
      }
    }
    return formData;
    /*  return {
       "name": this.state.questionName,
       "key": this.state.questionKey,
       "question": this.state.question,
       "answer": this.state.answer,
     } */
  }

  getEvents = (eventList) => {
    var events = ""
    if (this.validate(eventList)) {
      for (var i = 0; i < eventList.length; i++) {
        if (events === "")
          events += eventList[i].label;
        else
          events += "," + eventList[i].label;
      }
    }
    return events;
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


  onSectorImageChange = (e, parent) => {
    var newImg = {}
    newImg.img = e.target.files[0];
    newImg.url = URL.createObjectURL(newImg.img);
    parent.files = [newImg];
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


  renderSectorImages = (parent) => {
    return (
      parent.files.map((file, i) => (
        <div className="col-md-3">
          <img src={file.url} style={{ width: 100 }}></img>
          <span aria-hidden="true" style={{ right: 30, position: "absolute", fontSize: "31px", color: "red", fontWeight: "800", cursor: "pointer" }} className=" default-segment-ModalCloseIcon my-2" onClick={() => this.deleteImage(parent.files, i)}>
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

  /*  add */

  addSector = () => {
    this.state.sectorList.push({ "files": [], fields: {} });
    this.forceUpdate();
  }

  deleteSector = (index) => {
    this.state.sectorList.splice(index, 1);
    this.forceUpdate()
  }


  renderList = () => {
    return (
      <React.Fragment>
        {this.state.sectorList.map((sector, i) => (
          <div className="form-Brick-body" style={{ marginTop: "15px" }}>
            <Row className="mx-0">
              <FieldItem
                {...FormElements.symbol}
                value={sector.symbol}
                onChange={this.handleChange.bind(this, FormElements.symbol.name, sector)}
                values={this.state.symbolList}
                width="md"
                className="tradeSymbolName"
                touched={sector.fields.symbol && sector.fields.symbol.hasError}
                error={sector.fields.symbol && sector.fields.symbol.errorMsg}
              />

              <FieldItem
                {...FormElements.preOpen}
                value={sector.preOpen}
                onChange={this.handleChange.bind(this, FormElements.preOpen.name, sector)}
                values={this.state.movingStatus}
                width="md"
                touched={sector.fields.preOpen && sector.fields.preOpen.hasError}
                error={sector.fields.preOpen && sector.fields.preOpen.errorMsg}
              />

              <FieldItem
                {...FormElements.firstHalf}
                value={sector.firstHalf}
                onChange={this.handleChange.bind(this, FormElements.firstHalf.name, sector)}
                values={this.state.movingStatus}
                width="md"
                touched={sector.fields.firstHalf && sector.fields.firstHalf.hasError}
                error={sector.fields.firstHalf && sector.fields.firstHalf.errorMsg}
              />

              <FieldItem
                {...FormElements.secondHalf}
                value={sector.secondHalf}
                onChange={this.handleChange.bind(this, FormElements.secondHalf.name, sector)}
                values={this.state.movingStatus}
                width="md"
                touched={sector.fields.secondHalf && sector.fields.secondHalf.hasError}
                error={sector.fields.secondHalf && sector.fields.secondHalf.errorMsg}
              />

              <FieldItem
                {...FormElements.symbolComments}
                value={sector.symbolComments}
                onChange={this.handleChange.bind(this, FormElements.symbolComments.name, sector)}
                values={this.state.movingStatus}
                width="md"
                touched={sector.fields.symbolComments && sector.fields.symbolComments.hasError}
                error={sector.fields.symbolComments && sector.fields.symbolComments.errorMsg}
              />

              <div className="col-md-3">
                <div >
                  <label className="commonLabel"> Select Images</label>
                </div>
                <input type="file" onChange={(e) => this.onSectorImageChange(e, sector)} />
              </div>

              <div className="col-md-1">
                {this.state.sectorList.length == i + 1 ? <i style={{ fontSize: "25px", color: "green", "marginTop": "20px" }} onClick={this.addSector} className="fa fa-plus"></i> : null}
                {this.state.sectorList.length > 1 ? <i style={{ marginLeft: "15px", fontSize: "25px", color: "red", "marginTop": "20px" }} onClick={() => this.deleteSector(i)} className="fa fa-minus"></i> : null}
              </div>
            </Row>

            {
              sector.files.length != 0 ?
                <div className="form-Brick-body" style={{ margin: "15px" }}>
                  {this.renderSectorImages(sector)}
                </div>
                : null
            }
          </div>
        ))}
      </React.Fragment>
    );
  }

  render() {

    console.log("Create questions : ", this.state)
    if (this.state.isSuccess) {
      return <Redirect to="/trade-day-log/questionSearch" />;
    }

    return (
      <div className="custom-container">
        <div className="form-Brick">
          <div className="form-Brick-Head">
            <span>Basic Details</span>
          </div>
          <div className="form-Brick-body">
            <Row className="mx-0">
              <FieldItem
                {...FormElements.tradeDate}
                value={this.state.tradeDate}
                onChange={this.handleChange.bind(this, FormElements.tradeDate.name, this.state)}
                touched={this.state.fields.tradeDate && this.state.fields.tradeDate.hasError}
                error={this.state.fields.tradeDate && this.state.fields.tradeDate.errorMsg}
                width="md"
                className="tradeDate"
              />

              <FieldItem
                {...FormElements.events}
                value={this.state.events}
                onChange={this.handleChange.bind(this, FormElements.events.name, this.state)}
                values={this.state.eventsList}
                width="md"
              />

              <FieldItem
                {...FormElements.comments}
                value={this.state.comments}
                onChange={this.handleChange.bind(this, FormElements.comments.name, this.state)}
                values={this.state.comments}
                width="md"
              />

              <FieldItem
                {...FormElements.indiaVix}
                value={this.state.indiaVix}
                onChange={this.handleChange.bind(this, FormElements.indiaVix.name, this.state)}
                touched={this.state.fields.indiaVix && this.state.fields.indiaVix.hasError}
                error={this.state.fields.indiaVix && this.state.fields.indiaVix.errorMsg}
                width="md"
              />




              <div className="col-md-3">
                <div >
                  <label className="commonLabel"> Select Images</label>
                </div>
                <input type="file" onChange={(e) => this.onFileChange(e)} />
              </div>


            </Row>
            {
              this.state.files.length != 0 ?
                <div className="form-Brick-body" style={{ margin: "15px" }}>
                  {this.renderImages()}
                </div>
                : null
            }
          </div>


          {this.renderList()}


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
      </div >
    );
  }

}
