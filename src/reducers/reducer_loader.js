import _ from 'lodash';

import { SET_LOADING, LOGIN } from '../util/ActionConstants';

export default function (state = { activeLoaders: [] }, action) {
    switch (action.type) {
        case SET_LOADING:

            // if (!action.payload.isLoading && state.timestamp && state.timestamp === action.payload.timestamp)
            //   return action.payload;
            // else if (!action.payload.isLoading)
            //   return state;
            // else
            //   return action.payload;

            const activeLoaders = [...(state.activeLoaders || [])];
            
            if (action.payload.isLoading) {
                if (action.payload.timestamp) {
                    activeLoaders.push(action.payload.timestamp);
                }
                return { isLoading: true, activeLoaders }
            } else {
                if (action.payload.timestamp) {
                    _.remove(activeLoaders, loaderId => loaderId === action.payload.timestamp)
                }
                const isLoading = activeLoaders.length > 0 ? true : false;
                return { isLoading, activeLoaders }
            }

        case LOGIN:
            return { isLoading: false };

        default:
            return state;
    }
}