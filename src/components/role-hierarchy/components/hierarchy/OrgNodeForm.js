import React, { Component } from 'react';
import { ModalBody, ModalFooter, Row } from 'reactstrap';
import { BUTTON_SIZE, BUTTON_STYLE, BUTTON_TYPE } from '../../../generic/buttons/elements/ButtonTypes';
import { CustomButton } from '../../../generic/buttons/elements/CustomButton';
import FieldItem from '../../../generic/fields/elements/fieldItem/FieldItem';
import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';




export default class OrgNodeForm extends Component {
    constructor(props) {
        super(props);
        const { node } = this.props;
        const roles = node && node.roles && node.roles.map(role => ({ value: role.roleId, label: role.roleName }));
        this.state = {
            fields: {},
            windowHeight: 0,
            name: (node ? node.name : undefined),
            roles,
            roleOptions: []
        };

        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.fields = {
            name: {
                name: "name",
                label: "Designation",
                width: "xs",
                maxLength: 20,
                ismandatory: true
            },
            roles: {
                name: "roles",
                label: "Roles",
                width: "xs",
                ismandatory: true
            }
        }
    }
    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ roleOptions: nextProps.allRoles })
    }

    updateWindowDimensions() {
        this.setState({ windowHeight: window.innerHeight });
    }

    handleChange(name, value, obj) {
        const { isTouched } = obj || { isTouched: false };
        if (isTouched) {
            value = this.state[name];
        }
        this.setState({ [name]: value });
    }

    onSubmitClick() {
        const { node, parent, action, channelType, onSubmitCallBack } = this.props;
        const { name, roles } = this.state;

        const rolesForReq = roles && roles.map(role => ({ roleId: role.value, roleName: role.label }));
        const request = {
            "nodeName": name,
            "roles": rolesForReq,
            channelType,
        };
        let url;

        if (action === 'update') {
            request.nodeId = node ? node.nodeId : 0;
            request.parentId = node ? node.parentId : 0
            url = this.props.const_SalesHierarchy.UPDATE_DESIG_URL;
        } else if (action === 'create') {
            request.parentId = parent ? parent.nodeId : 0;
            url = this.props.const_SalesHierarchy.ADD_DESIG_URL;
        }

        if (url) {
            this.setState({ isLoading: true });
            this.props.ajaxUtil.sendRequest(url, request, (response, hasError) => {
                this.setState({ isLoading: false });
                if (!hasError) {
                    onSubmitCallBack({ modal: false, selected: null });
                }
            }, this.props.loadingFunction, { });
        }
    }

    render() {
        const height = {
            height: this.state.windowHeight - 131
        }

        const { disabled } = this.props

        return (
            <ModalBody>
                <div className="overlay_position" style={height}>
                    <Row className="noMargin dataTableFormgroup">
                        {
                            !disabled
                                ? <FieldItem
                                    {...this.fields.name}
                                    value={this.state.name}
                                    onChange={this.handleChange.bind(this, 'name')}
                                    touched={this.state.fields.name && this.state.fields.name.hasError}
                                    error={this.state.fields.name && this.state.fields.name.name}
                                />
                                : <FieldItem
                                    {...this.fields.name}
                                    value={this.state.name}
                                    type={FIELD_TYPES.TEXT_BOX_DISABLED}
                                />

                        }
                        {
                            !disabled
                                ? <FieldItem
                                    {...this.fields.roles}
                                    type="2"
                                    value={this.state.roles}
                                    values={this.state.roleOptions}
                                    onChange={this.handleChange.bind(this, "roles")}
                                    touched={this.state.fields.roles && this.state.fields.roles.hasError}
                                    error={this.state.fields.roles && this.state.fields.roles.name}
                                />
                                : <FieldItem
                                    {...this.fields.roles}
                                    type={FIELD_TYPES.TEXT_BOX_DISABLED}
                                    value={this.state.roles ? this.state.roles.map(role => role.label).toString() : ""}
                                />
                        }
                    </Row>
                </div>
                <ModalFooter>
                    {/* <Button
                        className="btn-form btn-block-c"
                        color="secondary-form"
                        onClick={this.props.onCancel}
                    >
                        Cancel
                    </Button> */}
                    <CustomButton
                        style={BUTTON_STYLE.BRICK}
                        type={BUTTON_TYPE.SECONDARY}
                        size={BUTTON_SIZE.LARGE}
                        align="right"
                        label="Cancel"
                        isButtonGroup={true}
                        onClick={this.props.onCancel}
                    />
                    {
                        !disabled && <CustomButton
                            style={BUTTON_STYLE.BRICK}
                            type={BUTTON_TYPE.PRIMARY}
                            size={BUTTON_SIZE.LARGE}
                            align="right"
                            label="Save"
                            isButtonGroup={true}
                            onClick={this.onSubmitClick}
                        />
                        // <Button
                        //     className="btn-form btn-block-c"
                        //     color="primary-form"
                        //     onClick={this.onSubmitClick}
                        // >
                        //     Save
                        // </Button>
                    }

                </ModalFooter>
                {
                    this.state.isLoading && <div className="loadingActionContainer" style={{ background: "rgba(245, 245, 245, 0.56)" }}>
                        <div style={{ margin: 'auto', marginTop: '40%', width: '200px' }}>
                            <div className="three-cogs fa-3x">
                                <i className="fa fa-cog fa-spin fa-2x fa-fw"></i>
                                <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                                <i className="fa fa-cog fa-spin fa-1x fa-fw"></i>
                            </div>
                        </div>
                    </div>
                }
            </ModalBody>
        )
    }

}