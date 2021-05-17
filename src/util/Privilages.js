import _ from "lodash";

export const PRIVILIAGES = {


  USER_MGMNT: {
    view: 10,
    create: 11,
    edit: 12,
    delete: 13,
  },

  ROLES: {
    view: 20,
    create: 21,
    edit: 22,
    delete: 23,
  },

};

export const MENU_DETAILS = [
  {
    id: 1,
    label: "Dashboard",
    linkTo: "/home",
    icon: "fa fa-area-chart",
    privilages: []
  },
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
    label: "Role",
    icon: "fa fa-users",
    submenus: [
      {
        id: 100,
        label: "Roles",
        linkTo: "/Roles",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.ROLES)
      }
    ]
  },


];
