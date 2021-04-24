import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE, COLOR, CustomButton } from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';
import React, { Component } from 'react';
import { ModalBody, ModalFooter, Row } from 'reactstrap';

class SearchFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "userId"    : props.userId,
      "userName"  : props.userName,
      "firstName" : props.firstName,
      // "msisdn"    : props.msisdn,
      // "channelType": props.channelType,
      // "designationId": props.designationId,
      // "desigOptions" : props.desigOptions
    }
  }

  onSearch(){
   const data = {
      "userId" : this.state.userId,
      "userName" : this.state.userName,
      "firstName" : this.state.firstName,
      // "msisdn": this.state.msisdn,
      // "designationId" :this.state.designationId && this.state.designationId.value ? this.state.designationId.value : this.state.designationId,
      // "channelType" : this.state.channelType && this.state.channelType.value ? this.state.channelType.value : this.state.channelType,
      // "desigOptions" : this.state.desigOptions
    };
    this.props.onSubmitClick(data);
  }

  handleChange(name, value, obj) {
    const {isTouched} = obj || {isTouched : false};
    if (!isTouched) {
      if(name === 'channelType'){
        // if (!value) {
        //   this.setState({ [name]: value, desigOptions: null});
        //   return false;
        // }
        // const designationEntites = [];
        // const optionList = [];
        // this.props.ajaxUtil.sendRequest (`${this.props.url_SalesHierarchy.VIEW_NODE_URL}/${value.value}`, {}, (response, hasError) => {
        //     if(response && response.channelTypeNodes && response.channelTypeNodes.organisationNodes){
        //         designationEntites.push(...treeToArray(response.channelTypeNodes.organisationNodes));
        //         designationEntites.forEach((options) => {
        //         const temp = {
        //                 'value': options.nodeId,
        //                 'label': options.nodeName
        //             }
        //             optionList.push(temp);
        //         });
        //     }
        //     this.setState({ [name]: value, desigOptions: optionList});
        // }, null , { method: 'GET', isShowSuccess: false, isProceedOnError:false });

      } else
        this.setState({ [name]: value });
    }
  }

  render() {
    return (
      <div>
        <ModalBody>
          <Row className="mx-0 dataTableFormgroup">
            <FieldItem
              label="User Id"
              width="md"
              type={FIELD_TYPES.TEXT}
              value={this.state.userId}
              onChange={this.handleChange.bind(this, "userId")}
              touched={false}
              error=""
            />
            <FieldItem
              label="User Name"
              width="md"
              type={FIELD_TYPES.TEXT}
              value={this.state.userName}
              onChange={this.handleChange.bind(this, "userName")}
              touched={false}
              error="" />
            <FieldItem
              label="First Name"
              width="md"
              type={FIELD_TYPES.TEXT}
              value={this.state.firstName}
              onChange={this.handleChange.bind(this, "firstName")}
              touched={false}
              error="" />
            
          </Row>
          <ModalFooter>
            <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.SECONDARY}
                size={BUTTON_SIZE.LARGE}
                color={COLOR.PRIMARY}
                align="right"
                label="Cancel"
                isButtonGroup={true}
                onClick={this.props.onCancel}
            />
            <CustomButton
                style={BUTTON_STYLE.BRICK}
                type={BUTTON_TYPE.PRIMARY}
                size={BUTTON_SIZE.LARGE}
                align="right"
                label="Search"
                isButtonGroup={true}
                onClick={() => {this.onSearch();this.props.onCancel();}}
            />
          </ModalFooter>
        </ModalBody>

      </div>
    );
  }
}

export default SearchFilter;
