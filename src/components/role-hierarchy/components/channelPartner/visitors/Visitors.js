import React, { Component } from 'react';
import {
  ModalBody,
  Col,
  Row
} from 'reactstrap';
import moment from 'moment';
import Details from "./Details";
import {FieldItem} from "@6d-ui/fields";
import {SearchComponent } from '@6d-ui/data-table';

export default class Visitors extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isListLoading: true,
      data: [],
      windowHeight: window.innerHeight,
      dateType: { value: 7, label: "Last 7 Days" }
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    this.getUserList(7);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }

  getUserList(dateType) {
    const fromDate = moment().subtract(dateType, 'days').format(this.props.const_dateFormat);
    const toDate = moment().format(this.props.const_dateFormat);
    const data = {
      "pageNumber": 1,
      "rowCount": 100,
      "orderByCol": "checkinDate",
      "sort": "desc",
      "filters": [
        { "name": "startDate", "value": `${fromDate} 00:00:00` },
        { "name": "endDate", "value": `${toDate} 23:59:59` },
        { "name": "entityId", "value": this.props.channelPartnerId }
      ]
    };
    this.props.ajaxUtil.sendRequest(this.props.url_ChannelPartners.VISIT_HISTORY, data,
      (response, hasError) => {
        if (!response || !response.checkinlist || response.checkinlist.length === 0) {
          // store.dispatch(
          //   setToastNotif({
          //     message: "Please Try Again",
          //     hasError: true,
          //     timestamp: new Date().getTime()
          //   })
          // );
          return false;
        }
        if (response.checkinlist && response.checkinlist.length > 0) {
          this.getVisitDetails({ id: response.checkinlist[0].checkinId });
        }
        this.setState({ 'checkinList': response.checkinlist });
      }, this.listLoadingFunction.bind(this), {
        isShowSuccess: false,
        isProceedOnError: false
      });
  }
  getVisitDetails(details) {
    const visitId = details.id;
    this.setState({ 'selectedId': visitId });
    this.props.ajaxUtil.sendRequest(`${this.props.url_ChannelPartners.VISIT_DETAILS}?checkinId=${visitId}`, null, (response, hasError) => {
      const visitData = {
        userName: response.userName,
        designation: response.designation,
        checkinDate: response.checkinDate,
        surveylist: response.surveylist,
        products: response.products,
        feedback: response.feedback
      }
      this.setState({ visitData });

    }, this.loadingFunction.bind(this), {
        method: 'GET',
        isShowSuccess: false,
        isProceedOnError: false
      });
  }
  handleDateTypeChange(name, value, obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) return;

    if (value && value.value)
      this.getUserList(value.value);
    this.setState({ [name]: value });
  }
  loadingFunction(status) {
    this.setState({ isLoading: status.isLoading });
  }
  listLoadingFunction(status) {
    this.setState({ isListLoading: status });
  }
  details = (designation, date) => {
    return (
      <div>
        <div>
          <span>
            {designation}
          </span>
        </div>
        <div>
          <span>
            {date}
          </span>
        </div>
      </div>
    );
  }
  getData = (rowData) => {
    const data = rowData.map(checkinData => ({
      id: checkinData.checkinId,
      name: checkinData.userName,
      label: this.details(checkinData.designation, checkinData.checkinDate)
    }));
    return data;
  }

  render() {
    const rightHeight = {
      height: this.state.windowHeight - 121
    }
    const leftHeight = {
      height: this.state.windowHeight - 189
    }
    const getVisitData = () => {
      if (!this.state.checkinList) {
        return (
          <div className="text-center p-4">
            Not Found !!
            </div>
        );
      } else if (this.state.isLoading && this.state.isLoading === true) {
        return (
          <div
            className="loadingActionContainer"
            style={{ background: "rgba(245, 245, 245, 0.56)" }}
          >
            <div style={{ margin: "auto", marginTop: "20%", width: "200px" }}>
              <div className="three-cogs fa-3x">
                <i className="fa fa-cog fa-spin fa-2x fa-fw" />
                <i className="fa fa-cog fa-spin fa-1x fa-fw" />
                <i className="fa fa-cog fa-spin fa-1x fa-fw" />
              </div>
            </div>
          </div>
        );
      } else {
        return (<Details visitData={this.state.visitData} />);
      }
    }
    return (
      <ModalBody>
        <div className="overlay_position  p-4">
          <div className="form-Brick-body px-0 py-0">
            <Row className="mx-0">
              <Col lg="3" className="px-0 py-0 " style={{ borderRight: '1px solid #E6E6E6' }}>
                <SearchComponent
                  search={
                    <FieldItem
                      name="duration"
                      type='1'
                      getOnlyInput={true}
                      placeholder="Select"
                      value={this.state.dateType}
                      onChange={this.handleDateTypeChange.bind(this, "dateType")}
                      values={[{ value: 7, label: "Last 7 Days" }, { value: 15, label: "Last 15 Days" }]}
                    />
                  }
                  isPagination={false}
                  isDropDown={false}
                  onSearch={this.getUserList.bind(this)}
                  leftHeight={leftHeight}
                  data={this.state.checkinList !== undefined ? this.getData(this.state.checkinList) : null}
                  onClick={this.state.checkinList !== undefined ? this.getVisitDetails.bind(this) : null}
                  selectedId={this.state.selectedId}
                />
              </Col>
              <Col lg="9" className="px-0 py-0 scrollbar" style={{ overflow: 'auto', ...rightHeight }}>
                {this.state.visitData !== undefined ? getVisitData() : "Not Found !"}
              </Col>
            </Row>
          </div>
        </div>
      </ModalBody>
    );
  }

}
