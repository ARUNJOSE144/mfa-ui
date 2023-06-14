export const { AD_URL, BASE_URL, RULEENGINE_URL,OPTION_CODE } = window;
export const LOGIN = "login";
export const LOGOUT = "logout";
export const CHANGE_PSWD = "changePswd";
export const SET_LOADING = "set_loading";
export const SET_TOAST_NOTIF = "set_toast_notif";
export const SET_MODAL_POPUP = "set_modal_popup";
export const SET_HEADER = "set_header";
export const SET_BREAD_CRUMB = "set_breadcrumb";

export const GLOBAL_CONSTANTS = {
    INITIAL_ROW_COUNT: 20,
    DATE_FORMAT: "YYYY-MM-DD",
    GET_PRODUCTS_URL: "/products/v1/getList",
    GET_ROLES_URL: "/role/v1/getRoles",
    FORM_MODAL: {
        SearchFilter: 1,
        Create: 2,
        Edit: 3,
        View: 4,
        Delete: 5,
    },
    BL_RESULT_CODES: {
        SUCCESS: "0"
    },
    PRODUCT_WITH_SIM_MSISDN: 2,
}


export const AUTH_KEY = 'Basic aW50ZXJmYWNlX3dlYl91c2VyOjk4OHNkc2RAdHU=';

export const LOGIN_URL = `${BASE_URL}/v1/login`;
export const LOGOUT_URL = "/v1/logout";
export const AUTH_URL = `${BASE_URL}/v1/authorize`;
export const CHANGE_PSWD_URL = "/ChangePassword/v1/changePwd";
export const FORGET_PSWD_URL = "/ForgetPassword/v1/forgetPwd";

