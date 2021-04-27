import _ from "lodash";

export const PRIVILIAGES = {


  USER_MGMNT: {
    /*   view: 7000,
     create: 7001,
     edit: 7002,
     delete: 7003,
     reassign:7004 , */

    createResidentialUser: 7010,
    createCommericialUser: 7011,
    createEMAUser: 7012,

    editResidentialUser: 7020,
    editCommericialUser: 7021,
    editEMAUser: 7022,

    deleteResidentialUser: 7030,
    deleteCommericialUser: 7031,
    deleteEMAUser: 7032,

    viewResidentialUser: 7040,
    viewCommericialUser: 7041,
    viewEMAUser: 7042,


  },

  SYSTEM_ROLES: {
    view: 102000,
    create: 102001,
    edit: 102002,
    delete: 102003,
  },

};

export const MENU_DETAILS = [
  /*  {
     id: 1,
     label: "Dashboard",
     linkTo: "/home",
     icon: "fa fa-area-chart",
     privilages: []
   }, */
  {
    id: 11,
    label: "User Management",
    icon: "fa fa-user",
    submenus: [
      {
        id: 7,
        label: "User",
        linkTo: "/User",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.USER_MGMNT)
      }
    ]
  },

  {
    id: 4,
    label: "System Role",
    icon: "fa fa-user",
    submenus: [
      {
        id: 100,
        label: "System Roles",
        linkTo: "/Roles",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.SYSTEM_ROLES)
      }, {
        id: 101,
        label: "Attach System Role",
        linkTo: "/attachSystemRole",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.ATTACH_SYSTRM_ROLE)
      }
    ]
  },


];