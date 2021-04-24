/* import { ProductInput as ProductInputComponent } from '@6d-ui/ui-helpers'; */
/* import { ProductInput as ProductInputComponent } from '../../generic/ui-helpers/elements/ProductInput'; */
import React from "react";
import Loadable from 'react-loadable';
import { Redirect, Route, Switch } from "react-router-dom";
import { CONSTANTS, GLOBAL_CONSTANTS } from '../../../util/Constants';
import { MESSAGE_UTILS } from '../../../util/Messages';
import { PRIVILIAGES as MENU_PRIVILIAGES } from '../../../util/Privilages';
import { ErrorPage, Loading as Loader } from '../../errorPage/ErrorPage';
import { ajaxUtil, isComplexTab, saveCurrentStateUtil, setHeaderUtil, setLoadingUtil, setModalPopupUtil, setNotification } from '../Utils';


/* const ProductInput = props => <ProductInputComponent {...props} productWithMsisdn={GLOBAL_CONSTANTS.PRODUCT_WITH_SIM_MSISDN} />
 */
const Loading = (props) => {
  if (props.isLoading) {
    if (props.timedOut) {
      return <ErrorPage errorCode={404} />;
    } else {
      return <Loader />;
    }
  } else if (props.error) {
    return <ErrorPage errorCode={500} />;
  } else {
    return <ErrorPage errorCode={404} />;
  }
}

function createLoadable(loader) {
  return Loadable({
    loader,
    loading: Loading
  });
}

const AsyncHome = createLoadable(() => import('../../dashboard/DashTemp').catch(e => console.error(e)));

const AsyncUserView = Loadable({
  loader: () => import('../../user-management/components/View'),
  loading: Loading
});

const AsyncUserCreate = Loadable({
  loader: () => import('../../user-management/components/CreateUser'),
  loading: Loading
});
const AsyncUserReassign = Loadable({
  loader: () => import('../../user-management/components/UserReassign'),
  loading: Loading
});











const AsyncRoleHierarchyMain = Loadable({
  loader: () => import('../../role-hierarchy/components/hierarchy/RoleHierarchyMain'),
  loading: Loading
});

const AsyncRoleHierarchyTree = Loadable({
  loader: () => import('../../role-hierarchy/components/hierarchy/HierarchyTree'),
  loading: Loading
});
const AsyncRoleHierarchiesCreate = Loadable({
  loader: () => import('../../role-hierarchy/components/hierarchy/CreateHierarchy'),
  loading: Loading
});





const AsyncRoleMangement = Loadable({
  loader: () => import('../../role-management/components/RoleManagement/ViewRoles'),
  loading: Loading
});
const AsyncCreateRoleMangement = Loadable({
  loader: () => import('../../role-management/components/RoleManagement/CreateRole'),
  loading: Loading
});

const AsyncRoleView = Loadable({
  loader: () => import('../../role-management/components/ViewRoles'),
  loading: Loading
});
const AsyncAttachSystemRole = Loadable({
  loader: () => import('../../../components/role-management/components/AttachSystemRole/AttachSystemRole'),
  loading: Loading
});
const AsyncRoleCreate = Loadable({
  loader: () => import('../../../components/role-management/components/CreateRole'),
  loading: Loading
});
const AsyncRoleEdit = Loadable({
  loader: () => import('../../../components/role-management/components/EditRole'),
  loading: Loading
});




