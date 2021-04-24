import { SET_MODAL_POPUP } from '../util/ActionConstants';

export default function (state = {}, action) {
    switch (action.type) {
        case SET_MODAL_POPUP:
            return action.payload;

        default:
            return state;
    }
}
