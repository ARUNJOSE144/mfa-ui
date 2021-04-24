import { ajax } from '@6d-ui/ajax';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, CustomButton } from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
import _ from 'lodash';
import React, { Component } from 'react';
import Pager from 'react-pager';
import { ModalBody, ModalFooter, Row } from 'reactstrap';

class ComplexSelectorModal extends Component {
  constructor(props) {
    super(props);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    const selectedItems = [];
    if (this.props.selectedItems) {
        this.props.selectedItems.forEach((item,index) => {
          selectedItems.push(item);
      });
    }
    this.state = {
      windowHeight : 0,
      selectedItems:selectedItems,
      searchParam:'',
      listItems:this.props.listItems,
      allListItems : [],
      ROW_COUNT : 10,
      pageNumber : 1,
      totalPages : 0,
      view : (this.props.listItems && this.props.listItems.length > 0 ?
        {value : 1,
      label : 'Selected'} : {value : 3,
        label : 'Initial Pagination'})
    };
    this.searchAllList = this.searchAllList.bind(this);
    this.searchAllListDeb = _.debounce(isReset => {
        this.searchAllList(isReset);
      }, 500);
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    if(this.state.view.value === 3)
      this.searchAllList();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }
  updateWindowDimensions() {
    this.setState({ windowHeight: window.innerHeight });
  }
  handleSelect(name, value) {
    if (this.props.isView)
      return false;

    var selectedItems = this.state.selectedItems;
    if (_.some(selectedItems, value)) {
      selectedItems = [];
      this.state.selectedItems.forEach(item => {
        if (item.value !== value.value)
          selectedItems.push(item);
      });
    } else {
      if(this.props.isRadioButton){
        selectedItems = [];
        selectedItems.push(value);
      }else {
        selectedItems.push(value);
      }
    }
    this.setState({selectedItems:selectedItems});
  }
  onSearch(name,value,obj) {
    const { isTouched } = obj || { isTouched: false };
    if (isTouched) {
      return false;
    }
    switch (name) {
      case 'searchParam':
        if (this.state.view.value !== 1) {
          //API Search
          this.setState({searchParam:value},
            () => {
              this.searchAllListDeb(true);
            });
        } else {
          //Selected Items Search
          const searchList = [];
          if (_.isNull(value)) {
            this.setState({listItems:this.props.listItems, searchParam:value});
          } else {
            if (this.props.listItems) {
              this.props.listItems.forEach((item,index) => {
                if (_.toLower(item.label).indexOf(_.toLower(value)) >= 0) {
                  const temp = {
                    "label" : item.label,
                    "value" : item.value
                  }
                  searchList.push(temp);
                }
              });
              this.setState({listItems:searchList, searchParam:value});
            } else {
              this.setState({searchParam:value});
            }
          }
        }
        break;
        case 'view' :
          this.setState({[name] : value, searchParam : ''},
            () => {
              if (value.value !== 1)
                this.searchAllList(true);
              else {
                this.setState({listItems:this.props.listItems});
              }
            });

        break;
      default:
        this.setState({[name] : value});
        break;
    }

  }
  searchAllList(isReset) {
    const request = {
      pageNumber: isReset === true ? 1 : this.state.pageNumber || 1,
      rowCount: this.state.ROW_COUNT,
      totalRecords: this.state.totalRecords || "",
      keyword: this.state.searchParam,
    }
    const api_request = this.props.buildRequest(request);
    ajax (this.props.url, api_request, this.props.ajaxUtil.makeCallBack, this.populateList.bind(this), this.loadingFunction.bind(this), {
      isShowSuccess : false,
      authKey : this.props.authKey,
      isProceedOnError : false,
      firstLoad : false
    });
    this.setState({allListItems : []});
  }
  populateList(response, hasError) {
    const parsedResponse = this.props.parseResponse(response);
    if (!parsedResponse)
      return false;

    const totalPages = ((parsedResponse.totalRecords && parsedResponse.totalRecords !== 0 && this.state.ROW_COUNT && this.state.ROW_COUNT !== 0) ?
                                    Math.ceil(parsedResponse.totalRecords / this.state.ROW_COUNT)
                                    : this.state.totalPages || 0);
    this.setState({allListItems : parsedResponse.data, totalPages, totalRecords : parsedResponse.totalRecords});
  }
  loadingFunction(obj) {
    this.setState(obj);
  }
  render() {
    const height = {
      height: this.state.windowHeight - 136
    }
    const getFooter = () => {
      return (
        <div className="clearfix">
          {getPagination()}
          {submitButton()}
        </div>
      );
    }
    const submitButton = () => {
      if (!this.props.isView) {
        return (
          <CustomButton
            style={BUTTON_STYLE.BRICK}
            type={BUTTON_TYPE.PRIMARY}
            size={BUTTON_SIZE.LARGE}
            align="right"
            label={`Select${this.props.isRadioButton ? '' : (this.state.selectedItems ? ` (${this.state.selectedItems.length})` : ' (0)') }`}
            onClick={()=>{this.props.onSubmitClick(this.state.selectedItems)}}
          />
        );
      }
    }
    const getPagination = () => {
      if (this.state.view.value !== 1 && !this.state.isLoading) {
        if(this.state.allListItems && this.state.allListItems.length > 0){
          return (
            <div className="float-left">
              <Pager
                total={this.state.totalPages ? this.state.totalPages : 0}
                current={this.state.pageNumber ? this.state.pageNumber - 1 : 0}
                visiblePages={1}
                titles={{ first: '<<', last: '>>', prev: '<', next: '>' }}
                className="pagination-SelectorModal"
                onPageChanged={pageNumber => this.setState({ pageNumber: pageNumber + 1 }, () => this.searchAllList(false))}
              />
            </div>
          );
        }
      }
    }
    const getItems = (listItems) => {
      if (!listItems || listItems.length===0) {
        return(
          <div className="text-center">
            No data !
          </div>
        );
      } else {
        return (
          <FieldItem
            isListedInput={true}
            listedClassName="selectModalList"
            value={this.state.selectedItems}
            type={this.props.isRadioButton ? FIELD_TYPES.RADIO_BUTTON : FIELD_TYPES.CHECK_BOX}
            values={listItems}
            value={this.props.isRadioButton ? (this.state.selectedItems ? this.state.selectedItems[0] : '') : this.state.selectedItems}
            onChange={this.handleSelect.bind(this, "selectedItems")}
          />
        );
      }
    }
    const getViewKeys = () => {
      if (this.state.view.value !== 3) {
        return (
          <Row  className="mx-0">
            <div style={{width: '100%', padding: '10px 0px 0px 0px'}}>
              <FieldItem
                getOnlyInput={true}
                value={this.state.view}
                type={FIELD_TYPES.RADIO_BUTTON}
                values={[
                  {
                    value : 1,
                    label : 'Selected'
                  },
                  {
                    value : 2,
                    label : 'All'
                  }
                ]}
                onChange={this.onSearch.bind(this, "view")}
              />
            </div>
          </Row>
        );
      }
    }
    const getListItems = () => {
      if (this.state.isLoading) {
        return (
          <div className="text-center">Loading..</div>
        )
      } else {
        if (this.state.view.value === 1) {
          return getItems(this.state.listItems);
        } else {
          return getItems(this.state.allListItems);
        }
      }
    }
    return (
        <ModalBody>
          <div className="overlay_position scrollbar" style={height}>
            <Row  className="mx-0">
              <div style={{width: '100%', padding: '10px 0px 0px 0px'}}>
                <FieldItem
                  placeholder="Search Here"
                  value={this.state.searchParam}
                  getOnlyInput={true}
                  onChange={this.onSearch.bind(this, 'searchParam')}
                />
              </div>
            </Row>
            {getViewKeys()}
            <Row  className="mx-0">
              <div style={{width: '100%', padding: '10px 0px 0px 0px'}}>
                {getListItems()}
              </div>
            </Row>
          </div>
          <ModalFooter>
            {getFooter()}
          </ModalFooter>
        </ModalBody>
    );
  }
}

export default ComplexSelectorModal;
