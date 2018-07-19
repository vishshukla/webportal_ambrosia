import { GET_READINGS, READINGS_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
    readings: {},
    loading: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case READINGS_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_READINGS:
            return {
                ...state,
                readings: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: {}
            }
        default:
            return state;
    }
}