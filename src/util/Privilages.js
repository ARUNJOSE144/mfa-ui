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

  QUESTIONS: {
    view: 20,
    create: 21,
    edit: 22,
    delete: 23,
  },
  TRADE_LOG: {
    view: 30,
    create: 31,
    edit: 32,
    delete: 33,
  }, MANAGE_TRADE: {
    view: 40,
    create: 41,
    edit: 42,
    delete: 43,
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

  {
    id: 5,
    label: "Question Management",
    icon: "fa fa-users",
    submenus: [
      {
        id: 200,
        label: "Question",
        linkTo: "/Questions",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.QUESTIONS)
      }
    ]
  },


  {
    id: 6,
    label: "Trade",
    icon: "fa fa-users",
    submenus: [
      {
        id: 300,
        label: "TradeLogs",
        linkTo: "/Trade-day-log",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.TRADE_LOG)
      }, {
        id: 300,
        label: "Manage Trade",
        linkTo: "/Manage_trade",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.MANAGE_TRADE)
      }, {
        id: 302,
        label: "Option Chain",
        linkTo: "/OptionChain",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.MANAGE_TRADE)
      }
    ]
  }


];
