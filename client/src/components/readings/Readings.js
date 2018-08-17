//TODO: 
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { getCurrentReadings } from '../../actions/readingsActions';
// import ReadingRow from './row/ReadingRow';
import './styles/Readings.css';
import $ from 'jquery';
// import ReadingRow from './row/ReadingRow';
// import Spinner from '../common/Spinner';

class Readings extends Component {
    constructor(props) {
        let d = new Date();
        d.setDate(d.getDate() - 1);
        let startTime = (new Date()).valueOf() - 24 * 60 * 60 * 1000;
        super(props);
        this.state = {
            data: {},
          /*default to 24 hours*/  begin_date: startTime,
            end_date: (new Date()).valueOf(),
        };

        // this.onChange = this.onChange.bind(this);
        // this.onSubmitLoginAttempt = this.onSubmitLoginAttempt.bind(this);
    }

    componentWillMount() {
        if (localStorage.getItem("token") === null) {
            this.props.history.push('/');
        }
    }
    componentDidMount() {
        $.ajax({
            method: "POST",
            url: "https://www.ambrosiasys.com/app-server/ios/get-patient-reading",
            data: {
                "token": localStorage.getItem("token"),
                "begin_date": this.state.begin_date,
                "end_date": this.state.end_date,
            },
            success: function (data) {
                var DataJSON = JSON.parse(data);
                if (DataJSON.success === false) {
                    console.log(DataJSON)
                } else {
                    this.setState({ data: DataJSON })
                }
            }.bind(this),
            error: (error) => {
                console.log(JSON.parse(error));
            }
        })
    }

    changeInterval(e) {
        console.log()
        let d = new Date();
        let milliseconds = Math.floor((new Date()).getTime() / 1000);
        this.setState({ end_time: milliseconds })
        if (e.value === "24hrs") {
            d.setDate(d.getDate() - 1);
            this.setState({ begin_date: (new Date()).valueOf() - 24 * 60 * 60 * 1000 }) //Calculate 24 hours before
        } else if (e.value === "7days") {
            this.setState({ begin_date: (new Date()).valueOf() - 7 * 24 * 60 * 60 * 1000 })
        } else {
            d.setDate(d.getDate() - 30);
            this.setState({ begin_date: (new Date()).valueOf() - 30 * 24 * 60 * 60 * 1000 })
        }

        $.ajax({
            method: "POST",
            url: "https://www.ambrosiasys.com/app-server/ios/get-patient-reading",
            data: {
                "token": localStorage.getItem("token"),
                "begin_date": this.state.begin_date,
                "end_date": this.state.end_date,
            },
            success: function (data) {
                var DataJSON = JSON.parse(data);
                if (DataJSON.success === false) {
                    console.log(DataJSON)
                } else {
                    this.setState({ data: DataJSON })
                }
            }.bind(this),
            error: (error) => {
                console.log(JSON.parse(error));
            }
        })
        // console.log(this.state.begin_date)
    }
    // comp
    // componentDidMount() {
    //     if (!this.props.auth.isAuthenticated) {
    //         this.props.history.push('/');
    //     }
    // }

    render() {
        // const { user } = this.props.auth;


        // Check if logged in user has any reading data
        // if (readings === null || readings === {}) {
        //     return (
        //         <div >
        //             <div className="lead text-muted text-center">
        //                 <h4>Welcome</h4>
        //                 <p>You have no recent readings, please connect device to app and check back here.</p>
        //             </div>
        //         </div>
        //     )
        // } else {
        // const monthNames = ["January", "February", "March", "April", "May", "June",
        //     "July", "August", "September", "October", "November", "December"
        // ];
        // var temp = []
        // var times = []
        // var level = []
        // var rows = []
        // for (var i in readings) {
        //     for (var j in readings[i]) {
        //         // <ReadingRow />
        //         temp.push(readings[i][j])
        //     }
        //     level.push(temp[0])
        //     times.push(temp[1])
        //     //TODO: FORMAT TIMING
        //     var date = new Date(temp[1] - 1000)
        //     var month = monthNames[date.getMonth()].substr(0, 3)
        //     var day = date.getDay();
        //     var time = date.getHours() + ":" + date.getMinutes();
        //     rows.push(<ReadingRow reading_level={temp[0]} reading_time={month + " " + day + " " + time} />)
        //     temp = []
        // }
        //find smallest
        // var smallestIndex = -1;
        // for (var x = 0; x < times.length; ++x) {
        //     if (x === -1) {
        //         smallestIndex = x;
        //     }
        // }
        // if (smallestIndex === -1) {
        //     //no smallest was found
        // }
        // // User is logged in but has no readings
        // console.log(rows)
        // let row = {}
        // }

        return (
            <div className="container">
                <button value="24hrs" onClick={this.changeInterval.bind(this)}> Last 24 Hours</button>
                <button value="7days" onClick={this.changeInterval.bind(this)} > Last 7 Days</button>
                <button value="30days" onClick={this.changeInterval.bind(this)} > Last 30 Days</button>
                < h1 className="text-center"> Readings Page</h1 >
                <br />
                <h3> {JSON.stringify(this.state.data)} </h3>
            </div>

        )
    }
}
//tried to implement react/redux but ultimately decided to stay with react only

// Readings.propTypes = {
//     getCurrentReadings: PropTypes.func.isRequired,
//     auth: PropTypes.object.isRequired,
//     readings: PropTypes.object.isRequired
// }

// const mapStateToProps = state => ({
//     readings: state.readings,
//     auth: state.auth,
// });

export default Readings;