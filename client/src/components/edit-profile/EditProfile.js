// CURRENTLY WORKING ON THIS - VISHWAS 
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
// import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import SelectListGroup from '../common/SelectListGroup';
import axios from '../../../node_modules/axios';



class EditProfile extends Component {


    constructor(props) {
        super(props);
        // var fullName = this.props.user.name;
        // var doesHaveMiddleName = false;
        // var firstandlast = fullName.split(' ');
        // if (firstandlast.length > 2) {
        //     doesHaveMiddleName = true;
        // }
        this.state = {
            ID: '',
            UserType: '',
            Prefix: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            Suffix: '',
            Email: '',
            Ssn: '',
            Phone: '',
            Address: '',
            Zipcode: '',
            City: '',
            State: '',
            Country: '',
            CurrentPassword: '',
            NewPassword: '',
            ConfirmPassword: '',
            errors: {}
        }
        axios.get('/api/user')
            .then(res => {
                for (let key in res.data) {
                    if (res.data.hasOwnProperty(key)) {
                        this.setState({ [key]: res.data[key] })
                    }
                }
            });

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
        // console.log('change')
    }

    onSubmit(e) {
        //temp (MAKE ACTION)
        const userData = {
            ID: this.state.ID,
            UserType: this.state.UserType,
            Prefix: this.state.Prefix,
            FirstName: this.state.FirstName,
            MiddleName: this.state.MiddleName,
            LastName: this.state.LastName,
            Suffix: this.state.Suffix,
            Email: this.state.Email,
            Ssn: this.state.Ssn,
            Phone: this.state.Phone,
            Address: this.state.Address,
            Zipcode: this.state.Zipcode,
            City: this.state.City,
            State: this.state.State,
            Country: this.state.Country,
            CurrentPassword: this.state.CurrentPassword,
            NewPassword: this.state.NewPassword,
            ConfirmPassword: this.state.ConfirmPassword,
        }
        axios.put('/api/user', userData)
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(err.response.data)
                this.setState({ errors: err.response.data })
            })
        e.preventDefault();
    }

    render() {

        // console.log(this.state)
        // const { errors } = this.state;

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

        const prefixes = [
            { label: 'Prefix', value: '' },
            { label: 'Mr.', value: 'Mr.' },
            { label: 'Mrs.', value: 'Mrs.' },
            { label: 'Dr.', value: 'Dr.' },
        ]
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
                                    name="UserType"
                                    value={this.state.UserType}
                                    onChange={this.onChange}
                                    error={this.state.Errors}
                                    info="What type of account are you using"
                                    options={accountTypes}
                                />
                                <SelectListGroup
                                    onChange={this.onChange}
                                    name="Prefix"
                                    value={this.state.Prefix}
                                    error={this.state.Errors}
                                    options={prefixes}
                                />
                                <TextFieldGroup
                                    onChange={this.onChange}
                                    value={this.state.FirstName}
                                    name="FirstName"
                                    error={this.state.Errors}
                                    info="* Update your first name"
                                />
                                <TextFieldGroup
                                    onChange={this.onChange}
                                    value={this.state.LastName}
                                    name="LastName"
                                    error={this.state.Errors}
                                    info="* Update your Last name"
                                />
                                <TextFieldGroup
                                    placeholder="Suffix"
                                    onChange={this.onChange}
                                    value={this.state.Suffix}
                                    name="Suffix"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Email"
                                    onChange={this.onChange}
                                    value={this.state.Email}
                                    name="Email"
                                    error={this.state.Errors}
                                    info="We will send a confirmation email to this address"
                                />
                                <TextFieldGroup
                                    type="password"
                                    placeholder="* Old Password"
                                    onChange={this.onChange}
                                    value={this.state.CurrentPassword}
                                    name="CurrentPassword"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    type="password"
                                    placeholder="New Password"
                                    onChange={this.onChange}
                                    value={this.state.NewPassword}
                                    name="NewPassword"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Social Security Number"
                                    onChange={this.onChange}
                                    value={this.state.Ssn}
                                    name="Ssn"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Phone Number"
                                    onChange={this.onChange}
                                    value={this.state.Phone}
                                    name="Phone"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Addresss"
                                    onChange={this.onChange}
                                    value={this.state.Address}
                                    name="Address"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Zipcode"
                                    onChange={this.onChange}
                                    value={this.state.Zipcode}
                                    name="Zipcode"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="City"
                                    onChange={this.onChange}
                                    value={this.state.City}
                                    name="City"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="State"
                                    onChange={this.onChange}
                                    value={this.state.State}
                                    name="State"
                                    error={this.state.Errors}
                                />
                                <TextFieldGroup
                                    placeholder="Country"
                                    onChange={this.onChange}
                                    value={this.state.Country}
                                    name="Country"
                                    error={this.state.Errors}
                                />
                                <input type="submit" tabIndex="4" className="form-control btn btn-login" value="Submit" />
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