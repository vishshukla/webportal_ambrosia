//TODO: 
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
            return (
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

                <tbody>
                    {rows}
                </tbody>
            )
        }
        return (
            <div className="text-center" >
                {/* <caption><b>Glucose Readings</b></caption> */}
                <h1><b>Glucose Readings</b></h1>
                <h2 className="text-center">Most Recent: {level[level.length - 1]}</h2>
                <table className="rtable">
                    <thead>
                        <tr>
                            <th>Date / Time</th>
                            <th>Level</th>
                        </tr>
                    </thead>
                    {rows}
                    {/* <tr>
                            <td>Chrome</td>
                            <td>9,562</td>
                            <td>68.81%</td>
                            <td>7,895</td>
                            <td>01:07</td>
                        </tr>
                        <tr>
                            <td>Firefox</td>
                            <td>2,403</td>
                            <td>17.29%</td>
                            <td>2,046</td>
                            <td>00:59</td>
                        </tr>
                        <tr>
                            <td>Safari</td>
                            <td>1,089</td>
                            <td>2.63%</td>
                            <td>904</td>
                            <td>00:59</td>
                        </tr>
                        <tr>
                            <td>Internet Explorer</td>
                            <td>366</td>
                            <td>2.63%</td>
                            <td>333</td>
                            <td>01:01</td>
                        </tr>
                        <tr>
                            <td>Safari (in-app)</td>
                            <td>162</td>
                            <td>1.17%</td>
                            <td>112</td>
                            <td>00:58</td>
                        </tr>
                        <tr>
                            <td>Opera</td>
                            <td>103</td>
                            <td>0.74%</td>
                            <td>87</td>
                            <td>01:22</td>
                        </tr>
                        <tr>
                            <td>Edge</td>
                            <td>98</td>
                            <td>0.71%</td>
                            <td>69</td>
                            <td>01:18</td>
                        </tr>
                        <tr>
                            <td>Other</td>
                            <td>275</td>
                            <td>6.02%</td>
                            <td>90</td>
                            <td>N/A</td>
                        </tr> */}
                </table>


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