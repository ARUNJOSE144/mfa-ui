import { SET_BREAD_CRUMB } from '../util/ActionConstants';

export default function (state = {}, action) {
    switch (action.type) {
        case SET_BREAD_CRUMB:
            return action.payload;

        default:
            return state;
    }
}
