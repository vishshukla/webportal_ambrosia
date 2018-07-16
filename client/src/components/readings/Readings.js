import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentReadings } from '../../actions/readingsActions';
class Readings extends Component {
    componentDidMount() {
        this.props.getCurrentReadings();
    }


    render() {
        return (
            <div>
                <h1 className="text-center">Readings</h1>
            </div>
        )
    }
}

export default connect(null, { getCurrentReadings })(Readings);