import { ajaxRequest, encryptData, setCredentials } from '../components/generic/ajax/elements/ajax/Ajax';
import { LOGIN, LOGOUT, SAVE_STATE, SET_BREAD_CRUMB, SET_HEADER, SET_LOADING, SET_MODAL_POPUP, SET_TOAST_NOTIF } from '../util/ActionConstants';
import { AUTH_KEY, AUTH_URL, LOGIN_URL, LOGOUT_URL } from '../util/Constants';


export function logIn(payload) {
    var url = new URL(window.location.href);

    const data = {
        "username": payload.username,
        "password": encryptData('md5', payload.password)
    };
    const request = ajaxRequest(LOGIN_URL, data, { authKey: AUTH_KEY });
    return {
        type: LOGIN,
        payload: request
    };
}

export function validateLogin() {
    const request = ajaxRequest(AUTH_URL, null, { authKey: AUTH_KEY });
    return {
        type: LOGIN,
        payload: request
    };
}

export function logOut() {
    const request = ajaxRequest(LOGOUT_URL, null, { authKey: AUTH_KEY });
    setCredentials('', '');
    return {
        type: LOGOUT,
        payload: request
    };
}

export function setLogOut() {
    return {
        type: LOGOUT,
        payload: {}
    };
}

export function setLoading(isLoading, isFirstLoad, timestamp) {
    return {
        type: SET_LOADING,
        payload: { isLoading, isFirstLoad, timestamp }
    };
}

export function setToastNotif(options) {
    if (options)
        options.timestamp = new Date().getTime();

    return {
        type: SET_TOAST_NOTIF,
        payload: options
    };
}

export function setModalPopup(options) {
    return {
        type: SET_MODAL_POPUP,
        payload: options
    };
}

export function saveCurrentState(prevState) {
    return {
        type: SAVE_STATE,
        payload: prevState
    };
}

export function setHeader(options) {
    return {
        type: SET_HEADER,
        payload: options
    };
}

export function setBreadCrumb(options) {
    return {
        type: SET_BREAD_CRUMB,
        payload: options
    };
}
