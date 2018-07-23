import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import axios from '../../../node_modules/axios';

let userInfo = {
    id: '',
    user_type: '',
    prefix: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    email: '',
    ssn: '',
    phone: '',
    address: '',
    zipcode: '',
    city: '',
    state: '',
    country: '',
}

class EditProfile extends Component {

    getInfo() {
        axios.get('/api/user')
            .then(res => {
                console.log(res)
            })
            .catch(
                // window.location.reload()
            );
    }
    constructor(props) {
        this.getInfo()
        super(props);
        var fullName = this.props.user.name;
        var doesHaveMiddleName = false;
        var firstandlast = fullName.split(' ');
        if (firstandlast.length > 2) {
            doesHaveMiddleName = true;
        }
        this.state = {
            user_type: '',
            prefix: '',
            first_name: firstandlast[0],
            middle_name: doesHaveMiddleName ? firstandlast[1] : "",
            last_name: doesHaveMiddleName ? firstandlast[2] : firstandlast[1],
            suffix: '',
            email: '',
            ssn: '',
            phone: '',
            address: '',
            zipcode: '',
            city: '',
            state: '',
            country: '',
            errors: {}
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        // console.log('change')
    }

    onSubmit(e) {
        e.preventDefault();
        console.log('submit')
    }

    render() {
        const { errors } = this.state;

        const accountTypes = [
            { label: 'Update Account Type', value: '' },
            { label: 'Patient', value: 'patient' },
            { label: 'Provider - Medical Facility', value: 'medicalfacility' },
            { label: 'Provider - Physician', value: 'physician' },
            { label: 'Provider - Nurse', value: 'nurse' },
            { label: 'Employer', value: 'employer' },
            { label: 'Payer', value: 'payer' },
            { label: 'Developer', value: 'developer' },
        ];
        return (
            <div className="edit-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Edit Your Profile</h1>
                            <p className="lead text-center">
                                Update your information
                            </p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={this.onSubmit}>
                                <SelectListGroup
                                    placeholder="Status"
                                    name="user_type"
                                    value={this.state.user_type}
                                    onChange={this.state.onChange}
                                    error={errors.handle}
                                    info="What type of account are you using"
                                    options={accountTypes}
                                />
                                <TextFieldGroup
                                    placeholder="Prefix"
                                    onChange={this.onChange}
                                    name="prefix"
                                    error={errors.handle}
                                />
                                <TextFieldGroup
                                    onChange={this.onChange}
                                    value={this.state.first_name}
                                    name="first_name"
                                    error={errors.handle}
                                    info="Update your first name"
                                />
                                <TextFieldGroup
                                    onChange={this.onChange}
                                    value={this.state.last_name}
                                    name="last_name"
                                    error={errors.handle}
                                    info="Update your Last name"
                                />
                                <TextFieldGroup
                                    placeholder="Suffix"
                                    onChange={this.onChange}
                                    value={this.state.suffix}
                                    name="suffix"
                                    error={errors.handle}
                                />
                                <TextFieldGroup
                                    placeholder="Email"
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    name="email"
                                    error={errors.handle}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

EditProfile.propTypes = {
    user: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.auth.user,
    errors: state.errors
});

export default connect(mapStateToProps)(EditProfile);