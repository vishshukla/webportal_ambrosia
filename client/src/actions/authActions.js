import axios from 'axios';
// import React from 'react';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
// import { Redirect } from 'react-router-dom';

import { GET_ERRORS, SET_CURRENT_USER } from "./types";
/* axios.post('/register', newUser)
            .then(res => console.log(res.data))
            .catch(err => this.setState({ errors: err.response.data })) 
*/
// Register User
// axios.defaults.baseURL = 'localhost:8000'
export const registerUser = (userData, history) => dispatch => {
    axios.post('/register', userData)
        .then(red => history.push('/login'))
        .catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};


// Login - Get User Token
export const loginUser = (userData) => dispatch => {
    axios.put("/login", userData)
        .then(res => {
            //Save to localStorage
            const { token } = res.data;
            //Set token to ls
            localStorage.setItem('jwtToken', token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        }).catch(err =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }));
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}


// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
    window.location.reload();
};