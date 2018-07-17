import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import './styles/Landing.css';
import newlogo from './newlogo.png';
class Landing extends Component {

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/readings');
        }
    }
    render() {
        return (
            < div className="container" >
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="panel panel-login">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <form id="login-form" action="#" method="post" style={{ display: "block" }}>
                                            <img src={newlogo} alt="Ambrosia" className="center" />
                                            <h2>LOGIN</h2>
                                            <div className="form-group">
                                                <input type="text" name="username" id="username" tabIndex="1" className="form-control" placeholder="Email" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" name="password" id="password" tabIndex="2" className="form-control" placeholder="Password" />
                                            </div>
                                            <div className="col-xs-6 form-group pull-left checkbox">
                                                <input id="checkbox1" type="checkbox" name="remember" />
                                                <label htmlFor="checkbox1">Remember Me</label>
                                            </div>
                                            <div className="col-xs-6 form-group pull-right">
                                                <input type="submit" name="login-submit" id="login-submit" tabIndex="4" className="form-control btn btn-login" value="Log In" />
                                            </div>
                                        </form>
                                        {/* <form id="register-form" action="#" method="post" role="form" style={{ display: 'none' }}>
                                            <h2>REGISTER</h2>
                                            <div className="form-group">
                                                <input type="text" name="username" id="username" tabIndex="1" className="form-control" placeholder="Username" value="" />
                                            </div>
                                            <div className="form-group">
                                                <input type="email" name="email" id="email" tabIndex="1" className="form-control" placeholder="Email Address" value="" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" name="password" id="password" tabIndex="2" className="form-control" placeholder="Password" />
                                            </div>
                                            <div className="form-group">
                                                <input type="password" name="confirm-password" id="confirm-password" tabIndex="2" className="form-control" placeholder="Confirm Password" />
                                            </div>
                                            <div className="form-group">
                                                <div className="row">
                                                    <div className="col-sm-6 col-sm-offset-3">
                                                        <input type="submit" name="register-submit" id="register-submit" tabIndex="4" className="form-control btn btn-register" value="Register Now" />
                                                    </div>
                                                </div>
                                            </div>
                                        </form> */}
                                    </div>
                                </div>
                            </div>
                            <div className="panel-heading">
                                <div className="row">
                                    <div className="col-xs-6 tabs">
                                        <a href="http://google.com" className="active" id="login-form-link">
                                            <div className="login">LOGIN</div>
                                        </a>
                                    </div>
                                    <div className="col-xs-6 tabs">
                                        <a href="http://google.com" id="register-form-link">
                                            <div className="register">REGISTER</div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Landing);