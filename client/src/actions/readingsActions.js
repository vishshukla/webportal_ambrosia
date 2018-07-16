// import React from 'react'
import axios from 'axios';
// import { Redirect } from 'react-router';

import { GET_READINGS, READINGS_LOADING, CLEAR_CURRENT_PROFILE } from './types';

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
        .catch(
            // < Redirect to='/login' />
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

export default function () {

}