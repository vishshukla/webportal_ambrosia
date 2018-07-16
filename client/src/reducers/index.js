import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import readingsReducer from './readingsReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    readings: readingsReducer,
});
