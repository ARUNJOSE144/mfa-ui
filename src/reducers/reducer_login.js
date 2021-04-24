import { LOGIN, LOGOUT } from '../util/ActionConstants';
import { LOGIN_ERROR_CODES } from '../util/Messages';

export default function (state = {}, action) {

    switch (action.type) {
        case LOGIN:
            const { payload } = action;
            console.log({ payload })
            let login;
            if (payload && payload.status === 200) {
                const { data } = payload;
                login = data.resultCode === '0' && data.token && data.userId ? {
                    isLoggedIn: true,
                    userDetails: data,
                    respMsg: null
                } : {
                        respMsg: data.responseMsg || LOGIN_ERROR_CODES['generic'],
                        isLoggedIn: false,
                        userDetails: null,
                        time: new Date().getTime()
                    }
            } else {
                const { response } = payload;
                const data = response ? response.data || {} : {};
                login = {
                    //respMsg: data.responseMsg || LOGIN_ERROR_CODES['generic'],     //Commmended for avoiding the massage "Loggin Failed" in login page
                    respMsg: data.responseMsg ,  
                    isLoggedIn: false,
                    userDetails: null,
                    time: new Date().getTime()
                }
            }
            return login;

        case LOGOUT:
            return { isLoggedIn: false, userDetails: null, respMsg: "You Have Been Logged Out" }

        default:
            return state;
    }

}
