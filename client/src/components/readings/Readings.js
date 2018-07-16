import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentReadings } from '../../actions/readingsActions';
import Spinner from '../common/Spinner';

function showObject(obj) {
    var result = "";
    for (var p in obj) {
        for (var q in obj[p]) {
            result += q + " , " + obj[p][q] + "\n";
        }
    }
    return result;
}

class Readings extends Component {

    componentDidMount() {
        this.props.getCurrentReadings();
    }
    // comp
    // componentDidMount() {
    //     if (!this.props.auth.isAuthenticated) {
    //         this.props.history.push('/');
    //     }
    // }
    render() {
        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
        const { user } = this.props.auth;
        const { profile, loading } = this.props.readings;

        let readingsContent;

        if (loading) {
            readingsContent = <Spinner />;
        }
        else {
            // Check if logged in user has any reading data
            if (profile === null) {
                readingsContent = (
                    <div >
                        <p className="lead text-muted text-center">
                            <h4>Welcome {user.name}</h4>
                            <p>You have no recent readings, please connect device to app and check back here.</p>
                        </p>
                    </div>
                )
            } else {
                // User is logged in but has no readings
                readingsContent = (
                    <div >
                        <h4>{showObject(profile)}</h4>
                    </div>
                )
            }
        }

        return (
            <div className="readings">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4 text-center">Readings</h1>
                            {readingsContent}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Readings.propTypes = {
    getCurrentReadings: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    readings: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    readings: state.readings,
    auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentReadings })(Readings);