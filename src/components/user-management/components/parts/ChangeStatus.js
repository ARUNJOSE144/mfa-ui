import React, { Component } from 'react';
import { ModalBody, ModalFooter, Row } from 'reactstrap';
import {
    CustomButton,
    BUTTON_STYLE,
    BUTTON_TYPE,
    BUTTON_SIZE,
    COLOR
} from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';

const statusOptions = [
    {value:0,label:"Inactive"},
    {value:1,label:"Active"},
    {value:2,label:"Resigned"},
    {value:3,label:"Blocked"}
];

export default class ChangeStatus extends Component {
    
    constructor(props) {
        super(props); 
        const showOpts =[];
        statusOptions.forEach((opt)=>{
            if(opt.value !== this.props.status){
              showOpts.push(opt);
            }
        });  
        this.state={
            statusOpts  : showOpts
        }       
        this.changeStatus = this.changeStatus.bind(this);
    }
    changeStatus(){
        const {selectedStatusId} = this.state;
        this.props.ajaxUtil.sendRequest (`${this.props.url_User.CHANGE_STATUS}${this.props.user}&status=${selectedStatusId}`, {},(response, hasError) => {
            if(!hasError){
                this.props.setNotification({
                    message: response.responseMsg,
                    hasError: hasError,
                    timestamp: new Date().getTime()
                });
                this.props.toggleAction();              
                this.props.onSuccess(selectedStatusId);
             }        
          }, this.props.loadingFunction, { method: 'GET', isShowSuccess: false});
    }

    handleChange(name, value, obj) {
        const {isTouched} = obj || {isTouched : false};
        if (!isTouched && value) {
            this.setState({ [name]: value, selectedStatusId: value.value });
        }else
            this.setState({ [name]: value});
    } 

    render(){          
      return (
        <ModalBody className="bg-white">
            <Row className="mx-0">
                <FieldItem
                    label="Select Status"
                    values={this.state.statusOpts}
                    value={this.state.nestedDropDown}
                    type={FIELD_TYPES.NESTED_DROP_DOWN}
                    width="sm"
                    onChange={this.handleChange.bind(this, "nestedDropDown")}
                    placeholder="Select"
                    disabled={false}
                    touched={false}
                    error=""
                />
            </Row>
            <ModalFooter>
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.SECONDARY}
                    size={BUTTON_SIZE.MEDIUM}
                    color={COLOR.PRIMARY}
                    align="right"
                    label="Cancel"
                    isButtonGroup={true}
                    onClick={this.props.toggleAction}
                />
                <CustomButton
                    style={BUTTON_STYLE.BRICK}
                    type={BUTTON_TYPE.PRIMARY}
                    size={BUTTON_SIZE.MEDIUM}
                    align="right"
                    label="Change"
                    isButtonGroup={true}
                    onClick={this.changeStatus}
                />
            </ModalFooter>
        </ModalBody>
      );
    }
}