import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
    constructor() {
        super();
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/requests");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        console.log(newUser);
        this.props.registerUser(newUser, this.props.history);
    };
    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div className="register-box">
                    <div className="register-box-body">
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>ลงทะเบียน</b>
                            </h4>
                            <p className="grey-text text-darken-1">
                                คุณเป็นสมาชิกอยู่แล้วหรือไม่ ? <Link to="/login">เข้าสู่ระบบ</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.firstname}
                                    error={errors.firstname}
                                    placeholder="ชื่อ"
                                    id="firstname"
                                    type="text"
                                    className={classnames("form-control", {
                                        invalid: errors.firstname
                                    })}
                                />
                                <span className="glyphicon glyphicon-user form-control-feedback" />
                                <span className="text-red">{errors.firstname}</span>
                            </div>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.lastname}
                                    error={errors.lastname}
                                    placeholder="นามสกุล"
                                    id="lastname"
                                    type="text"
                                    className={classnames("form-control", {
                                        invalid: errors.lastname
                                    })}
                                />
                                <span className="glyphicon glyphicon-user form-control-feedback" />
                                <span className="text-red">{errors.lastname}</span>
                            </div>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    placeholder="อีเมล"
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email
                                    })}
                                />
                                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                                <span className="text-red">{errors.email}</span>
                            </div>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    error={errors.password}
                                    placeholder="รหัสผ่าน"
                                    id="password"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password
                                    })}
                                />
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                                <span className="text-red">{errors.password}</span>
                            </div>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password2}
                                    error={errors.password2}
                                    placeholder="ยืนยันรหัสผ่าน"
                                    id="password2"
                                    type="password"
                                    className={classnames("form-control", {
                                        invalid: errors.password2
                                    })}
                                />
                                <span className="glyphicon glyphicon-log-in form-control-feedback" />
                                <span className="text-red">{errors.password2}</span>
                            </div>
                            <div className="row">
                                <div className="text-center">
                                    <button type="submit" className="btn btn-success btn-block ">ลงทะเบียน</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));