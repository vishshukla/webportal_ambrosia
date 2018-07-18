import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentReadings } from '../../actions/readingsActions';
import Spinner from '../common/Spinner';

class Readings extends Component {

    componentDidMount() {
        this.props.getCurrentReadings();


        if (!this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }
    // comp
    // componentDidMount() {
    //     if (!this.props.auth.isAuthenticated) {
    //         this.props.history.push('/');
    //     }
    // }
    render() {


        const { user } = this.props.auth;
        const { readings, loading } = this.props.readings;

        let readingsContent;

        // Check if logged in user has any reading data
        if (readings === null) {
            readingsContent = (
                <div >
                    <div className="lead text-muted text-center">
                        <h4>Welcome {user.name}</h4>
                        <p>You have no recent readings, please connect device to app and check back here.</p>
                    </div>
                </div>
            )
        } else {
            // var rows = {}
            // for (var x = 0; x < readings.length; ++x) {

            // }
            // console.log(rows)
            // User is logged in but has no readings
            readingsContent = (
                <div>

                </div>
            )
        }

        return (
            <div className="readings" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h1 className="display-4 text-center">Glucose Readings</h1>
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