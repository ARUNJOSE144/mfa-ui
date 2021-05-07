import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';

export const USERS = {

  "userId": {
    "name": "userId",
    "label": "User Id",
    "width": "sm",
    "placeholder": "User Id",
    "type": FIELD_TYPES.TEXT
  },
  "userName": {
    "name": "userName",
    "label": "User Name",
    "width": "sm",
    "placeholder": "User Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' -]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "name": {
    "name": "name",
    "label": "Name",
    "width": "sm",
    "placeholder": "Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' .-]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },

  "contactNumber": {
    "name": "contactNumber",
    "label": "Contact Number",
    "width": "sm",
    "placeholder": "Contact Number",
    "minLength": 10,
    "maxLength": 14,
    /* "regex"       : /(\d{3})(\d{3})(\d{4})/, */
    "ismandatory": false,
    "errorMsg": "Please enter a valid Mobile Number of length 8 to 12 digits.",
    "type": FIELD_TYPES.TEXT
  },
  "emailId": {
    "name": "emailId",
    "label": "Email Id",
    "width": "sm",
    "maxLength": 50,
    "placeholder": "johndoe@yourmail.com",
    "regex": /^[a-z0-9]+[a-z0-9_.-]+[a-z0-9_-]+@[a-z0-9]+[a-z0-9.-]+[a-z0-9]+.[a-z]{2,4}$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "role": {
    "name": "role",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Role",
    "width": "sm",
    "ismandatory": true
  }
};




