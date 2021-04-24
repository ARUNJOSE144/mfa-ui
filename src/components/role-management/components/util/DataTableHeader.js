export const ROLES = {
    LABEL_LIST: [
    {
        id: "roleId",
        paramId: "roleId",
        name: "Id",
        isSortable: true,
        isVisible: false
    },
    {
        id: "roleName",
        paramId: "roleName",
        name: "Role Name",
        className:"greenBold",
        isSortable: false
    },
    {
        id: "roleDesc",
        paramId: "roleDesc",
        name: "Role Description",
        isSortable: true,
    },
    {
        id: "createdDate",
        paramId: "createdDate",
        name: "Created Date",
        isSortable: true
    }
    ],

    LABEL_LIST_SYSTEM: [
        {
            id: "roleId",
            paramId: "roleId",
            name: "Id",
            isSortable: true,
            isVisible: false
        },
        {
            id: "roleName",
            paramId: "roleName",
            name: "System Role Name",
            className:"greenBold",
            isSortable: false
        },
        {
            id: "createdDate",
            paramId: "createdDate",
            name: "Created Date",
            isSortable: true
        }
        ],

        
    SEARCH_FIELDS: {
        roleId: "Id",
        roleName: "Name",
        roleDesc: "Description"
    },
    SEARCH_FILTERS: ['roleId', 'roleName', 'roleDesc']
  };


 