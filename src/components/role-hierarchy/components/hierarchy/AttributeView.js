import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import _ from 'lodash';

function getIsMandatory(fieldId, selectedAttributes) {
    return _.has(selectedAttributes, fieldId) && selectedAttributes[fieldId].isMandatory===1;
}

function getIsChecked(fieldId, selectedAttributes) {
    return _.has(selectedAttributes, fieldId);
}


const AttributeView = props => {
    const { fields, name, selectedAttributes, disabledFields=[] } = props;
    const faStyle = {
        fontSize: '120%'
    }

    const inputRows = [];
    _.forIn(fields, (field, key) => {
        const isChecked = getIsChecked(key, selectedAttributes);
        const isMandatory = getIsMandatory(key, selectedAttributes)
        if (disabledFields.indexOf(parseInt(key)) < 0) {
            inputRows.push(
                <Row className="form-card-body" key={key}>
                    <Col xs="8" className={`align-items-center d-flex ${isChecked ? '' : ' text-muted'}`}>
                        <i style={faStyle} className={`fa ${isChecked ? 'fa-check-square-o text-success' : 'fa-square-o text-danger'}`} />
                        <span className="ml-1">{field.label}</span>
                    </Col>
                    <Col xs="4">
                        {isChecked ? (<span className={isMandatory ? 'text-danger' : ''}>{isMandatory ? 'Yes' : 'No'}</span>) : null}
                    </Col>
                </Row>
            )
        }
    });

    return (
        inputRows.length>0
        ?<Container>
            <Row className="form-card-header">
                <Col xs="8">{`${name} (Attributes)`}</Col>
                <Col xs="4" className="text-danger">Mandatory</Col>
            </Row>
            {inputRows}
        </Container>
        :null
    )

}

export default AttributeView;