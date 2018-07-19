import React, { Component } from 'react'
import { logoutUser } from '../../actions/authActions';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentProfile } from '../../actions/readingsActions';
// import './styles/Navbar.css';


class Navbar extends Component {
    onLogoutClick(e) {
        e.preventDefault();
        this.props.clearCurrentProfile();
        this.props.logoutUser();
    }
    // isAuthenticated() {
    //     this.props.auth.isAuthenticated;
    // }
    componentDidMount() {
        return this.props.auth.isAuthenticated;
    }

    render() {
        const authLinks = (
            <ul className="navbar-nav ml-auto">
                {/* <li className="nav-item">
                    <Link className="nav-link" onClick={this.getCurrentReadings()} to="/readings">Readings</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/settings">Settings</Link>
                </li> */}
                <li className="nav-item">
                    <Link to="/" onClick={this.onLogoutClick.bind(this)} className="nav-link">
                        {' '} Log out
                    </Link>
                </li>
            </ul>
        )

        return (
            <div>
                {this.props.auth.isAuthenticated ? authLinks : ""}
            </div>
        )
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(Navbar);