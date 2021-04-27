import uuidv1 from 'uuid/v1';
import md5 from 'md5';

export function getToken(auth, channel) {
    return {
        "X-Auth-Token": getCookie("X-Auth-Token"),
        "X-UserId": getCookie("X-UserId"),
        //"orderId": getuuid(),
        "Authorization": "Basic aW50ZXJmYWNlX3dlYl91c2VyOjk4OHNkc2RAdHU=",
        //"Authorization" : auth,
        //"channel": channel,
        //"Access-Control-Allow-Origin": "*"
    }
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export function setToken(token, userId) {
    if (!token && !userId) {
        document.cookie = `X-Auth-Token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
        document.cookie = `X-UserId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    } else {
        const date = new Date();
        date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
        document.cookie = `X-Auth-Token=${token};expires=${date.toUTCString()};path=/`;
        document.cookie = `X-UserId=${userId};expires=${date.toUTCString()};path=/`;
    }
}
export function getuuid() {
    return uuidv1();
}
export function encrypt(type, value) {
  switch (type) {
    case 'md5':
      return md5(value);
    default:
      return value;
  }
}
