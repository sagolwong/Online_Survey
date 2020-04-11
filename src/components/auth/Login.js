import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to request
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/requests");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            if (localStorage.surveyId) {
                this.props.history.push("/invite-to-group/" + localStorage.surveyId);
            } else {
                //this.props.history.push("/requests"); // push user to request when they login
                window.location = "/requests";
            }
        }
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
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        console.log(userData);
        this.props.loginUser(userData); 
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container">
                <div className="login-box">
                    <div className="login-box-body">
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <h4>
                                <b>เข้าสู่ระบบ</b>
                            </h4>
                            <p className="grey-text text-darken-1">
                                คุณยังไม่ได้เป็นสมาชิกใช่ไหม ? <Link to="/register">ลงทะเบียน</Link>
                            </p>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="form-group has-feedback">
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    error={errors.email}
                                    placeholder="อีเมล"
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", {
                                        invalid: errors.email || errors.emailnotfound
                                    })}
                                />
                                <span className="glyphicon glyphicon-envelope form-control-feedback" />
                                <span className="text-red">
                                    {errors.email}
                                    {errors.emailnotfound}
                                </span>
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
                                        invalid: errors.password || errors.passwordincorrect
                                    })}
                                />
                                <span className="glyphicon glyphicon-lock form-control-feedback" />
                                <span className="text-red">
                                    {errors.password}
                                    {errors.passwordincorrect}
                                </span>
                            </div>
                            <div className="row">
                                <div className="text-center">
                                    <button type="submit" className="btn btn-success btn-block ">เข้าสู่ระบบ</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);