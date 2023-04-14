import React from "react";
import { setHeader, setLoading, setLogOut, setModalPopup, setToastNotif } from '../../actions';
import { saveCurrentState } from "../../actions/index";
import { store } from '../../index';
import { AUTH_KEY } from '../../util/Constants';
import AjaxUtil from '../generic/ajax/elements/ajax/util/AjaxUtil';

export const isComplexTab = true; //false => simple, true =>Complex
export const setNotification = (obj) => {
  store.dispatch(
    setToastNotif({
      message: obj.message,
      hasError: obj.hasError,
      timestamp: obj.timestamp
    })
  );
}
const logout = () => {
  store.dispatch(setLogOut());
}
export const ajaxUtil = new AjaxUtil({
  'responseCode': {
    'success': 200,
    'unAuth': 401,
    'resultSuccess': '0'
  },
  'messages': {
    'success': "Success Message",
    'failure': "Failure Message"
  },
  'setNotification': setNotification,
  'logout': logout,
  'authKey': AUTH_KEY,
  'channel': 'WEB',
});

export const setHeaderUtil = (headerName) => {
  store.dispatch(setHeader({ "name": headerName }));
}
export const saveCurrentStateUtil = obj => {
  store.dispatch(saveCurrentState(obj));
}

export const setModalPopupUtil = (obj) => {
  store.dispatch(setModalPopup({
    "rowId": obj.rowId,
    "isOpen": obj.isOpen,
    "onConfirmCallBack": obj.onConfirmCallBack,
    "title": obj.title,
    "content": obj.content,
    "CancelBtnLabel": obj.CancelBtnLabel,
    "confirmBtnLabel": obj.confirmBtnLabel
  }));
}

export const setLoadingUtil = (obj) => {
  const timestamp = new Date().getTime();
  store.dispatch(setLoading(obj.isLoading, obj.firstLoad, (obj.isLoading ? timestamp : obj.timestamp)));
  return timestamp;
}



//For validating null/undefined/empty string
export const validate = (val) => {
  if (val !== null && val !== undefined && val !== "")
    return true;
  else
    return false;
}


//for checking the privilage is present/Not
export const checkForPrivilage = (allPrivilage, privilage) => {
  if (validate(allPrivilage) && validate(privilage)) {
    for (var i = 0; i < allPrivilage.length; i++) {
      if (allPrivilage[i] === privilage)
        return true;
    }
  }
  return false;
}


//getIconForDataTable Button
export const getIcon = (row, className, onClick) => {
  return <i className={className + " pointerIcon"} onClick={() => onClick(row)} />
}


export const formatDate = (value) => {
  return new Date(value).getFullYear() + "-" + (new Date(value).getMonth() + 1) + "-" + new Date(value).getDate();
}

//get Status Field
export const getstatusField = (row, className, onClick) => {
  if (row.status == 1)
    return <div> Pending</div>
}


//Using for creating select box options with value and label tags
export const getSelectOptions = (data, value, label) => {
  if (validate(data) && validate(value) && validate(label)) {
    data.forEach(element => {
      element.value = element[value];
      element.label = element[label];
    });
  }
  return data;
}
