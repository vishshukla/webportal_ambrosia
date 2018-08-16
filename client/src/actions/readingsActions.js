// import React from 'react'
import axios from 'axios';
// import { Redirect } from 'react-router';

import { GET_READINGS, READINGS_LOADING, CLEAR_CURRENT_PROFILE } from './types';

// Get current profile
export const getCurrentReadings = () => dispatch => {
    dispatch(setReadingLoading());
    axios.get('http://122.170.0.55:7823/blucon/app-server/ios/')
        .then(res => {
            dispatch({
                type: GET_READINGS,
                payload: res.data
            });
        })
        .catch(
            // window.location.reload()
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