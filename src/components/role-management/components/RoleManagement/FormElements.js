import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';

export const ROLES = {
    "roleManagementRoleName": {
        name: "roleManagementRoleName",
        placeholder: "Role Name",
        label: "Role Name",
        width: "sm",
        ismandatory: true,
        maxLength: 40,
        minLength: 3,
        regex: /^[a-zA-Z0-9' .-]*$/,
        type: FIELD_TYPES.TEXT
    },
    "roleManagementRoleDesc": {
        name: "roleManagementRoleDesc",
        placeholder: "Description",
        label: "Description",
        width: "sm",
        ismandatory: true,
        maxLength: 40,
        minLength: 3,
        regex: /^[a-zA-Z0-9' .-]*$/,
        type: FIELD_TYPES.TEXT
    }
};