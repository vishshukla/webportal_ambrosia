//CURRENTLY WORKING ON THIS - VISHWAS

import React, { Component } from 'react'
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import './styles/Landing.css';
import newlogo from './newlogo.png';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser, registerUser } from '../../actions/authActions';
import $ from 'jquery';
class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            // confirm_password: '',
            dob: '',
            phone1: '',
            country: '',
            errors: {},
            isHidden: true,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmitLoginAttempt = this.onSubmitLoginAttempt.bind(this);
        this.onSubmitRegistrationAttempt = this.onSubmitRegistrationAttempt.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("token") !== null) {
            this.props.history.push('/readings');
        }
    }
    componentWillReceiveProps() {
        if (localStorage.token) {
            window.location.reload();
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
        // this.props.history.push('/readings');
        $.ajax({
            method: "POST",
            url: "https://www.ambrosiasys.com/app-server/ios/sign-in",
            data: userData,
            success: function (data) {
                var DataJSON = JSON.parse(data);
                if (DataJSON.success === false) {
                    this.setState({ errors: DataJSON.msg })
                    console.log(DataJSON.msg)
                } else {
                    localStorage.setItem("token", DataJSON.token);
                    localStorage.setItem("device_id", DataJSON.device_id);
                    console.log(DataJSON);
                    window.location.reload();
                }
            }.bind(this),
            error: (error) => {
                console.log(JSON.parse(error));
            }
        })
    }

    onSubmitRegistrationAttempt(e) {
        e.preventDefault();

        const newUser = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            dob: this.state.dob,
            password: this.state.password,
            phone1: this.state.phone1,
            country: this.state.country
        }

        $.ajax({
            method: "POST",
            url: "https://www.ambrosiasys.com/app-server/ios/patient-registration",
            data: newUser,
            success: (data) => {
                var DataJSON = JSON.parse(data);
                if (DataJSON.success === false) {
                    this.setState({ errors: DataJSON.msg })
                    console.log(DataJSON.msg)
                } else {
                    console.log(DataJSON)
                    window.location.reload();
                }
            },
            error: error => {
                console.log(error);
            }
        });
        // this.props.registerUser(newUser, this.props.history);
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
                                            <form id="register-form" onSubmit={this.onSubmitRegistrationAttempt} action="#" style={{ display: "block" }}>
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
                                                <TextFieldGroup name="dob"
                                                    type="text"
                                                    placeholder="DOB (dd/mm/yy)"
                                                    value={this.state.dob}
                                                    onChange={this.onChange}
                                                    error={errors.dob} />
                                                <TextFieldGroup name="phone1"
                                                    type="text"
                                                    placeholder="Phone"
                                                    value={this.state.phone1}
                                                    onChange={this.onChange}
                                                    error={errors.phone} />
                                                <TextFieldGroup name="password"
                                                    type="password"
                                                    placeholder="Password"
                                                    value={this.state.password}
                                                    onChange={this.onChange}
                                                    error={errors.password} />
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