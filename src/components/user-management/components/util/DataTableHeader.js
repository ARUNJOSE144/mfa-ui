export const USER_MGMNT = {
  "LABEL_LIST": [
    {
      id: "userId",
      name: "ID",
      isSortable: true,
      isVisible: false

    },
    {
      id: "firstName",
      condition: [
        {
          paramIds: [
            'firstName',
            'lastName'
          ],
          condition: "combine"
        }
      ],
      name: "Name",
      className: "greenBold",
      isSortable: true,
    },
    {
      id: "roleName",
      name: "COMS Role",
      isSortable: false
    }, {
      id: "systemRoleName",
      name: "System Role",
      isSortable: false
    },
    {
      id: "parent",
      name: "Reporting To",
      isSortable: false
    },
    {
      id: "telephone",
      name: "Office Number",
      isSortable: false
    }, {
      id: "email",
      name: "Email",
      isSortable: false
    },
    //{
    //   id: "channelPartner",
    //   paramId: "channelTypeName",
    //   name: "Channel Partner",
    //   isSortable: false
    // },
    // {
    //   id: "designation",
    //   name: "Designation",
    //   isSortable: false
    // },
    {
      id: "status",
      paramId: "statusName",
      condition: [
        {
          paramId: "statusId",
          condition: "=",
          value: 0,
          className: "text-danger"
        },
        {
          paramId: "statusId",
          condition: "=",
          value: 2,
          className: "text-danger"
        },
        {
          paramId: "statusId",
          condition: "=",
          value: 3,
          className: "text-danger"
        }
      ],
      name: "Status",
      isSortable: true
    }
  ],
  SEARCH_FIELDS: {
    firstName: "First Name",
    lastName: "Last Name",
    status: "status"
    // empCode: "Employee Code",
    // designation: "Designation"
  },
  SEARCH_FILTERS: ['userId', 'userName', 'firstName', 'lastName']
};