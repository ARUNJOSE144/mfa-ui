import moment from "moment";
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
      tradeId: 0,
      fields: {},
      symbolList: [
        { label: "NIFTY", value: "1", "name": "NSE:NIFTY50-INDEX" },
        { label: "BANKNIFTY", value: "2", "name": "NSE:BANK-NIFTY-INDEX" },
      ],
      strikeListForAll: {
        "1": [{ "label": 15400, "value": 15400 }, { "label": 15450, "value": 15450 }, { "label": 15500, "value": 15500 }, { "label": 15550, "value": 15550 }, { "label": 15600, "value": 15600 }, { "label": 15650, "value": 15650 }, { "label": 15700, "value": 15700 }, { "label": 15750, "value": 15750 }, { "label": 15800, "value": 15800 }, { "label": 15850, "value": 15850 }, { "label": 15900, "value": 15900 }, { "label": 15950, "value": 15950 }, { "label": 16000, "value": 16000 }, { "label": 16050, "value": 16050 }, { "label": 16100, "value": 16100 }, { "label": 16150, "value": 16150 }, { "label": 16200, "value": 16200 }, { "label": 16250, "value": 16250 }, { "label": 16300, "value": 16300 }, { "label": 16350, "value": 16350 }, { "label": 16400, "value": 16400 }, { "label": 16450, "value": 16450 }, { "label": 16500, "value": 16500 }, { "label": 16550, "value": 16550 }, { "label": 16600, "value": 16600 }, { "label": 16650, "value": 16650 }, { "label": 16700, "value": 16700 }, { "label": 16750, "value": 16750 }, { "label": 16800, "value": 16800 }, { "label": 16850, "value": 16850 }, { "label": 16900, "value": 16900 }, { "label": 16950, "value": 16950 }, { "label": 17000, "value": 17000 }, { "label": 17050, "value": 17050 }, { "label": 17100, "value": 17100 }, { "label": 17150, "value": 17150 }, { "label": 17200, "value": 17200 }, { "label": 17250, "value": 17250 }, { "label": 17300, "value": 17300 }, { "label": 17350, "value": 17350 }, { "label": 17400, "value": 17400 }, { "label": 17450, "value": 17450 }, { "label": 17500, "value": 17500 }, { "label": 17550, "value": 17550 }, { "label": 17600, "value": 17600 }, { "label": 17650, "value": 17650 }, { "label": 17700, "value": 17700 }, { "label": 17750, "value": 17750 }, { "label": 17800, "value": 17800 }, { "label": 17850, "value": 17850 }, { "label": 17900, "value": 17900 }, { "label": 17950, "value": 17950 }, { "label": 18000, "value": 18000 }, { "label": 18050, "value": 18050 }, { "label": 18100, "value": 18100 }, { "label": 18150, "value": 18150 }, { "label": 18200, "value": 18200 }, { "label": 18250, "value": 18250 }, { "label": 18300, "value": 18300 }, { "label": 18350, "value": 18350 }, { "label": 18400, "value": 18400 }, { "label": 18450, "value": 18450 }, { "label": 18500, "value": 18500 }, { "label": 18550, "value": 18550 }, { "label": 18600, "value": 18600 }, { "label": 18650, "value": 18650 }, { "label": 18700, "value": 18700 }, { "label": 18750, "value": 18750 }, { "label": 18800, "value": 18800 }, { "label": 18850, "value": 18850 }, { "label": 18900, "value": 18900 }, { "label": 18950, "value": 18950 }, { "label": 19000, "value": 19000 }, { "label": 19050, "value": 19050 }, { "label": 19100, "value": 19100 }],
        "2": [{ "label": 33500, "value": 33500 }, { "label": 33600, "value": 33600 }, { "label": 33700, "value": 33700 }, { "label": 33800, "value": 33800 }, { "label": 33900, "value": 33900 }, { "label": 34000, "value": 34000 }, { "label": 34100, "value": 34100 }, { "label": 34200, "value": 34200 }, { "label": 34300, "value": 34300 }, { "label": 34400, "value": 34400 }, { "label": 34500, "value": 34500 }, { "label": 34600, "value": 34600 }, { "label": 34700, "value": 34700 }, { "label": 34800, "value": 34800 }, { "label": 34900, "value": 34900 }, { "label": 35000, "value": 35000 }, { "label": 35100, "value": 35100 }, { "label": 35200, "value": 35200 }, { "label": 35300, "value": 35300 }, { "label": 35400, "value": 35400 }, { "label": 35500, "value": 35500 }, { "label": 35600, "value": 35600 }, { "label": 35700, "value": 35700 }, { "label": 35800, "value": 35800 }, { "label": 35900, "value": 35900 }, { "label": 36000, "value": 36000 }, { "label": 36100, "value": 36100 }, { "label": 36200, "value": 36200 }, { "label": 36300, "value": 36300 }, { "label": 36400, "value": 36400 }, { "label": 36500, "value": 36500 }, { "label": 36600, "value": 36600 }, { "label": 36700, "value": 36700 }, { "label": 36800, "value": 36800 }, { "label": 36900, "value": 36900 }, { "label": 37000, "value": 37000 }, { "label": 37100, "value": 37100 }, { "label": 37200, "value": 37200 }, { "label": 37300, "value": 37300 }, { "label": 37400, "value": 37400 }, { "label": 37500, "value": 37500 }, { "label": 37600, "value": 37600 }, { "label": 37700, "value": 37700 }, { "label": 37800, "value": 37800 }, { "label": 37900, "value": 37900 }, { "label": 38000, "value": 38000 }, { "label": 38100, "value": 38100 }, { "label": 38200, "value": 38200 }, { "label": 38300, "value": 38300 }, { "label": 38400, "value": 38400 }, { "label": 38500, "value": 38500 }, { "label": 38600, "value": 38600 }, { "label": 38700, "value": 38700 }, { "label": 38800, "value": 38800 }, { "label": 38900, "value": 38900 }, { "label": 39000, "value": 39000 }, { "label": 39100, "value": 39100 }, { "label": 39200, "value": 39200 }, { "label": 39300, "value": 39300 }, { "label": 39400, "value": 39400 }, { "label": 39500, "value": 39500 }, { "label": 39600, "value": 39600 }, { "label": 39700, "value": 39700 }, { "label": 39800, "value": 39800 }, { "label": 39900, "value": 39900 }, { "label": 40000, "value": 40000 }, { "label": 40100, "value": 40100 }, { "label": 40200, "value": 40200 }, { "label": 40300, "value": 40300 }, { "label": 40400, "value": 40400 }, { "label": 40500, "value": 40500 }, { "label": 40600, "value": 40600 }, { "label": 40700, "value": 40700 }, { "label": 40800, "value": 40800 }, { "label": 40900, "value": 40900 }, { "label": 41000, "value": 41000 }, { "label": 41100, "value": 41100 }, { "label": 41200, "value": 41200 }, { "label": 41300, "value": 41300 }, { "label": 41400, "value": 41400 }, { "label": 41500, "value": 41500 }, { "label": 41600, "value": 41600 }, { "label": 41700, "value": 41700 }, { "label": 41800, "value": 41800 }, { "label": 41900, "value": 41900 }, { "label": 42000, "value": 42000 }, { "label": 42100, "value": 42100 }, { "label": 42200, "value": 42200 }, { "label": 42300, "value": 42300 }, { "label": 42400, "value": 42400 }, { "label": 42500, "value": 42500 }, { "label": 42600, "value": 42600 }, { "label": 42700, "value": 42700 }, { "label": 42800, "value": 42800 }, { "label": 42900, "value": 42900 }, { "label": 43000, "value": 43000 }, { "label": 43100, "value": 43100 }, { "label": 43200, "value": 43200 }, { "label": 43300, "value": 43300 }, { "label": 43400, "value": 43400 }, { "label": 43500, "value": 43500 }, { "label": 43600, "value": 43600 }, { "label": 43700, "value": 43700 }, { "label": 43800, "value": 43800 }, { "label": 43900, "value": 43900 }, { "label": 44000, "value": 44000 }, { "label": 44100, "value": 44100 }, { "label": 44200, "value": 44200 }, { "label": 44300, "value": 44300 }, { "label": 44400, "value": 44400 }, { "label": 44500, "value": 44500 }, { "label": 44600, "value": 44600 }, { "label": 44700, "value": 44700 }, { "label": 44800, "value": 44800 }, { "label": 44900, "value": 44900 }, { "label": 45000, "value": 45000 }, { "label": 45100, "value": 45100 }, { "label": 45200, "value": 45200 }, { "label": 45300, "value": 45300 }, { "label": 45400, "value": 45400 }, { "label": 45500, "value": 45500 }, { "label": 45600, "value": 45600 }, { "label": 45700, "value": 45700 }, { "label": 45800, "value": 45800 }, { "label": 45900, "value": 45900 }, { "label": 46000, "value": 46000 }, { "label": 46100, "value": 46100 }, { "label": 46200, "value": 46200 }, { "label": 46300, "value": 46300 }, { "label": 46400, "value": 46400 }, { "label": 46500, "value": 46500 }, { "label": 46600, "value": 46600 }, { "label": 46700, "value": 46700 }, { "label": 46800, "value": 46800 }, { "label": 46900, "value": 46900 }, { "label": 47000, "value": 47000 }]
      },
      typeList: [{ label: "PUT", value: "PUT", type: "PE" }, { label: "CALL", value: "CALL", type: "CE" }],
      sideList: [{ label: "BUY", value: "BUY" }, { label: "SELL", value: "SELL" }],
      aboveOrBelowList: [{ label: "Above", value: "ABOVE" }, { label: "Below", value: "BELOW" }],
      mode: "CREATE",
      strikeList: [],
      code: "23413"

    };
    this.props.setHeader("Create Trade");
  }



  componentDidMount() {
    if (this.props.match.params.id != 0) {
      this.state.mode = "EDIT";
      this.state.tradeId = this.props.match.params.id
      this.getDetails();
    }
  }

  getDetails = () => {
    var request = { id: this.state.tradeId }

    this.props.ajaxUtil.sendRequest("/trade/v1/view", request, (response, hasError) => {
      console.log("response : ", response)

      this.state.symbol = this.getObjFromArray(this.state.symbolList, "name", response.data.symbolName)
      this.state.type = this.getObjFromArray(this.state.typeList, "value", response.data.callOrPut)
      this.state.side = this.getObjFromArray(this.state.sideList, "value", response.data.buyOrSell)

      this.state.aboveOrBelow = this.getObjFromArray(this.state.aboveOrBelowList, "value", response.data.aboveOrBelow)
      this.state.price = response.data.price
      this.state.profitPrice = response.data.profitPrice
      this.state.slPrice = response.data.slPrice
      this.state.qty = response.data.qty





      this.forceUpdate();
    }, this.props.loadingFunction, { isAutoApiMsg: false, isShowSuccess: false, isShowFailure: true });

  }

  getObjFromArray = (data, key, value) => {
    for (var i = 0; i < data.length; i++) {
      if (data[i][key] == value) {
        return JSON.parse(JSON.stringify(data[i]));
      }
    }
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

    if (name == "symbol" && !isTouched) {
      console.log("value.value : " + value.value)
      this.state.strikeList = this.state.strikeListForAll[value.value];
      this.state.strike = []
    }

    this.forceUpdate();
    /* } */
  }

  check = (obj, flag) => {
    if (obj.hasError)
      flag.hasError = true;
    return obj;
  }

  onSubmitClick() {
    /*  var flag = { hasError: false }
     const preValidate = (name, value, field) => {
       if (name === 'roleId')
         return { hasError: false, errorMsg: '' };
     } */

    /*  this.state.fields.tradeDate = this.check(validateForm("tradeDate", this.state.tradeDate, FormElements["tradeDate"], preValidate, null), flag);
     this.state.fields.events = this.check(validateForm("events", this.state.events, FormElements["events"], preValidate, null), flag);
     this.state.fields.comments = this.check(validateForm("comments", this.state.comments, FormElements["comments"], preValidate, null), flag);
     this.state.fields.indiaVix = this.check(validateForm("indiaVix", this.state.indiaVix, FormElements["indiaVix"], preValidate, null), flag); */







    var request = {};
    if (this.validate(this.state.tradeId) && this.state.tradeId != 0) {
      request.id = this.state.tradeId
    }
    request.symbolName = this.state.symbol.name;
    if (this.state.mode == "CREATE") {
      request.strike = "NSE:" + this.state.symbol.label + this.state.code + this.state.strike.value + this.state.type.type;
    }
    request.callOrPut = this.state.type.value;
    request.buyOrSell = this.state.side.value;
    request.aboveOrBelow = this.state.aboveOrBelow.value;
    request.price = this.state.price;
    request.profitPrice = this.state.profitPrice;
    request.slPrice = this.state.slPrice;
    request.qty = this.state.qty;




    this.props.ajaxUtil.sendRequest("/trade/v1/create", request, (response, hasError) => {
      if (!hasError)
        this.setState({ isSuccess: true })
    }, this.props.loadingFunction, { isAutoApiMsg: true });
  }











  onCancel() {
    this.setState({ isSuccess: true });
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
      return <Redirect to="/Manage_trade" />;
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
                {...FormElements.symbol}
                value={this.state.symbol}
                onChange={this.handleChange.bind(this, FormElements.symbol.name, this.state)}
                values={this.state.symbolList}
                width="md"
              />

              <FieldItem
                {...FormElements.strike}
                value={this.state.strike}
                onChange={this.handleChange.bind(this, FormElements.strike.name, this.state)}
                values={this.state.strikeList}
                width="md"
              />

              <FieldItem
                {...FormElements.type}
                value={this.state.type}
                onChange={this.handleChange.bind(this, FormElements.type.name, this.state)}
                values={this.state.typeList}
                width="md"
              />

              <FieldItem
                {...FormElements.side}
                value={this.state.side}
                onChange={this.handleChange.bind(this, FormElements.side.name, this.state)}
                values={this.state.sideList}
                width="md"
              />




            </Row>

          </div>

          <div className="form-Brick-body">
            <Row className="mx-0">

              <FieldItem
                {...FormElements.aboveOrBelow}
                value={this.state.aboveOrBelow}
                onChange={this.handleChange.bind(this, FormElements.aboveOrBelow.name, this.state)}
                values={this.state.aboveOrBelowList}
                width="md"
              />

              <FieldItem
                {...FormElements.price}
                value={this.state.price}
                onChange={this.handleChange.bind(this, FormElements.price.name, this.state)}
                touched={this.state.fields.price && this.state.fields.price.hasError}
                error={this.state.fields.price && this.state.fields.price.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.profitPrice}
                value={this.state.profitPrice}
                onChange={this.handleChange.bind(this, FormElements.profitPrice.name, this.state)}
                touched={this.state.fields.profitPrice && this.state.fields.profitPrice.hasError}
                error={this.state.fields.profitPrice && this.state.fields.profitPrice.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.slPrice}
                value={this.state.slPrice}
                onChange={this.handleChange.bind(this, FormElements.slPrice.name, this.state)}
                touched={this.state.fields.slPrice && this.state.fields.slPrice.hasError}
                error={this.state.fields.slPrice && this.state.fields.slPrice.errorMsg}
                width="md"
              />

              <FieldItem
                {...FormElements.qty}
                value={this.state.qty}
                onChange={this.handleChange.bind(this, FormElements.qty.name, this.state)}
                touched={this.state.fields.qty && this.state.fields.qty.hasError}
                error={this.state.fields.qty && this.state.fields.qty.errorMsg}
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
