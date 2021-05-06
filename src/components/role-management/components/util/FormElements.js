import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';


export const ROLES = {
    "roleId": {
        name: "roleId",
        placeholder: "Role Id",
        label: "Role Id",
        width: "sm",
        type: FIELD_TYPES.TEXT
    },
    "roleName": {
        name: "roleName",
        placeholder: "Role Name",
        label: "Role Name",
        width: "sm",
        ismandatory: true,
        maxLength: 40,
        minLength: 3,
        regex: /^[a-zA-Z0-9' .-]*$/,
        type: FIELD_TYPES.TEXT
    }
};
