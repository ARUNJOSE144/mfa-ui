import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import _ from 'lodash';
import { Switch } from '@6d-ui/form';
import RadioInput from './RadioInput';

const handleCheckboxChange = (key, changefunc) => (evt) => {
    changefunc(key, evt.target.checked);
}

function getIsChecked(fieldId, selectedAttributes) {
    return _.has(selectedAttributes, fieldId);
}

function getIsMandatory(fieldId, selectedAttributes) {
    return _.has(selectedAttributes, fieldId) && selectedAttributes[fieldId].isMandatory;
}

const AttributeSelect = props => {
    const { fields, name, handleAttributeSelect, handleMandatorySelect, selectedAttributes, disabledFields = [] } = props;

    const inputRows = [];
    _.forIn(fields, (field, key) => {
        if (disabledFields.indexOf(parseInt(key)) < 0) {
            inputRows.push(
                <Row className="form-card-body" key={key}>
                    <Col xs="8" className="align-items-center d-flex">
                        <RadioInput
                            checked={field.isMandatory || getIsChecked(key, selectedAttributes)}
                            handleChange={handleCheckboxChange(key, handleAttributeSelect)}
                            label={field.label}
                            disabled={field.isMandatory} />
                    </Col>
                    <Col xs="4">
                        <Switch
                            checked={field.isMandatory || getIsMandatory(key, selectedAttributes)}
                            fieldId={key}
                            handleChange={handleCheckboxChange(key, handleMandatorySelect)}
                            disabled={field.isMandatory} />
                    </Col>
                </Row>
            )
        }

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

export default AttributeSelect;