export const Routes = ({ userid, privilages, previousState, userChannelType, userEntityType, designationId, loggedInUser, typeOfUser }) => {
  const properties = {
    'userId': userid,
    'privilages': privilages,
    'ajaxUtil': ajaxUtil,
    'setHeader': setHeaderUtil,
    'saveCurrentState': saveCurrentStateUtil,
    'setNotification': setNotification,
    'setModalPopup': setModalPopupUtil,
    'loadingFunction': setLoadingUtil,
    'messagesUtil': MESSAGE_UTILS,
    'designationId': designationId,
    'globalConstants': GLOBAL_CONSTANTS,
    'typeOfUser': typeOfUser,
    loggedInUser
  }

  return (
    <div>
      <Switch>
        <Route exact path="/home" render={(props) => <AsyncHome
          {...props}
        />} />

        <Route exact path="/User" render={() => <AsyncUserView
          {...properties}
          userChannelType={userChannelType}
          userEntityType={userEntityType}
          url_User={CONSTANTS.USER_MGMNT}
          url_SalesHierarchy={CONSTANTS.SALES_HIERARCHY}
          url_DocType_List={CONSTANTS.DOCTYPE.LIST_URL}
          url_ChannelPartners_SearchUrl={CONSTANTS.CHANNEL_PARTNERS.SEARCH_URL}
          menuPrivilages={MENU_PRIVILIAGES.USER_MGMNT}
          previousState={previousState && previousState.obj.user}
          previousStateKey="user"
          isComplexTab={isComplexTab}
        />} />


        <Route exact path="/User/create" render={(props) => <AsyncUserCreate
          {...props}
          {...properties}
          userChannelType={userChannelType}
          userEntityType={userEntityType}
          url_User={CONSTANTS.USER_MGMNT}
          url_ChannelPartners_SearchUrl={CONSTANTS.CHANNEL_PARTNERS.SEARCH_URL}
          url_SalesHierarchy_OpNodeType={CONSTANTS.SALES_HIERARCHY.OP_NODE_TYPE}
          url_SalesHierarchy_BuNodeType={CONSTANTS.SALES_HIERARCHY.BU_NODE_TYPE}
          url_DocType_List={CONSTANTS.DOCTYPE.LIST_URL}
          /* ProductInput={ProductInput} */
          isComplexTab={isComplexTab}
          const_Commission={CONSTANTS.COMMISSION}
          menuPrivilages={MENU_PRIVILIAGES.USER_MGMNT}
          roleHierarchyPrivilages={MENU_PRIVILIAGES.SALES_HIERARCHY}
        />} />

        <Route exact path="/user/reassign/" render={(props) => <AsyncUserReassign
          {...props}
          {...properties}
          const_SalesHierarchy={CONSTANTS.SALES_HIERARCHY}
          menuPrivilages={MENU_PRIVILIAGES.USER_MGMNT}
          url_GetRoles={GLOBAL_CONSTANTS.GET_ROLES_URL}
        />} />







        <Route exact path="/roleHierarchyMain" render={(props) => <AsyncRoleHierarchyMain
          {...properties}
          {...props}
          const_SalesHierarchy={CONSTANTS.SALES_HIERARCHY}
          menuPrivilages={MENU_PRIVILIAGES.SALES_HIERARCHY}
          url_GetRoles={GLOBAL_CONSTANTS.GET_ROLES_URL}
        />} />

        <Route exact path="/roleHierarchies/tree/:id/:mode" render={(props) => <AsyncRoleHierarchyTree
          {...props}
          {...properties}
          const_SalesHierarchy={CONSTANTS.SALES_HIERARCHY}
          menuPrivilages={MENU_PRIVILIAGES.SALES_HIERARCHY}
          url_GetRoles={GLOBAL_CONSTANTS.GET_ROLES_URL}
        />} />
        <Route exact path="/roleHierarchies/create" render={({ ...props }) => <AsyncRoleHierarchiesCreate
          const_SalesHierarchy={CONSTANTS.SALES_HIERARCHY}
          menuPrivilages={MENU_PRIVILIAGES.SALES_HIERARCHY}
          {...properties}
          {...props}
        />} />


        <Route exact path="/RoleManagement" render={(props) => <AsyncRoleMangement
          {...props}
          {...properties}
          url_Roles={CONSTANTS.COMMISSION_ROLES}
          menuPrivilages={MENU_PRIVILIAGES.ROLES}
        />} />
        <Route exact path="/RoleManagement/create" render={(props) => <AsyncCreateRoleMangement
          {...props}
          {...properties}
          url_Roles={CONSTANTS.COMMISSION_ROLES}
          menuPrivilages={MENU_PRIVILIAGES.ROLES}
        />} />

        <Route exact path="/Roles" render={() => <AsyncRoleView
          {...properties}
          url_Roles={CONSTANTS.ROLES}
          menuPrivilages={MENU_PRIVILIAGES.SYSTEM_ROLES}
          previousState={previousState && previousState.obj.roles}
          previousStateKey="roles"
        />} />
        <Route exact path="/attachSystemRole" render={(props) => <AsyncAttachSystemRole
          {...props}
          {...properties}
          url_Roles={CONSTANTS.ROLES}
          url_commission={CONSTANTS.COMMISSION}
        />} />
        <Route exact path="/Roles/create" render={() => <AsyncRoleCreate
          {...properties}
          url_Roles={CONSTANTS.ROLES}
        />} />
        <Route exact path="/Roles/edit/:id" render={(props) => <AsyncRoleEdit
          {...props}
          {...properties}
          url_Roles={CONSTANTS.ROLES}
        />} />




        <Route exact path="/" render={(props) => <Redirect to="/home" />} />
        <Route path="/" render={() => <ErrorPage errorCode={404} />} />

      </Switch>
    </div>
  )
}
