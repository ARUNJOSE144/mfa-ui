import React from 'react';
import _ from 'lodash';
import { Row } from 'reactstrap';
import {FieldItem} from "@6d-ui/fields";


const parseValue = (value, type, options) => {
    if (type === "1") {
        const valueType = typeof value;
        if (valueType !== 'undefined' && valueType !== 'string' && valueType !== 'number' && valueType !== 'boolean') return value.value;
        if (!options) return;
        for (let i = 0; i < options.length; i++) {
            if (String(options[i].value) === String(value)) return options[i].label;
        }
    }else{
        return value;
    }
}


const FieldRow = props => {
    const { fieldArray, isView } = props;
    return (
        fieldArray
            ? <Row className="mx-0">
                {
                    fieldArray.map(
                        field => isView
                            ? <FieldItem {...field}
                                key={field.name}
                                // value={field.type === '1' ? props[field.name] && props[field.name].value : props[field.name]}
                                value={parseValue(props[field.name], field.type,
                                    (props.fields && props.fields[field.name] && props.fields[field.name].values))}
                                key={field.fieldId}
                                width="md"
                                type="11"
                            />
                            : <FieldItem {...field}
                                key={field.name}
                                value={props[field.name]}
                                onChange={props.onChange.bind(null, field.name)}
                                touched={props.fields && props.fields[field.name] && props.fields[field.name].hasError}
                                error={props.fields && props.fields[field.name] && props.fields[field.name].errorMsg}
                                key={field.fieldId}
                                values={props.fields && props.fields[field.name] && props.fields[field.name].values}
                                width="md"
                            />
                    )
                }
            </Row>
            : null
    )
}

const FormBrick = props => {
    const { fieldGroup, isView = false } = props;
    const objArr = _.map(_.toPairs(fieldGroup.fields), field => ({ ...field[1], fieldId: field[0] }))
    // _.toArray(fieldGroup.fields);
    const fieldRows = [];
    for (let i = 0; i < objArr.length;) {
        fieldRows.push(<FieldRow isView={isView} key={i} fieldArray={objArr.slice(i, i += 3)} {...props} />);
    }

    return (
        <div className="container form-Brick-body mb-3">
            {/* <Row className="mx-0">
                    <FieldItem
                        {...FIELDS.roleName}
                        value={this.state.roleName}
                        onChange={this.handleChange.bind(this)}
                        touched={this.state.fields.roleName && this.state.fields.roleName.hasError}
                        error={this.state.fields.roleName && this.state.fields.roleName.errorMsg} />
                    <FieldItem
                        {...FIELDS.roleDesc}
                        value={this.state.roleDesc}
                        onChange={this.handleChange.bind(this)}
                        touched={this.state.fields.roleDesc && this.state.fields.roleDesc.hasError}
                        error={this.state.fields.roleDesc && this.state.fields.roleDesc.errorMsg} />
                </Row> */}

            {fieldRows}

        </div>
    )
}

export default FormBrick;