import _ from "lodash";

export const PRIVILIAGES = {
  SYSTEM_CONFIG: {
    view: 21000,
    create: 21001,
    edit: 21002,
    delete: 21003
  },
  COMPANY_TYPE: {
    view: 23000,
    create: 23001,
    edit: 23002,
    delete: 23003
  },
  DOCTYPE: {
    view: 24000,
    create: 24001,
    edit: 24002,
    delete: 24003
  },
  SERVICE_CLASS: {
    view: 28000,
    create: 28001,
    edit: 28002,
    delete: 28003
  },
  CHANNEL_PARTNERS: {
    view: 6000,
    create: 6001,
    edit: 6002,
    delete: 6003
  },
  SALES_HIERARCHY: {
    /*  view: 27000,
     create: 27001,
     edit: 27002,
     delete: 27003 */
    createResidentialHierarchy: 27000,
    createCommercialHierarchy: 27001,
    createEmaHierarchy: 27002,
    viewResidentialHierarchy: 27003,
    viewCommercialHierarchy: 27004,
    viewEmaHierarchy: 27005,
    deleteResidentialHierarchy: 27006,
    deleteCommercialHierarchy: 27007,
    deleteEmaHierarchy: 27008,
    editResidentialHierarchy: 27009,
    editCommercialHierarchy: 27010,
    editEmaHierarchy: 27011,






  },
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
  ROLES: {
    view: 22000,
    create: 22001,
    edit: 22002,
    delete: 22003
  },
  SYSTEM_ROLES: {
    view: 102000,
    create: 102001,
    edit: 102002,
    delete: 102003,
  },
  ATTACH_SYSTRM_ROLE: {
    view: 102010
  },
  COMMISSION: {
    view: 10000,
    /* create: 10001, */
    edit: 10002,
    delete: 10003
  },
  LOCATION: {
    view: 11000,
    create: 11001,
    edit: 11002,
    delete: 11003
  },
  COMMISSION_PLAN_LIST: {
    view: 99000,
    /* create: 99001, */
    edit: 99002
  },
  COMMISSION_PLANS: {
    viewResidentialPlans: 100000,
    createResidentialPlans: 100001,
    editResidentialPlans: 100002,
    deleteResidentialPlans: 100003,
    viewCommercialPlans: 100100,
    createCommercialPlans: 100101,
    editCommercialPlans: 100102,
    deleteCommercialPlans: 100103,
    viewEMAPlans: 100200,
    createEMAPlans: 100201,
    editEMAPlans: 100202,
    //deleteCommercialPlans: 100203,

    viewAgentInfo: 100110,
    viewActualData: 100111,
  },
  ATTACH_USERS: {
    attachResidentialPlans: 101000,
    attachCommercialPlans: 101001,
    attachEMAPlans: 101002,
  },
  COMMISSION_CALCULATION: {
    calculateResidentialPlans: 101010,
    calculateCommercialPlans: 101011,
    calculateEMAPlans: 101012,
  },
  COMMISSION_USERS: {
    create: 101020,
    edit: 101021,
    view: 101022
  },
  APPROVAL: {
    residentialAdminApproval: 101031,
    commercialAdminApproval: 101032,
    emaAdminApproval: 101033,
    /* residentialManagerApproval: 101034,
    commercialManagerApproval: 101035,
    emaManagerApproval: 101036, */
    viewCommissions: 101037,
    approvalPending: 101038
  },
  Community: {
    view: 25000,
    create: 25001,
    edit: 25002,
    delete: 25003
  },
  Market: {
    view: 25500,
    create: 25501,
    edit: 25502,
    delete: 25503
  },
  CallCenter: {
    view: 26000,
    create: 26001,
    edit: 26002,
    delete: 26003
  },
  BusinessBook: {
    view: 26500,
    create: 26501,
    edit: 26502,
    delete: 26503
  }, 
  AssignTiers: {
    view: 29000,
    assign: 29001,
    edit: 29002,
   /*  delete: 29003 */
  }
  ,
  BusinessBookUpload: {
    viewOrDownload: 103000,
    upload: 103001,
  },
  Payroll: {
    view:  103010,
    generate:103011
  }
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
    id: 3,
    label: "Role Management",
    icon: "fa fa-user",
    submenus: [
      /*   {
          id: 48,
          label: "Roles",
          linkTo: "/systemRoles",
          icon: "fa fa-users",
          privilages: _.values(PRIVILIAGES.ROLES)
        }, */
      {
        id: 101,
        label: "Commission Roles",
        linkTo: "/RoleManagement",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.ROLES)
      },
      {
        id: 26,
        label: "Commission Role Hierarchy",
        linkTo: "/roleHierarchyMain",
        icon: "fa fa-users",
        privilages: _.values(PRIVILIAGES.SALES_HIERARCHY)
      },

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
  {
    id: 13,
    label: "Commission ",
    icon: "fa fa-user",
    submenus: [
      {
        id: 36,
        label: "Commission Plans",
        linkTo: "/planList",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.COMMISSION_PLANS)
      },
      {
        id: 35,
        label: "Attach User",
        linkTo: "/userAttachment",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.ATTACH_USERS)
      },
      {
        id: 39,
        label: "Commission Calculation",
        linkTo: "/commissionSchedule",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.COMMISSION_CALCULATION)
      },
      {
        id: 44,
        label: "Commission Approvals",
        linkTo: "/CommissionApprovals",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.APPROVAL)
      },
      {
        id: 47,
        label: "Commission Users",
        linkTo: "/CommissionUser",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.COMMISSION_USERS)
      },
      {
        id: 48,
        label: "Status Of Commissions",
        linkTo: "/StatusOfCommissionPlan",
        icon: "fa fa-user",
      }
      , {
        id: 55,
        label: "Payroll",
        linkTo: "/Payroll",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.Payroll)
      }

    ]
  }, {
    id: 14,
    label: "Configuration ",
    icon: "fa fa-user",
    submenus: [
      {
        id: 49,
        label: "Assign Tier To A Plan",
        linkTo: "/AssignTier",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.AssignTiers)
      },
      /* {
        id: 50,
        label: "Communities",
        linkTo: "/Community",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.Community)
      },
      {
        id: 51,
        label: "Market",
        linkTo: "/Market",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.Market)
      }, */
      {
        id: 52,
        label: "Call Center",
        linkTo: "/CallCenter",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.CallCenter)
      }, {
        id: 53,
        label: "Business Book",
        linkTo: "/BusinessBook",
        icon: "fa fa-user",
        privilages: _.values(PRIVILIAGES.BusinessBook)
      }
      , {
        id: 54,
        label: "Business Book Upload/Download",
        linkTo: "/BusinessBookUpload",
        icon: "fa fa-user",
        //privilages: _.values(PRIVILIAGES.BusinessBookUpload)
      }
    ]
  }

];
