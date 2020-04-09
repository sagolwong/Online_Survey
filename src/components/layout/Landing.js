import React, { Component } from 'react'
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {

    componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to request
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/requests");
        }
    }

    render() {
        return (
            <div style={{ height: "85vh" }}>
                <div style={{ marginLeft: "200px" }}>
                    <div className="row">
                        <div className="col s12 center-align">
                            <h4>
                                <b>Build</b> a login/auth app with the{" "}
                                <span style={{ fontFamily: "monospace" }}>MERN</span> stack from scratch
                        </h4>
                            <p className="flow-text grey-text text-darken-1">
                                Create a (minimal) full-stack app with user authentication via
                                passport and JWTs
                        </p>
                            <br />
                            <div className="col s6">
                                <Link
                                    to="/register"
                                    style={{
                                        width: "140px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px"
                                    }}
                                    className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    ลงทะเบียน
                            </Link>
                            </div>
                            <div className="col s6">
                                <Link
                                    to="/login"
                                    style={{
                                        width: "140px",
                                        borderRadius: "3px",
                                        letterSpacing: "1.5px"
                                    }}
                                    className="btn btn-large btn-flat waves-effect white black-text"
                                >
                                    เข้าสู่ระบบ
                            </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

Landing.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(Landing);