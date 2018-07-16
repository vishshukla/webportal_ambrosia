import axios from 'axios';

import { GET_READINGS, READINGS_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from './types';

// Get current profile
export const getCurrentReadings = () => dispatch => {
    dispatch(setReadingLoading());
    axios.get('/api/user/readings')
        .then(res => {
            dispatch({
                type: GET_READINGS,
                payload: res.data
            });
        })
        .catch(err => dispatch({
            type: GET_READINGS,
            payload: {}
        })
        );
}


// Profile loading
export const setReadingLoading = () => {
    return {
        type: READINGS_LOADING
    }
}

// Clear readings
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    };
};