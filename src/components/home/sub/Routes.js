import React from "react";
import Loadable from 'react-loadable';
import { Redirect, Route, Switch } from "react-router-dom";
import { CONSTANTS, GLOBAL_CONSTANTS } from '../../../util/Constants';
import { MESSAGE_UTILS } from '../../../util/Messages';
import { PRIVILIAGES as MENU_PRIVILIAGES } from '../../../util/Privilages';
import { ErrorPage, Loading as Loader } from '../../errorPage/ErrorPage';
import { ajaxUtil, saveCurrentStateUtil, setHeaderUtil, setLoadingUtil, setModalPopupUtil, setNotification } from '../Utils';

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
const AsyncRoleView = Loadable({
  loader: () => import('../../role-management/components/ViewRoles'),
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
          url_User={CONSTANTS.USER_MGMNT}
          menuPrivilages={MENU_PRIVILIAGES.USER_MGMNT}
        />} />


        <Route exact path="/User/create" render={(props) => <AsyncUserCreate
          {...props}
          {...properties}
          url_User={CONSTANTS.USER_MGMNT}
          menuPrivilages={MENU_PRIVILIAGES.USER_MGMNT}
        />} />

        <Route exact path="/Roles" render={() => <AsyncRoleView
          {...properties}
          url_Roles={CONSTANTS.ROLES}
          menuPrivilages={MENU_PRIVILIAGES.ROLES}
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
