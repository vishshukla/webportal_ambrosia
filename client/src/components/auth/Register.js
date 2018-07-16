import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';
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

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push('/store');
        }
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

                                <TextFieldGroup
                                    placeholder="First Name"
                                    name="first_name"
                                    type="text"
                                    value={this.state.first_name}
                                    onChange={this.onChange}
                                    error={errors.first_name}
                                />
                                <TextFieldGroup
                                    placeholder="Last Name"
                                    name="last_name"
                                    type="text"
                                    value={this.state.last_name}
                                    onChange={this.onChange}
                                    error={errors.last_name}
                                />
                                <TextFieldGroup
                                    placeholder="Email"
                                    name="email"
                                    type="text"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    error={errors.email}
                                    info="A verification link will be sent to this email."
                                />

                                <TextFieldGroup
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    error={errors.password}
                                />

                                <TextFieldGroup
                                    placeholder="Confirm Password"
                                    name="confirm_password"
                                    type="password"
                                    value={this.state.confirm_password}
                                    onChange={this.onChange}
                                    error={errors.confirm_password}
                                />


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