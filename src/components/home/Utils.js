import { store } from '../../index';
import AjaxUtil from '../generic/ajax/elements/ajax/util/AjaxUtil';
import { setToastNotif, setLogOut, setHeader, setModalPopup, setLoading } from '../../actions';
import { saveCurrentState } from "../../actions/index";
import { AUTH_KEY } from '../../util/Constants';

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
