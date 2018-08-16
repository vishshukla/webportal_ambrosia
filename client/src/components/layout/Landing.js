//CURRENTLY WORKING ON THIS - VISHWAS

import React, { Component } from 'react'
import axios from 'axios';
// import { Link } from 'react-router-dom'
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import './styles/Landing.css';
import newlogo from './newlogo.png';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser, registerUser } from '../../actions/authActions';
import $ from 'jquery';
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
            isHidden: true,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmitLoginAttempt = this.onSubmitLoginAttempt.bind(this);
        this.onSubmitRegistrationAttempt = this.onSubmitRegistrationAttempt.bind(this);
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
        this.props.history.push('/readings');
        // fetch('http://122.170.0.55:7823/blucon/app-server/ios/sign-in', {
        //     method: 'POST',
        //     body: JSON.stringify(userData)
        // }).then(response => console.log(response.json()))
        //     .catch(err => console.log(err))
        $.ajax({
            method: "POST",
            url: "http://122.170.0.55:7823/blucon/app-server/ios/sign-in",
            data: userData,
            success: function (data) {
                var DataJSON = JSON.parse(data);
                localStorage.setItem("token", DataJSON.token);
            },
            error: function (error) {
                console.log(error);
            }
        });
    }

    onSubmitRegistrationAttempt(e) {
        e.preventDefault();

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            password: this.state.password,
            confirm_password: this.state.confirm_password
        }
        this.props.registerUser(newUser, this.props.history);
    }
    showLoginForm() {
        $(".se-pre-con").fadeIn("fast");
        $(".se-pre-con").fadeOut("slow");
        setTimeout(() => {
            // window.location.reload()
            // this.setState({});
            let login_button = document.getElementById("login_button");
            let regForm = document.getElementById("registration_form_body");
            let login_form = document.getElementById("login_form_body");
            let reg_button = document.getElementById("register_button");
            login_form.style.display = "block";
            regForm.style.display = "none";

            login_button.classList.add('disabled');
            reg_button.classList.remove('disabled');
        }, 200)
        // window.location.reload()

    }
    showRegistraionForm() {
        $(".se-pre-con").fadeIn("fast");
        $(".se-pre-con").fadeOut("slow");
        setTimeout(() => {
            let login_button = document.getElementById("login_button");
            let regForm = document.getElementById("registration_form_body");
            let login_form = document.getElementById("login_form_body");
            let reg_button = document.getElementById("register_button");
            login_form.style.display = "none";
            regForm.style.display = "block";
            reg_button.classList.add('disabled');
            login_button.classList.remove('disabled');
        }, 200);
    }

    render() {
        const { errors } = this.state;

        return (
            < div className="container" >
                <div className="row">
                    <div className="col-md-6 col-md-offset-3">
                        <div className="panel panel-login">
                            <div id="login_form_body">
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <form id="login-form" onSubmit={this.onSubmitLoginAttempt} action="#" style={{ display: "block" }}>
                                                <img src={newlogo} rel="preload" alt="Ambrosia" className="center" />
                                                <h2>LOGIN</h2>
                                                <TextFieldGroup name="email" placeholder="Email" value={this.state.email} onChange={this.onChange} error={errors.email} />
                                                <TextFieldGroup name="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    value={this.state.password}
                                                    onChange={this.onChange} error={errors.password} />
                                                <div className="col-xs-6 form-group pull-right">
                                                    <input type="submit" tabIndex="4" className="form-control btn btn-login" value="Submit" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id="registration_form_body" style={{ display: "none" }}>

                                <div className="panel-body">
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <form id="register-form" onSubmit={this.onSubmitRegistrationAttempt} rel="preload" action="#" style={{ display: "block" }}>
                                                <img src={newlogo} rel="preload" alt="Ambrosia" className="center" />
                                                <h2>REGISTER</h2>
                                                <TextFieldGroup name="first_name"
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={this.state.first_name}
                                                    onChange={this.onChange}
                                                    error={errors.first_name} />
                                                <TextFieldGroup name="last_name"
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={this.state.last_name}
                                                    onChange={this.onChange}
                                                    error={errors.last_name} />
                                                <TextFieldGroup name="email"
                                                    type="text"
                                                    placeholder="Email"
                                                    value={this.state.email}
                                                    onChange={this.onChange}
                                                    error={errors.email} />
                                                <TextFieldGroup name="password"
                                                    type="password"
                                                    placeholder="Create Password"
                                                    value={this.state.password}
                                                    onChange={this.onChange}
                                                    error={errors.password} />
                                                <TextFieldGroup name="confirm_password"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={this.state.confirm_password}
                                                    onChange={this.onChange}
                                                    error={errors.confirm_password} />
                                                <div className="col-xs-6 form-group pull-right">
                                                    <input type="submit" name="register-submit" id="register-submit" className="form-control btn btn-login" value="Submit" />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="panel-heading">
                                <div className="row">
                                    <div id="login_button" className="col-xs-6 tabs btn disabled">
                                        <div onClick={this.showLoginForm}
                                            className="login">LOGIN</div>
                                    </div>
                                    <div id="register_button" className="col-xs-6 tabs btn">
                                        <div className="register" onClick={this.showRegistraionForm}>REGISTER</div>
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
    errors: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser, registerUser })(Landing);