export const CONSTANTS = {
    SYSTEM_CONFIG: {
        LIST_URL: "/ConfigParam/v1/search",
        DELETE_URL: "/ConfigParam/v1/delete",
        CREATE_URL: "/ConfigParam/v1/create",
        EDIT_URL: "/ConfigParam/v1/update"
    },
    COMPANY_TYPE: {
        LIST_URL: "/CompanyType/v1/search/",
        DELETE_URL: "/CompanyType/v1/delete/",
        CREATE_URL: "/CompanyType/v1/create/",
        EDIT_URL: "/CompanyType/v1/update/"
    },
    DOCTYPE: {
        LIST_URL: "/DoccumentType/v1/search/",
        DELETE_URL: "/DoccumentType/v1/delete/",
        CREATE_URL: "/DoccumentType/v1/create/",
        EDIT_URL: "/DoccumentType/v1/update/"
    },
    SERVICE_CLASS: {
        LIST_URL: "/serviceClass/v1/getlist",
        DELETE_URL: "/serviceClass/v1/delete?surveyId=",
        CREATE_URL: "/serviceClass/v1/create",
        EDIT_URL: "/serviceClass/v1/update"
    },
    CHANGE_PSWD: {
        CHANGE_PSWD_URL: "/ChangePassword/v1/changePwd"
    },
    CHANNEL_PARTNERS: {
        CREATE_URL: "/entity/v1/create",
        UPDATE_URL: "/entity/v1/update",
        DELETE_URL: "/role/v1/delete",
        SEARCH_URL: "/entity/v1/getList",
        VIEW_URL: "/entity/v1/view",
        LIST_ALL_FILES: '/file/v1/listAllFiles',
        LIST_PRODUCTS: '/products/v1/getProductList',
        DELETE_PRODUCTS: '/products/v1/delete',
        UPDATE_PRODUCTS: '/products/v1/update',
        ADD_PRODUCTS: '/products/v1/add',
        FILE_VIEW: '/file/v1/view',
        FILE_STORE: '/file/v1/store',

        GET_LOCATION_TYPES: '/entityLocation/v1/getAllEntityChildLocationTypes?entityId=',
        GET_LOCATIONS_BY_ENTITY: '/entityLocation/v1/getEntityChildLocations',

        LIST_ALL_PRODUCTS: '/products/v1/getList',

        SAVE_DOCUMENT: '/file/v1/create?entityId=',
        DELETE_DOCUMENT: '/file/v1/delete',
        DEACTIVATE_URL: '/entity/v1/deactivate',
        ACTIVATE_URL: '/entity/v1/activate',
        VISIT_DETAILS: "/checkin/v1/view",
        VISIT_HISTORY: "/checkin/v1/history",
        GET_CHILDREN: '/entity/v1/getChildList'
    },
    SALES_HIERARCHY: {
        LIST_URL: "/roleHierarchy/v1/view",
        VIEW_NODE_URL: "/salestructure/v1.0/viewNodeDetails",
        CREATE_NODE_URL: "/salestructure/v1.0/create",
        UPDATE_NODE_URL: "/salestructure/v1.0/update",
        ADD_DESIG_URL: "/designation/v1/create",
        UPDATE_DESIG_URL: "/designation/v1/update",
        ADD_NEW_ROLE_IN_HIERARCHY_URL: "/roleHierarchy/v1/insertNode",
        DELETE_ROLE_IN_HIERARCHY_URL: "/roleHierarchy/v1/deleteNode",
        GET_AVAILABLE_ROLES: "/commissionRole/v1/getFreeRolesForCurrentHierachy",
        GET_HIERARCHY_LIST: "/roleHierarchy/v1/getAllHierarchies",
        GET_ROLE_ROOT_NODES: "role/v1/getRoleRootNodes",
        CREATE_HIERARCHY_URL: "roleHierarchy/v1/createHierarchy",
        DELETE_HIERARCHY: "roleHierarchy/v1/deleteHierarchy?hierarchyId=",
        GET_HIERARCHY_ID_FROM_USER_ID: "roleHierarchy/v1/getHierarchyIdByPassingUserId",
        REASSIGN_USERS: "user/v1/reassignUsers",



        GET_HIERARCHY_DROPDOWN_LIST: "roleHierarchy/v1/getRoleHierarchyList",
        GET_CHILD_ROLES: "/user/v1/getChildRolesByUserId",
        GET_USERS_BY_ROLE_ID: "user/v1/getUsersByRoleId",

        GET_REPORTING_USERS: "user/v1/getReportingUsers",

        GET_HIERARCHY_LIST_WITH_TYPE: "/role/v1/getRoleHiearchyNodes",





        OP_NODE_TYPE: 1,
        BU_NODE_TYPE: 2,
        EN_NODE_TYPE: 3
    },
    USER_MGMNT: {
        LIST_URL: "/user/v1/search",
        CREATE_URL: "/user/v1/create",
        DELETE_URL: "/user/v1/delete?userId=",
        VIEW_URL: "/user/v1/view?userId=",
        EDIT_URL: "/user/v1/update",
        VIEW_REPMGR_URL: "/user/v1/getUsers",
        VIEW_LOCATION_URL: "/GIS/v1/getChildLocations?userId=",
        VIEW_LOCATIONTYPE_URL: "/user/GIS/v1/getAllChildLocationTypes",
        CHANGE_STATUS: "/user/v1/changeStatus?user=",
        RESETPASSWORD_URL: "/user/v1/resetPassword?userId=",
        GET_CHILD_USERS: "/user/v1/getMyChild?userId=",
        GET_DESIGNATION_URL: "/designation/v1/view",
        GET_IS_SALESPERSON: "/salesPersonCheck/v1/isSalePerson",

        FILE_VIEW: '/filesaleuser/v1/view',
        FILE_STORE: '/filesaleuser/v1/store',
        SAVE_DOCUMENT: '/filesaleuser/v1/create?userId=',
        DELETE_DOCUMENT: '/filesaleuser/v1/delete',
        LIST_ALL_FILES: '/filesaleuser/v1/listAllFiles',

        ADD_PRODUCTS: '/userproducts/v1/add',
        DELETE_PRODUCTS: '/userproducts/v1/delete',
        UPDATE_PRODUCTS: '/userproducts/v1/update',
        LIST_PRODUCTS: '/userproducts/v1/getProductList',

        VIEW_CHANNELTYPE_URL: '/salestructure/v1.0/viewChildChannelTypes'
    },
    ROLES: {
        CREATE_URL: "/role/v1/create",
        UPDATE_URL: "/role/v1/update",
        DELETE_URL: "/role/v1/delete",
        SEARCH_URL: "/role/v1/search",
        VIEW_URL: "/role/v1/view",
        GET_FEATURES: "/role/v1/getModulePermissions"
    },
    COMMISSION: {
        CREATE_URL: "commissioning/v1/saveCommissionPlan",
        VIEW_URL: "commissioning/v1/getCommissionPlan",
        GET_ALL_PLANS: "commissioning/v1/getAllCommissionPlans",
        VIEW_PLANS_LIST: "commissioning/v1/view",
        PLAN_TYPE_URL: "commissioning/v1/getPlanTypes",
        PLANS_URL: "commissioning/v1/getCommissionPlansByType",
        SCHEDULE_PLAN: "commissioning/v1/schedulePlan",
        GET_FREE_USERS: "commissioning/v1/getAvailableUsersForCommissionPlan",
        GET_FREE_COMMUNITYS: "commissioning/v1/getAvailableCommunitiesForCommissionPlan",
        GET_FREE_MARKETS: "commissioning/v1/getAvailableMarketsForCommissionPlan",
        ATTACH_USERS: "commissioning/v1/attachUsers",
        COMMISSION_APPROVAL: "commissioning/v1/getCommissionsForApproval",
        GET_ATTACHED_USERS_OF_PLAN: "commissioning/v1/getAttachedUsersOfCommissionPlan",
        ADJUST: "approval/v1/adjust",
        APPROVAL: "approval/v1/approveOrReject",
        INTEGRATION: "commissioning/v1/getAgensOfaPlan",
        COMMISSIONUSER: "commissioning/v1/getCommissionUsers",
        GET_PLAN_CATEGORIES_URL: "commissioning/v1/getPlanCategories",
        GET_PLAN_TYPES_BY_CATEGORY: "commissioning/v1/getPlanTypesByCategory",
        GET_COMMISSION_USERS_OF_PLAN: "commissioning/v1/getCommissionUserDetailsOfAPlan",
        GET_ATTACHED_COMMUNITIES_OF_USER_FOR_PLAN: "commissioning/v1/getAttachedCommunitesOfAUserForAPlan",
        GET_ATTACHED_MARKETS_OF_USER_FOR_PLAN: "commissioning/v1/getAttachedMarketsOfAUserForAPlan",
        UPDATE_USER_DETAILS_IN_PLAN: "commissioning/v1/modifyUserDetailsOfPlan",
        GET_MANUAL_ENTRIES_OF_PLAN: "commissioning/v1/getManualEntriesOfPlanForAPeriod",
        GET_DETAILED_COMMISSION_OF_AGENT: "commissioning/v1/getDetailedCommissionOfAgent",
        GET_COMS_CALULATION_CHECK: "commissioning/v1/duplicateCommmissionCalulationCheck",
        GET_COMMISSION_AGENTS: "/user/v1/getCommissionAgents",
        GET_TRANSACTION_DETAILS_OF_CATEGORY_FOR_AGENT: "commissioning/v1/getTransactionDetailsOfCategoryOfAnAgent",
        GET_DETAILED_COMMISSION_OF_AGENT_FOR_COMMERCIAL_PLAN: "commissioning/v1/getDetailedCommissionOfAgentForCommercialPlan",
        GET_ALL_BUSINESS_BOOKS: "commissioning/v1/getAllBusinessBooks",
        GET_AGENTS_EMPLOYEE_NUMBER: "commissioning/v1/getAllActiveUserWithEmpNumber",
        GET_COMMISSION_PLANS_STATUS: "commissioning/v1/getCommissionScheduleDetailsWithStatus",
        INSERT_PAYROLL:"commissioning/v1/insertPayrollDetailsForCommissionPeriod",
        DUPLICATE_CHECK_PAYROLL:"commissioning/v1/duplicateCheckForGeneratingPayroll",


        GET_COMMUNITIES: "community/v1/search",
        CREATE_COMMUNITY: "community/v1/create",
        DELETE_COMMUNITY: "community/v1/delete",
        EDIT_COMMUNITY: "community/v1/update",


        GET_MARKET: "market/v1/search",
        CREATE_MARKET: "market/v1/create",
        DELETE_MARKET: "market/v1/delete",
        EDIT_MARKET: "market/v1/update",

        GET_BUSINESS_BOOK: "businessBook/v1/search",
        CREATE_BOOK: "businessBook/v1/create",
        DELETE_BOOK: "businessBook/v1/delete",
        EDIT_Book: "businessBook/v1/update",

        GET_CALL_CENTER: "callCenter/v1/search",
        CREATE_CALL_CENTER: "callCenter/v1/create",
        DELETE_CALL_CENTER: "callCenter/v1/delete",
        EDIT_CALL_CENTER: "callCenter/v1/update",


        GET_STATUS_COMMISSIONS: "commissioning/v1/getApprovalDetailsOfAPlanForAPeriod",

        GET_TIERS:"commissioning/v1/getAllTiers",
        GET_PLAN_TIER_DETAILS:"commissioning/v1/getPlanTierDetails",
        ASSIGN_TIER_TO_A_PLAN:"commissioning/v1/assignTierToPlan",
        GET_PLAN_TIER_AUDIT_DETAILS:"commissioning/v1/getPlanTierAuditDetails",
        COMMISSION_PAYOUT_SCHEDULE_DETAILS:"commissioning//v1/getCommissionPayoutScheduleDetails",

        GET_FREE_COMPLEX: "commissioning/v1/getAvailableComplexesForCommissionPlan",


    },
    COMMISSION_ROLES: {
        CREATE_URL: "/commissionRole/v1/create",
        UPDATE_URL: "/commissionRole/v1/update",
        DELETE_URL: "/commissionRole/v1/delete",
        SEARCH_URL: "/commissionRole/v1/search",
        VIEW_URL: "/commissionRole/v1/view",
    },

}
