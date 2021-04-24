
import _ from 'lodash';
import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { Col, Collapse, Container, Row } from 'reactstrap';
import { BUSINESS_LOCATION_GROUP } from '../util/ChannelTypeFields';
import RadioInput from './RadioInput';

export default class FormCollapse extends Component {
    constructor(props) {
        super(props);
        this.state = { collapse: this.props.collapse === true ? true : false };
        this.toggle = this.toggle.bind(this);
        this.renderFields = this.renderFields.bind(this);
        this.getIsMandatory = this.getIsMandatory.bind(this);
        this.getIsChecked = this.getIsChecked.bind(this);
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    getIsMandatory(fieldId) {
        const { selectedAttributes } = this.props;
        return _.has(selectedAttributes, fieldId) && selectedAttributes[fieldId].isMandatory;
    }

    getIsChecked(fieldId) {
        const { selectedAttributes } = this.props;
        return _.has(selectedAttributes, fieldId);
    }

    handleCheckboxChange = (key, changefunc) => (evt) => {
        changefunc(key, evt.target.checked);
    }

    renderFields(fields, name) {

        const inputRows = [];
        _.forIn(fields, (field, key) => {
            inputRows.push(
                <Row className="form-card-body" key={key}>
                    <Col xs="8" className="align-items-center d-flex">
                        <RadioInput
                            checked={this.getIsChecked(key)}
                            handleChange={this.handleCheckboxChange(key, this.props.handleAttributeSelect)}
                            label={field.label} />
                    </Col>
                    <Col xs="4">
                        <Switch
                            checked={this.getIsMandatory(key)}
                            fieldId={key}
                            handleChange={this.handleCheckboxChange(key, this.props.handleMandatorySelect)} />
                    </Col>
                </Row>
            )
        });

        return (
            <Container>
                <Row className="form-card-header">
                    <Col xs="8">{`${name} (Attributes)`}</Col>
                    <Col xs="4" className="text-danger">Mandatory</Col>
                </Row>
                {inputRows}
            </Container>
        )
    }

    render() {
        let disabledFields = [];
        if (this.props.hasMultiLocation) {
            disabledFields.push(BUSINESS_LOCATION_GROUP.FIELDID_LATTITUDE, BUSINESS_LOCATION_GROUP.FIELDID_LONGITUDE);
        }
        return (
            <div className={this.props.className}>
                <div onClick={this.toggle} className="d-flex align-items-center mb-3">
                    <span className="collapse-toggler-bullet">
                        <i className={`fa fa-${this.state.collapse ? 'minus' : 'plus'}`} />
                    </span>
                    <span className="form-collapse-title">{this.props.name}</span>
                </div>
                <Collapse isOpen={this.state.collapse}>
                    <div className="form-card">
                        <Container fluid>
                            <Row>
                                {
                                    this.props.fields ? <Col md="6">
                                        {/* {this.renderFields(this.props.fields, this.props.name)} */}
                                        {this.props.attributeComp && this.props.attributeComp({ fields: this.props.fields, name: this.props.name, disabledFields })}
                                    </Col> : null
                                }
                                {
                                    this.props.subGroups && this.props.subGroups.map(subGroup => {
                                        return (<Col md="6" key={subGroup.groupId}>
                                            {this.props.attributeComp && this.props.attributeComp({ fields: subGroup.fields, name: subGroup.name })}
                                            {/* {this.renderFields(subGroup.fields, subGroup.name)} */}
                                        </Col>)
                                    })
                                }
                                {
                                    this.props.groupId === BUSINESS_LOCATION_GROUP.GROUPID
                                    && (
                                        this.props.isView
                                            ? <Col xs="12" className="form-card-body">
                                                <div xs="8" className="align-items-center d-flex pt-2">
                                                    <i style={{fontSize:'120%'}} className={`fa ${this.props.hasMultiLocation ? 'fa-check-square-o text-success' : 'fa-square-o text-danger'}`} />
                                                    <span className="radio-label ml-2">has multiple locations</span>
                                                </div>
                                            </Col>
                                            : <Col xs="12" className="form-card-body">
                                                <div xs="8" className="align-items-center d-flex pt-2">
                                                    <Switch checked={this.props.hasMultiLocation} handleChange={this.props.handleMultiLocationSelect} /><span className="radio-label ml-2">has multiple locations</span>
                                                </div>
                                            </Col>
                                    )
                                }
                            </Row>
                        </Container>
                    </div>
                </Collapse>
            </div>
        );
    }
}
