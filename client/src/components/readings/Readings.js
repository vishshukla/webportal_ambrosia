import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentReadings } from '../../actions/readingsActions';
import ReadingRow from './row/ReadingRow';
import './styles/Readings.css';
// import ReadingRow from './row/ReadingRow';
// import Spinner from '../common/Spinner';

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
        const { readings } = this.props.readings;

        let readingsContent;

        // Check if logged in user has any reading data
        if (readings === null || readings === {}) {
            readingsContent = (
                <div >
                    <div className="lead text-muted text-center">
                        <h4>Welcome {user.name}</h4>
                        <p>You have no recent readings, please connect device to app and check back here.</p>
                    </div>
                </div>
            )
        } else {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var temp = []
            var times = []
            var level = []
            var rows = []
            var index = 0
            for (var i in readings) {
                for (var j in readings[i]) {
                    // <ReadingRow />
                    temp.push(readings[i][j])
                }
                level.push(temp[0])
                times.push(temp[1])
                //TODO: FORMAT TIMING
                var date = new Date(temp[1] - 1000)
                var month = monthNames[date.getMonth()].substr(0, 3)
                var day = date.getDay();
                var time = date.getHours() + ":" + date.getMinutes();
                rows.push(<ReadingRow reading_level={temp[0]} reading_time={month + " " + day + " " + time} />)
                index++;
                temp = []
            }
            //find smallest
            var smallestIndex = -1;
            for (var x = 0; x < times.length; ++x) {
                if (x === -1) {
                    smallestIndex = x;
                }
            }
            if (smallestIndex === -1) {
                //no smallest was found
            }
            console.log(rows)
            // User is logged in but has no readings
            readingsContent = (
                <div>
                    <h2 className="text-center">Most Recent: {level[0]}</h2>
                    <table className="table-resp">
                        <tbody>
                            <tr>
                                <th>Date/Time</th>
                                <th>Level</th>
                            </tr>
                            {rows}
                        </tbody>
                    </table>
                </div>
            )
        }

        return (
            <div className="" >
                <caption><b>Glucose Readings</b></caption>
                {readingsContent}
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