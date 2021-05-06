import  FIELD_TYPES  from '../../../generic/fields/elements/fieldItem/FieldTypes';

export const USER_MGMNT = {
  "channelType": {
    "name": "channelType",
    "label": "Channel Type",
    "width": "sm",
    "placeholder": "Channel Type",
    "type": FIELD_TYPES.TEXT
  },
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
  "firstName": {
    "name": "firstName",
    "label": "First Name",
    "width": "sm",
    "placeholder": "First Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' .-]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "lastName": {
    "name": "lastName",
    "label": "Last Name",
    "width": "sm",
    "placeholder": "Last Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' .-]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "empCode": {
    "name": "empCode",
    "label": "Employee Code",
    "width": "sm",
    "placeholder": "Employee Code",
    "maxLength": 20,
    "regex": /^[a-zA-Z0-9 _.-]*$/,
    "ismandatory": false,
    "type": FIELD_TYPES.TEXT
  },
  "msisdn": {
    "name": "msisdn",
    "label": "Mobile Number",
    "width": "sm",
    "placeholder": "(XXX) XXX-XXXX",
    "minLength": 10,
    "maxLength": 14,
    /* "regex"       : /(\d{3})(\d{3})(\d{4})/, */
    "ismandatory": false,
    "errorMsg": "Please enter a valid Mobile Number of length 8 to 12 digits.",
    "type": FIELD_TYPES.TEXT
  }, "telephone": {
    "name": "telephone",
    "label": "Office Number",
    "width": "sm",
    "placeholder": "(XXX) XXX-XXXX",
    "minLength": 10,
    "maxLength": 14,
    /* "regex"      :  /^[0-9]*$/, */
    "ismandatory": true,
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
  "empId": {
    "name": "empId",
    "label": "Employee Id",
    "width": "sm",
    "maxLength": 50,
    "placeholder": "Employee Id",
    "regex": /^[0-9]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "organisationName": {
    "name": "organisationName",
    "label": "Organization Name",
    "width": "sm",
    "maxLength": 50,
    "placeholder": "Organization Name",
    /* "regex": /^[0-9]*$/, */
    /* "ismandatory": true, */
    "type": FIELD_TYPES.TEXT
  },
  "Role": {
    "name": "Role",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Role",
    "width": "sm",
    "ismandatory": true
  },
  "reportingTo": {
    "name": "reportingTo",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Reporting To",
    "width": "sm",
    "ismandatory": true
  }, "privilages": {
    "name": "privilages",
    "type": FIELD_TYPES.MUTLI_SELECT,
    "placeholder": "Select",
    "label": "Privilages",
    "width": "sm",

  }, "systemRole": {
    "name": "systemRole",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Role",
    "width": "sm",
    "values": [
      { value: 1, label: "Admin" },
      { value: 2, label: "CSR" },
      { value: 3, label: "Manager" },
    ]

  }, "category": {
    "name": "category",
    "type": FIELD_TYPES.MUTLI_SELECT,
    "placeholder": "Select",
    "label": "Category",
    "width": "sm",

  }/* , "callCenter": {
    "name": "callCenter",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Call Center",
    "width": "sm",
  } */,
  "roleHierarchy": {
    "name": "roleHierarchy",
    "type": FIELD_TYPES.DROP_DOWN,
    "placeholder": "Select",
    "label": "Hierarchy",
    "width": "sm",
    "ismandatory": true
  },

  "hierarchyName": {
    "name": "hierarchyName",
    "label": "Hierarchy",
    "width": "sm",
    "maxLength": 50,
    "type": FIELD_TYPES.TEXT
  },
  "roleName": {
    "name": "roleName",
    "label": "Role",
    "width": "sm",
    "maxLength": 50,
    "type": FIELD_TYPES.TEXT
  },
  "reportingName": {
    "name": "reportingName",
    "label": "Reporting To",
    "width": "sm",
    "maxLength": 50,
    "type": FIELD_TYPES.TEXT
  }, "adminType": {
    "name": "adminType",
    "label": "Admin Type",
    "width": "sm",
    "placeholder": "Admin Type",
    "type": FIELD_TYPES.MUTLI_SELECT,
    "ismandatory": true,
    "values": [
      { value: "1", label: "Residential Admin" },
      { value: "2", label: "Commercial Admin" },
      { value: "3", label: "EMA Admin" }
    ]
  },
  "planTypes": {
    name: "planTypes",
    label: "Plan Type",
    type: FIELD_TYPES.RADIO_BUTTON,
  },
   "callCenter": {
    "name": "callCenter",
    "label": "Call Center",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    //"ismandatory": true,
  },
  "businessBook": {
    "name": "businessBook",
    "label": "Business Book",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    //"ismandatory": true,
  }

};

export const USER_REASSIGN = {
  "hierarchy": {
    "name": "hierarchy",
    "label": "Hierarchy",
    "width": "sm",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    "ismandatory": true
  },
  "hierarchyTextBox": {
    "name": "hierarchy",
    "label": "Hierarchy",
    "width": "sm",
    "placeholder": "Hierarchy",
    "type": FIELD_TYPES.TEXT,
    "ismandatory": false
  },
  "role": {
    "name": "role",
    "label": "Role Name",
    "width": "sm",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    "ismandatory": true
  }, "user": {
    "name": "user",
    "label": "User",
    "width": "sm",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    "ismandatory": true
  },
  "reportingUsers": {
    "name": "reportingUsers",
    "label": "Reporting Users",
    "width": "sm",
    "placeholder": "Select",
    "type": FIELD_TYPES.MUTLI_SELECT,
    "ismandatory": true
  },
  "reportTo": {
    "name": "reportTo",
    "label": "Report To",
    "width": "sm",
    "placeholder": "Select",
    "type": FIELD_TYPES.DROP_DOWN,
    "ismandatory": true
  }
};


//Containg User privilages and pivilages User type
export const USER_PRIVILAGE_HIERARCHY_MAPPING = {
  "7010": 1,
  "7011": 2,
  "7012": 3
}



export const ADMIN_USER_FORM_ELEMENTS = {
  "firstName": {
    "name": "firstName",
    "label": "First Name",
    "width": "sm",
    "placeholder": "First Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' .-]*$/,
    "ismandatory": true,
    "type": FIELD_TYPES.TEXT
  },
  "lastName": {
    "name": "lastName",
    "label": "Last Name",
    "width": "sm",
    "placeholder": "Last Name",
    "minLength": 3,
    "maxLength": 40,
    "regex": /^[a-zA-Z0-9' .-]*$/,
    "ismandatory": true,
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
  /* "adminType": {
    "name": "adminType",
    "label": "Types",
    "width": "sm",
    "placeholder": "Admin Types",
    "type": FIELD_TYPES.MUTLI_SELECT,
    "ismandatory": true,
    "values": [
      { value: "1", label: "Residential Admin" },
      { value: "2", label: "Commercial Admin" },
      { value: "3", label: "EMA Admin" }
    ]
  } */
};




export const USER_TYPE_FROM_ELEMENTS = {
  "userType": {
    "name": "userType",
    "label": "Type Of User",
    "width": "sm",
    "placeholder": "User Type",
    "type": FIELD_TYPES.RADIO_BUTTON,
    "ismandatory": true,
    /* "values": [
      { value: "2", label: "Admin User" },
      { value: "3", label: "Employee User" },
      { value: "4", label: "EMA User" }
    ] */
  },
  userTypeOptions: [
    { value: "2", label: "Admin User" },
    { value: "3", label: "Employee User" },
    { value: "4", label: "EMA User" }
  ]
};
