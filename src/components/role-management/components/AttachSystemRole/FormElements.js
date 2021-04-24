import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';
export const DecimalRegex = /^\d*\.?\d{0,2}$/;
export const DecimalRegexUnits = /^[0-9]*$/;

export const CommissionUserAttachmnet = {
  "user": {
    name: "user",
    label: "User Name",
    width: "sm",
    placeholder: " User Name",
    type: FIELD_TYPES.DROP_DOWN,
    ismandatory: true,
  }, "systemRole": {
    name: "systemRole",
    label: "System Role",
    width: "sm",
    placeholder: "System Role",
    type: FIELD_TYPES.DROP_DOWN,
    ismandatory: true,

  }

}