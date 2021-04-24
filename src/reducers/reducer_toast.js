import { SET_TOAST_NOTIF } from '../util/ActionConstants';

export default function (state = {}, action) {
    switch (action.type) {
        case SET_TOAST_NOTIF:
            return action.payload;

        default:
            return state;
    }
}
