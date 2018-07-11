import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
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
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
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
    render() {

        const { errors } = this.state;
        return (
            <div className="register" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your Ambrosia account</p>
                            <form name="regForm" onSubmit={this.onSubmit} method="post">
                                <div className="form-group">
                                    <input type="text"
                                        className={classnames('form-control form-control-md', {
                                            'is-invalid': errors.first_name
                                        })}
                                        value={this.state.first_name}
                                        placeholder="First Name"
                                        name="first_name"
                                        onChange={this.onChange}
                                    />
                                    {errors.first_name && (<div className="invalid-feedback" > {errors.first_name}</div>)}

                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        className={classnames('form-control form-control-md', {
                                            'is-invalid': errors.last_name
                                        })}
                                        value={this.state.last_name}
                                        placeholder="Last Name"
                                        name="last_name"
                                        onChange={this.onChange} />
                                    {errors.last_name && (<div className="invalid-feedback" > {errors.last_name} </div>)}
                                </div>
                                <div className="form-group">
                                    <input type="text"
                                        className={classnames('form-control form-control-md', {
                                            'is-invalid': errors.email
                                        })}
                                        value={this.state.email}
                                        placeholder="Email"
                                        name="email"
                                        onChange={this.onChange} />
                                    {errors.email && (<div className="invalid-feedback" > {errors.email} </div>)}
                                    <small className="form-text text-muted">A verification link will be sent to this email.</small>

                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className={classnames('form-control form-control-md', {
                                            'is-invalid': errors.password
                                        })}
                                        placeholder="Password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChange} />
                                    {errors.password && (<div className="invalid-feedback" > {errors.password} </div>)}
                                    {/* <small className="form-text text-muted">Password must be between 6-20 characters.</small> */}
                                </div>
                                <div className="form-group">
                                    <input type="password"
                                        className={classnames('form-control form-control-md', {
                                            'is-invalid': errors.confirm_password
                                        })}
                                        placeholder="Confirm Password"
                                        value={this.state.confirm_password}
                                        name="confirm_password"
                                        onChange={this.onChange} />
                                    {errors.confirm_password && (<div className="invalid-feedback" > {errors.confirm_password} </div>)}
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

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});


export default connect(mapStateToProps, { registerUser })(withRouter(Register));