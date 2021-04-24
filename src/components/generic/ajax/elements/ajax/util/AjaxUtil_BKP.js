import { BL_STATUS_CODES, BL_RESULT_CODES } from '../../../constants/StatusCode';
import { GENERIC_SUCCESS_MSG, GENERIC_ERROR_MSG } from '../../../constants/Messages';
import { ajax } from '../Ajax';

export default class AjaxUtil {
  constructor(obj) {
    this.RESPONSE_CODES = {
      STATUS_SUCCESS: obj.responseCode ? (obj.responseCode.success || BL_STATUS_CODES.SUCCESS) : BL_STATUS_CODES.SUCCESS,
      STATUS_UNAUTH: obj.responseCode ? (obj.responseCode.resultParam || BL_STATUS_CODES.UNATHORIZED) : BL_STATUS_CODES.UNATHORIZED,
      RESULT_PARAM: obj.responseCode.resultParam || 'resultCode',
      RESULT_SUCCESS: obj.responseCode ? (obj.responseCode.resultSuccess || BL_RESULT_CODES.SUCCESS) : BL_RESULT_CODES.SUCCESS
    }
    this.MESSAGES = {
      RESULT_PARAM: obj.messages.resultParam || 'message',
      SUCCESS: obj.messages ? (obj.messages.success || GENERIC_SUCCESS_MSG) : GENERIC_SUCCESS_MSG,
      FAILURE: obj.messages ? (obj.messages.failure || GENERIC_ERROR_MSG) : GENERIC_ERROR_MSG
    }
    this.setNotification = obj.setNotification;
    this.logout = obj.logout;
    this.authKey = obj.authKey;
    this.channel = obj.channel;

    this.makeCallBack = this.makeCallBack.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
  }
  makeCallBack(response, callback, isShowGenericMessage, isShowSuccess, isShowFailure, isProceedOnError, returnFullResponse) {
    if (response && response.status === this.RESPONSE_CODES.STATUS_SUCCESS) {
      if (response.data && response.data[this.RESPONSE_CODES.RESULT_PARAM]) {
        const hasError = (response.data[this.RESPONSE_CODES.RESULT_PARAM] === this.RESPONSE_CODES.RESULT_SUCCESS ? false : true)
        if (hasError && isProceedOnError) {
          if (callback)
            callback(returnFullResponse ? response : response.data, hasError);
        } else if (!hasError) {
          if (callback)
            callback(returnFullResponse ? response : response.data, hasError);
        }
        if (isShowSuccess && !hasError) {
          if (response.data[this.MESSAGES.RESULT_PARAM]) {
            if (this.setNotification)
              this.setNotification({ "message": response.data[this.MESSAGES.RESULT_PARAM], "hasError": hasError, "timestamp": new Date().getTime() });
          } else if (isShowGenericMessage) {
            if (this.setNotification)
              this.setNotification({ "message": this.MESSAGES.SUCCESS, "hasError": hasError, "timestamp": new Date().getTime() });
          }
        } else if (isShowFailure && hasError) {
          if (response.data[this.MESSAGES.RESULT_PARAM]) {
            if (this.setNotification)
              this.setNotification({ "message": response.data[this.MESSAGES.RESULT_PARAM], "hasError": hasError, "timestamp": new Date().getTime() });
          } else if (isShowGenericMessage) {
            if (this.setNotification)
              this.setNotification({ "message": this.MESSAGES.FAILURE, "hasError": hasError, "timestamp": new Date().getTime() });
          }
        }
      } else {
        callback(returnFullResponse ? response : response.data, false);
        if (isShowSuccess) {
          if (response.data && response.data[this.MESSAGES.RESULT_PARAM]) {
            if (this.setNotification)
              this.setNotification({ "message": response.data[this.MESSAGES.RESULT_PARAM], "hasError": false, "timestamp": new Date().getTime() });
          } else if (isShowGenericMessage) {
            if (this.setNotification)
              this.setNotification({ "message": this.MESSAGES.SUCCESS, "hasError": false, "timestamp": new Date().getTime() });
          }
        }
      }
    } else if (response && response.status && response.status !== this.RESPONSE_CODES.STATUS_UNAUTH) {
      if (isProceedOnError) {
        if (callback)
          callback(returnFullResponse ? response : (response ? response.data : null), true);
      }

      if (isShowFailure) {
        if (response && response.data && response.data[this.MESSAGES.RESULT_PARAM]) {
          if (this.setNotification)
            this.setNotification({ "message": response.data[this.MESSAGES.RESULT_PARAM], "hasError": true, "timestamp": new Date().getTime() });
        } else if (isShowGenericMessage) {
          if (this.setNotification)
            this.setNotification({ "message": this.MESSAGES.FAILURE, "hasError": true, "timestamp": new Date().getTime() });
        }
      }
    } else if (response && (response.status === this.RESPONSE_CODES.STATUS_UNAUTH || response.status === `${this.RESPONSE_CODES.STATUS_UNAUTH}`)) {
      //Status 401 unauthorized -> Logging Out
      if (this.logout)
        this.logout();

    } else if ((!response || !response.status) && isShowFailure) {
      if (this.setNotification)
        this.setNotification({ "message": this.MESSAGES.FAILURE, "hasError": true, "timestamp": new Date().getTime() });
    }
  }
  getAuthKey() {
    return this.authKey;
  }
  getChannel() {
    return this.channel;
  }
  sendRequest(url, request, callback, loadingFunction, options = {}) {
    ajax(url, request, this.makeCallBack, callback, loadingFunction, { ...options, 'authKey': this.authKey, 'channel': this.channel });
  }
}
