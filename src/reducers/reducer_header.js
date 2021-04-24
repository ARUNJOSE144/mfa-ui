import { SET_HEADER } from '../util/ActionConstants';

export default function (state = {}, action) {
    switch (action.type) {
        case SET_HEADER:
            return action.payload;

        default:
            return state;
    }
}
