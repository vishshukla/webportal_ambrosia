import React, { Component } from 'react'
// import './styles/Register.css'
// import './js/Register'
class Register extends Component {
    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
            errors: {}
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your Ambrosia account</p>
                            <form action="create-profile.html">
                                <div className="form-group">
                                    <input type="text"
                                        className="form-control form-control-lg"
                                        value={this.state.first_name}
                                        placeholder="First Name"
                                        name="first_name" required
                                        onChange={this.onChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        className="form-control form-control-lg"
                                        value={this.state.last_name}
                                        placeholder="Last Name"
                                        name="last_name" required
                                        onChange={this.onChange} />
                                </div>
                                <div className="form-group">
                                    <input type="email"
                                        className="form-control form-control-lg" value={this.state.email}
                                        placeholder="Email"
                                        name="email" required
                                        onChange={this.onChange} />
                                    <small className="form-text text-muted">A verification link will be sent to this email.</small>
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Password*"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange} required />
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className="form-control form-control-lg"
                                        placeholder="Confirm Password*"
                                        value={this.state.confirm_password}
                                        name="confirm_password"
                                        onChange={this.onChange} required />
                                </div>
                                <input type="submit" className="btn btn-info btn-block mt-4" />
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

export default Register;