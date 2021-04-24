import { validateForm } from '../formValidator/FormValidator';
import { useState, useEffect, useCallback } from "react";
import _ from 'lodash';

export default function useFieldItem(FIELDS, initialValues = {}, options = {}) {

    const { preValidation, postValidation, onValueChange } = options;

    const [values, setValues] = useState(initialValues);
    const [fields, setFields] = useState({});
    useEffect(() => {
        if (!_.isEmpty(initialValues))
            setValues(initialValues);
    }, [initialValues])

    const changeHandler = (name, value, obj) => {
        const { isTouched } = obj || {
            isTouched: false
        };
        if (isTouched) {
            value = values[name];
        }

        const fieldValues = fields;
        if (FIELDS[name]) {
            const validate = validateForm(name, value, FIELDS[name], preValidation, postValidation);
            if (validate) {
                fieldValues[name] = validate;
            } else {
                fieldValues[name] = {
                    hasError: false,
                    errorMsg: ''
                };
            }
        }

        const [newValues = null] = onValueChange ? onValueChange(name, value, values, fieldValues) : [];

        setValues(values => {
            if (newValues != null) return newValues;

            return ({
                ...values,
                [name]: value
            })

        })
        setFields(fieldValues)

        if (isTouched && fields[name] && fields[name].hasError) {
            setFields(fields);
            return false;
        }
    }

    const validator = (keys) => {
        const fieldValues = {...fields};
        keys.map((key) => {
            const validate = validateForm(key, values[key], FIELDS[key], preValidation, postValidation);
            if (validate) {
                fieldValues[key] = validate;
            } else {
                fieldValues[key] = {
                    hasError: false,
                    errorMsg: ''
                };
            }
        }
        );
        const hasError = fieldValues ? Object.values(fieldValues).some(f => f.hasError) : false;
        setFields(fieldValues);
        return hasError;
    }

 
    const valuesReset = () => {
        setValues(initialValues);
        setFields({});
    };


    const handleChange = useCallback(
        changeHandler,
        [FIELDS, values, fields],
    );

    const validateValues = useCallback(
        validator,
        [FIELDS, values, fields],
    );

    const reset = useCallback(
        valuesReset,
        [FIELDS, values, fields],
    );

    return [values, fields, handleChange, { validateValues, reset }]
}
