import React, { Component } from 'react';
import {
  FieldItem,
  FIELD_TYPES
} from '@6d-ui/fields';
import {
  Row,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import _ from 'lodash';
import {
  CustomButton,
  BUTTON_STYLE,
  BUTTON_TYPE,
  BUTTON_SIZE,
} from '@6d-ui/buttons';

class SelectorModal extends Component {
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
      listItems:this.props.listItems
    };
  }
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
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

    const selectedItems = this.state.selectedItems;
    if (_.includes(selectedItems, value)) {
        _.pull(selectedItems,value);
    } else {
      if(this.props.isRadioButton){
        selectedItems.length = 0
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
    this.setState({searchParam:value});
    const searchList = [];
    if (_.isNull(value)) {
      this.setState({listItems:this.props.listItems});
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
        this.setState({listItems:searchList});
      }
    }
  }
  render() {
    const height = {
      height: this.state.windowHeight - 136
    }
    const submitButton = () => {
      if (!this.props.isView)
      return (
        <CustomButton
          style={BUTTON_STYLE.BRICK}
          type={BUTTON_TYPE.PRIMARY}
          size={BUTTON_SIZE.LARGE}
          align="right"
          label={`Select (${this.state.selectedItems ? this.state.selectedItems.length : '0'})`}
          onClick={()=>{this.props.onSubmitClick(this.state.selectedItems)}}
        />
      );
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
    return (
        <ModalBody>
          <div className="overlay_position scrollbar" style={height}>
            <Row  className="mx-0">
              <FieldItem
                placeholder="Search Here"
                value={this.state.searchParam}
                getOnlyInput={true}
                onChange={this.onSearch.bind(this, 'searchParam')}
              />
            </Row>
            <Row  className="mx-0">
              <div style={{width: '100%', padding: '10px 0px 0px 0px'}}>
                {getItems(this.state.listItems)}
              </div>
            </Row>
          </div>
          <ModalFooter>
            {submitButton()}
          </ModalFooter>
        </ModalBody>
    );
  }
}

export default SelectorModal;
