import FIELD_TYPES from '../../../generic/fields/elements/fieldItem/FieldTypes';


export const CREATE_HIERARCHY = {
  hierarchyName: {
    name: "hierarchyName",
    label: "Hierarchy Name",
    width: "sm",
    placeholder: "Hierarchy Name",
    maxLength: 40,
    minLength: 3,
    type: FIELD_TYPES.TEXT,
    ismandatory: true
  },
  parentRoleName: {
    name: "parentRoleName",
    label: "Parent Role Name",
    width: "sm",
    placeholder: "Select",
    type: FIELD_TYPES.DROP_DOWN,
    ismandatory: true
  },
  "hierarchyType": {
    "name": "hierarchyType",
    "label": "Type",
    "width": "md",
    "placeholder": "Type",
    "type": FIELD_TYPES.RADIO_BUTTON,
    "ismandatory": true,
  }
};

export const CREATE_ROLE = {
  role: {
    name: "role",
    label: "Role Name",
    width: "sm",
    placeholder: "Select",
    type: FIELD_TYPES.DROP_DOWN,
    ismandatory: true
  }
};

export const HERARCHY = {
  LABEL_LIST: [
    {
      id: "id",
      paramId: "id",
      name: "Id",
      isSortable: true,
      isVisible: false
    },
    {
      id: "name",
      paramId: "name",
      name: "name",
      className: "greenBold",
      isSortable: true
    },
    {
      id: "createDate",
      paramId: "createDate",
      name: "Created Date",
      isSortable: true
    },
    {
      id: "createUser",
      paramId: "createUser",
      name: "Create User"
    },
    {
      id: "rootNode",
      paramId: "rootNode",
      name: "Root Node"
    }
  ],
  SEARCH_FIELDS: {
    id: "Id",
    name: "Name"
  },
  SEARCH_FILTERS: ["id", "name"]
};
