import { SAVE_STATE } from '../util/ActionConstants';

export default function (state = null,action) {
    switch(action.type) {
        case SAVE_STATE :
         return action.payload;
        default:
          return state;
    }
}
