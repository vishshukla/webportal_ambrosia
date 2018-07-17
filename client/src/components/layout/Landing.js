import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import './styles/Landing.css';
import newlogo from './newlogo.png';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser } from '../../actions/authActions';
// import Spinner from '../common/Spinner';
class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            errors: {},

        };
        this.onChange = this.onChange.bind(this);
        this.onSubmitLoginAttempt = this.onSubmitLoginAttempt.bind(this);
        // this.onSubmitRegistrationAttempt = this.onSubmitRegistrationAttempt.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/readings');
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            window.location.reload();
        }
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    };

    onSubmitLoginAttempt(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password,
        }

        this.props.loginUser(userData);
    }

    // onRegisterAttempt(e) {

    // }


    render() {
        const { errors } = this.state;

        return (
            < div className="container" >
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="panel panel-login">
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <form id="login-form" onSubmit={this.onSubmitLoginAttempt} action="#" method="post" style={{ display: "block" }}>
                                            <img src={newlogo} rel="preload" alt="Ambrosia" className="center" />
                                            <h2>LOGIN</h2>

                                            <TextFieldGroup name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} error={errors.email} />

                                            {/* <div className="form-group">
                                                <input type="text" name="username" id="username" tabIndex="1" className="form-control" placeholder="Email" />
                                            </div> */}
                                            <TextFieldGroup name="password"
                                                type="password"
                                                placeholder="Password"
                                                value={this.state.password}
                                                onChange={this.onChange} error={errors.password} />
                                            {/* <div className="form-group">
                                                <input type="password" name="password" id="password" tabIndex="2" className="form-control" placeholder="Password" />
                                            </div> */}
                                            <div className="col-xs-6 form-group pull-left checkbox">
                                                <input id="checkbox1" type="checkbox" name="remember" />
                                                <label htmlFor="checkbox1">Remember Me</label>
                                            </div>
                                            <div className="col-xs-6 form-group pull-right">
                                                <input type="submit" tabIndex="4" className="form-control btn btn-login" value="Submit" />
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
                                    <div className="col-xs-6 tabs btn disabled">
                                        <Link to="/" className="" id="login-form-link">
                                            <div className="login">LOGIN</div>
                                        </Link>
                                    </div>
                                    <div className="col-xs-6 tabs btn">
                                        <Link to="/" id="register-form-link">
                                            <div className="register">REGISTER</div>
                                        </Link>
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
    auth: PropTypes.object.isRequired,
    loginUser: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Landing);