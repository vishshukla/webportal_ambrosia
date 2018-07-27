import React, { Component } from 'react'
import { logoutUser } from '../../actions/authActions';
import { PropTypes } from 'prop-types';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { clearCurrentProfile } from '../../actions/readingsActions';
// import EditProfile from '../edit-profile/EditProfile';
// import './styles/Navbar.css';

const styles = {
    listStyleType: 'none',
    float: 'right',
    textDecoration: 'none'
}
const liStyles = {
    // display: "inline-block",
    padding: "0 5px",

}
// const goToEditProfile = () => {

// }

class Navbar extends Component {
    onLogoutClick(e) {
        e.preventDefault();
        this.props.clearCurrentProfile();
        this.props.logoutUser();
    }
    onEditProfile(e) {
        e.preventDefault();
        this.props.history.push('/edit-profile')
    }
    // isAuthenticated() {
    //     this.props.auth.isAuthenticated;
    // }
    // componentDidMount() {

    // }

    render() {
        const authLinks = (
            <ul style={styles} className="navbar-nav ml-auto">
                <li className="nav-item" style={liStyles}>
                    <a href="/history" className="nav-link">
                        {' '} History
                    </a>
                </li>
                <li className="nav-item" style={liStyles}>
                    <a href="/readings" className="nav-link">
                        {' '} Readings
                    </a>
                </li>
                <li className="nav-item" style={liStyles}>
                    <a href="/edit-profile" className="nav-link">
                        {' '} Edit Profile
                    </a>
                </li>
                <li className="nav-item" style={liStyles}>
                    <a href="/login" onClick={this.onLogoutClick.bind(this)} className="nav-link">
                        Log out
                    </a>
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