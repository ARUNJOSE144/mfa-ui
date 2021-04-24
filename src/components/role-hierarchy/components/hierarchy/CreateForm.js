import _ from 'lodash';
import React, { Component } from 'react';
import { ModalBody, ModalFooter, Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import FieldItem from '../../../generic/fields/elements/fieldItem/FieldItem';
import { validateForm } from '../../../generic/fields/elements/formValidator/FormValidator';
import { CREATE_ROLE as FormElements } from './FormElements';




export default class CreateForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeName: '',
            role: '',
            msisdn: '',
            roleOptions: [],
            fields: [[
                'role',
            ]
            ]
        }
    }

    componentDidMount() {
        var reqData = { hierarchyId: this.props.hierarchyId }
        var self = this;
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.GET_AVAILABLE_ROLES, reqData, function (resp, hasError) {
            var options = self.createSelectOptionss(resp.allRoles, 'roleId', "roleName");
            self.setState({ roleOptions: options })
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });
    }

    onSubmitClick() {
        const preValidate = (name, value, field) => {
            if (name === 'roleId')
                return { hasError: false, errorMsg: '' };
        }
        let hasError = false;
        const fields = this.state.fields;
        const that = this;
        _.forEach(FormElements, function (value, name) {
            const validate = validateForm(name, that.state[name], FormElements[name], preValidate, null);
            console.log("VALIDATE", name, validate);
            if (validate) {
                if (hasError === false) hasError = validate.hasError;
                fields[name] = validate;
            } else {
                fields[name] = { hasError: false, errorMsg: '' };
            }
        });
        this.setState({ fields });

        console.log("prrrrps : ", this.props);
        if (hasError === true) {
            this.props.setNotification({
                message: this.props.messagesUtil.EMPTY_FIELD_MSG,
                hasError: true,
                timestamp: new Date().getTime()
            });
            return false;
        }






        var node = this.props.node;
        var parentRoleId = this.props.parentRoleId;
        var reqData = {
            "nodeId": "",
            "roleName": this.state.role.label,
            "roleId": this.state.role.value,
            "parentId": parentRoleId,
            "hierarchyId": this.props.hierarchyId,
            "isInBetween": this.props.isInBetween
        }
        console.log("New Node Details : ", reqData);

        var self = this;
        this.props.ajaxUtil.sendRequest(this.props.const_SalesHierarchy.ADD_NEW_ROLE_IN_HIERARCHY_URL, reqData, function (resp, hasError) {
            console.log("response For Adding New Node : ", resp);
            self.props.onCancel();
        }, this.props.loadingFunction, { method: 'POST', isShowSuccess: false });


    }

    /* handleChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) {
            value = this.state[name];
        }
        else if (name != null && name != undefined && name != "") {
            this.setState({ [name]: value });
        }

        console.log("state : ", this.state);

    } */

    handleChange(name, value, obj) {

        const { isTouched } = obj || { isTouched: false };
        if (isTouched) {
            value = this.state[name];
        }
        else if (name !== null && name !== undefined && name !== "") {
            this.setState({ [name]: value });
        }

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
        this.setState({ [name]: value, fields });


    }

    createSelectOptionss = (data, key, value) => {
        var options = [];
        for (var i = 0; i < data.length; i++) {
            var opt = {};
            opt.value = data[i][key];
            opt.label = data[i][value];
            options.push(opt);
        }
        return options;
    }

    render() {
        return (
            <ModalBody className="hierarchy-modal-body arun" style={{ minHeight: "80%" }}>
                <div className="overlay_position scrollbar" style={{ minHeight: "400px" }}   >
                    <div className="form-Brick-body" >
                        <Row className="mx-0">

                            <FieldItem
                                {...FormElements.role}
                                value={this.state.role}
                                values={this.state.roleOptions}
                                onChange={this.handleChange.bind(this, FormElements.role.name)}
                                touched={this.state.fields.role && this.state.fields.role.hasError}
                                error={this.state.fields.role && this.state.fields.role.errorMsg}
                                ismandatory={true}
                                width="md" />
                        </Row>
                    </div>
                </div>
                <ModalFooter>
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={() => this.props.onCancel(false)}
                    />
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.PRIMARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Create"
                        isButtonGroup={true}
                        onClick={this.onSubmitClick.bind(this)}
                    />
                </ModalFooter>
            </ModalBody>
        );
    }

    validate = (value) => {
        if (value === null && value !== undefined && value !== "") {


        }
    }

}