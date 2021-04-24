import React, { Component } from 'react';
import { ModalBody, Row, ModalFooter } from 'reactstrap';
import {
    CustomButton,
    BUTTON_TYPE,
    BUTTON_SIZE,
    COLOR
} from '@6d-ui/buttons';
import { FieldItem, FIELD_TYPES } from '@6d-ui/fields';


export default class ChannelSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleChange(name, value, obj) {
        const {isTouched} = obj || {isTouched : false};
        if(isTouched) return;
        if (!isTouched && value) {
            this.setState({ [name]: value, selectedChannelType: value.value,selectedParentChannelType: value.type});
        }else
            this.setState({ [name]: value});
    }

    nextBtn(){
        if(this.state.selectedChannelType)
            this.props.onSelect(this.state.selectedChannelType,this.state.selectedParentChannelType)
        else
            this.props.setNotification({
                message: this.props.messagesUtil.EMPTY_CHANNEL_TYPE_MSG, 
                hasError: true, 
                timestamp: new Date().getTime()
            });
    }

    render(){
        return (
            <ModalBody className="bg-white">
                <Row className="mx-0">
                    <FieldItem
                        label="Select Channel Type"
                        values={this.props.channelTypeOptions}
                        value={this.state.nestedDropDown}
                        type={FIELD_TYPES.NESTED_DROP_DOWN}
                        width="sm"
                        onChange={this.handleChange.bind(this, "nestedDropDown")}
                        touched={false}
                        error=""
                        placeholder="Select"
                        disabled={false}
                    />
                </Row>
                <ModalFooter>
                    <CustomButton
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.MEDIUM}
                        color={COLOR.PRIMARY}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={this.props.onCancel}
                    />
                    <CustomButton
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.MEDIUM}
                        align="right"
                        label="Next"
                        isButtonGroup={true}
                        onClick={this.nextBtn.bind(this)}
                    />
                </ModalFooter>
            </ModalBody>
        )
    }
}
